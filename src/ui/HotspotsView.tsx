import React, { useState } from 'react';
import { X, Search, Scroll } from 'lucide-react';
import { SceneHotspot, HeroAttributes } from '../types';
import { ATTRIBUTE_NAMES } from './tags';
import { SoundManager } from './SoundManager';
import { useGameStore } from '../store/gameStore';

interface HotspotsViewProps {
  hotspots: SceneHotspot[];
  hotspotsStatus: Record<string, 'uninspected' | 'inspected' | 'found'>;
  attributes: HeroAttributes;
  onInspectHotspot: (hotspot: SceneHotspot) => void;
  onClose: () => void;
}

export const HotspotsView: React.FC<HotspotsViewProps> = ({
  hotspots,
  hotspotsStatus,
  attributes,
  onInspectHotspot,
  onClose,
}) => {
  const { openCodexWithEntry } = useGameStore();
  const [selectedHotspot, setSelectedHotspot] = useState<SceneHotspot | null>(null);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between pointer-events-none animate-fadeIn">
      {/* Top Header Bar: Obsidian panel with tarnished brass border */}
      <div className="pointer-events-auto p-3 sm:p-4 flex items-center justify-between bg-[#121016]/90 backdrop-blur-md border-b border-[#4A3A22]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rotate-45 bg-[#B8924A]" />
          <h3 className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-[#E6DCC3]">
            Взор исследователя · Тайные ориентиры локации
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 bg-[#1A1720] border border-[#4A3A22] hover:border-[#8A6B3A] text-[#A89E88] hover:text-[#E6DCC3] transition"
          title="Вернуться к диалогу"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Markers: 14-16px double concentric brass rings with gentle breathing */}
      <div className="relative flex-1 pointer-events-auto overflow-hidden">
        {hotspots.map((h) => {
          const status = hotspotsStatus[h.id] || 'uninspected';
          const isSelected = selectedHotspot?.id === h.id;

          return (
            <div
              key={h.id}
              style={{
                left: `${h.position.x}%`,
                top: `${h.position.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              <button
                onClick={() => {
                  SoundManager.playClick();
                  setSelectedHotspot(h);
                }}
                className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                  status === 'found'
                    ? 'border border-[#C9A55C] bg-[#B8924A]/30'
                    : status === 'inspected'
                    ? 'border border-[#4A3A22] bg-[#1A1720]'
                    : 'border-2 border-[#C9A55C] bg-[#E0B25A]/20 hotspot-ring hover:scale-125'
                } ${isSelected ? 'ring-2 ring-[#C9A55C] scale-125' : ''}`}
                title={h.name}
              >
                {/* Inner concentric ring or center dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === 'found'
                      ? 'bg-[#C9A55C]'
                      : status === 'inspected'
                      ? 'bg-[#6E6657]'
                      : 'bg-[#B8924A]'
                  }`}
                />
              </button>

              {/* Hover label card */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                <span className="px-2 py-0.5 bg-[#121016]/95 border border-[#8A6B3A] text-[10px] font-heading uppercase text-[#B8924A] shadow-lg">
                  {h.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Detail Card (Obsidian & Brass Placard) */}
      <div className="pointer-events-auto p-4 max-w-2xl mx-auto w-full mb-16">
        <div className="brass-panel p-4 shadow-2xl backdrop-blur-xl">
          {selectedHotspot ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#E6DCC3] font-heading tracking-wide">
                    {selectedHotspot.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A89E88] font-prose mt-1 leading-relaxed">
                    {selectedHotspot.description}
                  </p>
                </div>
                <span className="text-[10px] font-heading px-2 py-0.5 uppercase tracking-wider border border-[#4A3A22] bg-[#1A1720] text-[#B8924A]">
                  {hotspotsStatus[selectedHotspot.id] === 'found'
                    ? 'Найдено'
                    : hotspotsStatus[selectedHotspot.id] === 'inspected'
                    ? 'Осмотрено'
                    : 'Не исследовано'}
                </span>
              </div>

              {selectedHotspot.check && (
                <div className="p-2 bg-[#121016] border border-[#4A3A22] text-[11px] font-heading text-[#A89E88] flex items-center justify-between">
                  <span>
                    Требуется проверка: {ATTRIBUTE_NAMES[selectedHotspot.check.attribute].ru}
                  </span>
                  <span className="text-[#C9A55C] font-bold">
                    КС {selectedHotspot.check.dc} (Ваше: {attributes[selectedHotspot.check.attribute]})
                  </span>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex justify-end gap-2 border-t border-[#4A3A22]">
                {/* 4. "В Кодексе" button if hotspot has linked codexId */}
                {selectedHotspot.codexId && (
                  <button
                    type="button"
                    onClick={() => {
                      SoundManager.playClick();
                      openCodexWithEntry(selectedHotspot.codexId);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#1A1720] border border-[#8A6B3A] hover:border-[#C9A55C] text-[#E8CF8A] hover:text-[#FFF1C5] font-heading font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 active:translate-y-px cursor-pointer"
                  >
                    <Scroll className="w-3.5 h-3.5 text-[#C9A55C]" />
                    <span>В Кодексе</span>
                  </button>
                )}
                <button
                  onClick={() => onInspectHotspot(selectedHotspot)}
                  disabled={hotspotsStatus[selectedHotspot.id] === 'found'}
                  className="px-4 py-1.5 bg-[#1A1720] border border-[#8A6B3A] hover:border-[#C9A55C] disabled:opacity-50 text-[#C9A55C] font-heading font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 active:translate-y-px"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {hotspotsStatus[selectedHotspot.id] === 'found'
                      ? 'Уже исследовано'
                      : 'Исследовать точку'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs font-prose text-[#A89E88] italic">
              Выберите мерцающее латунное кольцо на полотне локации, чтобы осмотреть скрытый тайник.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
