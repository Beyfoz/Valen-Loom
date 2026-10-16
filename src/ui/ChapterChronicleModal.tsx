import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookMarked,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
  AlertTriangle,
  History,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { WorldModule, GameSaveState, ChapterInfo, ChapterSnapshot } from '../types';
import { useGameStore } from '../store/gameStore';
import { loadBeforeRollbackSlot } from '../engine/gameEngine';
import { SoundManager } from './SoundManager';

interface ChapterChronicleModalProps {
  world: WorldModule;
  state: GameSaveState;
  onClose: () => void;
}

export const ChapterChronicleModal: React.FC<ChapterChronicleModalProps> = ({
  world,
  state,
  onClose,
}) => {
  const { rollbackToChapter, loadBeforeRollback } = useGameStore();

  const chapters: ChapterInfo[] = useMemo(() => {
    return world.chapters || [];
  }, [world.chapters]);

  const snapshots: Record<string, ChapterSnapshot> = state.chapterSnapshots || {};

  // Find currently active chapter by looking for which chapter's scene range we are in
  const currentChapter = useMemo(() => {
    if (!chapters.length) return null;
    const currentScene = world.scenes[state.currentSceneId];
    if (currentScene?.chapterTitle) {
      const match = currentScene.chapterTitle.match(/^([^:]+)/);
      const prefix = match ? match[1].trim() : '';
      const found = chapters.find((c) => c.number === prefix);
      if (found) return found;
    }
    // Fallback: check backwards from snapshots
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (snapshots[chapters[i].id]) return chapters[i];
    }
    return chapters[0] || null;
  }, [chapters, state.currentSceneId, world.scenes, snapshots]);

  // Selected chapter for detail view
  const [selectedChapterId, setSelectedChapterId] = useState<string>(() => {
    return currentChapter?.id || chapters[0]?.id || '';
  });

  // Modal confirmation dialog for rollback
  const [confirmRollbackChapter, setConfirmRollbackChapter] = useState<ChapterInfo | null>(null);

  // Check if a backup slot exists
  const backupSlot = useMemo(() => {
    return loadBeforeRollbackSlot(world.id);
  }, [world.id, state.savedAt]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmRollbackChapter) {
          setConfirmRollbackChapter(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, confirmRollbackChapter]);

  const selectedChapter = useMemo(() => {
    return chapters.find((c) => c.id === selectedChapterId) || chapters[0] || null;
  }, [chapters, selectedChapterId]);

  const selectedSnapshot = selectedChapter ? snapshots[selectedChapter.id] : undefined;
  const isSelectedVisited = !!selectedSnapshot;
  const isSelectedCurrent = currentChapter?.id === selectedChapter?.id;

  const handleRollbackClick = (chapter: ChapterInfo) => {
    SoundManager.playClick();
    setConfirmRollbackChapter(chapter);
  };

  const handleConfirmRollback = () => {
    if (!confirmRollbackChapter) return;
    const success = rollbackToChapter(confirmRollbackChapter.id);
    setConfirmRollbackChapter(null);
    if (success) {
      onClose();
    }
  };

  const handleRestoreBackup = () => {
    if (window.confirm('Восстановить автосохранение, сделанное перед последним откатом главы?')) {
      loadBeforeRollback();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-4xl h-[90vh] sm:h-[84vh] rounded-2xl bg-[#0D0B0E] border border-[#8A6B3A]/30 flex flex-col shadow-2xl overflow-hidden relative text-[#EFE6CF]">
        {/* Brass corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C9A55C]/70 pointer-events-none z-20" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C9A55C]/70 pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C9A55C]/70 pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C9A55C]/70 pointer-events-none z-20" />

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#3A2E1D] flex items-center justify-between bg-[#151217]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#241D17] border border-[#8A6B3A]/40 text-[#C9A55C]">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-normal tracking-wide text-[#EFE6CF]">
                Хроника глав · {world.title}
              </h2>
              <p className="text-xs font-prose text-[#BAAC93]">
                Оглавление летописи и возврат к началу пройденных этапов
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SoundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#BAAC93] hover:text-[#EFE6CF] hover:bg-white/5 transition"
            title="Закрыть (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left column Chapter list, Right column Snapshot details & Action */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0D0B0E]">
          {/* LEFT: Chapters Timeline */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-[#3A2E1D] flex flex-col bg-[#110E13]/80">
            <div className="p-3 border-b border-[#3A2E1D]/60 flex items-center justify-between">
              <span className="font-heading text-xs uppercase tracking-wider text-[#BAAC93]">
                Последовательность глав ({chapters.length})
              </span>
              <span className="text-xs font-tabular-nums text-[#C9A55C]">
                Пройдено: {Object.keys(snapshots).length}/{chapters.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chapters.map((chapter, idx) => {
                const snapshot = snapshots[chapter.id];
                const isVisited = !!snapshot;
                const isCurrent = currentChapter?.id === chapter.id;
                const isSelected = selectedChapterId === chapter.id;

                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      SoundManager.playClick();
                      setSelectedChapterId(chapter.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#C9A55C] bg-[#241D17] shadow-md ring-1 ring-[#C9A55C]/40'
                        : 'border-[#3A2E1D]/60 bg-[#161218]/60 hover:border-[#8A6B3A]/60 hover:bg-[#1D1720]'
                    } ${!isVisited ? 'opacity-65' : ''}`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-heading shrink-0 ${
                          isCurrent
                            ? 'bg-[#C9A55C] text-[#0D0B0E] font-bold shadow'
                            : isVisited
                            ? 'border border-[#8A6B3A] text-[#C9A55C]'
                            : 'border border-dashed border-[#55432B] text-[#7A6A55]'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-xs tracking-wider text-[#C9A55C]">
                            {chapter.number}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C9A55C]/20 border border-[#C9A55C]/40 text-[#EFE6CF] font-sans">
                              Текущая
                            </span>
                          )}
                        </div>
                        <h4 className="font-heading text-sm text-[#EFE6CF] truncate mt-0.5">
                          {chapter.title}
                        </h4>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isVisited ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#6E5A44]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Backup restore banner at bottom of list if present */}
            {backupSlot && (
              <div className="p-3 border-t border-[#3A2E1D] bg-[#161218] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#BAAC93]">
                  <History className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[#EFE6CF] block font-medium">Слот «До отката»</span>
                    <span className="text-[11px] text-[#8A755D]">
                      {backupSlot.chapterNumber} · {new Date(backupSlot.savedAt).toLocaleTimeString('ru-RU')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRestoreBackup}
                  className="px-2.5 py-1 rounded bg-[#2A2117] hover:bg-[#3D2F20] border border-[#8A6B3A]/40 text-[#C9A55C] text-xs transition shrink-0"
                >
                  Восстановить
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Chapter Details & Rollback Trigger */}
          <div className="flex-1 flex flex-col p-5 overflow-y-auto bg-[#0D0B0E]">
            {selectedChapter ? (
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* Chapter Header */}
                  <div className="border-b border-[#3A2E1D] pb-4">
                    <div className="flex items-center gap-2 text-xs font-heading tracking-wider text-[#C9A55C] mb-1">
                      <span>{selectedChapter.number}</span>
                      <span>✦</span>
                      <span>{world.title}</span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl text-[#EFE6CF]">
                      {selectedChapter.title}
                    </h3>
                  </div>

                  {/* Visit Status Card */}
                  {isSelectedVisited && selectedSnapshot ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#161218] border border-[#8A6B3A]/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-xs tracking-wider text-[#C9A55C] uppercase flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C9A55C]" />
                            Снимок состояния на старте главы
                          </span>
                          {selectedSnapshot.timestamp && (
                            <span className="text-[11px] font-tabular-nums text-[#8A755D]">
                              {new Date(selectedSnapshot.timestamp).toLocaleDateString('ru-RU')}{' '}
                              {new Date(selectedSnapshot.timestamp).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>

                        {/* Stats snapshot overview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                          <div className="p-2.5 rounded-lg bg-[#0D0B0E] border border-[#3A2E1D]">
                            <span className="text-[11px] text-[#8A755D] block">Здоровье</span>
                            <span className="font-tabular-nums text-sm font-semibold text-[#8E2A2A]">
                              {selectedSnapshot.stats.health} / {selectedSnapshot.stats.maxHealth}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#0D0B0E] border border-[#3A2E1D]">
                            <span className="text-[11px] text-[#8A755D] block">Рассудок</span>
                            <span className="font-tabular-nums text-sm font-semibold text-[#768BC7]">
                              {selectedSnapshot.stats.sanity} / {selectedSnapshot.stats.maxSanity}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#0D0B0E] border border-[#3A2E1D]">
                            <span className="text-[11px] text-[#8A755D] block">Доверие спутника</span>
                            <span className="font-tabular-nums text-sm font-semibold text-[#C9A55C]">
                              {selectedSnapshot.companionRelationship > 0
                                ? `+${selectedSnapshot.companionRelationship}`
                                : selectedSnapshot.companionRelationship}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#0D0B0E] border border-[#3A2E1D]">
                            <span className="text-[11px] text-[#8A755D] block">Инвентарь</span>
                            <span className="font-tabular-nums text-sm font-semibold text-[#EFE6CF]">
                              {selectedSnapshot.inventory.length} предм.
                            </span>
                          </div>
                        </div>

                        {/* Starting location */}
                        {world.scenes[selectedChapter.startSceneId] && (
                          <div className="flex items-center gap-2 text-xs text-[#BAAC93] pt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#C9A55C] shrink-0" />
                            <span>
                              Стартовая локация:{' '}
                              <strong className="text-[#EFE6CF]">
                                {world.scenes[selectedChapter.startSceneId].location || world.title}
                              </strong>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-[#18131B]/40 border border-[#3A2E1D]/60 text-xs text-[#BAAC93] leading-relaxed">
                        При возврате к этой главе игра восстановит сохранённые показатели, инвентарь и квесты.
                        Текущий прогресс будет сохранён в отдельный спасательный слот{' '}
                        <span className="text-[#C9A55C]">«До отката»</span>, а найденные концовки и иллюстрации сохранятся.
                      </div>
                    </div>
                  ) : (
                    /* Locked chapter placeholder */
                    <div className="p-8 rounded-xl bg-[#161218]/40 border border-dashed border-[#3A2E1D] text-center space-y-3">
                      <Lock className="w-8 h-8 text-[#5E4A35] mx-auto" />
                      <h4 className="font-heading text-base text-[#BAAC93]">
                        Глава ещё не открыта
                      </h4>
                      <p className="text-xs text-[#7A6A55] max-w-md mx-auto">
                        Продолжайте путешествие по сюжету. Снимок состояния автоматически зафиксируется,
                        как только корвет или отряд достигнет первой сцены этой главы.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Section */}
                <div className="pt-4 border-t border-[#3A2E1D] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-[#8A755D]">
                    {isSelectedCurrent
                      ? 'Вы находитесь в этой главе прямо сейчас.'
                      : isSelectedVisited
                      ? 'Доступен мгновенный откат к началу главы.'
                      : 'Возврат невозможен: этап не пройден.'}
                  </div>

                  <button
                    disabled={!isSelectedVisited}
                    onClick={() => handleRollbackClick(selectedChapter)}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-heading text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition ${
                      isSelectedVisited
                        ? 'bg-[#C9A55C] text-[#0D0B0E] hover:bg-[#DFC283] shadow-lg shadow-[#C9A55C]/15 cursor-pointer'
                        : 'bg-white/5 text-[#6E5A44] border border-[#3A2E1D] cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Вернуться к началу {selectedChapter.number}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-[#8A755D]">
                Выберите главу из списка слева.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {confirmRollbackChapter && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#151118] border border-[#C9A55C]/50 p-6 shadow-2xl space-y-5 text-[#EFE6CF] relative">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#EFE6CF]">
                  Подтверждение возврата
                </h3>
                <span className="text-xs font-sans text-[#BAAC93]">
                  {confirmRollbackChapter.number}: {confirmRollbackChapter.title}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#BAAC93] leading-relaxed">
              <p>
                Вы действительно хотите вернуться к началу главы{' '}
                <strong className="text-[#EFE6CF]">{confirmRollbackChapter.number}</strong>?
              </p>
              <p>
                Весь сюжетный прогресс, решения и полученные предметы после этого момента будут заменены
                состоянием снимка. Снимки более поздних глав будут удалены.
              </p>
              <div className="p-3 rounded-lg bg-[#0D0B0E] border border-[#3A2E1D] text-[#C9A55C] text-[11px]">
                🛡️ Автосохранение вашего текущего состояния будет создано в слоте{' '}
                <strong>«До отката»</strong>. Вы всегда сможете вернуться к нему.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmRollbackChapter(null)}
                className="px-4 py-2 rounded-xl text-xs font-prose text-[#BAAC93] hover:text-[#EFE6CF] hover:bg-white/5 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmRollback}
                className="px-5 py-2 rounded-xl bg-[#C9A55C] text-[#0D0B0E] hover:bg-[#DFC283] font-heading text-xs font-bold transition shadow"
              >
                Да, вернуться к главе
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterChronicleModal;

