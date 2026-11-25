import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Square,
  CheckCircle2,
  XCircle,
  RotateCw,
  Loader2,
  Clock,
  Layers,
  Copy,
  Check,
  Upload,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { WorldModule, SceneNode } from '../types';
import { WORLDS } from '../worlds';
import {
  hasReadySceneArt,
  getReadySceneIds,
  getSceneArtVersion,
  markSceneArtReady,
  loadSceneArtManifest,
  subscribeToSceneArtManifest,
} from '../services/sceneArtManifest';
import { SCENE_IMAGE_PROMPTS } from '../data/sceneImagePrompts';

interface DevSceneStudioProps {
  currentWorld: WorldModule;
}

const CHARACTER_TRIGGER_REGEX =
  /\b(knight|inquisitor|archivist|detective|captain|figure|silhouette|woman|man)\b/i;

function cleanDescriptorWithoutHeldItems(descriptor: string, visualPrompt: string): string {
  const vpMentionsHeld = /\b(holding|gripping|wielding|carrying|armed with)\b/i.test(visualPrompt);
  if (!vpMentionsHeld) {
    return descriptor
      .replace(/,\s*(gripping|holding|wielding|carrying|armed with)\s+[^,.]+/gi, '')
      .replace(/\s*(gripping|holding|wielding|carrying|armed with)\s+[^,.]+/gi, '')
      .trim();
  }
  return descriptor.trim();
}

export function buildDevScenePrompt(world: WorldModule, scene: SceneNode): string {
  if (scene?.id && SCENE_IMAGE_PROMPTS[scene.id]) {
    return SCENE_IMAGE_PROMPTS[scene.id];
  }

  const hasChar = Boolean(
    scene.activeSpeaker || CHARACTER_TRIGGER_REGEX.test(scene.visualPrompt || '')
  );

  let charInfo = '';
  if (hasChar) {
    const chars = [world.protagonist, world.initialCompanion].filter(Boolean);
    if (chars.length > 0) {
      charInfo =
        chars
          .map((c) => {
            const cleanDesc = cleanDescriptorWithoutHeldItems(
              c.visualDescriptor || '',
              scene.visualPrompt || ''
            );
            return `${c.name}: ${cleanDesc}`;
          })
          .filter(Boolean)
          .join('. ') + '. ';
    }
  }

  const vp = scene.visualPrompt || '';
  const loc = scene.location ? `Location: ${scene.location}. ` : '';
  return `${world.artStylePrompt}. ${charInfo}${vp}. ${loc}Wide cinematic 16:9 composition, no text, no watermark, no UI frames.`.trim();
}

export const DevSceneStudio: React.FC<DevSceneStudioProps> = ({ currentWorld }) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>(currentWorld.id);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [maxBatchLimit, setMaxBatchLimit] = useState<number>(20);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentProcessingId, setCurrentProcessingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [readySet, setReadySet] = useState<Set<string>>(getReadySceneIds());
  const [copiedSceneId, setCopiedSceneId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelRequestedRef = useRef<boolean>(false);

  const activeWorld = WORLDS[selectedWorldId] || currentWorld;
  const scenesList = Object.values(activeWorld.scenes);

  // Subscribe to manifest updates
  useEffect(() => {
    loadSceneArtManifest().then(() => setReadySet(getReadySceneIds()));
    const unsubscribe = subscribeToSceneArtManifest(() => {
      setReadySet(getReadySceneIds());
    });
    return unsubscribe;
  }, []);

  const all105Scenes = Object.values(WORLDS).flatMap((w) => Object.keys(w.scenes));
  const totalReadyAcrossAllWorlds = all105Scenes.filter((id) => readySet.has(id)).length;
  const readyInCurrentWorld = scenesList.filter((s) => readySet.has(s.id)).length;

  const waitWithCountdown = async (seconds: number, label: string): Promise<boolean> => {
    for (let i = seconds; i > 0; i--) {
      if (cancelRequestedRef.current) return false;
      setCountdown(i);
      setStatusMessage(`${label}: ${i} сек...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);
    return !cancelRequestedRef.current;
  };

  const generateSceneArt = async (
    world: WorldModule,
    scene: SceneNode
  ): Promise<{
    status: 'ok' | 'quota' | 'auth_error' | 'error';
    errorMessage?: string;
    version?: number;
  }> => {
    const prompt = buildDevScenePrompt(world, scene);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/dev/scene-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worldId: world.id,
          sceneId: scene.id,
          prompt,
          worldCoverImage: world.coverImage,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.status === 401 || res.status === 403) {
        return { status: 'auth_error', errorMessage: 'Нет рабочего ключа Gemini' };
      }

      if (res.status === 429) {
        return { status: 'quota', errorMessage: 'Превышена квота запросов (429)' };
      }

      const data = await res.json().catch(() => ({}));

      if (data.error === 'AUTH_ERROR' || data.reason === 'no_api_key' || data.reason === 'auth_failed') {
        return { status: 'auth_error', errorMessage: 'Нет рабочего ключа Gemini' };
      }

      if (!res.ok) {
        if (data.reason === 'quota' || data.error === 'RESOURCE_EXHAUSTED') {
          return { status: 'quota', errorMessage: 'Превышена квота запросов Gemini' };
        }
        return {
          status: 'error',
          errorMessage: data.message || `Ошибка сервера (HTTP ${res.status})`,
        };
      }

      if (data.success) {
        markSceneArtReady(scene.id, data.version);
        setReadySet(getReadySceneIds());
        return { status: 'ok', version: data.version };
      }

      return {
        status: 'error',
        errorMessage: data.message || 'Сервер не вернул статус успеха',
      };
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        return { status: 'error', errorMessage: 'Таймаут запроса (60 сек)' };
      }
      return { status: 'error', errorMessage: err?.message || 'Сетевой сбой при обращении к серверу' };
    }
  };

  const runBatch = async (scenesToProcess: SceneNode[]) => {
    if (scenesToProcess.length === 0) {
      setStatusMessage('Нет сцен для обработки.');
      return;
    }

    setIsRunning(true);
    cancelRequestedRef.current = false;
    let completedCount = 0;
    let consecutiveErrors = 0;
    let lastGeneralErrorMessage = '';

    setStatusMessage(`Запуск очереди: ${scenesToProcess.length} сцен (лимит запуска: ${maxBatchLimit})...`);

    for (let idx = 0; idx < scenesToProcess.length; idx++) {
      if (cancelRequestedRef.current) {
        setStatusMessage('Остановлено разработчиком.');
        break;
      }

      if (completedCount >= maxBatchLimit) {
        setStatusMessage(`Достигнут лимит запуска (${maxBatchLimit} кадров). Прогон завершён.`);
        break;
      }

      const scene = scenesToProcess[idx];
      setCurrentProcessingId(scene.id);
      setStatusMessage(`[${idx + 1}/${scenesToProcess.length}] Генерация кадра: ${scene.id}...`);

      let attempt = 0;
      let sceneSucceeded = false;
      let sceneEncounteredError = false;

      while (attempt <= 2) {
        if (cancelRequestedRef.current) break;

        const result = await generateSceneArt(activeWorld, scene);

        if (result.status === 'auth_error') {
          setStatusMessage('Нет рабочего ключа Gemini');
          setIsRunning(false);
          setCurrentProcessingId(null);
          setCountdown(null);
          return;
        }

        if (result.status === 'ok') {
          sceneSucceeded = true;
          consecutiveErrors = 0;
          completedCount++;
          setStatusMessage(`Кадр ${scene.id} готов! (${completedCount}/${maxBatchLimit})`);
          break;
        }

        if (result.status === 'quota') {
          attempt++;
          if (attempt <= 2) {
            setStatusMessage(`Квота 429. Ожидание 65 секунд перед повтором (попытка ${attempt} из 2)...`);
            const ok = await waitWithCountdown(65, `Ожидание квоты (попытка ${attempt}/2)`);
            if (!ok) break;
          } else {
            setStatusMessage('Лимит исчерпан, продолжи позже.');
            setIsRunning(false);
            setCurrentProcessingId(null);
            setCountdown(null);
            return;
          }
        } else {
          // General non-quota error
          sceneEncounteredError = true;
          consecutiveErrors++;
          lastGeneralErrorMessage = result.errorMessage || 'Неизвестная ошибка генерации';
          setStatusMessage(`Ошибка сцены ${scene.id}: ${lastGeneralErrorMessage}`);
          break;
        }
      }

      if (cancelRequestedRef.current) {
        setStatusMessage('Остановлено разработчиком.');
        break;
      }

      // Check if 3 consecutive scenes failed with general error
      if (sceneEncounteredError && consecutiveErrors >= 3) {
        setStatusMessage(`Остановлено: 3 ошибки подряд. Причина: ${lastGeneralErrorMessage}`);
        setIsRunning(false);
        setCurrentProcessingId(null);
        setCountdown(null);
        return;
      }

      // 12-second pause after ANY attempt (successful or unsuccessful) before proceeding to next scene
      const hasMoreScenes = idx < scenesToProcess.length - 1 && completedCount < maxBatchLimit;
      if (hasMoreScenes) {
        const pauseLabel = sceneSucceeded ? 'Пауза между сценами' : 'Пауза после ошибки перед следующей сценой';
        const canContinue = await waitWithCountdown(12, pauseLabel);
        if (!canContinue) break;
      }
    }

    setIsRunning(false);
    setCurrentProcessingId(null);
    setCountdown(null);
  };

  const handleDrawMissing = () => {
    const missing = scenesList.filter((s) => !readySet.has(s.id));
    if (missing.length === 0) {
      setStatusMessage(`Все сцены мира «${activeWorld.title}» уже имеют готовые кадры!`);
      return;
    }
    runBatch(missing);
  };

  const handleRedrawSelected = () => {
    if (!selectedSceneId) {
      setStatusMessage('Выберите сцену из списка для перерисовки.');
      return;
    }
    const scene = activeWorld.scenes[selectedSceneId];
    if (!scene) return;
    runBatch([scene]);
  };

  const handleStop = () => {
    cancelRequestedRef.current = true;
    setStatusMessage('Запрос на остановку... Завершаем текущую операцию.');
  };

  const handleCopyPrompt = (scene: SceneNode) => {
    const prompt = buildDevScenePrompt(activeWorld, scene);
    navigator.clipboard.writeText(prompt);
    setCopiedSceneId(scene.id);
    setTimeout(() => setCopiedSceneId(null), 2500);
  };

  const handleDownloadAllPrompts = () => {
    const lines: string[] = [
      `# Промты кадров мира: ${activeWorld.title} (${activeWorld.id})`,
      `Всего сцен: ${scenesList.length}`,
      '',
    ];

    scenesList.forEach((scene) => {
      const prompt = buildDevScenePrompt(activeWorld, scene);
      lines.push(`### ${scene.id}`);
      lines.push(`файл public/scenes/${scene.id}.webp`);
      lines.push(prompt);
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts-${activeWorld.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleManualUploadClick = () => {
    if (!selectedSceneId) {
      setStatusMessage('Выберите сцену из списка перед загрузкой кадра.');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSceneId) return;

    setIsUploading(true);
    setStatusMessage(`Обработка и загрузка файла «${file.name}» для сцены ${selectedSceneId}...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/dev/scene-art/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              worldId: activeWorld.id,
              sceneId: selectedSceneId,
              fileBase64: base64,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            setStatusMessage(`Ошибка загрузки: ${errData.message || res.statusText}`);
            setIsUploading(false);
            return;
          }

          const data = await res.json();
          if (data.success) {
            markSceneArtReady(selectedSceneId, data.version);
            setReadySet(getReadySceneIds());
            setStatusMessage(`Кадр для сцены ${selectedSceneId} успешно конвертирован в WebP и сохранён!`);
          } else {
            setStatusMessage('Не удалось сохранить файл на сервере.');
          }
        } catch (err: any) {
          setStatusMessage(`Ошибка отправки файла: ${err?.message || err}`);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        setStatusMessage('Не удалось прочитать выбранный файл.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setStatusMessage(`Ошибка: ${err?.message || err}`);
      setIsUploading(false);
    }
  };

  const handleDownloadZip = () => {
    window.location.href = '/api/dev/scenes-zip';
  };

  const selectedScene = selectedSceneId ? activeWorld.scenes[selectedSceneId] : null;

  return (
    <div className="border border-[#8A6B3A]/60 rounded-xs p-4 bg-[#0B0A0D] text-[#EFE6CF] font-prose space-y-4 shadow-2xl relative overflow-hidden">
      {/* Hidden file input for manual uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Decorative filigree accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C9A55C]/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C9A55C]/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#C9A55C]/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C9A55C]/40 pointer-events-none" />

      {/* Header & Global Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#8A6B3A]/30 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#18151D] border border-[#8A6B3A]/60 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-[#C9A55C]" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-bold text-[#EFE6CF] tracking-wide">
              Студия кадров летописи
            </h4>
            <div className="text-[11px] text-[#A89F91]">
              Генерация, версионирование и сохранение иллюстраций
            </div>
          </div>
        </div>

        <div className="text-xs font-heading bg-[#141119] px-3 py-1.5 rounded-xs border border-[#8A6B3A]/50 flex items-center gap-2 shadow-inner">
          <span className="text-[#A89F91]">Всего готово:</span>
          <span className="text-[#C9A55C] font-bold text-sm tracking-wider">
            {totalReadyAcrossAllWorlds} из 105
          </span>
        </div>
      </div>

      {/* World Selection Tabs */}
      <div className="flex items-center gap-2 bg-[#121016] p-1.5 rounded-xs border border-[#8A6B3A]/30">
        {Object.values(WORLDS).map((w) => {
          const wTotal = Object.keys(w.scenes).length;
          const wReady = Object.keys(w.scenes).filter((id) => readySet.has(id)).length;
          const isSel = w.id === selectedWorldId;

          return (
            <button
              key={w.id}
              type="button"
              disabled={isRunning || isUploading}
              onClick={() => {
                setSelectedWorldId(w.id);
                setSelectedSceneId(null);
              }}
              className={`flex-1 py-1.5 px-2 rounded-xs transition cursor-pointer text-center ${
                isSel
                  ? 'bg-gradient-to-b from-[#2A2216] to-[#18130D] text-[#EFE6CF] border border-[#C9A55C] shadow font-heading font-bold'
                  : 'text-[#A89F91] hover:text-[#EFE6CF] hover:bg-[#1A1622] font-heading border border-transparent'
              }`}
            >
              <div className="text-xs">{w.title.split(' ')[0]}</div>
              <div className="text-[10px] text-[#C9A55C]/90">
                {wReady}/{wTotal} кадров
              </div>
            </button>
          );
        })}
      </div>

      {/* Settings Bar: Count in current world, Batch limit, and Export Prompts */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#131118] p-2.5 rounded-xs border border-[#8A6B3A]/25">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#C9A55C]" />
          <span className="text-[#A89F91] font-heading">В мире «{activeWorld.title.split(' ')[0]}»:</span>
          <span className="text-[#C9A55C] font-heading font-bold">
            {readyInCurrentWorld} из {scenesList.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#A89F91] text-[11px] font-heading">Лимит за запуск:</span>
            <input
              type="number"
              min={1}
              max={105}
              disabled={isRunning}
              value={maxBatchLimit}
              onChange={(e) => setMaxBatchLimit(Math.max(1, Math.min(105, Number(e.target.value) || 20)))}
              className="w-14 px-2 py-0.5 bg-[#0B0A0D] border border-[#8A6B3A]/50 rounded-xs text-center text-[#C9A55C] font-mono font-bold text-xs focus:outline-none focus:border-[#C9A55C]"
            />
          </div>

          <button
            type="button"
            onClick={handleDownloadAllPrompts}
            className="px-2.5 py-1 rounded-xs bg-[#1A1622] hover:bg-[#251F30] border border-[#8A6B3A]/50 text-[#C9A55C] text-[11px] font-heading transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Скачать все промты выбранного мира в файл .md"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Скачать все промты (.md)</span>
          </button>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          disabled={isRunning || isUploading || readyInCurrentWorld === scenesList.length}
          onClick={handleDrawMissing}
          className="py-2 px-3 rounded-xs bg-gradient-to-b from-[#2A2216] to-[#18130D] hover:from-[#352B1C] hover:to-[#221A12] border border-[#8A6B3A] text-[#EFE6CF] text-xs font-heading font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A55C]" />
          <span>Нарисовать недостающие</span>
        </button>

        <button
          type="button"
          disabled={isRunning || isUploading || !selectedSceneId}
          onClick={handleRedrawSelected}
          className="py-2 px-3 rounded-xs bg-gradient-to-b from-[#1C1F2B] to-[#10121C] hover:from-[#252A3B] hover:to-[#171B28] border border-[#526385] text-[#DCE6F8] text-xs font-heading font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#7CA0DF]" />
          <span>Перерисовать выбранную</span>
        </button>

        <button
          type="button"
          disabled={!isRunning}
          onClick={handleStop}
          className="py-2 px-3 rounded-xs bg-gradient-to-b from-[#2B1515] to-[#1A0C0C] hover:from-[#3A1C1C] hover:to-[#251010] border border-[#8B3A3A] text-[#F8DCDC] text-xs font-heading font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Square className="w-3.5 h-3.5 text-[#E06B6B]" />
          <span>Остановить</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadZip}
          className="py-2 px-3 rounded-xs bg-gradient-to-b from-[#16271D] to-[#0D1812] hover:from-[#1E3628] hover:to-[#122219] border border-[#3A8B5B] text-[#DCF8E6] text-xs font-heading font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Download className="w-3.5 h-3.5 text-[#6BE098]" />
          <span>Скачать архив ZIP</span>
        </button>
      </div>

      {/* Selected Scene Context Actions (Upload manually & Copy prompt) */}
      {selectedScene && (
        <div className="bg-[#14111A] p-3 rounded-xs border border-[#8A6B3A]/40 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="min-w-0">
            <div className="text-[11px] font-heading text-[#A89F91]">
              Выбранная сцена: <span className="font-mono text-[#C9A55C] font-semibold">{selectedScene.id}</span>
            </div>
            <div className="text-xs text-[#EFE6CF] font-prose truncate">
              {selectedScene.location || selectedScene.chapterTitle || '—'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyPrompt(selectedScene)}
              className="py-1 px-3 rounded-xs bg-[#1C1824] hover:bg-[#252030] border border-[#8A6B3A]/60 text-[#C9A55C] text-xs font-heading transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copiedSceneId === selectedScene.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Копировать промт</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isUploading || isRunning}
              onClick={handleManualUploadClick}
              className="py-1 px-3 rounded-xs bg-[#241F18] hover:bg-[#30291F] border border-[#C9A55C]/70 text-[#EFE6CF] text-xs font-heading transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A55C]" />
                  <span>Конвертация...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-[#C9A55C]" />
                  <span>Загрузить кадр вручную</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Status / Progress Bar */}
      {(statusMessage || isRunning || countdown !== null || isUploading) && (
        <div className="p-3 rounded-xs bg-[#120F17] border border-[#8A6B3A]/50 text-xs font-heading text-[#C9A55C] flex items-center gap-2.5 shadow-inner">
          {isRunning && <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#C9A55C]" />}
          {countdown !== null && <Clock className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />}
          {isUploading && <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#C9A55C]" />}
          <span className="truncate">{statusMessage}</span>
        </div>
      )}

      {/* Scenes List with Thumbnails & Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-heading text-[#A89F91] px-1">
          <span>Сцены мира ({scenesList.length}):</span>
          <span>Нажмите на строку сцены для выбора</span>
        </div>

        <div className="max-h-80 overflow-y-auto rounded-xs border border-[#8A6B3A]/30 bg-[#0E0C12] divide-y divide-[#8A6B3A]/15 shadow-inner">
          {scenesList.map((scene) => {
            const hasArt = readySet.has(scene.id);
            const isProcessing = currentProcessingId === scene.id;
            const isSelected = selectedSceneId === scene.id;
            const version = getSceneArtVersion(scene.id) || 1;
            const thumbUrl = `/scenes/${scene.id}.webp?v=${version}`;

            return (
              <div
                key={scene.id}
                onClick={() => setSelectedSceneId(scene.id)}
                className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#2A2216]/80 to-[#18130D]/80 border-l-3 border-[#C9A55C]'
                    : 'hover:bg-[#16131D]/60'
                }`}
              >
                {/* Left side: Thumbnail (up to 96px) + Scene Metadata */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-20 sm:w-24 h-12 sm:h-14 shrink-0 rounded-xs overflow-hidden border border-[#8A6B3A]/40 bg-[#0A090D] relative flex items-center justify-center shadow-xs">
                    {hasArt ? (
                      <img
                        src={thumbUrl}
                        alt={scene.id}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full border border-dashed border-[#8A6B3A]/25 flex flex-col items-center justify-center text-[#7D7263]">
                        <ImageIcon className="w-4 h-4 opacity-50" />
                        <span className="text-[9px] font-heading opacity-70 mt-0.5">Нет кадра</span>
                      </div>
                    )}
                  </div>

                  {/* Scene text */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-[#EFE6CF] truncate">
                        {scene.id}
                      </span>
                    </div>
                    <div className="text-xs text-[#C9A55C]/90 font-prose truncate mt-0.5">
                      {scene.location || scene.chapterTitle || '—'}
                    </div>
                    <div className="text-[10px] text-[#8A7E6C] font-heading truncate">
                      {scene.chapterTitle ? scene.chapterTitle : ''}
                    </div>
                  </div>
                </div>

                {/* Right side: Prompt Copy Button & Status Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(scene);
                    }}
                    title="Копировать промт этой сцены"
                    className="p-1.5 rounded-xs hover:bg-[#252030] text-[#A89F91] hover:text-[#C9A55C] transition cursor-pointer border border-transparent hover:border-[#8A6B3A]/40"
                  >
                    {copiedSceneId === scene.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isProcessing && (
                    <span className="px-2 py-0.5 rounded-xs bg-[#2A2216] border border-[#C9A55C] text-[#C9A55C] text-[10px] font-heading font-bold animate-pulse">
                      Рисуется...
                    </span>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded-xs text-[10px] font-heading font-bold tracking-wider flex items-center gap-1 ${
                      hasArt
                        ? 'bg-[#122418] text-[#78E09B] border border-[#3A8B5B]/60 shadow-xs'
                        : 'bg-[#18151D] text-[#8A7E6C] border border-[#3A3342]'
                    }`}
                  >
                    {hasArt ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#78E09B]" />
                        <span>Есть</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-[#7D7263]" />
                        <span>Нет</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
