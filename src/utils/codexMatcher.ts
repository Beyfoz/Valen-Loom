import { CodexEntry } from '../types';

/**
 * Strips common Russian grammatical endings (cases, numbers, adjectival endings)
 * to obtain a reliable stem for phrase matching in Russian text.
 */
export function getRussianStem(word: string): string {
  const clean = word.toLowerCase().replace(/[^а-яёa-z0-9]/gi, '');
  if (clean.length <= 3) return clean;

  // Multi-letter inflectional suffixes
  let stem = clean
    .replace(/(ыми|ими|ему|ому|ого|его|ами|ями|уть|ать|еть|ять|ить)$/i, '')
    .replace(/(ый|ий|ое|ее|ая|яя|ых|их|ую|юю|ой|ей|ом|ем|ам|ям|ах|ях|ов|ев|ей)$/i, '');

  // Single-letter vowel / soft-sign inflectional endings
  stem = stem.replace(/(а|я|у|ю|е|и|ы|о|ь)$/i, '');
  return stem.length >= 2 ? stem : clean;
}

export interface CodexMatcher {
  entry: CodexEntry;
  pattern: RegExp;
  phrase: string;
  isMultiWord: boolean;
  priority: number;
}

export interface CodexMatchSpan {
  start: number;
  end: number;
  matchedText: string;
  entry: CodexEntry;
}

/**
 * Extracts searchable sub-phrases and key names from a CodexEntry title & aliases.
 * e.g., "Вьярэль, Звёздный Дракон" -> ["Вьярэль", "Звёздный Дракон"]
 * e.g., "Орион / Сиэль" -> ["Орион", "Сиэль"]
 * e.g., "Автоматон «Секундант»" -> ["Автоматон Секундант", "Секундант"]
 */
export function extractSearchTermsFromEntry(entry: CodexEntry): string[] {
  const terms: Set<string> = new Set();

  // 1. Process custom aliases if defined
  if (entry.aliases && Array.isArray(entry.aliases)) {
    entry.aliases.forEach((a) => {
      const trimmed = a.trim();
      if (trimmed.length >= 3) terms.add(trimmed);
    });
  }

  // 2. Process title
  const rawTitle = entry.title.trim();
  terms.add(rawTitle.replace(/[«»"]/g, '').trim());

  // Split by common title dividers: comma, slash, parentheses
  const segments = rawTitle
    .split(/[,/()]|—/)
    .map((s) => s.replace(/[«»"]/g, '').trim())
    .filter((s) => s.length >= 3);

  segments.forEach((seg) => terms.add(seg));

  // Extract quoted names, e.g. «Секундант» or «Падающая Звезда» or «Алкион»
  const quoted = rawTitle.match(/«([^»]+)»/g);
  if (quoted) {
    quoted.forEach((q) => {
      const clean = q.replace(/[«»]/g, '').trim();
      if (clean.length >= 3) terms.add(clean);
    });
  }

  // Extract individual distinctive capitalized words (names) >= 4 letters
  const words = rawTitle.split(/\s+/).map((w) => w.replace(/[^а-яёa-z]/gi, ''));
  words.forEach((w) => {
    // Keep distinctive single names like "Вьярэль", "Орион", "Сиэль", "Эльтар", "Ойвин", "Изольда", "Мелиор", "Ксайн", "Хэйл", "Прюитт"
    if (w.length >= 4 && /^[А-ЯЁA-Z]/.test(w)) {
      // Exclude generic prefixes like "Сэр", "Мать", "Орден", "Реестр", "Время", "Корона" when single, unless distinctive
      const genericCommon = new Set([
        'Орден',
        'Созвездие',
        'Корвет',
        'Гарпун',
        'Мать',
        'Хор',
        'Реестр',
        'Время',
        'Часовая',
        'Лига',
        'Сэр',
        'Леди',
        'Глава',
        'Архив',
        'Три',
        'Правила',
      ]);
      if (!genericCommon.has(w)) {
        terms.add(w);
      }
    }
  });

  return Array.from(terms).filter((t) => t.length >= 3);
}

/**
 * Builds regular expressions matching words and multi-word phrases by their Russian/English stems
 * with proper Unicode word boundaries.
 */
export function buildCodexMatchers(unlockedEntries: CodexEntry[]): CodexMatcher[] {
  const matchers: CodexMatcher[] = [];

  for (const entry of unlockedEntries) {
    const terms = extractSearchTermsFromEntry(entry);

    for (const term of terms) {
      const words = term
        .split(/\s+/)
        .map((w) => w.replace(/[^а-яёa-z0-9]/gi, ''))
        .filter((w) => w.length > 0);

      if (words.length === 0) continue;

      const isMultiWord = words.length > 1;
      const stems = words.map(getRussianStem);

      // Create regex matching each word stem with optional case inflections
      // e.g. "звёздн" -> звёздн[а-яёa-z]*
      const wordPatterns = stems.map((stem) => {
        // Escape any regex special characters
        const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return `${escaped}[а-яёa-z]*`;
      });

      // Join words with whitespace
      const phrasePattern = wordPatterns.join('\\s+');

      // Unicode boundary assertions: not preceded or followed by unicode letter or digit
      const fullPatternString = `(?<![\\p{L}\\p{N}])${phrasePattern}(?![\\p{L}\\p{N}])`;

      try {
        const regex = new RegExp(fullPatternString, 'giu');
        matchers.push({
          entry,
          pattern: regex,
          phrase: term,
          isMultiWord,
          // Prioritize longer terms and multi-word phrases over single words
          priority: (isMultiWord ? 100 : 0) + term.length,
        });
      } catch {
        // Fallback for environments lacking lookbehind in RegExp
        const fallbackRegex = new RegExp(`\\b${phrasePattern}\\b`, 'gi');
        matchers.push({
          entry,
          pattern: fallbackRegex,
          phrase: term,
          isMultiWord,
          priority: (isMultiWord ? 100 : 0) + term.length,
        });
      }
    }
  }

  // Sort matchers by priority descending
  return matchers.sort((a, b) => b.priority - a.priority);
}

/**
 * Finds all non-overlapping spans of text matching unlocked Codex entries.
 */
export function findCodexMatchesInText(
  text: string,
  matchers: CodexMatcher[]
): CodexMatchSpan[] {
  if (!text || matchers.length === 0) return [];

  const rawMatches: CodexMatchSpan[] = [];

  for (const matcher of matchers) {
    // Reset regex lastIndex
    matcher.pattern.lastIndex = 0;
    let m: RegExpExecArray | null;

    while ((m = matcher.pattern.exec(text)) !== null) {
      if (!m[0]) {
        matcher.pattern.lastIndex++;
        continue;
      }
      rawMatches.push({
        start: m.index,
        end: m.index + m[0].length,
        matchedText: m[0],
        entry: matcher.entry,
      });
    }
  }

  if (rawMatches.length === 0) return [];

  // Sort by start position ascending, then by length descending
  rawMatches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - b.start - (a.end - a.start);
  });

  // Filter out overlapping matches (first match wins)
  const nonOverlapping: CodexMatchSpan[] = [];
  let lastEnd = 0;

  for (const match of rawMatches) {
    if (match.start >= lastEnd) {
      nonOverlapping.push(match);
      lastEnd = match.end;
    }
  }

  return nonOverlapping;
}

/**
 * Returns the first sentence or first line of a codex entry for display in a mini-card.
 */
export function getFirstLineOfCodexContent(content: string): string {
  if (!content) return '';
  // Split on first period, exclamation or question mark followed by space or newline
  const firstSentenceMatch = content.match(/^(.*?[.!?])(?:\s+|$)/);
  if (firstSentenceMatch && firstSentenceMatch[1]) {
    const s = firstSentenceMatch[1].trim();
    return s.length > 150 ? s.slice(0, 147) + '…' : s;
  }
  const firstLine = content.split('\n')[0].trim();
  return firstLine.length > 150 ? firstLine.slice(0, 147) + '…' : firstLine;
}
