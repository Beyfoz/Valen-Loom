import React, { useState, useEffect, useRef } from 'react';
import {
  Backpack,
  Compass,
  Sparkles,
  Save,
  Settings,
  Scroll,
  ChevronDown,
  Globe,
  MoreHorizontal,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getWorld } from '../worlds';
import { getDefaultWorldCodex, isCodexEntryUnlocked } from '../data/codexData';

interface FlaskProps {
  type: 'health' | 'sanity';
  value: number;
  maxValue: number;
  label: string;
  delta: { value: number; key: number } | null;
}

const Flask: React.FC<FlaskProps> = ({ type, value, maxValue, label, delta }) => {
  const safeMax = maxValue > 0 ? maxValue : 1;
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));
  const isCritical = percent < 25;

  return (
    <div
      className={`pointer-events-auto relative w-[38px] h-[38px] md:w-[56px] md:h-[56px] flex-shrink-0 select-none group cursor-help ${
        type === 'health' && isCritical ? 'animate-flask-heartbeat' : ''
      }`}
      title={`${label}: ${value} из ${maxValue}`}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-label={`${label}: ${value} из ${maxValue}`}
    >
      {/* SVG Circular Flask */}
      <svg
        className={`w-full h-full overflow-visible ${
          type === 'sanity' && isCritical ? 'animate-ring-flicker' : ''
        }`}
        viewBox="0 0 100 100"
      >
        <defs>
          {/* Health Liquid Gradient: #5E1414 -> #B3302F */}
          <linearGradient id="flaskHealthGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#5E1414" />
            <stop offset="100%" stopColor="#B3302F" />
          </linearGradient>

          {/* Sanity Liquid Gradient: #2E3F78 -> #6F86D6 */}
          <linearGradient id="flaskSanityGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2E3F78" />
            <stop offset="100%" stopColor="#6F86D6" />
          </linearGradient>

          {/* Brass Ring Bevel Gradient */}
          <linearGradient id="flaskBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D898" />
            <stop offset="25%" stopColor="#A88344" />
            <stop offset="65%" stopColor="#4A3B22" />
            <stop offset="88%" stopColor="#8A6B3A" />
            <stop offset="100%" stopColor="#D4B066" />
          </linearGradient>

          {/* Arc Reflection Gradient */}
          <linearGradient id="glassReflectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>

          {/* Circular Glass Vial Mask */}
          <clipPath id={`flaskClip-${type}`}>
            <circle cx="50" cy="50" r="44.5" />
          </clipPath>
        </defs>

        {/* Outer Shadow under flask */}
        <circle cx="50" cy="52" r="45" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="4" opacity="0.6" />

        {/* Glass Interior (Clipped) */}
        <g clipPath={`url(#flaskClip-${type})`}>
          {/* Glass base backdrop */}
          <circle cx="50" cy="50" r="44.5" fill="#0A080C" />

          {/* Liquid level with smooth 600ms transition and wave motion */}
          <g
            style={{
              transform: `translateY(${100 - percent}%)`,
              transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <g className="flask-wave-group">
              {/* Wave surface path */}
              <path
                d="M -100 115 L -100 0 Q -75 -3.5 -50 0 T 0 0 Q 25 -3.5 50 0 T 100 0 Q 125 -3.5 150 0 T 200 0 L 200 115 Z"
                fill={type === 'health' ? 'url(#flaskHealthGrad)' : 'url(#flaskSanityGrad)'}
              />
              {/* Bright Meniscus Line */}
              <path
                d="M -100 0 Q -75 -3.5 -50 0 T 0 0 Q 25 -3.5 50 0 T 100 0 Q 125 -3.5 150 0 T 200 0"
                fill="none"
                stroke={type === 'health' ? '#E26A5E' : '#BCD0FF'}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          </g>

          {/* Sanity slow ascending bubbles inside liquid */}
          {type === 'sanity' && percent > 5 && (
            <g>
              <circle cx="42" cy="72" r="1.8" fill="#BCD0FF" className="animate-bubble-1" />
              <circle cx="58" cy="80" r="2.2" fill="#BCD0FF" className="animate-bubble-2" />
              <circle cx="48" cy="64" r="1.4" fill="#BCD0FF" className="animate-bubble-3" />
              <circle cx="63" cy="74" r="1.7" fill="#BCD0FF" className="animate-bubble-4" />
            </g>
          )}

          {/* Critical Sanity Fine Glass Fracture / Crack */}
          {type === 'sanity' && isCritical && (
            <g opacity="0.85">
              <path
                d="M 28 32 L 40 44 L 36 54 L 46 66 M 40 44 L 52 40"
                fill="none"
                stroke="#BCD0FF"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 40 44 L 45 48"
                fill="none"
                stroke="#EBF0FF"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Arc reflection: Top-Left Crescent */}
          <path
            d="M 22 46 A 32 32 0 0 1 46 22"
            fill="none"
            stroke="url(#glassReflectGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />
          <ellipse
            cx="30"
            cy="30"
            rx="4"
            ry="2"
            transform="rotate(-45 30 30)"
            fill="#FFFFFF"
            opacity="0.4"
          />

          {/* Inner perimeter edge shadow */}
          <circle cx="50" cy="50" r="44.5" fill="none" stroke="#000000" strokeWidth="6" opacity="0.65" />
        </g>

        {/* Brass Ring (3px ring with bevel and highlight) */}
        <circle
          cx="50"
          cy="50"
          r="47.2"
          fill="none"
          stroke="url(#flaskBrassGrad)"
          strokeWidth="5.5"
        />

        {/* Top Arc Highlight on Brass Ring */}
        <path
          d="M 20 28 A 47.2 47.2 0 0 1 80 28"
          fill="none"
          stroke="rgba(255, 248, 220, 0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bottom Arc Shadow on Brass Ring */}
        <path
          d="M 20 72 A 47.2 47.2 0 0 0 80 72"
          fill="none"
          stroke="rgba(12, 9, 6, 0.85)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Centered Stat Number: Literata 600 17px (14px mobile) #F3EBDA with shadow */}
      <span
        className="absolute inset-0 flex items-center justify-center font-tabular-nums font-semibold text-[14px] sm:text-[17px] text-[#F3EBDA] pointer-events-none select-none tracking-tight"
        style={{
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 0 8px rgba(0, 0, 0, 0.9)',
        }}
      >
        {value}
      </span>

      {/* Value Change: Ring Flash */}
      {delta && (
        <div
          className={`absolute inset-0 rounded-full border-2 animate-ring-flash pointer-events-none ${
            type === 'health'
              ? delta.value > 0
                ? 'border-[#7CDA7A]'
                : 'border-[#E26A5E]'
              : delta.value > 0
              ? 'border-[#768BC7]'
              : 'border-[#F43F5E]'
          }`}
        />
      )}

      {/* Value Change: Floating Delta text (+5 / -10) floating up 1.2s */}
      {delta && (
        <span
          key={delta.key}
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs sm:text-[13px] font-tabular-nums font-bold pointer-events-none animate-float-delta ${
            type === 'health'
              ? delta.value > 0
                ? 'text-[#7CDA7A]'
                : 'text-[#E26A5E]'
              : delta.value > 0
              ? 'text-[#768BC7]'
              : 'text-[#F43F5E]'
          }`}
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 0 6px rgba(0, 0, 0, 0.8)' }}
        >
          {delta.value > 0 ? `+${delta.value}` : delta.value}
        </span>
      )}

      {/* Tooltip on hover (Max value is shown here only) */}
      <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
        {label}: <span className="font-tabular-nums font-semibold text-[#F3EBDA]">{value}</span> / <span className="font-tabular-nums text-[#BAAC93]">{maxValue}</span>
      </div>
    </div>
  );
};

export const HUD: React.FC = () => {
  const {
    state,
    worldId,
    openDrawer,
    activeDrawer,
    setShowCodex,
    setShowChapterChronicle,
    setShowWorldSelect,
  } = useGameStore();
  const world = getWorld(worldId);
  const currentScene = world.scenes[state.currentSceneId] || world.scenes[world.startSceneId];

  // Delta trackers for value change animations
  const prevWorldIdRef = useRef(worldId);
  const prevHealthRef = useRef(state.stats.health);
  const prevSanityRef = useRef(state.stats.sanity);
  const [healthDelta, setHealthDelta] = useState<{ value: number; key: number } | null>(null);
  const [sanityDelta, setSanityDelta] = useState<{ value: number; key: number } | null>(null);

  useEffect(() => {
    if (prevWorldIdRef.current !== worldId) {
      prevWorldIdRef.current = worldId;
      prevHealthRef.current = state.stats.health;
      prevSanityRef.current = state.stats.sanity;
      setHealthDelta(null);
      setSanityDelta(null);
      return;
    }
    const diff = state.stats.health - prevHealthRef.current;
    if (diff !== 0) {
      setHealthDelta((prev) => ({
        value: (prev ? prev.value : 0) + diff,
        key: Date.now(),
      }));
      prevHealthRef.current = state.stats.health;
    }
  }, [worldId, state.stats.health]);

  useEffect(() => {
    if (prevWorldIdRef.current !== worldId) {
      prevWorldIdRef.current = worldId;
      prevHealthRef.current = state.stats.health;
      prevSanityRef.current = state.stats.sanity;
      setHealthDelta(null);
      setSanityDelta(null);
      return;
    }
    const diff = state.stats.sanity - prevSanityRef.current;
    if (diff !== 0) {
      setSanityDelta((prev) => ({
        value: (prev ? prev.value : 0) + diff,
        key: Date.now(),
      }));
      prevSanityRef.current = state.stats.sanity;
    }
  }, [worldId, state.stats.sanity]);

  useEffect(() => {
    if (healthDelta) {
      const timer = setTimeout(() => setHealthDelta(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [healthDelta]);

  useEffect(() => {
    if (sanityDelta) {
      const timer = setTimeout(() => setSanityDelta(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [sanityDelta]);

  const activeQuestsCount = state.quests.filter((q) => q.status === 'active').length;
  const codexEntries = (world.codex && world.codex.length > 0) ? world.codex : getDefaultWorldCodex(world.id);
  const unlockedCodexEntries = codexEntries.filter((e) => isCodexEntryUnlocked(e, state));
  const unlockedCodexCount = unlockedCodexEntries.length;
  const readCodexSet = new Set(state.readCodexEntryIds || []);
  const unreadCodexCount = unlockedCodexEntries.filter((e) => !readCodexSet.has(e.id)).length;
  const hasChapters = !!(world.chapters && world.chapters.length > 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileMenuBtnRef.current &&
        !mobileMenuBtnRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none select-none bg-gradient-to-b from-[#0B0A0D]/95 via-[#0B0A0D]/70 to-transparent pb-2">
      <div className="max-w-[1800px] mx-auto px-2 sm:px-6 pt-2">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {/* Left Column: Health and Sanity Circular Flasks */}
          <div className="flex items-center gap-1.5 md:gap-2.5 justify-start flex-shrink-0">
            <Flask
              type="health"
              value={state.stats.health}
              maxValue={state.stats.maxHealth}
              label="Здоровье"
              delta={healthDelta}
            />
            <Flask
              type="sanity"
              value={state.stats.sanity}
              maxValue={state.stats.maxSanity}
              label="Рассудок"
              delta={sanityDelta}
            />
          </div>

          {/* Center Column (Desktop >=768px only): Clean Typography */}
          <div className="hidden md:flex justify-center min-w-0 max-w-[44vw]">
            <button
              type="button"
              onClick={() => {
                if (hasChapters) {
                  setShowChapterChronicle(true);
                }
              }}
              disabled={!hasChapters}
              className={`pointer-events-auto max-w-full flex items-center gap-2.5 px-2 py-1 transition-all duration-300 group text-left select-none ${
                hasChapters
                  ? 'cursor-pointer hover:drop-shadow-[0_0_12px_rgba(201,165,92,0.65)]'
                  : 'cursor-default'
              }`}
              title={
                hasChapters
                  ? 'Открыть хронику глав и оглавление'
                  : (currentScene?.chapterTitle || world.title)
              }
            >
              {/* Chapter title: Forum serif, larger, golden-beige #E8CF8A */}
              <span className="font-heading text-sm md:text-[17px] tracking-wide text-[#E8CF8A] group-hover:text-[#FFF1C5] transition-colors truncate flex-shrink drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {currentScene?.chapterTitle || world.title}
              </span>

              {/* Location subtitle if present: Literata italic, #CDBF9F */}
              {currentScene?.location && (
                <>
                  <span className="text-[#8A6B3A]/80 text-[10px] sm:text-xs flex-shrink-0 select-none">
                    ✦
                  </span>
                  <span className="font-prose italic text-xs sm:text-[13px] text-[#CDBF9F]/85 group-hover:text-[#EFE6CF] transition-colors truncate flex-shrink drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {currentScene.location}
                  </span>
                </>
              )}

              {/* Chevron indicates interactive chronicle modal */}
              {hasChapters && (
                <ChevronDown className="w-3.5 h-3.5 text-[#8A6B3A] group-hover:text-[#C9A55C] transition-all flex-shrink-0 ml-0.5 group-hover:translate-y-0.5 duration-200" />
              )}
            </button>
          </div>

          {/* Mobile Right Column (<768px): Exactly 4 buttons: Inventory, Quests, Codex, More */}
          <div className="flex md:hidden items-center gap-1.5 justify-end flex-shrink-0">
            {/* 1. Inventory */}
            <button
              type="button"
              onClick={() => openDrawer(activeDrawer === 'inventory' ? 'none' : 'inventory')}
              className={`pointer-events-auto relative w-[36px] h-[36px] rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                activeDrawer === 'inventory'
                  ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_12px_rgba(201,165,92,0.5)]'
                  : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C]'
              }`}
              title={`Инвентарь (${state.inventory.length} предметов)`}
              aria-label="Инвентарь"
            >
              <Backpack className="w-4 h-4" />
              {state.inventory.length > 0 && (
                <span className="absolute -bottom-1 -right-1 text-[9px] font-tabular-nums font-semibold text-[#121016] bg-[#C9A55C] border border-[#3A2E1D] rounded-full min-w-[15px] h-3.5 px-0.5 flex items-center justify-center shadow-md">
                  {state.inventory.length}
                </span>
              )}
            </button>

            {/* 2. Quests */}
            <button
              type="button"
              onClick={() => openDrawer(activeDrawer === 'quests' ? 'none' : 'quests')}
              className={`pointer-events-auto relative w-[36px] h-[36px] rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                activeDrawer === 'quests'
                  ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_12px_rgba(201,165,92,0.5)]'
                  : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C]'
              }`}
              title="Задачи летописи"
              aria-label="Задачи"
            >
              <Compass className="w-4 h-4" />
              {activeQuestsCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#8E2A2A] border border-[#C23B3B] shadow-[0_0_6px_#C23B3B] animate-pulse"
                  title="Есть активные задачи"
                />
              )}
            </button>

            {/* 3. Codex */}
            <button
              type="button"
              onClick={() => setShowCodex(true)}
              className="pointer-events-auto relative w-[36px] h-[36px] rounded-full flex items-center justify-center border border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C] transition-all duration-200 cursor-pointer"
              title={`Кодекс тайн (${unlockedCodexCount} записей)`}
              aria-label="Кодекс тайн"
            >
              <Scroll className="w-4 h-4" />
              {unreadCodexCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-br from-[#A82424] to-[#5C0D0D] border border-[#E05252] text-white text-[9px] font-tabular-nums font-bold flex items-center justify-center shadow-md animate-pulse">
                  {unreadCodexCount}
                </span>
              ) : unlockedCodexCount > 0 ? (
                <span className="absolute -bottom-1 -right-1 text-[9px] font-tabular-nums font-semibold text-[#121016] bg-[#C9A55C] border border-[#3A2E1D] rounded-full min-w-[15px] h-3.5 px-0.5 flex items-center justify-center shadow-md">
                  {unlockedCodexCount}
                </span>
              ) : null}
            </button>

            {/* 4. More Menu «⋯» */}
            <div className="relative">
              <button
                ref={mobileMenuBtnRef}
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`pointer-events-auto relative w-[36px] h-[36px] rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                  isMobileMenuOpen
                    ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_12px_rgba(201,165,92,0.5)]'
                    : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C]'
                }`}
                title="Дополнительное меню"
                aria-label="Дополнительное меню"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Obsidian & Tarnished Brass Dropdown Menu */}
              {isMobileMenuOpen && (
                <div
                  ref={mobileMenuRef}
                  className="pointer-events-auto absolute right-0 top-full mt-2 w-48 rounded-lg bg-[#0D0B0E]/95 border border-[#8A6B3A]/80 shadow-[0_12px_36px_rgba(0,0,0,0.95),0_0_18px_rgba(138,107,58,0.25)] p-1.5 backdrop-blur-md z-50 flex flex-col gap-1 text-xs font-heading tracking-wide animate-fadeIn"
                >
                  <button
                    type="button"
                    onClick={() => {
                      openDrawer(activeDrawer === 'saves' ? 'none' : 'saves');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-[#BAAC93] hover:text-[#FFF1C5] hover:bg-[#8A6B3A]/20 transition cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Сохранения</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWorldSelect(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-[#BAAC93] hover:text-[#FFF1C5] hover:bg-[#8A6B3A]/20 transition cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Сменить мир</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openDrawer(activeDrawer === 'oracle' ? 'none' : 'oracle');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-[#BAAC93] hover:text-[#FFF1C5] hover:bg-[#8A6B3A]/20 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Шёпот Оракула</span>
                  </button>
                  <div className="h-px bg-[#8A6B3A]/30 my-0.5" />
                  <button
                    type="button"
                    onClick={() => {
                      openDrawer(activeDrawer === 'settings' ? 'none' : 'settings');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-[#BAAC93] hover:text-[#FFF1C5] hover:bg-[#8A6B3A]/20 transition cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-300" />
                    <span>Настройки</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Column (Desktop >=768px): All buttons */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 justify-end min-w-0">
          {/* Inventory */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => openDrawer(activeDrawer === 'inventory' ? 'none' : 'inventory')}
              className={`pointer-events-auto relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                activeDrawer === 'inventory'
                  ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_14px_rgba(201,165,92,0.5),inset_0_0_8px_rgba(201,165,92,0.25)]'
                  : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C] hover:bg-[#1A1622] hover:shadow-[0_0_12px_rgba(201,165,92,0.35)]'
              }`}
              title={`Инвентарь (${state.inventory.length} предметов)`}
              aria-label="Инвентарь"
            >
              <Backpack className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {state.inventory.length > 0 && (
                <span className="absolute -bottom-1 -right-1 text-[10px] font-tabular-nums font-semibold text-[#121016] bg-[#C9A55C] border border-[#3A2E1D] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-md">
                  {state.inventory.length}
                </span>
              )}
            </button>
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
              Инвентарь {state.inventory.length > 0 && `(${state.inventory.length})`}
            </div>
          </div>

          {/* Quests */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => openDrawer(activeDrawer === 'quests' ? 'none' : 'quests')}
              className={`pointer-events-auto relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                activeDrawer === 'quests'
                  ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_14px_rgba(201,165,92,0.5),inset_0_0_8px_rgba(201,165,92,0.25)]'
                  : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C] hover:bg-[#1A1622] hover:shadow-[0_0_12px_rgba(201,165,92,0.35)]'
              }`}
              title="Задачи летописи"
              aria-label="Задачи"
            >
              <Compass className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {activeQuestsCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#8E2A2A] border border-[#C23B3B] shadow-[0_0_8px_#C23B3B] animate-pulse"
                  title="Есть активные задачи"
                />
              )}
            </button>
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
              Задачи летописи {activeQuestsCount > 0 && `(${activeQuestsCount})`}
            </div>
          </div>

          {/* Codex */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setShowCodex(true)}
              className="pointer-events-auto relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C] hover:bg-[#1A1622] hover:shadow-[0_0_12px_rgba(201,165,92,0.35)] transition-all duration-200 cursor-pointer"
              title={`Кодекс тайн (${unlockedCodexCount} записей${unreadCodexCount > 0 ? `, ${unreadCodexCount} непрочитанных` : ''})`}
              aria-label="Кодекс тайн"
            >
              <Scroll className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {/* Red Wax Seal Badge for Unread Entries */}
              {unreadCodexCount > 0 ? (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-[#A82424] via-[#851818] to-[#5C0D0D] border border-[#E05252] text-white text-[10px] font-tabular-nums font-bold flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(224,82,82,0.7)] animate-pulse select-none"
                  title={`${unreadCodexCount} новых непрочитанных записей`}
                >
                  {unreadCodexCount}
                </span>
              ) : unlockedCodexCount > 0 ? (
                <span className="absolute -bottom-1 -right-1 text-[10px] font-tabular-nums font-semibold text-[#121016] bg-[#C9A55C] border border-[#3A2E1D] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-md">
                  {unlockedCodexCount}
                </span>
              ) : null}
            </button>
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
              Кодекс тайн {unlockedCodexCount > 0 && `(${unlockedCodexCount}${unreadCodexCount > 0 ? ` · ${unreadCodexCount} новых` : ''})`}
            </div>
          </div>

          {/* Oracle */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => openDrawer(activeDrawer === 'oracle' ? 'none' : 'oracle')}
              className={`pointer-events-auto relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                activeDrawer === 'oracle'
                  ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_14px_rgba(201,165,92,0.5),inset_0_0_8px_rgba(201,165,92,0.25)]'
                  : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#C9A55C] hover:border-[#C9A55C] hover:bg-[#1A1622] hover:shadow-[0_0_12px_rgba(201,165,92,0.35)]'
              }`}
              title="Шёпот Оракула"
              aria-label="Шёпот Оракула"
            >
              <Sparkles className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
              Шёпот Оракула
            </div>
          </div>

          {/* Subtle Brass Divider */}
          <span className="w-px h-5 bg-[#8A6B3A]/35 mx-0.5 sm:mx-1 flex-shrink-0" />

          {/* Change World */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setShowWorldSelect(true)}
              className="pointer-events-auto relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C] hover:bg-[#1A1622] hover:shadow-[0_0_12px_rgba(201,165,92,0.35)] transition-all duration-200 cursor-pointer"
              title="Сменить мир"
              aria-label="Сменить мир"
            >
              <Globe className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
              Сменить мир
            </div>
          </div>

          {/* Saves */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => openDrawer(activeDrawer === 'saves' ? 'none' : 'saves')}
              className={`pointer-events-auto relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                activeDrawer === 'saves'
                  ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_14px_rgba(201,165,92,0.5),inset_0_0_8px_rgba(201,165,92,0.25)]'
                  : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C] hover:bg-[#1A1622] hover:shadow-[0_0_12px_rgba(201,165,92,0.35)]'
              }`}
              title="Скрижали сохранений"
              aria-label="Сохранения"
            >
              <Save className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
              Сохранения
            </div>
          </div>

          {/* Settings */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => openDrawer(activeDrawer === 'settings' ? 'none' : 'settings')}
              className={`pointer-events-auto relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                activeDrawer === 'settings'
                  ? 'border-[#C9A55C] bg-[#8A6B3A]/30 text-[#FFF1C5] shadow-[0_0_14px_rgba(201,165,92,0.5),inset_0_0_8px_rgba(201,165,92,0.25)]'
                  : 'border-[#8A6B3A]/45 bg-[#121016]/80 text-[#BAAC93] hover:text-[#EFE6CF] hover:border-[#C9A55C] hover:bg-[#1A1622] hover:shadow-[0_0_12px_rgba(201,165,92,0.35)]'
              }`}
              title="Настройки игры"
              aria-label="Настройки"
            >
              <Settings className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2.5 py-1 rounded bg-[#0D0B0E]/95 border border-[#8A6B3A]/70 text-[11px] font-heading tracking-wide text-[#EFE6CF] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md">
              Настройки
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dedicated Second Row: Centered Chapter Title (under flasks, with ellipsis) */}
      <div className="flex md:hidden justify-center items-center w-full mt-1 px-2">
        <button
          type="button"
          onClick={() => {
            if (hasChapters) {
              setShowChapterChronicle(true);
            }
          }}
          disabled={!hasChapters}
          className={`pointer-events-auto max-w-[95%] flex items-center justify-center gap-1.5 px-2 py-0.5 select-none ${
            hasChapters ? 'cursor-pointer' : 'cursor-default'
          }`}
          title={
            hasChapters
              ? 'Открыть хронику глав и оглавление'
              : (currentScene?.chapterTitle || world.title)
          }
        >
          <span className="font-heading text-xs tracking-wide text-[#E8CF8A] truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            {currentScene?.chapterTitle || world.title}
          </span>
          {hasChapters && (
            <ChevronDown className="w-3 h-3 text-[#8A6B3A] flex-shrink-0" />
          )}
        </button>
      </div>
    </div>
  </header>
  );
};
