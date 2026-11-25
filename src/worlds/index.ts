import { WorldModule } from '../types';
import { vaelenWorld } from './vaelen';
import { vesperaWorld } from './vespera';
import { astralWorld } from './astral';
import { applyStoryPack } from './storyKit';
import { vaelenStory } from './vaelen.story';
import { astralStory } from './astral.story';
import { getDefaultWorldCodex } from '../data/codexData';

const activeVaelenWorld = applyStoryPack(vaelenWorld, vaelenStory);
const activeAstralWorld = applyStoryPack(astralWorld, astralStory);

export const WORLDS: Record<string, WorldModule> = {
  vaelen: {
    ...activeVaelenWorld,
    codex: activeVaelenWorld.codex && activeVaelenWorld.codex.length > 0 ? activeVaelenWorld.codex : getDefaultWorldCodex('vaelen'),
  },
  vespera: {
    ...vesperaWorld,
    codex: vesperaWorld.codex && vesperaWorld.codex.length > 0 ? vesperaWorld.codex : getDefaultWorldCodex('vespera'),
  },
  astral: {
    ...activeAstralWorld,
    codex: activeAstralWorld.codex && activeAstralWorld.codex.length > 0 ? activeAstralWorld.codex : getDefaultWorldCodex('astral'),
  },
};

export const WORLD_LIST: WorldModule[] = [WORLDS.vaelen, WORLDS.vespera, WORLDS.astral];

export function getWorld(id: string): WorldModule {
  return WORLDS[id] || WORLDS.vaelen;
}
