export type ImageResolution = '1K' | '2K' | '4K';
export type AppLanguage = 'ru' | 'en';

export type OracleModelTier =
  | 'gemini-2.5-flash'
  | 'gemini-2.5-flash-lite'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'relic';

export interface Item {
  id: string;
  name: string;
  category: 'Relic' | 'Weapon' | 'Key' | 'Consumable' | 'Document' | 'Curio';
  rarity?: ItemRarity;
  quantity: number;
  description: string;
  loreNote: string;
  effectSummary?: string;
  illustrationUrl?: string;
  acquiredLocation?: string;
  charges?: number;
  maxCharges?: number;
  usable?: boolean;
  acquiredTurn?: number;
  codexId?: string;
  useAction?: {
    label: string;
    description: string;
    targetSceneId?: string;
    healthDelta?: number;
    sanityDelta?: number;
    consumedOnUse?: boolean;
    requiredSceneFlag?: string;
    applicableInScenes?: string[];
  };
}

// Backward compatibility alias
export type InventoryItem = Item;

export interface CharacterSheet {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  disposition: 'Loyal' | 'Friendly' | 'Neutral' | 'Wary' | 'Hostile' | 'Protagonist';
  visualDescriptor: string;
  statusNote: string;
  portraitUrl?: string;
}

export interface SubQuest {
  id: string;
  text: string;
  status: 'active' | 'completed' | 'failed';
}

export interface Quest {
  id: string;
  title: string;
  objective: string;
  status: 'active' | 'completed' | 'failed';
  subQuests: SubQuest[];
  journalEntry: string;
}

export interface ChoiceCondition {
  hasItem?: string;
  hasItemsAll?: string[];
  minHealth?: number;
  minSanity?: number;
  minRelationship?: number;
  requiredFlags?: string[];
  anyFlags?: string[];
  forbiddenFlags?: string[];
  customReason?: string;
}

export interface ChoiceEffect {
  healthDelta?: number;
  sanityDelta?: number;
  relationshipDelta?: number;
  companionToast?: string;
  itemsAdded?: Item[];
  itemsRemoved?: string[];
  flagsSet?: string[];
  flagsUnset?: string[];
  questUpdate?: {
    questId: string;
    subQuestId?: string;
    status: 'active' | 'completed' | 'failed';
    newJournal?: string;
  };
  notification?: string;
  screenShake?: boolean;
}

export type ChoiceTag =
  | 'AUDACIOUS'
  | 'CAUTIOUS'
  | 'RECON'
  | 'RELIC'
  | 'SACRIFICE'
  | 'DIALOGUE'
  | 'ENDING';

export type HeroAttribute = 'strength' | 'intellect' | 'perception' | 'charisma';

export interface SkillCheck {
  attribute: HeroAttribute;
  dc: number;
  label?: string;
  passEffect?: ChoiceEffect;
  failEffect?: ChoiceEffect;
  passTargetSceneId?: string;
  failTargetSceneId?: string;
  passMessage?: string;
  failMessage?: string;
}

export interface SceneChoice {
  id: string;
  text: string;
  targetSceneId: string;
  tag?: ChoiceTag;
  approach?: 'Audacious' | 'Diplomatic' | 'Shadow' | 'Arcane' | 'Investigative' | 'Relic' | 'Surrender';
  actionFocusPrompt?: string; // specific dynamic action for art generation
  condition?: ChoiceCondition;
  effect?: ChoiceEffect;
  skillCheck?: SkillCheck;
  hint?: string;
  hideIfLocked?: boolean;
}

export interface SceneHotspot {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number }; // percentage 0-100 on art
  check?: {
    attribute: HeroAttribute;
    dc: number;
    label?: string;
  };
  requiredItem?: string;
  requiredFlag?: string;
  rewardItem?: Item;
  rewardFlag?: string;
  rewardSanity?: number;
  rewardHealth?: number;
  codexId?: string;
  foundText: string;
  failText?: string;
}

export type CharacterEmotion = 'neutral' | 'anxious' | 'angry' | 'smiling' | 'pain';

export interface ReactivePage {
  text: string;
  at?: number | 'end';
  requiredFlags?: string[];
  anyFlags?: string[];
  forbiddenFlags?: string[];
  hasItem?: string;
  hasItemsAll?: string[];
  minRelationship?: number;
  maxRelationship?: number;
}

export interface SceneNode {
  id: string;
  chapterTitle: string;
  location: string;
  narrative: string[]; // Sentences/paragraphs split for paged visual novel view
  reactivePages?: ReactivePage[];
  visualPrompt: string; // Base visual descriptor
  actionFocus?: string;
  localImage?: string;
  activeSpeaker?: {
    name: string;
    emotion: CharacterEmotion;
    avatarUrl?: string;
  };
  cgIllustration?: {
    id: string;
    title: string;
    subtitle: string;
    url: string;
  };
  hotspots?: SceneHotspot[];
  choices: SceneChoice[];
  isEnding?: boolean;
  endingType?: 'victory' | 'sacrifice' | 'destruction' | 'defeat_health' | 'defeat_sanity';
  endingTitle?: string;
  endingEpilogue?: string;
  isKeyBossEncounter?: boolean;
}

export interface EndingDefinition {
  id: string;
  title: string;
  description: string;
  hint: string;
  endingType: 'victory' | 'sacrifice' | 'destruction' | 'defeat_health' | 'defeat_sanity';
  cgUrl: string;
}

export type CodexCategory =
  | 'Лор'
  | 'Персонажи'
  | 'Локации'
  | 'Фракции'
  | 'Документы'
  | 'Секреты';

export interface CodexEntry {
  id: string;
  title: string;
  category: CodexCategory;
  unlockFlag: string;
  content: string;
  hint?: string;
  aliases?: string[];
  relatedScenes?: string[];
  relatedItems?: string[];
  isStarter?: boolean;
}

export interface ChapterInfo {
  id: string;
  number: string;
  title: string;
  startSceneId: string;
  devPreset?: { flags: string[] };
}

export interface ChapterSnapshot {
  sceneId: string;
  stats: PlayerStats;
  attributes: HeroAttributes;
  companionRelationship: number;
  inventory: Item[];
  quests: Quest[];
  flags: Record<string, boolean>;
  hotspotsStatus: Record<string, 'uninspected' | 'inspected' | 'found'>;
  historyLength: number;
  chronicleLogLength: number;
  timestamp?: number;
}

export interface WorldModule {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  coverImage: string;
  artStyleName: string;
  artStylePrompt: string;
  theme: {
    primary: string;
    accent: string;
    border: string;
    bgOverlay: string;
    fontFamilyTitle: string;
    fontFamilyBody: string;
    glowColor: string;
  };
  protagonist: CharacterSheet;
  initialCompanion: CharacterSheet;
  initialStats: {
    health: number;
    maxHealth: number;
    sanity: number;
    maxSanity: number;
  };
  initialAttributes: {
    strength: number;
    intellect: number;
    perception: number;
    charisma: number;
  };
  initialQuests: Quest[];
  initialInventory: Item[];
  startSceneId: string;
  scenes: Record<string, SceneNode>;
  endingsList?: EndingDefinition[];
  codex?: CodexEntry[];
  chapters?: ChapterInfo[];
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  sanity: number;
  maxSanity: number;
}

export interface HeroAttributes {
  strength: number;
  intellect: number;
  perception: number;
  charisma: number;
}

export interface DecisionLogEntry {
  sceneId: string;
  chapterTitle: string;
  location: string;
  choiceText?: string;
  choiceTag?: ChoiceTag;
  companionChange?: { companionName: string; delta: number };
  timestamp: string;
}

export interface GameEventLogEntry {
  id: string;
  timestamp: string;
  icon: 'item' | 'quest' | 'damage' | 'heal' | 'companion' | 'codex' | 'info';
  title: string;
  details?: string;
}

export interface GameSaveState {
  schemaVersion: number; // 3
  worldId: string;
  currentSceneId: string;
  stats: PlayerStats;
  attributes: HeroAttributes;
  companionRelationship: number; // -10 to +10
  inventory: Item[];
  quests: Quest[];
  flags: Record<string, boolean>;
  hotspotsStatus: Record<string, 'uninspected' | 'inspected' | 'found'>;
  history: string[]; // sceneIds visited
  chronicleLog: DecisionLogEntry[];
  eventLog?: GameEventLogEntry[];
  chapterSnapshots?: Record<string, ChapterSnapshot>;
  unlockedEndings: string[];
  unlockedCGs: string[];
  notifiedCodexEntryIds?: string[];
  readCodexEntryIds?: string[];
  newGamePlusRelicId?: string;
  savedAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed: OracleModelTier;
  personaName: string;
  latencyMs?: number;
  timestamp: string;
}

// Legacy compatibility types for worldSeeds.ts
export interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
}

export interface QuestState {
  title: string;
  objective: string;
  status: 'Active' | 'Shifted' | 'Completed' | 'Critical';
  subObjectives: QuestObjective[];
  journalEntry: string;
  updatedTurn: number;
}

export interface StoryChoice {
  id: string;
  text: string;
  approach: 'Audacious' | 'Diplomatic' | 'Shadow' | 'Arcane' | 'Investigative';
  consequenceHint: string;
  requiredItem?: string;
}

export interface StoryNode {
  id: string;
  turnNumber: number;
  chapterTitle: string;
  location: string;
  playerAction?: string;
  narrative: string[];
  consequenceSummary: string;
  sceneVisualDescription: string;
  presentCharacterIds: string[];
  imageUrl?: string;
  imageResolution?: ImageResolution;
  imagePromptUsed?: string;
  isGeneratingImage?: boolean;
  isQuotaFallback?: boolean;
  quotaMessage?: string;
  choices: StoryChoice[];
  timestamp: string;
  stateChanges?: {
    questUpdated?: boolean;
    itemsAdded?: string[];
    itemsRemoved?: string[];
    charactersMet?: string[];
  };
}

export interface WorldSeed {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  coverImage: string;
  artStyleName: string;
  artStylePrompt: string;
  initialLocation: string;
  protagonist: CharacterSheet;
  initialCompanion: CharacterSheet;
  initialQuest: QuestState;
  initialInventory: InventoryItem[];
  openingNode: StoryNode;
}
