import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Backpack,
  Compass,
  Globe,
  Sparkles,
  Save,
  Settings,
  Send,
  Zap,
  CheckCircle2,
  Circle,
  XCircle,
  Download,
  Upload,
  RotateCcw,
  Sliders,
  AlertCircle,
  BookOpen,
  Volume2,
  VolumeX,
  Eye,
  Trophy,
  History,
  Image as ImageIcon,
  BookMarked,
  HelpCircle,
  Wrench,
} from 'lucide-react';
import { useGameStore, DrawerType } from '../store/gameStore';
import { getWorld } from '../worlds';
import { OracleModelTier, Item } from '../types';
import { exportSaveAsJson, importSaveFromJson, loadBeforeRollbackSlot } from '../engine/gameEngine';
import { SoundManager } from './SoundManager';
import { InventoryView } from './InventoryModal';
import { ChoiceBadgeGuideList } from './ChoiceBadgeGuide';
import { artQueue } from '../ai/artQueue';
import { DevSceneStudio } from './DevSceneStudio';

export const Drawers: React.FC = () => {
  const {
    activeDrawer,
    closeDrawer,
    state,
    worldId,
    useItem,
    modelTier,
    setModelTier,
    enableAtmosphere,
    setEnableAtmosphere,
    tagsLanguage,
    setTagsLanguage,
    fontSize,
    setFontSize,
    typewriterSpeedMs,
    setTypewriterSpeedMs,
    oracleMessages,
    isOracleLoading,
    sendOracleMessage,
    loadStateFromSave,
    restartWorld,
    setShowWorldSelect,
    setShowBacklog,
    setShowEndings,
    setShowGallery,
    setShowChapterChronicle,
    loadBeforeRollback,
    setInspectedItemDetail,
    showChoiceBadgeHints,
    setShowChoiceBadgeHints,
    inventoryViewMode,
    setInventoryViewMode,
    choiceDisplayMode,
    setChoiceDisplayMode,
    notificationVerbosity,
    setNotificationVerbosity,
    aiArtEnabled,
    setAiArtEnabled,
    aiArtQuality,
    setAiArtQuality,
  } = useGameStore();

  const currentWorld = getWorld(worldId);

  const isDevModeAllowed =
    Boolean(import.meta.env.DEV) ||
    (typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('dev') === '1');

  const [oracleInput, setOracleInput] = useState('');
  const [showSettingsBadgeList, setShowSettingsBadgeList] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'none' | 'restoreBackup' | 'restart'>('none');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound settings state
  const [isMuted, setIsMuted] = useState(SoundManager.getMuted());
  const [volume, setVolume] = useState(SoundManager.getVolume());

  useEffect(() => {
    setConfirmAction('none');
  }, [activeDrawer, worldId]);

  useEffect(() => {
    if (activeDrawer === 'oracle' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [oracleMessages, activeDrawer, isOracleLoading]);

  // Esc key closes drawer unless focused on an input element
  useEffect(() => {
    if (activeDrawer === 'none') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const activeEl = document.activeElement;
        const isInput =
          activeEl &&
          (activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'TEXTAREA' ||
            (activeEl as HTMLElement).isContentEditable);
        if (!isInput) {
          closeDrawer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, closeDrawer]);

  if (activeDrawer === 'none') return null;

  const handleSendOracle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!oracleInput.trim() || isOracleLoading) return;
    const text = oracleInput;
    setOracleInput('');
    await sendOracleMessage(text);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importSaveFromJson(content);
      if (imported) {
        loadStateFromSave(imported);
      } else {
        useGameStore.setState((prev) => ({
          notifications: [
            ...prev.notifications,
            {
              id: `err_import_${Date.now()}`,
              type: 'damage',
              text: 'Не удалось импортировать файл сохранения: неверный формат JSON.',
            },
          ],
        }));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed top-16 sm:top-20 bottom-0 left-0 right-0 z-45 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="flex-1" onClick={closeDrawer} />

      {/* Drawer Panel */}
      <div className="w-full max-w-lg h-full bg-[#121016] border-l border-[#8A6B3A]/40 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#3A2E1D] flex items-center justify-between bg-[#0B0A0D]/90">
          <div className="flex items-center gap-2">
            {activeDrawer === 'inventory' && (
              <>
                <Backpack className="w-5 h-5 text-[#C9A55C]" />
                <h2 className="text-base font-heading text-[#EDE3CB] tracking-wide">
                  Сума и Реликвии ({state.inventory.length})
                </h2>
              </>
            )}
            {activeDrawer === 'quests' && (
              <>
                <Compass className="w-5 h-5 text-[#C9A55C]" />
                <h2 className="text-base font-heading text-[#EDE3CB] tracking-wide">
                  Хроника Обетных Уз и Заданий
                </h2>
              </>
            )}
            {activeDrawer === 'oracle' && (
              <>
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-semibold font-display text-purple-100">
                  Оракул и Хранитель Лора
                </h2>
              </>
            )}
            {activeDrawer === 'saves' && (
              <>
                <Save className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-semibold font-display text-emerald-100">
                  Сохранения и Экспорт
                </h2>
              </>
            )}
            {activeDrawer === 'settings' && (
              <>
                <Settings className="w-5 h-5 text-slate-400" />
                <h2 className="text-base font-semibold font-display text-slate-100">
                  Настройки и Механики
                </h2>
              </>
            )}
          </div>

          <button
            onClick={closeDrawer}
            className="p-1.5 text-[#8A6B3A] hover:text-[#EDE3CB] hover:bg-[#1A1622] border border-transparent hover:border-[#3A2E1D] transition-colors cursor-pointer"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div
          className={`flex-1 min-h-0 ${
            activeDrawer === 'inventory'
              ? 'overflow-hidden flex flex-col p-3.5 sm:p-4'
              : 'overflow-y-auto p-4 sm:p-5 space-y-4'
          }`}
        >
          {/* 1. OVERHAULED INVENTORY DRAWER */}
          {activeDrawer === 'inventory' && (
            <InventoryView
              inventory={state.inventory}
              world={currentWorld}
              state={state}
              onUseItem={useItem}
              onInspectItem={setInspectedItemDetail}
              onClose={closeDrawer}
              isCompactDrawer={true}
            />
          )}

          {/* 2. QUESTS & COMPANION RELATIONSHIP & CHRONICLE DRAWER (B5) — GRIMOIRE REDESIGN */}
          {activeDrawer === 'quests' && (
            <div className="space-y-4">
              {/* Companion Relationship Plate — Grimoire Bond */}
              <div
                className="relative p-4 bg-[#0D0B0E]/95 border border-[#8A6B3A]/60 shadow-lg space-y-3"
                style={{
                  boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 8px 24px rgba(0, 0, 0, 0.7)',
                }}
              >
                {/* Brass Corner Accents */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#8A6B3A] pointer-events-none" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#8A6B3A] pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#8A6B3A] pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#8A6B3A] pointer-events-none" />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading uppercase tracking-widest text-[#8A6B3A]">
                      Обетные узы
                    </span>
                    <span className="text-[#3A2E1D]">✦</span>
                    <strong className="font-heading text-sm text-[#EDE3CB] tracking-wide">
                      {currentWorld.initialCompanion.name}
                    </strong>
                  </div>
                  <span className="font-heading font-medium text-[#C9A55C] text-sm">
                    {state.companionRelationship > 0 ? `+${state.companionRelationship}` : state.companionRelationship} / 10
                  </span>
                </div>

                {/* Monolithic Brass-Ichor Bond Bar */}
                <div className="w-full h-2.5 bg-[#0A090D] border border-[#8A6B3A]/40 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#593D22] via-[#8A6B3A] to-[#C9A55C] border-t border-amber-200/25 transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(5, ((state.companionRelationship + 10) / 20) * 100)}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] font-prose italic text-[#BAAC93] leading-relaxed">
                  {state.companionRelationship >= 6
                    ? '«Нерасторжимый обет: спутник готов пасть за вас и открывает запретные тропы.»'
                    : state.companionRelationship >= 2
                    ? '«Взаимное доверие: спутник раскрывает тайные слабости скверны и шепчет предостережения.»'
                    : state.companionRelationship >= -2
                    ? '«Холодный союз: вынужденное перемирие перед лицом общей гибели.»'
                    : '«Яд сомнения: спутник ждёт ошибки и может отказать в руке помощи в роковой миг.»'}
                </p>
              </div>

              {/* Chronicle Button — Grimoire parchment */}
              <button
                type="button"
                onClick={() => setShowBacklog(true)}
                className="w-full p-2.5 bg-[#121016] hover:bg-[#1A1622] border border-[#3A2E1D] hover:border-[#8A6B3A] text-xs font-heading tracking-widest uppercase text-[#EDE3CB] transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <BookOpen className="w-4 h-4 text-[#C9A55C]" />
                <span>Летопись принятых решений</span>
              </button>

              {/* Quests Section Header */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-heading uppercase tracking-widest text-[#8A6B3A]">
                  Скрижали испытаний ({state.quests.length})
                </span>
                <span className="h-px flex-1 bg-[#3A2E1D]" />
              </div>

              {/* Main Quests list */}
              {state.quests.map((quest) => (
                <div
                  key={quest.id}
                  className="relative p-4 bg-[#0D0B0E]/95 border border-[#3A2E1D] hover:border-[#8A6B3A]/70 transition-colors space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-heading text-[#EDE3CB] tracking-wide">
                        {quest.title}
                      </h3>
                      <p className="text-xs font-prose text-[#BAAC93] mt-1 leading-relaxed">
                        {quest.objective}
                      </p>
                    </div>

                    {/* Wax Seal Status Badge */}
                    <span
                      className={`text-[9px] font-heading uppercase tracking-widest px-2.5 py-1 border shrink-0 ${
                        quest.status === 'completed'
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                          : quest.status === 'failed'
                          ? 'bg-rose-950/40 border-rose-500/60 text-rose-300'
                          : 'bg-[#1E1912] border-[#8A6B3A]/70 text-[#C9A55C]'
                      }`}
                    >
                      {quest.status === 'completed'
                        ? 'Свершено'
                        : quest.status === 'failed'
                        ? 'Утрачено'
                        : 'В чертогах'}
                    </span>
                  </div>

                  {/* Sub-objectives */}
                  <div className="space-y-2 pt-2.5 border-t border-[#3A2E1D]">
                    <span className="text-[10px] font-heading uppercase tracking-widest text-[#8A6B3A] block">
                      Ступени пути:
                    </span>
                    {quest.subQuests.map((sq) => (
                      <div key={sq.id} className="flex items-start gap-2.5 text-xs font-prose">
                        {sq.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : sq.status === 'failed' ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-[#8A6B3A] shrink-0 mt-0.5" />
                        )}
                        <span className={sq.status === 'completed' ? 'line-through text-[#7D7362]' : 'text-[#EDE3CB]'}>
                          {sq.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Journal Entry / Lore */}
                  {quest.journalEntry && (
                    <div className="p-3 bg-[#070608] border-l-2 border-[#8A6B3A] border-y border-r border-[#3A2E1D]/50 text-xs text-[#BAAC93] font-prose italic">
                      <span className="font-heading uppercase text-[9px] tracking-widest text-[#C9A55C] not-italic block mb-1">
                        Запись в походном фолианте:
                      </span>
                      «{quest.journalEntry}»
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 3. ORACLE DRAWER */}
          {activeDrawer === 'oracle' && (
            <div className="flex flex-col h-full space-y-3">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Модель Оракула:</span>
                <select
                  value={modelTier}
                  onChange={(e) => setModelTier(e.target.value as OracleModelTier)}
                  className="bg-black/60 border border-white/20 rounded-lg text-xs px-2 py-1 text-slate-200 font-mono focus:outline-none focus:border-purple-400"
                >
                  <option value="gemini-2.5-flash">Flash 2.5 (Сбалансированный)</option>
                  <option value="gemini-2.5-flash-lite">Flash-Lite (Быстрый шёпот)</option>
                  <option value="gemini-3.1-pro-preview">Pro (Глубокий лор)</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[16rem]">
                {oracleMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'ml-6 bg-purple-600/30 border border-purple-500/40 text-purple-100'
                        : 'mr-6 bg-black/50 border border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="font-semibold text-purple-300">{msg.personaName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
                {isOracleLoading && (
                  <div className="p-3 mr-6 rounded-xl bg-black/50 border border-white/10 text-xs text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Оракул вглядывается в ткань реальности...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setOracleInput('Что скрывает это место?')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  О локации?
                </button>
                <button
                  onClick={() => setOracleInput('Как применить мои реликвии?')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  Совет по реликвиям
                </button>
                <button
                  onClick={() => setOracleInput('Дай осторожный намёк без спойлеров.')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  Намёк без спойлеров
                </button>
              </div>

              <form onSubmit={handleSendOracle} className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={oracleInput}
                  onChange={(e) => setOracleInput(e.target.value)}
                  placeholder="Задайте вопрос Оракулу..."
                  className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  disabled={!oracleInput.trim() || isOracleLoading}
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* 4. SAVES DRAWER */}
          {activeDrawer === 'saves' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Автосохранение v3 активно. Сохранения поддерживают снимки глав и защищены от потери данных.
              </p>

              {/* Quick access to Chapter Chronicle */}
              {currentWorld.chapters && currentWorld.chapters.length > 0 && (
                <button
                  onClick={() => {
                    closeDrawer();
                    setShowChapterChronicle(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#241D17] border border-[#8A6B3A]/40 text-[#EFE6CF] hover:bg-[#2F261E] hover:border-[#C9A55C]/70 transition shadow"
                >
                  <div className="flex items-center gap-3">
                    <BookMarked className="w-5 h-5 text-[#C9A55C]" />
                    <div className="text-left">
                      <span className="font-heading text-sm text-[#EFE6CF] block">Хроника и возврат к главам</span>
                      <span className="text-[11px] text-[#BAAC93]">
                        Зафиксировано снимков: {Object.keys(state.chapterSnapshots || {}).length} из {currentWorld.chapters.length}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-heading text-[#C9A55C]">Открыть ✦</span>
                </button>
              )}

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <h3 className="text-sm font-semibold text-slate-100 flex items-center justify-between">
                  <span>Слот: {currentWorld.title}</span>
                  <span className="text-xs font-mono text-emerald-400">Версия v3</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Пройдено сцен: {state.history.length} · Найдено предметов: {state.inventory.length}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Запись: {new Date(state.savedAt).toLocaleString('ru-RU')}
                </p>
              </div>

              {/* Backup before rollback slot if available */}
              {(() => {
                const backup = loadBeforeRollbackSlot(worldId);
                if (!backup) return null;
                return (
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="text-xs space-y-0.5 min-w-0">
                      <span className="font-semibold text-amber-200 block">Резервный слот «До отката»</span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {backup.chapterNumber} · {new Date(backup.savedAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    {confirmAction === 'restoreBackup' ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            loadBeforeRollback();
                            setConfirmAction('none');
                            closeDrawer();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-semibold transition cursor-pointer"
                        >
                          Подтвердить
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmAction('none')}
                          className="px-2 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs transition cursor-pointer"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmAction('restoreBackup')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/40 shrink-0 transition cursor-pointer"
                      >
                        Загрузить
                      </button>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => exportSaveAsJson(state)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-slate-200 transition"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Экспорт (.json)
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-slate-200 transition"
                >
                  <Upload className="w-4 h-4 text-sky-400" />
                  Импорт (.json)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    setShowWorldSelect(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-heading font-medium transition cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  Выбрать другой мир (кампанию)
                </button>

                {confirmAction === 'restart' ? (
                  <div className="p-2.5 rounded-xl bg-rose-950/35 border border-rose-500/40 space-y-2">
                    <p className="text-xs text-rose-200 text-center">
                      Начать прохождение этого мира заново? Текущий прогресс будет стёрт.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          restartWorld();
                          setConfirmAction('none');
                          closeDrawer();
                        }}
                        className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Да, начать заново
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmAction('none')}
                        className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmAction('restart')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Перезапустить текущую кампанию
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 5. SETTINGS DRAWER (A1, B1, B6, B7, B8) */}
          {activeDrawer === 'settings' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Настройки геймплея, звукового окружения и нарратива.
              </p>

              {/* Sound Settings (B8) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    Звук и Эмбиент
                  </span>
                  <button
                    onClick={() => {
                      const next = !isMuted;
                      setIsMuted(next);
                      SoundManager.setMuted(next);
                      if (!next) SoundManager.startAmbient(worldId);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                      isMuted ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isMuted ? 'Выключен' : 'Включен'}
                  </button>
                </div>

                {!isMuted && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Громкость</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        SoundManager.setVolume(val);
                      }}
                      className="w-full accent-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Atmosphere switch (A1) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Атмосферные вставки (Ощущения)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Генерация сенсорных деталей через Gemini API
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableAtmosphere}
                  onChange={(e) => setEnableAtmosphere(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              {/* Tags Language (B1) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  Язык тегов выборов:
                </span>
                <div className="flex gap-1 text-xs font-mono">
                  <button
                    onClick={() => setTagsLanguage('ru')}
                    className={`px-2.5 py-1 rounded-lg ${tagsLanguage === 'ru' ? 'bg-amber-500 text-black font-bold' : 'bg-white/10 text-slate-300'}`}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => setTagsLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg ${tagsLanguage === 'en' ? 'bg-amber-500 text-black font-bold' : 'bg-white/10 text-slate-300'}`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Inventory View Mode Setting (Вид сумы: Классический / Новый) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Вид сумы:
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {inventoryViewMode === 'classic'
                        ? 'Классический (быстрые гравюрные иллюстрации, без ИИ)'
                        : 'Новый (с сотворением и кэшированием ИИ-арта)'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-heading">
                  <button
                    type="button"
                    onClick={() => setInventoryViewMode('classic')}
                    className={`py-2 px-3 rounded-lg border transition-all cursor-pointer text-center ${
                      inventoryViewMode === 'classic'
                        ? 'bg-amber-500 text-black font-bold border-amber-400 shadow'
                        : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
                    }`}
                  >
                    Классический
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryViewMode('new')}
                    className={`py-2 px-3 rounded-lg border transition-all cursor-pointer text-center ${
                      inventoryViewMode === 'new'
                        ? 'bg-amber-500 text-black font-bold border-amber-400 shadow'
                        : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
                    }`}
                  >
                    Новый (с ИИ-артом)
                  </button>
                </div>
              </div>

              {/* Показ вариантов выбора (ЧАСТЬ D) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Показ вариантов:
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {choiceDisplayMode === 'manual'
                        ? 'После нажатия (даёт спокойно дочитать текст сцены)'
                        : 'Сразу после текста (автоматический показ вариантов)'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-heading">
                  <button
                    type="button"
                    onClick={() => setChoiceDisplayMode('manual')}
                    className={`py-2 px-3 rounded-lg border transition-all cursor-pointer text-center ${
                      choiceDisplayMode === 'manual'
                        ? 'bg-amber-500 text-black font-bold border-amber-400 shadow'
                        : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
                    }`}
                  >
                    После нажатия
                  </button>
                  <button
                    type="button"
                    onClick={() => setChoiceDisplayMode('auto')}
                    className={`py-2 px-3 rounded-lg border transition-all cursor-pointer text-center ${
                      choiceDisplayMode === 'auto'
                        ? 'bg-amber-500 text-black font-bold border-amber-400 shadow'
                        : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
                    }`}
                  >
                    Сразу после текста
                  </button>
                </div>
              </div>

              {/* Детализация уведомлений (ЧАСТЬ 5) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Детализация уведомлений:
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {notificationVerbosity === 'detailed'
                        ? 'Подробно (предметы, задачи, заметки и Кодекс)'
                        : notificationVerbosity === 'brief'
                        ? 'Кратко (предметы, задачи и Кодекс)'
                        : 'Только важное (только полученные предметы)'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-heading">
                  {(['detailed', 'brief', 'important'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setNotificationVerbosity(mode)}
                      className={`py-2 px-1 rounded-lg border transition-all cursor-pointer text-center ${
                        notificationVerbosity === mode
                          ? 'bg-amber-500 text-black font-bold border-amber-400 shadow'
                          : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
                      }`}
                    >
                      {mode === 'detailed'
                        ? 'Подробно'
                        : mode === 'brief'
                        ? 'Кратко'
                        : 'Только важное'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Novel Text Settings (B6) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Размер шрифта текста:</span>
                  <div className="flex gap-1 font-mono">
                    {(['sm', 'base', 'lg'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`px-2.5 py-1 rounded-lg ${fontSize === sz ? 'bg-amber-500 text-black font-bold' : 'bg-white/10 text-slate-300'}`}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Скорость вывода текста (ЧАСТЬ A) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>Скорость печати:</span>
                    <span className="text-amber-400 font-semibold">
                      {typewriterSpeedMs === 0 ? 'Мгновенно (0мс)' : `${typewriterSpeedMs}мс`}
                    </span>
                  </div>
                  {/* Preset buttons: Медленно, Обычно, Быстро, Мгновенно */}
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                    {[
                      { label: 'Медленно', val: 35 },
                      { label: 'Обычно', val: 20 },
                      { label: 'Быстро', val: 8 },
                      { label: 'Мгновенно', val: 0 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setTypewriterSpeedMs(p.val)}
                        className={`py-1.5 px-1 rounded-sm text-center transition-all ${
                          typewriterSpeedMs === p.val
                            ? 'bg-amber-500 text-black font-bold shadow'
                            : 'bg-white/10 hover:bg-white/15 text-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="5"
                    value={typewriterSpeedMs}
                    onChange={(e) => setTypewriterSpeedMs(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Подсказки значков выбора (ЧАСТЬ C) */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300 font-medium">Показывать подсказки значков:</span>
                  <button
                    type="button"
                    onClick={() => setShowChoiceBadgeHints(!showChoiceBadgeHints)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                      showChoiceBadgeHints ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        showChoiceBadgeHints ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Справочник значков (ЧАСТЬ C) */}
                <div className="border border-[#8A6B3A]/40 rounded-sm p-3 bg-[#0D0B10]/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-semibold text-[#EDE3CB] uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      Справочник значков вариантов
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSettingsBadgeList(!showSettingsBadgeList)}
                      className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {showSettingsBadgeList ? 'Свернуть' : 'Развернуть'}
                    </button>
                  </div>
                  {showSettingsBadgeList && (
                    <div className="pt-2 border-t border-[#3A2E1D]/80 max-h-[300px] overflow-y-auto pr-1">
                      <ChoiceBadgeGuideList />
                    </div>
                  )}
                </div>

                {/* ИИ-иллюстрации сцен (Requirement 4) */}
                <div className="border border-[#8A6B3A]/40 rounded-sm p-3 bg-[#0D0B10]/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-heading font-semibold text-[#EDE3CB] uppercase tracking-wider">
                          Рисовать недостающие кадры в игре, расходует лимит
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Работает только для сцен без готового файла
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiArtEnabled(!aiArtEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                        aiArtEnabled ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          aiArtEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Качество: быстро / лучше */}
                  {aiArtEnabled && (
                    <div className="pt-2 border-t border-[#3A2E1D]/80 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-medium">Качество:</span>
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() => setAiArtQuality('fast')}
                            className={`px-3 py-1 rounded-sm text-center transition-all cursor-pointer ${
                              aiArtQuality === 'fast'
                                ? 'bg-amber-500 text-black font-bold shadow'
                                : 'bg-white/10 hover:bg-white/15 text-slate-300'
                            }`}
                          >
                            Быстро
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiArtQuality('quality')}
                            className={`px-3 py-1 rounded-sm text-center transition-all cursor-pointer ${
                              aiArtQuality === 'quality'
                                ? 'bg-amber-500 text-black font-bold shadow'
                                : 'bg-white/10 hover:bg-white/15 text-slate-300'
                            }`}
                          >
                            Лучше
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-2">
                        <div className="flex items-start justify-between text-[11px] gap-2">
                          <span className="text-slate-400 font-medium flex-shrink-0">
                            Последняя ошибка:
                          </span>
                          <span
                            className={`font-mono text-right truncate max-w-[200px] ${
                              artQueue.getLastErrorReason()
                                ? 'text-rose-400 font-semibold'
                                : 'text-slate-400'
                            }`}
                            title={artQueue.getLastErrorReason() || 'нет ошибок'}
                          >
                            {artQueue.getLastErrorReason() || 'нет ошибок'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            artQueue.clearFailedKeys();
                            const currentScene = currentWorld.scenes[state.currentSceneId];
                            if (currentScene) {
                              const expectedWorldId = currentWorld.id;
                              const expectedSceneId = currentScene.id;
                              artQueue.invalidateAndRetry(currentWorld, currentScene, aiArtQuality, (url, isStub) => {
                                const cur = useGameStore.getState();
                                if (cur.worldId === expectedWorldId && cur.state.currentSceneId === expectedSceneId) {
                                  useGameStore.setState({
                                    currentArtUrl: url,
                                    isArtLoading: Boolean(isStub),
                                  });
                                }
                                if (!isStub && url) {
                                  useGameStore.getState().addSceneArtToGallery({
                                    id: `${expectedWorldId}_${expectedSceneId}`,
                                    worldId: expectedWorldId,
                                    sceneId: expectedSceneId,
                                    sceneTitle: currentScene.chapterTitle || currentScene.location,
                                    location: currentScene.location,
                                    url,
                                  });
                                }
                              });
                            }
                          }}
                          className="w-full py-1.5 px-3 rounded-sm bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                          <span>Попробовать снова</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Скрытый переключатель разработчика */}
                {isDevModeAllowed && (
                  <div className="border border-[#8A6B3A]/40 rounded-xs p-3 bg-[#0D0B10]/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-semibold text-[#EDE3CB] flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-[#C9A55C]" />
                        Режим разработчика
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDevTools(!showDevTools)}
                        className="text-xs font-heading text-[#C9A55C] hover:text-[#EFE6CF] underline cursor-pointer"
                      >
                        {showDevTools ? 'Скрыть' : 'Открыть'}
                      </button>
                    </div>

                    {showDevTools && (
                      <div className="pt-2.5 border-t border-[#8A6B3A]/30">
                        <DevSceneStudio currentWorld={currentWorld} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Extra Modals Triggers (B4, B7) */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    setShowWorldSelect(true);
                  }}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Сменить мир</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEndings(true)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Все концовки</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGallery(true)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Галерея CG</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
