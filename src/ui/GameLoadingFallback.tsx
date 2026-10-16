import React from 'react';

interface GameLoadingFallbackProps {
  label?: string;
}

export const GameLoadingFallback: React.FC<GameLoadingFallbackProps> = ({
  label = 'Открытие фолианта...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
    >
      <div
        className="relative px-6 py-5 bg-[#121016]/98 border border-[#8A6B3A]/70 shadow-2xl rounded-sm text-center flex flex-col items-center gap-3.5 min-w-[240px]"
        style={{
          boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 16px 48px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* 4 Patinated Brass Corner Brackets */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#C9A55C] pointer-events-none" />

        {/* Ornate Brass Spinner */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#3A2E1D]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E8CF8A] border-r-[#C9A55C] animate-spin" />
          <div className="w-2 h-2 rounded-full bg-[#E8CF8A] shadow-[0_0_8px_rgba(232,207,138,0.8)]" />
        </div>

        {/* Text */}
        <span className="font-heading text-xs sm:text-sm text-[#EDE3CB] tracking-wider uppercase">
          {label}
        </span>
      </div>
    </div>
  );
};
