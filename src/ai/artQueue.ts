import { WorldModule, SceneNode, SceneChoice } from '../types';

// ==========================================
// IndexedDB STORAGE FOR GENERATED SCENE FRAMES
// ==========================================

const DB_NAME = 'vaelen_scene_art_db';
const DB_VERSION = 1;
const STORE_NAME = 'scene_frames';
const CLIENT_TIMEOUT_MS = 60000; // 60 seconds

class SceneArtIDB {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private getDB(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const req = indexedDB.open(DB_NAME, DB_VERSION);
          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    }
    return this.dbPromise;
  }

  async get(key: string): Promise<string | null> {
    try {
      const db = await this.getDB();
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result?.imageUrl || null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  async set(key: string, imageUrl: string, extra?: Record<string, any>): Promise<void> {
    try {
      const db = await this.getDB();
      if (!db) return;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put({ key, imageUrl, timestamp: Date.now(), ...(extra || {}) });
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {}
  }
}

// ==========================================
// CHARACTER VISUAL DESCRIPTOR RESOLVER
// ==========================================

export function resolveSpeakerVisual(
  world: WorldModule,
  speaker?: { name: string; emotion?: string; avatarUrl?: string }
): { name: string; visualDescriptor: string } | null {
  if (!speaker?.name) return null;
  const name = speaker.name.trim();

  // 1. Check protagonist
  if (
    world.protagonist.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(world.protagonist.name.toLowerCase())
  ) {
    return {
      name: world.protagonist.name,
      visualDescriptor: world.protagonist.visualDescriptor,
    };
  }

  // 2. Check companion
  if (
    world.initialCompanion.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(world.initialCompanion.name.toLowerCase())
  ) {
    return {
      name: world.initialCompanion.name,
      visualDescriptor: world.initialCompanion.visualDescriptor,
    };
  }

  // 3. Known campaign NPC visual bible
  const npcMap: Record<string, string> = {
    'Привратник Ойвин':
      'ancient stooped monk keeper with massive iron keys on a chain, weathered grey cowl',
    'Мара':
      'young anxious salt-diver girl with leather diving goggles pushed onto forehead, brine-soaked vest',
    'Соляной Ростовщик':
      'shrewd elderly moneylender in velvet and tarnished silver scales, inspecting brine tokens',
    'Мать Изольда':
      'austere high priestess in ceremonial coral vestments with tidal silk veil',
    'Полый Страж':
      'towering rusted plate armor encrusted with barnacles and drowned kelp, eerie hollow visor',
    'Прима Мелиор Ксайн':
      'haughty imperial inquisitor in obsidian cuirass and embroidered dark velvet mantle',
    'Король Ауреан III':
      'tragic spectral drowned monarch in crumbling coral crown and decaying golden royal shroud',
    'Матушка Лотос':
      'wise elderly tea-master in embroidered cloud-silk robes with steaming jade teapot',
    'Адмирал Вор':
      'stern veteran sky admiral in ornate gold-braided brass-buttoned navy uniform',
    'Фаэль Хутто':
      'eccentric goblin-like sky merchant in patchwork leather jacket and magnifying spectacles',
    'Вивьен': world.initialCompanion.visualDescriptor,
    'Вивьен Кроу': world.initialCompanion.visualDescriptor,
    'Лира': world.protagonist.visualDescriptor,
    'Орион': world.initialCompanion.visualDescriptor,
    'Кейлен': world.protagonist.visualDescriptor,
    'Сера': world.initialCompanion.visualDescriptor,
    'Джулиан': world.protagonist.visualDescriptor,
  };

  const desc = npcMap[name] || `distinctive local character named ${name} in world-appropriate attire`;
  return { name, visualDescriptor: desc };
}

// ==========================================
// ART QUEUE MANAGER
// ==========================================

export interface ArtGenerationJob {
  world: WorldModule;
  scene: SceneNode;
  choice?: SceneChoice;
  aiArtEnabled?: boolean;
  quality?: 'fast' | 'better';
  forceRefresh?: boolean;
  onSuccess: (imageUrl: string, isStub: boolean) => void;
  onError?: (reason?: string) => void;
  isPreload?: boolean;
}

interface InternalTask {
  job: ArtGenerationJob;
  cacheKey: string;
}

function formatErrorReasonRu(status?: number, rawMsg?: string): string {
  const msg = String(rawMsg || '').toLowerCase();
  if (status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
    return 'Квота моделей генерации исчерпана (429 Resource Exhausted)';
  }
  if (status === 503 || msg.includes('503') || msg.includes('unavailable')) {
    return 'Сервис Gemini временно недоступен (503 Service Unavailable)';
  }
  if (status === 400 || msg.includes('invalid') || msg.includes('api_key')) {
    return 'Некорректный запрос или отсутствует ключ API';
  }
  if (msg.includes('abort') || msg.includes('timeout')) {
    return 'Таймаут ожидания ответа модели (60 с)';
  }
  return rawMsg ? `Ошибка API (${status || 'сеть'}): ${rawMsg.slice(0, 80)}` : 'Сбой связи с сервером генерации';
}

class ArtQueueManager {
  private idb = new SceneArtIDB();
  private memoryCache = new Map<string, string>();
  private activeJobs = new Map<string, ArtGenerationJob>();
  private pendingQueue: InternalTask[] = [];
  private isProcessing = false;
  private preloadActiveCount = 0;
  private failedKeys = new Set<string>();
  private lastError: string | null = null;

  public getLastError(): string | null {
    return this.lastError;
  }

  public resetFailedKeys(): void {
    this.failedKeys.clear();
    this.lastError = null;
  }

  public getCachedUrl(worldId: string, sceneId: string): string | null {
    const key = `${worldId}_${sceneId}`;
    return this.memoryCache.get(key) || null;
  }

  /**
   * Request background illustration for a scene.
   * If cached (memory, IDB, disk), immediately returns the final image.
   * If not cached, instantly provides localImage or coverImage as a stub,
   * then generates in background and calls onSuccess when ready.
   */
  public requestSceneArt(job: ArtGenerationJob): void {
    const { world, scene, aiArtEnabled = true, forceRefresh = false } = job;
    const stubUrl = scene.localImage || world.coverImage;

    // If user disabled AI illustrations in settings, always use stub immediately
    if (!aiArtEnabled) {
      job.onSuccess(stubUrl, false);
      return;
    }

    const cacheKey = `${world.id}_${scene.id}`;

    if (forceRefresh) {
      this.failedKeys.delete(cacheKey);
      this.memoryCache.delete(cacheKey);
      this.activeJobs.delete(cacheKey);
      job.onSuccess(stubUrl, true);
      this.activeJobs.set(cacheKey, job);
      this.pendingQueue.unshift({ job, cacheKey });
      this.processQueue();
      return;
    }

    // 1. In-memory cache hit: instant
    if (this.memoryCache.has(cacheKey)) {
      job.onSuccess(this.memoryCache.get(cacheKey)!, false);
      return;
    }

    // 2. Check IndexedDB in browser
    this.idb.get(cacheKey).then(async (idbUrl) => {
      if (idbUrl) {
        this.memoryCache.set(cacheKey, idbUrl);
        job.onSuccess(idbUrl, false);
        return;
      }

      // 3. Check server disk cache
      try {
        const checkRes = await fetch(`/api/scene-art/check-cache/${world.id}/${scene.id}`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (checkData.cached && checkData.imageUrl) {
            this.memoryCache.set(cacheKey, checkData.imageUrl);
            this.idb.set(cacheKey, checkData.imageUrl);
            job.onSuccess(checkData.imageUrl, false);
            return;
          }
        }
      } catch {}

      // 4. Not cached: IMMEDIATELY show stub, then enqueue generation in background
      job.onSuccess(stubUrl, true);

      // Avoid queuing duplicate generation for the same scene
      if (this.activeJobs.has(cacheKey) || this.failedKeys.has(cacheKey)) {
        return;
      }

      this.activeJobs.set(cacheKey, job);
      // Prioritize current scene at front of pending queue
      this.pendingQueue.unshift({ job, cacheKey });
      this.processQueue();
    });
  }

  // Preload scenes connected to current choices (up to 2 concurrent preload requests)
  public preloadNextScenes(
    world: WorldModule,
    currentScene: SceneNode,
    aiArtEnabled: boolean = true,
    quality: 'fast' | 'better' = 'fast'
  ): void {
    if (!aiArtEnabled || !currentScene.choices || currentScene.choices.length === 0) return;

    for (const choice of currentScene.choices) {
      const nextScene = world.scenes[choice.targetSceneId];
      if (!nextScene) continue;

      const cacheKey = `${world.id}_${nextScene.id}`;
      if (this.memoryCache.has(cacheKey) || this.activeJobs.has(cacheKey) || this.failedKeys.has(cacheKey)) {
        continue;
      }

      // Check IDB before scheduling preload
      this.idb.get(cacheKey).then((cached) => {
        if (cached) {
          this.memoryCache.set(cacheKey, cached);
          return;
        }

        if (this.preloadActiveCount >= 2) return;

        const preloadJob: ArtGenerationJob = {
          world,
          scene: nextScene,
          choice,
          aiArtEnabled: true,
          quality,
          isPreload: true,
          onSuccess: (url) => {
            this.memoryCache.set(cacheKey, url);
          },
          onError: () => {},
        };

        this.activeJobs.set(cacheKey, preloadJob);
        this.pendingQueue.push({ job: preloadJob, cacheKey });
        this.processQueue();
      });
    }
  }

  // Serial queue: exactly one generation API call at a time to prevent rate-limiting
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.pendingQueue.length === 0) return;

    this.isProcessing = true;
    const task = this.pendingQueue.shift()!;
    const { job, cacheKey } = task;

    if (job.isPreload) {
      this.preloadActiveCount++;
    }

    try {
      const generatedUrl = await this.executeGeneration(job, cacheKey);
      if (generatedUrl) {
        this.memoryCache.set(cacheKey, generatedUrl);
        await this.idb.set(cacheKey, generatedUrl, {
          sceneTitle: job.scene.chapterTitle || job.scene.location,
          worldId: job.world.id,
        });
        job.onSuccess(generatedUrl, false);
      } else {
        const reason = this.lastError || 'Не удалось сгенерировать кадр';
        job.onError?.(reason);
      }
    } catch (err: any) {
      this.failedKeys.add(cacheKey);
      const reason = err?.message || this.lastError || 'Не удалось сгенерировать кадр';
      job.onError?.(reason);
    } finally {
      this.activeJobs.delete(cacheKey);
      if (job.isPreload) {
        this.preloadActiveCount = Math.max(0, this.preloadActiveCount - 1);
      }
      this.isProcessing = false;
      // Continue next in queue
      this.processQueue();
    }
  }

  // Executes Step 1 (describe) + Step 2 (generate) with 60s timeout and 1 retry on 503/429
  private async executeGeneration(job: ArtGenerationJob, cacheKey: string): Promise<string | null> {
    const { world, scene, quality = 'fast' } = job;

    // STEP 1: Describe frame from scene narrative
    let frameDescription = '';
    try {
      const descController = new AbortController();
      const descTimer = setTimeout(() => descController.abort(), 20000);

      const descRes = await fetch('/api/scene-art/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worldId: world.id,
          sceneId: scene.id,
          location: scene.location,
          narrative: scene.narrative || [],
          artStylePrompt: world.artStylePrompt,
        }),
        signal: descController.signal,
      });
      clearTimeout(descTimer);

      if (descRes.ok) {
        const descData = await descRes.json();
        frameDescription = descData.visualDescription || '';
      } else {
        const errJson = await descRes.json().catch(() => ({}));
        const reason = errJson.error || `HTTP ${descRes.status}`;
        console.warn(`[SceneArt] ${scene.id}, describe, ${reason}`);
      }
    } catch (descErr: any) {
      console.warn(`[SceneArt] ${scene.id}, describe, ${descErr?.message || 'timeout/network error'}`);
    }

    // Если этап describe упал, всё равно запускаем generate, подставив вместо описания visualPrompt сцены плюс её location
    if (!frameDescription) {
      frameDescription = scene.visualPrompt
        ? `${scene.visualPrompt}, ${scene.location || ''}`
        : `${scene.location || 'cinematic environment'}, authentic to ${world.artStylePrompt.slice(0, 60)}`;
    }

    // Resolve speaker visual descriptor if activeSpeaker is present
    const speakerVisual = resolveSpeakerVisual(world, scene.activeSpeaker);

    // STEP 2: Generate illustration with 60s client timeout & 1 retry on 503/429
    let attempt = 0;
    let lastStatus: number | undefined;
    let lastErrSnippet = '';

    while (attempt < 2) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

        const res = await fetch('/api/scene-art/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            worldId: world.id,
            sceneId: scene.id,
            artStylePrompt: world.artStylePrompt,
            frameDescription,
            activeSpeaker: speakerVisual,
            worldCoverImage: world.coverImage,
            quality,
            imageSize: quality === 'better' ? '2K' : '1K',
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            return data.imageUrl;
          }
        }

        lastStatus = res.status;
        const errData = await res.json().catch(() => ({}));
        lastErrSnippet = errData.error || `HTTP ${res.status}`;

        // Check if temporary 503/429 status code
        if ((res.status === 503 || res.status === 429) && attempt === 1) {
          console.warn(`[SceneArt] ${scene.id}, generate, retry 1 on ${res.status}`);
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }

        break;
      } catch (e: any) {
        lastErrSnippet = e?.message || 'network error';
        if (attempt === 1) {
          console.warn(`[SceneArt] ${scene.id}, generate, retry 1 on error`);
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }
        break;
      }
    }

    const reasonRu = formatErrorReasonRu(lastStatus, lastErrSnippet);
    console.warn(`[SceneArt] ${scene.id}, generate, ${reasonRu}`);
    this.lastError = reasonRu;
    throw new Error(reasonRu);
  }

  // Developer single scene generation (for batch generator in settings)
  public async generateSingleSceneForDev(
    world: WorldModule,
    scene: SceneNode,
    quality: 'fast' | 'better' = 'fast'
  ): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    const cacheKey = `${world.id}_${scene.id}`;
    try {
      const url = await this.executeGeneration(
        {
          world,
          scene,
          quality,
          onSuccess: () => {},
        },
        cacheKey
      );
      if (url) {
        this.memoryCache.set(cacheKey, url);
        await this.idb.set(cacheKey, url, {
          sceneTitle: scene.chapterTitle || scene.location,
          worldId: world.id,
        });
        return { success: true, imageUrl: url };
      }
      return { success: false, error: this.lastError || 'Не удалось получить кадр' };
    } catch (err: any) {
      return { success: false, error: err?.message || this.lastError || 'Ошибка генерации' };
    }
  }

  // Backward compatibility alias for older calls
  public requestArt(job: any): void {
    this.requestSceneArt({
      world: job.world,
      scene: job.scene,
      choice: job.choice,
      aiArtEnabled: true,
      onSuccess: (url) => job.onSuccess(url),
      onError: (reason) => job.onError?.(reason),
    });
  }
}

export const artQueue = new ArtQueueManager();
