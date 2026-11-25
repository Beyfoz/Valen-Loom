import React, { useEffect, useState, useMemo, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Lock,
  RotateCcw,
  Trophy,
  Skull,
  Award,
  Search,
  Undo2,
  BookOpen,
  Play,
  Pause,
  Dices,
  Eye,
  Droplet,
  Sword,
  MessageSquare,
  VenetianMask,
  X,
  Scroll,
  Gem,
  Hand,
  HelpCircle,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import { getWorld } from '../worlds';
import { canMakeChoice, getItemHumanName } from '../engine/gameEngine';
import { getScenePages } from '../engine/pages';
import { NewGamePlusModal } from './NewGamePlusModal';
import { SceneChoice, CodexEntry } from '../types';
import { getItemIllustration } from './itemIllustrations';
import { ChoiceBadgeGuideList } from './ChoiceBadgeGuide';
import { getDefaultWorldCodex, isCodexEntryUnlocked } from '../data/codexData';
import {
  buildCodexMatchers,
  findCodexMatchesInText,
  getFirstLineOfCodexContent,
  CodexMatcher,
} from '../utils/codexMatcher';

interface CodexInlineLinkProps {
  entry: CodexEntry;
  matchedText: string;
  onOpenCodex: (id: string) => void;
}

const CodexInlineLink: React.FC<CodexInlineLinkProps> = ({
  entry,
  matchedText,
  onOpenCodex,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    transform: string;
  } | null>(null);

  const { dialogueChunkIndex, state } = useGameStore();
  const currentSceneId = state.currentSceneId;

  // Close mini-card when dialogue page or scene changes
  useEffect(() => {
    setIsOpen(false);
  }, [dialogueChunkIndex, currentSceneId]);

  // Compute position relative to viewport using getBoundingClientRect
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cardWidth = Math.min(320, window.innerWidth - 24);

    // Center horizontally on the matched link, clamped to viewport with 12px padding
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - cardWidth - 12));

    // Place above if space permits (approx 220px height), otherwise place below
    const cardEstHeight = 220;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    let top: number;
    let transform: string;

    if (spaceAbove >= cardEstHeight + 16 || spaceAbove > spaceBelow) {
      top = Math.max(12, rect.top - 8);
      transform = 'translateY(-100%)';
    } else {
      top = Math.min(window.innerHeight - 12, rect.bottom + 8);
      transform = 'none';
    }

    setCoords({ top, left, width: cardWidth, transform });
  };

  // Close mini-card when clicking outside, pressing Escape, or scrolling
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const firstLine = getFirstLineOfCodexContent(entry.content);

  return (
    <span ref={containerRef} className="relative inline-block text-left">
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        title={`Запись в Кодексе: ${entry.title}`}
        className="border-b border-dashed border-[#C9A55C]/90 text-[#FFF1C5] hover:text-[#FFF8E7] hover:border-[#FFE8A3] cursor-pointer transition-colors font-medium select-text"
      >
        {matchedText}
      </span>

      {/* Mini-card popover rendered via Portal in document.body above HUD & dialogue */}
      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={popoverRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[9999] p-3 rounded-sm bg-[#120F18]/98 border border-[#8A6B3A] backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.95)] animate-fadeIn text-left cursor-default block select-none pointer-events-auto"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              transform: coords.transform,
              boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 16px 40px rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Brass corner brackets */}
            <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#C9A55C] pointer-events-none block" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#C9A55C] pointer-events-none block" />
            <span className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#C9A55C] pointer-events-none block" />
            <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#C9A55C] pointer-events-none block" />

            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#3A2E1D] pb-1.5 mb-2">
              <span className="flex items-center gap-1.5 min-w-0">
                <Scroll className="w-3.5 h-3.5 text-[#C9A55C] shrink-0 inline" />
                <span className="text-[10px] font-heading uppercase tracking-widest text-[#E8CF8A] font-bold">
                  {entry.category}
                </span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-[#8A7E6C] hover:text-[#EDE3CB] p-0.5 cursor-pointer"
                aria-label="Закрыть карточку"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title */}
            <span className="font-heading text-sm text-[#EDE3CB] font-bold block mb-1 leading-snug">
              {entry.title}
            </span>

            {/* First line/sentence of entry */}
            <span className="font-prose text-xs text-[#BAAC93] leading-relaxed block mb-3 line-clamp-3">
              {firstLine}
            </span>

            {/* Action button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onOpenCodex(entry.id);
              }}
              className="w-full py-1.5 px-3 bg-[#2A1F13] hover:bg-[#3D2C1B] border border-[#C9A55C] text-[#FFF1C5] hover:text-white text-xs font-heading font-medium rounded-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Scroll className="w-3.5 h-3.5 text-[#C9A55C]" />
              <span>Открыть в Кодексе</span>
            </button>
          </div>,
          document.body
        )}
    </span>
  );
};

function renderPlainTextWithCodexLinks(
  plainText: string,
  matchers: CodexMatcher[],
  onOpenCodex: (id: string) => void,
  keyPrefix: string
): React.ReactNode {
  if (!plainText) return null;
  if (!matchers || matchers.length === 0) return plainText;

  const matches = findCodexMatchesInText(plainText, matchers);
  if (matches.length === 0) return plainText;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((m, idx) => {
    if (m.start > lastIndex) {
      nodes.push(plainText.slice(lastIndex, m.start));
    }
    nodes.push(
      <CodexInlineLink
        key={`${keyPrefix}-cx-${idx}-${m.entry.id}`}
        entry={m.entry}
        matchedText={m.matchedText}
        onOpenCodex={onOpenCodex}
      />
    );
    lastIndex = m.end;
  });

  if (lastIndex < plainText.length) {
    nodes.push(plainText.slice(lastIndex));
  }

  return nodes;
}

/**
 * Safely renders bold (**text**) and italic (*text*) formatting
 * without external markdown libraries, linking opened Codex entries.
 */
function renderFormattedText(
  text: string,
  matchers: CodexMatcher[] = [],
  onOpenCodex: (id: string) => void = () => {}
): React.ReactNode {
  if (!text) return null;

  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const pattern = /(\*\*[^*]+?\*\*|\*[^*]+?\*)/;

  while (remaining.length > 0) {
    const match = remaining.match(pattern);
    if (!match || match.index === undefined) {
      // Incomplete bold/italic during typewriter animation
      const unclosedBold = remaining.match(/^(.*?)\*\*([^*]*)$/);
      if (unclosedBold) {
        if (unclosedBold[1]) {
          tokens.push(
            <span key={key++}>
              {renderPlainTextWithCodexLinks(unclosedBold[1], matchers, onOpenCodex, `ub1-${key}`)}
            </span>
          );
        }
        tokens.push(
          <strong key={key++} className="font-medium text-[#C9A55C]">
            {renderPlainTextWithCodexLinks(unclosedBold[2], matchers, onOpenCodex, `ub2-${key}`)}
          </strong>
        );
        break;
      }

      const unclosedItalic = remaining.match(/^(.*?)\*([^*]*)$/);
      if (unclosedItalic) {
        if (unclosedItalic[1]) {
          tokens.push(
            <span key={key++}>
              {renderPlainTextWithCodexLinks(unclosedItalic[1], matchers, onOpenCodex, `ui1-${key}`)}
            </span>
          );
        }
        tokens.push(
          <em key={key++} className="italic text-[#BAAC93]">
            {renderPlainTextWithCodexLinks(unclosedItalic[2], matchers, onOpenCodex, `ui2-${key}`)}
          </em>
        );
        break;
      }

      tokens.push(
        <span key={key++}>
          {renderPlainTextWithCodexLinks(remaining, matchers, onOpenCodex, `rem-${key}`)}
        </span>
      );
      break;
    }

    if (match.index > 0) {
      tokens.push(
        <span key={key++}>
          {renderPlainTextWithCodexLinks(
            remaining.slice(0, match.index),
            matchers,
            onOpenCodex,
            `seg-${key}`
          )}
        </span>
      );
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      tokens.push(
        <strong key={key++} className="font-medium text-[#C9A55C]">
          {renderPlainTextWithCodexLinks(
            matchedStr.slice(2, -2),
            matchers,
            onOpenCodex,
            `b-${key}`
          )}
        </strong>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      tokens.push(
        <em key={key++} className="italic text-[#BAAC93]">
          {renderPlainTextWithCodexLinks(
            matchedStr.slice(1, -1),
            matchers,
            onOpenCodex,
            `i-${key}`
          )}
        </em>
      );
    }

    remaining = remaining.slice(match.index + matchedStr.length);
  }

  return tokens;
}

/**
 * Splits long text chunks into readable pages by sentence boundaries
 * if it exceeds 5 visual lines (~300 characters / 55-60 words).
 */
function splitTextIntoSentences(text: string, maxChars = 320): string[] {
  if (!text || text.length <= maxChars) {
    return [text];
  }

  const regex = /([^.!?…\n]+[.!?…]+|[^.!?…\n]+$)/g;
  const rawSentences: string[] = [];
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    const s = m[0].trim();
    if (s) rawSentences.push(s);
  }

  if (rawSentences.length <= 1) {
    return [text];
  }

  const chunks: string[] = [];
  let current = '';

  for (const sentence of rawSentences) {
    if (!current) {
      current = sentence;
    } else if ((current + ' ' + sentence).length <= maxChars) {
      current += ' ' + sentence;
    } else {
      chunks.push(current);
      current = sentence;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length > 0 ? chunks : [text];
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const DialogueBox: React.FC = () => {
  const {
    state,
    worldId,
    dialogueChunkIndex,
    isTypewriterComplete,
    skipTypewriter,
    makeChoice,
    restartWorld,
    startNewGamePlus,
    setShowWorldSelect,
    enableAtmosphere,
    isSensoryOpen,
    toggleSensoryOpen,
    activeSensory,
    isEnriching,
    typewriterSpeedMs,
    fontSize,
    sceneResetCounter,
    autoPlay,
    toggleAutoPlay,
    canRewind,
    rewindChoice,
    setShowHotspots,
    showBacklog,
    setShowBacklog,
    showCodex,
    showGallery,
    showEndings,
    showChapterChronicle,
    showWorldSelect,
    inspectedItemDetail,
    activeSkillCheck,
    activeDrawer,
    showChoiceBadgeHints,
    hasSeenBadgeHelpPrompt,
    setHasSeenBadgeHelpPrompt,
    openCodexWithEntry,
    choiceDisplayMode,
    companionToast,
    isAnyModalOpen,
  } = useGameStore();

  const world = getWorld(worldId);
  const currentScene = world.scenes[state.currentSceneId] || world.scenes[world.startSceneId];

  // 3. Matchers for already unlocked Codex entries of the current world
  const unlockedCodexEntries = useMemo(() => {
    const codex =
      world.codex && world.codex.length > 0 ? world.codex : getDefaultWorldCodex(world.id) || [];
    return codex.filter((e) => isCodexEntryUnlocked(e, state));
  }, [world, state]);

  const codexMatchers = useMemo(() => {
    return buildCodexMatchers(unlockedCodexEntries);
  }, [unlockedCodexEntries]);

  // Raw narrative pages from engine (supports reactive pages and speaker tags)
  const basePages = useMemo(() => {
    return getScenePages(currentScene, state);
  }, [currentScene, state]);

  // Sub-split pages if text is long (> 5 lines at ~60ch column = ~300-340 chars)
  const expandedPages = useMemo(() => {
    const res: Array<{
      text: string;
      rawText: string;
      speaker?: { name: string; emotion: string; avatarUrl?: string };
      isSceneStart?: boolean;
    }> = [];

    basePages.forEach((page, pIdx) => {
      const sentences = splitTextIntoSentences(page.text, 320);
      sentences.forEach((subText, sIdx) => {
        res.push({
          text: subText,
          rawText: page.rawText,
          speaker: page.speaker,
          isSceneStart: pIdx === 0 && sIdx === 0,
        });
      });
    });

    return res.length > 0 ? res : [{ text: '...', rawText: '...', isSceneStart: true }];
  }, [basePages]);

  // Local chunk index for refined pagination
  const [subChunkIndex, setSubChunkIndex] = useState(0);

  // Choices open state (ЧАСТЬ D: по умолчанию false)
  const [choicesOpen, setChoicesOpen] = useState(false);

  // Time when typewriter finished to protect against accidental double tap (200ms)
  const typewriterCompletedAtRef = useRef<number>(0);

  // Sync / Reset choicesOpen in false only on genuine scene transitions or campaign resets
  useEffect(() => {
    setSubChunkIndex(0);
    setChoicesOpen(false);
  }, [worldId, state.currentSceneId, sceneResetCounter]);

  // Keep in bounds
  const clampedIndex = Math.min(subChunkIndex, expandedPages.length - 1);
  const currentPage = expandedPages[clampedIndex] || expandedPages[0];
  const currentChunkText = currentPage.text;
  const isLastChunk = clampedIndex >= expandedPages.length - 1;

  // Active speaker for the current chunk
  const currentSpeaker = currentPage.speaker || currentScene?.activeSpeaker;

  // Typewriter text state
  const [displayedText, setDisplayedText] = useState('');
  const [localTypewriterDone, setLocalTypewriterDone] = useState(false);
  const [showNGPlus, setShowNGPlus] = useState(false);

  const isModalBlocked = isAnyModalOpen() || showNGPlus;
  const isModalBlockedRef = useRef(isModalBlocked);
  isModalBlockedRef.current = isModalBlocked;

  // Typewriter interval timer ref (ЧАСТЬ A)
  const typewriterTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCtrlHeldRef = useRef(false);

  // Badge handbook popover state (ЧАСТЬ C)
  const [showBadgeHelp, setShowBadgeHelp] = useState(false);
  const badgePopoverRef = useRef<HTMLDivElement>(null);
  const helpBtnRef = useRef<HTMLButtonElement>(null);

  const stopTypewriter = () => {
    if (typewriterTimerRef.current !== null) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
  };

  const completeTypewriterInstantly = () => {
    stopTypewriter();
    setDisplayedText(currentChunkText);
    setLocalTypewriterDone(true);
    typewriterCompletedAtRef.current = Date.now();
    skipTypewriter();
  };

  // Listen for Ctrl key to speed up typewriter by 5x without restarting progress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalBlockedRef.current) {
        isCtrlHeldRef.current = false;
        return;
      }
      if (e.key === 'Control' || e.ctrlKey) {
        isCtrlHeldRef.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || !e.ctrlKey) {
        isCtrlHeldRef.current = false;
      }
    };
    const handleBlur = () => {
      isCtrlHeldRef.current = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Main Typewriter Effect with ref management & 0ms instant mode (pauses cleanly while modals are open)
  useEffect(() => {
    stopTypewriter();

    // If speed is 0 ("Мгновенно"), complete immediately without animation
    if (typewriterSpeedMs === 0) {
      setDisplayedText(currentChunkText);
      setLocalTypewriterDone(true);
      typewriterCompletedAtRef.current = Date.now();
      skipTypewriter();
      return;
    }

    setLocalTypewriterDone(false);
    setDisplayedText('');
    let idx = 0;

    typewriterTimerRef.current = setInterval(() => {
      if (isModalBlockedRef.current) return;
      idx += isCtrlHeldRef.current ? 5 : 1;
      if (idx >= currentChunkText.length) {
        stopTypewriter();
        setDisplayedText(currentChunkText);
        setLocalTypewriterDone(true);
        typewriterCompletedAtRef.current = Date.now();
        skipTypewriter();
      } else {
        setDisplayedText(currentChunkText.slice(0, idx));
      }
    }, typewriterSpeedMs);

    return () => {
      stopTypewriter();
    };
  }, [currentChunkText, typewriterSpeedMs, skipTypewriter]);

  // Choices mode is active only when on the last page, typewriter finished, and choicesOpen is true (Пункт 1)
  // or if setting is 'auto', automatically open unless skipped manually
  const isChoiceMode = isLastChunk && localTypewriterDone && choicesOpen;

  // Auto-open choices when setting is 'auto' and typewriter finished naturally
  useEffect(() => {
    if (choiceDisplayMode === 'auto' && isLastChunk && localTypewriterDone && !choicesOpen && !isModalBlocked) {
      const timer = setTimeout(() => {
        setChoicesOpen(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [choiceDisplayMode, isLastChunk, localTypewriterDone, choicesOpen, isModalBlocked]);

  const advanceSubChunk = () => {
    if (!localTypewriterDone) {
      // 1st click during typing: instantly show all text on page and DO NOT open choices (Пункт 4)
      completeTypewriterInstantly();
      return;
    }

    // Protection from accidental double click: ignore clicks within 200ms of finishing typing (Пункт 4)
    if (Date.now() - typewriterCompletedAtRef.current < 200) {
      return;
    }

    if (clampedIndex < expandedPages.length - 1) {
      // Advance to next page of current scene
      setSubChunkIndex((prev) => prev + 1);
      setChoicesOpen(false);
    } else {
      // On the final page, explicit click opens choices / endings (Пункты 2, 3, 9)
      setChoicesOpen(true);
    }
  };

  // ↺ перечитать: возвращает к тексту последней страницы (choicesOpen=false, текст сразу целиком без анимации) (Пункт 7)
  const reReadScene = () => {
    stopTypewriter();
    setDisplayedText(currentChunkText);
    setLocalTypewriterDone(true);
    setChoicesOpen(false);
  };

  // AutoPlay logic: stops on last chunk and pauses while modals are open
  useEffect(() => {
    if (!autoPlay || isModalBlocked) return;
    if (localTypewriterDone && !isLastChunk) {
      const timer = setTimeout(() => {
        advanceSubChunk();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isModalBlocked, localTypewriterDone, isLastChunk, clampedIndex]);

  const advanceSubChunkRef = useRef(advanceSubChunk);
  advanceSubChunkRef.current = advanceSubChunk;

  const reReadSceneRef = useRef(reReadScene);
  reReadSceneRef.current = reReadScene;

  const isChoiceModeRef = useRef(isChoiceMode);
  isChoiceModeRef.current = isChoiceMode;

  // Filter out choices hidden when locked
  const visibleChoices = useMemo(() => {
    if (!currentScene?.choices) return [];
    return currentScene.choices.filter((choice) => {
      if (choice.hideIfLocked) {
        const check = canMakeChoice(choice, state, world);
        return check.allowed;
      }
      return true;
    });
  }, [currentScene?.choices, state, world]);

  const visibleChoicesRef = useRef(visibleChoices);
  visibleChoicesRef.current = visibleChoices;

  const makeChoiceRef = useRef(makeChoice);
  makeChoiceRef.current = makeChoice;

  // Keyboard controls: Space / Enter to advance, Backspace / ArrowUp to reread, digits to pick choice (Пункт 4, 7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. If any modal / window is open, DialogueBox must NOT react to Space, Enter, ArrowUp, Backspace, Ctrl, or digits!
      if (isModalBlockedRef.current) {
        return;
      }

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ignore key repeat (e.repeat) as per requirement 4
      if (e.repeat) {
        return;
      }

      // 7. Backspace or ArrowUp re-reads last page when in choices mode
      if (isChoiceModeRef.current && (e.code === 'Backspace' || e.key === 'ArrowUp')) {
        e.preventDefault();
        reReadSceneRef.current();
        return;
      }

      // Digits (1-9) for selecting choices when in choices mode
      if (isChoiceModeRef.current) {
        const digitMatch = e.code.match(/^(?:Digit|Numpad)([1-9])$/);
        if (digitMatch) {
          const choiceIndex = parseInt(digitMatch[1], 10) - 1;
          const choice = visibleChoicesRef.current[choiceIndex];
          if (choice) {
            e.preventDefault();
            makeChoiceRef.current(choice);
            return;
          }
        }
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (!isChoiceModeRef.current) {
          e.preventDefault();
          advanceSubChunkRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Confetti effect for victory ending
  useEffect(() => {
    if (currentScene?.isEnding && currentScene.endingType === 'victory') {
      try {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#E8CF8A', '#C9A55C', '#8A6B3A', '#FFFFFF'],
        });
      } catch {}
    }
  }, [currentScene?.id]);

  // Close badge popover on outside click or Esc (ЧАСТЬ C)
  useEffect(() => {
    if (!showBadgeHelp) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (
        badgePopoverRef.current &&
        !badgePopoverRef.current.contains(target) &&
        helpBtnRef.current &&
        !helpBtnRef.current.contains(target)
      ) {
        setShowBadgeHelp(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowBadgeHelp(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showBadgeHelp]);

  // First time hint for choices with skill checks (ЧАСТЬ C)
  const hasSkillCheckInChoices = useMemo(() => {
    return visibleChoices.some((c) => Boolean(c.skillCheck));
  }, [visibleChoices]);

  const showFirstTimeHint =
    isChoiceMode &&
    hasSkillCheckInChoices &&
    !hasSeenBadgeHelpPrompt &&
    showChoiceBadgeHints !== false;

  const dismissFirstTimeHint = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasSeenBadgeHelpPrompt(true);
  };

  // Adaptive height and layout calculation for choices
  const frameRef = useRef<HTMLDivElement>(null);
  const choicesListRef = useRef<HTMLDivElement>(null);
  const quoteHeaderRef = useRef<HTMLDivElement>(null);

  const [compactText, setCompactText] = useState(false);
  const [expandedMaxHeight, setExpandedMaxHeight] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 768);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const useTwoColumns = windowWidth > 900 && visibleChoices.length >= 4;

  useLayoutEffect(() => {
    if (!isChoiceMode) {
      setCompactText(false);
      setExpandedMaxHeight(false);
      return;
    }

    const listEl = choicesListRef.current;
    const quoteEl = quoteHeaderRef.current;
    if (!listEl) return;

    const vh = windowHeight;
    const h56 = vh * 0.56;
    const headerH = quoteEl ? quoteEl.offsetHeight : 36;
    const paddingH = windowWidth >= 640 ? 48 : 32;
    const extraH = headerH + paddingH + 16;
    const avail56 = Math.max(100, h56 - extraH);
    const neededHeight = listEl.scrollHeight;

    if (!compactText && !expandedMaxHeight) {
      if (neededHeight > avail56) {
        setCompactText(true);
      }
    } else if (compactText && !expandedMaxHeight) {
      if (neededHeight > avail56) {
        setExpandedMaxHeight(true);
      } else if (neededHeight <= avail56 - 32) {
        setCompactText(false);
      }
    } else if (expandedMaxHeight) {
      if (neededHeight <= avail56 - 20) {
        setExpandedMaxHeight(false);
      }
    }
  }, [
    isChoiceMode,
    visibleChoices.length,
    compactText,
    expandedMaxHeight,
    useTwoColumns,
    windowWidth,
    windowHeight,
  ]);

  // Hotspots check for search button badge
  const sceneHotspots = currentScene?.hotspots || [];
  const undiscoveredHotspotsCount = sceneHotspots.filter(
    (h) => (state.hotspotsStatus?.[h.id] || 'uninspected') !== 'found'
  ).length;

  /**
   * Renders the single right-hand choice badge according to Part B specs:
   * - Skill check: Dices icon + 3-letter attribute + DC with dedicated attribute border color
   * - Item requirement: small item thumbnail + "есть" / "нужен ..."
   * - Approach without check: unique weapon/speech/mask/sparkle/search/gem/drop/hand icon
   * - If no approach and no check: null (only diamond marker)
   */
  const renderChoiceGlyph = (choice: SceneChoice) => {
    // 1. Skill Check (d20)
    if (choice.skillCheck) {
      const attr = choice.skillCheck.attribute;
      let shortName = 'СИЛ';
      let color = '#E58282'; // Сила красный
      let bg = 'rgba(229, 130, 130, 0.14)';

      if (attr === 'strength') {
        shortName = 'СИЛ';
        color = '#E58282';
        bg = 'rgba(229, 130, 130, 0.14)';
      } else if (attr === 'intellect') {
        shortName = 'РАЗ';
        color = '#8BA4F9'; // Разум фиолетовый
        bg = 'rgba(139, 164, 249, 0.14)';
      } else if (attr === 'perception') {
        shortName = 'ВНИ';
        color = '#6EE7B7'; // Внимание бирюзовый
        bg = 'rgba(110, 231, 183, 0.14)';
      } else if (attr === 'charisma') {
        shortName = 'ХАР';
        color = '#FDE047'; // Харизма золотой
        bg = 'rgba(253, 224, 71, 0.14)';
      }

      return (
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border text-[11px] font-mono font-bold tracking-tight shadow-sm shrink-0 select-none"
          style={{
            borderColor: color,
            color: color,
            backgroundColor: bg,
          }}
          title={`Проверка: ${shortName}, сложность ${choice.skillCheck.dc}. Успех зависит от броска d20.`}
        >
          <Dices className="w-3.5 h-3.5 shrink-0" style={{ color }} />
          <span>
            {shortName} {choice.skillCheck.dc}
          </span>
        </div>
      );
    }

    // 2. Condition by item
    if (choice.condition?.hasItem) {
      const requiredItemId = choice.condition.hasItem;
      const hasItem = state.inventory.some((i) => i.id === requiredItemId);
      const itemName = getItemHumanName(requiredItemId, world, state.inventory);
      const illustrationUrl = getItemIllustration({
        id: requiredItemId,
        name: itemName,
      });

      return (
        <div className="flex items-center gap-1.5 shrink-0 select-none">
          <div className="w-4 h-4 rounded-xs overflow-hidden border border-[#8A6B3A]/60 bg-[#07060A] shrink-0">
            <img src={illustrationUrl} alt="" className="w-full h-full object-cover" />
          </div>
          {hasItem ? (
            <span className="text-[10px] font-heading uppercase tracking-wider text-[#A7F3D0] border border-[#059669]/50 bg-[#064E3B]/40 px-1 py-0.2 rounded-xs">
              есть
            </span>
          ) : (
            <span
              className="text-[10px] font-heading uppercase tracking-wider text-[#FCA5A5] border border-[#DC2626]/50 bg-[#7F1D1D]/40 px-1 py-0.2 rounded-xs max-w-[70px] truncate"
              title={`Нужен: ${itemName}`}
            >
              нужен
            </span>
          )}
        </div>
      );
    }

    // 3. Approach without check (unique icons, Dices is never default)
    if (choice.approach === 'Audacious') {
      return (
        <span title="Дерзкий подход" className="inline-flex shrink-0">
          <Sword className="w-4 h-4 text-[#F87171]" />
        </span>
      );
    }
    if (choice.approach === 'Diplomatic') {
      return (
        <span title="Дипломатический подход" className="inline-flex shrink-0">
          <MessageSquare className="w-4 h-4 text-[#60A5FA]" />
        </span>
      );
    }
    if (choice.approach === 'Shadow') {
      return (
        <span title="Скрытный манёвр" className="inline-flex shrink-0">
          <VenetianMask className="w-4 h-4 text-[#9CA3AF]" />
        </span>
      );
    }
    if (choice.approach === 'Arcane') {
      return (
        <span title="Мистическое действие" className="inline-flex shrink-0">
          <Sparkles className="w-4 h-4 text-[#B794F6]" />
        </span>
      );
    }
    if (choice.approach === 'Investigative') {
      return (
        <span title="Расследование" className="inline-flex shrink-0">
          <Search className="w-4 h-4 text-[#38BDF8]" />
        </span>
      );
    }
    if (choice.approach === 'Relic' || choice.tag === 'RELIC') {
      return (
        <span title="Сила реликвии" className="inline-flex shrink-0">
          <Gem className="w-4 h-4 text-[#F59E0B]" />
        </span>
      );
    }
    if (choice.approach === 'Surrender') {
      return (
        <span title="Смирение" className="inline-flex shrink-0">
          <Hand className="w-4 h-4 text-[#D1D5DB]" />
        </span>
      );
    }
    if (choice.tag === 'SACRIFICE') {
      return (
        <span title="Жертвенный выбор" className="inline-flex shrink-0">
          <Droplet className="w-4 h-4 text-[#F87171]" />
        </span>
      );
    }

    // No approach = no icon at all
    return null;
  };

  /**
   * Price tags for negative healthDelta or sanityDelta in choice effect
   */
  const renderChoiceCosts = (choice: SceneChoice) => {
    const hasHpCost = choice.effect?.healthDelta && choice.effect.healthDelta < 0;
    const hasSanCost = choice.effect?.sanityDelta && choice.effect.sanityDelta < 0;
    if (!hasHpCost && !hasSanCost) return null;

    return (
      <div className="flex items-center gap-1.5 shrink-0 select-none">
        {hasHpCost && (
          <span
            className="inline-flex items-center gap-0.5 text-[11px] text-[#F87171] font-mono font-semibold"
            title={`Урон здоровью: ${choice.effect!.healthDelta}`}
          >
            <Droplet className="w-3 h-3 text-[#EF4444]" />
            {choice.effect!.healthDelta}
          </span>
        )}
        {hasSanCost && (
          <span
            className="inline-flex items-center gap-0.5 text-[11px] text-[#818CF8] font-mono font-semibold"
            title={`Урон рассудку: ${choice.effect!.sanityDelta}`}
          >
            <Eye className="w-3 h-3 text-[#6366F1]" />
            {choice.effect!.sanityDelta}
          </span>
        )}
      </div>
    );
  };

  const getApproachTooltipRu = (choice: SceneChoice): string => {
    if (choice.skillCheck) {
      const attrNames: Record<string, string> = {
        strength: 'Сила',
        intellect: 'Разум',
        perception: 'Внимание',
        charisma: 'Харизма',
      };
      const name = attrNames[choice.skillCheck.attribute] || choice.skillCheck.attribute;
      return `Проверка: ${name}, сложность ${choice.skillCheck.dc}. Успех зависит от броска d20.`;
    }
    const map: Record<string, string> = {
      Audacious: 'Дерзкий подход: решительное и рискованное действие',
      Diplomatic: 'Дипломатия: убеждение, такт и поиск компромисса',
      Shadow: 'Скрытность: осторожный манёвр в тенях',
      Arcane: 'Мистика: обращение к тайным силам и магии',
      Investigative: 'Расследование: внимательный осмотр и логический анализ',
      Relic: 'Реликвия: использование силы древнего артефакта',
      Surrender: 'Смирение: подчинение обстоятельствам или воле рока',
    };
    if (choice.approach && map[choice.approach]) return map[choice.approach];
    if (choice.tag === 'SACRIFICE') return 'Жертва: добровольная потеря ресурсов ради высшей цели';
    if (choice.tag === 'RELIC') return 'Реликвия: использование силы древнего артефакта';
    if (choice.condition?.hasItem) {
      const hasIt = state.inventory.some((i) => i.id === choice.condition?.hasItem);
      return hasIt ? 'Требуемый предмет есть в инвентаре' : 'Требуется предмет в инвентаре';
    }
    return 'Обычное сюжетное действие';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col justify-end items-center px-2 sm:px-4 pb-2.5 sm:pb-4 w-full pt-[60px] overflow-visible">
      <div
        className="w-full flex flex-col items-end overflow-visible relative"
        style={{ maxWidth: 'min(900px, 94vw)' }}
      >
        {/*
          Top-right action row (OUTSIDE the frame)
          e.stopPropagation() on all buttons prevents skipping typewriter (ЧАСТЬ A6)
        */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full flex flex-wrap items-center justify-end gap-1 sm:gap-1.5 mb-[16px] bg-transparent pointer-events-none select-none z-20"
        >
          {/* Осмотреться */}
          {sceneHotspots.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowHotspots(true);
              }}
              className={`pointer-events-auto h-[34px] sm:h-[36px] px-2.5 min-[720px]:px-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[#CDBF9F] hover:text-[#EFE6CF] hover:bg-[#C9A55C]/10 border border-[#8A6B3A]/30 ${
                undiscoveredHotspotsCount > 0
                  ? 'border-[#C9A55C]/60 bg-[#C9A55C]/15 text-[#EFE6CF] underline underline-offset-4 decoration-[#C9A55C]'
                  : 'bg-transparent'
              }`}
              style={{
                clipPath:
                  'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
              }}
              title="Осмотреться в локации"
            >
              <Search className="w-3.5 h-3.5 text-[#C9A55C] shrink-0" />
              <span className="dialogue-btn-label hidden min-[720px]:inline">Осмотреться</span>
            </button>
          )}

          {/* Ощущения */}
          {enableAtmosphere && !currentScene?.isEnding && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSensoryOpen();
              }}
              className={`pointer-events-auto h-[34px] sm:h-[36px] px-2.5 min-[720px]:px-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                isSensoryOpen
                  ? 'bg-[#C9A55C]/15 border-[#C9A55C]/70 text-[#EFE6CF] underline underline-offset-4 decoration-[#C9A55C]'
                  : 'bg-transparent border-[#8A6B3A]/30 text-[#CDBF9F] hover:text-[#EFE6CF] hover:bg-[#C9A55C]/10'
              }`}
              style={{
                clipPath:
                  'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
              }}
              title="Шёпот ощущений"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#768BC7] shrink-0" />
              <span className="dialogue-btn-label hidden min-[720px]:inline">Ощущения</span>
            </button>
          )}

          {/* Thin divider between "Ощущения" and "Назад" */}
          <span className="w-px h-4 bg-[#8A6B3A]/40 mx-0.5 shrink-0 pointer-events-none" />

          {/* Назад (Rewind) */}
          {canRewind && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                rewindChoice();
              }}
              className="pointer-events-auto h-[34px] sm:h-[36px] px-2.5 min-[720px]:px-3 flex items-center justify-center gap-1.5 bg-transparent border border-[#8A6B3A]/30 text-[#CDBF9F] hover:text-[#EFE6CF] hover:bg-[#C9A55C]/10 transition-all cursor-pointer"
              style={{
                clipPath:
                  'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
              }}
              title="Откатить предыдущий выбор"
            >
              <Undo2 className="w-3.5 h-3.5 text-[#BAAC93] shrink-0" />
              <span className="dialogue-btn-label hidden min-[720px]:inline">Назад</span>
            </button>
          )}

          {/* Журнал (Backlog) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowBacklog(true);
            }}
            className="pointer-events-auto h-[34px] sm:h-[36px] px-2.5 min-[720px]:px-3.5 flex items-center justify-center gap-1.5 bg-transparent border border-[#8A6B3A]/30 text-[#CDBF9F] hover:text-[#EFE6CF] hover:bg-[#C9A55C]/10 transition-all cursor-pointer"
            style={{
              clipPath:
                'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
            }}
            title="Летопись прочитанного диалога"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C9A55C] shrink-0" />
            <span className="dialogue-btn-label hidden min-[720px]:inline">Журнал</span>
          </button>

          {/* Авто */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleAutoPlay();
            }}
            className={`pointer-events-auto h-[34px] sm:h-[36px] px-2.5 min-[720px]:px-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              autoPlay
                ? 'bg-[#C9A55C]/15 border-[#C9A55C]/70 text-[#EFE6CF] underline underline-offset-4 decoration-[#C9A55C]'
                : 'bg-transparent border-[#8A6B3A]/30 text-[#CDBF9F] hover:text-[#EFE6CF] hover:bg-[#C9A55C]/10'
            }`}
            style={{
              clipPath:
                'polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)',
            }}
            title={autoPlay ? 'Автопрокрутка активна' : 'Включить автопрокрутку'}
          >
            {autoPlay ? (
              <Pause className="w-3.5 h-3.5 text-[#C9A55C] shrink-0" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#C9A55C] shrink-0" />
            )}
            <span className="dialogue-btn-label hidden min-[720px]:inline">Авто</span>
          </button>
        </div>

        {/* 
          Main Dialogue Frame:
          - Max width: min(900px, 94vw)
          - Max height: 56vh adaptive up to 70vh
          - Background: linear gradient bottom-to-top from #0B0A0D at 94% to 82% at top
          - Blur: 12px backdrop filter
          - Inner border: #4A3A22 + outer drop shadow
          - 32px gradient band above frame transitioning smoothly to art
        */}
        <div
          ref={frameRef}
          className={`pointer-events-auto relative w-full border border-[#8A6B3A]/60 flex flex-col justify-between overflow-visible transition-[max-height] duration-300 ${
            expandedMaxHeight ? 'max-h-[70vh]' : 'max-h-[56vh]'
          }`}
          style={{
            background:
              'linear-gradient(to top, rgba(11, 10, 13, 0.94) 0%, rgba(11, 10, 13, 0.82) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: 'inset 0 0 0 1px #4A3A22, 0 16px 40px rgba(0,0,0,0.85)',
          }}
          onClick={() => {
            if (isChoiceMode) return;
            if (typeof window !== 'undefined' && window.getSelection()?.toString()) return;
            advanceSubChunk();
          }}
        >
          {/* 32px smooth gradient transition band above the frame */}
          <div
            className="absolute -top-[32px] left-0 right-0 h-[32px] pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(11, 10, 13, 0.82) 100%)',
            }}
          />

          {/* Excised Speaker Cartouche embedded into top border (ЧАСТЬ A6: stopPropagation) */}
          {currentSpeaker && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 left-4 sm:left-6 -translate-y-1/2 z-30 h-[28px] max-w-[calc(100%-32px)] sm:max-w-[70%] flex items-center px-[14px] bg-[#0B0A0D] border border-[#8A6B3A]/60 shadow-sm"
              title={currentSpeaker.name}
            >
              <span className="font-heading text-[16px] sm:text-[17px] uppercase tracking-[0.08em] text-[#D8B25E] font-normal select-none truncate leading-none">
                {currentSpeaker.name}
              </span>
              {currentSpeaker.emotion && currentSpeaker.emotion !== 'neutral' && (
                <span
                  className={`w-1.5 h-1.5 rotate-45 ml-2 shrink-0 ${
                    currentSpeaker.emotion === 'angry'
                      ? 'bg-rose-500'
                      : currentSpeaker.emotion === 'anxious'
                      ? 'bg-amber-400'
                      : currentSpeaker.emotion === 'smiling'
                      ? 'bg-emerald-400'
                      : currentSpeaker.emotion === 'pain'
                      ? 'bg-red-600 animate-pulse'
                      : 'bg-[#C9A55C]'
                  }`}
                  title={`Эмоция: ${currentSpeaker.emotion}`}
                />
              )}
            </div>
          )}

          {/* 2. Companion Reaction Chip (embedded on top border) */}
          {companionToast && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 right-4 sm:right-6 -translate-y-1/2 z-30 h-[28px] flex items-center gap-1.5 px-3 bg-[#110E17]/98 border border-[#C9A55C]/70 shadow-[0_4px_16px_rgba(0,0,0,0.85)] animate-fadeIn select-none"
              style={{
                boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 8px 24px rgba(0,0,0,0.85)',
              }}
              title={
                companionToast.text ||
                `${companionToast.name} (${
                  companionToast.delta > 0 ? `+${companionToast.delta}` : companionToast.delta
                })`
              }
            >
              <Heart
                className={`w-3.5 h-3.5 shrink-0 ${
                  companionToast.delta > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-400'
                }`}
              />
              <span className="font-heading text-xs font-semibold text-[#EDE3CB]">
                {companionToast.name}{' '}
                {companionToast.delta > 0 ? `+${companionToast.delta}` : companionToast.delta}
              </span>
              {companionToast.text && (
                <span className="hidden sm:inline font-prose italic text-[11px] text-[#BDA97C] border-l border-[#8A6B3A]/40 pl-2 ml-1 max-w-[240px] truncate">
                  {companionToast.text}
                </span>
              )}
            </div>
          )}

          {/* 4 Patinated Brass Corner Accents */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#8A6B3A] pointer-events-none" />
          <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#8A6B3A] pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#8A6B3A] pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#8A6B3A] pointer-events-none" />

          {/* Inner Content Body */}
          <div className="w-full p-4 sm:p-6 flex-1 flex flex-col justify-between overflow-hidden min-h-0 relative">
            {/*
              MODE A: READING NARRATIVE PAGE
              (When not yet at final choice stage)
            */}
            {!isChoiceMode && (
              <div className="flex-1 flex flex-col justify-between cursor-pointer">
                <div className="max-w-[62ch] mx-auto w-full pt-1 select-text">
                  <div
                    className={`font-prose text-[#EFE6CF] ${
                      fontSize === 'sm'
                        ? 'text-[14px] sm:text-[15px]'
                        : fontSize === 'lg'
                        ? 'text-[18px] sm:text-[20px]'
                        : 'text-[16px] sm:text-[18px]'
                    } leading-[1.65] font-normal tracking-[0.01em]`}
                    style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.85)' }}
                  >
                    <p
                      className={
                        currentPage.isSceneStart && !currentSpeaker
                          ? 'first-letter-dropcap'
                          : ''
                      }
                    >
                      {renderFormattedText(displayedText, codexMatchers, openCodexWithEntry)}
                    </p>

                    {/* Sensory whisper detail if expanded */}
                    {isSensoryOpen && (
                      <div className="mt-3 p-3 bg-[#131018]/90 border-l-2 border-[#768BC7] text-sm text-[#BAAC93] font-prose italic space-y-1.5 animate-fadeIn">
                        {isEnriching ? (
                          <div className="flex items-center gap-2 text-[#768BC7] py-0.5">
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                            <span>Воздух застывает в ожидании отклика...</span>
                          </div>
                        ) : activeSensory?.sensoryDetail ? (
                          <>
                            <p className="text-[#768BC7] flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#768BC7]" />
                              <span>{activeSensory.sensoryDetail}</span>
                            </p>
                            {activeSensory.companionWhisper && (
                              <p className="text-[#EFE6CF] pl-5">
                                «{activeSensory.companionWhisper}» —{' '}
                                <span className="font-heading uppercase not-italic text-[#C9A55C]">
                                  {world.initialCompanion.name}
                                </span>
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-[#BAAC93]">Ощущения текущей локации спокойны.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Footer: Page counter on left, Continue / Choose action ◇ on right */}
                <div className="flex items-center justify-between pt-3 border-t border-[#8A6B3A]/20 select-none">
                  {/* Left: Page count "1 / 3" */}
                  <span className="font-prose text-[13px] font-normal text-[#BDA97C] font-tabular-nums">
                    {clampedIndex + 1} / {expandedPages.length}
                  </span>

                  {/* Right: Continue ◇ or Выбрать действие ◇ on last page (Пункт 2) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      advanceSubChunk();
                    }}
                    className={`font-prose text-[14px] flex items-center gap-1.5 cursor-pointer transition-all ${
                      isLastChunk
                        ? 'text-[#E8CF8A] hover:text-[#FFF1C5] font-medium'
                        : 'text-[#C9A55C] hover:text-[#E8CF8A]'
                    }`}
                  >
                    <span>{isLastChunk ? 'Выбрать действие' : 'Продолжить'}</span>
                    <span
                      className={`text-base text-[#C9A55C] ${
                        isLastChunk ? 'animate-pulse text-[#E8CF8A]' : 'animate-gold-pulse'
                      }`}
                    >
                      ◇
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/*
              MODE B: CHOICES / OUTCOME STATE
              (After last page is read and choicesOpen=true: quote line in two lines with ellipsis + reread button, then choices)
            */}
            {isChoiceMode && (
              <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden relative">
                {/* 7. Top Quote line (two lines with line-clamp-2) + «?» Handbook + ↺ перечитать */}
                <div
                  ref={quoteHeaderRef}
                  className="flex items-start justify-between gap-3 pb-2.5 mb-2 border-b border-[#4A3A22]/60 select-none shrink-0"
                >
                  <p
                    className="font-prose italic text-[13px] sm:text-[14px] leading-snug text-[#A89E88] line-clamp-2 flex-1"
                    title={currentPage.text.replace(/\*\*/g, '').replace(/\*/g, '')}
                  >
                    «{currentPage.text.replace(/\*\*/g, '').replace(/\*/g, '')}»
                  </p>

                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    {/* «?» Badge Handbook Popover Trigger Button (ЧАСТЬ C) */}
                    <button
                      ref={helpBtnRef}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasSeenBadgeHelpPrompt) {
                          setHasSeenBadgeHelpPrompt(true);
                        }
                        setShowBadgeHelp((prev) => !prev);
                      }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors cursor-pointer text-xs font-heading ${
                        showBadgeHelp
                          ? 'bg-[#C9A55C]/25 border-[#E8CF8A] text-[#E8CF8A] shadow-[0_0_8px_rgba(232,207,138,0.4)]'
                          : 'bg-[#15121B] border-[#8A6B3A]/40 text-[#BDA97C] hover:text-[#E8CF8A] hover:border-[#8A6B3A]'
                      }`}
                      title="Справочник значков вариантов выбора"
                      aria-label="Справочник значков вариантов выбора"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>

                    {/* ↺ перечитать */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        reReadScene();
                      }}
                      className="font-prose text-[13px] text-[#BDA97C] hover:text-[#C9A55C] flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors"
                      title="Перечитать текст сцены"
                    >
                      <span>↺ перечитать</span>
                    </button>
                  </div>
                </div>

                {/* One-time subtle hint for skill checks (ЧАСТЬ C) */}
                {showFirstTimeHint && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mb-2 p-2 rounded-xs bg-[#1A140B]/95 border border-[#8A6B3A] text-xs font-prose text-[#EDE3CB] flex items-center justify-between gap-2 shadow-md animate-fadeIn"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#E8CF8A] shrink-0" />
                      <span>Значки у вариантов можно расшифровать по кнопке <strong>?</strong> вверху</span>
                    </div>
                    <button
                      type="button"
                      onClick={dismissFirstTimeHint}
                      className="p-1 text-[#8A7E6C] hover:text-[#EDE3CB] cursor-pointer"
                      aria-label="Понятно"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Popover Guide over choices (ЧАСТЬ C: компактная всплывающая панель в две колонки) */}
                {showBadgeHelp && (
                  <div
                    ref={badgePopoverRef}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-10 left-0 right-0 z-40 p-3 sm:p-4 rounded-sm bg-[#100D15]/98 border border-[#8A6B3A] shadow-2xl backdrop-blur-md max-h-[380px] overflow-y-auto animate-fadeIn select-none"
                    style={{
                      boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 16px 40px rgba(0,0,0,0.95)',
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3A2E1D]">
                      <div className="flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider text-[#E8CF8A]">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Справочник значков вариантов</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowBadgeHelp(false)}
                        className="p-1 text-[#8A6B3A] hover:text-[#EDE3CB] cursor-pointer"
                        aria-label="Закрыть справку"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ChoiceBadgeGuideList />
                  </div>
                )}

                {/* Regular Choices */}
                {!currentScene?.isEnding && visibleChoices.length > 0 && (
                  <div
                    ref={choicesListRef}
                    className={`w-full py-1 flex-1 min-h-0 overflow-y-auto overflow-x-hidden brass-scrollbar pr-1 ${
                      useTwoColumns
                        ? 'grid grid-cols-2 gap-x-4 max-w-none'
                        : 'flex flex-col max-w-[62ch] mx-auto'
                    } ${compactText ? 'gap-1' : 'gap-1.5'}`}
                  >
                    {visibleChoices.map((choice, index) => {
                      const availability = canMakeChoice(choice, state, world);
                      const isAllowed = availability.allowed;
                      const numeral = ROMAN_NUMERALS[index] || `${index + 1}`;
                      const tooltip = getApproachTooltipRu(choice);

                      return (
                        <div
                          key={choice.id}
                          className={`relative border-b border-[#4A3A22]/60 last:border-b-0 transition-all duration-300 ${
                            compactText ? 'py-1' : 'py-1.5'
                          } ${choice.hideIfLocked ? 'animate-fadeIn text-[#B794F6]' : ''}`}
                        >
                          <button
                            type="button"
                            disabled={!isAllowed}
                            tabIndex={isAllowed ? 0 : -1}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAllowed) {
                                makeChoice(choice);
                              }
                            }}
                            onFocus={(e) => {
                              e.currentTarget.scrollIntoView({
                                block: 'nearest',
                                behavior: 'smooth',
                              });
                            }}
                            className={`group relative w-full text-left py-1 px-1.5 flex items-start gap-2.5 transition-all duration-200 select-none outline-none focus-visible:ring-1 focus-visible:ring-[#C9A55C] focus-visible:bg-[#C9A55C]/10 ${
                              isAllowed
                                ? 'hover:text-[#FFFFFF] cursor-pointer'
                                : 'text-[#6E6657] cursor-not-allowed opacity-60'
                            }`}
                          >
                            {/* Hover underline that extends from center */}
                            {isAllowed && (
                              <span className="absolute inset-x-0 bottom-0 h-[1px] bg-[#C9A55C] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                            )}

                            {/* Roman Numeral & Diamond Marker */}
                            <div className="flex items-center gap-1 pt-0.5 shrink-0 select-none">
                              <span className="font-heading text-[14px] text-[#C9A55C]/90 w-5 text-right font-normal">
                                {numeral}.
                              </span>
                              <span
                                className={`text-[10px] transition-colors ${
                                  isAllowed
                                    ? 'text-[#C9A55C] group-hover:text-[#E8CF8A] group-hover:fill-current'
                                    : 'text-[#6E6657]'
                                }`}
                              >
                                {isAllowed ? '◆' : '◇'}
                              </span>
                            </div>

                            {/* Choice Text & Reason */}
                            <div className="flex-1 min-w-0 pr-1">
                              <p
                                className={`font-prose leading-snug transition-colors ${
                                  compactText ? 'text-[15px]' : 'text-[16px]'
                                } ${
                                  isAllowed
                                    ? 'text-[#EFE6CF] group-hover:text-white'
                                    : 'text-[#6E6657]'
                                }`}
                              >
                                {choice.text}
                              </p>

                              {/* Locked Reason */}
                              {!isAllowed && availability.reason && (
                                <p className="font-prose italic text-[11px] sm:text-[12px] text-[#8E2A2A] mt-0.5">
                                  {availability.reason.replace(/^(Требуется:\s*)+/i, 'Требуется: ')}
                                </p>
                              )}
                            </div>

                            {/* Right Glyphs & Tooltip (ЧАСТЬ B: метки цены + единый значок справа) */}
                            <div
                              className="shrink-0 pt-0.5 flex items-center gap-2"
                              title={tooltip}
                              aria-label={tooltip}
                            >
                              {/* Price tags for negative health / sanity */}
                              {renderChoiceCosts(choice)}

                              {/* Right Badge: Lock for restricted, or specific approach / skill check badge */}
                              {!isAllowed && !choice.condition?.hasItem ? (
                                <Lock className="w-3.5 h-3.5 text-[#6E6657]" />
                              ) : (
                                renderChoiceGlyph(choice)
                              )}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Ending screen options */}
                {currentScene?.isEnding && (
                  <div className="py-2 text-center animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1622] border border-[#8A6B3A] text-sm font-heading font-normal text-[#C9A55C] mb-3">
                      {currentScene.endingType === 'victory' && (
                        <Trophy className="w-4 h-4 text-[#C9A55C]" />
                      )}
                      {currentScene.endingType === 'destruction' && (
                        <Award className="w-4 h-4 text-[#C23B3B]" />
                      )}
                      {currentScene.endingType === 'sacrifice' && (
                        <Sparkles className="w-4 h-4 text-[#768BC7]" />
                      )}
                      {(currentScene.endingType === 'defeat_health' ||
                        currentScene.endingType === 'defeat_sanity') && (
                        <Skull className="w-4 h-4 text-[#C23B3B]" />
                      )}
                      <span>{currentScene.endingTitle || 'Летопись завершена'}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNGPlus(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1622] border border-[#768BC7] hover:bg-[#3A4C7A]/30 text-[#768BC7] font-heading text-sm uppercase tracking-wider transition min-h-[44px] cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#C9A55C]" />
                        Новая игра+ (наследие)
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          restartWorld();
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1622] border border-[#8A6B3A] hover:bg-[#C9A55C]/15 text-[#EFE6CF] hover:text-[#C9A55C] font-heading text-sm uppercase tracking-wider transition min-h-[44px] cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-[#C9A55C]" />
                        Начать заново
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowWorldSelect(true);
                        }}
                        className="px-3.5 py-2 bg-[#0D0B0E] border border-[#3A2E1D] hover:border-[#8A6B3A] text-[#BAAC93] hover:text-[#EFE6CF] font-heading text-sm uppercase tracking-wider transition min-h-[44px] cursor-pointer"
                      >
                        Выбрать другой мир
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Game Plus modal */}
      {showNGPlus && (
        <NewGamePlusModal
          world={world}
          inventory={state.inventory}
          onSelectRelic={(relicId: string) => {
            startNewGamePlus(relicId);
            setShowNGPlus(false);
          }}
          onClose={() => setShowNGPlus(false)}
        />
      )}
    </div>
  );
};
