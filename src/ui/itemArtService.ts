/**
 * Item Art Generation & Caching Service
 * Manages serial generation queue (/api/item-art), IndexedDB caching,
 * and seamless fallback to procedural vector art.
 */
import { useEffect, useState } from 'react';
import { Item } from '../types';
import { getItemIllustration } from './itemIllustrations';

const DB_NAME = 'vaelen_item_art_db';
const DB_VERSION = 1;
const STORE_NAME = 'item_art';
const TIMEOUT_MS = 8000;

function computePromptHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}

export function buildItemArtPrompt(item: Item, artStylePrompt?: string): string {
  const rarity = item.rarity || (item.category === 'Relic' ? 'relic' : 'common');
  return [
    `Masterpiece dark fantasy RPG icon of item "${item.name}".`,
    `Category: ${item.category}.`,
    `Rarity: ${rarity}.`,
    `Description: ${item.description}.`,
    artStylePrompt ? `Art style: ${artStylePrompt}.` : '',
    `Dark chiaroscuro, centered object on dark textured background, ornate detailing, volumetric magical lighting, no text, no interface frames, square composition.`,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getItemArtCacheKey(worldId: string, itemId: string, prompt: string): string {
  return `${worldId}_${itemId}_${computePromptHash(prompt)}`;
}

class IndexedDBStorage {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private getDB(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const req = indexedDB.open(DB_NAME, DB_VERSION);
          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    }
    return this.dbPromise;
  }

  async get(key: string): Promise<string | null> {
    try {
      const db = await this.getDB();
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result?.imageUrl || null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  async set(key: string, imageUrl: string): Promise<void> {
    try {
      const db = await this.getDB();
      if (!db) return;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put({ key, imageUrl, timestamp: Date.now() });
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {}
  }
}

interface QueueTask {
  item: Item;
  worldId: string;
  artStylePrompt?: string;
  cacheKey: string;
}

class ItemArtServiceClass {
  private idb = new IndexedDBStorage();
  private memoryCache = new Map<string, string>();
  private checkedIdbKeys = new Set<string>();
  private generatingSet = new Set<string>(); // cacheKeys currently generating or queued
  private queue: QueueTask[] = [];
  private isProcessing = false;
  private listeners = new Set<() => void>();
  private failedSet = new Set<string>(); // Do not infinitely retry failed items in same session

  constructor() {
    // Service initialized
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  }

  public isGenerating(cacheKey: string): boolean {
    return this.generatingSet.has(cacheKey);
  }

  public getItemArt(
    item: Item,
    worldId: string,
    artStylePrompt?: string
  ): { artUrl: string; isGenerating: boolean; isGenerated: boolean } {
    // 1. If explicit illustrationUrl is present on item, prioritize it directly
    if (item.illustrationUrl && item.illustrationUrl.length > 5) {
      return {
        artUrl: item.illustrationUrl,
        isGenerating: false,
        isGenerated: true,
      };
    }

    const prompt = buildItemArtPrompt(item, artStylePrompt);
    const cacheKey = getItemArtCacheKey(worldId, item.id, prompt);

    // 2. In-memory cache hit
    if (this.memoryCache.has(cacheKey)) {
      return {
        artUrl: this.memoryCache.get(cacheKey)!,
        isGenerating: false,
        isGenerated: true,
      };
    }

    // 3. Check IDB asynchronously in background once per cacheKey
    this.checkIDBAsync(cacheKey);

    // 4. Default: Procedural SVG fallback
    return {
      artUrl: getItemIllustration(item),
      isGenerating: this.generatingSet.has(cacheKey),
      isGenerated: false,
    };
  }

  private async checkIDBAsync(cacheKey: string): Promise<void> {
    if (this.memoryCache.has(cacheKey) || this.checkedIdbKeys.has(cacheKey)) return;
    this.checkedIdbKeys.add(cacheKey);
    const cached = await this.idb.get(cacheKey);
    if (cached) {
      this.memoryCache.set(cacheKey, cached);
      this.notify();
    }
  }

  public requestItemArt(item: Item, worldId: string, artStylePrompt?: string): void {
    if (!item?.id) return;

    // If explicit illustrationUrl is set, no need to call API
    if (item.illustrationUrl && item.illustrationUrl.length > 5) return;

    const prompt = buildItemArtPrompt(item, artStylePrompt);
    const cacheKey = getItemArtCacheKey(worldId, item.id, prompt);

    // If already in memory cache, generating/queued, or marked failed, skip
    if (
      this.memoryCache.has(cacheKey) ||
      this.generatingSet.has(cacheKey) ||
      this.failedSet.has(cacheKey)
    ) {
      return;
    }

    // Reserve immediately to avoid duplicate concurrent IDB + queue scheduling
    this.generatingSet.add(cacheKey);
    this.checkedIdbKeys.add(cacheKey);

    // Check IDB first
    this.idb.get(cacheKey).then((cached) => {
      if (cached) {
        this.generatingSet.delete(cacheKey);
        this.memoryCache.set(cacheKey, cached);
        this.notify();
        return;
      }

      this.queue.push({ item, worldId, artStylePrompt, cacheKey });
      this.notify();
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const task = this.queue.shift();
    if (!task) {
      this.isProcessing = false;
      return;
    }

    const { item, artStylePrompt, cacheKey } = task;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch('/api/item-art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          rarity: item.rarity,
          artStylePrompt,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl && typeof data.imageUrl === 'string') {
          this.memoryCache.set(cacheKey, data.imageUrl);
          await this.idb.set(cacheKey, data.imageUrl);
        } else {
          this.failedSet.add(cacheKey);
        }
      } else {
        this.failedSet.add(cacheKey);
      }
    } catch {
      // Timeout or network error - mark failed to avoid retry thrashing
      this.failedSet.add(cacheKey);
    } finally {
      this.generatingSet.delete(cacheKey);
      this.isProcessing = false;
      this.notify();
      // Process next item in queue one by one
      this.processQueue();
    }
  }
}

export const itemArtService = new ItemArtServiceClass();

export function useItemArt(
  item: Item,
  worldId: string,
  artStylePrompt?: string
): { artUrl: string; isGenerating: boolean; isGenerated: boolean } {
  const [, setTick] = useState(0);

  useEffect(() => {
    itemArtService.requestItemArt(item, worldId, artStylePrompt);
    const unsubscribe = itemArtService.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, [item.id, worldId, artStylePrompt]);

  return itemArtService.getItemArt(item, worldId, artStylePrompt);
}
