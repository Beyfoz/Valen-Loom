import { OracleModelTier, WorldModule, GameSaveState } from '../types';

export interface EnrichResponse {
  sensoryDetail: string;
  companionWhisper: string;
  epilogueNote?: string;
  modelUsed?: string;
  latencyMs?: number;
}

export async function enrichSceneText(params: {
  world: WorldModule;
  sceneText: string;
  location: string;
  state: GameSaveState;
  modelTier: OracleModelTier;
  recentSensoryTexts?: string[];
  presentCompanionName?: string;
  isEnding?: boolean;
  endingTitle?: string;
}): Promise<EnrichResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('/api/story/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        worldTitle: params.world.title,
        location: params.location,
        sceneText: params.sceneText,
        inventory: params.state.inventory.map((i) => i.name),
        stats: params.state.stats,
        modelTier: params.modelTier,
        protagonist: params.world.protagonist.name,
        companion: params.presentCompanionName ?? params.world.initialCompanion.name,
        recentSensoryTexts: params.recentSensoryTexts || [],
        isEnding: params.isEnding || false,
        endingTitle: params.endingTitle || '',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return (await res.json()) as EnrichResponse;
  } catch (e: any) {
    console.warn(`[Gemini] Scene enrichment fallback: ${e?.message || 'temporary issue'}`);
    return null;
  }
}

export async function askOracle(params: {
  message: string;
  history: Array<{ role: 'user' | 'model'; text: string }>;
  modelTier: OracleModelTier;
  world: WorldModule;
  state: GameSaveState;
  currentSceneText: string;
}): Promise<{ reply: string; modelUsed: string; latencyMs: number }> {
  const activeQuest = params.state.quests.find((q) => q.status === 'active') || params.state.quests[0];
  const currentScene = params.world.scenes[params.state.currentSceneId];

  const requestBody = JSON.stringify({
    message: params.message,
    history: params.history,
    modelTier: params.modelTier,
    language: 'ru',
    worldContext: {
      worldTitle: params.world.title,
      worldGenre: params.world.genre,
      location: currentScene?.location || params.world.title,
      questTitle: activeQuest?.title || '',
      questObjective: activeQuest?.objective || '',
      inventory: params.state.inventory,
      characters: [params.world.protagonist, params.world.initialCompanion],
      latestNarrative: params.currentSceneText,
    },
  });

  let attempts = 0;
  while (attempts < 2) {
    attempts++;
    try {
      const res = await fetch('/api/oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });

      if ((res.status === 503 || res.status === 429) && attempts === 1) {
        console.warn(`[Gemini] Oracle temporary ${res.status}, retrying in 800ms...`);
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }

      if (!res.ok) {
        throw new Error(`Oracle server status ${res.status}`);
      }

      const data = await res.json();
      return {
        reply: data.reply || 'Оракул молчит, внимая шелесту звёзд и течений...',
        modelUsed: data.modelUsed || params.modelTier,
        latencyMs: data.latencyMs || 0,
      };
    } catch (error: any) {
      if (attempts === 1) {
        console.warn(`[Gemini] Oracle temporary error: ${error?.message || 'retry'}, retrying in 800ms...`);
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }

      console.warn(`[Gemini] Oracle failed (${error?.message || 'unavailable'}), using atmospheric fallback.`);
      return {
        reply:
          'Шёпот Оракула рассеивается в тумане. Прислушайтесь к своим верным реликвиям и интуиции спутника — ответ кроется в текущей сцене.',
        modelUsed: params.modelTier,
        latencyMs: 0,
      };
    }
  }

  return {
    reply: 'Шёпот Оракула рассеивается в тумане. Ответ кроется в текущей сцене.',
    modelUsed: params.modelTier,
    latencyMs: 0,
  };
}

export async function getQuickInstinct(params: {
  mode: 'sixth_sense' | 'item_use' | 'choice_preview';
  targetName?: string;
  sceneNarrative: string;
  location: string;
  questObjective: string;
  inventoryNames?: string[];
}): Promise<{ insight: string; latencyMs: number }> {
  try {
    const res = await fetch('/api/instinct/quick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        language: 'ru',
      }),
    });
    if (!res.ok) throw new Error('Instinct error');
    const data = await res.json();
    return {
      insight: data.insight,
      latencyMs: data.latencyMs || 0,
    };
  } catch (e) {
    return {
      insight: 'Интуиция подсказывает: будьте настороже и положитесь на силу подготовленных реликвий.',
      latencyMs: 0,
    };
  }
}
