import { CharacterEmotion, GameSaveState, ReactivePage, SceneNode } from '../types';

export interface ParsedSpeaker {
  name: string;
  emotion: CharacterEmotion;
  avatarUrl?: string;
}

export interface ScenePage {
  text: string;
  rawText: string;
  speaker?: ParsedSpeaker;
}

const VALID_EMOTIONS: Record<string, CharacterEmotion> = {
  neutral: 'neutral',
  anxious: 'anxious',
  angry: 'angry',
  smiling: 'smiling',
  pain: 'pain',
};

/**
 * Parses speaker tag at the beginning of a page string:
 * [Имя|emotion] Текст реплики...
 * Supports emotions: neutral | anxious | angry | smiling | pain
 */
export function parseSpeakerTag(
  rawText: string,
  defaultSpeaker?: { name: string; emotion: CharacterEmotion; avatarUrl?: string }
): { text: string; speaker?: ParsedSpeaker } {
  const match = rawText.match(/^\s*\[([^|\]]+)\|([a-zA-Z]+)\]\s*([\s\S]*)$/);
  if (match) {
    const rawName = match[1].trim();
    const rawEmotion = match[2].trim().toLowerCase();
    const cleanText = match[3];
    const emotion: CharacterEmotion = VALID_EMOTIONS[rawEmotion] || 'neutral';
    return {
      text: cleanText,
      speaker: {
        name: rawName,
        emotion,
        avatarUrl: defaultSpeaker?.name === rawName ? defaultSpeaker.avatarUrl : undefined,
      },
    };
  }

  return {
    text: rawText,
    speaker: defaultSpeaker ? { ...defaultSpeaker } : undefined,
  };
}

/**
 * Evaluates whether a reactive page condition is satisfied
 */
export function isReactivePageActive(
  page: ReactivePage,
  state: GameSaveState
): boolean {
  // Required flags
  if (page.requiredFlags && page.requiredFlags.length > 0) {
    for (const flag of page.requiredFlags) {
      if (!state.flags[flag]) return false;
    }
  }

  // Any flags (at least one must be true)
  if (page.anyFlags && page.anyFlags.length > 0) {
    const hasAny = page.anyFlags.some((f) => !!state.flags[f]);
    if (!hasAny) return false;
  }

  // Forbidden flags
  if (page.forbiddenFlags && page.forbiddenFlags.length > 0) {
    for (const flag of page.forbiddenFlags) {
      if (state.flags[flag]) return false;
    }
  }

  // Single item requirement
  if (page.hasItem) {
    const has = state.inventory.some((i) => i.id === page.hasItem && i.quantity > 0);
    if (!has) return false;
  }

  // Multiple items requirement
  if (page.hasItemsAll && page.hasItemsAll.length > 0) {
    for (const id of page.hasItemsAll) {
      const has = state.inventory.some((i) => i.id === id && i.quantity > 0);
      if (!has) return false;
    }
  }

  // Companion relationship checks
  const rel = state.companionRelationship ?? 0;
  if (page.minRelationship !== undefined && rel < page.minRelationship) {
    return false;
  }
  if (page.maxRelationship !== undefined && rel > page.maxRelationship) {
    return false;
  }

  return true;
}

/**
 * Resolves all narrative pages for a scene, inserting active reactive pages
 * and parsing speaker emotion tags on each page.
 */
export function getScenePages(
  scene: SceneNode | undefined,
  state: GameSaveState
): ScenePage[] {
  if (!scene) {
    return [{ text: '...', rawText: '...' }];
  }

  const baseNarrative: string[] =
    scene.narrative && scene.narrative.length > 0 ? [...scene.narrative] : [];

  // If there are reactive pages, filter active ones and insert them
  if (scene.reactivePages && scene.reactivePages.length > 0) {
    const activeReactive = scene.reactivePages.filter((rp) =>
      isReactivePageActive(rp, state)
    );

    for (const rp of activeReactive) {
      if (
        rp.at !== undefined &&
        rp.at !== 'end' &&
        typeof rp.at === 'number' &&
        rp.at >= 0 &&
        rp.at <= baseNarrative.length
      ) {
        baseNarrative.splice(rp.at, 0, rp.text);
      } else {
        baseNarrative.push(rp.text);
      }
    }
  }

  if (baseNarrative.length === 0) {
    return [{ text: '...', rawText: '...' }];
  }

  return baseNarrative.map((raw) => {
    const parsed = parseSpeakerTag(raw, scene.activeSpeaker);
    return {
      text: parsed.text,
      rawText: raw,
      speaker: parsed.speaker,
    };
  });
}

/**
 * Helper to get the full combined text of a scene's pages
 */
export function getSceneFullText(
  scene: SceneNode | undefined,
  state: GameSaveState
): string {
  return getScenePages(scene, state)
    .map((p) => p.text)
    .join(' ');
}
