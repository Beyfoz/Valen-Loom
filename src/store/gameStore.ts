import { create } from 'zustand';
import {
  WorldModule,
  GameSaveState,
  OracleModelTier,
  ChatMessage,
  SceneChoice,
  SceneNode,
  SceneHotspot,
  SkillCheck,
  Item,
  ItemRarity,
  ChoiceEffect,
  CodexEntry,
  GameEventLogEntry,
} from '../types';
import { WORLDS, getWorld } from '../worlds';
import { getDefaultWorldCodex, isCodexEntryUnlocked } from '../data/codexData';
import {
  createInitialState,
  applyChoice,
  useItemDirectly,
  loadSaveSlot,
  writeSaveSlot,
  canMakeChoice,
  inspectSceneHotspot,
  rollbackToChapterSnapshot,
  loadBeforeRollbackSlot,
} from '../engine/gameEngine';
import { getScenePages, getSceneFullText } from '../engine/pages';
import { artQueue, isCircuitBreakerActive } from '../ai/artQueue';
import { enrichSceneText, askOracle } from '../ai/geminiClient';
import { SoundManager } from '../ui/SoundManager';
import { itemArtService } from '../ui/itemArtService';
import {
  getSceneArtUrl,
  hasReadySceneArt,
  preloadReadySceneArts,
} from '../services/sceneArtManifest';

export type DrawerType =
  | 'none'
  | 'inventory'
  | 'quests'
  | 'worlds'
  | 'oracle'
  | 'saves'
  | 'settings';

export interface ChoiceOutcomeCardItem {
  id: string;
  name: string;
  category: string;
  rarity?: ItemRarity;
  item: Item;
}

export interface ChoiceOutcomeCard {
  id: string;
  timestamp: number;
  items: ChoiceOutcomeCardItem[];
  quests: string[];
  codexEntries: CodexEntry[];
  otherNotes: string[];
}

export type NotificationVerbosity = 'detailed' | 'brief' | 'important';

export interface GameNotification {
  id: string;
  text: string;
  type?: 'item' | 'damage' | 'quest' | 'info' | 'codex';
  item?: Item;
  codexEntry?: CodexEntry;
}

export interface SensoryBlockState {
  sensoryDetail: string;
  companionWhisper?: string;
  epilogueNote?: string;
}

export interface SceneArtEntry {
  id: string;
  worldId: string;
  sceneId: string;
  sceneTitle: string;
  location: string;
  url: string;
}

interface GameStoreState {
  worldId: string;
  state: GameSaveState;
  activeDrawer: DrawerType;
  modelTier: OracleModelTier;

  // Atmosphere / Sensory state (A1)
  enableAtmosphere: boolean;
  isSensoryOpen: boolean;
  activeSensory: SensoryBlockState | null;
  isEnriching: boolean;
  recentSensoryTexts: string[];

  // AI Art settings and state
  aiArtEnabled: boolean;
  setAiArtEnabled: (enabled: boolean) => void;
  aiArtQuality: 'fast' | 'quality';
  setAiArtQuality: (quality: 'fast' | 'quality') => void;
  artFailedNotice: string | null;
  setArtFailedNotice: (notice: string | null) => void;
  unlockedSceneArts: SceneArtEntry[];
  addSceneArtToGallery: (entry: SceneArtEntry) => void;

  // Visual Novel presentation state
  dialogueChunkIndex: number;
  sceneResetCounter: number;
  isTypewriterComplete: boolean;
  currentArtUrl: string;
  isArtLoading: boolean;
  screenShake: boolean;
  autoPlay: boolean;
  typewriterSpeedMs: number;
  fontSize: 'sm' | 'base' | 'lg';
  tagsLanguage: 'ru' | 'en';
  showChoiceBadgeHints: boolean;
  hasSeenBadgeHelpPrompt: boolean;
  inventoryViewMode: 'classic' | 'new';
  choiceDisplayMode: 'manual' | 'auto'; // 'manual' = «После нажатия» (default), 'auto' = «Сразу после текста»

  // Rewind (B6)
  rewindState: GameSaveState | null;
  canRewind: boolean;

  // Skill Check modal (B3)
  activeSkillCheck: SkillCheck | null;
  pendingChoice: SceneChoice | null;

  // Hotspots / Search mode (B2)
  showHotspots: boolean;

  // Modals (B4, B6, B7)
  activeCG: { id: string; title: string; subtitle: string; url: string } | null;
  showBacklog: boolean;
  showEndings: boolean;
  showGallery: boolean;
  showWorldSelect: boolean;
  showCodex: boolean;
  selectedCodexEntryId: string | null;
  showChapterChronicle: boolean;
  inspectedItemDetail: Item | null;
  isChapterStart: boolean;
  setIsChapterStart: (val: boolean) => void;

  // Oracle chat
  oracleMessages: ChatMessage[];
  isOracleLoading: boolean;

  // Toasts & Flashing
  notifications: GameNotification[];
  flashingItemIds: string[];
  outcomeCard: ChoiceOutcomeCard | null;
  companionToast: { name: string; delta: number; text?: string; key: number } | null;
  notificationVerbosity: NotificationVerbosity;
  targetedItemId: string | null; // When "Применить к…" is activated from inventory
  showEventLog: boolean;
  hasUnreadEvents: boolean;

  // Actions
  selectWorld: (worldId: string) => void;
  restartWorld: () => void;
  startNewGamePlus: (keptRelicId: string) => void;
  makeChoice: (choice: SceneChoice) => void;
  completeSkillCheck: (success: boolean) => void;
  cancelSkillCheck: () => void;
  useItem: (itemId: string) => void;
  inspectHotspot: (hotspot: SceneHotspot) => void;
  rewindChoice: () => void;
  advanceChunk: () => void;
  skipTypewriter: () => void;
  toggleAutoPlay: () => void;
  toggleSensoryOpen: () => void;
  setEnableAtmosphere: (val: boolean) => void;
  setTagsLanguage: (lang: 'ru' | 'en') => void;
  setFontSize: (size: 'sm' | 'base' | 'lg') => void;
  setTypewriterSpeedMs: (speed: number) => void;
  setNotificationVerbosity: (verbosity: NotificationVerbosity) => void;
  setTargetedItemId: (itemId: string | null) => void;
  dismissOutcomeCard: () => void;
  dismissCompanionToast: () => void;
  setShowEventLog: (show: boolean) => void;
  markEventsRead: () => void;
  openDrawer: (drawer: DrawerType) => void;
  closeDrawer: () => void;
  setShowHotspots: (val: boolean) => void;
  setShowBacklog: (val: boolean) => void;
  setShowEndings: (val: boolean) => void;
  setShowGallery: (val: boolean) => void;
  setShowWorldSelect: (val: boolean) => void;
  setShowCodex: (val: boolean) => void;
  setSelectedCodexEntryId: (id: string | null) => void;
  openCodexWithEntry: (entryId?: string) => void;
  markCodexEntryRead: (entryId: string) => void;
  setShowChapterChronicle: (val: boolean) => void;
  rollbackToChapter: (chapterId: string) => boolean;
  loadBeforeRollback: () => boolean;
  setActiveCG: (cg: { id: string; title: string; subtitle: string; url: string } | null) => void;
  setInspectedItemDetail: (item: Item | null) => void;
  setModelTier: (tier: OracleModelTier) => void;
  sendOracleMessage: (text: string) => Promise<void>;
  dismissNotification: (id: string) => void;
  loadStateFromSave: (save: GameSaveState) => void;
  setShowChoiceBadgeHints: (val: boolean) => void;
  setHasSeenBadgeHelpPrompt: (val: boolean) => void;
  setInventoryViewMode: (mode: 'classic' | 'new') => void;
  setChoiceDisplayMode: (mode: 'manual' | 'auto') => void;
  isAnyModalOpen: () => boolean;
}

// In-memory sensory cache by scene key (A1)
const inMemorySensoryCache = new Map<string, SensoryBlockState>();
let screenShakeTimer: ReturnType<typeof setTimeout> | null = null;

function computeStateHash(state: GameSaveState): string {
  const itemIds = state.inventory.map((i) => i.id).sort().join(',');
  return `${state.stats.health}_${state.stats.sanity}_${itemIds}`;
}

export function ensureCodexTrackingInitialized(worldId: string, save: GameSaveState): GameSaveState {
  const world = getWorld(worldId);
  const codex = world.codex && world.codex.length > 0 ? world.codex : getDefaultWorldCodex(worldId);
  const notified = new Set(save.notifiedCodexEntryIds || []);
  for (const entry of codex) {
    if (isCodexEntryUnlocked(entry, save)) {
      notified.add(entry.id);
    }
  }
  return {
    ...save,
    notifiedCodexEntryIds: Array.from(notified),
    readCodexEntryIds: save.readCodexEntryIds || [],
  };
}

export function processStateCodexUnlocks(
  worldId: string,
  state: GameSaveState
): { updatedState: GameSaveState; codexToasts: GameNotification[] } {
  const world = getWorld(worldId);
  const codex = world.codex && world.codex.length > 0 ? world.codex : getDefaultWorldCodex(worldId);
  const notified = new Set(state.notifiedCodexEntryIds || []);
  const codexToasts: GameNotification[] = [];

  for (const entry of codex) {
    if (isCodexEntryUnlocked(entry, state) && !notified.has(entry.id)) {
      notified.add(entry.id);
      codexToasts.push({
        id: `toast-codex-${Date.now()}-${entry.id}`,
        text: `Запись добавлена в Кодекс: ${entry.title}`,
        type: 'codex',
        codexEntry: entry,
      });
    }
  }

  if (codexToasts.length > 0) {
    SoundManager.playLevelUp();
    return {
      updatedState: {
        ...state,
        notifiedCodexEntryIds: Array.from(notified),
      },
      codexToasts,
    };
  }

  return { updatedState: state, codexToasts: [] };
}

const initialWorld = WORLDS['vaelen'];
const rawInitialSave = loadSaveSlot('vaelen') || createInitialState(initialWorld);
const initialSave = ensureCodexTrackingInitialized('vaelen', rawInitialSave);

// Read localStorage settings
const storedAiArtEnabled =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('vaelen_ai_art_enabled') === 'true'
    : false;
const storedEnableAtmosphere = (() => {
  if (typeof localStorage === 'undefined') return storedAiArtEnabled;
  const raw = localStorage.getItem('vaelen_enable_atmosphere');
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return storedAiArtEnabled;
})();
const storedTagsLang =
  (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('vaelen_tags_lang') as 'ru' | 'en')
    : 'ru') || 'ru';
const storedBadgeHints =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('vaelen_badge_hints') !== 'false'
    : true;
const storedSeenBadgePrompt =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('vaelen_seen_badge_prompt') === 'true'
    : false;
const storedInventoryViewMode =
  (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('vaelen_inventory_view_mode') as 'classic' | 'new')
    : 'classic') || 'classic';
const storedChoiceDisplayMode =
  (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('vaelen_choice_display_mode') as 'manual' | 'auto')
    : 'manual') || 'manual';
const storedNotificationVerbosity =
  (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('vaelen_notification_verbosity') as NotificationVerbosity)
    : 'brief') || 'brief';
const storedFontSize: 'sm' | 'base' | 'lg' = (() => {
  if (typeof localStorage === 'undefined') return 'base';
  const raw = localStorage.getItem('vaelen_font_size');
  return raw === 'sm' || raw === 'base' || raw === 'lg' ? raw : 'base';
})();
const storedTypewriterSpeedMs: number = (() => {
  if (typeof localStorage === 'undefined') return 20;
  const raw = localStorage.getItem('vaelen_typewriter_speed_ms');
  if (raw === null) return 20;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 60 ? parsed : 20;
})();

export const useGameStore = create<GameStoreState>((set, get) => ({
  worldId: initialSave.worldId,
  state: initialSave,
  activeDrawer: 'none',
  modelTier: 'gemini-2.5-flash',

  enableAtmosphere: storedEnableAtmosphere,
  isSensoryOpen: false,
  activeSensory: null,
  isEnriching: false,
  recentSensoryTexts: [],

  // AI Art settings and state
  aiArtEnabled: storedAiArtEnabled,
  setAiArtEnabled: (aiArtEnabled: boolean) => {
    try {
      localStorage.setItem('vaelen_ai_art_enabled', String(aiArtEnabled));
    } catch {}
    set({ aiArtEnabled });
  },
  aiArtQuality: 'fast',
  setAiArtQuality: (aiArtQuality: 'fast' | 'quality') => set({ aiArtQuality }),
  artFailedNotice: null,
  setArtFailedNotice: (artFailedNotice: string | null) => set({ artFailedNotice }),
  unlockedSceneArts: [],
  addSceneArtToGallery: (entry: SceneArtEntry) =>
    set((s) => ({
      unlockedSceneArts: [...s.unlockedSceneArts.filter((a) => a.id !== entry.id), entry],
    })),

  dialogueChunkIndex: 0,
  sceneResetCounter: 0,
  isTypewriterComplete: false,
  currentArtUrl: getSceneArtUrl(
    initialWorld.scenes[initialSave.currentSceneId],
    initialWorld
  ),
  isArtLoading: false,
  screenShake: false,
  autoPlay: false,
  typewriterSpeedMs: storedTypewriterSpeedMs,
  fontSize: storedFontSize,
  tagsLanguage: storedTagsLang,
  showChoiceBadgeHints: storedBadgeHints,
  hasSeenBadgeHelpPrompt: storedSeenBadgePrompt,
  inventoryViewMode: storedInventoryViewMode,
  choiceDisplayMode: storedChoiceDisplayMode,
  notificationVerbosity: storedNotificationVerbosity,

  outcomeCard: null,
  companionToast: null,
  targetedItemId: null,
  showEventLog: false,
  hasUnreadEvents: false,

  rewindState: null,
  canRewind: false,

  activeSkillCheck: null,
  pendingChoice: null,

  showHotspots: false,
  activeCG: null,
  showBacklog: false,
  showEndings: false,
  showGallery: false,
  showWorldSelect: false,
  showCodex: false,
  selectedCodexEntryId: null,
  showChapterChronicle: false,
  inspectedItemDetail: null,
  isChapterStart: true,
  setIsChapterStart: (isChapterStart: boolean) => set({ isChapterStart }),

  oracleMessages: [
    {
      id: 'oracle-welcome',
      role: 'model',
      text:
        'Приветствую, путник. Я — Оракул и Хранитель летописи. Задавайте вопросы о тайнах мира, мотивах фракций или скрытых свойствах найденных реликвий.',
      modelUsed: 'gemini-2.5-flash',
      personaName: 'Хранитель Летописи',
      timestamp: 'Начало',
    },
  ],
  isOracleLoading: false,
  notifications: [],
  flashingItemIds: [],

  selectWorld: (newWorldId: string) => {
    const world = getWorld(newWorldId);
    const rawSave = loadSaveSlot(newWorldId) || createInitialState(world);
    const existingSave = ensureCodexTrackingInitialized(newWorldId, rawSave);
    const scene = world.scenes[existingSave.currentSceneId] || world.scenes[world.startSceneId];

    if (scene?.choices) {
      preloadReadySceneArts(scene.choices.map((c) => c.targetSceneId).filter(Boolean));
    }

    set((s) => ({
      worldId: newWorldId,
      state: existingSave,
      dialogueChunkIndex: 0,
      sceneResetCounter: s.sceneResetCounter + 1,
      isTypewriterComplete: false,
      currentArtUrl: getSceneArtUrl(scene, world),
      isArtLoading: false,
      activeDrawer: 'none',
      showWorldSelect: false,
      selectedCodexEntryId: null,
      showCodex: false,
      showHotspots: false,
      showBacklog: false,
      showEndings: false,
      showGallery: false,
      showChapterChronicle: false,
      inspectedItemDetail: null,
      activeSkillCheck: null,
      pendingChoice: null,
      targetedItemId: null,
      outcomeCard: null,
      companionToast: null,
      activeSensory: null,
      isSensoryOpen: false,
      isEnriching: false,
      rewindState: null,
      canRewind: false,
      activeCG: scene?.cgIllustration || null,
      isChapterStart: true,
      isOracleLoading: false,
      oracleMessages: [
        {
          id: `oracle-welcome-${newWorldId}`,
          role: 'model',
          text: `Летопись открыта в мире «${world.title}». Задавайте вопросы о тайнах этого мира и реликвиях героя ${world.protagonist.name}.`,
          modelUsed: s.modelTier,
          personaName: 'Хранитель Летописи',
          timestamp: 'Готов',
        },
      ],
    }));

    writeSaveSlot(existingSave);
    SoundManager.startAmbient(newWorldId);
  },

  restartWorld: () => {
    const { worldId, state } = get();
    const world = getWorld(worldId);
    const fresh = ensureCodexTrackingInitialized(worldId, createInitialState(world));
    fresh.unlockedEndings = Array.from(new Set([...(state.unlockedEndings || [])]));
    fresh.unlockedCGs = Array.from(new Set([...(state.unlockedCGs || [])]));
    const startScene = world.scenes[fresh.currentSceneId];

    if (startScene?.choices) {
      preloadReadySceneArts(startScene.choices.map((c) => c.targetSceneId).filter(Boolean));
    }

    set((s) => ({
      state: fresh,
      dialogueChunkIndex: 0,
      sceneResetCounter: s.sceneResetCounter + 1,
      isTypewriterComplete: false,
      currentArtUrl: getSceneArtUrl(startScene, world),
      isArtLoading: false,
      activeDrawer: 'none',
      showWorldSelect: false,
      selectedCodexEntryId: null,
      showCodex: false,
      showHotspots: false,
      showBacklog: false,
      showEndings: false,
      showGallery: false,
      showChapterChronicle: false,
      inspectedItemDetail: null,
      activeSkillCheck: null,
      pendingChoice: null,
      targetedItemId: null,
      outcomeCard: null,
      companionToast: null,
      activeSensory: null,
      isSensoryOpen: false,
      isEnriching: false,
      rewindState: null,
      canRewind: false,
      activeCG: startScene?.cgIllustration || null,
      isChapterStart: true,
    }));

    writeSaveSlot(fresh);
  },

  startNewGamePlus: (keptRelicId: string) => {
    const { worldId, state } = get();
    const world = getWorld(worldId);
    const freshRaw = createInitialState(world);
    freshRaw.unlockedEndings = Array.from(new Set([...(state.unlockedEndings || [])]));
    freshRaw.unlockedCGs = Array.from(new Set([...(state.unlockedCGs || [])]));
    const keptItem = state.inventory.find((i) => i.id === keptRelicId);
    if (keptItem) {
      const idx = freshRaw.inventory.findIndex((i) => i.id === keptItem.id);
      if (idx >= 0) {
        freshRaw.inventory[idx] = {
          ...keptItem,
          charges: keptItem.maxCharges || keptItem.charges,
        };
      } else {
        freshRaw.inventory.push({
          ...keptItem,
          charges: keptItem.maxCharges || keptItem.charges,
        });
      }
    }
    freshRaw.newGamePlusRelicId = keptRelicId;
    const fresh = ensureCodexTrackingInitialized(worldId, freshRaw);
    const startScene = world.scenes[fresh.currentSceneId];

    if (startScene?.choices) {
      preloadReadySceneArts(startScene.choices.map((c) => c.targetSceneId).filter(Boolean));
    }

    writeSaveSlot(fresh);
    set((s) => ({
      worldId,
      state: fresh,
      dialogueChunkIndex: 0,
      sceneResetCounter: s.sceneResetCounter + 1,
      isTypewriterComplete: false,
      currentArtUrl: getSceneArtUrl(startScene, world),
      isArtLoading: false,
      activeDrawer: 'none',
      showWorldSelect: false,
      selectedCodexEntryId: null,
      showCodex: false,
      showHotspots: false,
      showBacklog: false,
      showEndings: false,
      showGallery: false,
      showChapterChronicle: false,
      inspectedItemDetail: null,
      activeSkillCheck: null,
      pendingChoice: null,
      targetedItemId: null,
      outcomeCard: null,
      companionToast: null,
      activeSensory: null,
      isSensoryOpen: false,
      isEnriching: false,
      rewindState: null,
      canRewind: false,
      activeCG: startScene?.cgIllustration || null,
      isChapterStart: true,
      notifications: [
        ...s.notifications,
        {
          id: `toast-ng-${Date.now()}`,
          text: `Новая игра+ начата! Реликвия «${keptItem?.name || ''}» перенесена в новую хронологию.`,
          type: 'item',
        },
      ],
    }));
  },

  makeChoice: (choice: SceneChoice) => {
    const { worldId, state } = get();
    const world = getWorld(worldId);

    // Check availability
    const check = canMakeChoice(choice, state, world);
    if (!check.allowed) {
      SoundManager.playDamage();
      set((s) => ({
        notifications: [
          ...s.notifications,
          {
            id: `toast-${Date.now()}`,
            text: check.reason || 'Выбор недоступен',
            type: 'info',
          },
        ],
      }));
      return;
    }

    // Skill Check trigger (Block B3)
    if (choice.skillCheck) {
      set({
        activeSkillCheck: choice.skillCheck,
        pendingChoice: choice,
      });
      return;
    }

    // Verify target scene exists before applying state changes
    const targetSceneId = choice.targetSceneId;
    if (!world.scenes[targetSceneId]) {
      console.error(
        `[Story Engine] Target scene not found! Current scene: "${state.currentSceneId}", choice: "${choice.id}", missing targetSceneId: "${targetSceneId}"`
      );
      SoundManager.playDamage();
      set((s) => ({
        notifications: [
          ...s.notifications,
          {
            id: `toast-missing-${Date.now()}`,
            text: `Эта сцена ещё не написана (id: ${targetSceneId})`,
            type: 'damage',
          },
        ],
      }));
      return;
    }

    // Save rewind state before applying choice
    const rewindSnapshot: GameSaveState = JSON.parse(JSON.stringify(state));

    SoundManager.playClick();
    const { nextState, notifications, screenShake, outcomeSummary } = applyChoice(world, choice, state);
    const { updatedState, codexToasts } = processStateCodexUnlocks(world.id, nextState);

    const currentScene = world.scenes[state.currentSceneId];
    const nextScene = world.scenes[updatedState.currentSceneId];
    const currentGroup = currentScene?.chapterTitle ? currentScene.chapterTitle.split(':')[0].trim() : '';
    const nextGroup = nextScene?.chapterTitle ? nextScene.chapterTitle.split(':')[0].trim() : '';
    const isNewChapter = Boolean(nextGroup && nextGroup !== currentGroup);

    // Detect genuinely new items acquired in this turn
    const prevItemIds = new Set(state.inventory.map((i) => i.id));
    const newlyAddedItems = nextState.inventory.filter((i) => !prevItemIds.has(i.id));

    if (newlyAddedItems.length > 0) {
      const newFlashIds = newlyAddedItems.map((i) => i.id);
      set((s) => ({
        flashingItemIds: Array.from(new Set([...s.flashingItemIds, ...newFlashIds])),
      }));
      setTimeout(() => {
        set((s) => ({
          flashingItemIds: s.flashingItemIds.filter((id) => !newFlashIds.includes(id)),
        }));
      }, 2500);
    }

    // Build Event Log entries for history log
    const nowTimeStr = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const newLogEntries: GameEventLogEntry[] = [];

    if (outcomeSummary.healthDeltaTotal < 0) {
      newLogEntries.push({
        id: `ev-${Date.now()}-hp`,
        timestamp: nowTimeStr,
        icon: 'damage',
        title: `Урон: ${outcomeSummary.healthDeltaTotal} ОЗ`,
      });
    } else if (outcomeSummary.healthDeltaTotal > 0) {
      newLogEntries.push({
        id: `ev-${Date.now()}-hp`,
        timestamp: nowTimeStr,
        icon: 'heal',
        title: `Восстановлено: +${outcomeSummary.healthDeltaTotal} ОЗ`,
      });
    }

    if (outcomeSummary.sanityDeltaTotal < 0) {
      newLogEntries.push({
        id: `ev-${Date.now()}-san`,
        timestamp: nowTimeStr,
        icon: 'damage',
        title: `Утрата рассудка: ${outcomeSummary.sanityDeltaTotal}`,
      });
    } else if (outcomeSummary.sanityDeltaTotal > 0) {
      newLogEntries.push({
        id: `ev-${Date.now()}-san`,
        timestamp: nowTimeStr,
        icon: 'heal',
        title: `Рассудок укреплён: +${outcomeSummary.sanityDeltaTotal}`,
      });
    }

    if (outcomeSummary.companionDelta) {
      const sign = outcomeSummary.companionDelta.delta > 0 ? `+${outcomeSummary.companionDelta.delta}` : `${outcomeSummary.companionDelta.delta}`;
      newLogEntries.push({
        id: `ev-${Date.now()}-comp`,
        timestamp: nowTimeStr,
        icon: 'companion',
        title: `${outcomeSummary.companionDelta.name} (${sign})`,
        details: outcomeSummary.companionDelta.toast,
      });
    }

    for (const item of outcomeSummary.itemsAcquired) {
      newLogEntries.push({
        id: `ev-${Date.now()}-item-${item.id}`,
        timestamp: nowTimeStr,
        icon: 'item',
        title: `Получен предмет: ${item.name}`,
        details: item.rarity ? `Редкость: ${item.rarity}` : item.category,
      });
    }

    for (const q of outcomeSummary.questUpdates) {
      newLogEntries.push({
        id: `ev-${Date.now()}-q-${Math.random()}`,
        timestamp: nowTimeStr,
        icon: 'quest',
        title: q,
      });
    }

    for (const cx of codexToasts) {
      if (cx.codexEntry) {
        newLogEntries.push({
          id: `ev-${Date.now()}-cx-${cx.codexEntry.id}`,
          timestamp: nowTimeStr,
          icon: 'codex',
          title: `Кодекс: ${cx.codexEntry.title}`,
        });
      }
    }

    if (outcomeSummary.customNotification) {
      newLogEntries.push({
        id: `ev-${Date.now()}-note`,
        timestamp: nowTimeStr,
        icon: 'info',
        title: outcomeSummary.customNotification,
      });
    }

    // Save event log into state (limit to last 50)
    const existingLog = updatedState.eventLog || [];
    const mergedLog = [...existingLog, ...newLogEntries].slice(-50);
    updatedState.eventLog = mergedLog;
    writeSaveSlot(updatedState);

    // 2. Companion chip
    if (outcomeSummary.companionDelta) {
      const toastKey = Date.now();
      set({
        companionToast: {
          name: outcomeSummary.companionDelta.name,
          delta: outcomeSummary.companionDelta.delta,
          text: outcomeSummary.companionDelta.toast,
          key: toastKey,
        },
      });
      setTimeout(() => {
        if (get().companionToast?.key === toastKey) {
          get().dismissCompanionToast();
        }
      }, 3000);
    }

    // 3. Single "Итог выбора" card: items, quests, codex, custom note
    const verbosity = get().notificationVerbosity;
    const cardItems: ChoiceOutcomeCardItem[] = outcomeSummary.itemsAcquired.map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      rarity: i.rarity,
      item: i,
    }));

    const cardQuests = verbosity === 'important' ? [] : outcomeSummary.questUpdates;
    const cardCodex = verbosity === 'important' ? [] : codexToasts.map((t) => t.codexEntry!).filter(Boolean);
    const cardNotes = verbosity === 'detailed' && outcomeSummary.customNotification
      ? [outcomeSummary.customNotification]
      : [];

    const hasCardContent =
      cardItems.length > 0 || cardQuests.length > 0 || cardCodex.length > 0 || cardNotes.length > 0;

    if (hasCardContent) {
      const prevCard = get().outcomeCard;
      const isWithin2Sec = prevCard && Date.now() - prevCard.timestamp < 2000;

      if (isWithin2Sec && prevCard) {
        // Merge into current card, avoid duplicates
        const existingItemIds = new Set(prevCard.items.map((i) => i.id));
        const newItemsToAdd = cardItems.filter((i) => !existingItemIds.has(i.id));

        const existingQuests = new Set(prevCard.quests);
        const newQuestsToAdd = cardQuests.filter((q) => !existingQuests.has(q));

        const existingCodexIds = new Set(prevCard.codexEntries.map((c) => c.id));
        const newCodexToAdd = cardCodex.filter((c) => !existingCodexIds.has(c.id));

        const existingNotes = new Set(prevCard.otherNotes);
        const newNotesToAdd = cardNotes.filter((n) => !existingNotes.has(n));

        set({
          outcomeCard: {
            ...prevCard,
            timestamp: Date.now(),
            items: [...prevCard.items, ...newItemsToAdd],
            quests: [...prevCard.quests, ...newQuestsToAdd],
            codexEntries: [...prevCard.codexEntries, ...newCodexToAdd],
            otherNotes: [...prevCard.otherNotes, ...newNotesToAdd],
          },
          hasUnreadEvents: true,
        });
      } else {
        set({
          outcomeCard: {
            id: `card-${Date.now()}`,
            timestamp: Date.now(),
            items: cardItems,
            quests: cardQuests,
            codexEntries: cardCodex,
            otherNotes: cardNotes,
          },
          hasUnreadEvents: true,
        });
      }
    } else if (newLogEntries.length > 0) {
      set({ hasUnreadEvents: true });
    }

    // Sound priority: Damage > Item > Quest > LevelUp (Codex)
    if (outcomeSummary.healthDeltaTotal < 0 || outcomeSummary.sanityDeltaTotal < 0) {
      SoundManager.playDamage();
    } else if (cardItems.length > 0) {
      SoundManager.playItemAcquired();
    } else if (cardQuests.length > 0) {
      SoundManager.playItemChime();
    } else if (cardCodex.length > 0) {
      SoundManager.playLevelUp();
    }

    // Trigger visual art generation only if aiArtEnabled is turned on
    const isAiArtActive = get().aiArtEnabled;
    set((s) => ({
      state: updatedState,
      dialogueChunkIndex: 0,
      sceneResetCounter: s.sceneResetCounter + 1,
      isTypewriterComplete: false,
      activeSensory: null,
      isSensoryOpen: false,
      screenShake,
      isArtLoading: isAiArtActive,
      rewindState: rewindSnapshot,
      canRewind: true,
      activeCG: nextScene?.cgIllustration || null,
      isChapterStart: isNewChapter,
      targetedItemId: null,
    }));

    if (screenShake) {
      if (screenShakeTimer) clearTimeout(screenShakeTimer);
      screenShakeTimer = setTimeout(() => {
        set({ screenShake: false });
        screenShakeTimer = null;
      }, 600);
    }

    const hasReadyArt = nextScene ? hasReadySceneArt(nextScene.id) : false;
    const readyArtUrl = getSceneArtUrl(nextScene, world);

    if (nextScene?.choices) {
      preloadReadySceneArts(nextScene.choices.map((c) => c.targetSceneId).filter(Boolean));
    }

    if (hasReadyArt) {
      set({
        currentArtUrl: readyArtUrl,
        isArtLoading: false,
      });
      if (nextScene) {
        get().addSceneArtToGallery({
          id: `${world.id}_${nextScene.id}`,
          worldId: world.id,
          sceneId: nextScene.id,
          sceneTitle: nextScene.chapterTitle || nextScene.location,
          location: nextScene.location,
          url: readyArtUrl,
        });
      }
    } else if (isAiArtActive && nextScene) {
      const targetWorldId = world.id;
      const targetId = nextScene.id;
      artQueue.requestSceneArt({
        world,
        scene: nextScene,
        choice,
        aiArtEnabled: true,
        quality: get().aiArtQuality,
        onSuccess: (url, isStub) => {
          const cur = get();
          if (cur.worldId === targetWorldId && cur.state.currentSceneId === targetId) {
            set({ currentArtUrl: url, isArtLoading: Boolean(isStub) });
          }
          if (!isStub && url) {
            get().addSceneArtToGallery({
              id: `${targetWorldId}_${targetId}`,
              worldId: targetWorldId,
              sceneId: targetId,
              sceneTitle: nextScene.chapterTitle || nextScene.location,
              location: nextScene.location,
              url,
            });
          }
        },
        onError: () => {
          const cur = get();
          if (cur.worldId === targetWorldId && cur.state.currentSceneId === targetId) {
            set({
              currentArtUrl: readyArtUrl,
              isArtLoading: false,
            });
          }
        },
      });

      artQueue.preloadNextScenes(world, nextScene, true, get().aiArtQuality);
    } else {
      set({
        currentArtUrl: readyArtUrl,
        isArtLoading: false,
      });
    }

    // Epilogue check for ending scene
    if (nextScene && nextScene.isEnding) {
      set({
        activeSensory: {
          sensoryDetail: '',
          epilogueNote: nextScene.endingEpilogue || `Эпилог: «${nextScene.endingTitle || 'Завершение'}». Ваши деяния навечно изменили ткань мира.`,
        },
        isEnriching: false,
      });
    } else {
      set({ activeSensory: null, isEnriching: false });
    }
  },

  completeSkillCheck: (success: boolean) => {
    const { activeSkillCheck, pendingChoice, worldId, state } = get();
    if (!activeSkillCheck || !pendingChoice) return;

    // Immediately close the skill check modal
    set({ activeSkillCheck: null, pendingChoice: null });

    const world = getWorld(worldId);

    // Determine targetSceneId safely based on outcome
    let nextTargetId = success
      ? (activeSkillCheck.passTargetSceneId || pendingChoice.targetSceneId)
      : (activeSkillCheck.failTargetSceneId || pendingChoice.targetSceneId);

    // If targetSceneId does not exist in world scenes, notify and abort
    if (!nextTargetId || !world.scenes[nextTargetId]) {
      console.error(
        `[Story Engine] SkillCheck target scene not found! Current scene: "${state.currentSceneId}", choice: "${pendingChoice.id}", missing targetSceneId: "${nextTargetId}"`
      );
      SoundManager.playDamage();
      set((s) => ({
        notifications: [
          ...s.notifications,
          {
            id: `toast-missing-${Date.now()}`,
            text: `Эта сцена ещё не написана (id: ${nextTargetId || 'undefined'})`,
            type: 'damage',
          },
        ],
        activeSkillCheck: null,
        pendingChoice: null,
      }));
      return;
    }

    // Determine consequence effects on failure if no explicit failEffect is configured
    let outcomeEffect: ChoiceEffect = success
      ? (activeSkillCheck.passEffect || {})
      : (activeSkillCheck.failEffect || {});

    if (!success && !activeSkillCheck.failEffect) {
      const msg = activeSkillCheck.failMessage || '';
      const hpMatch = msg.match(/-(\d+)\s*(?:HP|хп|ОЗ|здоровь)/i);
      const sanityMatch = msg.match(/-(\d+)\s*(?:рассуд|sanity)/i);
      const autoDelta: ChoiceEffect = {};
      if (hpMatch) {
        autoDelta.healthDelta = -parseInt(hpMatch[1], 10);
      } else if (!activeSkillCheck.failTargetSceneId) {
        autoDelta.healthDelta = -10;
      }
      if (sanityMatch) {
        autoDelta.sanityDelta = -parseInt(sanityMatch[1], 10);
      }
      outcomeEffect = autoDelta;
    }

    const baseEffect = pendingChoice.effect || {};
    const mergedFlagsSet = Array.from(
      new Set([...(baseEffect.flagsSet || []), ...(outcomeEffect.flagsSet || [])])
    );
    const mergedFlagsUnset = Array.from(
      new Set([...(baseEffect.flagsUnset || []), ...(outcomeEffect.flagsUnset || [])])
    );
    const mergedItemsAdded = [
      ...(baseEffect.itemsAdded || []),
      ...(outcomeEffect.itemsAdded || []),
    ];
    const mergedItemsRemoved = [
      ...(baseEffect.itemsRemoved || []),
      ...(outcomeEffect.itemsRemoved || []),
    ];

    const resolvedChoice: SceneChoice = {
      ...pendingChoice,
      skillCheck: undefined, // CRITICAL: remove skillCheck so makeChoice executes instead of re-opening modal!
      targetSceneId: nextTargetId,
      effect: {
        ...baseEffect,
        ...outcomeEffect,
        ...(mergedFlagsSet.length > 0 ? { flagsSet: mergedFlagsSet } : {}),
        ...(mergedFlagsUnset.length > 0 ? { flagsUnset: mergedFlagsUnset } : {}),
        ...(mergedItemsAdded.length > 0 ? { itemsAdded: mergedItemsAdded } : {}),
        ...(mergedItemsRemoved.length > 0 ? { itemsRemoved: mergedItemsRemoved } : {}),
        notification:
          outcomeEffect.notification ||
          (success
            ? activeSkillCheck.passMessage || 'Проверка пройдена успешно!'
            : activeSkillCheck.failMessage || 'Проверка провалена, но сюжет продолжается!'),
      },
    };

    get().makeChoice(resolvedChoice);
  },

  cancelSkillCheck: () => {
    set({ activeSkillCheck: null, pendingChoice: null });
  },

  rewindChoice: () => {
    const { rewindState, canRewind, worldId } = get();
    if (!canRewind || !rewindState) return;

    SoundManager.playClick();
    const world = getWorld(worldId);
    const scene = world.scenes[rewindState.currentSceneId];

    writeSaveSlot(rewindState);
    if (scene?.choices) {
      preloadReadySceneArts(scene.choices.map((c) => c.targetSceneId).filter(Boolean));
    }
    set((s) => ({
      state: rewindState,
      dialogueChunkIndex: 0,
      sceneResetCounter: s.sceneResetCounter + 1,
      isTypewriterComplete: false,
      currentArtUrl: getSceneArtUrl(scene, world),
      canRewind: false,
      rewindState: null,
      activeSensory: null,
      isSensoryOpen: false,
      notifications: [
        ...s.notifications,
        { id: `toast-rewind-${Date.now()}`, text: 'Действие отменено (откат на 1 шаг)', type: 'info' },
      ],
    }));
  },

  inspectHotspot: (hotspot: SceneHotspot) => {
    const { state, worldId } = get();
    SoundManager.playClick();
    const { nextState, success, message } = inspectSceneHotspot(hotspot, state);
    const { updatedState, codexToasts } = processStateCodexUnlocks(worldId, nextState);
    writeSaveSlot(updatedState);

    if (success) {
      SoundManager.playItemChime();
    } else {
      SoundManager.playDamage();
    }

    set((s) => ({
      state: updatedState,
      notifications: [
        ...s.notifications,
        { id: `toast-spot-${Date.now()}`, text: message, type: success ? 'item' : 'info' },
        ...codexToasts,
      ],
    }));
  },

  useItem: (itemId: string) => {
    const { worldId, state } = get();
    const world = getWorld(worldId);

    SoundManager.playClick();
    const { nextState, notification } = useItemDirectly(world, itemId, state);
    const { updatedState, codexToasts } = processStateCodexUnlocks(worldId, nextState);
    writeSaveSlot(updatedState);

    const currentScene = world.scenes[updatedState.currentSceneId];

    set((s) => ({
      state: updatedState,
      notifications: [
        ...s.notifications,
        { id: `toast-${Date.now()}`, text: notification, type: 'item' },
        ...codexToasts,
      ],
    }));

    if (notification.includes('+')) {
      SoundManager.playItemChime();
    }

    if (nextState.currentSceneId !== state.currentSceneId) {
      if (currentScene?.choices) {
        preloadReadySceneArts(currentScene.choices.map((c) => c.targetSceneId).filter(Boolean));
      }
      set((s) => ({
        dialogueChunkIndex: 0,
        sceneResetCounter: s.sceneResetCounter + 1,
        isTypewriterComplete: false,
        currentArtUrl: getSceneArtUrl(currentScene, world),
        activeSensory: null,
        isSensoryOpen: false,
      }));
    }
  },

  advanceChunk: () => {
    const { dialogueChunkIndex, state, worldId, isTypewriterComplete } = get();
    const world = getWorld(worldId);
    const scene = world.scenes[state.currentSceneId];
    if (!scene) return;

    if (!isTypewriterComplete) {
      set({ isTypewriterComplete: true });
      return;
    }

    const pages = getScenePages(scene, state);
    if (dialogueChunkIndex < pages.length - 1) {
      SoundManager.playClick();
      set({
        dialogueChunkIndex: dialogueChunkIndex + 1,
        isTypewriterComplete: false,
      });
    }
  },

  skipTypewriter: () => {
    set({ isTypewriterComplete: true });
  },

  toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
  toggleSensoryOpen: () => {
    const { isSensoryOpen, enableAtmosphere, activeSensory, isEnriching, worldId, state, modelTier, recentSensoryTexts } = get();
    const nextSensoryOpen = !isSensoryOpen;
    set({ isSensoryOpen: nextSensoryOpen });

    if (nextSensoryOpen && enableAtmosphere && !activeSensory && !isEnriching && !isCircuitBreakerActive()) {
      const world = getWorld(worldId);
      const scene = world.scenes[state.currentSceneId];
      if (scene && !scene.isEnding) {
        const cacheKey = `${scene.id}_${modelTier}_${computeStateHash(state)}`;
        if (inMemorySensoryCache.has(cacheKey)) {
          set({ activeSensory: inMemorySensoryCache.get(cacheKey)!, isEnriching: false });
        } else {
          set({ isEnriching: true });
          const reqWorldId = worldId;
          const reqSceneId = scene.id;
          enrichSceneText({
            world,
            sceneText: getSceneFullText(scene, state),
            location: scene.location,
            state,
            modelTier,
            recentSensoryTexts,
            presentCompanionName: world.initialCompanion.name,
            isEnding: false,
          })
            .then((res) => {
              const cur = get();
              if (cur.worldId !== reqWorldId || cur.state.currentSceneId !== reqSceneId) {
                return;
              }
              if (res && res.sensoryDetail) {
                const sensoryObj: SensoryBlockState = {
                  sensoryDetail: res.sensoryDetail,
                  companionWhisper: res.companionWhisper,
                };
                inMemorySensoryCache.set(cacheKey, sensoryObj);
                set((s) => ({
                  activeSensory: sensoryObj,
                  isEnriching: false,
                  recentSensoryTexts: [...s.recentSensoryTexts.slice(-3), res.sensoryDetail],
                }));
              } else {
                set({ activeSensory: null, isEnriching: false });
              }
            })
            .catch(() => {
              const cur = get();
              if (cur.worldId === reqWorldId && cur.state.currentSceneId === reqSceneId) {
                set({ activeSensory: null, isEnriching: false });
              }
            });
        }
      }
    }
  },

  setEnableAtmosphere: (val: boolean) => {
    try {
      localStorage.setItem('vaelen_enable_atmosphere', String(val));
    } catch {}
    set({ enableAtmosphere: val });
  },

  setTagsLanguage: (lang: 'ru' | 'en') => {
    try {
      localStorage.setItem('vaelen_tags_lang', lang);
    } catch {}
    set({ tagsLanguage: lang });
  },

  setFontSize: (fontSize: 'sm' | 'base' | 'lg') => {
    try {
      localStorage.setItem('vaelen_font_size', fontSize);
    } catch {}
    set({ fontSize });
  },
  setTypewriterSpeedMs: (typewriterSpeedMs: number) => {
    try {
      localStorage.setItem('vaelen_typewriter_speed_ms', String(typewriterSpeedMs));
    } catch {}
    set({ typewriterSpeedMs });
  },
  setShowChoiceBadgeHints: (showChoiceBadgeHints: boolean) => {
    try {
      localStorage.setItem('vaelen_badge_hints', String(showChoiceBadgeHints));
    } catch {}
    set({ showChoiceBadgeHints });
  },
  setHasSeenBadgeHelpPrompt: (hasSeenBadgeHelpPrompt: boolean) => {
    try {
      localStorage.setItem('vaelen_seen_badge_prompt', String(hasSeenBadgeHelpPrompt));
    } catch {}
    set({ hasSeenBadgeHelpPrompt });
  },
  setInventoryViewMode: (inventoryViewMode: 'classic' | 'new') => {
    try {
      localStorage.setItem('vaelen_inventory_view_mode', inventoryViewMode);
    } catch {}
    set({ inventoryViewMode });
  },
  setChoiceDisplayMode: (choiceDisplayMode: 'manual' | 'auto') => {
    try {
      localStorage.setItem('vaelen_choice_display_mode', choiceDisplayMode);
    } catch {}
    set({ choiceDisplayMode });
  },

  openDrawer: (drawer: DrawerType) => {
    SoundManager.playClick();
    set({ activeDrawer: drawer });
  },
  closeDrawer: () => set({ activeDrawer: 'none' }),

  setShowHotspots: (showHotspots: boolean) => {
    SoundManager.playClick();
    set({ showHotspots });
  },
  setShowBacklog: (showBacklog: boolean) => {
    SoundManager.playClick();
    set({ showBacklog });
  },
  setShowEndings: (showEndings: boolean) => {
    SoundManager.playClick();
    set({ showEndings });
  },
  setShowGallery: (showGallery: boolean) => {
    SoundManager.playClick();
    set({ showGallery });
  },
  setShowWorldSelect: (showWorldSelect: boolean) => {
    SoundManager.playClick();
    set({ showWorldSelect });
  },
  setShowCodex: (showCodex: boolean) => {
    SoundManager.playClick();
    set({ showCodex });
  },
  setSelectedCodexEntryId: (selectedCodexEntryId: string | null) => {
    set({ selectedCodexEntryId });
  },
  openCodexWithEntry: (entryId?: string) => {
    SoundManager.playClick();
    if (entryId) {
      get().markCodexEntryRead(entryId);
      set({ showCodex: true, selectedCodexEntryId: entryId });
    } else {
      set({ showCodex: true });
    }
  },
  markCodexEntryRead: (entryId: string) => {
    const { state } = get();
    const currentRead = new Set(state.readCodexEntryIds || []);
    if (!currentRead.has(entryId)) {
      currentRead.add(entryId);
      const nextState: GameSaveState = {
        ...state,
        readCodexEntryIds: Array.from(currentRead),
      };
      writeSaveSlot(nextState);
      set({ state: nextState });
    }
  },
  setShowChapterChronicle: (showChapterChronicle: boolean) => {
    SoundManager.playClick();
    set({ showChapterChronicle });
  },

  rollbackToChapter: (chapterId: string): boolean => {
    const { worldId, state } = get();
    const world = getWorld(worldId);
    const targetChapter = world.chapters?.find((c) => c.id === chapterId);
    if (!targetChapter) return false;

    const result = rollbackToChapterSnapshot(world, chapterId, state);
    if (!result.success) {
      set((s) => ({
        notifications: [
          ...s.notifications,
          {
            id: `toast-rollback-err-${Date.now()}`,
            text: result.message || 'Не удалось выполнить возврат к главе.',
            type: 'info',
          },
        ],
      }));
      return false;
    }

    const nextState = result.nextState;
    writeSaveSlot(nextState);

    const nextScene = world.scenes[nextState.currentSceneId];
    SoundManager.playClick();

    if (nextScene?.choices) {
      preloadReadySceneArts(nextScene.choices.map((c) => c.targetSceneId).filter(Boolean));
    }

    set((s) => ({
      state: nextState,
      dialogueChunkIndex: 0,
      sceneResetCounter: s.sceneResetCounter + 1,
      isTypewriterComplete: false,
      currentArtUrl: getSceneArtUrl(nextScene, world),
      isArtLoading: false,
      activeCG: nextScene?.cgIllustration || null,
      activeSensory: null,
      isSensoryOpen: false,
      isEnriching: false,
      activeSkillCheck: null,
      pendingChoice: null,
      targetedItemId: null,
      outcomeCard: null,
      companionToast: null,
      rewindState: null,
      canRewind: false,
      showChapterChronicle: false,
      isChapterStart: true,
      notifications: [
        ...s.notifications,
        {
          id: `toast-rollback-${Date.now()}`,
          text: `Возврат к началу: ${targetChapter.number}. Автосохранение «До отката» создано.`,
          type: 'info',
        },
      ],
    }));

    artQueue.preloadNextScenes(world, nextScene);
    return true;
  },

  loadBeforeRollback: (): boolean => {
    const { worldId } = get();
    const backup = loadBeforeRollbackSlot(worldId);
    if (!backup) return false;

    get().loadStateFromSave(backup.state);
    set((s) => ({
      notifications: [
        ...s.notifications,
        {
          id: `toast-restore-backup-${Date.now()}`,
          text: `Восстановлено состояние до отката (${backup.chapterNumber})`,
          type: 'info',
        },
      ],
    }));
    return true;
  },
  setActiveCG: (activeCG) => set({ activeCG }),
  setInspectedItemDetail: (inspectedItemDetail) => set({ inspectedItemDetail }),
  setModelTier: (tier: OracleModelTier) => set({ modelTier: tier }),

  sendOracleMessage: async (userText: string) => {
    if (!userText.trim()) return;
    const { worldId, state, modelTier, oracleMessages } = get();
    const world = getWorld(worldId);
    const scene = world.scenes[state.currentSceneId];

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userText,
      modelUsed: modelTier,
      personaName: 'Вы',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    // Send only prior history (excluding current userMsg to avoid duplicating it in server.ts)
    const oracleHistory = oracleMessages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    set({
      oracleMessages: [...oracleMessages, userMsg],
      isOracleLoading: true,
    });

    try {
      const result = await askOracle({
        message: userText,
        history: oracleHistory,
        modelTier,
        world,
        state,
        currentSceneText: getSceneFullText(scene, state),
      });

      if (get().worldId !== worldId) return;

      const modelMsg: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: result.reply,
        modelUsed: modelTier,
        personaName: 'Хранитель Летописи',
        latencyMs: result.latencyMs,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };

      set((s) => ({
        oracleMessages: [...s.oracleMessages, modelMsg],
        isOracleLoading: false,
      }));
    } catch {
      if (get().worldId !== worldId) return;
      const fallbackMsg: ChatMessage = {
        id: `mod-err-${Date.now()}`,
        role: 'model',
        text: 'Связь с Оракулом прервалась. Попробуйте задать вопрос чуть позже.',
        modelUsed: modelTier,
        personaName: 'Хранитель Летописи',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      set((s) => ({
        oracleMessages: [...s.oracleMessages, fallbackMsg],
        isOracleLoading: false,
      }));
    }
  },

  setNotificationVerbosity: (notificationVerbosity: NotificationVerbosity) => {
    try {
      localStorage.setItem('vaelen_notification_verbosity', notificationVerbosity);
    } catch {}
    set({ notificationVerbosity });
  },

  setTargetedItemId: (targetedItemId: string | null) => set({ targetedItemId }),

  dismissOutcomeCard: () => set({ outcomeCard: null }),

  dismissCompanionToast: () => set({ companionToast: null }),

  setShowEventLog: (showEventLog: boolean) => set({ showEventLog }),

  markEventsRead: () => set({ hasUnreadEvents: false }),

  dismissNotification: (id: string) => {
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    }));
  },

  loadStateFromSave: (save: GameSaveState) => {
    const initializedSave = ensureCodexTrackingInitialized(save.worldId, save);
    const world = getWorld(initializedSave.worldId);
    const scene = world.scenes[initializedSave.currentSceneId] || world.scenes[world.startSceneId];

    writeSaveSlot(initializedSave);
    if (scene?.choices) {
      preloadReadySceneArts(scene.choices.map((c) => c.targetSceneId).filter(Boolean));
    }
    set((s) => ({
      worldId: initializedSave.worldId,
      state: initializedSave,
      dialogueChunkIndex: 0,
      sceneResetCounter: s.sceneResetCounter + 1,
      isTypewriterComplete: false,
      currentArtUrl: getSceneArtUrl(scene, world),
      isArtLoading: false,
      activeDrawer: 'none',
      showWorldSelect: false,
      selectedCodexEntryId: null,
      showCodex: false,
      showHotspots: false,
      showBacklog: false,
      showEndings: false,
      showGallery: false,
      showChapterChronicle: false,
      inspectedItemDetail: null,
      activeSkillCheck: null,
      pendingChoice: null,
      targetedItemId: null,
      outcomeCard: null,
      companionToast: null,
      rewindState: null,
      canRewind: false,
      activeSensory: null,
      isSensoryOpen: false,
      isEnriching: false,
      isChapterStart: true,
      notifications: [
        {
          id: `toast-${Date.now()}`,
          text: 'Сохранение успешно загружено!',
          type: 'info',
        },
      ],
    }));
  },

  isAnyModalOpen: () => {
    const s = get();
    return Boolean(
      (s.activeDrawer && s.activeDrawer !== 'none') ||
      s.showCodex ||
      s.showChapterChronicle ||
      s.showGallery ||
      s.showBacklog ||
      s.showEndings ||
      s.showHotspots ||
      s.showWorldSelect ||
      s.activeSkillCheck ||
      s.activeCG ||
      s.inspectedItemDetail ||
      s.isChapterStart ||
      s.showEventLog
    );
  },
}));

export function selectIsAnyModalOpen(s: GameStoreState): boolean {
  return Boolean(
    (s.activeDrawer && s.activeDrawer !== 'none') ||
    s.showCodex ||
    s.showChapterChronicle ||
    s.showGallery ||
    s.showBacklog ||
    s.showEndings ||
    s.showHotspots ||
    s.showWorldSelect ||
    s.activeSkillCheck ||
    s.activeCG ||
    s.inspectedItemDetail ||
    s.isChapterStart ||
    s.showEventLog
  );
}
