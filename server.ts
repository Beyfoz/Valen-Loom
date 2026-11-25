import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import sharp from 'sharp';
import { ZipArchive } from 'archiver';
import { SCENE_IMAGE_PROMPTS } from './src/data/sceneImagePrompts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '16mb' }));
app.use('/scenes', express.static(path.resolve(__dirname, 'public/scenes')));

const imageBase64Cache: Record<string, string> = {};
const sceneImageCache = new Map<string, string>();
const MAX_SCENE_IMAGE_CACHE = 50;

function setSceneImageCache(key: string, value: string): void {
  if (sceneImageCache.has(key)) {
    sceneImageCache.delete(key);
  }
  sceneImageCache.set(key, value);
  while (sceneImageCache.size > MAX_SCENE_IMAGE_CACHE) {
    const oldestKey = sceneImageCache.keys().next().value;
    if (oldestKey !== undefined) {
      sceneImageCache.delete(oldestKey);
    } else {
      break;
    }
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getBackdropForTurn({
  worldCoverImage = '',
  location = '',
  playerAction = '',
  consequenceSummary = '',
  turnNumber = 1,
}: {
  worldCoverImage?: string;
  location?: string;
  playerAction?: string;
  consequenceSummary?: string;
  turnNumber?: number;
}): string {
  const text = (
    worldCoverImage +
    ' ' +
    location +
    ' ' +
    playerAction +
    ' ' +
    consequenceSummary
  ).toLowerCase();

  // Eldoria / Vaelen Submerged Citadel
  if (
    text.includes('eldoria') ||
    text.includes('велен') ||
    text.includes('дамб') ||
    text.includes('цитадел')
  ) {
    // If turn 2+ or inside sluice / sanctum / depths / vaults
    if (
      turnNumber >= 2 ||
      text.includes('шлюз') ||
      text.includes('святилищ') ||
      text.includes('глубин') ||
      text.includes('внутрь') ||
      text.includes('зал') ||
      text.includes('механизм') ||
      text.includes('хранилищ')
    ) {
      return '/images/preset_world_eldoria_1791453485261.webp'; // Interior flooded gothic vaults & sluice mechanisms
    }
    return '/images/preset_world_eldoria_1791455431121.webp'; // Outer causeway & gateway
  }

  // Astral Archipelago / Sky Corsair
  if (
    text.includes('astral') ||
    text.includes('астрал') ||
    text.includes('корсар') ||
    text.includes('небес') ||
    text.includes('алкион')
  ) {
    if (
      turnNumber >= 2 ||
      text.includes('шпил') ||
      text.includes('бездн') ||
      text.includes('левиафан') ||
      text.includes('руин')
    ) {
      return '/images/preset_world_astral_1791453508871.webp'; // Leviathan abyss & floating spires
    }
    return '/images/preset_world_astral_1791455452771.webp'; // Flying ship deck
  }

  // Neoverse / Clockwork Noir
  if (
    text.includes('neoverse') ||
    text.includes('неоверс') ||
    text.includes('веспера') ||
    text.includes('вокзал') ||
    text.includes('платформ')
  ) {
    if (
      turnNumber >= 2 ||
      text.includes('крыш') ||
      text.includes('башн') ||
      text.includes('небоскреб') ||
      text.includes('высот')
    ) {
      return '/images/preset_world_neoverse_1791453496951.webp'; // Clockwork rooftops & night skyline
    }
    return '/images/preset_world_neoverse_1791455441242.webp'; // Rain-slicked station alley
  }

  return (
    worldCoverImage ||
    '/images/preset_world_eldoria_1791455431121.webp'
  );
}

function getImageBase64(imagePath?: string): string {
  const publicDir = path.resolve(__dirname, 'public');
  const readDefault = () => {
    const defaultPath = path.resolve(publicDir, 'images/preset_world_eldoria_1791455431121.webp');
    if (fs.existsSync(defaultPath)) {
      return `data:image/webp;base64,${fs.readFileSync(defaultPath).toString('base64')}`;
    }
    return '';
  };

  if (!imagePath) {
    return readDefault();
  }
  if (imageBase64Cache[imagePath]) return imageBase64Cache[imagePath];
  try {
    const clean = imagePath.split('?')[0].replace(/^\/+/, '');
    const full = path.resolve(publicDir, clean);
    if (full.startsWith(publicDir + path.sep) && fs.existsSync(full) && fs.statSync(full).isFile()) {
      const buf = fs.readFileSync(full);
      const ext = path.extname(full).toLowerCase();
      const mime =
        ext === '.png'
          ? 'image/png'
          : ext === '.webp'
          ? 'image/webp'
          : 'image/jpeg';
      const b64 = `data:${mime};base64,${buf.toString('base64')}`;
      imageBase64Cache[imagePath] = b64;
      return b64;
    }
  } catch (err) {
    console.warn('Error reading base64 image from', imagePath, err);
  }
  return readDefault();
}

function getGenAI() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function resolveTextModels(preferredModel?: string): string[] {
  if (preferredModel === 'gemini-3.1-flash-lite' || preferredModel === 'gemini-2.5-flash-lite') {
    return ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];
  }
  if (preferredModel === 'gemini-3.1-pro-preview') {
    return ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  }
  return ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
}

let textQuotaCooldownUntil = 0;
let imageQuotaCooldownUntil = 0;
let geminiCallCount = 0;

async function generateWithFallback(
  modelsToTry: string[],
  buildParams: (model: string) => any,
  isImageRequest = false
) {
  const now = Date.now();
  const cooldownUntil = isImageRequest ? imageQuotaCooldownUntil : textQuotaCooldownUntil;
  if (now < cooldownUntil) {
    const err: any = new Error('Quota cooldown active');
    err.status = 429;
    err.reason = 'quota';
    throw err;
  }

  const ai = getGenAI();
  let lastError: any = null;
  for (const modelName of modelsToTry) {
    try {
      geminiCallCount++;
      console.log(
        `[Gemini Call #${geminiCallCount}] Model: ${modelName} | Type: ${isImageRequest ? 'IMAGE' : 'TEXT'}`
      );
      const params = buildParams(modelName);
      const response = await ai.models.generateContent(params);
      return { response, modelUsed: modelName };
    } catch (err: any) {
      lastError = err;
      const isQuotaError =
        err?.status === 429 ||
        err?.code === 429 ||
        String(err?.message || '').includes('429') ||
        String(err?.message || '').includes('RESOURCE_EXHAUSTED') ||
        String(err?.message || '').toLowerCase().includes('quota');

      if (isQuotaError) {
        if (isImageRequest) {
          imageQuotaCooldownUntil = Date.now() + 60000;
        } else {
          textQuotaCooldownUntil = Date.now() + 60000;
        }
        console.warn(`Quota limit hit for ${modelName}. Setting 60s cooldown.`);
        break;
      }
      console.warn(
        `Model ${modelName} failed (${err?.status || err?.message}), trying next fallback...`
      );
    }
  }
  throw lastError;
}

// 1. Infinite Adventure Story Turn Engine
app.post('/api/story/turn', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      worldTitle,
      worldGenre,
      artStylePrompt,
      turnNumber,
      playerAction,
      storyHistory,
      currentQuest,
      inventory,
      characters,
      preferredModel = 'gemini-2.5-flash',
      language = 'ru',
      worldCoverImage = '',
    } = req.body;

    const characterSheetsText = (characters || [])
      .map(
        (c: any) =>
          `- [${c.id}] ${c.name} (${c.role}, Disposition: ${c.disposition}): Visual Lock = "${c.visualDescriptor}". Status = ${c.statusNote}`
      )
      .join('\n');

    const inventoryText = (inventory || [])
      .map(
        (item: any) =>
          `- [${item.id}] ${item.name} (x${item.quantity}, ${item.category}): ${item.description}`
      )
      .join('\n');

    const recentHistoryText = (storyHistory || [])
      .slice(-5)
      .map(
        (node: any) =>
          `Turn ${node.turnNumber} (${node.location}) — Action: "${node.playerAction || 'Beginning'}" -> Outcome: ${node.consequenceSummary}\n${(node.narrative || []).join(' ')}`
      )
      .join('\n\n');

    const isRu = language === 'ru';
    const systemInstruction = `You are the Vaelen Loom Infinite Adventure Engine, an adaptive tabletop GM and interactive novelist.
CRITICAL RULES:
1. GENUINE AGENCY: The player's chosen action ("${playerAction}") must genuinely alter the upcoming plot, alliances, dangers, and world state. Never force the player back onto a preset railroad.
2. AUTOMATIC SIDEBAR UPDATES:
   - Dynamically update the Current Quest (objective, subObjectives, status, and journalEntry) whenever discoveries, betrayals, or milestones occur.
   - Automatically add new Inventory items when the player finds, loots, crafts, or receives objects, and remove items when consumed, given away, or lost.
   - Maintain strict Character Continuity: When a new character appears or an existing character's state changes, return them in charactersUpdated with a highly specific, unchanging "visualDescriptor" (face, hair, clothing, colors, signature props) so real-time generated illustrations depict them identically across every turn.
3. VISUAL CONSISTENCY: Write "sceneVisualDescription" so it explicitly describes the environment, lighting, camera angle, and the exact physical actions of the characters present, matching the campaign's Master Art Style ("${artStylePrompt}").
4. NARRATIVE STYLE: Write vivid, atmospheric, literary second-person prose (${isRu ? '"Вы..."' : '"You..."'}) divided into 2 or 3 crisp paragraphs. Avoid clichés.
${
  isRu
    ? '5. LANGUAGE: You MUST write ALL narrative paragraphs, chapterTitle, consequenceSummary, questUpdate texts, subObjectives, and choices in fluent, literary, highly atmospheric RUSSIAN. Use rich vocabulary and natural Russian interactive fiction phrasing.'
    : ''
}`;

    const prompt = `CAMPAIGN: ${worldTitle} (${worldGenre})
NEXT TURN NUMBER: ${turnNumber}
PLAYER'S CHOSEN ACTION: "${playerAction}"

CURRENT QUEST:
Title: ${currentQuest?.title}
Objective: ${currentQuest?.objective}
Sub-Objectives: ${JSON.stringify(currentQuest?.subObjectives || [])}

CURRENT INVENTORY:
${inventoryText || 'Empty'}

PERSISTENT CHARACTER REGISTRY (Visual Bible):
${characterSheetsText}

RECENT CHRONICLE HISTORY:
${recentHistoryText}

Generate the next turn of the adventure in structured JSON.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        chapterTitle: {
          type: Type.STRING,
          description: 'Evocative title for this scene or chapter beat.',
        },
        location: {
          type: Type.STRING,
          description: 'Specific current location name.',
        },
        narrative: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            '2 to 3 paragraphs of atmospheric story prose responding directly to the player choice.',
        },
        consequenceSummary: {
          type: Type.STRING,
          description:
            'One concise sentence explaining how this choice permanently altered the plot.',
        },
        sceneVisualDescription: {
          type: Type.STRING,
          description:
            'Detailed visual composition of the current scene, environment, lighting, and characters present.',
        },
        presentCharacterIds: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            'IDs of characters from the registry (including protagonist and any newly added characters) visible in this scene.',
        },
        questUpdate: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            objective: { type: Type.STRING },
            status: {
              type: Type.STRING,
              description: 'Active, Shifted, Completed, or Critical',
            },
            journalEntry: { type: Type.STRING },
            subObjectives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN },
                },
                required: ['id', 'text', 'completed'],
              },
            },
          },
          required: ['title', 'objective', 'status', 'journalEntry', 'subObjectives'],
        },
        inventoryAdded: {
          type: Type.ARRAY,
          description: 'New items gained during this turn (empty array if none).',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              category: {
                type: Type.STRING,
                description: 'Relic, Weapon, Key, Consumable, Document, or Curio',
              },
              quantity: { type: Type.INTEGER },
              description: { type: Type.STRING },
              loreNote: { type: Type.STRING },
            },
            required: ['id', 'name', 'category', 'quantity', 'description', 'loreNote'],
          },
        },
        inventoryRemovedIds: {
          type: Type.ARRAY,
          description: 'IDs of existing inventory items consumed, lost, or given away this turn.',
          items: { type: Type.STRING },
        },
        charactersUpdated: {
          type: Type.ARRAY,
          description:
            'New characters met or existing characters whose disposition/status updated.',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              affiliation: { type: Type.STRING },
              disposition: {
                type: Type.STRING,
                description: 'Loyal, Friendly, Neutral, Wary, Hostile, or Protagonist',
              },
              visualDescriptor: {
                type: Type.STRING,
                description:
                  'Permanent, highly specific physical and clothing description so generated images keep this character looking identical.',
              },
              statusNote: { type: Type.STRING },
            },
            required: [
              'id',
              'name',
              'role',
              'affiliation',
              'disposition',
              'visualDescriptor',
              'statusNote',
            ],
          },
        },
        choices: {
          type: Type.ARRAY,
          description: '3 to 4 genuinely distinct branching choices for the next turn.',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              approach: {
                type: Type.STRING,
                description: 'Audacious, Diplomatic, Shadow, Arcane, or Investigative',
              },
              consequenceHint: { type: Type.STRING },
              requiredItem: { type: Type.STRING },
            },
            required: ['id', 'text', 'approach', 'consequenceHint'],
          },
        },
      },
      required: [
        'chapterTitle',
        'location',
        'narrative',
        'consequenceSummary',
        'sceneVisualDescription',
        'presentCharacterIds',
        'questUpdate',
        'inventoryAdded',
        'inventoryRemovedIds',
        'charactersUpdated',
        'choices',
      ],
    };

    const modelOrder = resolveTextModels(preferredModel);

    const { response, modelUsed } = await generateWithFallback(modelOrder, (model) => ({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
      },
    }));

    const parsed = JSON.parse(response.text || '{}');

    // Generate immediate high-fidelity cinematic scene illustration representing the chosen action
    const nextTurnNum = Number(turnNumber) || 2;
    const sceneId = `scene-${nextTurnNum}-${Date.now().toString(36)}`;
    const svgIllustration = createCinematicSceneIllustration({
      chapterTitle: parsed.chapterTitle || `Turn ${nextTurnNum}`,
      location: parsed.location || worldTitle,
      playerAction: playerAction || '',
      consequenceSummary: parsed.consequenceSummary || '',
      narrativeSnippet: Array.isArray(parsed.narrative) ? parsed.narrative[0] : '',
      artStylePrompt,
      sceneVisualDescription: parsed.sceneVisualDescription || '',
      presentCharacters: characters || [],
      worldCoverImage,
      turnNumber: nextTurnNum,
      language,
    });
    setSceneImageCache(sceneId, svgIllustration);

    res.json({
      ...parsed,
      imageUrl: `/api/scene-image/${sceneId}`,
      isCinematicIllustration: true,
      modelUsed,
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('Story turn error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate next story turn.',
    });
  }
});

// 1b. Scene Text Enrichment by Gemini (Detail Level switcher)
app.post('/api/story/enrich', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      worldTitle,
      location,
      sceneText,
      inventory = [],
      stats = {},
      modelTier = 'gemini-2.5-flash',
      protagonist = 'Герой',
      companion = '',
      recentSensoryTexts = [],
      isEnding = false,
      endingTitle = '',
    } = req.body;

    if (isEnding) {
      return res.json({
        sensoryDetail: '',
        companionWhisper: '',
        epilogueNote: endingTitle ? `Эпилог летописи: «${endingTitle}». Судьба мира запечатлена в хрониках.` : '',
        modelUsed: 'system-epilogue',
        latencyMs: 0,
      });
    }

    const previousSensoryWarnings = (recentSensoryTexts || [])
      .filter(Boolean)
      .slice(-3)
      .map((t: string, idx: number) => `Предыдущий текст ${idx + 1}: "${t}"`)
      .join('\n');

    const systemInstruction = `Вы — литературный соавтор и нарративный движок интерактивной новеллы «Vaelen Loom».
Ваша задача — обогатить текущую сцену свежими, уникальными сенсорными деталями (1-2 предложения: звуки, запахи, температура, игра света).
КРИТИЧЕСКИЕ ПРАВИЛА:
1. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО повторять метафоры, ключевые слова и образы из предыдущих описаний сцен. Никаких повторяющихся банальностей (запах соли, скрежет меди, гул глубин, сырость и т.д.), если они уже встречались ранее. Ищите свежие микродетали.
2. Цитата спутника: выводите её ТОЛЬКО если спутник реально присутствует (передан параметр companion: "${companion}"). Если спутник отсутствует или имя пустое — поле companionWhisper ДОЛЖНО быть пустым.
3. Объём: строго 1–2 лаконичных, атмосферных предложения.`;

    const prompt = `МИР: ${worldTitle}
ЛОКАЦИЯ: ${location}
ГЕРОИ: ${protagonist} ${companion ? `(Спутник в сцене: ${companion})` : '(Спутника рядом нет)'}
ЗДОРОВЬЕ: ${stats.health || 100}%, РАССУДОК: ${stats.sanity || 100}%
ИНВЕНТАРЬ: ${inventory.join(', ') || 'пусто'}

${previousSensoryWarnings ? `НЕ ПОВТОРЯТЬ ЭТИ ОБРАЗЫ И ФРАЗЫ:\n${previousSensoryWarnings}\n` : ''}

ОСНОВНОЙ ТЕКСТ СЦЕНЫ:
"${sceneText}"

Сгенерируйте новые уникальные ощущения локации (1-2 предложения) и ${companion ? `короткую реплику спутника ${companion}` : 'пустую реплику (спутника нет)'}.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        sensoryDetail: {
          type: Type.STRING,
          description: '1-2 выразительных свежих предложения с акцентом на уникальные микродетали обстановки.',
        },
        companionWhisper: {
          type: Type.STRING,
          description: companion
            ? `Короткая фраза или реакция спутника ${companion}.`
            : 'Пустая строка, так как спутника рядом нет.',
        },
      },
      required: ['sensoryDetail', 'companionWhisper'],
    };

    const modelOrder = resolveTextModels(modelTier);

    const { response, modelUsed } = await generateWithFallback(modelOrder, (model) => ({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
      },
    }));

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      sensoryDetail: parsed.sensoryDetail || '',
      companionWhisper: companion ? parsed.companionWhisper || '' : '',
      modelUsed,
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('Story enrich error:', error);
    res.status(200).json({
      sensoryDetail: 'В воздухе витает напряженная тишина, заставляющая прислушаться к каждому шороху.',
      companionWhisper: '',
      modelUsed: 'fallback',
      latencyMs: 0,
    });
  }
});

function createCinematicSceneIllustration({
  chapterTitle = '',
  location = '',
  playerAction = '',
  consequenceSummary = '',
  narrativeSnippet = '',
  artStylePrompt = '',
  sceneVisualDescription = '',
  presentCharacters = [],
  worldCoverImage = '',
  imageSize = '1K',
  aspectRatio = '16:9',
  turnNumber = 1,
  language = 'ru',
}: {
  chapterTitle?: string;
  location?: string;
  playerAction?: string;
  consequenceSummary?: string;
  narrativeSnippet?: string;
  artStylePrompt?: string;
  sceneVisualDescription?: string;
  presentCharacters?: any[];
  worldCoverImage?: string;
  imageSize?: string;
  aspectRatio?: string;
  turnNumber?: number;
  language?: string;
}) {
  const width = 1280;
  const height = 720;
  const isRu = language === 'ru';

  // Base background artwork selected contextually for depth and location
  const chosenBackdropPath = getBackdropForTurn({
    worldCoverImage,
    location,
    playerAction,
    consequenceSummary,
    turnNumber,
  });
  const base64Backdrop = getImageBase64(chosenBackdropPath);

  // Analyze the chosen action and scene context to synthesize dramatic action VFX
  const actionLower = (playerAction + ' ' + consequenceSummary + ' ' + sceneVisualDescription).toLowerCase();

  const isResonance =
    actionLower.includes('камертон') ||
    actionLower.includes('fork') ||
    actionLower.includes('резонанс') ||
    actionLower.includes('солян') ||
    actionLower.includes('чар') ||
    actionLower.includes('звук') ||
    actionLower.includes('руны');

  const isLanternOrFire =
    actionLower.includes('фонарь') ||
    actionLower.includes('lantern') ||
    actionLower.includes('свет') ||
    actionLower.includes('пламя') ||
    actionLower.includes('огонь') ||
    actionLower.includes('ракета') ||
    actionLower.includes('flare') ||
    actionLower.includes('маяк') ||
    actionLower.includes('сияние');

  const isStealth =
    actionLower.includes('скрыт') ||
    actionLower.includes('парапет') ||
    actionLower.includes('sneak') ||
    actionLower.includes('shadow') ||
    actionLower.includes('тень') ||
    actionLower.includes('обойти') ||
    actionLower.includes('отвлеч') ||
    actionLower.includes('тихо') ||
    actionLower.includes('крад');

  const isCombatOrGuardian =
    actionLower.includes('страж') ||
    actionLower.includes('удар') ||
    actionLower.includes('бой') ||
    actionLower.includes('knight') ||
    actionLower.includes('reeve') ||
    actionLower.includes('меч') ||
    actionLower.includes('клинок') ||
    actionLower.includes('схватк') ||
    actionLower.includes('корсар') ||
    actionLower.includes('атак');

  let glowColor = '#F59E0B';
  let accentColor = '#FDE68A';
  let vfxSvg = '';

  if (isResonance) {
    glowColor = '#38BDF8';
    accentColor = '#A5F3FC';
    vfxSvg = `
      <!-- Resonance Shockwaves & Crystalline Sound Fractures -->
      <circle cx="360" cy="460" r="80" fill="none" stroke="${glowColor}" stroke-width="3" opacity="0.9" filter="url(#glow)"/>
      <circle cx="360" cy="460" r="160" fill="none" stroke="${glowColor}" stroke-width="2" stroke-dasharray="12 8" opacity="0.65"/>
      <circle cx="360" cy="460" r="260" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 10" opacity="0.45"/>
      <circle cx="360" cy="460" r="390" fill="none" stroke="${glowColor}" stroke-width="1" stroke-dasharray="4 14" opacity="0.3"/>
      <!-- Shattering salt wards & sonic fracture lines -->
      <path d="M 360 460 L 520 380 L 680 410 L 840 350 L 980 430" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.8"/>
      <path d="M 360 460 L 480 540 L 620 520 L 760 590" fill="none" stroke="${glowColor}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.7"/>
      <!-- Glowing Ancient Runes Awakening in Air -->
      <g fill="${accentColor}" font-family="'Cinzel', Georgia, serif" font-size="22" opacity="0.92" filter="url(#glow)">
        <text x="440" y="410">᚛ ᚚ</text>
        <text x="560" y="370">ᛟ ᚱ</text>
        <text x="700" y="390">ᚦ ᚬ</text>
        <text x="820" y="340">ᛉ ᛊ</text>
      </g>
      <!-- Water ripple reflection of resonance -->
      <ellipse cx="640" cy="620" rx="480" ry="40" fill="none" stroke="${glowColor}" stroke-width="2" stroke-dasharray="20 12" opacity="0.5"/>
    `;
  } else if (isLanternOrFire) {
    glowColor = '#10B981';
    accentColor = '#6EE7B7';
    vfxSvg = `
      <!-- Volumetric Light Beam from Tide-Lantern -->
      <polygon points="360,460 1280,180 1280,680" fill="url(#lanternBeamGrad)" opacity="0.48"/>
      <circle cx="360" cy="460" r="110" fill="url(#coreGlowGrad)" opacity="0.9"/>
      <circle cx="360" cy="460" r="230" fill="url(#coreGlowGrad)" opacity="0.45"/>
      <!-- Luminous dispersing embers and sparks -->
      <circle cx="480" cy="420" r="3" fill="#A7F3D0" opacity="0.8" filter="url(#glow)"/>
      <circle cx="560" cy="380" r="4" fill="#FDE68A" opacity="0.9" filter="url(#glow)"/>
      <circle cx="640" cy="460" r="2.5" fill="#6EE7B7" opacity="0.7"/>
      <circle cx="720" cy="390" r="5" fill="#A7F3D0" opacity="0.85" filter="url(#glow)"/>
      <circle cx="840" cy="440" r="3" fill="#FDE68A" opacity="0.75"/>
      <circle cx="960" cy="360" r="4" fill="#6EE7B7" opacity="0.8"/>
      <!-- Parted mist rays slicing through the dark -->
      <line x1="360" y1="460" x2="1100" y2="280" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="10 20" opacity="0.5"/>
      <line x1="360" y1="460" x2="1240" y2="490" stroke="${glowColor}" stroke-width="1.5" stroke-dasharray="14 16" opacity="0.4"/>
    `;
  } else if (isStealth) {
    glowColor = '#818CF8';
    accentColor = '#C7D2FE';
    vfxSvg = `
      <!-- Moonlit Chiaroscuro & Searching Torchbeams Below -->
      <polygon points="980,640 600,690 920,440" fill="url(#searchlightGrad)" opacity="0.32"/>
      <!-- Mist banks swirling over the parapet -->
      <path d="M 0 540 Q 320 480 640 520 T 1280 490 L 1280 720 L 0 720 Z" fill="rgba(15, 23, 42, 0.72)"/>
      <!-- Parapet stone ledge silhouette -->
      <rect x="0" y="520" width="540" height="20" fill="#0B0F17" stroke="${glowColor}" stroke-width="1" opacity="0.8"/>
      <rect x="0" y="540" width="540" height="180" fill="#060A10"/>
      <!-- Stealth action dashes -->
      <path d="M 240 500 Q 360 440 480 500" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="6 6" opacity="0.75"/>
    `;
  } else if (isCombatOrGuardian) {
    glowColor = '#F59E0B';
    accentColor = '#FDE68A';
    vfxSvg = `
      <!-- Colossal Hollow Guardian Silhouette Looming in Right Field -->
      <g opacity="0.94">
        <!-- Giant Helm & Horns -->
        <path d="M 920 220 L 960 180 L 1000 220 L 980 270 L 940 270 Z" fill="#0A0E17" stroke="${accentColor}" stroke-width="1.5"/>
        <!-- Visor slit glowing amber -->
        <line x1="945" y1="235" x2="975" y2="235" stroke="#F59E0B" stroke-width="3" filter="url(#glow)"/>
        <!-- Colossal Shoulders & Barnacle-crusted Pauldrons -->
        <path d="M 880 280 L 960 250 L 1040 280 L 1090 380 L 960 420 L 830 380 Z" fill="#070A12" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.5"/>
        <!-- Massive Greatsword / Lead Ledger held aloft -->
        <path d="M 1040 240 L 1080 120 L 1120 130 L 1070 260 Z" fill="#0F172A" stroke="${accentColor}" stroke-width="2"/>
      </g>
      <!-- Spark Explosion at Point of Clash -->
      <circle cx="680" cy="440" r="14" fill="#FFFBEB" filter="url(#glow)"/>
      <line x1="680" y1="440" x2="600" y2="390" stroke="#FDE68A" stroke-width="2.5"/>
      <line x1="680" y1="440" x2="740" y2="370" stroke="#F59E0B" stroke-width="3"/>
      <line x1="680" y1="440" x2="760" y2="480" stroke="#EF4444" stroke-width="2.5"/>
      <line x1="680" y1="440" x2="620" y2="500" stroke="#FDE68A" stroke-width="2"/>
      <!-- Action kinetic diagonal lines -->
      <line x1="200" y1="620" x2="800" y2="320" stroke="rgba(254, 240, 138, 0.18)" stroke-width="8"/>
      <!-- Water splash foam -->
      <ellipse cx="680" cy="560" rx="90" ry="16" fill="rgba(255, 255, 255, 0.28)"/>
    `;
  } else {
    vfxSvg = `
      <!-- Ambient Torchlight & Luminous Mystery Particles -->
      <circle cx="360" cy="460" r="140" fill="url(#coreGlowGrad)" opacity="0.7"/>
      <ellipse cx="640" cy="580" rx="420" ry="30" fill="none" stroke="${glowColor}" stroke-width="1.5" stroke-dasharray="14 10" opacity="0.45"/>
    `;
  }

  // Protagonist & Companion Silhouettes in Action Posture
  const heroSilhouetteSvg = `
    <!-- Protagonist Action Silhouette (Left Causeway) -->
    <g transform="translate(290, 360)">
      <!-- Billowing cloak -->
      <path d="M 50 180 Q 20 140 10 200 L 40 260 L 90 260 L 80 180 Z" fill="#060911" opacity="0.95"/>
      <!-- Body & Brigandine -->
      <path d="M 45 90 L 85 90 L 95 180 L 40 180 Z" fill="#080C16" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1"/>
      <!-- Head & Wind-swept hair -->
      <circle cx="65" cy="65" r="18" fill="#0B0F19"/>
      <path d="M 50 60 Q 40 45 75 50 Q 85 65 75 75 Z" fill="#060911"/>
      <!-- Arm extending with active relic/weapon -->
      <line x1="75" y1="105" x2="115" y2="95" stroke="#0B0F19" stroke-width="8" stroke-linecap="round"/>
      <!-- Focal point glow -->
      <circle cx="118" cy="95" r="10" fill="${glowColor}" filter="url(#glow)"/>
    </g>
    <!-- Companion Silhouette slightly behind -->
    <g transform="translate(210, 390)" opacity="0.85">
      <path d="M 35 70 Q 25 150 15 220 L 75 220 L 65 140 Z" fill="#05070D"/>
      <circle cx="50" cy="50" r="14" fill="#070A12"/>
      <circle cx="56" cy="48" r="3" fill="none" stroke="${accentColor}" stroke-width="1"/>
    </g>
  `;

  // Safe text escaping
  const cleanAction = (playerAction || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .slice(0, 130);

  const cleanConsequence = (consequenceSummary || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .slice(0, 150);

  const cleanChapter = (chapterTitle || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 50);

  const cleanLocation = (location || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 40);

  const characterNames = escapeXml(
    (presentCharacters || [])
      .map((c) => c.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(' · ')
  );
  const safeImageSize = escapeXml(String(imageSize || '1K'));

  const actionPrefix = isRu ? 'ДЕЙСТВИЕ ИГРОКА:' : 'PLAYER ACTION:';
  const consequencePrefix = isRu ? 'ПОСЛЕДСТВИЕ:' : 'CONSEQUENCE:';
  const presencePrefix = isRu ? 'В сцене:' : 'Present:';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#05070D" />
        <stop offset="60%" stop-color="#0A101D" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
      <radialGradient id="coreGlowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.9" />
        <stop offset="50%" stop-color="${glowColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${glowColor}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="lanternBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.75" />
        <stop offset="40%" stop-color="${accentColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${glowColor}" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="searchlightGrad" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F59E0B" />
        <stop offset="50%" stop-color="#FDE68A" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(11, 15, 23, 0.94)" />
        <stop offset="100%" stop-color="rgba(7, 10, 16, 0.98)" />
      </linearGradient>
      <radialGradient id="vignette" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="transparent" />
        <stop offset="70%" stop-color="rgba(5, 7, 12, 0.45)" />
        <stop offset="100%" stop-color="rgba(2, 4, 8, 0.88)" />
      </radialGradient>
    </defs>

    <!-- LAYER 1: Base Hand-Crafted Master Painting (from campaign library) -->
    ${
      base64Backdrop
        ? `<image href="${base64Backdrop}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="0.94" />`
        : `<rect width="${width}" height="${height}" fill="url(#skyGrad)" />`
    }

    <!-- LAYER 2: Cinematic Atmospheric Chiaroscuro Wash -->
    <rect width="${width}" height="${height}" fill="url(#vignette)" />
    <rect width="${width}" height="${height}" fill="rgba(5, 8, 15, 0.28)" mix-blend-mode="multiply" />

    <!-- LAYER 3: Dynamic Action VFX based on chosen player choice -->
    ${vfxSvg}

    <!-- LAYER 4: Dynamic Character Silhouettes in Action Posture -->
    ${heroSilhouetteSvg}

    <!-- LAYER 5: Ornate RPG Grimoire Borders and Corner Filigree -->
    <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="url(#goldFiligree)" stroke-width="1.5" opacity="0.65" />
    <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    
    <!-- Corner Diamonds -->
    <polygon points="20,20 28,14 36,20 28,26" fill="#F59E0B" />
    <polygon points="${width - 20},20 ${width - 28},14 ${width - 36},20 ${width - 28},26" fill="#F59E0B" />
    <polygon points="20,${height - 20} 28,${height - 26} 36,${height - 20} 28,${height - 14}" fill="#F59E0B" />
    <polygon points="${width - 20},${height - 20} ${width - 28},${height - 26} ${width - 36},${height - 20} ${width - 28},${height - 14}" fill="#F59E0B" />

    <!-- TOP CINEMATIC LOCATION STAMP -->
    <g font-family="'Cinzel', Georgia, serif">
      <rect x="44" y="38" width="380" height="32" rx="4" fill="rgba(11, 15, 23, 0.85)" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1"/>
      <text x="56" y="59" fill="#FDE68A" font-size="13" font-weight="600" letter-spacing="1.5">
        ${cleanLocation.toUpperCase()}
      </text>
      <text x="410" y="59" text-anchor="end" fill="#94A3B8" font-size="11" font-family="'JetBrains Mono', monospace">
        ${cleanChapter}
      </text>
    </g>

    <!-- BOTTOM CINEMATIC ACTION & CONSEQUENCE HUD -->
    <g transform="translate(44, ${height - 132})">
      <!-- Dark Frosted Plate with Gold Border -->
      <rect width="${width - 88}" height="96" rx="8" fill="url(#cardGrad)" stroke="url(#goldFiligree)" stroke-width="1.2" opacity="0.96" />
      
      <!-- Top Action Line -->
      <g transform="translate(20, 26)">
        <text fill="${accentColor}" font-size="11" font-weight="700" font-family="'JetBrains Mono', monospace" letter-spacing="1.5">
          ${actionPrefix}
        </text>
        <text x="145" y="0" fill="#F1EFEA" font-size="14" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif">
          «${cleanAction || 'Действие меняет ткань летописи...'}»
        </text>
      </g>

      <!-- Bottom Consequence Line -->
      <g transform="translate(20, 56)">
        <text fill="#F59E0B" font-size="11" font-weight="700" font-family="'JetBrains Mono', monospace" letter-spacing="1.5">
          ${consequencePrefix}
        </text>
        <text x="145" y="0" fill="#E2E8F0" font-size="13.5" font-family="'Lora', Georgia, serif" font-style="italic">
          «${cleanConsequence || 'События разворачиваются под влиянием вашего решения.'}»
        </text>
      </g>

      <!-- Right Metadata Tag -->
      <g transform="translate(${width - 108}, 26)" text-anchor="end">
        <text fill="#34D399" font-size="11" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500">
          ${presencePrefix} ${characterNames || 'Герой'}
        </text>
        <text y="30" fill="#94A3B8" font-size="10" font-family="'JetBrains Mono', monospace">
          ${safeImageSize} · ART CONTINUITY
        </text>
      </g>
    </g>
  </svg>`;

  return svg;
}

// 2a. Dynamic Cinematic Scene Illustration Endpoint
app.get('/api/scene-image/:id', (req, res) => {
  const { id } = req.params;
  const cachedSvg = sceneImageCache.get(id);
  if (cachedSvg) {
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cachedSvg);
  }

  // Graceful on-demand synthesis if ID was not in in-memory cache
  const {
    chapter = 'Глава',
    location = 'Затопленная цитадель Велена',
    action = '',
    consequence = '',
    worldCoverImage = '',
    turn = '2',
    lang = 'ru',
  } = req.query as Record<string, string>;

  const generatedSvg = createCinematicSceneIllustration({
    chapterTitle: chapter,
    location,
    playerAction: action,
    consequenceSummary: consequence,
    worldCoverImage,
    turnNumber: Number(turn) || 2,
    language: lang,
  });

  setSceneImageCache(id, generatedSvg);
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(generatedSvg);
});

// 2. Real-time Consistent Image Generation
app.post(['/api/image/generate', '/api/scene-art/generate'], async (req, res) => {
  const startTime = Date.now();
  const {
    artStylePrompt = '',
    sceneVisualDescription = '',
    presentCharacters = [],
    imageSize = '1K',
    aspectRatio = '16:9',
    chapterTitle = '',
    location = '',
    playerAction = '',
    consequenceSummary = '',
    worldCoverImage = '',
    language = 'ru',
  } = req.body || {};

  const validSize: '1K' | '2K' | '4K' =
    imageSize === '2K' || imageSize === '4K' ? imageSize : '1K';

  const characterContinuityBlock =
    presentCharacters.length > 0
      ? `CHARACTER CONTINUITY LOCK (depict these exact character designs consistently): ` +
        presentCharacters
          .map((c: any) => `${c.name}: ${c.visualDescriptor}`)
          .join(' | ')
      : '';

  const fullVisualPrompt = [
    `MASTER ART STYLE: ${artStylePrompt}.`,
    characterContinuityBlock,
    `SCENE COMPOSITION: ${sceneVisualDescription}.`,
    `ACTION OCCURRING: ${playerAction}.`,
    `No text, no watermarks, no UI frames. Consistent character faces and attire.`,
  ]
    .filter(Boolean)
    .join(' ');

  try {
    const modelsToTry = ['gemini-2.5-flash-image'];

    const { response, modelUsed } = await generateWithFallback(
      modelsToTry,
      (model) => ({
        model,
        contents: {
          parts: [{ text: fullVisualPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio,
          },
        },
      }),
      true
    );

    let imageUrl: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('No image data returned from model.');
    }

    res.json({
      imageUrl,
      promptUsed: fullVisualPrompt,
      imageSize: validSize,
      modelUsed,
      isQuotaFallback: false,
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    const isQuotaExceeded =
      error?.status === 429 ||
      error?.code === 429 ||
      String(error?.message || '').includes('429') ||
      String(error?.message || '').includes('RESOURCE_EXHAUSTED') ||
      String(error?.message || '').includes('quota');

    console.warn(
      `Image generation API unavailable (Quota / Rate Limit: ${isQuotaExceeded}). Generating rich cinematic action illustration.`
    );

    const sceneId = `scene-repaint-${Date.now().toString(36)}`;
    const fallbackSvg = createCinematicSceneIllustration({
      chapterTitle,
      location,
      playerAction,
      consequenceSummary,
      artStylePrompt,
      sceneVisualDescription,
      presentCharacters,
      worldCoverImage,
      imageSize: validSize,
      aspectRatio,
      turnNumber: 2,
      language,
    });
    setSceneImageCache(sceneId, fallbackSvg);

    res.json({
      imageUrl: `/api/scene-image/${sceneId}?v=${Date.now()}`,
      promptUsed: fullVisualPrompt,
      imageSize: validSize,
      modelUsed: 'cinematic-action-canvas',
      isQuotaFallback: true,
      quotaMessage:
        language === 'ru'
          ? 'Художественная иллюстрация создана на основе вашего действия и мастера-стиля кампании (квота бесплатного уровня Gemini Image исчерпана).'
          : 'Cinematic illustration composed from your chosen action and master campaign style (free-tier Gemini Image quota exhausted).',
      latencyMs: Date.now() - startTime,
    });
  }
});

// 2b. Item & Relic Visual Art Generation / Retrieval
const itemArtCache = new Map<string, string>();

app.post('/api/item-art', async (req, res) => {
  const startTime = Date.now();
  try {
    const { itemId, name, description, category, rarity = 'relic', artStylePrompt } = req.body;
    const cacheKey = itemId || name;
    if (cacheKey && itemArtCache.has(cacheKey)) {
      return res.json({
        imageUrl: itemArtCache.get(cacheKey),
        cached: true,
        latencyMs: Date.now() - startTime,
      });
    }

    const itemVisualPrompt = `Masterpiece dark fantasy RPG icon of item "${name}". Category: ${category}. Rarity: ${rarity}. Description: ${description}.${
      artStylePrompt ? ` Art style: ${artStylePrompt}.` : ''
    } Dark chiaroscuro, centered object on dark textured background, ornate detailing, volumetric magical lighting, no text, no interface frames, square composition.`;

    try {
      const modelsToTry = ['gemini-2.5-flash-image'];

      const { response, modelUsed } = await generateWithFallback(
        modelsToTry,
        (model) => ({
          model,
          contents: {
            parts: [{ text: itemVisualPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
            },
          },
        }),
        true
      );

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          if (cacheKey) itemArtCache.set(cacheKey, imageUrl);
          return res.json({
            imageUrl,
            modelUsed,
            isQuotaFallback: false,
            latencyMs: Date.now() - startTime,
          });
        }
      }
    } catch (_err) {
      // Fallback handled below
    }

    res.json({
      imageUrl: null,
      isQuotaFallback: true,
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    res.status(200).json({ imageUrl: null, isQuotaFallback: true, latencyMs: Date.now() - startTime });
  }
});

// 3. Low-Latency Responses with gemini-2.5-flash-lite ("Sixth Sense" & Instant Item/Choice Intuition)
app.post('/api/instinct/quick', async (req, res) => {
  const startTime = Date.now();
  try {
    if (Date.now() < textQuotaCooldownUntil) {
      return res.status(200).json({
        insight: 'Интуиция молчит — тени вокруг слишком густы.',
        modelUsed: 'fallback',
        latencyMs: 0,
      });
    }

    const {
      mode,
      targetName,
      sceneNarrative,
      location,
      questObjective,
      inventoryNames = [],
      language = 'ru',
    } = req.body;

    const isRu = language === 'ru';
    const ai = getGenAI();
    let prompt = '';
    if (mode === 'item_use') {
      prompt = `Current Location: ${location}. Quest: ${questObjective}. Scene: "${sceneNarrative}".
In 2 sharp, atmospheric sentences ${isRu ? 'in RUSSIAN' : ''}, suggest a clever, unexpected way the player can use their inventory item "${targetName}" right now to alter the plot, and state a concrete action command they can trigger.`;
    } else if (mode === 'choice_preview') {
      prompt = `Current Location: ${location}. Scene: "${sceneNarrative}".
The player is considering: "${targetName}". In 2 crisp sentences ${isRu ? 'in RUSSIAN' : ''}, give a low-latency Sixth Sense intuition about the hidden risk and potential reward of this move.`;
    } else {
      prompt = `Current Location: ${location}. Quest: ${questObjective}. Inventory: ${inventoryNames.join(', ')}. Scene: "${sceneNarrative}".
Give a rapid 2-sentence "Sixth Sense" tactical scan ${isRu ? 'in RUSSIAN' : ''} uncovering one subtle environmental detail or leverage point the player can exploit right now.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: isRu
          ? 'Вы — мгновенное шестое чувство игрока в текстовом квесте. Отвечайте на чистом, образном, лаконичном русском языке (до 45 слов).'
          : 'You are the player’s instant Sixth Sense instinct in an interactive adventure game. Be razor-sharp, atmospheric, and concise (max 45 words).',
      },
    });

    res.json({
      insight: response.text || 'Интуиция молчит — тени вокруг слишком густы.',
      modelUsed: 'gemini-2.5-flash-lite',
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    const isQuotaError =
      error?.status === 429 ||
      error?.code === 429 ||
      String(error?.message || '').includes('429') ||
      String(error?.message || '').includes('RESOURCE_EXHAUSTED') ||
      String(error?.message || '').toLowerCase().includes('quota');
    if (isQuotaError) {
      textQuotaCooldownUntil = Date.now() + 60000;
    }
    console.error('Quick instinct error:', error);
    res.status(200).json({
      insight: 'Интуиция молчит — тени вокруг слишком густы.',
      modelUsed: 'fallback',
      latencyMs: 0,
    });
  }
});

// 4. Multi-Turn Gemini Chatbot ("The Chronicler & Lore Oracle")
app.post('/api/oracle/chat', async (req, res) => {
  const startTime = Date.now();
  const { modelTier = 'gemini-2.5-flash' } = req.body || {};
  try {
    if (Date.now() < textQuotaCooldownUntil) {
      return res.status(200).json({
        reply: 'Связь с эфиром временно нарушена магическим штормом (достигнут лимит запросов API). Подожди минуту и спроси снова.',
        modelUsed: 'fallback',
        requestedTier: modelTier,
        latencyMs: 0,
      });
    }

    const {
      message,
      history = [],
      worldContext,
      language = 'ru',
    } = req.body;

    const isRu = language === 'ru';
    const roleDescriptionsRu: Record<string, string> = {
      'gemini-2.5-flash':
        'Вы — Спутник-летописец, внимательный спутник главного героя. Обсуждайте события, поддерживайте атмосферный диалог от лица спутника и помогайте связать улики из инвентаря с текущим заданием.',
      'gemini-3.5-flash':
        'Вы — Спутник-летописец, внимательный спутник главного героя. Обсуждайте события, поддерживайте атмосферный диалог от лица спутника и помогайте связать улики из инвентаря с текущим заданием.',
      'gemini-2.5-flash-lite':
        'Вы — Тактический шёпот, мгновенный внутренний голос героя. Давайте быстрые, точные, лаконичные тактические советы и подсказки в 1–3 ёмких предложениях.',
      'gemini-3.1-flash-lite':
        'Вы — Тактический шёпот, мгновенный внутренний голос героя. Давайте быстрые, точные, лаконичные тактические советы и подсказки в 1–3 ёмких предложениях.',
      'gemini-3.1-pro-preview':
        'Вы — Верховный Хранитель Летописи. Глубоко анализируйте мотивы фракций, скрытые символические связи, древние реликвии и тонкие последствия решений героя.',
    };

    const roleDescriptionsEn: Record<string, string> = {
      'gemini-2.5-flash':
        'You are the Chronicler Companion — an observant in-world scribe travelling alongside the protagonist. Discuss characters, recap events, roleplay in-character banter, and help connect inventory clues to the current quest.',
      'gemini-3.5-flash':
        'You are the Chronicler Companion — an observant in-world scribe travelling alongside the protagonist. Discuss characters, recap events, roleplay in-character banter, and help connect inventory clues to the current quest.',
      'gemini-2.5-flash-lite':
        'You are the Tactical Whisper — an ultra-fast inner instinct delivering immediate, punchy, low-latency tactical answers and quick survival tips in 1-3 short sentences.',
      'gemini-3.1-flash-lite':
        'You are the Tactical Whisper — an ultra-fast inner instinct delivering immediate, punchy, low-latency tactical answers and quick survival tips in 1-3 short sentences.',
      'gemini-3.1-pro-preview':
        'You are the Arch-Chronicler — deeply analyzing faction motives, ancient lore connections, relic secrets, and subtle consequences of the hero’s choices.',
    };

    const roleMap = isRu ? roleDescriptionsRu : roleDescriptionsEn;
    const systemInstruction = `${
      roleMap[modelTier] || roleMap['gemini-2.5-flash']
    }

CURRENT ADVENTURE STATE:
- World: ${worldContext?.worldTitle} (${worldContext?.worldGenre})
- Current Location: ${worldContext?.location}
- Active Quest: ${worldContext?.questTitle} — ${worldContext?.questObjective}
- Inventory: ${(worldContext?.inventory || []).map((i: any) => `${i.name} (${i.category})`).join(', ') || 'None'}
- Known Characters: ${(worldContext?.characters || []).map((c: any) => `${c.name} [${c.role}, ${c.disposition}]`).join(', ')}
- Latest Scene: ${worldContext?.latestNarrative || ''}

${isRu ? 'ОТВЕЧАЙТЕ НА КРАСИВОМ, ГРАМОТНОМ И ЛИТЕРАТУРНОМ РУССКОМ ЯЗЫКЕ.' : 'Respond in clear, immersive English.'}
Stay grounded in the player's actual story state, inventory, and characters.`;

    const fallbackChain = resolveTextModels(modelTier);

    const ai = getGenAI();
    let replyText = '';
    let actualModelUsed = modelTier;

    // Sanitize chat history: drop leading model greeting and avoid duplicating current user message
    const rawHistory = (Array.isArray(history) ? history : [])
      .filter((h: any) => h && typeof h.text === 'string' && h.text.trim().length > 0)
      .map((h: any) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      }));
    while (rawHistory.length > 0 && rawHistory[0].role !== 'user') {
      rawHistory.shift();
    }
    if (
      rawHistory.length > 0 &&
      rawHistory[rawHistory.length - 1].role === 'user' &&
      rawHistory[rawHistory.length - 1].parts[0].text.trim() === String(message || '').trim()
    ) {
      rawHistory.pop();
    }
    const formattedHistory = rawHistory;

    for (const candidateModel of fallbackChain) {
      try {
        const chat = ai.chats.create({
          model: candidateModel,
          history: formattedHistory,
          config: {
            systemInstruction,
          },
        });

        const result = await chat.sendMessage({ message });
        replyText = result.text || '';
        actualModelUsed = candidateModel;
        break;
      } catch (err: any) {
        const isQuotaError =
          err?.status === 429 ||
          err?.code === 429 ||
          String(err?.message || '').includes('429') ||
          String(err?.message || '').includes('RESOURCE_EXHAUSTED') ||
          String(err?.message || '').toLowerCase().includes('quota');

        if (isQuotaError) {
          textQuotaCooldownUntil = Date.now() + 60000;
          console.warn(`Oracle chat quota hit on ${candidateModel}, setting 60s cooldown.`);
          break;
        }
        console.warn(`Chat model ${candidateModel} failed, trying fallback...`);
      }
    }

    if (!replyText) {
      return res.status(200).json({
        reply: 'Связь с эфиром временно нарушена магическим штормом (достигнут лимит запросов API). Подожди минуту и спроси снова.',
        modelUsed: 'fallback',
        requestedTier: modelTier,
        latencyMs: 0,
      });
    }

    res.json({
      reply: replyText,
      modelUsed: actualModelUsed,
      requestedTier: modelTier,
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('Oracle chat error:', error);
    res.status(200).json({
      reply: 'Связь с эфиром временно нарушена магическим штормом (достигнут лимит запросов API). Подожди минуту и спроси снова.',
      modelUsed: 'fallback',
      requestedTier: modelTier,
      latencyMs: 0,
    });
  }
});

// All 105 canonical scene IDs across the 3 worlds
const KNOWN_WORLD_SCENES: Record<string, string[]> = {
  vaelen: [
    'v_causeway_entrance', 'v_weeping_cloisters', 'v_sunken_belltower', 'v_causeway_illuminated',
    'v_parapet_ambush', 'v_ghoul_nest_loot', 'v_sluice_antechamber', 'v_coral_catacombs',
    'v_salt_mine_shaft', 'v_abyssal_observatory', 'v_salt_chapel', 'v_chapel_blessing',
    'v_chapel_memory_vision', 'v_pump_mechanism', 'v_scriptorium_entry', 'v_drowned_scriptorium_depths',
    'v_forgotten_crypt', 'v_scriptorium_codex', 'v_scriptorium_reliquary', 'v_abyssal_chasm',
    'v_sentinel_combat', 'v_sentinel_relic_choice', 'v_sentinel_relic_lantern', 'v_sentinel_relic_fork',
    'v_sentinel_sacrifice', 'v_inner_sanctum_approach', 'v_astrolabe_dais', 'v_ending_tide_lord',
    'v_ending_dam_break', 'v_ending_seal_ward', 'v_ending_defeat_hp', 'v_ending_defeat_sanity',
    'v_prologue_salt_vault', 'v_prologue_crossing', 'v_gate_echo_oyvin', 'v_cloister_mara',
    'v_tidewarden_barracks', 'v_memory_market', 'v_camp_salt_fire', 'v_observatory_star',
    'v_chapel_isolde', 'v_scriptorium_truth', 'v_sera_confession', 'v_scriptorium_archives',
    'v_bridge_eve', 'v_sentinel_recall', 'v_sentinel_defeated', 'v_throne_prima',
    'v_king_echo', 'v_ending_return', 'v_ending_new_sentinel',
  ],
  vespera: [
    'vesp_workshop_scene', 'vesp_corpse_clues', 'vesp_vent_trail', 'vesp_decoded_telegram',
    'vesp_catacombs_entry', 'vesp_guards_firefight', 'vesp_steam_valve_puzzle', 'vesp_inquisitor_chamber',
    'vesp_inquisitor_combat', 'vesp_inquisitor_chronometer', 'vesp_inquisitor_whistle', 'vesp_inquisitor_sacrifice',
    'vesp_cathedral_dais', 'vesp_ending_justice', 'vesp_ending_architect', 'vesp_ending_sabotage',
    'vesp_ending_defeat_hp', 'vesp_ending_defeat_sanity',
  ],
  astral: [
    'astral_deck_scene', 'astral_whale_graveyard', 'astral_plasma_dive', 'astral_crystal_salvage',
    'astral_spire_approach', 'astral_spire_aligned', 'astral_gates_leviathan', 'astral_leviathan_combat',
    'astral_leviathan_prism', 'astral_leviathan_shard', 'astral_leviathan_sacrifice', 'astral_beacon_dais',
    'astral_ending_beacon', 'astral_ending_merge', 'astral_ending_constellations', 'astral_ending_defeat_hp',
    'astral_ending_defeat_sanity', 'astral_prologue_harbor', 'astral_prologue_crew', 'astral_aurora_drift',
    'astral_whale_song', 'astral_lotus_arrival', 'astral_lotus_feast', 'astral_lotus_dream',
    'astral_siren_strait', 'astral_admiral_ambush', 'astral_selestia_garden', 'astral_observatory_truth',
    'astral_orion_confession', 'astral_leviathan_truth', 'astral_gates_beyond', 'astral_admiral_final',
    'astral_beacon_ascent', 'astral_ending_return', 'astral_ending_fleet', 'astral_ending_free_sky',
  ],
};

// Helper: updates public/scenes/manifest.json in format {"scenes": {"<id>": <timestamp>}}
function updateManifestWithScene(sceneId: string): { version: number; totalReady: number } {
  const scenesDir = path.resolve(__dirname, 'public', 'scenes');
  if (!fs.existsSync(scenesDir)) {
    fs.mkdirSync(scenesDir, { recursive: true });
  }
  const manifestPath = path.resolve(scenesDir, 'manifest.json');
  let scenesDict: Record<string, number> = {};

  if (fs.existsSync(manifestPath)) {
    try {
      const raw = fs.readFileSync(manifestPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const id of parsed) {
          if (typeof id === 'string' && id.trim()) scenesDict[id.trim()] = 1;
        }
      } else if (parsed?.scenes) {
        if (Array.isArray(parsed.scenes)) {
          for (const id of parsed.scenes) {
            if (typeof id === 'string' && id.trim()) scenesDict[id.trim()] = 1;
          }
        } else if (typeof parsed.scenes === 'object') {
          for (const [id, ver] of Object.entries(parsed.scenes)) {
            if (typeof id === 'string' && id.trim()) {
              scenesDict[id.trim()] = typeof ver === 'number' ? ver : 1;
            }
          }
        }
      }
    } catch {
      scenesDict = {};
    }
  }

  const version = Date.now();
  scenesDict[sceneId] = version;
  fs.writeFileSync(manifestPath, JSON.stringify({ scenes: scenesDict }, null, 2), 'utf8');

  return { version, totalReady: Object.keys(scenesDict).length };
}

// Dev Studio: Scene Art generation endpoint
app.post('/api/dev/scene-art', async (req, res) => {
  const isDevArt = process.env.DEV_ART === '1' || process.env.NODE_ENV !== 'production';
  if (!isDevArt) {
    return res.status(403).json({ error: 'Dev art generation disabled in production' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(401).json({
      error: 'AUTH_ERROR',
      reason: 'no_api_key',
      message: 'Нет рабочего ключа Gemini',
    });
  }

  const { worldId, sceneId, prompt, worldCoverImage } = req.body || {};

  if (!sceneId || typeof sceneId !== 'string' || !/^[a-z0-9_]+$/.test(sceneId)) {
    return res.status(400).json({ error: 'Invalid sceneId: only [a-z0-9_] allowed' });
  }

  const allKnownScenes = Object.values(KNOWN_WORLD_SCENES).flat();
  const worldScenes = worldId && KNOWN_WORLD_SCENES[worldId] ? KNOWN_WORLD_SCENES[worldId] : allKnownScenes;
  if (!worldScenes.includes(sceneId)) {
    return res.status(400).json({ error: `Scene '${sceneId}' does not exist in world '${worldId || 'any'}'` });
  }

  const parts: any[] = [];

  // Pass world cover image as style reference if provided and safely confined to public/
  if (worldCoverImage && typeof worldCoverImage === 'string') {
    try {
      const publicDir = path.resolve(__dirname, 'public');
      const cleanPath = worldCoverImage.split('?')[0].replace(/^\/+/, '');
      const coverPath = path.resolve(publicDir, cleanPath);
      if (coverPath.startsWith(publicDir + path.sep) && fs.existsSync(coverPath) && fs.statSync(coverPath).isFile()) {
        const buf = fs.readFileSync(coverPath);
        const ext = path.extname(coverPath).toLowerCase();
        const mime =
          ext === '.png'
            ? 'image/png'
            : ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : 'image/webp';
        parts.push({
          inlineData: {
            data: buf.toString('base64'),
            mimeType: mime,
          },
        });
      }
    } catch (err) {
      console.warn('[Dev Scene Art] Cover read error:', err);
    }
  }

  const resolvedPrompt =
    prompt ||
    SCENE_IMAGE_PROMPTS[sceneId] ||
    `Cinematic illustration for scene ${sceneId}. Wide cinematic 16:9 composition, no text, no watermark, no UI frames.`;

  const promptText = parts.length > 0
    ? `Style reference image provided above. Maintain artistic medium, lighting, color palette and atmosphere from reference image. Scene description: ${resolvedPrompt}`
    : resolvedPrompt;

  parts.push({ text: promptText });

  try {
    const { response, modelUsed } = await generateWithFallback(
      ['gemini-2.5-flash-image'],
      (model) => ({
        model,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
          },
        },
      }),
      true
    );

    let rawImageBase64: string | null = null;
    const resParts = response.candidates?.[0]?.content?.parts || [];
    for (const p of resParts) {
      if (p.inlineData?.data) {
        rawImageBase64 = p.inlineData.data;
        break;
      }
    }

    if (!rawImageBase64) {
      throw new Error('No image returned from Gemini');
    }

    const inputBuffer = Buffer.from(rawImageBase64, 'base64');
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const scenesDir = path.resolve(__dirname, 'public', 'scenes');
    if (!fs.existsSync(scenesDir)) {
      fs.mkdirSync(scenesDir, { recursive: true });
    }

    const targetFile = path.resolve(scenesDir, `${sceneId}.webp`);
    fs.writeFileSync(targetFile, webpBuffer);

    const { version, totalReady } = updateManifestWithScene(sceneId);

    return res.json({
      success: true,
      sceneId,
      version,
      url: `/scenes/${sceneId}.webp?v=${version}`,
      modelUsed,
      totalReady,
    });
  } catch (error: any) {
    console.error(`[Dev Scene Art Error] ${sceneId}:`, error?.message || error);

    const isAuthError =
      error?.status === 401 ||
      error?.status === 403 ||
      error?.code === 401 ||
      error?.code === 403 ||
      String(error?.message || '').includes('API_KEY') ||
      String(error?.message || '').includes('UNAUTHENTICATED') ||
      String(error?.message || '').includes('PERMISSION_DENIED');

    if (isAuthError) {
      return res.status(401).json({
        error: 'AUTH_ERROR',
        reason: 'auth_failed',
        message: 'Нет рабочего ключа Gemini',
      });
    }

    const isQuotaExceeded =
      error?.status === 429 ||
      error?.code === 429 ||
      String(error?.message || '').includes('429') ||
      String(error?.message || '').includes('RESOURCE_EXHAUSTED') ||
      String(error?.message || '').toLowerCase().includes('quota');

    if (isQuotaExceeded) {
      return res.status(429).json({
        error: 'RESOURCE_EXHAUSTED',
        reason: 'quota',
        message: 'Превышена квота запросов Gemini API',
      });
    }

    return res.status(500).json({
      error: 'GENERATION_FAILED',
      message: error?.message || 'Failed to generate scene art',
    });
  }
});

// Dev Studio: Manual Scene Art upload endpoint
app.post('/api/dev/scene-art/upload', async (req, res) => {
  const isDevArt = process.env.DEV_ART === '1' || process.env.NODE_ENV !== 'production';
  if (!isDevArt) {
    return res.status(403).json({ error: 'Dev art upload disabled in production' });
  }

  const { worldId, sceneId, fileBase64 } = req.body || {};

  if (!sceneId || typeof sceneId !== 'string' || !/^[a-z0-9_]+$/.test(sceneId)) {
    return res.status(400).json({ error: 'Invalid sceneId: only [a-z0-9_] allowed' });
  }

  const allKnownScenes = Object.values(KNOWN_WORLD_SCENES).flat();
  const worldScenes = worldId && KNOWN_WORLD_SCENES[worldId] ? KNOWN_WORLD_SCENES[worldId] : allKnownScenes;
  if (!worldScenes.includes(sceneId)) {
    return res.status(400).json({ error: `Scene '${sceneId}' does not exist in world '${worldId || 'any'}'` });
  }

  if (!fileBase64 || typeof fileBase64 !== 'string') {
    return res.status(400).json({ error: 'Missing fileBase64 image data' });
  }

  try {
    const rawBuffer = Buffer.from(fileBase64.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, ''), 'base64');
    const webpBuffer = await sharp(rawBuffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const scenesDir = path.resolve(__dirname, 'public', 'scenes');
    if (!fs.existsSync(scenesDir)) {
      fs.mkdirSync(scenesDir, { recursive: true });
    }

    const targetFile = path.resolve(scenesDir, `${sceneId}.webp`);
    if (!targetFile.startsWith(scenesDir + path.sep)) {
      return res.status(400).json({ error: 'Invalid scene target path' });
    }
    fs.writeFileSync(targetFile, webpBuffer);

    const { version, totalReady } = updateManifestWithScene(sceneId);

    return res.json({
      success: true,
      sceneId,
      version,
      url: `/scenes/${sceneId}.webp?v=${version}`,
      totalReady,
    });
  } catch (error: any) {
    console.error(`[Dev Scene Art Upload Error] ${sceneId}:`, error?.message || error);
    return res.status(500).json({
      error: 'UPLOAD_FAILED',
      message: error?.message || 'Failed to process uploaded image',
    });
  }
});

// Dev Studio: Download zip of all public/scenes files
app.get('/api/dev/scenes-zip', (_req, res) => {
  const isDevArt = process.env.DEV_ART === '1' || process.env.NODE_ENV !== 'production';
  if (!isDevArt) {
    return res.status(403).json({ error: 'Dev art download disabled in production' });
  }

  const scenesDir = path.resolve(__dirname, 'public', 'scenes');
  if (!fs.existsSync(scenesDir)) {
    fs.mkdirSync(scenesDir, { recursive: true });
  }

  res.attachment('scenes-archive.zip');
  const archive = new ZipArchive({ zlib: { level: 9 } });

  archive.on('error', (err: any) => {
    console.error('[Archive Error]:', err);
    if (!res.headersSent) {
      res.status(500).send({ error: err?.message || 'Archive error' });
    }
  });

  archive.pipe(res);
  archive.directory(scenesDir, 'scenes');
  archive.finalize();
});

async function startServer() {
  const port = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Vaelen Loom server listening on http://0.0.0.0:${port}`);
  });
}

startServer();