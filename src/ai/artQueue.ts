import { WorldModule, SceneNode, SceneChoice } from '../types';
import { hasReadySceneArt, getSceneArtUrl } from '../services/sceneArtManifest';

export interface ArtGenerationJob {
  world: WorldModule;
  scene: SceneNode;
  choice?: SceneChoice;
  quality?: 'fast' | 'quality';
  aiArtEnabled?: boolean;
  onSuccess: (imageUrl: string, isStub?: boolean) => void;
  onError: () => void;
}

const DB_NAME = 'vaelen_scene_art_db';
const DB_VERSION = 1;
const STORE_NAME = 'scenes';

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
          req.onsuccess = () => resolve(req.result?.url || null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  async set(key: string, url: string): Promise<void> {
    try {
      const db = await this.getDB();
      if (!db) return;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ key, url, updatedAt: Date.now() });
    } catch {}
  }

  async delete(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      if (!db) return;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
    } catch {}
  }
}

const idb = new SceneArtIDB();
const memoryCache = new Map<string, string>();

// --- Circuit Breaker (5 min pause after 2 consecutive 429/503 errors, stored in sessionStorage) ---
const CIRCUIT_BREAKER_UNTIL_KEY = 'vaelen_circuit_breaker_until';
const CONSECUTIVE_ERRORS_KEY = 'vaelen_consecutive_errors';
const LAST_ERROR_REASON_KEY = 'vaelen_art_last_error';
const FAILED_KEYS_KEY = 'vaelen_art_failed_keys';

export function isCircuitBreakerActive(): boolean {
  try {
    const until = sessionStorage.getItem(CIRCUIT_BREAKER_UNTIL_KEY);
    if (!until) return false;
    const untilMs = Number(until);
    if (Date.now() < untilMs) {
      return true;
    }
    sessionStorage.removeItem(CIRCUIT_BREAKER_UNTIL_KEY);
    return false;
  } catch {
    return false;
  }
}

export function recordApiError(reasonOrStatus: number | string): void {
  try {
    const text = String(reasonOrStatus);
    const isQuotaOrServer =
      reasonOrStatus === 429 ||
      reasonOrStatus === 503 ||
      text.includes('429') ||
      text.includes('503') ||
      text.includes('quota') ||
      text.includes('RESOURCE_EXHAUSTED');

    if (isQuotaOrServer) {
      const count = Number(sessionStorage.getItem(CONSECUTIVE_ERRORS_KEY) || '0') + 1;
      sessionStorage.setItem(CONSECUTIVE_ERRORS_KEY, String(count));
      if (count >= 2) {
        const pauseUntil = Date.now() + 5 * 60 * 1000; // 5 min
        sessionStorage.setItem(CIRCUIT_BREAKER_UNTIL_KEY, String(pauseUntil));
        console.warn('[ArtQueue] Circuit Breaker: 2 ошибки подряд. Пауза ИИ-запросов на 5 минут.');
      }
    }
    setLastErrorReason(text || 'Ошибка API');
  } catch {}
}

export function recordApiSuccess(): void {
  try {
    sessionStorage.setItem(CONSECUTIVE_ERRORS_KEY, '0');
  } catch {}
}

export function resetCircuitBreaker(): void {
  try {
    sessionStorage.removeItem(CIRCUIT_BREAKER_UNTIL_KEY);
    sessionStorage.setItem(CONSECUTIVE_ERRORS_KEY, '0');
  } catch {}
}

export function getLastErrorReason(): string | null {
  try {
    return sessionStorage.getItem(LAST_ERROR_REASON_KEY);
  } catch {
    return null;
  }
}

export function setLastErrorReason(reason: string | null): void {
  try {
    if (reason) {
      sessionStorage.setItem(LAST_ERROR_REASON_KEY, reason);
    } else {
      sessionStorage.removeItem(LAST_ERROR_REASON_KEY);
    }
  } catch {}
}

// --- Failed Keys with 10 min cooldown in localStorage ---
interface FailedKeyEntry {
  timestamp: number;
  reason?: string;
}

function getFailedKeys(): Record<string, FailedKeyEntry> {
  try {
    const raw = localStorage.getItem(FAILED_KEYS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isKeyFailed(key: string): boolean {
  const map = getFailedKeys();
  const entry = map[key];
  if (!entry) return false;
  if (Date.now() - entry.timestamp < 10 * 60 * 1000) {
    return true;
  }
  return false;
}

export function markKeyFailed(key: string, reason = 'error'): void {
  try {
    const map = getFailedKeys();
    map[key] = { timestamp: Date.now(), reason };
    localStorage.setItem(FAILED_KEYS_KEY, JSON.stringify(map));
  } catch {}
}

export function clearFailedKeys(): void {
  try {
    localStorage.removeItem(FAILED_KEYS_KEY);
    resetCircuitBreaker();
    setLastErrorReason(null);
  } catch {}
}

export function buildActionPrompt(
  world: WorldModule,
  scene: SceneNode,
  choice?: SceneChoice
): string {
  const worldStyle = world.artStylePrompt;
  const actionFocus =
    choice?.actionFocusPrompt ||
    scene.actionFocus ||
    choice?.text ||
    scene.chapterTitle;

  const characters = `${world.protagonist.name} (${world.protagonist.visualDescriptor}), ${world.initialCompanion.name} (${world.initialCompanion.visualDescriptor})`;

  return `${worldStyle}. Focus on immediate cinematic action: ${actionFocus}. Present heroes: ${characters}. Location: ${scene.location}. High atmospheric clarity, dramatic lighting, no text, no borders.`;
}

class ArtQueueManager {
  private queue: ArtGenerationJob[] = [];
  private isProcessing = false;

  public getLastErrorReason(): string | null {
    return getLastErrorReason();
  }

  public clearFailedKeys(): void {
    clearFailedKeys();
  }

  public removeCachedImage(urlOrKey: string): void {
    for (const [k, v] of memoryCache.entries()) {
      if (v === urlOrKey || k === urlOrKey) {
        memoryCache.delete(k);
        idb.delete(k);
      }
    }
  }

  public requestSceneArt({
    world,
    scene,
    choice,
    aiArtEnabled = false,
    quality = 'fast',
    onSuccess,
    onError,
  }: {
    world: WorldModule;
    scene: SceneNode;
    choice?: SceneChoice;
    aiArtEnabled?: boolean;
    quality?: 'fast' | 'quality';
    onSuccess: (url: string, isStub?: boolean) => void;
    onError?: () => void;
  }): void {
    const sceneKey = `${world.id}_${scene.id}`;
    const fallbackImage = getSceneArtUrl(scene, world);

    // 0. If ready scene artwork exists in manifest: return immediately, no AI needed!
    if (hasReadySceneArt(scene.id)) {
      onSuccess(fallbackImage, false);
      return;
    }

    // 1. If AI art is turned off or circuit breaker active or key failed in last 10m:
    if (!aiArtEnabled || isCircuitBreakerActive() || isKeyFailed(sceneKey)) {
      onSuccess(fallbackImage, false);
      return;
    }

    // 2. Check memory cache
    if (memoryCache.has(sceneKey)) {
      onSuccess(memoryCache.get(sceneKey)!, false);
      return;
    }

    // 3. Check IndexedDB
    idb.get(sceneKey).then((cached) => {
      if (cached) {
        memoryCache.set(sceneKey, cached);
        onSuccess(cached, false);
        return;
      }

      // Show local image as immediate stub while generating
      onSuccess(fallbackImage, true);

      // Deduplicate already queued jobs for the same sceneKey
      const existingIdx = this.queue.findIndex(
        (q) => `${q.world.id}_${q.scene.id}` === sceneKey
      );
      const newJob: ArtGenerationJob = {
        world,
        scene,
        choice,
        quality,
        aiArtEnabled,
        onSuccess,
        onError: onError || (() => onSuccess(fallbackImage, false)),
      };

      if (existingIdx >= 0) {
        this.queue[existingIdx] = newJob;
      } else {
        this.queue.push(newJob);
      }

      this.processQueue();
    });
  }

  public requestArt(job: {
    world: WorldModule;
    scene: SceneNode;
    choice?: SceneChoice;
    onSuccess: (imageUrl: string) => void;
    onError: () => void;
  }): void {
    this.requestSceneArt({
      world: job.world,
      scene: job.scene,
      choice: job.choice,
      aiArtEnabled: true,
      onSuccess: (url) => job.onSuccess(url),
      onError: job.onError,
    });
  }

  public invalidateAndRetry(
    world: WorldModule,
    scene: SceneNode,
    quality: 'fast' | 'quality',
    onSuccess: (url: string, isStub?: boolean) => void
  ): void {
    clearFailedKeys();
    resetCircuitBreaker();
    setLastErrorReason(null);
    this.requestSceneArt({
      world,
      scene,
      aiArtEnabled: true,
      quality,
      onSuccess,
    });
  }

  public async generateSingleSceneForDev(
    world: WorldModule,
    scene: SceneNode,
    quality: 'fast' | 'quality' = 'fast'
  ): Promise<string | null> {
    return this.executeGeneration({
      world,
      scene,
      quality,
      aiArtEnabled: true,
      onSuccess: () => {},
      onError: () => {},
    });
  }

  public async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    if (isCircuitBreakerActive()) {
      // Clear remaining queue since circuit breaker is active
      while (this.queue.length > 0) {
        const item = this.queue.shift();
        if (item) {
          item.onSuccess(getSceneArtUrl(item.scene, item.world), false);
        }
      }
      return;
    }

    this.isProcessing = true;
    const job = this.queue.shift()!;
    const sceneKey = `${job.world.id}_${job.scene.id}`;
    const fallbackUrl = getSceneArtUrl(job.scene, job.world);

    try {
      const generatedUrl = await this.executeGeneration(job);
      if (generatedUrl) {
        recordApiSuccess();
        memoryCache.set(sceneKey, generatedUrl);
        await idb.set(sceneKey, generatedUrl);
        job.onSuccess(generatedUrl, false);
      } else {
        job.onSuccess(fallbackUrl, false);
      }
    } catch (err: any) {
      const reason = err?.message || 'generation_error';
      recordApiError(reason);
      markKeyFailed(sceneKey, reason);
      job.onError();
    } finally {
      setTimeout(() => {
        this.isProcessing = false;
        this.processQueue();
      }, 2500);
    }
  }

  public processNext(): void {
    this.processQueue();
  }

  public async executeGeneration(job: ArtGenerationJob): Promise<string | null> {
    if (isCircuitBreakerActive()) {
      return null;
    }

    const sceneKey = `${job.world.id}_${job.scene.id}`;
    const frameDescription =
      job.scene.visualPrompt ||
      `Atmospheric environment of ${job.scene.location}, authentic to ${job.world.artStylePrompt.slice(0, 60)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch('/api/scene-art/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artStylePrompt: job.world.artStylePrompt,
          sceneVisualDescription: frameDescription,
          playerAction:
            job.choice?.actionFocusPrompt ||
            job.choice?.text ||
            job.scene.actionFocus ||
            '',
          location: job.scene.location,
          chapterTitle: job.scene.chapterTitle,
          worldCoverImage: job.world.coverImage,
          presentCharacters: [job.world.protagonist, job.world.initialCompanion],
          language: 'ru',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 429 || res.status === 503) {
        recordApiError(res.status);
        markKeyFailed(sceneKey, `HTTP ${res.status}`);
        return null;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.reason === 'quota' || data.isQuotaFallback === true) {
          recordApiError('quota');
          markKeyFailed(sceneKey, 'quota');
          return null;
        }

        const finalUrl = data.imageUrl;
        if (
          finalUrl &&
          typeof finalUrl === 'string' &&
          !finalUrl.startsWith('/api/scene-image/')
        ) {
          return finalUrl;
        }
        return null;
      } else {
        recordApiError(res.status);
        markKeyFailed(sceneKey, `HTTP ${res.status}`);
        return null;
      }
    } catch (e: any) {
      clearTimeout(timeout);
      recordApiError(e?.message || 'fetch_failed');
      markKeyFailed(sceneKey, 'network_timeout');
      return null;
    }
  }

  // Preload disabled to protect API quota
  public preloadNextScenes(
    _world: WorldModule,
    _currentScene: SceneNode,
    _aiArtEnabled = false,
    _quality: 'fast' | 'quality' = 'fast'
  ): void {
    // No-op
    return;
  }
}

export const artQueue = new ArtQueueManager();
