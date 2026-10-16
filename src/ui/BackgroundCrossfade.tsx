import React, { useEffect, useState } from 'react';

interface Layer {
  id: string;
  url: string;
  opacity: number;
}

interface BackgroundCrossfadeProps {
  currentUrl: string;
  worldTitle: string;
  isArtLoading: boolean;
  aiArtEnabled?: boolean;
  artFailedNotice?: boolean;
}

export const BackgroundCrossfade: React.FC<BackgroundCrossfadeProps> = ({
  currentUrl,
  worldTitle,
  isArtLoading,
  aiArtEnabled = true,
  artFailedNotice = false,
}) => {
  const [layers, setLayers] = useState<Layer[]>(() =>
    currentUrl ? [{ id: `layer-${Date.now()}`, url: currentUrl, opacity: 1 }] : []
  );

  useEffect(() => {
    if (!currentUrl) return;

    setLayers((prev) => {
      const topLayer = prev[prev.length - 1];
      if (topLayer && topLayer.url === currentUrl) {
        return prev;
      }

      const newId = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newLayer: Layer = { id: newId, url: currentUrl, opacity: 0 };

      // Keep previous layer visible while new layer fades in
      const kept = prev.map((l) => ({ ...l, opacity: 1 }));
      return [...kept, newLayer];
    });

    // Animate new layer in on next frame
    const animTimer = setTimeout(() => {
      setLayers((prev) =>
        prev.map((layer, index) => {
          if (index === prev.length - 1) {
            return { ...layer, opacity: 1 };
          }
          return { ...layer, opacity: 0 };
        })
      );
    }, 30);

    // Clean up older layers after 600ms crossfade completes
    const cleanupTimer = setTimeout(() => {
      setLayers((prev) => {
        if (prev.length <= 1) return prev;
        return prev.slice(-1);
      });
    }, 650);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(cleanupTimer);
    };
  }, [currentUrl]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="absolute inset-0 w-full h-full transition-opacity duration-[600ms] ease-in-out"
          style={{ opacity: layer.opacity }}
        >
          <img
            src={layer.url}
            alt={worldTitle}
            decoding="async"
            className={`w-full h-full object-cover object-center transition-transform duration-700 ${
              isArtLoading ? 'scale-[1.02] filter blur-[0.5px]' : 'scale-100'
            }`}
          />
        </div>
      ))}

      {/* Non-intrusive generation indicator in corner */}
      {isArtLoading && aiArtEnabled && (
        <div
          className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-xs font-mono text-amber-300/90 shadow-lg pointer-events-none select-none transition-all duration-300 animate-fadeIn"
          aria-label="Генерация фона сцены"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="tracking-wide text-[11px] sm:text-xs">рисуется…</span>
        </div>
      )}

      {/* 3-second failure notice if all models failed */}
      {!isArtLoading && artFailedNotice && aiArtEnabled && (
        <div
          className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/85 backdrop-blur-md border border-red-500/40 text-xs font-mono text-red-200 shadow-lg pointer-events-none select-none transition-all duration-300 animate-fadeIn"
          aria-label="Сбой генерации фона"
        >
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="tracking-wide text-[11px] sm:text-xs">кадр не удалось нарисовать</span>
        </div>
      )}
    </div>
  );
};
