import React from 'react';
import {
  Dices,
  Sword,
  MessageSquare,
  VenetianMask,
  Sparkles,
  Search,
  Gem,
  Droplet,
  Hand,
  Eye,
  Backpack,
} from 'lucide-react';

export interface BadgeGuideItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  category: 'checks' | 'approaches' | 'costs';
}

export const BADGE_GUIDE_ITEMS: BadgeGuideItem[] = [
  // 1. Проверки характеристик (d20 бросок)
  {
    id: 'chk-strength',
    icon: (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-[#E58282] bg-[#E58282]/15 text-[#E58282] text-[10px] font-mono font-bold">
        <Dices className="w-3 h-3 text-[#E58282]" />
        <span>СИЛ</span>
      </div>
    ),
    title: 'Проверка Силы (СИЛ)',
    desc: 'Физическая мощь, преодоление преград, выносливость и напор.',
    category: 'checks',
  },
  {
    id: 'chk-intellect',
    icon: (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-[#8BA4F9] bg-[#8BA4F9]/15 text-[#8BA4F9] text-[10px] font-mono font-bold">
        <Dices className="w-3 h-3 text-[#8BA4F9]" />
        <span>РАЗ</span>
      </div>
    ),
    title: 'Проверка Разума (РАЗ)',
    desc: 'Интеллект, дедукция, магические знания и эрудиция.',
    category: 'checks',
  },
  {
    id: 'chk-perception',
    icon: (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-[#6EE7B7] bg-[#6EE7B7]/15 text-[#6EE7B7] text-[10px] font-mono font-bold">
        <Dices className="w-3 h-3 text-[#6EE7B7]" />
        <span>ВНИ</span>
      </div>
    ),
    title: 'Проверка Внимания (ВНИ)',
    desc: 'Восприятие, чутьё, поиск тайников и скрытых угроз.',
    category: 'checks',
  },
  {
    id: 'chk-charisma',
    icon: (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-[#FDE047] bg-[#FDE047]/15 text-[#FDE047] text-[10px] font-mono font-bold">
        <Dices className="w-3 h-3 text-[#FDE047]" />
        <span>ХАР</span>
      </div>
    ),
    title: 'Проверка Харизмы (ХАР)',
    desc: 'Убеждение, психологическое влияние, лидерство и обаяние.',
    category: 'checks',
  },

  // 2. Подходы без броска
  {
    id: 'app-audacious',
    icon: <Sword className="w-3.5 h-3.5 text-[#F87171]" />,
    title: 'Дерзкий подход',
    desc: 'Решительное и рискованное действие без колебаний.',
    category: 'approaches',
  },
  {
    id: 'app-diplomatic',
    icon: <MessageSquare className="w-3.5 h-3.5 text-[#60A5FA]" />,
    title: 'Дипломатия',
    desc: 'Переговоры, такт, поиск компромисса и диалог.',
    category: 'approaches',
  },
  {
    id: 'app-shadow',
    icon: <VenetianMask className="w-3.5 h-3.5 text-[#9CA3AF]" />,
    title: 'Скрытность',
    desc: 'Манёвр в тенях, осторожный обход и маскировка.',
    category: 'approaches',
  },
  {
    id: 'app-arcane',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#B794F6]" />,
    title: 'Мистика',
    desc: 'Обращение к тайным эфирным силам и древней магии.',
    category: 'approaches',
  },
  {
    id: 'app-investigative',
    icon: <Search className="w-3.5 h-3.5 text-[#38BDF8]" />,
    title: 'Расследование',
    desc: 'Внимательный анализ улик, фактов и обстановки.',
    category: 'approaches',
  },
  {
    id: 'app-relic',
    icon: <Gem className="w-3.5 h-3.5 text-[#F59E0B]" />,
    title: 'Реликвия',
    desc: 'Использование мощи уникального артефакта.',
    category: 'approaches',
  },
  {
    id: 'app-sacrifice',
    icon: <Droplet className="w-3.5 h-3.5 text-[#F87171]" />,
    title: 'Жертва',
    desc: 'Добровольная потеря здоровья ради спасения или успеха.',
    category: 'approaches',
  },
  {
    id: 'app-surrender',
    icon: <Hand className="w-3.5 h-3.5 text-[#D1D5DB]" />,
    title: 'Смирение',
    desc: 'Уступка обстоятельствам или принятие воли судьбы.',
    category: 'approaches',
  },

  // 3. Предметы и цена выбора
  {
    id: 'cost-item',
    icon: <Backpack className="w-3.5 h-3.5 text-[#C9A55C]" />,
    title: 'Требование предмета',
    desc: 'Показывает миниатюру нужного предмета («есть» / «нужен …»).',
    category: 'costs',
  },
  {
    id: 'cost-delta',
    icon: (
      <div className="flex items-center gap-1 text-[10px] font-mono">
        <span className="text-[#F87171] flex items-center">
          <Droplet className="w-2.5 h-2.5 mr-0.5" />−ОЗ
        </span>
        <span className="text-[#818CF8] flex items-center">
          <Eye className="w-2.5 h-2.5 mr-0.5" />−РАС
        </span>
      </div>
    ),
    title: 'Цена выбора',
    desc: 'Метки потери здоровья («−10») или рассудка («−5») от действия.',
    category: 'costs',
  },
];

interface ChoiceBadgeGuideListProps {
  className?: string;
}

export const ChoiceBadgeGuideList: React.FC<ChoiceBadgeGuideListProps> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-left ${className}`}>
      {BADGE_GUIDE_ITEMS.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-2.5 p-2 rounded-sm bg-[#0E0C12]/90 border border-[#3A2E1D]/60 hover:border-[#8A6B3A]/60 transition-colors"
        >
          <div className="shrink-0 pt-0.5 flex items-center justify-center min-w-[24px]">
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-heading text-xs text-[#EDE3CB] font-semibold leading-tight">
              {item.title}
            </h5>
            <p className="font-prose text-[11px] text-[#BAAC93] leading-snug mt-0.5">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
