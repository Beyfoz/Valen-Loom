import React, { useEffect } from 'react';
import { X, Sparkles, Trophy } from 'lucide-react';
import { SoundManager } from './SoundManager';

interface CGModalProps {
  cg: {
    id: string;
    title: string;
    subtitle: string;
    url: string;
  };
  onClose: () => void;
}

export const CGModal: React.FC<CGModalProps> = ({ cg, onClose }) => {
  useEffect(() => {
    SoundManager.playItemChime();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl bg-black">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={cg.url}
            alt={cg.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

          {/* Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>Ключевая сцена разблокирована</span>
          </div>

          {/* Bottom Title */}
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {cg.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 font-prose mt-1">
              {cg.subtitle}
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#0A0D14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition"
          >
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
};
