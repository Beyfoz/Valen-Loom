import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dices, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { SkillCheck, HeroAttributes } from '../types';
import { ATTRIBUTE_NAMES } from './tags';
import { SoundManager } from './SoundManager';

interface DiceRollModalProps {
  check: SkillCheck;
  attributes: HeroAttributes;
  onComplete: (success: boolean) => void;
}

export const DiceRollModal: React.FC<DiceRollModalProps> = ({ check, attributes, onComplete }) => {
  const [rolling, setRolling] = useState(true);
  const [diceValue, setDiceValue] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const attributeMod = attributes[check.attribute] || 10;
  // Modifier formula: standard D&D style (attr - 10) / 2 rounded
  const modifier = Math.floor((attributeMod - 10) / 2);

  const resolveRoll = useCallback((forcedValue?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const finalRoll = forcedValue ?? (Math.floor(Math.random() * 20) + 1);
    setDiceValue(finalRoll);
    setRolling(false);
    setCompleted(true);

    const totalScore = finalRoll + modifier;
    const success = totalScore >= check.dc;
    if (success) {
      SoundManager.playDiceSuccess();
    } else {
      SoundManager.playDamage();
    }
  }, [check.dc, modifier]);

  useEffect(() => {
    SoundManager.playDiceRoll();
    let count = 0;
    timerRef.current = setInterval(() => {
      count++;
      setDiceValue(Math.floor(Math.random() * 20) + 1);
      if (count > 14) {
        resolveRoll();
      }
    }, 65);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resolveRoll]);

  const total = diceValue + modifier;
  const isSuccess = total >= check.dc;

  const handleConfirm = useCallback(() => {
    if (isFinishing) return;
    setIsFinishing(true);
    SoundManager.playClick();
    onComplete(isSuccess);
  }, [isFinishing, isSuccess, onComplete]);

  // Space and Enter keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (rolling) {
          resolveRoll();
        } else if (completed && !isFinishing) {
          handleConfirm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rolling, completed, isFinishing, resolveRoll, handleConfirm]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={() => {
        if (rolling) {
          resolveRoll();
        }
      }}
    >
      {/* Obsidian & Patinated Brass Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-[#121016]/95 border border-[#8A6B3A]/60 p-6 sm:p-7 shadow-2xl text-center space-y-4 select-none"
        style={{
          boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 24px 60px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* 4 Patinated Brass Corner Brackets */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#8A6B3A] pointer-events-none" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#8A6B3A] pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#8A6B3A] pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#8A6B3A] pointer-events-none" />

        {/* Attribute Tag Header */}
        <div className="flex items-center justify-center gap-2 text-xs font-heading uppercase tracking-[0.2em] text-[#C9A55C]">
          <Dices className="w-4 h-4 text-[#C9A55C]" />
          <span>Проверка характеристики: {ATTRIBUTE_NAMES[check.attribute]?.ru || check.attribute}</span>
        </div>

        {/* Check Label / DC */}
        <h3 className="text-lg sm:text-xl font-heading text-[#EFE6CF] tracking-wide leading-snug">
          {check.label || `Сложность проверки: КС ${check.dc}`}
        </h3>

        {/* Dice Visual */}
        <div className="py-2 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (rolling) resolveRoll();
            }}
            disabled={!rolling}
            title={rolling ? 'Нажмите, чтобы ускорить бросок' : undefined}
            className={`w-24 h-24 flex items-center justify-center text-4xl font-heading border transition-all duration-300 ${
              rolling
                ? 'border-[#8A6B3A] bg-[#1A1622] text-[#C9A55C] animate-pulse cursor-pointer hover:border-[#C9A55C]'
                : isSuccess
                ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.3)] scale-105'
                : 'border-rose-500/80 bg-rose-950/30 text-rose-300 shadow-[0_0_24px_rgba(244,63,94,0.3)] scale-105'
            }`}
            style={{
              boxShadow: rolling
                ? 'inset 0 0 16px rgba(138, 107, 58, 0.2)'
                : undefined,
            }}
          >
            <span className="font-tabular-nums">{diceValue}</span>
          </button>
        </div>

        {/* Breakdown Panel */}
        <div className="p-3 bg-[#0D0B0E]/90 border border-[#3A2E1D] text-xs font-prose text-[#BAAC93] flex items-center justify-around">
          <div>
            <span className="text-[#7D7362] block text-[10px] font-heading uppercase tracking-wider">Бросок (d20)</span>
            <span className="font-tabular-nums font-medium text-[#EFE6CF] text-sm">{diceValue}</span>
          </div>
          <span className="text-[#7D7362] font-heading text-sm">+</span>
          <div>
            <span className="text-[#7D7362] block text-[10px] font-heading uppercase tracking-wider">Модификатор</span>
            <span className="font-tabular-nums font-medium text-[#C9A55C] text-sm">
              {modifier >= 0 ? `+${modifier}` : modifier}
            </span>
          </div>
          <span className="text-[#7D7362] font-heading text-sm">=</span>
          <div>
            <span className="text-[#7D7362] block text-[10px] font-heading uppercase tracking-wider">Итог / КС</span>
            <span className={`font-tabular-nums font-medium text-sm ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
              {total} / {check.dc}
            </span>
          </div>
        </div>

        {/* Result Outcome Message */}
        {completed && (
          <div
            className={`p-3 border text-xs text-left animate-fadeIn font-prose ${
              isSuccess
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-heading text-sm mb-1">
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="tracking-wide">Успех проверки!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="tracking-wide">Провал (Провал вперёд — сюжет продолжается)</span>
                </>
              )}
            </div>
            <p className="text-[12px] leading-relaxed opacity-90 text-[#EDE3CB]">
              {isSuccess
                ? check.passMessage || 'Ваши навыки позволяют преодолеть испытание с триумфом.'
                : check.failMessage || 'Неудача меняет обстоятельства, требуя платы ресурсами или жертвой.'}
            </p>
          </div>
        )}

        {/* Obsidian & Brass Continue Button */}
        {completed && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isFinishing}
            className="w-full py-2.5 px-4 min-h-[44px] bg-[#1E1912] hover:bg-[#2F2618] active:bg-[#1E1912] border border-[#8A6B3A] hover:border-[#C9A55C] text-[#EDE3CB] hover:text-white font-heading text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition duration-150 cursor-pointer shadow-lg active:translate-y-px"
          >
            <span>Продолжить</span>
            <ArrowRight className="w-4 h-4 text-[#C9A55C]" />
          </button>
        )}
      </div>
    </div>
  );
};
