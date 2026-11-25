import React, { useRef, useEffect } from 'react';
import { X, BookOpen, Clock } from 'lucide-react';
import { DecisionLogEntry } from '../types';

interface BacklogModalProps {
  entries: DecisionLogEntry[];
  onClose: () => void;
}

export const BacklogModal: React.FC<BacklogModalProps> = ({ entries, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-[85vh] rounded-2xl bg-[#0E1321] border border-white/15 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-display text-white">
              История летописи (Лог прочитанного)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-prose text-sm text-slate-200">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Летопись только начинается...</div>
          ) : (
            entries.map((entry, idx) => (
              <div
                key={`${entry.sceneId}-${idx}`}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-white/5">
                  <span className="font-semibold text-amber-300">
                    {entry.location} · {entry.chapterTitle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {entry.timestamp}
                  </span>
                </div>

                {entry.choiceText && (
                  <p className="text-xs font-sans text-sky-200 font-medium">
                    → Решение: «{entry.choiceText}»
                  </p>
                )}

                {entry.companionChange && (
                  <p className="text-[11px] text-amber-300/90 font-mono italic">
                    Отношения: {entry.companionChange.companionName}{' '}
                    {entry.companionChange.delta > 0 ? `+${entry.companionChange.delta}` : entry.companionChange.delta}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
