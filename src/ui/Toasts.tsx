import React, { useEffect, useState, useRef } from 'react';
import { Compass, Info, X, Sparkles, Scroll, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ItemTileImage } from './InventoryModal';
import { getItemIllustration } from './itemIllustrations';

export const Toasts: React.FC = () => {
  const {
    outcomeCard,
    dismissOutcomeCard,
    notifications,
    dismissNotification,
    worldId,
    inventoryViewMode,
    openCodexWithEntry,
  } = useGameStore();

  const [isHovered, setIsHovered] = useState(false);
  const outcomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Outcome card timer (6 seconds, paused on hover)
  useEffect(() => {
    if (!outcomeCard) return;

    if (outcomeTimerRef.current) {
      clearTimeout(outcomeTimerRef.current);
      outcomeTimerRef.current = null;
    }

    if (!isHovered) {
      outcomeTimerRef.current = setTimeout(() => {
        dismissOutcomeCard();
      }, 6000);
    }

    return () => {
      if (outcomeTimerRef.current) {
        clearTimeout(outcomeTimerRef.current);
      }
    };
  }, [outcomeCard?.id, outcomeCard?.timestamp, isHovered, dismissOutcomeCard]);

  // 2. Escape key closes outcome card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && outcomeCard) {
        dismissOutcomeCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [outcomeCard, dismissOutcomeCard]);

  // 3. Fallback generic notifications timer (e.g. Save loaded, etc.)
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      dismissNotification(notifications[0].id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notifications, dismissNotification]);

  const hasOutcomeCard = !!outcomeCard;
  const singleFallbackNotification = notifications[0];

  if (!hasOutcomeCard && !singleFallbackNotification) return null;

  return (
    <div className="fixed top-16 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full pointer-events-none select-none">
      {/* 
        ============================================================
        «ИТОГ ВЫБОРА» - ЕДИНСТВЕННАЯ КАРТОЧКА
        ============================================================
      */}
      {outcomeCard && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto relative rounded-sm bg-[#110E17]/98 border border-[#8A6B3A] backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.95)] animate-fadeIn text-left overflow-hidden transition-all"
          style={{
            boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 16px 40px rgba(0, 0, 0, 0.95)',
          }}
        >
          {/* Corner brass accents */}
          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#C9A55C] pointer-events-none" />
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#C9A55C] pointer-events-none" />
          <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#C9A55C] pointer-events-none" />
          <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#C9A55C] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#1A1424]/90 border-b border-[#8A6B3A]/40">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A55C] animate-pulse" />
              <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-[#E8CF8A]">
                Итог выбора
              </span>
            </div>
            <button
              type="button"
              onClick={dismissOutcomeCard}
              className="p-1 text-[#8A7E6C] hover:text-[#EDE3CB] transition cursor-pointer"
              aria-label="Закрыть итог"
              title="Закрыть (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content Rows */}
          <div className="p-3 space-y-2.5 max-h-[340px] overflow-y-auto">
            {/* 1. Items Acquired */}
            {outcomeCard.items.map((itemObj) => {
              const item = itemObj.item;
              const rarity = itemObj.rarity || item.rarity || (item.category === 'Relic' ? 'relic' : 'common');
              const isMajor = rarity === 'rare' || rarity === 'relic';

              if (isMajor) {
                return (
                  <div
                    key={`item-${itemObj.id}`}
                    className="flex items-center gap-3 p-2 rounded-sm bg-[#181322]/80 border border-[#8A6B3A]/50"
                  >
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 aspect-square rounded-sm overflow-hidden border border-[#8A6B3A]/80 shrink-0 bg-[#0A090D] shadow-inner">
                      {inventoryViewMode === 'new' ? (
                        <ItemTileImage
                          item={item}
                          worldId={worldId}
                          alt={item.name}
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={getItemIllustration(item)}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-heading uppercase tracking-wider font-semibold ${
                            rarity === 'relic' ? 'text-[#E8CF8A]' : 'text-[#8FA3E0]'
                          }`}
                        >
                          {rarity === 'relic' ? 'Реликвия' : 'Редкий артефакт'}
                        </span>
                        <span className="text-[#5A4F3E]">·</span>
                        <span className="text-[10px] text-[#A89F91] uppercase">{item.category}</span>
                      </div>
                      <div className="font-heading text-sm text-[#F3EBDA] font-semibold truncate leading-tight mt-0.5">
                        {item.name}
                      </div>
                    </div>
                  </div>
                );
              }

              // Compact row for common / consumable items
              return (
                <div
                  key={`item-${itemObj.id}`}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm bg-[#16121E]/60 border border-[#8A6B3A]/30"
                >
                  <div className="relative w-7 h-7 rounded-sm overflow-hidden border border-[#8A6B3A]/50 shrink-0 bg-[#0A090D]">
                    {inventoryViewMode === 'new' ? (
                      <ItemTileImage
                        item={item}
                        worldId={worldId}
                        alt={item.name}
                        className="w-full h-full"
                      />
                    ) : (
                      <img
                        src={getItemIllustration(item)}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <span className="font-heading text-xs text-[#EDE3CB] font-medium truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-heading text-[#BDA97C] shrink-0 uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 2. Quest Updates */}
            {outcomeCard.quests.map((q, idx) => (
              <div
                key={`quest-${idx}`}
                className="flex items-start gap-2 px-2 py-1.5 rounded-sm bg-[#101726]/70 border border-sky-800/40 text-xs text-sky-200"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span className="font-heading leading-snug">{q}</span>
              </div>
            ))}

            {/* 3. Codex Entries Unlocked */}
            {outcomeCard.codexEntries.map((cx) => (
              <div
                key={`codex-${cx.id}`}
                className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-sm bg-[#221812]/80 border border-[#C9A55C]/50 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Scroll className="w-3.5 h-3.5 text-[#E8CF8A] shrink-0" />
                  <span className="font-heading text-[#F3EBDA] font-medium truncate">
                    Кодекс: {cx.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    dismissOutcomeCard();
                    openCodexWithEntry(cx.id);
                  }}
                  className="px-2 py-0.5 bg-[#2E2015] hover:bg-[#3D2C1B] border border-[#C9A55C] text-[#FFF1C5] text-[11px] font-heading font-semibold rounded-sm transition cursor-pointer shrink-0"
                >
                  Открыть
                </button>
              </div>
            ))}

            {/* 4. Story Notifications (effect.notification, max 2 lines italic) */}
            {outcomeCard.otherNotes.map((note, idx) => (
              <p
                key={`note-${idx}`}
                className="font-prose italic text-xs leading-relaxed text-[#BAAC93] px-1 line-clamp-2"
              >
                «{note}»
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 
        ============================================================
        ЕДИНИЧНОЕ СИСТЕМНОЕ УВЕДОМЛЕНИЕ (ЕСЛИ НЕТ КАРТОЧКИ ВЫБОРА)
        ============================================================
      */}
      {!outcomeCard && singleFallbackNotification && (
        <div
          className="pointer-events-auto flex items-center justify-between gap-3 p-3 rounded-sm bg-[#110E17]/95 border border-[#8A6B3A]/60 backdrop-blur-md shadow-2xl animate-fadeIn text-[#EDE3CB]"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <Info className="w-4 h-4 text-[#C9A55C] shrink-0" />
            <span className="font-heading tracking-wide">
              {singleFallbackNotification.text}
            </span>
          </div>
          <button
            type="button"
            onClick={() => dismissNotification(singleFallbackNotification.id)}
            className="p-1 text-[#8A7E6C] hover:text-[#EDE3CB] transition cursor-pointer"
            aria-label="Закрыть уведомление"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
