import { WorldModule, SceneNode, SceneChoice, EndingDefinition, CodexEntry } from '../types';

export interface ScenePatch {
  appendChoices?: SceneChoice[];
  prependChoices?: SceneChoice[];
  replaceChoices?: SceneChoice[];
  narrative?: string[];
  reactivePages?: SceneNode['reactivePages'];
  activeSpeaker?: SceneNode['activeSpeaker'];
  chapterTitle?: string;
  location?: string;
}

export interface StoryPack {
  worldId: string;
  startSceneId?: string;
  scenes?: Record<string, SceneNode>;
  patches?: Record<string, ScenePatch>;
  redirects?: Record<string, string>;
  endingsList?: EndingDefinition[];
  codex?: CodexEntry[];
}

/**
 * Merges a StoryPack into a base WorldModule without modifying original base files.
 */
export function applyStoryPack(baseWorld: WorldModule, pack: StoryPack): WorldModule {
  const scenes: Record<string, SceneNode> = { ...baseWorld.scenes };

  // 1. Add or override scenes
  if (pack.scenes) {
    for (const [sceneId, sceneNode] of Object.entries(pack.scenes)) {
      scenes[sceneId] = { ...sceneNode };
    }
  }

  // 2. Apply patches to existing scenes
  if (pack.patches) {
    for (const [sceneId, patch] of Object.entries(pack.patches)) {
      const existing = scenes[sceneId];
      if (existing) {
        let newChoices = [...existing.choices];

        if (patch.replaceChoices) {
          newChoices = [...patch.replaceChoices];
        } else {
          if (patch.prependChoices) {
            newChoices = [...patch.prependChoices, ...newChoices];
          }
          if (patch.appendChoices) {
            for (const ac of patch.appendChoices) {
              const existingIdx = newChoices.findIndex((c) => c.id === ac.id);
              if (existingIdx >= 0) {
                newChoices[existingIdx] = ac;
              } else {
                newChoices.push(ac);
              }
            }
          }
        }

        scenes[sceneId] = {
          ...existing,
          choices: newChoices,
          narrative: patch.narrative ? [...patch.narrative] : existing.narrative,
          reactivePages: patch.reactivePages
            ? [...patch.reactivePages]
            : existing.reactivePages,
          activeSpeaker: patch.activeSpeaker || existing.activeSpeaker,
          chapterTitle: patch.chapterTitle || existing.chapterTitle,
          location: patch.location || existing.location,
        };
      }
    }
  }

  // 3. Apply redirects to targetSceneId in choices
  if (pack.redirects && Object.keys(pack.redirects).length > 0) {
    for (const [sceneId, scene] of Object.entries(scenes)) {
      scene.choices = scene.choices.map((c) => {
        if (pack.redirects && pack.redirects[c.targetSceneId]) {
          const redirected = pack.redirects[c.targetSceneId];
          // Do not apply redirect if it would redirect back to the current scene itself
          if (redirected !== sceneId) {
            return {
              ...c,
              targetSceneId: redirected,
            };
          }
        }
        return c;
      });
    }
  }

  // 4. Merge endingsList if provided
  let endingsList = baseWorld.endingsList ? [...baseWorld.endingsList] : [];
  if (pack.endingsList) {
    for (const ending of pack.endingsList) {
      const idx = endingsList.findIndex((e) => e.id === ending.id);
      if (idx >= 0) {
        endingsList[idx] = ending;
      } else {
        endingsList.push(ending);
      }
    }
  }

  // 5. Merge codex if provided
  let codex: CodexEntry[] | undefined =
    baseWorld.codex && baseWorld.codex.length > 0 ? [...baseWorld.codex] : undefined;
  if (pack.codex && pack.codex.length > 0) {
    codex = codex || [];
    for (const entry of pack.codex) {
      const idx = codex.findIndex((e) => e.id === entry.id);
      if (idx >= 0) {
        codex[idx] = entry;
      } else {
        codex.push(entry);
      }
    }
  }

  return {
    ...baseWorld,
    startSceneId: pack.startSceneId || baseWorld.startSceneId,
    scenes,
    endingsList,
    codex,
    chapters: baseWorld.chapters,
  };
}
