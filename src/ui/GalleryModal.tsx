import React, { useState } from 'react';
import { X, Image as ImageIcon, Lock, Sparkles, Eye, Filter } from 'lucide-react';
import { WorldModule } from '../types';
import { useGameStore, SceneArtEntry } from '../store/gameStore';

interface GalleryModalProps {
  world: WorldModule;
  unlockedCGs: string[];
  onClose: () => void;
}

type GalleryTab = 'all' | 'cg' | 'scenes';

export const GalleryModal: React.FC<GalleryModalProps> = ({ world, unlockedCGs, onClose }) => {
  const { unlockedSceneArts = [] } = useGameStore();
  const [activeTab, setActiveTab] = useState<GalleryTab>('all');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  // Collect all potential key CGs from current world
  const allCGs: Array<{ id: string; title: string; subtitle: string; url: string }> = [];
  Object.values(world.scenes).forEach((scene) => {
    if (scene.cgIllustration) {
      allCGs.push(scene.cgIllustration);
    }
  });

  // Filter generated scene frames for current world
  const worldSceneArts: SceneArtEntry[] = unlockedSceneArts.filter(
    (art) => art.worldId === world.id || !art.worldId
  );

  const unlockedCGCount = allCGs.filter((cg) => unlockedCGs.includes(cg.id)).length;
  const totalCount = allCGs.length + worldSceneArts.length;
  const unlockedTotal = unlockedCGCount + worldSceneArts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl h-[88vh] rounded-2xl bg-[#0E1321] border border-white/15 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/40">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                Галерея иллюстраций мира
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Открыто {unlockedTotal} из {totalCount} ({unlockedCGCount} CG, {worldSceneArts.length} кадров сцен)
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Все ({unlockedTotal})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cg')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'cg' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ключевые CG ({unlockedCGCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scenes')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'scenes' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Кадры сцен ({worldSceneArts.length})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Generated Scene Artworks */}
          {(activeTab === 'all' || activeTab === 'scenes') && worldSceneArts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Иллюстрации сцен ({worldSceneArts.length})
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {worldSceneArts.map((art) => (
                  <div
                    key={art.id}
                    onClick={() =>
                      setPreviewImage({
                        url: art.url,
                        title: art.sceneTitle,
                        subtitle: art.location,
                      })
                    }
                    className="rounded-xl overflow-hidden border border-amber-500/30 bg-black/40 group relative aspect-[16/9] cursor-pointer shadow-md hover:border-amber-400 transition"
                  >
                    <img
                      src={art.url}
                      alt={art.sceneTitle}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-75 transition" />

                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs border border-amber-500/30 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>ИИ-кадр</span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-left">
                      <span className="text-xs font-bold font-display text-white block truncate">
                        {art.sceneTitle}
                      </span>
                      <span className="text-[10px] text-amber-200/90 font-mono block truncate">
                        {art.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Key Story CGs */}
          {(activeTab === 'all' || activeTab === 'cg') && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Ключевые сюжетные сцены (CG) ({allCGs.length})
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allCGs.map((cg) => {
                  const isUnlocked = unlockedCGs.includes(cg.id);

                  return (
                    <div
                      key={cg.id}
                      onClick={() =>
                        isUnlocked &&
                        setPreviewImage({
                          url: cg.url,
                          title: cg.title,
                          subtitle: cg.subtitle,
                        })
                      }
                      className={`rounded-xl overflow-hidden border border-white/10 bg-black/40 group relative aspect-[16/9] ${
                        isUnlocked ? 'cursor-pointer hover:border-purple-400 transition' : ''
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <img
                            src={cg.url}
                            alt={cg.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-2 left-2 right-2 text-left">
                            <span className="text-xs font-bold font-display text-white block">
                              {cg.title}
                            </span>
                            <span className="text-[10px] text-amber-200/90 font-mono block">
                              {cg.subtitle}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-slate-600 gap-1.5 p-3 text-center">
                          <Lock className="w-6 h-6" />
                          <span className="text-xs font-mono font-semibold text-slate-500">
                            Сцена не открыта
                          </span>
                          <span className="text-[10px] text-slate-600">
                            Пройдите ветку сюжета для открытия
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state for scenes tab */}
          {activeTab === 'scenes' && worldSceneArts.length === 0 && (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
              <p className="text-sm font-prose">
                В этой кампании ещё не создано ИИ-иллюстраций сцен.
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Иллюстрации генерируются автоматически во время путешествия по сюжету!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage.url}
            alt={previewImage.title}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="mt-4 text-center">
            <h4 className="text-base sm:text-lg font-bold font-display text-white">
              {previewImage.title}
            </h4>
            <p className="text-xs text-amber-300 font-mono mt-1">
              {previewImage.subtitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
