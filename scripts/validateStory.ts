import fs from 'fs';
import path from 'path';
import { WORLDS } from '../src/worlds';
import { vaelenStory } from '../src/worlds/vaelen.story';
import { astralStory } from '../src/worlds/astral.story';
import { vaelenWorld } from '../src/worlds/vaelen';
import { vesperaWorld } from '../src/worlds/vespera';
import { astralWorld } from '../src/worlds/astral';
import { StoryPack } from '../src/worlds/storyKit';
import { WorldModule } from '../src/types';
import { getDefaultWorldCodex } from '../src/data/codexData';

// ANSI terminal colors
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

/**
 * Явный список концовок поражения, исключаемых из проверки недостижимости.
 * Эти сцены инициируются движком при падении ОЗ или Рассудка до 0.
 */
export const IGNORED_DEFEAT_ENDINGS = new Set<string>([
  'v_ending_defeat_hp',
  'v_ending_defeat_sanity',
  'vesp_ending_defeat_hp',
  'vesp_ending_defeat_sanity',
  'astral_ending_defeat_hp',
  'astral_ending_defeat_sanity',
]);

export interface WorldValidationReport {
  worldId: string;
  worldTitle: string;
  totalScenes: number;

  // Ошибки (Критические, код выхода 1)
  deadLinks: Array<{ fromScene: string; choiceId?: string; targetId: string; type: string }>;
  missingChapterStarts: Array<{ chapterId: string; chapterTitle: string; startSceneId: string }>;
  deadEndScenes: string[];
  missingEndingScenes: string[];
  invalidRedirects: string[];
  missingImages: Array<{ location: string; imagePath: string }>;

  // Предупреждения (Жёлтые, код выхода 0)
  unreachableScenes: string[];
  ignoredDefeatScenes: string[];
  missingFlags: string[];
  missingItems: string[];
  endingsWithoutEndingFlag: string[];
  invalidPatches: string[];
  missingCodexFlags: Array<{ entryId: string; title: string; unlockFlag: string }>;

  // Информационные счётчики (не ошибки)
  readyScenesCount: number;
}

export function validateWorld(
  worldId: string,
  world: WorldModule,
  pack?: StoryPack,
  baseWorld?: WorldModule
): WorldValidationReport {
  const report: WorldValidationReport = {
    worldId,
    worldTitle: world.title,
    totalScenes: Object.keys(world.scenes).length,
    deadLinks: [],
    missingChapterStarts: [],
    deadEndScenes: [],
    missingEndingScenes: [],
    invalidRedirects: [],
    missingImages: [],
    unreachableScenes: [],
    ignoredDefeatScenes: [],
    missingFlags: [],
    missingItems: [],
    endingsWithoutEndingFlag: [],
    invalidPatches: [],
    missingCodexFlags: [],
    readyScenesCount: 0,
  };

  for (const sId of Object.keys(world.scenes)) {
    const sceneWebp = path.resolve(process.cwd(), 'public', 'scenes', `${sId}.webp`);
    if (fs.existsSync(sceneWebp)) {
      report.readyScenesCount++;
    }
  }

  const sceneIds = new Set(Object.keys(world.scenes));

  // 1. Проверка патчей и редиректов в StoryPack (если применимо)
  if (pack && baseWorld) {
    if (pack.patches) {
      for (const patchSceneId of Object.keys(pack.patches)) {
        if (!baseWorld.scenes[patchSceneId] && !pack.scenes?.[patchSceneId]) {
          report.invalidPatches.push(patchSceneId);
        }
      }
    }
    if (pack.redirects) {
      for (const [from, to] of Object.entries(pack.redirects)) {
        if (!sceneIds.has(to)) {
          report.invalidRedirects.push(`${from} -> ${to}`);
        }
      }
    }
  }

  // 2. Сбор всех выставляемых флагов и выдаваемых предметов
  const flagsSet = new Set<string>();
  const itemsProvided = new Set<string>();

  // Начальный инвентарь мира
  if (world.initialInventory) {
    world.initialInventory.forEach((item) => itemsProvided.add(item.id));
  }

  // Флаги пресетов глав
  if (world.chapters) {
    for (const ch of world.chapters) {
      if (ch.devPreset?.flags) {
        ch.devPreset.flags.forEach((f) => flagsSet.add(f));
      }
    }
  }

  // Обход всех сцен для сбора наград, флагов и проверки мёртвых ссылок
  for (const [sceneId, scene] of Object.entries(world.scenes)) {
    // Хотспоты
    if (scene.hotspots) {
      for (const h of scene.hotspots) {
        if (h.rewardFlag) flagsSet.add(h.rewardFlag);
        if (h.rewardItem) itemsProvided.add(h.rewardItem.id);
      }
    }

    // Выборы
    const choices = scene.choices || [];
    for (const choice of choices) {
      // 1) targetSceneId
      if (!sceneIds.has(choice.targetSceneId)) {
        report.deadLinks.push({
          fromScene: sceneId,
          choiceId: choice.id,
          targetId: choice.targetSceneId,
          type: 'targetSceneId',
        });
      }

      // 2) skillCheck targets
      if (choice.skillCheck) {
        if (choice.skillCheck.passTargetSceneId && !sceneIds.has(choice.skillCheck.passTargetSceneId)) {
          report.deadLinks.push({
            fromScene: sceneId,
            choiceId: choice.id,
            targetId: choice.skillCheck.passTargetSceneId,
            type: 'skillCheck.passTargetSceneId',
          });
        }
        if (choice.skillCheck.failTargetSceneId && !sceneIds.has(choice.skillCheck.failTargetSceneId)) {
          report.deadLinks.push({
            fromScene: sceneId,
            choiceId: choice.id,
            targetId: choice.skillCheck.failTargetSceneId,
            type: 'skillCheck.failTargetSceneId',
          });
        }
        if (choice.skillCheck.passEffect?.flagsSet) {
          choice.skillCheck.passEffect.flagsSet.forEach((f) => flagsSet.add(f));
        }
        if (choice.skillCheck.passEffect?.itemsAdded) {
          choice.skillCheck.passEffect.itemsAdded.forEach((i) => itemsProvided.add(i.id));
        }
        if (choice.skillCheck.failEffect?.flagsSet) {
          choice.skillCheck.failEffect.flagsSet.forEach((f) => flagsSet.add(f));
        }
        if (choice.skillCheck.failEffect?.itemsAdded) {
          choice.skillCheck.failEffect.itemsAdded.forEach((i) => itemsProvided.add(i.id));
        }
      }

      // 3) effect flags and items
      if (choice.effect?.flagsSet) {
        choice.effect.flagsSet.forEach((f) => flagsSet.add(f));
      }
      if (choice.effect?.itemsAdded) {
        choice.effect.itemsAdded.forEach((i) => itemsProvided.add(i.id));
      }
    }

    // Проверка на сцены-тупики (нет выборов и сцена не помечена как концовка)
    const isEndingScene = scene.isEnding === true || Boolean(scene.endingType);
    if (choices.length === 0 && !isEndingScene) {
      report.deadEndScenes.push(sceneId);
    }
  }

  // 3. Проверка startSceneId глав в world.chapters
  if (world.chapters) {
    for (const chapter of world.chapters) {
      if (!sceneIds.has(chapter.startSceneId)) {
        report.missingChapterStarts.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          startSceneId: chapter.startSceneId,
        });
      }
    }
  }

  // 4. Проверка endingsList
  if (world.endingsList) {
    for (const ending of world.endingsList) {
      const scene = world.scenes[ending.id];
      if (!scene) {
        report.missingEndingScenes.push(ending.id);
      } else if (!scene.isEnding && !scene.endingType) {
        report.endingsWithoutEndingFlag.push(ending.id);
      }
    }
  }

  // 5. Анализ достижимости сцен из startSceneId
  const reachable = new Set<string>();
  if (sceneIds.has(world.startSceneId)) {
    reachable.add(world.startSceneId);
    const queue = [world.startSceneId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const scene = world.scenes[current];
      if (!scene) continue;

      for (const c of scene.choices || []) {
        const targets = [
          c.targetSceneId,
          c.skillCheck?.passTargetSceneId,
          c.skillCheck?.failTargetSceneId,
        ].filter((t): t is string => Boolean(t && sceneIds.has(t)));

        for (const t of targets) {
          if (!reachable.has(t)) {
            reachable.add(t);
            queue.push(t);
          }
        }
      }
    }
  } else {
    report.deadLinks.push({
      fromScene: 'WORLD_ROOT',
      targetId: world.startSceneId,
      type: 'world.startSceneId',
    });
  }

  for (const sId of sceneIds) {
    if (!reachable.has(sId)) {
      const scene = world.scenes[sId];
      const isDefeatEnding =
        IGNORED_DEFEAT_ENDINGS.has(sId) ||
        scene?.endingType === 'defeat_health' ||
        scene?.endingType === 'defeat_sanity';

      if (isDefeatEnding) {
        report.ignoredDefeatScenes.push(sId);
      } else {
        report.unreachableScenes.push(sId);
      }
    }
  }

  // 6. Проверка требуемых флагов и предметов в условиях и реактивных страницах
  const missingFlagsSet = new Set<string>();
  const missingItemsSet = new Set<string>();

  for (const scene of Object.values(world.scenes)) {
    // Реактивные страницы
    if (scene.reactivePages) {
      for (const rp of scene.reactivePages) {
        if (rp.requiredFlags) {
          rp.requiredFlags.forEach((f) => {
            if (!flagsSet.has(f)) missingFlagsSet.add(f);
          });
        }
        if (rp.anyFlags) {
          rp.anyFlags.forEach((f) => {
            if (!flagsSet.has(f)) missingFlagsSet.add(f);
          });
        }
        if (rp.forbiddenFlags) {
          rp.forbiddenFlags.forEach((f) => {
            if (!flagsSet.has(f)) missingFlagsSet.add(f);
          });
        }
        if (rp.hasItem && !itemsProvided.has(rp.hasItem)) {
          missingItemsSet.add(rp.hasItem);
        }
        if (rp.hasItemsAll) {
          rp.hasItemsAll.forEach((i) => {
            if (!itemsProvided.has(i)) missingItemsSet.add(i);
          });
        }
      }
    }

    // Выборы
    for (const c of scene.choices || []) {
      if (c.condition) {
        if (c.condition.requiredFlags) {
          c.condition.requiredFlags.forEach((f) => {
            if (!flagsSet.has(f)) missingFlagsSet.add(f);
          });
        }
        if (c.condition.anyFlags) {
          c.condition.anyFlags.forEach((f) => {
            if (!flagsSet.has(f)) missingFlagsSet.add(f);
          });
        }
        if (c.condition.forbiddenFlags) {
          c.condition.forbiddenFlags.forEach((f) => {
            if (!flagsSet.has(f)) missingFlagsSet.add(f);
          });
        }
        if (c.condition.hasItem && !itemsProvided.has(c.condition.hasItem)) {
          missingItemsSet.add(c.condition.hasItem);
        }
        if (c.condition.hasItemsAll) {
          c.condition.hasItemsAll.forEach((i) => {
            if (!itemsProvided.has(i)) missingItemsSet.add(i);
          });
        }
      }
    }

    // Хотспоты
    if (scene.hotspots) {
      for (const h of scene.hotspots) {
        if (h.requiredFlag && !flagsSet.has(h.requiredFlag)) {
          missingFlagsSet.add(h.requiredFlag);
        }
        if (h.requiredItem && !itemsProvided.has(h.requiredItem)) {
          missingItemsSet.add(h.requiredItem);
        }
      }
    }
  }

  report.missingFlags = Array.from(missingFlagsSet);
  report.missingItems = Array.from(missingItemsSet);

  // 6. Проверка Кодекса: флаги unlockFlag, которые нигде не выставляются
  const codexEntries = world.codex && world.codex.length > 0
    ? world.codex
    : getDefaultWorldCodex(worldId) || [];

  for (const entry of codexEntries) {
    if (entry.unlockFlag && !flagsSet.has(entry.unlockFlag)) {
      report.missingCodexFlags.push({
        entryId: entry.id,
        title: entry.title,
        unlockFlag: entry.unlockFlag,
      });
    }
  }

  // 7. Проверка существования файлов изображений в public/
  const checkImageExists = (imagePath: string | undefined, locationDesc: string) => {
    if (!imagePath) return;
    if (imagePath.startsWith('data:') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) return;
    const cleanPath = imagePath.replace(/^\/+/, '');
    const fullPath = path.resolve(process.cwd(), 'public', cleanPath);
    if (!fs.existsSync(fullPath)) {
      report.missingImages.push({
        location: locationDesc,
        imagePath,
      });
    }
  };

  checkImageExists(world.coverImage, `Обложка мира (${world.id}.coverImage)`);

  for (const [sId, scene] of Object.entries(world.scenes)) {
    if (scene.localImage) {
      checkImageExists(scene.localImage, `Сцена ${sId} (localImage)`);
    }
    if (scene.cgIllustration?.url) {
      checkImageExists(scene.cgIllustration.url, `Сцена ${sId} (cgIllustration.url)`);
    }
  }

  if (world.endingsList) {
    for (const ending of world.endingsList) {
      if (ending.cgUrl) {
        checkImageExists(ending.cgUrl, `Концовка ${ending.id} (cgUrl)`);
      }
    }
  }

  return report;
}

/**
 * Печать красивой таблицы результатов проверки для отдельного мира
 */
function printWorldTable(report: WorldValidationReport): { errorCount: number; warningCount: number } {
  const errorCount =
    report.deadLinks.length +
    report.missingChapterStarts.length +
    report.deadEndScenes.length +
    report.missingEndingScenes.length +
    report.invalidRedirects.length +
    report.missingImages.length;

  const warningCount =
    report.unreachableScenes.length +
    report.missingFlags.length +
    report.missingItems.length +
    report.endingsWithoutEndingFlag.length +
    report.invalidPatches.length +
    report.missingCodexFlags.length;

  console.log(`${BOLD}${CYAN}╔══════════════════════════════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(
    `${BOLD}${CYAN}║${RESET}  ${BOLD}МИР: ${report.worldId.toUpperCase()} («${report.worldTitle}»)${RESET}`.padEnd(95) +
      `${BOLD}${CYAN}║${RESET}`
  );
  console.log(
    `${BOLD}${CYAN}║${RESET}  ${DIM}Всего сцен: ${report.totalScenes}${RESET}`.padEnd(95) +
      `${BOLD}${CYAN}║${RESET}`
  );
  console.log(`${BOLD}${CYAN}╠══════════════════════════════════════════════════════════════════════╦═══════════════╦════════╣${RESET}`);
  console.log(
    `${BOLD}${CYAN}║${RESET} ${BOLD}${'Категория проверки'.padEnd(68)}${RESET} ${BOLD}${CYAN}║${RESET} ${BOLD}${'Статус'.padEnd(13)}${RESET} ${BOLD}${CYAN}║${RESET} ${BOLD}${'Кол-во'.padEnd(6)}${RESET} ${BOLD}${CYAN}║${RESET}`
  );
  console.log(`${BOLD}${CYAN}╠══════════════════════════════════════════════════════════════════════╬═══════════════╬════════╣${RESET}`);

  const rows: Array<{ label: string; count: number; isError: boolean }> = [
    { label: 'Мёртвые ссылки (targetSceneId, pass, fail, startSceneId)', count: report.deadLinks.length, isError: true },
    { label: 'Несуществующие startSceneId глав (world.chapters)', count: report.missingChapterStarts.length, isError: true },
    { label: 'Сцены-тупики (0 выборов, не помечены как концовка)', count: report.deadEndScenes.length, isError: true },
    { label: 'Несуществующие сцены для ID из endingsList', count: report.missingEndingScenes.length, isError: true },
    { label: 'Ошибочные редиректы StoryPack', count: report.invalidRedirects.length, isError: true },
    { label: 'Отсутствующие файлы изображений в public/', count: report.missingImages.length, isError: true },
    { label: 'Недостижимые сцены (за вычетом концовок поражения)', count: report.unreachableScenes.length, isError: false },
    { label: 'Флаги условий, нигде не выставляемые (flagsSet/хотспоты)', count: report.missingFlags.length, isError: false },
    { label: 'Предметы условий, нигде не выдаваемые (hasItem/инвентарь)', count: report.missingItems.length, isError: false },
    { label: 'Флаги Кодекса (unlockFlag), нигде не выставляемые', count: report.missingCodexFlags.length, isError: false },
    { label: 'Сцены из endingsList без флага isEnding/endingType', count: report.endingsWithoutEndingFlag.length, isError: false },
    { label: 'Патчи StoryPack для несуществующих сцен', count: report.invalidPatches.length, isError: false },
  ];

  for (const r of rows) {
    let status = `${GREEN}✓ ОК${RESET}         `;
    if (r.count > 0) {
      if (r.isError) {
        status = `${RED}❌ ОШИБКА${RESET}     `;
      } else {
        status = `${YELLOW}⚠️ ВНИМАНИЕ${RESET}   `;
      }
    }
    const countStr = r.count > 0 ? (r.isError ? `${RED}${r.count}${RESET}` : `${YELLOW}${r.count}${RESET}`) : `${GREEN}0${RESET}`;
    console.log(
      `${BOLD}${CYAN}║${RESET} ${r.label.padEnd(68)} ${BOLD}${CYAN}║${RESET} ${status} ${BOLD}${CYAN}║${RESET} ${countStr.padEnd(15)} ${BOLD}${CYAN}║${RESET}`
    );
  }

  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════════════════════════════╩═══════════════╩════════╝${RESET}`);

  // Отдельный вывод критических ошибок (КРАСНЫЙ)
  if (errorCount > 0) {
    console.log(`\n  ${BOLD}${RED}❌ ОШИБКИ (КРИТИЧЕСКИЕ, код 1) — [${errorCount}]:${RESET}`);
    if (report.missingImages.length > 0) {
      console.log(`     ${RED}Отсутствующие файлы изображений в public/:${RESET}`);
      for (const mi of report.missingImages) {
        console.log(`       • ${mi.location} -> "${mi.imagePath}" (файл не найден)`);
      }
    }
    if (report.deadLinks.length > 0) {
      console.log(`     ${RED}Мёртвые ссылки:${RESET}`);
      for (const d of report.deadLinks) {
        console.log(`       • [${d.type}] Сцена "${d.fromScene}" -> выбор "${d.choiceId || '—'}" -> несуществующая сцена "${d.targetId}"`);
      }
    }
    if (report.missingChapterStarts.length > 0) {
      console.log(`     ${RED}Несуществующие сцены старта глав:${RESET}`);
      for (const ch of report.missingChapterStarts) {
        console.log(`       • Глава "${ch.chapterTitle}" (${ch.chapterId}) -> startSceneId "${ch.startSceneId}" отсутствует`);
      }
    }
    if (report.deadEndScenes.length > 0) {
      console.log(`     ${RED}Сцены-тупики:${RESET}`);
      for (const de of report.deadEndScenes) {
        console.log(`       • Сцена "${de}" не имеет выборов и не помечена как концовка`);
      }
    }
    if (report.missingEndingScenes.length > 0) {
      console.log(`     ${RED}Отсутствующие сцены концовок:${RESET}`);
      for (const me of report.missingEndingScenes) {
        console.log(`       • В endingsList указан ID "${me}", но сцены с таким ID нет в world.scenes`);
      }
    }
    if (report.invalidRedirects.length > 0) {
      console.log(`     ${RED}Ошибочные редиректы:${RESET}`);
      for (const ir of report.invalidRedirects) {
        console.log(`       • ${ir}`);
      }
    }
  } else {
    console.log(`  ${GREEN}✓ Критических ошибок нет (0 ошибок)${RESET}`);
  }

  // Отдельный вывод предупреждений (ЖЁЛТЫЙ)
  if (warningCount > 0) {
    console.log(`\n  ${BOLD}${YELLOW}⚠️  ПРЕДУПРЕЖДЕНИЯ (код 0) — [${warningCount}]:${RESET}`);
    if (report.unreachableScenes.length > 0) {
      console.log(`     ${YELLOW}Недостижимые сцены из startSceneId:${RESET}`);
      for (const u of report.unreachableScenes) {
        console.log(`       • "${u}"`);
      }
    }
    if (report.missingFlags.length > 0) {
      console.log(`     ${YELLOW}Флаги, требуемые условиями, но нигде не выставляемые:${RESET}`);
      for (const f of report.missingFlags) {
        console.log(`       • флаг "${f}"`);
      }
    }
    if (report.missingItems.length > 0) {
      console.log(`     ${YELLOW}Предметы, требуемые условиями, но нигде не выдаваемые:${RESET}`);
      for (const it of report.missingItems) {
        console.log(`       • предмет "${it}"`);
      }
    }
    if (report.missingCodexFlags.length > 0) {
      console.log(`     ${YELLOW}Флаги Кодекса (unlockFlag), нигде не выставляемые:${RESET}`);
      for (const mc of report.missingCodexFlags) {
        console.log(`       • запись "${mc.title}" (${mc.entryId}) -> unlockFlag: "${mc.unlockFlag}"`);
      }
    }
    if (report.endingsWithoutEndingFlag.length > 0) {
      console.log(`     ${YELLOW}Сцены из endingsList, не помеченные флагом isEnding / endingType:${RESET}`);
      for (const e of report.endingsWithoutEndingFlag) {
        console.log(`       • Сцена "${e}" есть в сюжете, но у неё отсутствует isEnding: true`);
      }
    }
    if (report.invalidPatches.length > 0) {
      console.log(`     ${YELLOW}Патчи для несуществующих сцен:${RESET}`);
      for (const p of report.invalidPatches) {
        console.log(`       • патч сцены "${p}"`);
      }
    }
  } else {
    console.log(`  ${GREEN}✓ Предупреждений нет (0 предупреждений)${RESET}`);
  }

  if (report.ignoredDefeatScenes.length > 0) {
    console.log(`  ${DIM}ℹ Концовки поражения (игнорируются по списку): ${report.ignoredDefeatScenes.join(', ')}${RESET}`);
  }
  console.log(`  ${DIM}ℹ Готовых кадров сцен (public/scenes): ${report.readyScenesCount} из ${report.totalScenes}${RESET}`);

  console.log('\n');
  return { errorCount, warningCount };
}

/**
 * Запуск полной валидации по всем трём мирам
 */
export function runValidation(): boolean {
  console.log(`\n${BOLD}================================================================================${RESET}`);
  console.log(`${BOLD}     ВАЛИДАЦИЯ СЮЖЕТА И СВЯЗНОСТИ МИРОВ (STORY INTEGRITY VALIDATION)           ${RESET}`);
  console.log(`${BOLD}================================================================================${RESET}\n`);

  const worldsToTest = [
    { id: 'vaelen', world: WORLDS.vaelen, pack: vaelenStory, base: vaelenWorld },
    { id: 'vespera', world: WORLDS.vespera, pack: undefined, base: vesperaWorld },
    { id: 'astral', world: WORLDS.astral, pack: astralStory, base: astralWorld },
  ];

  let totalErrors = 0;
  let totalWarnings = 0;
  let totalScenesChecked = 0;
  let totalReadyScenes = 0;

  for (const item of worldsToTest) {
    const report = validateWorld(item.id, item.world, item.pack, item.base);
    totalScenesChecked += report.totalScenes;
    totalReadyScenes += report.readyScenesCount;
    const { errorCount, warningCount } = printWorldTable(report);
    totalErrors += errorCount;
    totalWarnings += warningCount;
  }

  console.log(`${BOLD}================================================================================${RESET}`);
  console.log(`${BOLD}ИТОГОВЫЙ РЕЗУЛЬТАТ ВАЛИДАЦИИ:${RESET}`);
  console.log(`  • Проверено миров: ${BOLD}${worldsToTest.length}${RESET}`);
  console.log(`  • Проверено сцен: ${BOLD}${totalScenesChecked}${RESET}`);
  console.log(`  • Готовых кадров сцен (public/scenes): ${BOLD}${totalReadyScenes} из ${totalScenesChecked}${RESET} ${DIM}(информационно)${RESET}`);
  console.log(`  • Критических ошибок: ${totalErrors > 0 ? `${BOLD}${RED}${totalErrors}${RESET}` : `${BOLD}${GREEN}0${RESET}`}`);
  console.log(`  • Предупреждений: ${totalWarnings > 0 ? `${BOLD}${YELLOW}${totalWarnings}${RESET}` : `${BOLD}${GREEN}0${RESET}`}`);
  console.log(`${BOLD}================================================================================${RESET}\n`);

  if (totalErrors > 0) {
    console.error(
      `${BOLD}${RED}❌ СБОРКА ОСТАНОВЛЕНА: Найдено ${totalErrors} критических ошибок сюжета! Мёртвые ссылки или тупики.${RESET}\n`
    );
    return false;
  }

  console.log(
    `${BOLD}${GREEN}✓ ПРОВЕРКА ПРОЙДЕНА: 0 критических ошибок сюжета. Все ссылки корректны!${RESET}\n`
  );
  return true;
}

if (process.argv[1]?.endsWith('validateStory.ts')) {
  const success = runValidation();
  process.exit(success ? 0 : 1);
}
