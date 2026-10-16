import { useState, useMemo, useEffect } from 'react';
import { Item, WorldModule, GameSaveState } from '../types';
import { SoundManager } from './SoundManager';
import { useGameStore } from '../store/gameStore';

export type InventoryTab = 'all' | 'relics' | 'consumables' | 'keys' | 'weapons';
export type InventorySortOption = 'recent' | 'rarity' | 'name';

export interface UseInventoryLogicProps {
  inventory: Item[];
  world: WorldModule;
  state: GameSaveState;
  onUseItem: (itemId: string) => void;
  onInspectItem?: (item: Item) => void;
  onClose?: () => void;
  isCompactDrawer?: boolean;
}

export interface UseInventoryLogicResult {
  invTab: InventoryTab;
  setInvTab: (tab: InventoryTab) => void;
  sortBy: InventorySortOption;
  setSortBy: (sort: InventorySortOption) => void;
  filteredItems: Item[];
  sortedItems: Item[];
  selectedItemId: string;
  setSelectedItemId: (id: string) => void;
  activeItem: Item | null;
  isItemApplicableHere: (item: Item) => boolean;
  handleSelect: (item: Item) => void;
  handleUse: (item: Item) => void;
  flashingItemIds: string[];
}

export function useInventoryLogic({
  inventory,
  world,
  state,
  onUseItem,
  onInspectItem,
  onClose,
  isCompactDrawer = false,
}: UseInventoryLogicProps): UseInventoryLogicResult {
  const [invTab, setInvTab] = useState<InventoryTab>('all');
  const [sortBy, setSortBy] = useState<InventorySortOption>('recent');
  const currentScene = world.scenes[state.currentSceneId];
  const { flashingItemIds } = useGameStore();

  // Filter items by category
  const filteredItems = useMemo(() => {
    return (inventory || []).filter((item) => {
      if (invTab === 'relics') return item.category === 'Relic';
      if (invTab === 'consumables') return item.category === 'Consumable';
      if (invTab === 'keys') return item.category === 'Key' || item.category === 'Document';
      if (invTab === 'weapons') return item.category === 'Weapon';
      return true;
    });
  }, [inventory, invTab]);

  // Sort items: "Недавние" / "По редкости" / "По названию"
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    if (sortBy === 'recent') {
      return list.reverse();
    }
    if (sortBy === 'rarity') {
      const getRarityWeight = (item: Item) => {
        const r = item.rarity || (item.category === 'Relic' ? 'relic' : 'common');
        if (r === 'relic') return 3;
        if (r === 'rare') return 2;
        return 1;
      };
      return list.sort((a, b) => {
        const diff = getRarityWeight(b) - getRarityWeight(a);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name, 'ru');
      });
    }
    if (sortBy === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }
    return list;
  }, [filteredItems, sortBy]);

  const [selectedItemId, setSelectedItemId] = useState<string>(() => {
    return sortedItems[0]?.id || inventory[0]?.id || '';
  });

  // Keep selected item valid
  const activeItem = useMemo(() => {
    const found = sortedItems.find((i) => i.id === selectedItemId);
    if (found) return found;
    if (sortedItems.length > 0) return sortedItems[0];
    return null;
  }, [sortedItems, selectedItemId]);

  const isItemApplicableHere = (item: Item): boolean => {
    if (!item.usable || (item.charges !== undefined && item.charges <= 0)) return false;
    const hasChoiceWithItem = currentScene?.choices?.some(
      (c) => c.condition?.hasItem === item.id || c.condition?.hasItemsAll?.includes(item.id)
    );
    if (hasChoiceWithItem) return true;
    if (item.useAction?.applicableInScenes?.includes(state.currentSceneId)) return true;
    return item.category === 'Consumable';
  };

  const handleSelect = (item: Item) => {
    SoundManager.playClick();
    setSelectedItemId(item.id);
    if (onInspectItem && isCompactDrawer) {
      onInspectItem(item);
    }
  };

  const handleUse = (item: Item) => {
    if (!item.usable || (item.charges !== undefined && item.charges <= 0)) return;
    SoundManager.playItemChime();
    onUseItem(item.id);
  };

  // Keyboard navigation: arrows, Enter, U, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'Escape') {
        if (onClose) {
          e.preventDefault();
          onClose();
        }
        return;
      }

      if (sortedItems.length === 0) return;

      const currentIndex = sortedItems.findIndex((i) => i.id === (activeItem?.id || selectedItemId));
      const validIndex = currentIndex >= 0 ? currentIndex : 0;
      const cols = window.innerWidth >= 640 ? 4 : window.innerWidth >= 440 ? 3 : 2;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (validIndex + 1) % sortedItems.length;
        handleSelect(sortedItems[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (validIndex - 1 + sortedItems.length) % sortedItems.length;
        handleSelect(sortedItems[prevIdx]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = Math.min(sortedItems.length - 1, validIndex + cols);
        handleSelect(sortedItems[nextIdx]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = Math.max(0, validIndex - cols);
        handleSelect(sortedItems[prevIdx]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeItem) {
          handleSelect(activeItem);
          if (onInspectItem) {
            onInspectItem(activeItem);
          }
        }
      } else if (e.key === 'u' || e.key === 'U' || e.key === 'г' || e.key === 'Г') {
        e.preventDefault();
        if (activeItem && isItemApplicableHere(activeItem)) {
          handleUse(activeItem);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedItems, activeItem, selectedItemId, onClose, onInspectItem]);

  return {
    invTab,
    setInvTab,
    sortBy,
    setSortBy,
    filteredItems,
    sortedItems,
    selectedItemId,
    setSelectedItemId,
    activeItem,
    isItemApplicableHere,
    handleSelect,
    handleUse,
    flashingItemIds,
  };
}
