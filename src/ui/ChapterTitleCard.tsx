import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorldModule, SceneNode } from '../types';
import { useGameStore } from '../store/gameStore';

interface ChapterTitleCardProps {
  scene: SceneNode | undefined;
  world: WorldModule;
}

export const ChapterTitleCard: React.FC<ChapterTitleCardProps> = ({ scene, world }) => {
  const { isChapterStart, setIsChapterStart } = useGameStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const lastChapterKeyRef = useRef<string | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawChapterTitle = scene?.chapterTitle || '';
  const chapterGroup = rawChapterTitle ? rawChapterTitle.split(':')[0].trim() : '';

  useEffect(() => {
    if (!isChapterStart) return;

    if (!rawChapterTitle || !chapterGroup) {
      setIsChapterStart(false);
      return;
    }

    const chapterKey = `${world.id}:${chapterGroup}`;

    // If chapterGroup is the same as previous, skip card and immediately unblock keyboard shortcuts
    if (lastChapterKeyRef.current === chapterKey) {
      setIsChapterStart(false);
      return;
    }

    lastChapterKeyRef.current = chapterKey;
    setIsVisible(true);
    setIsFadingOut(false);
  }, [world.id, chapterGroup, isChapterStart, rawChapterTitle, setIsChapterStart]);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  const handleDismiss = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isFadingOut) return;
    setIsFadingOut(true);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
      setIsChapterStart(false);
      dismissTimerRef.current = null;
    }, 300);
  }, [isFadingOut, setIsChapterStart]);

  // Auto-dismiss chapter card after 3 seconds so it does not block HUD
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isVisible, handleDismiss]);

  // Handle Space and Enter keydown with event capture to prevent click-through
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        handleDismiss(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isVisible, handleDismiss]);

  if (!isVisible || !scene?.chapterTitle) return null;

  return (
    <div
      onClick={(e) => handleDismiss(e)}
      className={`fixed inset-0 z-50 pointer-events-auto flex items-center justify-center cursor-pointer select-none transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(3, 5, 10, 0.88) 0%, rgba(2, 3, 6, 0.96) 100%)',
      }}
    >
      <div
        onClick={(e) => handleDismiss(e)}
        className="relative max-w-2xl px-6 py-8 sm:px-12 sm:py-12 text-center flex flex-col items-center animate-fadeIn"
      >
        {/* Top Decorative Filigree */}
        <div className="flex items-center gap-3 w-56 sm:w-72 mb-4 opacity-75">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8A6B3A] to-[#C9A55C]" />
          <div className="w-2 h-2 rotate-45 bg-[#B8924A] shadow-[0_0_8px_rgba(201,165,92,0.8)]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#8A6B3A] to-[#C9A55C]" />
        </div>

        {/* Location / Arc Tag */}
        <span className="text-xs sm:text-sm font-heading tracking-[0.3em] uppercase font-bold mb-3 text-[#B8924A]">
          {scene.location || world.title}
        </span>

        {/* Chapter Title in Forum Font 44-56px */}
        <h1 className="text-3xl sm:text-5xl font-display text-[#E6DCC3] tracking-wider leading-tight text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          {scene.chapterTitle}
        </h1>

        {/* Bottom Decorative Filigree */}
        <div className="flex items-center gap-3 w-56 sm:w-72 mt-5 opacity-75">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8A6B3A] to-[#C9A55C]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#B8924A] shadow-[0_0_8px_rgba(201,165,92,0.8)]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#8A6B3A] to-[#C9A55C]" />
        </div>

        {/* Dismiss hint: Literata 14px #BDA97C with slow pulse */}
        <span className="font-prose text-[14px] text-[#BDA97C] mt-8 select-none animate-pulse tracking-wide flex items-center gap-1.5">
          <span>Коснитесь экрана или нажмите Пробел, чтобы войти в главу ◇</span>
        </span>
      </div>
    </div>
  );
};
