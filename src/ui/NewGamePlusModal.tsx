import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Item, WorldModule } from '../types';
import { SoundManager } from './SoundManager';
import { getItemIllustration } from './itemIllustrations';

interface NewGamePlusModalProps {
  world: WorldModule;
  inventory: Item[];
  onSelectRelic: (relicId: string) => void;
  onClose: () => void;
}

export const NewGamePlusModal: React.FC<NewGamePlusModalProps> = ({
  world,
  inventory,
  onSelectRelic,
  onClose,
}) => {
  // Candidate items: Relics, Weapons, Curios or fallback to all inventory or world initial
  const candidateItems = (inventory && inventory.length > 0)
    ? inventory.filter((i) => i.category === 'Relic' || i.category === 'Weapon' || i.category === 'Curio')
    : [];

  const effectivePool: Item[] = (candidateItems.length > 0)
    ? candidateItems
    : ((inventory && inventory.length > 0) ? inventory : (world.initialInventory || []));

  const [selectedId, setSelectedId] = useState<string>(
    effectivePool[0]?.id || ''
  );

  const selectedItem =
    effectivePool.find((i) => i.id === selectedId) ||
    world.initialInventory?.find((i) => i.id === selectedId);

  const handleConfirm = () => {
    if (!selectedId) return;
    SoundManager.playItemChime();
    onSelectRelic(selectedId);
    onClose();
  };

  // Keyboard accessibility: Escape to close, Enter to confirm
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.code === 'Enter' && selectedId) {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Obsidian & Brass Artifact Frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#121016]/95 border border-[#8A6B3A]/60 shadow-2xl flex flex-col overflow-hidden text-left"
        style={{
          boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 24px 64px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* 4 Patinated Brass Corner Brackets */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#8A6B3A] pointer-events-none z-10" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#8A6B3A] pointer-events-none z-10" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#8A6B3A] pointer-events-none z-10" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#8A6B3A] pointer-events-none z-10" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#3A2E1D] flex items-center justify-between bg-[#0B0A0D]/90">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#C9A55C]" />
            <div>
              <h3 className="text-base sm:text-lg font-heading text-[#EDE3CB] tracking-wide">
                Новая игра+ · Наследие Реликвий
              </h3>
              <p className="text-xs font-prose italic text-[#8A6B3A]">
                Летопись «{world.title}» · Новый виток судьбы
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8A6B3A] hover:text-[#EDE3CB] hover:bg-[#1A1622] border border-transparent hover:border-[#3A2E1D] transition-colors cursor-pointer"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Description Banner */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-3 bg-[#0D0B0E]/90 border border-[#3A2E1D] text-xs font-prose leading-relaxed text-[#BAAC93]">
            <p>
              Вы завершили круг бытия. Начните новую хронологию с накопленным опытом: выберите{' '}
              <strong className="text-[#E8CF8A] font-semibold">одну реликвию</strong>, которая перейдёт с вами в новый цикл с полностью восстановленными зарядами. Все открытые финалы и древний кодекс сохранятся в летописи.
            </p>
          </div>

          {/* Relic Selection Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-heading uppercase tracking-widest text-[#C9A55C] block">
              Выберите реликвию для переноса сквозь эпохи:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {effectivePool.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      SoundManager.playClick();
                      setSelectedId(item.id);
                    }}
                    className={`p-3 border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer relative ${
                      isSelected
                        ? 'border-[#C9A55C] bg-[#1E1912] shadow-lg ring-1 ring-[#C9A55C]/50'
                        : 'border-[#3A2E1D] bg-[#0F0D13]/90 hover:border-[#8A6B3A] hover:bg-[#15121B]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-sm overflow-hidden bg-[#07060A] border border-[#8A6B3A]/60 shrink-0">
                          <img
                            src={getItemIllustration(item)}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className={`text-xs font-heading block line-clamp-1 ${isSelected ? 'text-[#EDE3CB]' : 'text-[#BAAC93]'}`}>
                            {item.name}
                          </span>
                          <span className="text-[10px] font-prose italic text-[#7D7362]">
                            {item.category || 'Реликвия'}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#C9A55C] shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-[#3A2E1D] shrink-0 mt-0.5" />
                      )}
                    </div>

                    <p className="text-[11px] font-prose text-[#8A7E6B] line-clamp-2 mt-2 leading-snug">
                      {item.description}
                    </p>

                    {item.maxCharges ? (
                      <span className="mt-2 text-[10px] font-heading tracking-wide text-[#C9A55C] block">
                        Заряды: {item.maxCharges} (будут восполнены)
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Item Lore Preview */}
          {selectedItem && (
            <div className="p-3 bg-[#0B0A0D] border border-[#3A2E1D] text-xs space-y-1">
              <span className="text-[10px] font-heading uppercase tracking-widest text-[#C9A55C] block">
                Священное наследие: {selectedItem.name}
              </span>
              <p className="text-[#BAAC93] font-prose italic text-[11px] leading-relaxed">
                «{selectedItem.loreNote || selectedItem.description}»
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#3A2E1D] flex items-center justify-end gap-2.5 bg-[#0B0A0D]/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#3A2E1D] hover:border-[#8A6B3A] text-xs font-heading uppercase tracking-wider text-[#BAAC93] hover:text-[#EDE3CB] bg-[#121016] transition cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedId}
            className="flex items-center gap-2 px-5 py-2 bg-[#1E1912] hover:bg-[#2F2618] active:bg-[#1E1912] border border-[#8A6B3A] hover:border-[#C9A55C] text-[#EDE3CB] hover:text-white font-heading text-xs uppercase tracking-widest transition duration-150 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 text-[#C9A55C]" />
            <span>Начать Новый Цикл (NG+)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
