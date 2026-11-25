import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getWorld } from '../worlds';
import { artQueue, isCircuitBreakerActive } from '../ai/artQueue';
import { getSceneArtUrl } from '../services/sceneArtManifest';

interface BackgroundCrossfadeProps {
  currentUrl: string;
  worldTitle?: string;
  isArtLoading?: boolean;
  aiArtEnabled?: boolean;
  artFailedNotice?: string | null;
}

const sessionRetriedUrls = new Set<string>();

export const BackgroundCrossfade: React.FC<BackgroundCrossfadeProps> = ({
  currentUrl,
  worldTitle,
  isArtLoading,
  aiArtEnabled,
  artFailedNotice,
}) => {
  const { worldId, state } = useGameStore();
  const world = getWorld(worldId);
  const currentScene = world.scenes[state.currentSceneId];

  const defaultFallback = getSceneArtUrl(currentScene, world);
  const ultimateFallback =
    currentScene?.localImage ||
    world.coverImage ||
    '/images/preset_world_eldoria_1791455431121.webp';

  const [activeUrl, setActiveUrl] = useState<string>(currentUrl || defaultFallback);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const nextUrl = currentUrl || defaultFallback;
    if (nextUrl !== activeUrl) {
      setPrevUrl(activeUrl);
      setActiveUrl(nextUrl);
      setIsCrossfading(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setPrevUrl(null);
        setIsCrossfading(false);
        timeoutRef.current = null;
      }, 600);
    }
  }, [currentUrl, defaultFallback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleImageError = () => {
    console.warn('[BackgroundCrossfade] Image load failed:', activeUrl, 'Falling back to local cover.');

    // Remove bad entry from cache
    if (activeUrl) {
      artQueue.removeCachedImage(activeUrl);
    }

    // Choose a different fallback URL to avoid infinite onError loops
    const nextFallback =
      activeUrl !== defaultFallback
        ? defaultFallback
        : activeUrl !== ultimateFallback
        ? ultimateFallback
        : '/images/preset_world_eldoria_1791455431121.webp';

    if (nextFallback !== activeUrl) {
      setActiveUrl(nextFallback);
      useGameStore.setState({ currentArtUrl: nextFallback, isArtLoading: false });
    } else {
      useGameStore.setState({ isArtLoading: false });
    }

    // Single retry per session if circuit breaker is not active and AI art is enabled
    const sceneKey = `${world.id}_${currentScene?.id || 'scene'}`;
    if (
      aiArtEnabled &&
      !isCircuitBreakerActive() &&
      !sessionRetriedUrls.has(sceneKey) &&
      currentScene
    ) {
      sessionRetriedUrls.add(sceneKey);
      const targetWorldId = world.id;
      const targetSceneId = currentScene.id;
      const { aiArtQuality } = useGameStore.getState();
      artQueue.requestSceneArt({
        world,
        scene: currentScene,
        aiArtEnabled: true,
        quality: aiArtQuality,
        onSuccess: (url, isStub) => {
          const cur = useGameStore.getState();
          if (
            !isStub &&
            url &&
            cur.worldId === targetWorldId &&
            cur.state.currentSceneId === targetSceneId
          ) {
            useGameStore.setState({ currentArtUrl: url, isArtLoading: false });
          }
        },
      });
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#0D0B0E]">
      {/* Previous Layer (Crossfade Out) */}
      {prevUrl && isCrossfading && (
        <img
          key={`prev-${prevUrl}`}
          src={prevUrl}
          alt={worldTitle || 'Background'}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out opacity-0"
        />
      )}

      {/* Active Layer (Crossfade In) */}
      <img
        key={`curr-${activeUrl}`}
        src={activeUrl}
        alt={worldTitle || 'Background'}
        onError={handleImageError}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out ${
          isCrossfading ? 'opacity-100 animate-fadeIn' : 'opacity-100'
        }`}
      />

      {/* Subtle Loading Pulse Overlay */}
      {isArtLoading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/75 border border-[#8A6B3A]/60 shadow-xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8CF8A] animate-ping" />
            <span className="text-xs font-heading font-medium tracking-wide text-[#EDE3CB]">
              Сотворение художественного полотна...
            </span>
          </div>
        </div>
      )}

      {/* Notification badge if generation failed */}
      {artFailedNotice && !isArtLoading && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none opacity-80">
          <span className="px-2.5 py-1 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-slate-400">
            {artFailedNotice}
          </span>
        </div>
      )}
    </div>
  );
};
