import React, { useEffect, useRef } from 'react';
import {
  X,
  Backpack,
  Zap,
  Sparkles,
  MapPin,
  Sparkle,
  Scroll,
} from 'lucide-react';
import { Item, WorldModule, GameSaveState } from '../types';
import { getItemIllustration } from './itemIllustrations';
import { useItemArt, itemArtService } from './itemArtService';
import { useGameStore } from '../store/gameStore';
import {
  useInventoryLogic,
  InventoryTab,
  InventorySortOption,
} from './useInventoryLogic';

export type { InventoryTab, InventorySortOption };

interface ItemTileImageProps {
  item: Item;
  worldId: string;
  artStylePrompt?: string;
  alt: string;
  className?: string;
}

export const ItemTileImage: React.FC<ItemTileImageProps> = ({
  item,
  worldId,
  artStylePrompt,
  alt,
  className = '',
}) => {
  const { artUrl, isGenerating, isGenerated } = useItemArt(item, worldId, artStylePrompt);
  const proceduralUrl = getItemIllustration(item);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const hasDistinctArt = isGenerated && artUrl && artUrl !== proceduralUrl;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Base Layer: Procedural vector SVG illustration (always present instantly, 100% offline) */}
      <img
        src={proceduralUrl}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        loading="lazy"
        decoding="async"
      />

      {/* Crossfading Generated AI / Custom Artwork Layer (400ms smooth crossfade) */}
      {hasDistinctArt && (
        <img
          src={artUrl}
          alt={alt}
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-400 ease-in-out ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Non-blocking Golden Progress Runner Line at bottom while generating */}
      {isGenerating && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3A2E1D]/80 overflow-hidden pointer-events-none z-20"
          title="Сотворение арта реликвии..."
        >
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#E8CF8A] to-transparent animate-art-runner" />
        </div>
      )}
    </div>
  );
};

export interface InventoryViewProps {
  inventory: Item[];
  world: WorldModule;
  state: GameSaveState;
  onUseItem: (itemId: string) => void;
  onInspectItem?: (item: Item) => void;
  onClose?: () => void;
  isCompactDrawer?: boolean;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  world,
  state,
  onUseItem,
  onInspectItem,
  onClose,
  isCompactDrawer = false,
}) => {
  const { inventoryViewMode, setInventoryViewMode, openCodexWithEntry } = useGameStore();

  const {
    invTab,
    setInvTab,
    sortBy,
    setSortBy,
    sortedItems,
    activeItem,
    isItemApplicableHere,
    handleSelect,
    handleUse,
    flashingItemIds,
  } = useInventoryLogic({
    inventory,
    world,
    state,
    onUseItem,
    onInspectItem,
    onClose,
    isCompactDrawer,
  });

  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Trigger background art generation ONLY in "Новый (с ИИ-артом)" mode
  useEffect(() => {
    if (inventoryViewMode !== 'new') return;
    if (!inventory || inventory.length === 0) return;
    inventory.forEach((item) => {
      itemArtService.requestItemArt(item, world.id, world.artStylePrompt);
    });
  }, [inventory, world.id, world.artStylePrompt, inventoryViewMode]);

  return (
    <div className="flex flex-col h-full w-full select-none text-left overflow-hidden">
      {/* 1. FIXED CONTROLS HEADER: FILTER TABS, SORT OPTIONS & VIEW MODE TOGGLE (Fixed above the grid, never clipped) */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-0.5 pb-2.5 border-b border-[#3A2E1D]/80 bg-inherit z-10">
        {/* Left: Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {(
            [
              { id: 'all', label: 'Все' },
              { id: 'relics', label: 'Реликвии' },
              { id: 'consumables', label: 'Зелья' },
              { id: 'keys', label: 'Ключи' },
              { id: 'weapons', label: 'Оружие' },
            ] as { id: InventoryTab; label: string }[]
          ).map((tab) => {
            const isActive = invTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setInvTab(tab.id)}
                className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-heading tracking-wider transition-colors cursor-pointer rounded-sm flex items-center justify-center whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2A1F13] text-[#EDE3CB] border border-[#8A6B3A] shadow-sm font-semibold'
                    : 'text-[#BAAC93] hover:text-[#EDE3CB] hover:bg-[#1A1622]/60 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right: Sort Controls & Mode Toggle («Классический / Новый») */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Quick View Mode Toggle */}
          <div className="flex items-center border border-[#8A6B3A]/40 rounded-sm overflow-hidden bg-[#0A090D]">
            <button
              type="button"
              onClick={() => setInventoryViewMode('classic')}
              title="Классический вид (быстрые гравюрные иллюстрации)"
              className={`px-2 py-1 text-[11px] font-heading tracking-wide transition-colors cursor-pointer ${
                inventoryViewMode === 'classic'
                  ? 'bg-[#8A6B3A]/30 text-[#FFF1C5] font-semibold border-r border-[#8A6B3A]/50'
                  : 'text-[#8A7E6C] hover:text-[#BAAC93] border-r border-[#8A6B3A]/30'
              }`}
            >
              Классика
            </button>
            <button
              type="button"
              onClick={() => setInventoryViewMode('new')}
              title="Новый вид (с генерацией ИИ-арта)"
              className={`px-2 py-1 text-[11px] font-heading tracking-wide transition-colors cursor-pointer flex items-center gap-1 ${
                inventoryViewMode === 'new'
                  ? 'bg-[#8A6B3A]/30 text-[#FFF1C5] font-semibold'
                  : 'text-[#8A7E6C] hover:text-[#BAAC93]'
              }`}
            >
              <Sparkle className="w-2.5 h-2.5 text-[#E8CF8A]" />
              ИИ-арт
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-heading uppercase text-[#CDBF9F] mr-0.5 hidden md:inline">
              Сортировка:
            </span>
            {(
              [
                { id: 'recent', label: 'Недавние' },
                { id: 'rarity', label: 'По редкости' },
                { id: 'name', label: 'По названию' },
              ] as { id: InventorySortOption; label: string }[]
            ).map((opt) => {
              const isSelected = sortBy === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id)}
                  className={`min-h-[34px] px-2.5 py-1 text-xs font-heading tracking-wider rounded-sm transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#2A1F13] text-[#EDE3CB] border border-[#8A6B3A] font-semibold shadow-sm'
                      : 'text-[#BAAC93] hover:text-[#EDE3CB] hover:bg-[#1A1622]/60 border border-transparent'
                  }`}
                  title={`Сортировать: ${opt.label}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: Split Grid & Detail Panel (Grid and Panel have internal scrolling) */}
      <div
        className={`flex-1 min-h-0 pt-3 grid gap-4 ${
          isCompactDrawer
            ? 'grid-cols-1 overflow-y-auto'
            : 'grid-cols-1 md:grid-cols-12 h-full'
        }`}
      >
        {/* LEFT COLUMN: VISUAL TILES GRID */}
        <div
          ref={gridContainerRef}
          className={`${
            isCompactDrawer ? 'w-full' : 'md:col-span-7 lg:col-span-7'
          } flex flex-col space-y-3 h-full min-h-0 overflow-y-auto pr-1`}
        >
          {sortedItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-[#3A2E1D]/60 rounded-sm bg-[#0B0A0D]/50 text-center">
              <Backpack className="w-8 h-8 text-[#8A7E6C] mb-2" />
              <p className="font-heading text-sm text-[#EDE3CB]">В этой категории пока пусто</p>
              <p className="font-prose text-xs text-[#BAAC93] mt-1">
                Исследуйте залы и открывайте тайники, чтобы наполнить суму.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 p-1">
              {sortedItems.map((item) => {
                const isSelected = activeItem?.id === item.id;
                const rarity = item.rarity || (item.category === 'Relic' ? 'relic' : 'common');
                const isApplicable = isItemApplicableHere(item);
                const isDepleted = item.charges !== undefined && item.charges <= 0;
                const isFlashing = flashingItemIds.includes(item.id);

                // Border & Shadow by rarity
                let borderClass = 'border-[#3A2E1D] hover:border-[#8A6B3A]';
                if (rarity === 'relic') {
                  borderClass =
                    'border-[#8A6B3A] shadow-[0_0_12px_rgba(201,165,92,0.22)] ring-1 ring-[#C9A55C]/40';
                } else if (rarity === 'rare') {
                  borderClass =
                    'border-[#2C3B63] hover:border-[#8FA3E0] shadow-[0_0_10px_rgba(118,139,199,0.18)]';
                }

                // Selected tile: 2px gold border and visible focus ring
                if (isSelected) {
                  borderClass =
                    'border-2 border-[#E8CF8A] ring-2 ring-[#C9A55C]/80 shadow-[0_0_18px_rgba(232,207,138,0.55)] scale-[1.03] z-10';
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    aria-label={`Выбрать ${item.name}`}
                    tabIndex={0}
                    className={`group relative w-full aspect-square min-w-[76px] min-h-[76px] sm:min-w-[92px] sm:min-h-[92px] bg-[#0A090D] rounded-sm transition-all duration-200 cursor-pointer overflow-hidden flex items-center justify-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF1C5] ${borderClass} ${
                      isFlashing ? 'animate-gold-tile-flash' : ''
                    }`}
                  >
                    {/* Artwork Layer: Classic (procedural SVG) vs New (AI-Art with crossfade & runner) */}
                    {inventoryViewMode === 'new' ? (
                      <ItemTileImage
                        item={item}
                        worldId={world.id}
                        artStylePrompt={world.artStylePrompt}
                        alt={item.name}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={getItemIllustration(item)}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    {/* Subtle Dark Vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Right: "Пригодится здесь" Pulsing Indicator */}
                    {isApplicable && !isDepleted && (
                      <div
                        className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#E8CF8A] border border-[#8A6B3A] rounded-full shadow-[0_0_8px_rgba(232,207,138,0.9)] animate-pulse"
                        title="Пригодится в этой сцене! Нажмите U для применения"
                      />
                    )}

                    {/* Bottom Left: Charges Crystals (◆) */}
                    {item.charges !== undefined && (
                      <div className="absolute bottom-1 left-1.5 flex gap-0.5 items-center bg-[#07060A]/90 px-1 py-0.5 rounded-none border border-[#8A6B3A]/40 text-[9px] select-none z-10">
                        {Array.from({ length: item.maxCharges || 3 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={
                              idx < (item.charges || 0)
                                ? 'text-[#E8CF8A] drop-shadow-[0_0_4px_rgba(232,207,138,0.8)]'
                                : 'text-[#3A2E1D]'
                            }
                          >
                            ◆
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Right: Quantity Badge (if > 1) */}
                    {item.quantity > 1 && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 bg-[#1A140E]/95 border border-[#C9A55C]/80 text-[#EDE3CB] text-[10px] font-tabular-nums font-bold rounded-none shadow z-10">
                        x{item.quantity}
                      </span>
                    )}

                    {/* Depleted overlay */}
                    {isDepleted && (
                      <div className="absolute inset-0 bg-black/65 flex items-center justify-center pointer-events-none z-10">
                        <span className="text-[9px] font-heading uppercase text-[#E26A5E] font-bold bg-[#140808] px-1.5 py-0.5 border border-[#8B2323]">
                          Истощён
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Decorative Engraved Slots without "Пусто" text */}
              {Array.from({ length: Math.max(0, 8 - sortedItems.length) }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="w-full aspect-square min-w-[76px] min-h-[76px] sm:min-w-[92px] sm:min-h-[92px] rounded-sm border border-[#2B2117]/60 bg-[#08070B]/60 flex items-center justify-center select-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] relative"
                >
                  <div className="w-1.5 h-1.5 rotate-45 border border-[#4A3922]/40 bg-[#140F0A]/40" />
                </div>
              ))}
            </div>
          )}

          {/* Quick Keyboard Hint Bar */}
          <div className="pt-2 text-[11px] font-prose text-[#BAAC93] flex flex-wrap items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#1A1622] border border-[#3A2E1D] text-[10px] text-[#EDE3CB] rounded-sm">
                ←↑↓→
              </kbd>
              <span>Выбор</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#1A1622] border border-[#3A2E1D] text-[10px] text-[#EDE3CB] rounded-sm">
                Enter
              </kbd>
              <span>Осмотр</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#1A1622] border border-[#3A2E1D] text-[10px] text-[#EDE3CB] rounded-sm">
                U
              </kbd>
              <span>Применить</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#1A1622] border border-[#3A2E1D] text-[10px] text-[#EDE3CB] rounded-sm">
                Esc
              </kbd>
              <span>Закрыть</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED ITEM DETAILS PANEL */}
        <div
          className={`${
            isCompactDrawer ? 'w-full' : 'md:col-span-5 lg:col-span-5'
          } bg-[#0E0C11]/95 border border-[#8A6B3A]/60 rounded-sm p-4 sm:p-5 flex flex-col justify-between overflow-y-auto h-full min-h-0 shadow-xl relative`}
          style={{
            boxShadow: 'inset 0 0 0 1px #2B2114, 0 12px 36px rgba(0, 0, 0, 0.85)',
          }}
        >
          {activeItem ? (
            <div className="space-y-3.5">
              {/* Visual Artwork: Classic (procedural) vs New (AI art) */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-sm overflow-hidden bg-[#07060A] border border-[#8A6B3A]/60 shadow-inner flex items-center justify-center group">
                {inventoryViewMode === 'new' ? (
                  <ItemTileImage
                    item={activeItem}
                    worldId={world.id}
                    artStylePrompt={world.artStylePrompt}
                    alt={activeItem.name}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={getItemIllustration(activeItem)}
                    alt={activeItem.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                {/* Decorative Brass Frame Brackets inside Artwork */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#C9A55C] pointer-events-none" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#C9A55C] pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#C9A55C] pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#C9A55C] pointer-events-none" />

                {/* Charges badge in illustration */}
                {activeItem.charges !== undefined && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#0D0B10]/95 border border-[#8A6B3A]/80 text-xs font-heading text-[#EDE3CB] flex items-center gap-1.5 shadow z-10">
                    <span className="text-[#CDBF9F] text-[10px] uppercase">Заряды:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: activeItem.maxCharges || 3 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`text-xs ${
                            idx < (activeItem.charges || 0)
                              ? 'text-[#E8CF8A] drop-shadow-[0_0_4px_rgba(232,207,138,0.9)]'
                              : 'text-[#3A2E1D]'
                          }`}
                        >
                          ◆
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div>
                <h3 className="font-heading text-lg sm:text-xl text-[#EDE3CB] tracking-wide leading-tight font-semibold">
                  {activeItem.name}
                </h3>

                {/* Clean Unboxed Metadata */}
                <div className="flex items-center gap-2 mt-1 text-xs font-heading tracking-wider">
                  <span
                    className={`font-semibold uppercase ${
                      activeItem.rarity === 'relic' || activeItem.category === 'Relic'
                        ? 'text-[#E8CF8A]'
                        : activeItem.rarity === 'rare'
                        ? 'text-[#8FA3E0]'
                        : 'text-[#CDBF9F]'
                    }`}
                  >
                    {activeItem.rarity === 'relic' || activeItem.category === 'Relic'
                      ? 'Древняя Реликвия'
                      : activeItem.rarity === 'rare'
                      ? 'Редкий артефакт'
                      : 'Обычный предмет'}
                  </span>
                  <span className="text-[#8A7E6C]">·</span>
                  <span className="text-[#CDBF9F] uppercase">{activeItem.category}</span>
                  {activeItem.quantity > 1 && (
                    <>
                      <span className="text-[#8A7E6C]">·</span>
                      <span className="text-[#EDE3CB] font-tabular-nums font-semibold">
                        x{activeItem.quantity} шт.
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* "Пригодится в этой сцене" Notice */}
              {isItemApplicableHere(activeItem) &&
                !(activeItem.charges !== undefined && activeItem.charges <= 0) && (
                  <div className="p-2.5 bg-[#261A0C]/95 border-l-2 border-[#C9A55C] text-[#E8CF8A] text-xs font-heading flex items-center gap-2 tracking-wide shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#C9A55C] shrink-0" />
                    <span>Пригодится в текущей ситуации! (Клавиша U)</span>
                  </div>
                )}

              {/* Full Description */}
              <p className="font-prose text-xs sm:text-sm text-[#EDE3CB] leading-relaxed">
                {activeItem.description}
              </p>

              {/* Lore / Story origin note */}
              {activeItem.loreNote && (
                <div className="p-2.5 bg-[#08070A]/90 border-l-2 border-[#8A6B3A]/70 italic font-prose text-xs text-[#CDBF9F] leading-relaxed">
                  <span className="not-italic block font-heading text-[10px] uppercase text-[#E8CF8A] tracking-wider mb-0.5">
                    Лор и происхождение
                  </span>
                  «{activeItem.loreNote}»
                </div>
              )}

              {/* Effect Summary */}
              {activeItem.effectSummary && (
                <div className="text-xs font-prose text-[#4EBA87] flex items-center gap-1.5 font-medium">
                  <span className="font-heading text-[10px] uppercase tracking-wider text-[#38A169]">
                    Эффект:
                  </span>
                  <span>{activeItem.effectSummary}</span>
                </div>
              )}

              {/* Acquired Location */}
              {activeItem.acquiredLocation && (
                <div className="text-[11px] font-prose text-[#BAAC93] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A55C] shrink-0" />
                  <span>Получено: {activeItem.acquiredLocation}</span>
                </div>
              )}

              {/* Action Button Row */}
              <div className="pt-2">
                {activeItem.usable ? (
                  <button
                    type="button"
                    disabled={activeItem.charges !== undefined && activeItem.charges <= 0}
                    onClick={() => handleUse(activeItem)}
                    className={`min-h-[48px] h-12 w-full px-5 py-2.5 rounded-sm font-heading text-sm tracking-wide transition-all flex items-center justify-center gap-2 select-none ${
                      activeItem.charges !== undefined && activeItem.charges <= 0
                        ? 'bg-[#151218] border border-[#3A2E1D] text-[#8A7E6C] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#2B1F12] via-[#43311C] to-[#2B1F12] hover:from-[#3D2C1B] hover:to-[#553E23] border border-[#C9A55C] text-[#FFF5DC] hover:text-white cursor-pointer shadow-[0_4px_16px_rgba(201,165,92,0.25)] active:scale-[0.99]'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-[#C9A55C]" />
                    <span>
                      {activeItem.charges !== undefined && activeItem.charges <= 0
                        ? 'Истощён (0 зарядов)'
                        : `${activeItem.useAction?.label || 'Применить предмет'} (U)`}
                    </span>
                  </button>
                ) : (
                  <div className="min-h-[44px] px-3 py-2 bg-[#121015]/60 border border-[#3A2E1D]/50 text-[#BAAC93] font-heading text-xs rounded-sm flex items-center justify-center text-center">
                    Пассивный артефакт (эффект действует непрерывно)
                  </div>
                )}

                {/* 4. Link to Codex if item has linked codexId */}
                {activeItem.codexId && (
                  <button
                    type="button"
                    onClick={() => {
                      openCodexWithEntry(activeItem.codexId);
                      if (onClose) onClose();
                    }}
                    className="min-h-[40px] w-full mt-2 px-4 py-2 rounded-sm font-heading text-xs uppercase tracking-wider bg-[#14101A] hover:bg-[#1E1926] border border-[#8A6B3A]/70 hover:border-[#C9A55C] text-[#E8CF8A] hover:text-[#FFF1C5] cursor-pointer transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Scroll className="w-3.5 h-3.5 text-[#C9A55C]" />
                    <span>В Кодексе</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#8A7E6C]">
              <Backpack className="w-10 h-10 text-[#5A4F3E] mb-3 stroke-1" />
              <h4 className="font-heading text-sm text-[#EDE3CB] tracking-wide">
                Выберите предмет из сумы
              </h4>
              <p className="font-prose text-xs text-[#BAAC93] mt-1 max-w-[220px]">
                Используйте стрелки или нажмите на ячейку, чтобы осмотреть реликвию или применить её (клавиша U).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  world: WorldModule;
  state: GameSaveState;
  onUseItem: (itemId: string) => void;
  onInspectItem: (item: Item) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  world,
  state,
  onUseItem,
  onInspectItem,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* 960x600 Desktop Window Frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#121016]/98 border border-[#8A6B3A]/60 p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] sm:h-[620px] overflow-hidden text-left rounded-sm"
        style={{
          boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 24px 64px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* 4 Patinated Brass Corner Brackets */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#C9A55C] pointer-events-none" />

        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between pb-3 mb-2 border-b border-[#3A2E1D] bg-[#0B0A0D]/60 -mx-4 sm:-mx-6 px-4 sm:px-6 -mt-4 sm:-mt-6 pt-4 sm:pt-5">
          <div className="flex items-center gap-2.5">
            <Backpack className="w-5 h-5 text-[#C9A55C]" />
            <div>
              <h2
                id="inventory-dialog-title"
                className="text-base sm:text-lg font-heading text-[#EDE3CB] tracking-wide"
              >
                Сума и Реликвии ({inventory.length})
              </h2>
              <span className="text-[11px] font-prose italic text-[#CDBF9F]">
                Летопись «{world.title}» · Инвентарь странника
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#8A6B3A] hover:text-[#EDE3CB] hover:bg-[#1A1622] rounded transition cursor-pointer"
            aria-label="Закрыть суму"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <InventoryView
            inventory={inventory}
            world={world}
            state={state}
            onUseItem={onUseItem}
            onInspectItem={onInspectItem}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
