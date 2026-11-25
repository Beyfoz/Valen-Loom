// Service for checking, caching, and versioning ready scene artwork from /scenes/manifest.json

let manifestLoaded = false;
let readySceneVersions = new Map<string, number>();
const listeners = new Set<() => void>();

export async function loadSceneArtManifest(): Promise<Map<string, number>> {
  try {
    const res = await fetch('/scenes/manifest.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      const newMap = new Map<string, number>();

      if (Array.isArray(data)) {
        // Legacy format: ["scene_1", "scene_2"]
        for (const id of data) {
          if (typeof id === 'string' && id.trim()) {
            newMap.set(id.trim(), 1);
          }
        }
      } else if (data?.scenes) {
        if (Array.isArray(data.scenes)) {
          // Legacy object array: { scenes: ["scene_1"] }
          for (const id of data.scenes) {
            if (typeof id === 'string' && id.trim()) {
              newMap.set(id.trim(), 1);
            }
          }
        } else if (typeof data.scenes === 'object') {
          // New versioned format: { scenes: { "<id>": <timestamp> } }
          for (const [id, ver] of Object.entries(data.scenes)) {
            if (typeof id === 'string' && id.trim()) {
              newMap.set(id.trim(), typeof ver === 'number' ? ver : 1);
            }
          }
        }
      }

      readySceneVersions = newMap;
    } else {
      readySceneVersions = new Map();
    }
  } catch {
    readySceneVersions = new Map();
  }
  manifestLoaded = true;
  notifyListeners();
  return readySceneVersions;
}

export function initSceneArtManifest(): Promise<Map<string, number>> {
  if (manifestLoaded) {
    return Promise.resolve(readySceneVersions);
  }
  return loadSceneArtManifest();
}

export function getReadySceneIds(): Set<string> {
  return new Set(readySceneVersions.keys());
}

export function getReadySceneVersions(): Map<string, number> {
  return new Map(readySceneVersions);
}

export function getSceneArtVersion(sceneId: string | undefined | null): number | undefined {
  if (!sceneId) return undefined;
  return readySceneVersions.get(sceneId);
}

export function hasReadySceneArt(sceneId: string | undefined | null): boolean {
  if (!sceneId) return false;
  return readySceneVersions.has(sceneId);
}

export function markSceneArtReady(sceneId: string, version?: number): void {
  if (!sceneId) return;
  const ver = version || Date.now();
  readySceneVersions.set(sceneId, ver);
  notifyListeners();
}

export function setReadySceneVersions(versions: Map<string, number>): void {
  readySceneVersions = new Map(versions);
  manifestLoaded = true;
  notifyListeners();
}

export function subscribeToSceneArtManifest(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(): void {
  for (const listener of listeners) {
    try {
      listener();
    } catch (err) {
      console.error('[SceneArtManifest] Listener error:', err);
    }
  }
}

/**
 * Resolves the artwork URL to display:
 * 1. /scenes/<sceneId>.webp?v=<версия> if present in manifest
 * 2. Scene's localImage or world's coverImage
 * 3. Default fallback
 */
export function getSceneArtUrl(
  scene: { id?: string; localImage?: string } | undefined | null,
  world?: { coverImage?: string } | undefined | null
): string {
  if (scene?.id && hasReadySceneArt(scene.id)) {
    const version = readySceneVersions.get(scene.id) || 1;
    return `/scenes/${scene.id}.webp?v=${version}`;
  }
  if (scene?.localImage) {
    return scene.localImage;
  }
  if (world?.coverImage) {
    return world.coverImage;
  }
  return '/images/preset_world_eldoria_1791455431121.webp';
}

/**
 * Preload scene frames for choices (only ready files, through new Image())
 */
export function preloadReadySceneArts(sceneIds: string[]): void {
  if (typeof window === 'undefined') return;
  for (const id of sceneIds) {
    if (id && hasReadySceneArt(id)) {
      const version = readySceneVersions.get(id) || 1;
      const img = new Image();
      img.src = `/scenes/${id}.webp?v=${version}`;
    }
  }
}
