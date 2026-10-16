import React from 'react';
import { X, Trophy, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { WorldModule } from '../types';

interface EndingsModalProps {
  world: WorldModule;
  unlockedEndings: string[];
  onClose: () => void;
}

export const EndingsModal: React.FC<EndingsModalProps> = ({
  world,
  unlockedEndings,
  onClose,
}) => {
  const endings = world.endingsList || [];
  const unlockedCount = endings.filter((e) => unlockedEndings.includes(e.id)).length;
  const percent = endings.length > 0 ? Math.round((unlockedCount / endings.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl h-[85vh] rounded-2xl bg-[#0E1321] border border-white/15 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                Зал Судеб и Концовок: {world.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Открыто {unlockedCount} из {endings.length} финалов ({percent}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Endings */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {endings.map((ending) => {
              const isUnlocked = unlockedEndings.includes(ending.id);

              return (
                <div
                  key={ending.id}
                  className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-black/50 border-amber-500/50 shadow-xl'
                      : 'bg-black/20 border-white/10 opacity-70'
                  }`}
                >
                  {/* Ending CG or Silhouette */}
                  <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                    {isUnlocked ? (
                      <img
                        src={ending.cgUrl || world.coverImage}
                        alt={ending.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-slate-600 gap-2">
                        <Lock className="w-8 h-8" />
                        <span className="text-xs font-mono">Финал заблокирован</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold font-display text-white">
                        {isUnlocked ? ending.title : 'Неизведанная судьба'}
                      </h4>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-prose">
                      {isUnlocked ? ending.description : ending.hint}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
