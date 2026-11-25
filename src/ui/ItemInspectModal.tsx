import React from 'react';
import { X, Zap, MapPin, AlertCircle, Sparkles, Scroll } from 'lucide-react';
import { Item } from '../types';
import { SoundManager } from './SoundManager';
import { getItemIllustration } from './itemIllustrations';
import { ItemTileImage } from './InventoryModal';
import { useGameStore } from '../store/gameStore';
import { getWorld } from '../worlds';

interface ItemInspectModalProps {
  item: Item;
  isApplicableHere?: boolean;
  onUse?: (itemId: string) => void;
  onClose: () => void;
}

export const ItemInspectModal: React.FC<ItemInspectModalProps> = ({
  item,
  isApplicableHere = false,
  onUse,
  onClose,
}) => {
  const { worldId, inventoryViewMode, openCodexWithEntry } = useGameStore();
  const world = getWorld(worldId);
  const rarity = item.rarity || (item.category === 'Relic' ? 'relic' : 'common');
  const isDepleted = item.charges !== undefined && item.charges <= 0;
  const illustration = getItemIllustration(item);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#121016]/98 border border-[#8A6B3A]/60 p-5 sm:p-6 shadow-2xl space-y-4 rounded-sm text-left max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 24px 64px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* 4 Patinated Brass Corner Brackets */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#C9A55C] pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#C9A55C] pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#3A2E1D] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-heading text-[#EDE3CB] font-semibold leading-tight">
                {item.name}
              </h3>
              {item.quantity > 1 && (
                <span className="text-xs font-tabular-nums px-2 py-0.5 bg-[#2A1D0D] border border-[#C9A55C]/70 text-[#E8CF8A] font-semibold">
                  x{item.quantity}
                </span>
              )}
            </div>
            {/* Zero-Pill Clean Metadata */}
            <div className="flex items-center gap-2 mt-1 text-xs font-heading tracking-wider">
              <span
                className={`uppercase font-semibold ${
                  rarity === 'relic'
                    ? 'text-[#E8CF8A]'
                    : rarity === 'rare'
                    ? 'text-[#8FA3E0]'
                    : 'text-[#A89F91]'
                }`}
              >
                {rarity === 'relic' ? 'Древняя Реликвия' : rarity === 'rare' ? 'Редкий артефакт' : 'Обычный предмет'}
              </span>
              <span className="text-[#5A4F3E]">·</span>
              <span className="text-[#CDBF9F] uppercase">{item.category}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#8A6B3A] hover:text-[#EDE3CB] hover:bg-[#1A1622] rounded transition cursor-pointer"
            aria-label="Закрыть осмотр"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large Visual Illustration */}
        <div className="relative aspect-[16/10] w-full rounded-sm overflow-hidden bg-[#07060A] border border-[#8A6B3A]/60 shadow-inner flex items-center justify-center group">
          {inventoryViewMode === 'new' ? (
            <ItemTileImage
              item={item}
              worldId={world.id}
              artStylePrompt={world.artStylePrompt}
              alt={item.name}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <img
              src={illustration}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {/* Inner Corner Accents */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#C9A55C] pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#C9A55C] pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#C9A55C] pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#C9A55C] pointer-events-none" />

          {/* Charges Indicator Overlay */}
          {item.charges !== undefined && (
            <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-[#0E0C12]/90 border border-[#8A6B3A]/80 text-xs font-heading text-[#EDE3CB] flex items-center gap-1.5 shadow">
              <span className="text-[#8A7E6C] text-[10px] uppercase">Заряды:</span>
              <div className="flex gap-1">
                {Array.from({ length: item.maxCharges || 3 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`text-xs ${
                      idx < (item.charges || 0)
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

        {/* "Пригодится в этой сцене" Notice */}
        {isApplicableHere && !isDepleted && (
          <div className="p-2.5 bg-[#261A0C]/90 border-l-2 border-[#C9A55C] text-[#E8CF8A] text-xs font-heading flex items-center gap-2 tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C9A55C] shrink-0" />
            <span>Пригодится в текущей ситуации!</span>
          </div>
        )}

        {/* Full Description & Lore */}
        <div className="space-y-3 font-prose text-xs sm:text-sm leading-relaxed">
          <p className="text-[#EDE3CB]">{item.description}</p>

          {item.loreNote && (
            <div className="p-3 bg-[#08070A]/85 border-l-2 border-[#8A6B3A]/70 italic text-[#CDBF9F] leading-relaxed">
              <span className="font-heading not-italic text-[10px] uppercase text-[#8A6B3A] tracking-wider block mb-0.5">
                Лор и происхождение
              </span>
              «{item.loreNote}»
            </div>
          )}

          {item.effectSummary && (
            <div className="text-xs font-prose text-[#4EBA87] flex items-center gap-1.5 font-medium">
              <span className="font-heading text-[10px] uppercase tracking-wider text-[#38A169]">
                Эффект:
              </span>
              <span>{item.effectSummary}</span>
            </div>
          )}

          {item.acquiredLocation && (
            <div className="text-[11px] font-prose text-[#8A7E6C] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8A6B3A] shrink-0" />
              <span>Получено: {item.acquiredLocation}</span>
            </div>
          )}
        </div>

        {/* Action Button Row (Min height 44px) */}
        <div className="pt-2 border-t border-[#3A2E1D] flex items-center justify-between gap-3">
          <div>
            {isDepleted && (
              <span className="text-xs font-heading text-[#C44343] flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Истощён (0 зарядов)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* 4. "В Кодексе" button if item has linked codexId */}
            {item.codexId && (
              <button
                type="button"
                onClick={() => {
                  SoundManager.playClick();
                  openCodexWithEntry(item.codexId);
                  onClose();
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-sm bg-[#1A140E] hover:bg-[#2A1F13] border border-[#8A6B3A]/70 hover:border-[#C9A55C] text-[#E8CF8A] hover:text-[#FFF1C5] text-xs font-heading uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Scroll className="w-4 h-4 text-[#C9A55C]" />
                <span>В Кодексе</span>
              </button>
            )}
            {item.usable && item.useAction && onUse && (
              <button
                type="button"
                disabled={isDepleted}
                onClick={() => {
                  SoundManager.playClick();
                  onUse(item.id);
                  onClose();
                }}
                className={`min-h-[44px] px-5 py-2.5 rounded-sm font-heading text-xs uppercase tracking-wider flex items-center gap-2 transition select-none ${
                  isDepleted
                    ? 'bg-[#1C1712] border border-[#3A2E1D] text-[#7D7362] cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-[#2B1F12] via-[#43311C] to-[#2B1F12] hover:from-[#3D2C1B] hover:to-[#553E23] border border-[#C9A55C] text-[#FFF5DC] hover:text-white cursor-pointer shadow-[0_4px_16px_rgba(201,165,92,0.25)] active:scale-[0.99]'
                }`}
              >
                <Zap className="w-4 h-4 text-[#C9A55C]" />
                <span>{item.useAction.label || 'Применить'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2.5 rounded-sm bg-[#141219] hover:bg-[#1E1912] border border-[#3A2E1D] text-[#BAAC93] hover:text-[#EDE3CB] text-xs font-heading uppercase tracking-wider transition cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
