import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { getWorld } from './worlds';
import { getScenePages } from './engine/pages';
import { HUD } from './ui/HUD';
import { DialogueBox } from './ui/DialogueBox';
import { Toasts } from './ui/Toasts';
import { ProceduralCanvas } from './ui/ProceduralCanvas';
import { PWAInstallButton, OfflineIndicator } from './ui/PWAInstallButton';
import { ChapterTitleCard } from './ui/ChapterTitleCard';
import { BackgroundCrossfade } from './ui/BackgroundCrossfade';
import { artQueue } from './ai/artQueue';

import { ErrorBoundary } from './ui/ErrorBoundary';
import { CodexModal } from './ui/CodexModal';
import { Drawers } from './ui/Drawers';
import { WorldSelect } from './ui/WorldSelect';
import { HotspotsView } from './ui/HotspotsView';
import { DiceRollModal } from './ui/DiceRollModal';
import { CGModal } from './ui/CGModal';
import { ItemInspectModal } from './ui/ItemInspectModal';
import { BacklogModal } from './ui/BacklogModal';
import { EndingsModal } from './ui/EndingsModal';
import { GalleryModal } from './ui/GalleryModal';
import { ChapterChronicleModal } from './ui/ChapterChronicleModal';

export default function App() {
  const {
    worldId,
    state,
    currentArtUrl,
    isArtLoading,
    artFailedNotice,
    screenShake,
    showWorldSelect,
    setShowWorldSelect,
    showHotspots,
    setShowHotspots,
    inspectHotspot,
    activeSkillCheck,
    completeSkillCheck,
    cancelSkillCheck,
    activeCG,
    setActiveCG,
    inspectedItemDetail,
    setInspectedItemDetail,
    showBacklog,
    setShowBacklog,
    showEndings,
    setShowEndings,
    showGallery,
    setShowGallery,
    showCodex,
    setShowCodex,
    showChapterChronicle,
    setShowChapterChronicle,
    useItem,
    dialogueChunkIndex,
    aiArtEnabled,
    activeDrawer,
    closeDrawer,
  } = useGameStore();

  const world = getWorld(worldId);
  const currentScene = world.scenes[state.currentSceneId];

  // On mount or world change, trigger background scene art if AI art is enabled
  useEffect(() => {
    if (currentScene) {
      const { aiArtEnabled: isAiEnabled, aiArtQuality } = useGameStore.getState();
      artQueue.requestSceneArt({
        world,
        scene: currentScene,
        aiArtEnabled: isAiEnabled,
        quality: aiArtQuality,
        onSuccess: (url, isStub) => {
          useGameStore.setState({
            currentArtUrl: url,
            isArtLoading: isStub,
          });
          if (!isStub && url) {
            useGameStore.getState().addSceneArtToGallery({
              id: `${world.id}_${currentScene.id}`,
              worldId: world.id,
              sceneId: currentScene.id,
              sceneTitle: currentScene.chapterTitle || currentScene.location,
              location: currentScene.location,
              url,
            });
          }
        },
        onError: () => {
          useGameStore.setState({ isArtLoading: false });
        },
      });
      artQueue.preloadNextScenes(world, currentScene, isAiEnabled, aiArtQuality);
    }
  }, [worldId]);

  // Character sprite emotion layer (B4) - reactive to current page speaker tag or scene default
  const pages = getScenePages(currentScene, state);
  const currentPage = pages[dialogueChunkIndex] || pages[0];

  return (
    <div
      data-world={worldId}
      className={`relative w-screen h-screen overflow-hidden bg-[#0D0B0E] text-[#EFE6CF] select-none ${
        screenShake ? 'animate-shake' : ''
      }`}
      style={{
        fontFamily: 'var(--font-prose)',
      }}
    >
      {/* LAYER 1: Fallback Procedural Animated Canvas (Always running underneath) */}
      <ProceduralCanvas world={world} />

      {/* LAYER 2: Fullscreen 100% Background Illustration with 600ms Crossfade */}
      <BackgroundCrossfade
        currentUrl={currentArtUrl}
        worldTitle={world.title}
        isArtLoading={isArtLoading}
        aiArtEnabled={aiArtEnabled}
        artFailedNotice={artFailedNotice}
      />

      {/* LAYER 3: Soft Deep Atmospheric Vignette & Film Grain Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(13, 11, 14, 0.65) 70%, rgba(8, 7, 10, 0.95) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10 mix-blend-multiply opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* LAYER 4: Dynamic Top HUD Bar (HP, Sanity, Chapter Title, Actions) */}
      <HUD />

      {/* LAYER 5: Classic Visual Novel Bottom Dialogue Plate */}
      <DialogueBox />

      {/* LAYER 6: Pop-up Notifications (Damage, Loot, Quests) */}
      <Toasts />

      {/* LAYER 7: PWA Install Prompt & Offline Connectivity Banner */}
      <PWAInstallButton />
      <OfflineIndicator />

      {/* Offcanvas Side Drawers (Inventory, Quests, Worlds, Oracle, Saves, Settings) */}
      {activeDrawer !== 'none' && (
        <ErrorBoundary onClose={closeDrawer}>
          <Drawers />
        </ErrorBoundary>
      )}

      {/* MODAL 1: Unified World Select Screen (A3) */}
      {showWorldSelect && (
        <ErrorBoundary onClose={() => setShowWorldSelect(false)}>
          <WorldSelect onClose={() => setShowWorldSelect(false)} />
        </ErrorBoundary>
      )}

      {/* MODAL 2: "Осмотреться" Hotspots Mode (B2) */}
      {showHotspots && currentScene && (
        <ErrorBoundary onClose={() => setShowHotspots(false)}>
          <HotspotsView
            hotspots={currentScene.hotspots || []}
            hotspotsStatus={state.hotspotsStatus || {}}
            attributes={state.attributes}
            onInspectHotspot={inspectHotspot}
            onClose={() => setShowHotspots(false)}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 3: d20 Dice Skill Check (B3) */}
      {activeSkillCheck && (
        <ErrorBoundary
          title="Сбой броска кубика"
          description="Не удалось завершить проверку навыка. Вы можете повторить бросок или закрыть окно и вернуться к выбору."
          onClose={cancelSkillCheck}
        >
          <DiceRollModal
            check={activeSkillCheck}
            attributes={state.attributes}
            onComplete={completeSkillCheck}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 4: Fullscreen CG Illustration (B4) */}
      {activeCG && (
        <ErrorBoundary onClose={() => setActiveCG(null)}>
          <CGModal cg={activeCG} onClose={() => setActiveCG(null)} />
        </ErrorBoundary>
      )}

      {/* MODAL 5: Item Detail Inspection (A2) */}
      {inspectedItemDetail && (
        <ErrorBoundary onClose={() => setInspectedItemDetail(null)}>
          <ItemInspectModal
            item={inspectedItemDetail}
            isApplicableHere={inspectedItemDetail.usable}
            onUse={(id: string) => useItem(id)}
            onClose={() => setInspectedItemDetail(null)}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 6: Backlog History (B6) */}
      {showBacklog && (
        <ErrorBoundary onClose={() => setShowBacklog(false)}>
          <BacklogModal
            entries={state.chronicleLog || []}
            onClose={() => setShowBacklog(false)}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 7: Endings Replayability List (B7) */}
      {showEndings && (
        <ErrorBoundary onClose={() => setShowEndings(false)}>
          <EndingsModal
            world={world}
            unlockedEndings={state.unlockedEndings || []}
            onClose={() => setShowEndings(false)}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 8: CG Gallery (B4) */}
      {showGallery && (
        <ErrorBoundary onClose={() => setShowGallery(false)}>
          <GalleryModal
            world={world}
            unlockedCGs={state.unlockedCGs || []}
            onClose={() => setShowGallery(false)}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 9: World Codex (B4) */}
      {showCodex && (
        <ErrorBoundary onClose={() => setShowCodex(false)}>
          <CodexModal
            world={world}
            flags={state.flags || {}}
            onClose={() => setShowCodex(false)}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 10: Chapter Chronicle & Rollback */}
      {showChapterChronicle && world.chapters && world.chapters.length > 0 && (
        <ErrorBoundary onClose={() => setShowChapterChronicle(false)}>
          <ChapterChronicleModal
            world={world}
            state={state}
            onClose={() => setShowChapterChronicle(false)}
          />
        </ErrorBoundary>
      )}

      {/* OVERLAY: Cinematic Chapter Title Card (B5) */}
      <ChapterTitleCard scene={currentScene} world={world} />
    </div>
  );
}
