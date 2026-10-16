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
import { artQueue } from '../ai/artQueue';
import { enrichSceneText, askOracle } from '../ai/geminiClient';
import { SoundManager } from '../ui/SoundManager';
import { itemArtService } from '../ui/itemArtService';

export type DrawerType =
  | 'none'
  | 'inventory'
  | 'quests'
  | 'worlds'
  | 'oracle'
  | 'saves'
  | 'settings';

export interface SceneArtEntry {
  id: string; // `${worldId}_${sceneId}`
  worldId: string;
  sceneId: string;
  sceneTitle: string;
  location: string;
  url: string;
  timestamp: number;
}

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

  // Visual Novel presentation state
  dialogueChunkIndex: number;
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

  // AI Scene Art Illustration settings & Gallery
  aiArtEnabled: boolean;
  aiArtQuality: 'fast' | 'better';
  lastArtError: string | null;
  artFailedNotice: boolean;
  unlockedSceneArts: SceneArtEntry[];

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
  setAiArtEnabled: (val: boolean) => void;
  setAiArtQuality: (val: 'fast' | 'better') => void;
  retrySceneArt: () => void;
  addSceneArtToGallery: (entry: Omit<SceneArtEntry, 'timestamp'>) => void;
}

// In-memory sensory cache by scene key (A1)
const inMemorySensoryCache = new Map<string, SensoryBlockState>();

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
const storedEnableAtmosphere =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('vaelen_enable_atmosphere') !== 'false'
    : true;
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

const storedAiArtEnabled =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('vaelen_ai_art_enabled') !== 'false'
    : true;
const storedAiArtQuality =
  (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('vaelen_ai_art_quality') as 'fast' | 'better')
    : 'fast') || 'fast';

let initialGalleryArts: SceneArtEntry[] = [];
try {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem('vaelen_gallery_arts');
    if (raw) initialGalleryArts = JSON.parse(raw);
  }
} catch {}

function triggerSceneArtLoad(
  set: any,
  get: any,
  world: WorldModule,
  scene: SceneNode,
  choice?: SceneChoice,
  forceRefresh?: boolean
) {
  const { aiArtEnabled, aiArtQuality } = get();
  set({ isArtLoading: true, artFailedNotice: false });
  artQueue.requestSceneArt({
    world,
    scene,
    choice,
    aiArtEnabled,
    quality: aiArtQuality,
    forceRefresh,
    onSuccess: (url, isStub) => {
      set({
        currentArtUrl: url,
        isArtLoading: isStub,
        artFailedNotice: false,
        lastArtError: null,
      });
      if (!isStub && url) {
        get().addSceneArtToGallery({
          id: `${world.id}_${scene.id}`,
          worldId: world.id,
          sceneId: scene.id,
          sceneTitle: scene.chapterTitle || scene.location,
          location: scene.location,
          url,
        });
      }
    },
    onError: (reason?: string) => {
      set({
        currentArtUrl: scene?.localImage || world.coverImage,
        isArtLoading: false,
        lastArtError: reason || 'Не удалось сгенерировать кадр',
        artFailedNotice: true,
      });
      setTimeout(() => {
        set({ artFailedNotice: false });
      }, 3000);
    },
  });
  artQueue.preloadNextScenes(world, scene, aiArtEnabled, aiArtQuality);
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  worldId: initialSave.worldId,
  state: initialSave,
  activeDrawer: 'none',
  modelTier: 'gemini-3.5-flash',

  enableAtmosphere: storedEnableAtmosphere,
  isSensoryOpen: false,
  activeSensory: null,
  isEnriching: false,
  recentSensoryTexts: [],

  dialogueChunkIndex: 0,
  isTypewriterComplete: false,
  currentArtUrl:
    initialWorld.scenes[initialSave.currentSceneId]?.localImage ||
    initialWorld.coverImage,
  isArtLoading: false,
  screenShake: false,
  autoPlay: false,
  typewriterSpeedMs: 20,
  fontSize: 'base',
  tagsLanguage: storedTagsLang,
  showChoiceBadgeHints: storedBadgeHints,
  hasSeenBadgeHelpPrompt: storedSeenBadgePrompt,
  inventoryViewMode: storedInventoryViewMode,
  choiceDisplayMode: storedChoiceDisplayMode,
  notificationVerbosity: storedNotificationVerbosity,

  aiArtEnabled: storedAiArtEnabled,
  aiArtQuality: storedAiArtQuality,
  lastArtError: null,
  artFailedNotice: false,
  unlockedSceneArts: initialGalleryArts,

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

  oracleMessages: [
    {
      id: 'oracle-welcome',
      role: 'model',
      text:
        'Приветствую, путник. Я — Оракул и Хранитель летописи. Задавайте вопросы о тайнах мира, мотивах фракций или скрытых свойствах найденных реликвий.',
      modelUsed: 'gemini-3.5-flash',
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

    set({
      worldId: newWorldId,
      state: existingSave,
      dialogueChunkIndex: 0,
      isTypewriterComplete: false,
      currentArtUrl: scene?.localImage || world.coverImage,
      activeDrawer: 'none',
      showWorldSelect: false,
      selectedCodexEntryId: null,
      showCodex: false,
      activeSensory: null,
      isSensoryOpen: false,
      rewindState: null,
      canRewind: false,
      activeCG: scene?.cgIllustration || null,
      isChapterStart: true,
      oracleMessages: [
        {
          id: `oracle-welcome-${newWorldId}`,
          role: 'model',
          text: `Летопись открыта в мире «${world.title}». Задавайте вопросы о тайнах этого мира и реликвиях героя ${world.protagonist.name}.`,
          modelUsed: get().modelTier,
          personaName: 'Хранитель Летописи',
          timestamp: 'Готов',
        },
      ],
    });

    writeSaveSlot(existingSave);
    if (scene) {
      triggerSceneArtLoad(set, get, world, scene);
    }
    SoundManager.startAmbient(newWorldId);
  },

  restartWorld: () => {
    const { worldId, state } = get();
    const world = getWorld(worldId);
    const fresh = ensureCodexTrackingInitialized(worldId, createInitialState(world));
    fresh.unlockedEndings = Array.from(new Set([...(state.unlockedEndings || [])]));
    fresh.unlockedCGs = Array.from(new Set([...(state.unlockedCGs || [])]));
    const startScene = world.scenes[fresh.currentSceneId];

    set({
      state: fresh,
      dialogueChunkIndex: 0,
      isTypewriterComplete: false,
      currentArtUrl: startScene?.localImage || world.coverImage,
      activeDrawer: 'none',
      showWorldSelect: false,
      selectedCodexEntryId: null,
      showCodex: false,
      activeSensory: null,
      isSensoryOpen: false,
      rewindState: null,
      canRewind: false,
      activeCG: startScene?.cgIllustration || null,
      isChapterStart: true,
    });

    writeSaveSlot(fresh);
    if (startScene) {
      triggerSceneArtLoad(set, get, world, startScene);
    }
  },

  startNewGamePlus: (keptRelicId: string) => {
    const { worldId, state } = get();
    const world = getWorld(worldId);
    const fresh = createInitialState(world);
    fresh.unlockedEndings = Array.from(new Set([...(state.unlockedEndings || [])]));
    fresh.unlockedCGs = Array.from(new Set([...(state.unlockedCGs || [])]));
    const keptItem = state.inventory.find((i) => i.id === keptRelicId);
    if (keptItem) {
      const idx = fresh.inventory.findIndex((i) => i.id === keptItem.id);
      if (idx >= 0) {
        fresh.inventory[idx] = {
          ...keptItem,
          charges: keptItem.maxCharges || keptItem.charges,
        };
      } else {
        fresh.inventory.push({
          ...keptItem,
          charges: keptItem.maxCharges || keptItem.charges,
        });
      }
    }
    fresh.newGamePlusRelicId = keptRelicId;
    writeSaveSlot(fresh);
    get().selectWorld(worldId);
    get().notifications.push({
      id: `toast-ng-${Date.now()}`,
      text: `Новая игра+ начата! Реликвия «${keptItem?.name || ''}» перенесена в новую хронологию.`,
      type: 'item',
    });
  },

  makeChoice: (choice: SceneChoice) => {
    const { worldId, state, modelTier, enableAtmosphere, recentSensoryTexts } = get();
    const world = getWorld(worldId);

    // Check availability
    const check = canMakeChoice(choice, state, world);
    if (!check.allowed) {
      SoundManager.playDamage();
      get().notifications.push({
        id: `toast-${Date.now()}`,
        text: check.reason || 'Выбор недоступен',
        type: 'info',
      });
      set({ notifications: [...get().notifications] });
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
      get().notifications.push({
        id: `toast-missing-${Date.now()}`,
        text: `Эта сцена ещё не написана (id: ${targetSceneId})`,
        type: 'damage',
      });
      set({ notifications: [...get().notifications] });
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
      newlyAddedItems.forEach((item) => {
        itemArtService.requestItemArt(item, world.id, world.artStylePrompt);
      });
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

    // 2. Companion chip (маленький чип рядом со спутником / диалогом, 3 секунды)
    if (outcomeSummary.companionDelta) {
      set({
        companionToast: {
          name: outcomeSummary.companionDelta.name,
          delta: outcomeSummary.companionDelta.delta,
          text: outcomeSummary.companionDelta.toast,
          key: Date.now(),
        },
      });
      setTimeout(() => {
        get().dismissCompanionToast();
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

    // 6. Sound priority: Damage > Item > Quest > LevelUp (Codex)
    if (outcomeSummary.healthDeltaTotal < 0 || outcomeSummary.sanityDeltaTotal < 0) {
      SoundManager.playDamage();
    } else if (cardItems.length > 0) {
      SoundManager.playItemAcquired();
    } else if (cardQuests.length > 0) {
      SoundManager.playItemChime();
    } else if (cardCodex.length > 0) {
      SoundManager.playLevelUp();
    }

    // Trigger visual art generation
    set({
      state: updatedState,
      dialogueChunkIndex: 0,
      isTypewriterComplete: false,
      activeSensory: null,
      isSensoryOpen: false,
      screenShake,
      isArtLoading: true,
      rewindState: rewindSnapshot,
      canRewind: true,
      activeCG: nextScene?.cgIllustration || null,
      isChapterStart: isNewChapter,
      targetedItemId: null, // Clear any item targeting on choice made
    });

    if (screenShake) {
      setTimeout(() => set({ screenShake: false }), 600);
    }

    if (nextScene) {
      triggerSceneArtLoad(set, get, world, nextScene, choice);
    }

    // Atmosphere generation with strict A1 cache & anti-repetition rules
    if (enableAtmosphere && nextScene) {
      if (nextScene.isEnding) {
        // Epilogue for ending scene instead of sensory block
        set({
          activeSensory: {
            sensoryDetail: '',
            epilogueNote: nextScene.endingEpilogue || `Эпилог: «${nextScene.endingTitle || 'Завершение'}». Ваши деяния навечно изменили ткань мира.`,
          },
          isEnriching: false,
        });
      } else {
        const cacheKey = `${nextScene.id}_${modelTier}_${computeStateHash(nextState)}`;
        if (inMemorySensoryCache.has(cacheKey)) {
          set({ activeSensory: inMemorySensoryCache.get(cacheKey)!, isEnriching: false });
        } else {
          set({ isEnriching: true });
          enrichSceneText({
            world,
            sceneText: getSceneFullText(nextScene, nextState),
            location: nextScene.location,
            state: nextState,
            modelTier,
            recentSensoryTexts,
            presentCompanionName: world.initialCompanion.name,
            isEnding: false,
          }).then((res) => {
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
          });
        }
      }
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
      get().notifications.push({
        id: `toast-missing-${Date.now()}`,
        text: `Эта сцена ещё не написана (id: ${nextTargetId || 'undefined'})`,
        type: 'damage',
      });
      set({ notifications: [...get().notifications], activeSkillCheck: null, pendingChoice: null });
      return;
    }

    // Determine consequence effects on failure if no explicit failEffect is configured
    let outcomeEffect: ChoiceEffect = success
      ? (activeSkillCheck.passEffect || {})
      : (activeSkillCheck.failEffect || {});

    if (!success && !activeSkillCheck.failEffect) {
      const msg = activeSkillCheck.failMessage || '';
      const hpMatch = msg.match(/-(\d+)\s*(?:HP|хп|здоровь)/i);
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

    const resolvedChoice: SceneChoice = {
      ...pendingChoice,
      skillCheck: undefined, // CRITICAL: remove skillCheck so makeChoice executes instead of re-opening modal!
      targetSceneId: nextTargetId,
      effect: {
        ...(pendingChoice.effect || {}),
        ...outcomeEffect,
        notification: success
          ? activeSkillCheck.passMessage || 'Проверка пройдена успешно!'
          : activeSkillCheck.failMessage || 'Проверка провалена, но сюжет продолжается!',
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
    set({
      state: rewindState,
      dialogueChunkIndex: 0,
      isTypewriterComplete: false,
      currentArtUrl: scene?.localImage || world.coverImage,
      canRewind: false,
      rewindState: null,
      activeSensory: null,
      isSensoryOpen: false,
      notifications: [
        ...get().notifications,
        { id: `toast-rewind-${Date.now()}`, text: 'Действие отменено (откат на 1 шаг)', type: 'info' },
      ],
    });
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
      set({
        dialogueChunkIndex: 0,
        isTypewriterComplete: false,
        currentArtUrl: currentScene?.localImage || world.coverImage,
        activeSensory: null,
        isSensoryOpen: false,
      });
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
  toggleSensoryOpen: () => set((s) => ({ isSensoryOpen: !s.isSensoryOpen })),

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

  setFontSize: (fontSize: 'sm' | 'base' | 'lg') => set({ fontSize }),
  setTypewriterSpeedMs: (typewriterSpeedMs: number) => set({ typewriterSpeedMs }),
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
      get().notifications.push({
        id: `toast-rollback-err-${Date.now()}`,
        text: result.message || 'Не удалось выполнить возврат к главе.',
        type: 'info',
      });
      set({ notifications: [...get().notifications] });
      return false;
    }

    const nextState = result.nextState;
    writeSaveSlot(nextState);

    const nextScene = world.scenes[nextState.currentSceneId];
    SoundManager.playClick();

    set({
      state: nextState,
      dialogueChunkIndex: 0,
      isTypewriterComplete: false,
      currentArtUrl: nextScene?.localImage || world.coverImage,
      activeCG: nextScene?.cgIllustration || null,
      activeSensory: null,
      isSensoryOpen: false,
      rewindState: null,
      canRewind: false,
      showChapterChronicle: false,
      isChapterStart: true,
      notifications: [
        ...get().notifications,
        {
          id: `toast-rollback-${Date.now()}`,
          text: `Возврат к началу: ${targetChapter.number}. Автосохранение «До отката» создано.`,
          type: 'info',
        },
      ],
    });

    if (nextScene) {
      triggerSceneArtLoad(set, get, world, nextScene);
    }
    return true;
  },

  loadBeforeRollback: (): boolean => {
    const { worldId } = get();
    const backup = loadBeforeRollbackSlot(worldId);
    if (!backup) return false;

    get().loadStateFromSave(backup.state);
    get().notifications.push({
      id: `toast-restore-backup-${Date.now()}`,
      text: `Восстановлено состояние до отката (${backup.chapterNumber})`,
      type: 'info',
    });
    set({ notifications: [...get().notifications] });
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

    set({
      oracleMessages: [...oracleMessages, userMsg],
      isOracleLoading: true,
    });

    const oracleHistory = [...oracleMessages, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    const result = await askOracle({
      message: userText,
      history: oracleHistory,
      modelTier,
      world,
      state,
      currentSceneText: getSceneFullText(scene, state),
    });

    const modelMsg: ChatMessage = {
      id: `mod-${Date.now()}`,
      role: 'model',
      text: result.reply,
      modelUsed: modelTier,
      personaName: 'Хранитель Летописи',
      latencyMs: result.latencyMs,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    set({
      oracleMessages: [...get().oracleMessages, modelMsg],
      isOracleLoading: false,
    });
  },

  setNotificationVerbosity: (notificationVerbosity: NotificationVerbosity) => {
    try {
      localStorage.setItem('vaelen_notification_verbosity', notificationVerbosity);
    } catch {}
    set({ notificationVerbosity });
  },

  setAiArtEnabled: (val: boolean) => {
    try {
      localStorage.setItem('vaelen_ai_art_enabled', String(val));
    } catch {}
    set({ aiArtEnabled: val });
    const { worldId, state } = get();
    const world = getWorld(worldId);
    const scene = world.scenes[state.currentSceneId];
    if (scene) {
      if (!val) {
        set({
          currentArtUrl: scene.localImage || world.coverImage,
          isArtLoading: false,
        });
      } else {
        triggerSceneArtLoad(set, get, world, scene);
      }
    }
  },

  setAiArtQuality: (val: 'fast' | 'better') => {
    try {
      localStorage.setItem('vaelen_ai_art_quality', val);
    } catch {}
    set({ aiArtQuality: val });
  },

  retrySceneArt: () => {
    const { worldId, state } = get();
    const world = getWorld(worldId);
    const scene = world.scenes[state.currentSceneId];
    if (scene) {
      artQueue.resetFailedKeys();
      triggerSceneArtLoad(set, get, world, scene, undefined, true);
    }
  },

  addSceneArtToGallery: (entry: Omit<SceneArtEntry, 'timestamp'>) => {
    const { unlockedSceneArts } = get();
    const existingIdx = unlockedSceneArts.findIndex((a) => a.id === entry.id);
    const fullEntry: SceneArtEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    let updated: SceneArtEntry[];
    if (existingIdx >= 0) {
      updated = [...unlockedSceneArts];
      updated[existingIdx] = fullEntry;
    } else {
      updated = [fullEntry, ...unlockedSceneArts];
    }
    set({ unlockedSceneArts: updated });
    try {
      localStorage.setItem('vaelen_gallery_arts', JSON.stringify(updated.slice(0, 150)));
    } catch {}
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
    set({
      worldId: initializedSave.worldId,
      state: initializedSave,
      dialogueChunkIndex: 0,
      isTypewriterComplete: false,
      currentArtUrl: scene?.localImage || world.coverImage,
      activeDrawer: 'none',
      showWorldSelect: false,
      selectedCodexEntryId: null,
      showCodex: false,
      activeSensory: null,
      isSensoryOpen: false,
      isChapterStart: true,
      notifications: [
        {
          id: `toast-${Date.now()}`,
          text: 'Сохранение успешно загружено!',
          type: 'info',
        },
      ],
    });

    if (scene) {
      triggerSceneArtLoad(set, get, world, scene);
    }
  },
}));
