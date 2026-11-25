import {
  WorldModule,
  SceneChoice,
  GameSaveState,
  Item,
  SceneNode,
  SceneHotspot,
  ChapterSnapshot,
} from '../types';
import { getWorld } from '../worlds';

export const SAVE_SCHEMA_VERSION = 3;

export interface ChoiceAvailability {
  allowed: boolean;
  reason?: string;
}

// Cached world item name registry to avoid re-scanning scenes on every choice check
const worldItemRegistryCache = new Map<string, Map<string, string>>();

export function getWorldItemRegistry(world: WorldModule): Map<string, string> {
  const existing = worldItemRegistryCache.get(world.id);
  if (existing) return existing;

  const registry = new Map<string, string>();

  // 1. Initial inventory
  if (world.initialInventory) {
    for (const item of world.initialInventory) {
      if (item?.id && item?.name) registry.set(item.id, item.name);
    }
  }

  // 2. All scenes: choices (effect, skillCheck passEffect/failEffect) and hotspots (rewardItem)
  if (world.scenes) {
    for (const scene of Object.values(world.scenes)) {
      if (!scene) continue;

      if (scene.choices) {
        for (const choice of scene.choices) {
          if (choice.effect?.itemsAdded) {
            for (const item of choice.effect.itemsAdded) {
              if (item?.id && item?.name) registry.set(item.id, item.name);
            }
          }
          if (choice.skillCheck?.passEffect?.itemsAdded) {
            for (const item of choice.skillCheck.passEffect.itemsAdded) {
              if (item?.id && item?.name) registry.set(item.id, item.name);
            }
          }
          if (choice.skillCheck?.failEffect?.itemsAdded) {
            for (const item of choice.skillCheck.failEffect.itemsAdded) {
              if (item?.id && item?.name) registry.set(item.id, item.name);
            }
          }
        }
      }

      if (scene.hotspots) {
        for (const hotspot of scene.hotspots) {
          if (hotspot.rewardItem?.id && hotspot.rewardItem?.name) {
            registry.set(hotspot.rewardItem.id, hotspot.rewardItem.name);
          }
        }
      }
    }
  }

  worldItemRegistryCache.set(world.id, registry);
  return registry;
}

export function getItemHumanName(
  itemId: string,
  world: WorldModule,
  inventory?: Item[]
): string {
  if (inventory) {
    const found = inventory.find((i) => i.id === itemId);
    if (found?.name) return found.name;
  }
  const registry = getWorldItemRegistry(world);
  const registered = registry.get(itemId);
  if (registered) return registered;

  const knownFallbackItems: Record<string, string> = {
    'item-commander-blade': 'Клинок Командора Вальдемара',
    'item-anchor-shard': 'Осколок Звёздного Якоря',
    'item-chronometer': 'Астральный Хронометр',
    'item-celestial-compass': 'Небесный Компас',
    'item-void-lantern': 'Фонарь Пустоты',
    'item-depth-map': 'Карта Глубин',
    'item-salt-amulet': 'Соляной Оберег',
    'item-steam-core': 'Медное Паровое Ядро',
    'item-cipher-lens': 'Шифровальная Линза',
    'item-copper-key': 'Медный Ключ Шестерней',
  };
  if (knownFallbackItems[itemId]) {
    return knownFallbackItems[itemId];
  }

  const cleaned = itemId.replace(/^item[-_]/i, '').replace(/[-_]/g, ' ');
  return cleaned || 'неизвестный предмет';
}

export function canMakeChoice(
  choice: SceneChoice,
  state: GameSaveState,
  world: WorldModule
): ChoiceAvailability {
  const cond = choice.condition;
  if (!cond) return { allowed: true };

  // 1. Single item requirement
  if (cond.hasItem) {
    const has = state.inventory.some((i) => i.id === cond.hasItem && i.quantity > 0);
    if (!has) {
      const name = getItemHumanName(cond.hasItem, world, state.inventory);
      return { allowed: false, reason: `Требуется: ${name}` };
    }
  }

  // 2. Multiple items requirement
  if (cond.hasItemsAll && cond.hasItemsAll.length > 0) {
    const missingNames: string[] = [];
    for (const requiredId of cond.hasItemsAll) {
      const has = state.inventory.some((i) => i.id === requiredId && i.quantity > 0);
      if (!has) {
        missingNames.push(getItemHumanName(requiredId, world, state.inventory));
      }
    }
    if (missingNames.length > 0) {
      return { allowed: false, reason: `Требуется: ${missingNames.join(', ')}` };
    }
  }

  // 3. Health check
  if (cond.minHealth !== undefined && state.stats.health < cond.minHealth) {
    return {
      allowed: false,
      reason: `Слишком мало здоровья (${state.stats.health}/${cond.minHealth})`,
    };
  }

  // 4. Sanity check
  if (cond.minSanity !== undefined && state.stats.sanity < cond.minSanity) {
    return {
      allowed: false,
      reason: `Рассудок слишком слаб (${state.stats.sanity}/${cond.minSanity})`,
    };
  }

  // 5. Companion Relationship check
  if (cond.minRelationship !== undefined && (state.companionRelationship || 0) < cond.minRelationship) {
    return {
      allowed: false,
      reason: `Требуется доверие спутника (${state.companionRelationship || 0}/${cond.minRelationship})`,
    };
  }

  // 6. Required flags
  if (cond.requiredFlags && cond.requiredFlags.length > 0) {
    for (const flag of cond.requiredFlags) {
      if (!state.flags[flag]) {
        return {
          allowed: false,
          reason: cond.customReason || 'Нужно событие, которого ещё не было',
        };
      }
    }
  }

  // 6b. Any flags (at least one must be true)
  if (cond.anyFlags && cond.anyFlags.length > 0) {
    const hasAny = cond.anyFlags.some((flag) => !!state.flags[flag]);
    if (!hasAny) {
      return {
        allowed: false,
        reason: cond.customReason || 'Нужно событие, которого ещё не было',
      };
    }
  }

  // 7. Forbidden flags
  if (cond.forbiddenFlags && cond.forbiddenFlags.length > 0) {
    for (const flag of cond.forbiddenFlags) {
      if (state.flags[flag]) {
        return {
          allowed: false,
          reason: cond.customReason || 'Этот путь уже закрыт',
        };
      }
    }
  }

  return { allowed: true };
}

export interface ChoiceOutcomeSummary {
  itemsAcquired: Item[];
  itemsConsumed: string[];
  questUpdates: string[];
  customNotification?: string;
  healthDeltaTotal: number;
  sanityDeltaTotal: number;
  companionDelta?: { name: string; delta: number; toast?: string };
}

export function applyChoice(
  world: WorldModule,
  choice: SceneChoice,
  currentState: GameSaveState
): {
  nextState: GameSaveState;
  notifications: string[];
  screenShake: boolean;
  outcomeSummary: ChoiceOutcomeSummary;
} {
  const notifications: string[] = [];
  let screenShake = false;
  let healthDeltaTotal = 0;
  let sanityDeltaTotal = 0;
  let companionDelta: { name: string; delta: number; toast?: string } | undefined = undefined;
  const itemsAcquired: Item[] = [];
  const itemsConsumed: string[] = [];
  const questUpdates: string[] = [];
  let customNotification: string | undefined = undefined;

  const newStats = { ...currentState.stats };
  const newFlags = { ...currentState.flags };
  let newInventory = [...currentState.inventory];
  let newRelationship = currentState.companionRelationship || 0;
  const newUnlockedEndings = [...(currentState.unlockedEndings || [])];
  const newUnlockedCGs = [...(currentState.unlockedCGs || [])];

  const newQuests = currentState.quests.map((q) => ({
    ...q,
    subQuests: q.subQuests.map((sq) => ({ ...sq })),
  }));

  const effect = choice.effect;

  if (effect) {
    if (effect.screenShake) {
      screenShake = true;
    }

    if (effect.notification) {
      notifications.push(effect.notification);
      customNotification = effect.notification;
    }

    // Companion relationship delta
    if (effect.relationshipDelta) {
      newRelationship = Math.max(-10, Math.min(10, newRelationship + effect.relationshipDelta));
      const deltaSign = effect.relationshipDelta > 0 ? `+${effect.relationshipDelta}` : `${effect.relationshipDelta}`;
      const toastText =
        effect.companionToast ||
        `${world.initialCompanion.name} запоминает это (${deltaSign})`;
      notifications.push(toastText);
      companionDelta = {
        name: world.initialCompanion.name,
        delta: effect.relationshipDelta,
        toast: effect.companionToast,
      };
    }

    // Health delta
    if (effect.healthDelta) {
      const prevHp = newStats.health;
      newStats.health = Math.max(0, Math.min(newStats.maxHealth, newStats.health + effect.healthDelta));
      const diff = newStats.health - prevHp;
      healthDeltaTotal += diff;
      if (diff < 0) {
        screenShake = true;
        notifications.push(`Потеряно здоровье: ${diff} HP`);
      } else if (diff > 0) {
        notifications.push(`Восстановлено здоровье: +${diff} HP`);
      }
    }

    // Sanity delta
    if (effect.sanityDelta) {
      const prevSanity = newStats.sanity;
      newStats.sanity = Math.max(0, Math.min(newStats.maxSanity, newStats.sanity + effect.sanityDelta));
      const diff = newStats.sanity - prevSanity;
      sanityDeltaTotal += diff;
      if (diff < 0) {
        notifications.push(`Утрата рассудка: ${diff}`);
      } else if (diff > 0) {
        notifications.push(`Укрепление рассудка: +${diff}`);
      }
    }

    // Flags
    if (effect.flagsSet) {
      for (const f of effect.flagsSet) {
        newFlags[f] = true;
      }
    }
    if (effect.flagsUnset) {
      for (const f of effect.flagsUnset) {
        delete newFlags[f];
      }
    }

    // Items added
    if (effect.itemsAdded && effect.itemsAdded.length > 0) {
      for (const added of effect.itemsAdded) {
        const existingIdx = newInventory.findIndex((i) => i.id === added.id);
        if (existingIdx >= 0) {
          newInventory[existingIdx] = {
            ...newInventory[existingIdx],
            quantity: newInventory[existingIdx].quantity + (added.quantity || 1),
          };
        } else {
          newInventory.push({ ...added });
        }
        itemsAcquired.push({ ...added });
        notifications.push(`Получен предмет: ${added.name}`);
      }
    }

    // Items removed
    if (effect.itemsRemoved && effect.itemsRemoved.length > 0) {
      for (const removedId of effect.itemsRemoved) {
        const existingIdx = newInventory.findIndex((i) => i.id === removedId);
        if (existingIdx >= 0) {
          const item = newInventory[existingIdx];
          if (item.quantity > 1) {
            newInventory[existingIdx] = { ...item, quantity: item.quantity - 1 };
          } else {
            newInventory = newInventory.filter((i) => i.id !== removedId);
          }
          itemsConsumed.push(item.name);
          notifications.push(`Израсходован предмет: ${item.name}`);
        }
      }
    }

    // Quest update
    if (effect.questUpdate) {
      const { questId, subQuestId, status, newJournal } = effect.questUpdate;
      const quest = newQuests.find((q) => q.id === questId);
      if (quest) {
        if (subQuestId) {
          const sub = quest.subQuests.find((sq) => sq.id === subQuestId);
          if (sub) {
            sub.status = status;
            const updateMsg = `Задача ${status === 'completed' ? 'выполнена' : 'обновлена'}: ${sub.text}`;
            questUpdates.push(updateMsg);
            notifications.push(`Задача обновлена: ${sub.text} (${status === 'completed' ? 'Выполнена' : status})`);
          }
        }
        if (newJournal) {
          quest.journalEntry = newJournal;
        }
        const allDone = quest.subQuests.every((sq) => sq.status === 'completed');
        if (allDone) {
          quest.status = 'completed';
          const questDoneMsg = `Задание выполнено: ${quest.title}!`;
          questUpdates.push(questDoneMsg);
          notifications.push(questDoneMsg);
        }
      }
    }
  }

  // Determine target scene (including check for game over deaths)
  let targetSceneId = choice.targetSceneId;
  if (!targetSceneId || !world.scenes[targetSceneId]) {
    targetSceneId = currentState.currentSceneId || world.startSceneId;
  }

  if (newStats.health <= 0) {
    const defeatHpSceneId = Object.keys(world.scenes).find(
      (id) => world.scenes[id].endingType === 'defeat_health'
    );
    if (defeatHpSceneId) {
      targetSceneId = defeatHpSceneId;
      notifications.push('Здоровье упало до нуля! Вас настигает гибель...');
    }
  } else if (newStats.sanity <= 0) {
    const defeatSanitySceneId = Object.keys(world.scenes).find(
      (id) => world.scenes[id].endingType === 'defeat_sanity'
    );
    if (defeatSanitySceneId) {
      targetSceneId = defeatSanitySceneId;
      notifications.push('Рассудок полностью угас! Безумие поглощает разум...');
    }
  }

  const targetScene: SceneNode | undefined = world.scenes[targetSceneId];

  // Register Ending if target scene is an ending
  if (targetScene?.isEnding) {
    if (!newUnlockedEndings.includes(targetSceneId)) {
      newUnlockedEndings.push(targetSceneId);
    }
    const isDefeatEnding =
      targetScene.endingType === 'defeat_health' || targetScene.endingType === 'defeat_sanity';
    if (!isDefeatEnding) {
      for (const quest of newQuests) {
        if (quest.status === 'active') {
          for (const sq of quest.subQuests) {
            if (sq.status === 'active') {
              sq.status = 'completed';
            }
          }
          quest.status = 'completed';
          const questDoneMsg = `Задание выполнено: ${quest.title}!`;
          if (!questUpdates.includes(questDoneMsg)) {
            questUpdates.push(questDoneMsg);
          }
        }
      }
    }
  }

  // Register CG if target scene has a CG illustration
  if (targetScene?.cgIllustration && !newUnlockedCGs.includes(targetScene.cgIllustration.id)) {
    newUnlockedCGs.push(targetScene.cgIllustration.id);
  }

  const newHistory = [...currentState.history, targetSceneId];
  const newChronicleLog = [
    ...currentState.chronicleLog,
    {
      sceneId: targetSceneId,
      chapterTitle: targetScene?.chapterTitle || 'Сцена',
      location: targetScene?.location || world.title,
      choiceText: choice.text,
      choiceTag: choice.tag,
      companionChange: effect?.relationshipDelta
        ? { companionName: world.initialCompanion.name, delta: effect.relationshipDelta }
        : undefined,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const newSnapshots: Record<string, ChapterSnapshot> = { ...(currentState.chapterSnapshots || {}) };

  // If entering a chapter's startSceneId and snapshot does not exist yet, take snapshot of state at chapter start
  if (world.chapters && world.chapters.length > 0) {
    const enteredChapter = world.chapters.find((c) => c.startSceneId === targetSceneId);
    if (enteredChapter && !newSnapshots[enteredChapter.id]) {
      newSnapshots[enteredChapter.id] = {
        sceneId: targetSceneId,
        stats: { ...newStats },
        attributes: { ...currentState.attributes },
        companionRelationship: newRelationship,
        inventory: newInventory.map((i) => ({ ...i })),
        quests: newQuests.map((q) => ({
          ...q,
          subQuests: q.subQuests.map((sq) => ({ ...sq })),
        })),
        flags: { ...newFlags },
        hotspotsStatus: { ...(currentState.hotspotsStatus || {}) },
        historyLength: newHistory.length,
        chronicleLogLength: newChronicleLog.length,
        timestamp: Date.now(),
      };
    }
  }

  const nextState: GameSaveState = {
    ...currentState,
    schemaVersion: SAVE_SCHEMA_VERSION,
    currentSceneId: targetSceneId,
    stats: newStats,
    companionRelationship: newRelationship,
    inventory: newInventory,
    quests: newQuests,
    flags: newFlags,
    history: newHistory,
    chronicleLog: newChronicleLog,
    chapterSnapshots: newSnapshots,
    unlockedEndings: newUnlockedEndings,
    unlockedCGs: newUnlockedCGs,
    savedAt: Date.now(),
  };

  const outcomeSummary: ChoiceOutcomeSummary = {
    itemsAcquired,
    itemsConsumed,
    questUpdates,
    customNotification,
    healthDeltaTotal,
    sanityDeltaTotal,
    companionDelta,
  };

  return { nextState, notifications, screenShake, outcomeSummary };
}

export function useItemDirectly(
  world: WorldModule,
  itemId: string,
  currentState: GameSaveState
): {
  nextState: GameSaveState;
  notification: string;
} {
  const item = currentState.inventory.find((i) => i.id === itemId);
  if (!item || !item.usable) {
    return { nextState: currentState, notification: 'Этот предмет нельзя использовать из сумы.' };
  }

  // Story items without useAction (e.g. relic-whistle)
  if (!item.useAction) {
    return { nextState: currentState, notification: 'Этот предмет предназначен только для осмотра или контекстных действий.' };
  }

  // Check 0 charges
  if (item.charges !== undefined && item.charges <= 0) {
    return { nextState: currentState, notification: 'Предмет истощён и не имеет зарядов.' };
  }

  const action = item.useAction;
  const currentScene = world.scenes[currentState.currentSceneId];

  // Contextual check: required by a choice or hotspot in this scene
  const isRequiredByChoice = currentScene?.choices?.some(
    (c) => c.condition?.hasItem === item.id || c.condition?.hasItemsAll?.includes(item.id)
  );
  const isRequiredByHotspot = currentScene?.hotspots?.some((h) => h.requiredItem === item.id);
  const inApplicable = Boolean(action.applicableInScenes?.includes(currentState.currentSceneId));
  const isContextuallyNeeded = isRequiredByChoice || isRequiredByHotspot || inApplicable;

  const isHealing = Boolean((action.healthDelta && action.healthDelta > 0) || (action.sanityDelta && action.sanityDelta > 0));
  const hasDirectEffect = Boolean(
    (action.healthDelta && action.healthDelta !== 0) ||
    (action.sanityDelta && action.sanityDelta !== 0) ||
    (action.targetSceneId && world.scenes[action.targetSceneId])
  );

  // Guard choice-triggered relics with no direct stat/scene effect so charges are never wasted
  if (!hasDirectEffect) {
    return {
      nextState: currentState,
      notification: isContextuallyNeeded
        ? 'Эта реликвия применяется через соответствующий вариант выбора в сцене.'
        : 'Здесь этому предмету нет применения.',
    };
  }

  // If item is purely healing (or consumable with heal) and not required by scene context:
  if (isHealing && !isContextuallyNeeded) {
    const hpFull = currentState.stats.health >= currentState.stats.maxHealth;
    const sanityFull = currentState.stats.sanity >= currentState.stats.maxSanity;
    const needsHp = action.healthDelta && action.healthDelta > 0 && !hpFull;
    const needsSanity = action.sanityDelta && action.sanityDelta > 0 && !sanityFull;

    if (!needsHp && !needsSanity) {
      return {
        nextState: currentState,
        notification: 'Здоровье и рассудок полны. Использование не требуется.',
      };
    }
  }

  // If item has no healing effect and is not applicable/needed in this scene:
  if (!isHealing && !isContextuallyNeeded) {
    return {
      nextState: currentState,
      notification: 'Здесь этому предмету нет применения.',
    };
  }

  const newStats = { ...currentState.stats };
  let newInventory = [...currentState.inventory];
  let notification = action.description;

  if (action.healthDelta) {
    const prev = newStats.health;
    newStats.health = Math.max(0, Math.min(newStats.maxHealth, newStats.health + action.healthDelta));
    const delta = newStats.health - prev;
    if (delta !== 0) {
      notification += ` (${delta > 0 ? `+${delta}` : delta} HP)`;
    }
  }

  if (action.sanityDelta) {
    const prev = newStats.sanity;
    newStats.sanity = Math.max(0, Math.min(newStats.maxSanity, newStats.sanity + action.sanityDelta));
    const delta = newStats.sanity - prev;
    if (delta !== 0) {
      notification += ` (${delta > 0 ? `+${delta}` : delta} Рассудок)`;
    }
  }

  if (item.charges !== undefined && item.charges > 0) {
    const updatedCharges = item.charges - 1;
    newInventory = newInventory.map((i) =>
      i.id === itemId ? { ...i, charges: updatedCharges } : i
    );
    notification += ` (Осталось зарядов: ${updatedCharges})`;
  } else if (action.consumedOnUse) {
    if (item.quantity > 1) {
      newInventory = newInventory.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    } else {
      newInventory = newInventory.filter((i) => i.id !== itemId);
    }
  }

  let nextSceneId = currentState.currentSceneId;
  if (action.targetSceneId && world.scenes[action.targetSceneId]) {
    nextSceneId = action.targetSceneId;
  }

  const nextState: GameSaveState = {
    ...currentState,
    currentSceneId: nextSceneId,
    stats: newStats,
    inventory: newInventory,
    savedAt: Date.now(),
  };

  return { nextState, notification };
}

export function inspectSceneHotspot(
  hotspot: SceneHotspot,
  currentState: GameSaveState
): {
  nextState: GameSaveState;
  success: boolean;
  message: string;
} {
  // Guard against duplicate inspection of already-found hotspots
  if (currentState.hotspotsStatus?.[hotspot.id] === 'found') {
    return {
      nextState: currentState,
      success: false,
      message: 'Этот тайник уже исследован.',
    };
  }

  const newFlags = { ...currentState.flags };
  const newHotspots = { ...(currentState.hotspotsStatus || {}) };
  let newInventory = [...currentState.inventory];
  const newStats = { ...currentState.stats };

  // Check required flag
  if (hotspot.requiredFlag && !newFlags[hotspot.requiredFlag]) {
    newHotspots[hotspot.id] = 'inspected';
    return {
      nextState: { ...currentState, hotspotsStatus: newHotspots },
      success: false,
      message: hotspot.failText || 'Условия для исследования этого ориентира ещё не выполнены.',
    };
  }

  // Check required item
  if (hotspot.requiredItem) {
    const has = newInventory.some((i) => i.id === hotspot.requiredItem && i.quantity > 0);
    if (!has) {
      newHotspots[hotspot.id] = 'inspected';
      return {
        nextState: { ...currentState, hotspotsStatus: newHotspots },
        success: false,
        message: hotspot.failText || 'Требуется специальный предмет для вскрытия тайника.',
      };
    }
  }

  // Check attribute skill roll (d20 + D&D modifier vs DC)
  if (hotspot.check) {
    const attrVal = currentState.attributes?.[hotspot.check.attribute] ?? 10;
    const mod = Math.floor((attrVal - 10) / 2);
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod;
    if (total < hotspot.check.dc) {
      newHotspots[hotspot.id] = 'inspected';
      const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
      return {
        nextState: { ...currentState, hotspotsStatus: newHotspots },
        success: false,
        message:
          hotspot.failText ||
          `Проверка не удалась (бросок d20: ${roll}${modStr} = ${total}, нужно КС ${hotspot.check.dc}). Попробуйте снова или осмотритесь внимательнее.`,
      };
    }
  }

  // Grant rewards
  if (hotspot.rewardItem) {
    const existing = newInventory.find((i) => i.id === hotspot.rewardItem!.id);
    if (existing) {
      newInventory = newInventory.map((i) =>
        i.id === hotspot.rewardItem!.id ? { ...i, quantity: i.quantity + (hotspot.rewardItem!.quantity || 1) } : i
      );
    } else {
      newInventory.push({ ...hotspot.rewardItem });
    }
  }

  if (hotspot.rewardFlag) {
    newFlags[hotspot.rewardFlag] = true;
  }

  if (hotspot.rewardSanity) {
    newStats.sanity = Math.max(0, Math.min(newStats.maxSanity, newStats.sanity + hotspot.rewardSanity));
  }

  if (hotspot.rewardHealth) {
    newStats.health = Math.max(0, Math.min(newStats.maxHealth, newStats.health + hotspot.rewardHealth));
  }

  newHotspots[hotspot.id] = 'found';

  const nextState: GameSaveState = {
    ...currentState,
    stats: newStats,
    flags: newFlags,
    inventory: newInventory,
    hotspotsStatus: newHotspots,
    savedAt: Date.now(),
  };

  return {
    nextState,
    success: true,
    message: hotspot.foundText,
  };
}

export function createInitialState(world: WorldModule): GameSaveState {
  const startScene = world.scenes[world.startSceneId];
  const initialSnapshots: Record<string, ChapterSnapshot> = {};

  // If world has chapters, record initial snapshot for the starting chapter
  if (world.chapters && world.chapters.length > 0) {
    const firstChapter = world.chapters.find((c) => c.startSceneId === world.startSceneId) || world.chapters[0];
    if (firstChapter) {
      initialSnapshots[firstChapter.id] = {
        sceneId: world.startSceneId,
        stats: { ...world.initialStats },
        attributes: world.initialAttributes || { strength: 12, intellect: 12, perception: 12, charisma: 12 },
        companionRelationship: 0,
        inventory: world.initialInventory.map((i) => ({ ...i })),
        quests: world.initialQuests.map((q) => ({
          ...q,
          subQuests: q.subQuests.map((sq) => ({ ...sq })),
        })),
        flags: {},
        hotspotsStatus: {},
        historyLength: 1,
        chronicleLogLength: 1,
        timestamp: Date.now(),
      };
    }
  }

  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    worldId: world.id,
    currentSceneId: world.startSceneId,
    stats: { ...world.initialStats },
    attributes: world.initialAttributes || { strength: 12, intellect: 12, perception: 12, charisma: 12 },
    companionRelationship: 0,
    inventory: world.initialInventory.map((i) => ({ ...i })),
    quests: world.initialQuests.map((q) => ({
      ...q,
      subQuests: q.subQuests.map((sq) => ({ ...sq })),
    })),
    flags: {},
    hotspotsStatus: {},
    history: [world.startSceneId],
    chronicleLog: [
      {
        sceneId: world.startSceneId,
        chapterTitle: startScene?.chapterTitle || 'Начало',
        location: startScene?.location || world.title,
        choiceText: 'Начало путешествия',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    chapterSnapshots: initialSnapshots,
    unlockedEndings: [],
    unlockedCGs: [],
    savedAt: Date.now(),
  };
}

// Backwards-compatible save migration (supports v1, v2 -> v3)
export function migrateSaveState(raw: any, world: WorldModule): GameSaveState {
  if (!raw) return createInitialState(world);

  const initial = createInitialState(world);

  const validSceneId =
    raw.currentSceneId && world.scenes[raw.currentSceneId]
      ? raw.currentSceneId
      : world.startSceneId;

  // If already version 3
  if (raw.schemaVersion === SAVE_SCHEMA_VERSION) {
    return {
      ...initial,
      ...raw,
      worldId: world.id,
      currentSceneId: validSceneId,
      stats: { ...initial.stats, ...(raw.stats || {}) },
      attributes: { ...initial.attributes, ...(raw.attributes || {}) },
      inventory: Array.isArray(raw.inventory) ? raw.inventory : initial.inventory,
      quests: Array.isArray(raw.quests) ? raw.quests : initial.quests,
      flags: raw.flags || {},
      hotspotsStatus: raw.hotspotsStatus || {},
      history: Array.isArray(raw.history) ? raw.history : initial.history,
      chronicleLog: Array.isArray(raw.chronicleLog) ? raw.chronicleLog : initial.chronicleLog,
      chapterSnapshots: raw.chapterSnapshots && typeof raw.chapterSnapshots === 'object'
        ? raw.chapterSnapshots
        : initial.chapterSnapshots || {},
      unlockedEndings: Array.isArray(raw.unlockedEndings) ? raw.unlockedEndings : [],
      unlockedCGs: Array.isArray(raw.unlockedCGs) ? raw.unlockedCGs : [],
      companionRelationship: typeof raw.companionRelationship === 'number' ? raw.companionRelationship : 0,
    };
  }

  // V1 or V2 to V3 migration: initialize empty chapterSnapshots or seed start chapter
  const existingHistory = Array.isArray(raw.history) ? raw.history : [raw.currentSceneId || world.startSceneId];
  const existingChronicle = Array.isArray(raw.chronicleLog)
    ? raw.chronicleLog.map((c: any) => ({
        sceneId: c.sceneId || 'scene',
        chapterTitle: c.chapterTitle || 'Сцена',
        location: c.location || world.title,
        choiceText: c.choiceText,
        timestamp: c.timestamp || 'Ранее',
      }))
    : initial.chronicleLog;

  const migratedSnapshots: Record<string, ChapterSnapshot> = raw.chapterSnapshots || {};
  if (world.chapters && world.chapters.length > 0 && Object.keys(migratedSnapshots).length === 0) {
    const firstChapter = world.chapters[0];
    migratedSnapshots[firstChapter.id] = {
      sceneId: firstChapter.startSceneId,
      stats: { ...initial.stats, ...(raw.stats || {}) },
      attributes: { ...initial.attributes, ...(raw.attributes || {}) },
      companionRelationship: typeof raw.companionRelationship === 'number' ? raw.companionRelationship : 0,
      inventory: Array.isArray(raw.inventory) ? raw.inventory : initial.inventory,
      quests: Array.isArray(raw.quests) ? raw.quests : initial.quests,
      flags: raw.flags || {},
      hotspotsStatus: raw.hotspotsStatus || {},
      historyLength: 1,
      chronicleLogLength: 1,
      timestamp: raw.savedAt || Date.now(),
    };
  }

  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    worldId: world.id,
    currentSceneId: validSceneId,
    stats: { ...initial.stats, ...(raw.stats || {}) },
    attributes: world.initialAttributes || { strength: 12, intellect: 12, perception: 12, charisma: 12 },
    companionRelationship: typeof raw.companionRelationship === 'number' ? raw.companionRelationship : 0,
    inventory: Array.isArray(raw.inventory) ? raw.inventory : initial.inventory,
    quests: Array.isArray(raw.quests) ? raw.quests : initial.quests,
    flags: raw.flags || {},
    hotspotsStatus: raw.hotspotsStatus || {},
    history: existingHistory,
    chronicleLog: existingChronicle,
    chapterSnapshots: migratedSnapshots,
    unlockedEndings: Array.isArray(raw.unlockedEndings) ? raw.unlockedEndings : [],
    unlockedCGs: Array.isArray(raw.unlockedCGs) ? raw.unlockedCGs : [],
    savedAt: raw.savedAt || Date.now(),
  };
}

export const SAVE_STORAGE_KEY_PREFIX = 'vaelen_loom_save_';

export function loadSaveSlot(worldId: string): GameSaveState | null {
  try {
    const data = localStorage.getItem(`${SAVE_STORAGE_KEY_PREFIX}${worldId}`);
    if (data) {
      const parsed = JSON.parse(data);
      const world = getWorld(worldId);
      // Migrate transparently if needed
      return migrateSaveState(parsed, world);
    }
  } catch (e) {
    console.error('Failed to load save from localStorage:', e);
  }
  return null;
}

export function writeSaveSlot(state: GameSaveState): void {
  try {
    localStorage.setItem(
      `${SAVE_STORAGE_KEY_PREFIX}${state.worldId}`,
      JSON.stringify(state)
    );
  } catch (e) {
    console.error('Failed to write save to localStorage:', e);
  }
}

export const BEFORE_ROLLBACK_SLOT_PREFIX = 'vaelen_loom_before_rollback_';

export function saveBeforeRollbackSlot(worldId: string, state: GameSaveState, chapterNumber: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const payload = {
      state,
      chapterNumber,
      savedAt: Date.now(),
    };
    localStorage.setItem(`${BEFORE_ROLLBACK_SLOT_PREFIX}${worldId}`, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save before rollback slot:', e);
  }
}

export function loadBeforeRollbackSlot(
  worldId: string
): { state: GameSaveState; chapterNumber: string; savedAt: number } | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(`${BEFORE_ROLLBACK_SLOT_PREFIX}${worldId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      const world = getWorld(worldId);
      return {
        state: migrateSaveState(parsed.state, world),
        chapterNumber: parsed.chapterNumber || '',
        savedAt: parsed.savedAt || Date.now(),
      };
    }
  } catch (e) {
    console.error('Failed to load before rollback slot:', e);
  }
  return null;
}

/**
 * Rolls back the game state to the snapshot of the requested chapter.
 * - Trims history and chronicleLog to the length at snapshot time
 * - Preserves unlockedEndings and unlockedCGs
 * - Removes snapshots of chapters that follow the target chapter in the sequence
 * - Automatically saves a backup in 'До отката' slot
 */
export function rollbackToChapterSnapshot(
  world: WorldModule,
  targetChapterId: string,
  currentState: GameSaveState
): { nextState: GameSaveState; success: boolean; message?: string } {
  const snapshots = currentState.chapterSnapshots || {};
  const snapshot = snapshots[targetChapterId];

  const targetChapter = world.chapters?.find((c) => c.id === targetChapterId);
  if (!targetChapter) {
    return { nextState: currentState, success: false, message: 'Глава не найдена в текущем мире.' };
  }

  if (!snapshot) {
    return { nextState: currentState, success: false, message: 'Снимок этой главы ещё не был записан.' };
  }

  // 1. Auto-save current state before rollback
  saveBeforeRollbackSlot(world.id, currentState, targetChapter.number);

  // 2. Identify chapters to keep in snapshots: keep targetChapter and preceding chapters only
  const chapterList = world.chapters || [];
  const targetIndex = chapterList.findIndex((c) => c.id === targetChapterId);
  const remainingSnapshots: Record<string, ChapterSnapshot> = {};

  chapterList.forEach((c, idx) => {
    if (idx <= targetIndex && snapshots[c.id]) {
      remainingSnapshots[c.id] = { ...snapshots[c.id] };
    }
  });

  // 3. Trim history and chronicleLog
  const trimmedHistory = currentState.history.slice(0, Math.max(1, snapshot.historyLength || 1));
  const trimmedChronicle = currentState.chronicleLog.slice(0, Math.max(1, snapshot.chronicleLogLength || 1));

  // 4. Construct restored state
  const nextState: GameSaveState = {
    ...currentState,
    schemaVersion: SAVE_SCHEMA_VERSION,
    currentSceneId: snapshot.sceneId,
    stats: { ...snapshot.stats },
    attributes: { ...snapshot.attributes },
    companionRelationship: snapshot.companionRelationship,
    inventory: snapshot.inventory.map((i) => ({ ...i })),
    quests: snapshot.quests.map((q) => ({
      ...q,
      subQuests: q.subQuests.map((sq) => ({ ...sq })),
    })),
    flags: { ...snapshot.flags },
    hotspotsStatus: { ...snapshot.hotspotsStatus },
    history: trimmedHistory,
    chronicleLog: trimmedChronicle,
    chapterSnapshots: remainingSnapshots,
    unlockedEndings: Array.from(new Set([...(currentState.unlockedEndings || [])])),
    unlockedCGs: Array.from(new Set([...(currentState.unlockedCGs || [])])),
    savedAt: Date.now(),
  };

  return { nextState, success: true };
}

export function exportSaveAsJson(state: GameSaveState): void {
  const str = JSON.stringify(state, null, 2);
  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vaelen_loom_${state.worldId}_v${SAVE_SCHEMA_VERSION}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importSaveFromJson(jsonString: string): GameSaveState | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.worldId && parsed.currentSceneId && parsed.stats) {
      const world = getWorld(parsed.worldId);
      return migrateSaveState(parsed, world);
    }
  } catch (e) {
    console.error('Invalid save JSON:', e);
  }
  return null;
}
