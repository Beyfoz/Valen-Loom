/**
 * Visual Artifacts & Relic Grimoire Art Generator for Vaelen Loom
 * Provides high-fidelity dark-fantasy SVG vector illustrations for every item and relic.
 */
import { Item, ItemRarity } from '../types';

function createSvgDataUri(svg: string): string {
  const clean = svg.replace(/\s+/g, ' ').trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(clean)}`;
}

// 1. Lantern of the Ebbing Tide (Погасший приливный фонарь)
const SVG_LANTERN = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#182A45" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#0E131E" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#06070B" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="cyanCore" cx="50%" cy="55%" r="35%">
      <stop offset="0%" stop-color="#E0F7FA"/>
      <stop offset="35%" stop-color="#38BDF8"/>
      <stop offset="70%" stop-color="#0284C7" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0369A1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="40%" stop-color="#D97706"/>
      <stop offset="70%" stop-color="#92400E"/>
      <stop offset="100%" stop-color="#451A03"/>
    </linearGradient>
    <filter id="flameBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="256" height="256" fill="url(#bgGlow)"/>
  <!-- Ambient mystical mist -->
  <circle cx="128" cy="140" r="85" fill="url(#cyanCore)"/>
  <!-- Hanging Loop -->
  <ellipse cx="128" cy="38" rx="22" ry="14" fill="none" stroke="url(#brassGrad)" stroke-width="5"/>
  <rect x="123" y="48" width="10" height="12" fill="url(#brassGrad)" rx="2"/>
  <!-- Roof / Dome -->
  <path d="M 88 78 Q 128 56 168 78 L 176 92 L 80 92 Z" fill="url(#brassGrad)"/>
  <!-- Filigree Spire -->
  <path d="M 128 54 L 132 64 L 124 64 Z" fill="#FDE68A"/>
  <!-- Glass Enclosure -->
  <rect x="88" y="92" width="80" height="88" rx="4" fill="#0A1828" opacity="0.6" stroke="#38BDF8" stroke-width="1.5"/>
  <!-- Inner Tidal Flame -->
  <g filter="url(#flameBlur)">
    <path d="M 128 165 C 108 155 106 130 120 115 C 124 125 130 110 134 100 C 146 122 152 145 138 162 Z" fill="#38BDF8"/>
    <path d="M 128 160 C 118 152 116 138 126 128 C 128 135 132 125 135 118 C 142 132 144 148 134 158 Z" fill="#E0F2FE"/>
    <ellipse cx="128" cy="142" rx="6" ry="10" fill="#FFFFFF"/>
  </g>
  <!-- Ribs / Brass Grate -->
  <line x1="90" y1="92" x2="90" y2="180" stroke="url(#brassGrad)" stroke-width="4"/>
  <line x1="166" y1="92" x2="166" y2="180" stroke="url(#brassGrad)" stroke-width="4"/>
  <line x1="114" y1="92" x2="114" y2="180" stroke="url(#brassGrad)" stroke-width="2.5" opacity="0.9"/>
  <line x1="142" y1="92" x2="142" y2="180" stroke="url(#brassGrad)" stroke-width="2.5" opacity="0.9"/>
  <!-- Base Chamber -->
  <path d="M 76 180 L 180 180 L 172 206 L 84 206 Z" fill="url(#brassGrad)"/>
  <rect x="80" y="206" width="96" height="8" rx="2" fill="#78350F"/>
  <!-- Tidal Runes on Base -->
  <circle cx="128" cy="193" r="5" fill="#38BDF8"/>
  <path d="M 112 193 Q 120 188 128 193 Q 136 198 144 193" fill="none" stroke="#FDE68A" stroke-width="1.5"/>
</svg>
`);

// 2. Obsidian Tuning Fork (Обсидиановый камертон)
const SVG_TUNING_FORK = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgFork" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1A192E"/>
      <stop offset="60%" stop-color="#0F0D1B"/>
      <stop offset="100%" stop-color="#050409"/>
    </radialGradient>
    <linearGradient id="obsidianGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4B5563"/>
      <stop offset="35%" stop-color="#1F2937"/>
      <stop offset="70%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <filter id="resonanceGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="resBlur"/>
      <feMerge>
        <feMergeNode in="resBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="256" height="256" fill="url(#bgFork)"/>
  <!-- Resonance Acoustic Waves -->
  <circle cx="128" cy="100" r="75" fill="none" stroke="#818CF8" stroke-width="1" stroke-dasharray="4 6" opacity="0.35"/>
  <circle cx="128" cy="100" r="55" fill="none" stroke="#A78BFA" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.5"/>
  <circle cx="128" cy="100" r="35" fill="none" stroke="#C084FC" stroke-width="1" opacity="0.6"/>
  <!-- Tuning Fork Body -->
  <!-- Left Prong -->
  <path d="M 104 36 L 114 36 L 114 120 L 104 120 Z" fill="url(#obsidianGlass)" stroke="#A78BFA" stroke-width="1"/>
  <!-- Left Tip Facet -->
  <path d="M 104 36 L 109 28 L 114 36 Z" fill="#9CA3AF"/>
  <!-- Right Prong -->
  <path d="M 142 36 L 152 36 L 152 120 L 142 120 Z" fill="url(#obsidianGlass)" stroke="#A78BFA" stroke-width="1"/>
  <path d="M 142 36 L 147 28 L 152 36 Z" fill="#9CA3AF"/>
  <!-- Fork U-Curve Join -->
  <path d="M 104 120 C 104 150 152 150 152 120 L 142 120 C 142 138 114 138 114 120 Z" fill="url(#obsidianGlass)" stroke="#A78BFA" stroke-width="1"/>
  <!-- Stem -->
  <rect x="123" y="142" width="10" height="60" fill="url(#obsidianGlass)" stroke="#818CF8" stroke-width="1"/>
  <!-- Pommel Sphere -->
  <circle cx="128" cy="210" r="14" fill="#111827" stroke="#D8B25E" stroke-width="2"/>
  <circle cx="128" cy="210" r="7" fill="#818CF8" filter="url(#resonanceGlow)"/>
  <!-- Edge Highlights -->
  <line x1="106" y1="38" x2="106" y2="120" stroke="#E0E7FF" stroke-width="1.5" opacity="0.8"/>
  <line x1="144" y1="38" x2="144" y2="120" stroke="#E0E7FF" stroke-width="1" opacity="0.6"/>
</svg>
`);

// 3. Moon Salt Distillate Vial (Флакон дистиллята лунной соли)
const SVG_SALT_DISTILLATE = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgVial" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#132E27"/>
      <stop offset="60%" stop-color="#0A1815"/>
      <stop offset="100%" stop-color="#040A08"/>
    </radialGradient>
    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="60%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>
    <filter id="saltGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="256" height="256" fill="url(#bgVial)"/>
  <!-- Ambient green aura -->
  <circle cx="128" cy="150" r="65" fill="#10B981" opacity="0.2" filter="url(#saltGlow)"/>
  <!-- Flask Neck & Stopper -->
  <rect x="118" y="44" width="20" height="22" fill="#78350F" stroke="#D97706" stroke-width="1" rx="2"/>
  <ellipse cx="128" cy="44" rx="12" ry="4" fill="#92400E"/>
  <rect x="114" y="66" width="28" height="6" fill="#D97706" rx="2"/>
  <rect x="118" y="72" width="20" height="24" fill="#1E293B" opacity="0.6" stroke="#6EE7B7" stroke-width="1.5"/>
  <!-- Flask Body (Potion teardrop / round bulb) -->
  <path d="M 118 94 C 84 104 68 142 74 180 C 80 216 112 226 128 226 C 144 226 176 216 182 180 C 188 142 172 104 138 94 Z"
        fill="#06241D" stroke="#6EE7B7" stroke-width="2"/>
  <!-- Liquid in Flask -->
  <path d="M 82 170 C 86 195 106 218 128 218 C 150 218 170 195 174 170 C 160 166 148 172 128 168 C 108 164 96 172 82 170 Z"
        fill="url(#liquidGrad)"/>
  <!-- Luminescent Moon Salt Crystals floating -->
  <polygon points="128,180 134,188 128,196 122,188" fill="#F0FDF4" filter="url(#saltGlow)"/>
  <polygon points="106,192 110,197 106,202 102,197" fill="#A7F3D0"/>
  <polygon points="150,188 153,193 150,198 147,193" fill="#A7F3D0"/>
  <!-- Glass Reflection Sheen -->
  <path d="M 90 130 C 82 150 84 176 90 190" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>
`);

// 4. Causeway Seal (Печать Волнолома Велена)
const SVG_CAUSEWAY_SEAL = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgSeal" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#241B10"/>
      <stop offset="70%" stop-color="#120D08"/>
      <stop offset="100%" stop-color="#050302"/>
    </radialGradient>
    <linearGradient id="bronzeMedal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="30%" stop-color="#D97706"/>
      <stop offset="70%" stop-color="#78350F"/>
      <stop offset="100%" stop-color="#451A03"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgSeal)"/>
  <!-- Outer Bronze Medallion Octagon -->
  <polygon points="128,26 198,54 226,128 198,202 128,230 58,202 30,128 58,54"
           fill="url(#bronzeMedal)" stroke="#F59E0B" stroke-width="2"/>
  <circle cx="128" cy="128" r="82" fill="#1C140D" stroke="#92400E" stroke-width="4"/>
  <circle cx="128" cy="128" r="72" fill="#241A11" stroke="#D97706" stroke-width="1.5"/>
  <!-- Tidal Wave Crest Motif in Relief -->
  <path d="M 76 140 Q 100 100 128 128 Q 156 156 180 120 Q 164 160 128 155 Q 92 150 76 140 Z" fill="#FDE68A"/>
  <!-- Sluice Gate Key Notch -->
  <rect x="120" y="60" width="16" height="26" fill="#0C0805" stroke="#FDE68A" stroke-width="1"/>
  <!-- 3 Crown Pearls -->
  <circle cx="106" cy="95" r="5" fill="#38BDF8"/>
  <circle cx="128" cy="90" r="6" fill="#38BDF8"/>
  <circle cx="150" cy="95" r="5" fill="#38BDF8"/>
  <!-- Engraved Ancient Runic Arc -->
  <circle cx="128" cy="128" r="62" fill="none" stroke="#F59E0B" stroke-width="1" stroke-dasharray="8 6"/>
</svg>
`);

// 5. Consecrated Salt Bandages (Освящённые соляные бинты)
const SVG_SALT_BANDAGE = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgBandage" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1F1D1B"/>
      <stop offset="100%" stop-color="#080706"/>
    </radialGradient>
    <linearGradient id="linenCloth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5F5F4"/>
      <stop offset="50%" stop-color="#D6D3D1"/>
      <stop offset="100%" stop-color="#A8A29E"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgBandage)"/>
  <!-- Rolled Bandage -->
  <ellipse cx="128" cy="130" rx="55" ry="32" fill="url(#linenCloth)" stroke="#78716C" stroke-width="2"/>
  <ellipse cx="128" cy="120" rx="46" ry="24" fill="#E7E5E4" stroke="#A8A29E" stroke-width="1.5"/>
  <ellipse cx="128" cy="112" rx="34" ry="16" fill="#D6D3D1"/>
  <!-- Unraveling Strip -->
  <path d="M 160 145 C 190 160 200 195 180 215 C 160 225 130 205 110 200"
        fill="none" stroke="url(#linenCloth)" stroke-width="14" stroke-linecap="round"/>
  <!-- Silver Embroidered Ward Runes -->
  <path d="M 115 112 L 141 112 M 128 102 L 128 122" stroke="#38BDF8" stroke-width="2"/>
  <circle cx="160" cy="190" r="3" fill="#38BDF8"/>
  <circle cx="180" cy="180" r="2.5" fill="#38BDF8"/>
  <!-- Salt crystals gleaming -->
  <polygon points="128,80 132,86 128,92 124,86" fill="#FFFFFF"/>
  <polygon points="90,140 93,144 90,148 87,144" fill="#E0F2FE"/>
</svg>
`);

// 6. Ocean Talisman (Оберег Океанической Брони)
const SVG_OCEAN_TALISMAN = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgTalisman" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#142C38"/>
      <stop offset="100%" stop-color="#04090C"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgTalisman)"/>
  <!-- Nautilus Shell spiral -->
  <path d="M 128 40 C 180 40 215 80 215 130 C 215 180 170 215 120 215 C 75 215 45 180 45 140 C 45 105 70 80 100 80 C 125 80 145 98 145 120 C 145 140 130 155 115 155 C 102 155 95 145 95 135"
        fill="none" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
  <!-- Mother-of-pearl ribs -->
  <line x1="128" y1="40" x2="128" y2="120" stroke="#FDE68A" stroke-width="2" opacity="0.8"/>
  <line x1="175" y1="65" x2="135" y2="125" stroke="#FDE68A" stroke-width="2" opacity="0.8"/>
  <line x1="205" y1="120" x2="140" y2="130" stroke="#FDE68A" stroke-width="2" opacity="0.8"/>
  <line x1="180" y1="175" x2="135" y2="140" stroke="#FDE68A" stroke-width="2" opacity="0.8"/>
  <!-- Core Sapphire Jewel -->
  <circle cx="115" cy="135" r="12" fill="#0284C7" stroke="#E0F2FE" stroke-width="2"/>
  <circle cx="115" cy="135" r="5" fill="#FFFFFF"/>
</svg>
`);

// 7. Lunar Flambeau (Кадило Лунного Флогистона)
const SVG_FLAMBEAU = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgFlambeau" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2D123D"/>
      <stop offset="100%" stop-color="#09030E"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgFlambeau)"/>
  <!-- Triple Suspension Chains -->
  <line x1="85" y1="20" x2="105" y2="110" stroke="#C084FC" stroke-width="2" stroke-dasharray="3 3"/>
  <line x1="128" y1="15" x2="128" y2="110" stroke="#C084FC" stroke-width="2" stroke-dasharray="3 3"/>
  <line x1="171" y1="20" x2="151" y2="110" stroke="#C084FC" stroke-width="2" stroke-dasharray="3 3"/>
  <!-- Censer Bowl -->
  <path d="M 96 120 Q 128 85 160 120 L 168 155 Q 128 190 88 155 Z" fill="#4A1D96" stroke="#C084FC" stroke-width="2"/>
  <!-- Incense Smoke Clouds -->
  <path d="M 120 95 C 100 80 110 50 128 40 C 145 30 155 60 140 75" fill="none" stroke="#E9D5FF" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <!-- Glowing Embers inside reticulated holes -->
  <circle cx="115" cy="138" r="4" fill="#F472B6"/>
  <circle cx="128" cy="145" r="5" fill="#F43F5E"/>
  <circle cx="141" cy="138" r="4" fill="#F472B6"/>
</svg>
`);

// 8. Chaplain's Ring (Кольцо Капеллана Прилива)
const SVG_CHAPLAIN_RING = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgRing" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgRing)"/>
  <!-- Ring Hoop -->
  <ellipse cx="128" cy="155" rx="60" ry="32" fill="none" stroke="#F59E0B" stroke-width="12"/>
  <ellipse cx="128" cy="155" rx="50" ry="24" fill="#0B0F19"/>
  <!-- Gem Bezel Mount -->
  <polygon points="104,90 152,90 162,118 94,118" fill="#D97706" stroke="#FDE68A" stroke-width="2"/>
  <!-- Aquamarine Faceted Stone -->
  <polygon points="112,65 144,65 156,92 100,92" fill="#38BDF8" stroke="#E0F2FE" stroke-width="1.5"/>
  <polygon points="118,72 138,72 144,85 112,85" fill="#7DD3FC"/>
</svg>
`);

// 9. Black Coral Needle Stiletto (Стилет из Чёрного Коралла)
const SVG_CORAL_NEEDLE = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgDagger" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1C1917"/>
      <stop offset="100%" stop-color="#0C0A09"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgDagger)"/>
  <!-- Stiletto Blade (Diagonal) -->
  <path d="M 195 45 L 205 55 L 115 165 L 105 155 Z" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
  <line x1="200" y1="50" x2="110" y2="160" stroke="#67E8F9" stroke-width="2"/>
  <!-- Coral Barbs / Thorns -->
  <polygon points="170,80 185,75 168,90" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
  <polygon points="140,110 155,105 138,120" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
  <!-- Crossguard -->
  <line x1="88" y1="145" x2="130" y2="180" stroke="#D97706" stroke-width="6" stroke-linecap="round"/>
  <!-- Leather Wrapped Grip -->
  <line x1="105" y1="165" x2="65" y2="205" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
  <!-- Pommel -->
  <circle cx="60" cy="210" r="8" fill="#F59E0B"/>
</svg>
`);

// 10. Aegis of the Sunken Order (Эгида Затонувшего Ордена)
const SVG_SALT_AEGIS = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgShield" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgShield)"/>
  <!-- Tower Shield Outline -->
  <path d="M 68 40 L 188 40 L 188 150 Q 188 215 128 235 Q 68 215 68 150 Z" fill="#0F172A" stroke="#F59E0B" stroke-width="4"/>
  <!-- Inner Rim -->
  <path d="M 80 52 L 176 52 L 176 145 Q 176 200 128 218 Q 80 200 80 145 Z" fill="#1E293B" stroke="#92400E" stroke-width="2"/>
  <!-- Central Tidal Cross / Wave Boss -->
  <circle cx="128" cy="115" r="26" fill="#D97706" stroke="#FDE68A" stroke-width="2"/>
  <circle cx="128" cy="115" r="14" fill="#0284C7"/>
  <!-- Rivets -->
  <circle cx="78" cy="50" r="3" fill="#FDE68A"/>
  <circle cx="178" cy="50" r="3" fill="#FDE68A"/>
  <circle cx="128" cy="225" r="3" fill="#FDE68A"/>
</svg>
`);

// 11. Commander Valdemar's Blade (Клинок Командора Вальдемара)
const SVG_COMMANDER_BLADE = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgSword" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2E1014"/>
      <stop offset="100%" stop-color="#0C0405"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgSword)"/>
  <!-- Longsword Blade -->
  <polygon points="128,25 136,170 120,170" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1"/>
  <line x1="128" y1="25" x2="128" y2="170" stroke="#475569" stroke-width="1.5"/>
  <!-- Crossguard -->
  <rect x="94" y="170" width="68" height="10" rx="3" fill="#B45309" stroke="#FDE68A" stroke-width="1"/>
  <!-- Grip -->
  <rect x="123" y="180" width="10" height="35" rx="2" fill="#451A03"/>
  <!-- Pommel -->
  <circle cx="128" cy="222" r="10" fill="#B45309" stroke="#FDE68A" stroke-width="2"/>
  <!-- Blood Groove Rune Glow -->
  <line x1="128" y1="70" x2="128" y2="140" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
</svg>
`);

// 12. Star Wind Prism (Призма Звёздного Ветра)
const SVG_WIND_PRISM = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgPrism" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#132338"/>
      <stop offset="100%" stop-color="#03080F"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgPrism)"/>
  <!-- Rainbow Light Rays -->
  <line x1="128" y1="128" x2="30" y2="60" stroke="#F43F5E" stroke-width="3" opacity="0.7"/>
  <line x1="128" y1="128" x2="40" y2="190" stroke="#38BDF8" stroke-width="3" opacity="0.7"/>
  <line x1="128" y1="128" x2="220" y2="70" stroke="#FBBF24" stroke-width="3" opacity="0.7"/>
  <line x1="128" y1="128" x2="210" y2="190" stroke="#A855F7" stroke-width="3" opacity="0.7"/>
  <!-- Hexagonal Crystal Prism -->
  <polygon points="128,50 185,85 185,165 128,200 71,165 71,85"
           fill="#0E2F44" stroke="#7DD3FC" stroke-width="2" opacity="0.85"/>
  <polygon points="128,75 165,100 165,150 128,175 91,150 91,100"
           fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" opacity="0.7"/>
  <circle cx="128" cy="128" r="14" fill="#FFFFFF"/>
</svg>
`);

// 13. Comet Shard (Осколок Упавшей Кометы)
const SVG_COMET_SHARD = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgComet" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#36170B"/>
      <stop offset="100%" stop-color="#0D0402"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgComet)"/>
  <!-- Fiery Meteorite Rock -->
  <polygon points="128,40 180,85 200,160 145,215 80,190 60,110"
           fill="#1C1917" stroke="#EA580C" stroke-width="3"/>
  <!-- Glowing Plasma Veins -->
  <path d="M 128 40 L 140 120 L 200 160 M 140 120 L 80 190" stroke="#F97316" stroke-width="4"/>
  <circle cx="140" cy="120" r="10" fill="#FDE047"/>
</svg>
`);

// 14. Ether Elixir (Астральный эликсир эфира)
const SVG_ETHER_ELIXIR = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgEther" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1E1338"/>
      <stop offset="100%" stop-color="#06020E"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgEther)"/>
  <!-- Flask -->
  <rect x="116" y="45" width="24" height="30" fill="#1F2937" stroke="#A855F7" stroke-width="2"/>
  <circle cx="128" cy="155" r="55" fill="#111827" stroke="#A855F7" stroke-width="3"/>
  <!-- Purple glowing potion -->
  <ellipse cx="128" cy="165" rx="42" ry="35" fill="#7E22CE"/>
  <!-- Orbiting stardust -->
  <circle cx="110" cy="150" r="4" fill="#F3E8FF"/>
  <circle cx="145" cy="170" r="5" fill="#E9D5FF"/>
</svg>
`);

// 15. Star Sextant (Небесный секстант Алкиона)
const SVG_SEXTANT = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgSextant" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2B2111"/>
      <stop offset="100%" stop-color="#080603"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgSextant)"/>
  <!-- Brass Arc & Frame -->
  <path d="M 60 210 A 130 130 0 0 1 200 210 L 128 70 Z" fill="#1C1917" stroke="#D97706" stroke-width="4"/>
  <line x1="128" y1="70" x2="135" y2="210" stroke="#FDE68A" stroke-width="3"/>
  <!-- Lens Telescope -->
  <rect x="80" y="60" width="96" height="14" rx="2" fill="#78350F" stroke="#F59E0B" stroke-width="2"/>
  <circle cx="80" cy="67" r="8" fill="#38BDF8"/>
</svg>
`);

// 16. Reverse Chronometer (Хронометр с обратным анкером)
const SVG_CHRONOMETER = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgChrono" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2B1A0E"/>
      <stop offset="100%" stop-color="#090502"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgChrono)"/>
  <!-- Pocket Watch Casing -->
  <circle cx="128" cy="140" r="75" fill="#1F2937" stroke="#D97706" stroke-width="6"/>
  <rect x="120" y="45" width="16" height="22" fill="#B45309" stroke="#FDE68A" stroke-width="2"/>
  <ellipse cx="128" cy="40" rx="18" ry="10" fill="none" stroke="#D97706" stroke-width="4"/>
  <!-- Dial & Roman Numerals circle -->
  <circle cx="128" cy="140" r="62" fill="#FEF3C7" stroke="#78350F" stroke-width="2"/>
  <!-- Reverse Hands -->
  <line x1="128" y1="140" x2="100" y2="110" stroke="#1C1917" stroke-width="4" stroke-linecap="round"/>
  <line x1="128" y1="140" x2="155" y2="125" stroke="#991B1B" stroke-width="2" stroke-linecap="round"/>
  <circle cx="128" cy="140" r="5" fill="#D97706"/>
</svg>
`);

// 17. Wechsler Steam Revolver (Паровой револьвер Векслера)
const SVG_REVOLVER = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgGun" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#242118"/>
      <stop offset="100%" stop-color="#0A0906"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgGun)"/>
  <!-- Barrel -->
  <rect x="40" y="105" width="110" height="18" fill="#374151" stroke="#9CA3AF" stroke-width="1.5"/>
  <rect x="40" y="98" width="105" height="7" fill="#B45309"/>
  <!-- Cylinder -->
  <rect x="135" y="100" width="38" height="32" rx="3" fill="#D97706" stroke="#FDE68A" stroke-width="2"/>
  <!-- Grip / Handle -->
  <path d="M 170 125 C 190 145 205 185 195 210 C 185 220 165 210 155 185 Z" fill="#78350F" stroke="#92400E" stroke-width="2"/>
  <!-- Steam vent pipe -->
  <line x1="50" y1="130" x2="120" y2="130" stroke="#D97706" stroke-width="3"/>
</svg>
`);

// 18. Opiate Tonic (Флакон опиатного тоника)
const SVG_OPIATE_TONIC = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgOpiate" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#381D10"/>
      <stop offset="100%" stop-color="#0A0402"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgOpiate)"/>
  <!-- Amber Glass Bottle -->
  <rect x="114" y="45" width="28" height="20" fill="#78350F" stroke="#D97706" stroke-width="2"/>
  <rect x="88" y="65" width="80" height="145" rx="10" fill="#B45309" stroke="#FDE68A" stroke-width="2"/>
  <!-- Victorian Label -->
  <rect x="100" y="100" width="56" height="75" fill="#FEF3C7" stroke="#78350F" stroke-width="1.5"/>
  <line x1="108" y1="120" x2="148" y2="120" stroke="#78350F" stroke-width="2"/>
  <line x1="112" y1="135" x2="144" y2="135" stroke="#78350F" stroke-width="1.5"/>
</svg>
`);

// 19. Pendulum Cipher Key (Шифровальный ключ Ложи Маятника)
const SVG_LODGE_KEY = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgKey" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1F2421"/>
      <stop offset="100%" stop-color="#070908"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgKey)"/>
  <!-- Key Bow: Gear & Eye -->
  <circle cx="128" cy="75" r="34" fill="#1C1917" stroke="#D97706" stroke-width="6"/>
  <circle cx="128" cy="75" r="14" fill="#B45309"/>
  <!-- Shaft -->
  <rect x="123" y="105" width="10" height="95" fill="#78350F" stroke="#FDE68A" stroke-width="1"/>
  <!-- Gear Teeth Bit -->
  <rect x="133" y="170" width="26" height="8" fill="#D97706"/>
  <rect x="133" y="185" width="20" height="8" fill="#D97706"/>
</svg>
`);

// 20. Wayne's Acoustic Whistle (Акустический свисток Вейна)
const SVG_WHISTLE = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgWhistle" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2B261A"/>
      <stop offset="100%" stop-color="#0B0A06"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgWhistle)"/>
  <!-- Whistle Cylinder -->
  <rect x="60" y="105" width="100" height="35" rx="5" fill="#B45309" stroke="#FDE68A" stroke-width="3"/>
  <circle cx="175" cy="122" r="28" fill="#92400E" stroke="#FDE68A" stroke-width="3"/>
  <rect x="110" y="100" width="15" height="10" fill="#1C1917"/>
  <!-- Sound vibration lines -->
  <path d="M 120 85 Q 140 70 160 85" fill="none" stroke="#FBBF24" stroke-width="2"/>
</svg>
`);

// 21. Admiral's Signal Seal (Сигнальная Печать Адмирала)
const SVG_ADMIRAL_SEAL = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgAdm" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1E2738"/>
      <stop offset="100%" stop-color="#04060A"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgAdm)"/>
  <circle cx="128" cy="128" r="75" fill="#B45309" stroke="#FDE68A" stroke-width="5"/>
  <circle cx="128" cy="128" r="60" fill="#1E293B" stroke="#D97706" stroke-width="2"/>
  <!-- Winged Anchor Compass -->
  <polygon points="128,80 138,128 128,140 118,128" fill="#38BDF8"/>
  <polygon points="128,176 138,128 128,116 118,128" fill="#94A3B8"/>
</svg>
`);

// 22. Thread of Names (Нить Имён)
const SVG_THREAD_OF_NAMES = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgThread" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#261036"/>
      <stop offset="100%" stop-color="#06020A"/>
    </radialGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bgThread)"/>
  <!-- Braided Glowing Thread Helix -->
  <path d="M 60 50 Q 128 140 70 210 Q 190 140 190 50" fill="none" stroke="#C084FC" stroke-width="4" stroke-linecap="round"/>
  <path d="M 80 50 Q 148 140 90 210 Q 210 140 210 50" fill="none" stroke="#F472B6" stroke-width="3" opacity="0.8"/>
  <!-- Floating Silver Runes on Thread -->
  <circle cx="110" cy="115" r="5" fill="#FFFFFF"/>
  <circle cx="145" cy="140" r="5" fill="#FFFFFF"/>
  <circle cx="95" cy="175" r="4" fill="#FFFFFF"/>
</svg>
`);

// Map of canonical item illustrations
export const ITEM_ILLUSTRATIONS: Record<string, string> = {
  // Vaelen World
  'relic-lantern': SVG_LANTERN,
  'relic-tuning-fork': SVG_TUNING_FORK,
  'item-salt-distillate': SVG_SALT_DISTILLATE,
  'key-causeway-seal': SVG_CAUSEWAY_SEAL,
  'item-salt-bandage': SVG_SALT_BANDAGE,
  'relic-ocean-talisman': SVG_OCEAN_TALISMAN,
  'relic-flambeau': SVG_FLAMBEAU,
  'relic-chaplain-ring': SVG_CHAPLAIN_RING,
  'item-coral-needle': SVG_CORAL_NEEDLE,
  'relic-salt-aegis': SVG_SALT_AEGIS,
  'item-commander-blade': SVG_COMMANDER_BLADE,

  // Astral World
  'relic-wind-prism': SVG_WIND_PRISM,
  'relic-comet-shard': SVG_COMET_SHARD,
  'item-ether-elixir': SVG_ETHER_ELIXIR,
  'key-star-sextant': SVG_SEXTANT,
  'item-admiral-seal': SVG_ADMIRAL_SEAL,
  'item-lotus-dew': SVG_SALT_DISTILLATE,
  'item-solis-harpoon': SVG_CORAL_NEEDLE,
  'item-thread-of-names': SVG_THREAD_OF_NAMES,

  // Vespera World
  'relic-reverse-chronometer': SVG_CHRONOMETER,
  'relic-wechsler-revolver': SVG_REVOLVER,
  'item-opiate-tonic': SVG_OPIATE_TONIC,
  'key-lodge-cipher': SVG_LODGE_KEY,
  'relic-whistle': SVG_WHISTLE,
};

/**
 * Procedural fallback illustration generator for any unmapped or dynamic items.
 */
export function generateProceduralItemSvg(item: Partial<Item>): string {
  const cat = (item.category || 'Curio').toLowerCase();
  const rarity = (item.rarity || 'common').toLowerCase();
  const name = item.name || 'Таинственный артефакт';

  let primaryColor = '#8A6B3A';
  let accentColor = '#D8B25E';
  let bgCenter = '#1A140E';

  if (rarity === 'relic') {
    primaryColor = '#E8CF8A';
    accentColor = '#FDE68A';
    bgCenter = '#2A1F13';
  } else if (rarity === 'rare') {
    primaryColor = '#8FA3E0';
    accentColor = '#A5B4FC';
    bgCenter = '#141C30';
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
    <defs>
      <radialGradient id="dynBg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="${bgCenter}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#08070B" stop-opacity="1"/>
      </radialGradient>
      <radialGradient id="dynGlow" cx="50%" cy="50%" r="35%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="256" height="256" fill="url(#dynBg)"/>
    <circle cx="128" cy="128" r="75" fill="url(#dynGlow)"/>
    <!-- Outer Filigree Ring -->
    <circle cx="128" cy="128" r="82" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
    <!-- Center Emblem based on category -->
    ${
      cat.includes('weapon')
        ? `<polygon points="128,45 138,170 128,190 118,170" fill="${primaryColor}"/>
           <line x1="98" y1="170" x2="158" y2="170" stroke="${accentColor}" stroke-width="4"/>
           <circle cx="128" cy="205" r="7" fill="${primaryColor}"/>`
        : cat.includes('consumable')
        ? `<rect x="116" y="55" width="24" height="20" fill="${primaryColor}" rx="2"/>
           <circle cx="128" cy="150" r="50" fill="#0C1518" stroke="${primaryColor}" stroke-width="3"/>
           <ellipse cx="128" cy="160" rx="38" ry="30" fill="${accentColor}" opacity="0.7"/>`
        : cat.includes('key')
        ? `<circle cx="128" cy="85" r="30" fill="none" stroke="${primaryColor}" stroke-width="6"/>
           <rect x="124" y="115" width="8" height="85" fill="${primaryColor}"/>
           <rect x="132" y="175" width="18" height="6" fill="${accentColor}"/>
           <rect x="132" y="188" width="14" height="6" fill="${accentColor}"/>`
        : `<polygon points="128,60 180,105 160,175 96,175 76,105" fill="#13101C" stroke="${primaryColor}" stroke-width="3"/>
           <polygon points="128,85 160,115 145,155 111,155 96,115" fill="${accentColor}" opacity="0.75"/>
           <circle cx="128" cy="128" r="8" fill="#FFFFFF"/>`
    }
  </svg>
  `;

  return createSvgDataUri(svg);
}

/**
 * Returns the best illustration for any item, prioritizing custom illustrationUrl,
 * then the item illustration map, then procedural dark-fantasy generator.
 */
export function getItemIllustration(item: Partial<Item>): string {
  if (item.illustrationUrl && item.illustrationUrl.length > 5) {
    return item.illustrationUrl;
  }
  const id = item.id || '';
  if (ITEM_ILLUSTRATIONS[id]) {
    return ITEM_ILLUSTRATIONS[id];
  }
  return generateProceduralItemSvg(item);
}
