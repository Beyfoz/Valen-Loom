import { ChoiceTag, HeroAttribute } from '../types';

export interface TagStyle {
  labelRu: string;
  labelEn: string;
  bg: string;
  text: string;
  border: string;
}

export const TAG_STYLES: Record<ChoiceTag, TagStyle> = {
  AUDACIOUS: {
    labelRu: 'ДЕРЗКИЙ',
    labelEn: 'AUDACIOUS',
    bg: 'rgba(239, 68, 68, 0.25)',
    text: '#F87171',
    border: 'rgba(239, 68, 68, 0.6)',
  },
  CAUTIOUS: {
    labelRu: 'ОСТОРОЖНЫЙ',
    labelEn: 'CAUTIOUS',
    bg: 'rgba(59, 130, 246, 0.25)',
    text: '#60A5FA',
    border: 'rgba(59, 130, 246, 0.6)',
  },
  RECON: {
    labelRu: 'РАЗВЕДКА',
    labelEn: 'RECON',
    bg: 'rgba(16, 185, 129, 0.25)',
    text: '#34D399',
    border: 'rgba(16, 185, 129, 0.6)',
  },
  RELIC: {
    labelRu: 'РЕЛИКВИЯ',
    labelEn: 'RELIC',
    bg: 'rgba(168, 85, 247, 0.25)',
    text: '#C084FC',
    border: 'rgba(168, 85, 247, 0.6)',
  },
  SACRIFICE: {
    labelRu: 'ЖЕРТВА',
    labelEn: 'SACRIFICE',
    bg: 'rgba(245, 158, 11, 0.25)',
    text: '#FBBF24',
    border: 'rgba(245, 158, 11, 0.6)',
  },
  DIALOGUE: {
    labelRu: 'ДИАЛОГ',
    labelEn: 'DIALOGUE',
    bg: 'rgba(14, 165, 233, 0.25)',
    text: '#38BDF8',
    border: 'rgba(14, 165, 233, 0.6)',
  },
  ENDING: {
    labelRu: 'ФИНАЛ',
    labelEn: 'ENDING',
    bg: 'rgba(234, 179, 8, 0.3)',
    text: '#FDE047',
    border: 'rgba(234, 179, 8, 0.8)',
  },
};

export const ATTRIBUTE_NAMES: Record<HeroAttribute, { ru: string; en: string }> = {
  strength: { ru: 'Сила', en: 'Strength' },
  intellect: { ru: 'Разум', en: 'Intellect' },
  perception: { ru: 'Внимание', en: 'Perception' },
  charisma: { ru: 'Харизма', en: 'Charisma' },
};
