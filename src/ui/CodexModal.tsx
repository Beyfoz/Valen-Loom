import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  BookOpen,
  Lock,
  Search,
  Sparkles,
  Scroll,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { WorldModule, CodexEntry, CodexCategory } from '../types';
import { SoundManager } from './SoundManager';
import { useGameStore } from '../store/gameStore';
import { getDefaultWorldCodex, isCodexEntryUnlocked } from '../data/codexData';

interface CodexModalProps {
  world: WorldModule;
  flags: Record<string, boolean>;
  onClose: () => void;
}

const CATEGORIES: ('Все' | CodexCategory)[] = [
  'Все',
  'Лор',
  'Персонажи',
  'Локации',
  'Фракции',
  'Документы',
  'Секреты',
];

const getLockedDescription = (worldId: string) => {
  if (worldId === 'vespera') {
    return 'Эта запись ещё сокрыта в архивных сейфах. Совершайте ключевые открытия, собирайте паровые улики и делайте судьбоносные выборы, чтобы взломать медный шифр.';
  }
  if (worldId === 'astral') {
    return 'Эта запись растворена в космическом эфире. Исследуйте парящие острова, настраивайте астральные кристаллы и следуйте звёздным путям, чтобы рассеять туман пустоты.';
  }
  return 'Эта запись ещё сокрыта в текущей хронологии. Совершайте ключевые открытия, находите реликвии и делайте судьбоносные выборы, чтобы сорвать соляную печать.';
};

export const CodexModal: React.FC<CodexModalProps> = ({ world, flags, onClose }) => {
  const { selectedCodexEntryId, state, markCodexEntryRead } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<'Все' | CodexCategory>('Все');
  const [searchQuery, setSearchQuery] = useState('');

  // 6. Only current world's codex entries
  const entries: CodexEntry[] = useMemo(() => {
    return (world.codex && world.codex.length > 0)
      ? world.codex
      : getDefaultWorldCodex(world.id) || [];
  }, [world]);

  const readIds = useMemo(() => {
    return new Set(state.readCodexEntryIds || []);
  }, [state.readCodexEntryIds]);

  // Initial selection: prefer selectedCodexEntryId, or first unlocked, or first entry
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (selectedCodexEntryId && entries.some((e) => e.id === selectedCodexEntryId)) {
      return selectedCodexEntryId;
    }
    const firstUnlocked = entries.find((e) => isCodexEntryUnlocked(e, state));
    return firstUnlocked?.id || entries[0]?.id || '';
  });

  // Reset category, search, and selected entry when world.id changes
  useEffect(() => {
    setActiveCategory('Все');
    setSearchQuery('');
    const currentEntries = (world.codex && world.codex.length > 0)
      ? world.codex
      : getDefaultWorldCodex(world.id) || [];
    if (selectedCodexEntryId && currentEntries.some((e) => e.id === selectedCodexEntryId)) {
      setSelectedId(selectedCodexEntryId);
    } else {
      const firstUnlocked = currentEntries.find((e) => isCodexEntryUnlocked(e, state));
      setSelectedId(firstUnlocked?.id || currentEntries[0]?.id || '');
    }
  }, [world.id]);

  // Sync when a specific Codex entry is requested externally
  useEffect(() => {
    if (selectedCodexEntryId && entries.some((e) => e.id === selectedCodexEntryId)) {
      setActiveCategory('Все');
      setSearchQuery('');
      setSelectedId(selectedCodexEntryId);
    }
  }, [selectedCodexEntryId, entries]);

  // Total unlocked
  const totalUnlocked = useMemo(() => {
    return entries.filter((e) => isCodexEntryUnlocked(e, state)).length;
  }, [entries, state]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (activeCategory !== 'Все' && entry.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const isUnlocked = isCodexEntryUnlocked(entry, state);
        if (isUnlocked) {
          return (
            entry.title.toLowerCase().includes(q) ||
            entry.content.toLowerCase().includes(q)
          );
        } else {
          return entry.hint?.toLowerCase().includes(q) || false;
        }
      }
      return true;
    });
  }, [entries, activeCategory, searchQuery, state]);

  const selectedEntry = useMemo(() => {
    return entries.find((e) => e.id === selectedId) || filteredEntries[0] || null;
  }, [entries, selectedId, filteredEntries]);

  const isSelectedUnlocked = selectedEntry ? isCodexEntryUnlocked(selectedEntry, state) : false;

  // 2. Mark as read when opened/selected in window
  useEffect(() => {
    if (selectedEntry && isSelectedUnlocked) {
      if (!readIds.has(selectedEntry.id)) {
        markCodexEntryRead(selectedEntry.id);
      }
    }
  }, [selectedEntry, isSelectedUnlocked, readIds, markCodexEntryRead]);

  // 6. Keyboard navigation: Arrow keys up/down navigate list, Escape closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (filteredEntries.length === 0) return;

      const currentIndex = filteredEntries.findIndex((item) => item.id === (selectedEntry?.id || selectedId));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentIndex + 1) % filteredEntries.length;
        const nextItem = filteredEntries[nextIdx];
        if (nextItem) {
          SoundManager.playClick();
          setSelectedId(nextItem.id);
          if (isCodexEntryUnlocked(nextItem, state)) {
            markCodexEntryRead(nextItem.id);
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentIndex - 1 + filteredEntries.length) % filteredEntries.length;
        const prevItem = filteredEntries[prevIdx];
        if (prevItem) {
          SoundManager.playClick();
          setSelectedId(prevItem.id);
          if (isCodexEntryUnlocked(prevItem, state)) {
            markCodexEntryRead(prevItem.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredEntries, selectedEntry, selectedId, state, markCodexEntryRead, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[92vh] sm:h-[86vh] rounded-2xl bg-[#0F0C14] border border-[#8A6B3A]/60 flex flex-col shadow-2xl overflow-hidden relative text-left"
        style={{
          boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 24px 64px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* Brass corner brackets */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#C9A55C] pointer-events-none" />

        {/* 5. Header: Общий прогресс «Открыто 12 из 31» */}
        <div className="p-4 sm:px-6 border-b border-[#3A2E1D] flex items-center justify-between bg-[#0B090E]/90 select-none">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#2A1F13] border border-[#8A6B3A]/70 text-[#E8CF8A]">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-heading text-[#EDE3CB] tracking-wide">
                  Кодекс мира · {world.title}
                </h3>
                {/* 5. Header: Overall Progress Badge */}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold bg-[#261A0C] text-[#E8CF8A] border border-[#C9A55C]/70 shadow-sm">
                  Открыто {totalUnlocked} из {entries.length}
                </span>
              </div>
              <p className="text-xs text-[#BAAC93] font-prose hidden sm:block mt-0.5">
                Архив летописей, персонажей, тайн и скрытых законов бытия
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SoundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-[#8A7E6C] hover:text-[#EDE3CB] transition cursor-pointer"
            title="Закрыть Кодекс (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5. Toolbar: Categories & Search with category progress and unread dot */}
        <div className="p-3 sm:px-6 bg-[#0E0B12]/80 border-b border-[#3A2E1D] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Categories with Category Progress & Unread Red Dot */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const catCount =
                cat === 'Все'
                  ? entries.length
                  : entries.filter((e) => e.category === cat).length;
              const catUnlocked =
                cat === 'Все'
                  ? totalUnlocked
                  : entries.filter((e) => e.category === cat && isCodexEntryUnlocked(e, state)).length;

              // 2. Unread dot for category
              const hasCategoryUnread = entries.some(
                (e) => (cat === 'Все' || e.category === cat) && isCodexEntryUnlocked(e, state) && !readIds.has(e.id)
              );

              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    SoundManager.playClick();
                    setActiveCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-sm text-xs font-heading tracking-wide transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#2A1F13] text-[#EDE3CB] border border-[#C9A55C] font-semibold shadow-sm'
                      : 'bg-[#14101A] hover:bg-[#1E1826] text-[#BAAC93] hover:text-[#EDE3CB] border border-[#3A2E1D]'
                  }`}
                >
                  {/* 2. Red wax dot if category has unread entries */}
                  {hasCategoryUnread && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#E5484D] shadow-[0_0_6px_#E5484D] shrink-0"
                      title="Есть непрочитанные записи"
                    />
                  )}
                  <span>{cat}</span>
                  {/* 5. Progress per category: Открыто X из Y */}
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-tabular-nums ${
                      isActive ? 'bg-[#3D2C1B] text-[#FFF1C5]' : 'bg-[#0A080E] text-[#8A7E6C]'
                    }`}
                  >
                    {catUnlocked}/{catCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7E6C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по Кодексу..."
              className="w-full pl-8 pr-3 py-1 bg-[#0A080E] border border-[#3A2E1D] rounded-sm text-xs text-[#EDE3CB] placeholder-[#6E6457] focus:outline-none focus:border-[#C9A55C]"
            />
          </div>
        </div>

        {/* Content Body: Two columns */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: Entries List */}
          <div className="w-full md:w-80 border-r border-[#3A2E1D] overflow-y-auto p-2 sm:p-3 space-y-1.5 bg-[#0A080E]/70 shrink-0 max-h-52 md:max-h-full">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8A7E6C] font-prose">
                Записей в этой категории не найдено
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isUnlocked = isCodexEntryUnlocked(entry, state);
                const isSelected = selectedEntry?.id === entry.id;
                const isUnread = isUnlocked && !readIds.has(entry.id);

                return (
                  <button
                    key={entry.id}
                    onClick={() => {
                      SoundManager.playClick();
                      setSelectedId(entry.id);
                      if (isUnlocked) {
                        markCodexEntryRead(entry.id);
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-sm border transition flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2A1F13] border-[#C9A55C] text-[#FFF1C5] shadow-md ring-1 ring-[#C9A55C]/40'
                        : isUnlocked
                        ? 'bg-[#120F18]/80 hover:bg-[#1A1622] border-[#3A2E1D] text-[#EDE3CB] hover:border-[#8A6B3A]'
                        : 'bg-[#09070D]/90 border-[#261E14]/70 text-[#6B5F50] hover:border-[#3A2E1D]'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden min-w-0">
                      {isUnlocked ? (
                        <BookOpen
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-[#E8CF8A]' : 'text-[#BAAC93]'
                          }`}
                        />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#5A4E3E] shrink-0" />
                      )}

                      <div className="truncate min-w-0">
                        {/* 5. Locked entries show silhouette without title */}
                        <div className="text-xs font-heading font-semibold truncate flex items-center gap-1.5">
                          {isUnlocked ? (
                            <span>{entry.title}</span>
                          ) : (
                            <span className="text-[#6E6457] tracking-wider italic">
                              «Запечатанная тайна»
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-heading uppercase tracking-wider text-[#8A7E6C] mt-0.5">
                          {entry.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* 2. Red wax dot for unread unlocked entry */}
                      {isUnread && (
                        <span
                          className="w-2 h-2 rounded-full bg-[#E5484D] shadow-[0_0_6px_#E5484D] shrink-0"
                          title="Новая непрочитанная запись"
                        />
                      )}

                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A55C] shrink-0" />
                      ) : (
                        <span className="text-[10px] font-heading uppercase text-[#5A4E3E] shrink-0">
                          Закрыто
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Entry Reader */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-[#0D0B12]/80 to-[#07050A]/95 min-h-0">
            {selectedEntry ? (
              isSelectedUnlocked ? (
                /* Unlocked Entry Presentation */
                <div className="space-y-4 max-w-2xl animate-fadeIn">
                  <div className="pb-3 border-b border-[#3A2E1D]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-heading font-bold uppercase bg-[#261A0C] text-[#E8CF8A] border border-[#C9A55C]/70">
                        {selectedEntry.category}
                      </span>
                      <span className="text-[11px] font-heading text-[#C9A55C] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Запись расшифрована
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#EDE3CB] tracking-wide">
                      {selectedEntry.title}
                    </h2>
                  </div>

                  {/* Prose Content (Bad Script for Documents, EB Garamond for Lore) */}
                  <div
                    className={`leading-relaxed text-[#EDE3CB] space-y-3 ${
                      selectedEntry.category === 'Документы'
                        ? 'font-script text-base sm:text-lg text-[#EDE3CB]/90 bg-[#121016]/80 p-4 border border-[#8A6B3A]/40 rounded-sm shadow-inner'
                        : 'font-prose text-sm sm:text-base text-[#EDE3CB]'
                    }`}
                  >
                    <p>{selectedEntry.content}</p>
                  </div>

                  {/* Lore Stamp */}
                  <div className="pt-4 border-t border-[#3A2E1D]/60 flex items-center justify-between text-[11px] font-heading text-[#8A7E6C]">
                    <span>Летопись: {world.title}</span>
                  </div>
                </div>
              ) : (
                /* 5. Locked Entry Silhouette Presentation: category and hint without title */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fadeIn">
                  {/* Silhouette icon with engraved brass ring */}
                  <div className="w-16 h-16 rounded-full bg-[#14101A] border border-[#4A3A22] flex items-center justify-center shadow-inner relative">
                    <div className="absolute inset-1 rounded-full border border-dashed border-[#8A6B3A]/30 pointer-events-none" />
                    <Lock className="w-7 h-7 text-[#8A6B3A]/70" />
                  </div>

                  <div>
                    {/* Category badge */}
                    <div className="mb-2">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-heading font-bold uppercase bg-[#1A140E] text-[#CDBF9F] border border-[#4A3A22]">
                        Категория: {selectedEntry.category}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold font-heading text-[#EDE3CB] mb-1 tracking-wide">
                      Засекреченная страница летописи
                    </h4>
                    <p className="text-xs text-[#BAAC93] font-prose leading-relaxed">
                      {getLockedDescription(world.id)}
                    </p>
                  </div>

                  {/* 5. Hint without title */}
                  {selectedEntry.hint && (
                    <div className="w-full p-3.5 rounded-sm bg-[#1A140E]/90 border border-[#8A6B3A]/60 text-left flex items-start gap-2.5 text-xs text-[#EDE3CB] shadow-md">
                      <HelpCircle className="w-4 h-4 text-[#C9A55C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-heading font-bold text-[#E8CF8A] block uppercase text-[10px] tracking-wider mb-0.5">
                          Подсказка к открытию:
                        </span>
                        <span className="font-prose text-xs text-[#EDE3CB]">{selectedEntry.hint}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-[#8A7E6C] text-sm font-heading">
                Выберите запись для чтения
              </div>
            )}
          </div>
        </div>

        {/* Footer Keyboard Hint */}
        <div className="p-2.5 px-4 bg-[#0A080E] border-t border-[#3A2E1D] flex items-center justify-between text-[11px] font-prose text-[#8A7E6C] select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#17131F] border border-[#3A2E1D] text-[10px] text-[#EDE3CB] rounded-sm">
                ↑↓
              </kbd>
              <span>Листать список</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#17131F] border border-[#3A2E1D] text-[10px] text-[#EDE3CB] rounded-sm">
                Esc
              </kbd>
              <span>Закрыть</span>
            </span>
          </div>
          <span className="hidden sm:inline italic">
            Мир: {world.title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodexModal;
