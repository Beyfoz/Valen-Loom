import React from 'react';
import { X, Play, RotateCcw, Heart, Brain, Sparkles, Compass } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { WORLD_LIST, getWorld } from '../worlds';
import { loadSaveSlot } from '../engine/gameEngine';
import { SoundManager } from './SoundManager';

interface WorldSelectProps {
  onClose?: () => void;
  isInitialScreen?: boolean;
}

export const WorldSelect: React.FC<WorldSelectProps> = ({ onClose, isInitialScreen = false }) => {
  const { worldId, selectWorld, restartWorld } = useGameStore();

  const handleSelectWorld = (targetId: string) => {
    SoundManager.playClick();
    selectWorld(targetId);
    if (onClose) onClose();
  };

  const handleRestartWorld = (targetId: string, title: string) => {
    SoundManager.playClick();
    if (window.confirm(`Вы уверены, что хотите начать заново историю в мире «${title}»? Прогресс будет стёрт.`)) {
      selectWorld(targetId);
      restartWorld();
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070A11] text-[#F1EFEA] overflow-y-auto animate-fadeIn">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-transparent to-black" />

      {/* Close button if not initial screen */}
      {!isInitialScreen && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition backdrop-blur-md"
          title="Вернуться к текущей сцене"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Decorative Hero Header */}
      <div className="relative z-10 pt-8 pb-4 sm:pt-12 sm:pb-6 px-4 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Vaelen Loom · Мультивселенная приключений</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Миры Бесконечного Нарратива
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-prose">
          Выберите вселенную для исследования. Каждая хроника обладает автономным графом сцен, живыми героями, древними реликвиями и уникальной палитрой.
        </p>
      </div>

      {/* 3 World Cards Grid */}
      <div className="relative z-10 flex-1 px-4 pb-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {WORLD_LIST.map((w) => {
            const isCurrent = w.id === worldId && !isInitialScreen;
            const existingSave = loadSaveSlot(w.id);
            const totalScenes = Object.keys(w.scenes).length;
            const currentSceneNum = existingSave
              ? existingSave.history.length
              : 0;
            const hasStarted = !!existingSave && existingSave.history.length > 1;

            return (
              <div
                key={w.id}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 backdrop-blur-md ${
                  isCurrent
                    ? 'border-amber-400/80 shadow-2xl shadow-amber-500/20 ring-1 ring-amber-400/40 bg-black/60'
                    : 'border-white/10 hover:border-white/30 bg-black/40 hover:shadow-xl'
                }`}
              >
                {/* Top World Artwork Banner */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                  <img
                    src={w.coverImage}
                    alt={w.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-black/30" />

                  {/* Genre Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 text-amber-300">
                    {w.genre}
                  </span>

                  {/* Current Active Badge */}
                  {isCurrent && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-black shadow-lg">
                      Текущий мир
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-lg font-bold font-display text-white group-hover:text-amber-300 transition">
                      {w.title}
                    </h2>
                    <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                      {w.subtitle}
                    </p>

                    {/* Protagonist & Companion */}
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Герой:</span>
                        <span className="font-semibold text-slate-100">
                          {w.protagonist.name} ({w.protagonist.role})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Спутник:</span>
                        <span className="text-slate-200">
                          {w.initialCompanion.name} ({w.initialCompanion.role})
                        </span>
                      </div>
                    </div>

                    {/* Initial Objective */}
                    <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300 font-prose">
                      <span className="text-amber-300 font-semibold block mb-0.5">
                        Миссия:
                      </span>
                      {w.initialQuests[0]?.objective || 'Исследовать неизведанное'}
                    </div>

                    {/* Art Style */}
                    <div className="mt-2 text-[11px] text-slate-400 font-mono">
                      Стиль: <span className="text-slate-300">{w.artStyleName}</span>
                    </div>

                    {/* Save State Summary (if exists) */}
                    {hasStarted && existingSave && (
                      <div className="mt-3 p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-sky-400" />
                            Прогресс:
                          </span>
                          <span className="text-amber-300 font-semibold">
                            Сцена {currentSceneNum} из ~{totalScenes}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          <div className="flex items-center gap-1 text-rose-300">
                            <Heart className="w-3 h-3 text-rose-400" />
                            <span>{existingSave.stats.health} HP</span>
                          </div>
                          <div className="flex items-center gap-1 text-sky-300">
                            <Brain className="w-3 h-3 text-sky-400" />
                            <span>{existingSave.stats.sanity} Sanity</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions on Card */}
                  <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                    <button
                      onClick={() => handleSelectWorld(w.id)}
                      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                        isCurrent
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                          : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>
                        {hasStarted
                          ? isCurrent
                            ? 'Продолжить летопись'
                            : 'Продолжить этот мир'
                          : 'Начать путешествие'}
                      </span>
                    </button>

                    {hasStarted && (
                      <button
                        onClick={() => handleRestartWorld(w.id, w.title)}
                        className="w-full py-1.5 px-3 rounded-lg text-[11px] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Начать заново</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
