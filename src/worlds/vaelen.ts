import { WorldModule } from '../types';
import { ITEM_ILLUSTRATIONS } from '../ui/itemIllustrations';

export const vaelenWorld: WorldModule = {
  id: 'vaelen',
  title: 'Затопленная цитадель Велена',
  subtitle: 'Готическое глубинное тёмное фэнтези',
  genre: 'Dark Fantasy / Eldritch Depths',
  coverImage: '/images/preset_world_eldoria_1791455431121.webp',
  artStyleName: 'Кьяроскуро: чернила и масло гримуара',
  artStylePrompt:
    'masterpiece dark fantasy oil and ink grimoire illustration, heavy chiaroscuro, volumetric gloomy candle and bioluminescent brine glow, intricate gothic filigree, wet black stone, tenebrism, hyperdetailed textures',
  theme: {
    primary: '#D97706',
    accent: '#38BDF8',
    border: 'rgba(217, 119, 6, 0.35)',
    bgOverlay: 'rgba(7, 11, 19, 0.92)',
    fontFamilyTitle: "'Cinzel', Georgia, serif",
    fontFamilyBody: "'Lora', Georgia, serif",
    glowColor: '#38BDF8',
  },
  protagonist: {
    id: 'char-kaylen',
    name: 'Кейлен Вэнс',
    role: 'Рыцарь Отлива',
    affiliation: 'Орден Волнолома',
    disposition: 'Protagonist',
    visualDescriptor:
      'tall scarred inquisitor knight in blackened riveted plate armor with corroded brass pauldrons, ragged damp leather cloak',
    statusNote: 'Помнит день, когда цитадель ушла под воду. Ищет искупления.',
  },
  initialCompanion: {
    id: 'char-sera',
    name: 'Сера Никс',
    role: 'Адептка Соляного Архива',
    affiliation: 'Хранители Шепчущих Вод',
    disposition: 'Loyal',
    visualDescriptor:
      'young pale archivist woman with braided silver-black hair, wearing deep indigo scholar robes embroidered with tidal sigils, silver eye amulet',
    statusNote: 'Слышит шёпот утонувших скрипториев и чувствует приливные течения.',
  },
  initialStats: {
    health: 100,
    maxHealth: 100,
    sanity: 100,
    maxSanity: 100,
  },
  initialAttributes: {
    strength: 14,
    intellect: 11,
    perception: 13,
    charisma: 10,
  },
  endingsList: [
    {
      id: 'v_ending_tide_lord',
      title: 'Владыка Застывших Вод',
      description: 'Кейлен подчиняет силу Астролябии Короля Приливов и возрождает Цитадель Велена из пучины морской.',
      hint: 'Синхронизируйте рассудок с Астролябией при высоком уровне стойкости разума (Sanity >= 40).',
      endingType: 'victory',
      cgUrl: '/images/preset_world_eldoria_1791455431121.webp',
    },
    {
      id: 'v_ending_dam_break',
      title: 'Разрушитель Дамбы',
      description: 'Астролябия сокрушена ударом боевого клевца. Дамба рушится, и пучина смывает проклятие вековых теней.',
      hint: 'Выберите сокрушение Астролябии во имя упокоения павших душ.',
      endingType: 'destruction',
      cgUrl: '/images/preset_world_eldoria_1791453485261.webp',
    },
    {
      id: 'v_ending_seal_ward',
      title: 'Печать Вечного Отлива',
      description: 'Кейлен и Сера объединяют приливный огонь фонаря и соляные глифы, запечатывая бездну навеки.',
      hint: 'Сохраните Приливный Фонарь и созидательный союз с Серой до финала.',
      endingType: 'sacrifice',
      cgUrl: '/images/preset_world_eldoria_1791455431121.webp',
    },
  ],
  chapters: [
    {
      id: 'vaelen_ch1',
      number: 'Глава I',
      title: 'Волнолом Шепчущих Вод',
      startSceneId: 'v_causeway_entrance',
      devPreset: { flags: ['visited_causeway', 'asked_about_eirik'] },
    },
    {
      id: 'vaelen_ch2',
      number: 'Глава II',
      title: 'Механизмы Утонувших',
      startSceneId: 'v_sluice_antechamber',
      devPreset: { flags: ['sluice_opened', 'knows_tide_mechanism', 'oyvin_friend', 'knows_eirik_name'] },
    },
    {
      id: 'vaelen_ch3',
      number: 'Глава III',
      title: 'Шепчущий Скрипторий',
      startSceneId: 'v_scriptorium_entry',
      devPreset: { flags: ['scriptorium_unlocked', 'read_salt_tablets', 'mara_remembered', 'knows_crown_truth', 'knows_archive_plan', 'read_ledger'] },
    },
    {
      id: 'vaelen_ch4',
      number: 'Глава IV',
      title: 'Врата Бездны',
      startSceneId: 'v_abyssal_chasm',
      devPreset: { flags: ['reached_abyss', 'sentinel_awoken', 'shard_lullaby', 'knows_eirik_name'] },
    },
    {
      id: 'vaelen_ch5',
      number: 'Глава V',
      title: 'Сердце Прилива',
      startSceneId: 'v_inner_sanctum_approach',
      devPreset: { flags: ['sentinel_conquered', 'sanctum_unsealed', 'heard_king', 'knows_crown_truth', 'knows_eirik_name'] },
    },
  ],
  initialInventory: [
    {
      id: 'relic-lantern',
      name: 'Погасший приливный фонарь',
      category: 'Relic',
      rarity: 'relic',
      quantity: 1,
      charges: 3,
      maxCharges: 3,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['relic-lantern'],
      description:
        'Древний латунный фонарь, заправленный жиром глубоководного левиафана. Рассеивает морок и водные иллюзии.',
      loreNote:
        'Создан кузнецами первого прилива. Говорят, его лазурное пламя обжигает не плоть, а сокрытую ложь.',
      effectSummary: 'Рассеивает морок и восстанавливает 10 рассудка.',
      acquiredLocation: 'Стартовое снаряжение рыцаря',
      useAction: {
        label: 'Зажечь приливное пламя',
        description: 'Разогнать морок и обнаружить сокрытые знаки в локации (тратит 1 заряд).',
        sanityDelta: 10,
        consumedOnUse: false,
      },
    },
    {
      id: 'relic-tuning-fork',
      name: 'Обсидиановый камертон',
      category: 'Relic',
      rarity: 'relic',
      quantity: 1,
      charges: 2,
      maxCharges: 2,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['relic-tuning-fork'],
      description:
        'Тяжёлый вилообразный жезл из вулканического стекла. При ударе порождает разрушительный акустический резонанс.',
      loreNote:
        'Колебания этого камертона разрушают соляные монолиты и кристаллическую броню древних конструктов.',
      effectSummary: 'Разрушает соляные печати и броню стражей акустическим ударом.',
      acquiredLocation: 'Стартовое снаряжение рыцаря',
      useAction: {
        label: 'Ударить камертоном о камень',
        description: 'Создать акустическую волну, разрушающую преграды и броню стражей.',
        consumedOnUse: false,
      },
    },
    {
      id: 'item-salt-distillate',
      name: 'Флакон дистиллята лунной соли',
      category: 'Consumable',
      rarity: 'rare',
      quantity: 2,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['item-salt-distillate'],
      description:
        'Прозрачная светящаяся жидкость в опечатанной колбе. Очищает кровь от яда солёной гнили и укрепляет рассудок.',
      loreNote:
        'Секретный рецепт Сестёр Соли, добываемый из кристаллизованных слёз приливных духов.',
      effectSummary: '+25 HP, +25 Sanity мгновенно.',
      acquiredLocation: 'Сумка ордена',
      useAction: {
        label: 'Осушить флакон',
        description: 'Восстановить 25 здоровья и 25 рассудка.',
        healthDelta: 25,
        sanityDelta: 25,
        consumedOnUse: true,
      },
    },
    {
      id: 'key-causeway-seal',
      name: 'Печать Волнолома Велена',
      category: 'Key',
      rarity: 'rare',
      quantity: 1,
      illustrationUrl: ITEM_ILLUSTRATIONS['key-causeway-seal'],
      description:
        'Тяжёлая бронзовая пластина с гравировкой переплетённых волн и гербом павшего короля.',
      loreNote: 'Отпирает тяжеловесные шлюзовые затворы нижних ярусов.',
      effectSummary: 'Открывает доступ к шлюзам и тайным хранилищам.',
      acquiredLocation: 'Оружейная Волнолома',
    },
  ],
  initialQuests: [
    {
      id: 'quest-frozen-tides',
      title: 'Корона застывших вод',
      objective: 'Найти Астролябию Короля Приливов в недрах Затопленной Цитадели.',
      status: 'active',
      journalEntry:
        'Мы с Серой подошли к исполинскому волнолому. Вода здесь черна как дёготь, а из трещин в стенах доносится пение утопленников. Астролябия сокрыта за шлюзами и Залом Стражей.',
      subQuests: [
        {
          id: 'sub-causeway',
          text: 'Преодолеть Внешний Волнолом и избежать засады глубинников',
          status: 'active',
        },
        {
          id: 'sub-sluice',
          text: 'Проникнуть в Шлюзовой Скрипторий и активировать насосы оттока',
          status: 'active',
        },
        {
          id: 'sub-sentinel',
          text: 'Одолеть или обойти Полого Стража у Врат Бездны',
          status: 'active',
        },
        {
          id: 'sub-astrolabe',
          text: 'Добраться до Тронного Зала и решить судьбу Астролябии',
          status: 'active',
        },
      ],
    },
  ],
  startSceneId: 'v_causeway_entrance',
  scenes: {
    // 1. Вход
    v_causeway_entrance: {
      id: 'v_causeway_entrance',
      chapterTitle: 'Глава I: Волнолом Шепчущих Вод',
      location: 'Внешний Волнолом цитадели',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'character in black plate armor with a companion woman holding lantern on a gargantuan cyclopean damp stone sea wall, crashing black stormy waves, ruined gothic spires sinking into ocean',
      actionFocus: 'Кейлен и Сера всматриваются в пелену солёного тумана у запечатанных ворот',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'anxious',
      },
      hotspots: [
        {
          id: 'hotspot-v1',
          name: 'Замшелый парапет у водослива',
          description: 'Под плотным слоем мокрых водорослей блестит металлическая пряжка походного подсумка.',
          position: { x: 28, y: 72 },
          check: { attribute: 'perception', dc: 11, label: 'Поиск тайников' },
          rewardHealth: 15,
          rewardItem: {
            id: 'item-salt-bandage',
            name: 'Освящённые соляные бинты',
            category: 'Consumable',
            rarity: 'common',
            quantity: 1,
            usable: true,
            description: 'Полосы льна, пропитанные соляным раствором. Останавливают кровотечение (+20 HP).',
            loreNote: 'Оставлены защитниками волнолома.',
            effectSummary: '+20 HP',
            useAction: {
              label: 'Перевязать раны',
              description: 'Восстановить здоровье.',
              healthDelta: 20,
              consumedOnUse: true,
            },
          },
          foundText: 'Вы расчищаете водоросли и находите соляные бинты (+15 HP) и перевязочные припасы!',
        },
        {
          id: 'hotspot-v2',
          name: 'Затопленный саркофаг рыцаря',
          description: 'Тяжёлая каменная крышка покрыта ракушками. Внутри виднеется тусклый металлический блеск.',
          position: { x: 78, y: 80 },
          check: { attribute: 'strength', dc: 13, label: 'Сдвинуть плиту' },
          rewardSanity: 10,
          rewardItem: {
            id: 'relic-ocean-talisman',
            name: 'Оберег Океанической Брони',
            category: 'Relic',
            rarity: 'relic',
            quantity: 1,
            charges: 2,
            maxCharges: 2,
            usable: true,
            description: 'Древний талисман из чёрного жемчуга. Защищает от сокрушительных атак глубинных тварей.',
            loreNote: 'Принадлежал первому маршалу Волнолома.',
            effectSummary: 'Поглощает тяжелый физический урон.',
            useAction: {
              label: 'Активировать оберег',
              description: 'Восстановить 25 HP и укрепить стойкость.',
              healthDelta: 25,
              consumedOnUse: false,
            },
          },
          foundText: 'Вы сдвигаете монолит и извлекаете скрытую реликвию: Оберег Океанической Брони!',
        },
      ],
      narrative: [
        'Солёный туман оседает на остывающем железе ваших лат липкой коркой. Чёрные волны с глухим стоном бьются о циклопический волнолом Велена — последний бастион, не поглощённый бездной три века назад.',
        'Рядом замирает Сера Никс. Её пальцы в кожаной перчатке нервно касаются цепочки приливного амулета. «Прилив поднимается быстрее обычного, Кейлен. Слышишь? Камни скрипят, словно живые рёбра».',
        'Впереди вздымаются бронзовые врата Волнолома, поросшие мёртвыми ракушками и соляной коркой. По карнизу парапета видны тени — то ли горгульи, то ли выжидающие приливные падальщики.',
      ],
      choices: [
        {
          id: 'c_causeway_open_seal',
          text: 'Вставить Печать Волнолома в паз бронзовых ворот и открыть прямой проход',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'CAUTIOUS',
          approach: 'Investigative',
          actionFocusPrompt: 'character placing heavy bronze seal into an ancient waterlogged gateway mechanism',
          condition: { hasItem: 'key-causeway-seal' },
          effect: {
            flagsSet: ['gate_opened_key'],
            notification: 'Печать Волнолома провернулась с грохотом цепей.',
          },
        },
        {
          id: 'c_causeway_stealth',
          text: 'Обойти ворота по скользкому внешнему парапету под прикрытием шума прибоя',
          targetSceneId: 'v_parapet_ambush',
          tag: 'RECON',
          approach: 'Shadow',
          actionFocusPrompt: 'character creeping along a narrow wet stone parapet above roaring sea waves',
          skillCheck: {
            attribute: 'perception',
            dc: 12,
            label: 'Проверка внимательности на парапете',
            passMessage: 'Вы вовремя замечаете засаду тварей и проходите без единой царапины!',
            failMessage: 'Тварь нападает из пены: вы получаете удар когтями!',
          },
        },
        {
          id: 'c_causeway_lantern',
          text: 'Поднять Погасший приливный фонарь и воззвать к свету, рассеивая морок',
          targetSceneId: 'v_causeway_illuminated',
          tag: 'RELIC',
          approach: 'Arcane',
          actionFocusPrompt: 'character raising a glowing brass lantern casting bright azure radiance over wet gargoyles',
          condition: { hasItem: 'relic-lantern' },
          effect: {
            sanityDelta: 5,
            relationshipDelta: 1,
            companionToast: 'Сера вдохновлена священным пламенем фонаря (+1)',
            flagsSet: ['lantern_revealed_drowned'],
            notification: 'Лазурный свет фонаря разогнал иллюзорный туман.',
          },
        },
        {
          id: 'c_causeway_explore_cloisters',
          text: 'Свернуть в боковой пролом: обследовать Галереи Шепчущих Сестёр',
          targetSceneId: 'v_weeping_cloisters',
          tag: 'RECON',
          approach: 'Investigative',
          actionFocusPrompt: 'characters entering narrow crumbling gothic side cloisters with dripping stalactites',
        },
      ],
    },

    // НОВАЯ СЦЕНА 1: Шепчущие галереи скорби
    v_weeping_cloisters: {
      id: 'v_weeping_cloisters',
      chapterTitle: 'Глава I: Шепчущие Галереи',
      location: 'Галереи Шепчущих Сестёр',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'creepy gothic waterlogged cloisters with dripping black water and salt statues holding weeping faces, candle stubs',
      actionFocus: 'Кейлен и Сера медленно ступают по узкой галерее среди плачущих статуй',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'neutral',
      },
      hotspots: [
        {
          id: 'hotspot-v3',
          name: 'Потайная ниша в стене галереи',
          description: 'За одной из статуй припрятана каменная кадильница с древней солью.',
          position: { x: 50, y: 65 },
          check: { attribute: 'perception', dc: 12 },
          rewardSanity: 15,
          rewardItem: {
            id: 'relic-flambeau',
            name: 'Кадило Лунного Флогистона',
            category: 'Relic',
            rarity: 'relic',
            quantity: 1,
            charges: 2,
            maxCharges: 2,
            usable: true,
            description: 'Курильница с кристаллами небесной соли. Очищает воздух от солёного морока.',
            loreNote: 'Использовалась при погребении великих магистров.',
            effectSummary: '+30 Sanity и снятие морока.',
            useAction: {
              label: 'Воскурить ладан',
              description: 'Очистить разум от безумия.',
              sanityDelta: 30,
              consumedOnUse: false,
            },
          },
          foundText: 'Вы находите тайное Кадило Лунного Флогистона — могущественную реликвию!',
        },
      ],
      narrative: [
        'Узкий сводчатый коридор уходит вглубь волнолома. По стенам высечены барельефы сестёр Соляного Архива, чьи каменные руки прижаты к лицам в вечном безмолвном плаче.',
        'Вода здесь сочится сквозь трещины с тихим мелодичным звоном, складывающимся в слова забытой колыбельной.',
        '«Они оплакивали тех, кто остался запечатан внизу, — шепчет Сера. — Здесь можно найти следы павших паломников».',
      ],
      choices: [
        {
          id: 'c_cloisters_pray',
          text: 'Преклонить колено и прочесть молитву за упокой погребённых',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 15,
            relationshipDelta: 2,
            companionToast: 'Сера тронута вашим уважением к традициям Архива (+2)',
            notification: 'Покой павших укрепил ваш дух (+15 Sanity).',
          },
        },
        {
          id: 'c_cloisters_search_secret',
          text: 'Простучать кладку стен в поисках прохода в Затонувшую Колокольню',
          targetSceneId: 'v_sunken_belltower',
          tag: 'RECON',
          approach: 'Investigative',
          skillCheck: {
            attribute: 'perception',
            dc: 13,
            label: 'Поиск скрытого прохода',
            passMessage: 'Каменная плита подаётся, открывая крутую винтовую лестницу к колокольне!',
            failMessage: 'Кладка заклинила, вам приходится протискиваться силой, повредив доспех (-10 HP).',
          },
        },
        {
          id: 'c_cloisters_back_gate',
          text: 'Вернуться к главным воротам и спуститься в шлюзовые катакомбы',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },

    // НОВАЯ СЦЕНА 2: Затонувшая колокольня
    v_sunken_belltower: {
      id: 'v_sunken_belltower',
      chapterTitle: 'Глава I: Колокольня Приливного Звона',
      location: 'Затонувшая Колокольня',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'massive submerged bronze cathedral bell hanging in flooded gothic tower, shafts of blue light, green verdigris metal',
      actionFocus: 'Кейлен и Сера осматривают исполинский бронзовый колокол над водной гладью',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'neutral',
      },
      hotspots: [
        {
          id: 'hotspot-v4',
          name: 'Язык приливного колокола',
          description: 'На языке колокола выбита древняя руна акустического резонанса.',
          position: { x: 50, y: 40 },
          check: { attribute: 'intellect', dc: 12 },
          rewardSanity: 15,
          rewardFlag: 'knows_bell_resonance',
          foundText: 'Вы расшифровываете руну колокола: резонанс увеличит силу Обсидианового камертона против Стража!',
        },
      ],
      narrative: [
        'Вы поднимаетесь на полузатопленную площадку колокольни. В центре над зеркалом чёрной воды на цепях толщиной с дубовый ствол висит циклопический колокол.',
        'Его поверхность покрыта малахитовой патиной и звёздными знаками отлива. Даже лёгкий порыв ветра вызывает глубокий бархатный гул, от которого дрожат зубы.',
        '«Этот звон когда-то отгонял левиафанов на десятки лиг вокруг, — замечает Сера. — Если правильно ударить в него камертоном, эхо разрушит чары в нижних залах».',
      ],
      choices: [
        {
          id: 'c_bell_strike_tuning',
          text: 'Ударить Обсидиановым камертоном по колоколу: вызвать резонансную волну',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: { hasItem: 'relic-tuning-fork' },
          effect: {
            flagsSet: ['bell_resonance_active'],
            notification: 'Гул колокола расчистил катакомбы от соляных наростов!',
          },
        },
        {
          id: 'c_bell_salvage_chains',
          text: 'Осмотреть цепи крепления и спуститься на противовесе прямо в Скрипторий',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
        },
      ],
    },

    // 2. Освещённый волнолом
    v_causeway_illuminated: {
      id: 'v_causeway_illuminated',
      chapterTitle: 'Глава I: Лазурный Сполох',
      location: 'Озарённый Волнолом',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'magical azure beam of light slicing through sea fog, revealing crouching drowned ghouls in ancient iron scrap on stone ramparts',
      actionFocus: 'Фонарь выжигает приливный морок, обращая чудовищ в бегство',
      narrative: [
        'Вы встряхиваете фонарь, и древний левиафаний фитиль с шипением вспыхивает холодным аквамариновым пламенем.',
        'Лазурный луч прорезает туман, и тени на парапете истошно взвизгивают. Это не камень — приливные трупоеды, чья кожа срослась с чешуёй и ржавыми кольчугами, отшатываются от святого света и с плеском падают в бушующую пену.',
        '«Они боятся истинного пламени!» — выдыхает Сера, спешно откупоривая потайную защёлку в стене волнолома.',
      ],
      choices: [
        {
          id: 'c_illum_enter_gate',
          text: 'Пройти через распахнувшуюся потайную дверь прямо в Водные Катакомбы',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'CAUTIOUS',
          approach: 'Audacious',
          effect: {
            flagsSet: ['gained_stealth_entry'],
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-causeway',
              status: 'completed',
              newJournal: 'Волнолом пройден без потерь благодаря приливному фонарю.',
            },
          },
        },
        {
          id: 'c_illum_scavenge',
          text: 'Обыскать брошенное гнездо приливников на парапете перед спуском',
          targetSceneId: 'v_ghoul_nest_loot',
          tag: 'RECON',
          approach: 'Investigative',
        },
      ],
    },

    // 3. Засада на парапете
    v_parapet_ambush: {
      id: 'v_parapet_ambush',
      chapterTitle: 'Глава I: Когти из Солёной Пены',
      location: 'Внешний карниз волнолома',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'visceral fight on narrow stone ledge, knight clashing weapon against a horrific barnacle encrusted drowned ghoul in splashing waves',
      actionFocus: 'Кейлен наносит сокрушительный удар клевцом по нападающей твари',
      narrative: [
        'Подошвы сапог скользят по водорослям. Ветер ревёт, швыряя в лицо солёные брызги. Неожиданно каменная кладка под рукой взрывается осколками: из щели вырывается когтистая лапа, покрытая ракушками!',
        'Приливный трупоед с пустыми белёсыми бельмами пытается увлечь вас за край в голодный прибой. Сера вскрикивает, швыряя в тварь соляной порошок, но монстр успевает полоснуть когтями по наплечнику.',
      ],
      choices: [
        {
          id: 'c_parapet_strike',
          text: 'Вонзить боевой клевец точно в сочленение панциря твари',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            healthDelta: -15,
            screenShake: true,
            notification: 'Вы сбросили тварь в волны, но получили рваную рану (-15 HP).',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-causeway',
              status: 'completed',
            },
          },
        },
        {
          id: 'c_parapet_tuning',
          text: 'Ударить Обсидиановым камертоном по парапету, оглушив монстров акустическим ударом',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: { hasItem: 'relic-tuning-fork' },
          effect: {
            sanityDelta: -5,
            flagsSet: ['fork_used_early'],
            notification: 'Вибрация расколола кости твари в прах!',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-causeway',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 4. Добыча в гнезде
    v_ghoul_nest_loot: {
      id: 'v_ghoul_nest_loot',
      chapterTitle: 'Глава I: Тлеющие Реликвии',
      location: 'Гнездовище падальщиков',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'knight uncovering a silver relic ring from sea debris and dead shells on a stone parapet alcove',
      actionFocus: 'Осмотр сокровищ утонувшего капеллана среди костей и водорослей',
      narrative: [
        'Среди обглоданных костей глубоководных рыб и клочьев парусины вы находите останки древнего капеллана Ордена.',
        'Его иссохшие пальцы всё ещё сжимают кольцо с печатью из тёмного серебра, а в заплечной суме чудом уцелел второй флакон драгоценного дистиллята лунной соли.',
        '«Это кольцо отца Валиана, — благоговейно шепчет Сера. — Оно благословлено на стойкость перед шёпотом бездны».',
      ],
      choices: [
        {
          id: 'c_nest_take_loot',
          text: 'Забрать серебряное кольцо и эликсир, затем спуститься в шлюзовые катакомбы',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            sanityDelta: 15,
            itemsAdded: [
              {
                id: 'relic-chaplain-ring',
                name: 'Кольцо Капеллана Прилива',
                category: 'Relic',
                rarity: 'rare',
                quantity: 1,
                description: 'Оберег из чернёного серебра. Защищает разум владельца от безумия глубин.',
                loreNote: 'Освящено перед Великим Затоплением епископом Велена.',
                effectSummary: '+15 Sanity защиты от шёпота глубин.',
              },
            ],
            flagsSet: ['has_chaplain_ring'],
            notification: 'Получено: Кольцо Капеллана!',
          },
        },
      ],
    },

    // 5. Преддверие шлюзов
    v_sluice_antechamber: {
      id: 'v_sluice_antechamber',
      chapterTitle: 'Глава II: Механизмы Утонувших',
      location: 'Шлюзовые катакомбы',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'massive flooded gothic subterranean chamber with enormous rusted iron gears, water pouring from vaulted ceilings, moss and luminescent fungi',
      actionFocus: 'Кейлен и Сера бредут по колено в чёрной воде между циклопическими шестернями',
      hotspots: [
        {
          id: 'hotspot-v5',
          name: 'Застрявший сундук интенданта',
          description: 'Чугунный ларь зажат между спицами гигантской шестерни.',
          position: { x: 35, y: 75 },
          check: { attribute: 'strength', dc: 12 },
          rewardItem: {
            id: 'item-salt-distillate',
            name: 'Флакон дистиллята лунной соли',
            category: 'Consumable',
            rarity: 'rare',
            quantity: 1,
            usable: true,
            description: 'Восстанавливает 25 здоровья и 25 рассудка.',
            loreNote: 'Интендантский запас ордена.',
            effectSummary: '+25 HP, +25 Sanity',
            useAction: {
              label: 'Осушить флакон',
              description: 'Восстановить силы.',
              healthDelta: 25,
              sanityDelta: 25,
              consumedOnUse: true,
            },
          },
          foundText: 'Вы взламываете ларь и находите драгоценный Флакон дистиллята лунной соли!',
        },
      ],
      narrative: [
        'Тяжёлая плита опускается позади вас, отсекая вой бури. Вы стоите по колено в чёрной ледяной воде.',
        'Огромные шестерни размером с двухэтажный дом застыли под готическими сводами, скованные соляными сталактитами. Где-то в темноте гулко капает вода, и эхо разносит этот звук, превращая его в размеренный пульс гигантского сердца.',
        'Перед вами две развилки: левая галерея ведёт к Часовне Соляных Сестёр, откуда тянет запахом ладана и сырости, а правая уходит вниз, к Шлюзовому Скрипторию, где когда-то хранились карты приливных течений.',
      ],
      choices: [
        {
          id: 'c_sluice_to_scriptorium',
          text: 'Спуститься к Шлюзовому Скрипторию в поисках карт и механизма слива',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'RECON',
          approach: 'Investigative',
          actionFocusPrompt: 'characters entering a waterlogged ancient library with drowned stone lecterns and scrolls',
        },
        {
          id: 'c_sluice_to_chapel',
          text: 'Направиться в Часовню Соляных Сестёр, чтобы освятить оружие и найти благословение',
          targetSceneId: 'v_salt_chapel',
          tag: 'DIALOGUE',
          approach: 'Arcane',
          actionFocusPrompt: 'characters entering a gothic subterranean chapel lit by blue water reflections and drowned candles',
        },
        {
          id: 'c_sluice_repair_pump',
          text: 'Попытаться провернуть клапан соляного насоса силой, чтобы понизить уровень воды',
          targetSceneId: 'v_pump_mechanism',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          condition: { minHealth: 60 },
        },
        {
          id: 'c_sluice_coral_mine',
          text: 'Исследовать затопленную шахту: спуститься в Коралловые Катакомбы',
          targetSceneId: 'v_coral_catacombs',
          tag: 'RECON',
          approach: 'Investigative',
        },
      ],
    },

    // НОВАЯ СЦЕНА 3: Коралловые катакомбы
    v_coral_catacombs: {
      id: 'v_coral_catacombs',
      chapterTitle: 'Глава II: Коралловый Лабиринт',
      location: 'Коралловые Катакомбы',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'breathtaking subterranean cavern filled with black and turquoise branching bioluminescent corals, human bones embedded in mineral formations',
      actionFocus: 'Кейлен освещает фонарем светящиеся ветви чёрных кораллов',
      hotspots: [
        {
          id: 'hotspot-v6',
          name: 'Коралловый нарост с перстнем',
          description: 'В толще полупрозрачного полипа застыла рука древнего магистра с печаткой.',
          position: { x: 70, y: 55 },
          check: { attribute: 'strength', dc: 13 },
          rewardItem: {
            id: 'item-coral-needle',
            name: 'Стилет из Чёрного Коралла',
            category: 'Weapon',
            rarity: 'rare',
            quantity: 1,
            description: 'Острейший стилет, выточенный из окаменевшего коралла. Игнорирует соляную броню.',
            loreNote: 'Оружие дуэлянтов павшего двора.',
            effectSummary: 'Пробивает панцири стражей.',
          },
          foundText: 'Вы вырубаете из коралла древний Стилет из Чёрного Коралла!',
        },
      ],
      narrative: [
        'Катакомбы поросли причудливыми ветвями чёрных и лазурных кораллов. Они тихо фосфоресцируют во тьме, отбрасывая дрожащие тени на своды.',
        'Под ногами хрустят раковины и минерализованные кости тех, кто искал убежища во время потопа.',
        '«Кораллы помнят каждую каплю пролитой здесь крови, — шепчет Сера. — Осторожнее: их шипы ядовиты, но в сердцевине сокрыты дары древних».',
      ],
      choices: [
        {
          id: 'c_coral_advance_chapel',
          text: 'Пройти сквозь лабиринт кораллов к Часовне Соляных Сестёр',
          targetSceneId: 'v_salt_chapel',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
        {
          id: 'c_coral_to_mine_shaft',
          text: 'Спуститься глубже по соляному штоку в Шахту Древней Соли',
          targetSceneId: 'v_salt_mine_shaft',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          skillCheck: {
            attribute: 'perception',
            dc: 12,
            passMessage: 'Вы ловко минуете ядовитые наросты и находите спуск!',
            failMessage: 'Коралловый шип распарывает плащ, нанося ожог ядом (-15 HP).',
          },
        },
      ],
    },

    // НОВАЯ СЦЕНА 4: Соляная шахта
    v_salt_mine_shaft: {
      id: 'v_salt_mine_shaft',
      chapterTitle: 'Глава II: Соляная Штольня',
      location: 'Шахта Первородной Соли',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'colossal subterranean crystalline salt cavern, giant cubes of translucent halite shining with azure light, abandoned wooden mining scaffolds',
      actionFocus: 'Кейлен и Сера на деревянных мостках среди циклопических кубов чистой соли',
      hotspots: [
        {
          id: 'hotspot-v7',
          name: 'Жила кристалла лунной соли',
          description: 'Чистейший крупный кристалл соли, пульсирующий прохладным сиянием.',
          position: { x: 45, y: 50 },
          check: { attribute: 'strength', dc: 12 },
          rewardSanity: 20,
          rewardHealth: 20,
          foundText: 'Вы откалываете кусок чистейшей Лунной Соли, полностью исцеляя раны и рассудок (+20 HP, +20 Sanity)!',
        },
      ],
      narrative: [
        'Штольня ошеломляет масштабом: циклопические блоки чистейшей каменной соли образуют правильные геометрические колоннады.',
        'Воздух здесь настолько сухой и соленый, что каждый вдох обжигает легкие кристальной чистотой. Здесь нет тлена и гнили — соль законсервировала всё в первозданном виде.',
        'Древняя вагонетка на бронзовых рельсах ведет прямо к подземным галереям Скриптория.',
      ],
      choices: [
        {
          id: 'c_mine_ride_cart',
          text: 'Спустить вагонетку по рельсам и с ветерком въехать в Скрипторий',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            notification: 'Дерзкий спуск по рельсам экономит время и силы!',
          },
        },
        {
          id: 'c_mine_to_observatory',
          text: 'Подняться по боковой штольне в Затонувшую Обсерваторию',
          targetSceneId: 'v_abyssal_observatory',
          tag: 'RECON',
          approach: 'Investigative',
        },
      ],
    },

    // НОВАЯ СЦЕНА 5: Глубинная обсерватория
    v_abyssal_observatory: {
      id: 'v_abyssal_observatory',
      chapterTitle: 'Глава II: Око Пучины',
      location: 'Глубинная Обсерватория Приливов',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'submerged gothic dome with huge circular glass viewing portal into ocean abyss, giant bioluminescent squids swimming past, bronze astrolabe models',
      actionFocus: 'Сера благоговейно смотрит сквозь циклопический иллюминатор в бездну океана',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'smiling',
      },
      hotspots: [
        {
          id: 'hotspot-v8',
          name: 'Бронзовая модель трех лун',
          description: 'Настольный прибор со сферами из лазурита и золота.',
          position: { x: 50, y: 70 },
          check: { attribute: 'intellect', dc: 12 },
          rewardSanity: 25,
          rewardFlag: 'knows_moon_cycles',
          foundText: 'Вы расшифровываете фазы трех лун: эти знания облегчат контакт с Астролябией!',
        },
      ],
      narrative: [
        'Купол обсерватории врезан в самую толщу океанского дна. Сквозь толстые хрустальные линзы открывается вид в чернильную тьму, где величаво парят гигантские светящиеся скаты.',
        'В центре зала установлены макеты небесных орбит и астрономические таблицы гравитации.',
        '«Они рассчитывали приливы до секунд, — вздыхает Сера. — Король Приливов знал, что день катастрофы наступит, когда все три луны выстроятся в прямую линию».',
      ],
      choices: [
        {
          id: 'c_observatory_study',
          text: 'Изучить лунные таблицы и усилить связь с Серой',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'DIALOGUE',
          approach: 'Investigative',
          effect: {
            sanityDelta: 20,
            relationshipDelta: 2,
            companionToast: 'Сера в восторге от вашей жажды знаний (+2)',
            flagsSet: ['studied_lunar_charts'],
            notification: 'Изучение орбит укрепило рассудок (+20 Sanity).',
          },
        },
        {
          id: 'c_observatory_direct_abyss',
          text: 'Спуститься по аварийной шахте давления прямо к Вратам Бездны',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
        },
      ],
    },

    // 6. Часовня Соляных Сестер
    v_salt_chapel: {
      id: 'v_salt_chapel',
      chapterTitle: 'Глава II: Безмолвные Обеты',
      location: 'Часовня Соляных Сестёр',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'ancient drowned chapel altar carved from translucent sea salt, statues of veiled nuns weeping black brine, glowing ritual braziers',
      actionFocus: 'Сера преклоняет колено перед кристаллическим соляным алтарём',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'neutral',
      },
      narrative: [
        'Вода здесь отступает до щиколоток. Стены сложены из полупрозрачных глыб прессованной морской соли, слабо фосфоресцирующих в полумраке.',
        'У алтаря высятся каменные изваяния безмолвных монахинь с закрытыми лицами. Из их глазных впадин непрерывно струится кристальная вода.',
        'Сера благоговейно опускается на колени: «Они пели песнь сдерживания, когда стены цитадели дали трещину. Их души вплавлены в соль. Если мы принесём правильную жертву, алтарь наделит нас силой противостоять Стражу».',
      ],
      choices: [
        {
          id: 'c_chapel_pray_distillate',
          text: 'Окропить алтарь каплей дистиллята лунной соли в знак верности ордену',
          targetSceneId: 'v_chapel_blessing',
          tag: 'SACRIFICE',
          approach: 'Diplomatic',
          condition: { hasItem: 'item-salt-distillate' },
          effect: {
            sanityDelta: 30,
            relationshipDelta: 2,
            companionToast: 'Сера глубоко уважает вашу жертвенность (+2)',
            flagsSet: ['salt_grace_received'],
            notification: 'Благословение Соляных Сестёр наполнило ваши жилы кристальным покоем (+30 Sanity).',
          },
        },
        {
          id: 'c_chapel_commune_ring',
          text: 'Возложить на алтарь Кольцо Капеллана, пробуждая память павших',
          targetSceneId: 'v_chapel_memory_vision',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: { hasItem: 'relic-chaplain-ring' },
        },
        {
          id: 'c_chapel_leave_scriptorium',
          text: 'Покинуть часовню и поспешить в Шлюзовой Скрипторий',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },

    // 7. Благословение часовни
    v_chapel_blessing: {
      id: 'v_chapel_blessing',
      chapterTitle: 'Глава II: Кристальная Благодать',
      location: 'Освящённый Алтарь Соли',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'ethereal blue spirit hands rising from salt altar, imbuing the knight armor and sword with luminous protective crystallizations',
      actionFocus: 'Оружие Кейлена покрывается сверкающими соляными кристаллами защиты',
      narrative: [
        'Капля эликсира шипит на соляном монолите. Тончайшая синеватая дымка поднимается от алтаря, и статуи монахинь на миг озаряются живым серебром.',
        'Ваш клинок и латы покрываются морозным кристаллическим узором. Воздух в лёгких становится кристально чистым, а звон в ушах смолкает.',
        '«Они приняли нас, — улыбается Сера сквозь слёзы. — Теперь Полый Страж не сможет сломить твой дух одним лишь взглядом».',
      ],
      choices: [
        {
          id: 'c_blessed_take_aegis',
          text: 'Взять с алтаря явленную Эгиду Затонувшего Ордена и идти в Скрипторий',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'RELIC',
          approach: 'Audacious',
          effect: {
            itemsAdded: [
              {
                id: 'relic-salt-aegis',
                name: 'Эгида Затонувшего Ордена',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                charges: 2,
                maxCharges: 2,
                usable: true,
                description: 'Щит из окаменевшей лунной соли. Поглощает сильнейшие сокрушительные удары стражей.',
                loreNote: 'Соткан из молитв последних сестёр перед потопом.',
                effectSummary: '+20 HP барьер защиты',
                useAction: {
                  label: 'Активировать защитный барьер',
                  description: 'Поглотить входящий урон и защитить напарника.',
                  healthDelta: 20,
                  consumedOnUse: false,
                },
              },
            ],
            flagsSet: ['has_salt_aegis'],
            notification: 'Получена реликвия: Эгида Затонувшего Ордена!',
          },
        },
      ],
    },

    // 8. Видение капеллана
    v_chapel_memory_vision: {
      id: 'v_chapel_memory_vision',
      chapterTitle: 'Глава II: Память Потопа',
      location: 'Океан воспоминаний',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'ghostly memory spectral projection of ancient king in sunken throne holding golden astrolabe amidst rushing tidal cataclysm',
      actionFocus: 'Видение раскрывает тайну слабости Полого Стража у Врат Бездны',
      narrative: [
        'Кольцо вспыхивает на алтаре, и реальность расплывается, словно чернила в воде.',
        'Перед вашим взором возникает прошлое: Тронный Зал в час катастрофы. Король Приливов в отчаянии поворачивает Астролябию, и вода смывает арки. У врат встаёт великий рыцарь, добровольно отдавая своё сердце соляному ритуалу, чтобы стать Полым Стражем.',
        '«Его сердце — не в груди, — шепчет голос капеллана прямо в вашем сознании. — Оно заключено в резонансе его наплечного гонга. Звук истинной чистоты заставит его вспомнить присягу!»',
      ],
      choices: [
        {
          id: 'c_vision_to_scriptorium',
          text: 'Вернуться в реальность, запомнив уязвимость Стража, и спешить в Скрипторий',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            flagsSet: ['knows_sentinel_secret'],
            sanityDelta: 20,
            notification: 'Открыта тайна Полого Стража! Акустический резонанс камертона станет смертельным.',
          },
        },
      ],
    },

    // 9. Насосный механизм
    v_pump_mechanism: {
      id: 'v_pump_mechanism',
      chapterTitle: 'Глава II: Соляной Рычаг',
      location: 'Опорный насосный узел',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'knight straining all muscle strength against an enormous rusted iron wheel covered in barnacles and sea foam',
      actionFocus: 'Кейлен наваливается на заклинивший рычаг, заставляя поршни двигаться',
      narrative: [
        'Вы хватаетесь за чугунный обод насосного вентиля. Ржавчина и соль врезаются в перчатки. Мышцы горят от предельного напряжения.',
        'С оглушительным скрежетом металл поддаётся. Глубоко в недрах кладки с громоподобным рёвом открываются донные сифоны! Чёрная вода с рёвом устремляется в разверзшиеся стоки, обнажая покрытый мозаикой пол.',
      ],
      choices: [
        {
          id: 'c_pump_drained',
          text: 'Спуститься по обнажившейся лестнице прямо к воротам Скриптория',
          targetSceneId: 'v_scriptorium_archives',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            flagsSet: ['sluice_drained'],
            notification: 'Уровень воды понижен! Доступны тайные архивы Скриптория.',
          },
        },
      ],
    },

    // 10. Вход в Скрипторий
    v_scriptorium_entry: {
      id: 'v_scriptorium_entry',
      chapterTitle: 'Глава III: Шепчущий Скрипторий',
      location: 'Затопленный Скрипторий',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'flooded gothic scriptorium with towering stone bookshelves, submerged floating manuscripts, glowing blue brine mold',
      actionFocus: 'Сера перебирает свитки из водорослей и свинцовых пластин',
      narrative: [
        'Зал скриптория поражает циклопическими масштабами: ряды книжных полок из чёрного камня поднимаются к исчезающим во мраке сводам.',
        'Многие фолианты давно растворились в соли, но свитки на свинцовых пластинах и пергаменты из кожи глубинных скатов сохранились безупречно.',
        '«Здесь записаны звёздные координаты Короля Приливов, — шепчет Сера, освещая каменный аналой. — Астролябия управляла гравитацией океана. Если мы повернём её неверно, цитадель рухнет, утянув за собой половину материка».',
      ],
      choices: [
        {
          id: 'c_script_read_codex',
          text: 'Помочь Сере расшифровать Соляной Кодекс Приливов',
          targetSceneId: 'v_scriptorium_codex',
          tag: 'DIALOGUE',
          approach: 'Investigative',
          actionFocusPrompt: 'two scholars examining an ancient glowing lead manuscript with astronomical tidal charts',
        },
        {
          id: 'c_script_search_reliquary',
          text: 'Обыскать запертый реликварий в боковом нефе скриптория',
          targetSceneId: 'v_scriptorium_reliquary',
          tag: 'RECON',
          approach: 'Shadow',
          condition: { hasItem: 'key-causeway-seal' },
        },
        {
          id: 'c_script_forward_abyss',
          text: 'Не терять времени на книги и немедленно выдвигаться к Вратам Бездны',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
        },
        {
          id: 'c_script_deep_vaults',
          text: 'Спуститься в Затопленный Нижний Архив свинцовых табличек',
          targetSceneId: 'v_drowned_scriptorium_depths',
          tag: 'RECON',
          approach: 'Investigative',
        },
      ],
    },

    // НОВАЯ СЦЕНА 6: Затопленный нижний архив
    v_drowned_scriptorium_depths: {
      id: 'v_drowned_scriptorium_depths',
      chapterTitle: 'Глава III: Свинцовый Архив',
      location: 'Нижние Хранилища Скриптория',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'deep submerged vault with rows of sealed lead containers under black water, glowing phosphorescent water plants, diver knight silhouette',
      actionFocus: 'Кейлен ныряет за запечатанным свинцовым тубусом архива',
      narrative: [
        'Вода здесь доходит до груди. В полумраке колышутся водоросли, оплетающие ряды свинцовых ящиков с печатями королевского совета.',
        'Сера находит запечатанный тубус с личным дневником верховного звездочета цитадели.',
        '«Здесь подробно описаны слабости конструктов стражей! — ликует Сера. — Они питаются гидростатическим давлением. Если разорвать приливный контур — конструкт теряет половину мощи!»',
      ],
      choices: [
        {
          id: 'c_depths_take_cipher',
          text: 'Забрать чертежи уязвимости и вернуться к мосту Бездны',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            flagsSet: ['knows_sentinel_pressure_valve'],
            relationshipDelta: 1,
            companionToast: 'Сера гордится успешной находкой (+1)',
            notification: 'Открыта уязвимость давления Полого Стража!',
          },
        },
        {
          id: 'c_depths_to_crypt',
          text: 'Проплыть сквозь пролом в Забытую Крипту Командора',
          targetSceneId: 'v_forgotten_crypt',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          skillCheck: {
            attribute: 'strength',
            dc: 13,
            label: 'Нырок через узкий пролом',
            passMessage: 'Вы задерживаете дыхание и протискиваетесь в крипту!',
            failMessage: 'Вы задеваете острый край камня, теряя кислород и кровь (-15 HP).',
          },
        },
      ],
    },

    // НОВАЯ СЦЕНА 7: Забытая крипта командора
    v_forgotten_crypt: {
      id: 'v_forgotten_crypt',
      chapterTitle: 'Глава III: Крипта Командора',
      location: 'Забытая Крипта Командора',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'solemn underwater crypt with grand marble effigy of high commander holding an intact runic broadsword, glowing blue algae',
      actionFocus: 'Кейлен салютует мраморному надгробию древнего командора ордена',
      narrative: [
        'Воздушный карман под сводом крипты позволяет сделать глубокий вдох. На постаменте покоится изваяние Командора Вальдемара — легендарного основателя Ордена Волнолома.',
        'В его каменных руках зажат древний клинок, на котором выгравированы слова присяги: «Пока волна бьёт о камень — мы держим рубеж».',
      ],
      choices: [
        {
          id: 'c_crypt_take_blade',
          text: 'Принести обет верности ордену и принять Клинок Командора',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'RELIC',
          approach: 'Audacious',
          effect: {
            sanityDelta: 20,
            itemsAdded: [
              {
                id: 'item-commander-blade',
                name: 'Клинок Командора Вальдемара',
                category: 'Weapon',
                rarity: 'relic',
                quantity: 1,
                description: 'Благословенный меч из метеоритной стали с соляными рунами. Наносит колоссальный урон приливным чудовищам.',
                loreNote: 'Оружие основателя Волнолома.',
                effectSummary: '+35 урона по боссам глубин',
              },
            ],
            flagsSet: ['has_commander_blade'],
            notification: 'Получен легендарный Клинок Командора!',
          },
        },
        {
          id: 'c_crypt_leave_respect',
          text: 'Не тревожить покой основателя и выйти к мосту Бездны',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'CAUTIOUS',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 15,
            relationshipDelta: 1,
            companionToast: 'Сера разделяет ваше благоговение (+1)',
          },
        },
      ],
    },

    // 11. Соляной Кодекс
    v_scriptorium_codex: {
      id: 'v_scriptorium_codex',
      chapterTitle: 'Глава III: Соляной Кодекс',
      location: 'Центральный аналой Скриптория',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'close up of ancient lead tome with celestial diagrams of three moons and spiraling tidal vectors glowing cyan',
      actionFocus: 'Сера находит схему деактивации защитных чар Короля Приливов',
      narrative: [
        'Пальцы Серы скользят по гравированным на свинце астрономическим кругам. Три луны, спиральные течения и формула стабилизации гидростатического ядра.',
        '«Смотри, Кейлен! Король не был безумцем. Он пытался остановить падение небесной звезды в океан, запечатав воды вокруг крепости. Астролябия может как иссушить море, так и восстановить прежний берег!»',
        'Сера наносит соляной знак на вашу ладонь: этот глиф позволит подчинить артефакт в Тронном Зале.',
      ],
      choices: [
        {
          id: 'c_codex_learned',
          text: 'Запомнить начертание глифа и двинуться к Бездне',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            flagsSet: ['knows_astrolabe_cipher'],
            sanityDelta: 20,
            relationshipDelta: 2,
            companionToast: 'Союз с Серой окреп в совместном открытии (+2)',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-sluice',
              status: 'completed',
              newJournal: 'Соляной Кодекс расшифрован. Мы знаем, как обуздать Астролябию.',
            },
            notification: 'Изучен Шифр Соляного Кодекса!',
          },
        },
      ],
    },

    // 12. Реликварий скриптория
    v_scriptorium_reliquary: {
      id: 'v_scriptorium_reliquary',
      chapterTitle: 'Глава III: Сокровищница Архивариуса',
      location: 'Опечатанный Реликварий',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'ornate gothic stone vault door opening, revealing a crystal flask of concentrated astral brine and obsidian daggers',
      actionFocus: 'Кейлен отпирает кованый реликварий Печатью Волнолома',
      narrative: [
        'Бронзовая печать идеально входит в паз двери реликвария. Тяжёлая створка со стоном отворяется.',
        'Внутри, на бархате из шелковистых глубоководных водорослей, покоится большой герметичный сосуд с Концентрированной Эссенцией Бездны и пачка освящённых соляных бинтов.',
      ],
      choices: [
        {
          id: 'c_reliquary_take',
          text: 'Забрать припасы и выдвигаться к Вратам Бездны',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            healthDelta: 30,
            sanityDelta: 15,
            itemsAdded: [
              {
                id: 'item-salt-distillate',
                name: 'Флакон дистиллята лунной соли',
                category: 'Consumable',
                rarity: 'rare',
                quantity: 1,
                usable: true,
                description: 'Очищающий эликсир (+25 HP / +25 Sanity).',
                loreNote: 'Выдержанный эликсир из архивов.',
                effectSummary: '+25 HP, +25 Sanity',
                useAction: {
                  label: 'Осушить флакон',
                  description: 'Восстановить ресурсы.',
                  healthDelta: 25,
                  sanityDelta: 25,
                  consumedOnUse: true,
                },
              },
            ],
            notification: 'Здоровье и рассудок восстановлены припасами реликвария!',
          },
        },
      ],
    },

    // 13. Зал перед Боссом (Ключевая сцена с 5 выборами!)
    v_abyssal_chasm: {
      id: 'v_abyssal_chasm',
      chapterTitle: 'Глава IV: Врата Бездны',
      location: 'Пропасть Чёрных Вод',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'perilous narrow stone bridge crossing a bottomless chasm with whirlpool of black glowing brine beneath, massive arched portal',
      actionFocus: 'Кейлен и Сера подходят к исполинским монументальным Вратам Бездны',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'anxious',
      },
      cgIllustration: {
        id: 'cg_hollow_sentinel_reveal',
        title: 'Пробуждение Полого Стража',
        subtitle: 'Древний рыцарь цитадели преграждает путь к трону',
        url: '/images/preset_world_eldoria_1791453485261.webp',
      },
      narrative: [
        'Вы выходите на узкий каменный мост без перил. Под мостом с гулом вращается циклопический водоворот чёрной воды, на дне которого мерцают холодные бледные огни.',
        'В конце моста высятся Врата Бездны. Их створки высечены из цельного обсидиана, а перед ними на коленях замерла колоссальная фигура в пластинчатом доспехе, поросшем ракушками и сталактитами соли.',
        'При звуке ваших шагов фигура медленно поднимается. В её пустых глазницах загорается багрово-янтарный огонь. **Полый Страж** обнажает двуручный меч из осквернённого чёрного метеорита.',
      ],
      choices: [
        {
          id: 'c_approach_sentinel_fight',
          text: 'Принять честный бой: атаковать Стража лоб в лоб с оружием наготове',
          targetSceneId: 'v_sentinel_combat',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          actionFocusPrompt: 'knight lunging with war-pick against a colossal eight-foot armored hollow guardian swinging a greatsword',
        },
        {
          id: 'c_approach_sentinel_relics',
          text: 'Применить реликвии Ордена: задействовать Фонарь истины или Обсидиановый камертон',
          targetSceneId: 'v_sentinel_relic_choice',
          tag: 'RELIC',
          approach: 'Arcane',
          actionFocusPrompt: 'characters brandishing glowing tuning fork and tide-lantern against the looming titan',
        },
        {
          id: 'c_approach_sentinel_surrender',
          text: 'Опустить оружие: воззвать к рыцарской чести Стража и принести воспоминание в жертву',
          targetSceneId: 'v_sentinel_sacrifice',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          actionFocusPrompt: 'knight kneeling before the titan with open palms, ethereal memory threads swirling between them',
        },
        {
          id: 'c_approach_sentinel_pressure_valve',
          text: 'Использовать знание архивов: пробить клапан гидростатического давления за спиной Стража',
          targetSceneId: 'v_sentinel_defeated',
          tag: 'RECON',
          approach: 'Investigative',
          condition: { requiredFlags: ['knows_sentinel_pressure_valve'] },
          effect: {
            healthDelta: -10,
            flagsSet: ['sentinel_valve_punctured'],
            notification: 'Знание архивов позволило сорвать клапан давления и обессилить Стража без тяжелых потерь!',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-sentinel',
              status: 'completed',
            },
          },
        },
        {
          id: 'c_approach_sentinel_commander_blade',
          text: 'Обнажить Клинок Командора Вальдемара: потребовать повиновения по праву преемника',
          targetSceneId: 'v_sentinel_relic_lantern',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          condition: { hasItem: 'item-commander-blade' },
          effect: {
            sanityDelta: 20,
            relationshipDelta: 3,
            companionToast: 'Сера поражена величием момента (+3)',
            notification: 'Полый Страж признает древний клинок командора и преклоняет колено!',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-sentinel',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 14. Босс: Лобовой бой
    v_sentinel_combat: {
      id: 'v_sentinel_combat',
      chapterTitle: 'Глава IV: Сталь против Соли',
      location: 'Мост перед Вратами Бездны',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'epic brutal duel between human knight and monstrous eight-foot armored hollow guardian on stone bridge, sparks flying from clashing weapons',
      actionFocus: 'Яростная схватка: Кейлен блокирует сокрушительный выпад великана',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'pain',
      },
      narrative: [
        'Полый Страж делает шаг, и мост сотрясается до основания. Его метеоритный клинок со свистом рассекает воздух, высекая снопы искр из каменных плит!',
        'Вы парируете выпад, но чудовищная мощь отдаётся в плече звоном растрескавшихся костей. Страж не ведает усталости и боли — в его жилах струится солёная ртуть.',
        'Сера читает заклинание сковывающего инея, заставляя суставы великана скрипеть. У вас есть лишь одно мгновение, чтобы нанести решающий удар в уязвимый шарнир шейного сочленения!',
      ],
      choices: [
        {
          id: 'c_boss_strike_neck',
          text: 'Прыгнуть вперёд под взмах клинка и вогнать клевец в шарнир шеи',
          targetSceneId: 'v_sentinel_defeated',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          skillCheck: {
            attribute: 'strength',
            dc: 13,
            label: 'Сокрушительный выпад клевцом',
            passMessage: 'Точный удар разносит шейный шарнир: титан повержен!',
            failMessage: 'Удар пришёлся вскользь: Страж контратакует тяжелым ударом щита (-35 HP)!',
          },
          effect: {
            healthDelta: -25,
            sanityDelta: -10,
            screenShake: true,
            flagsSet: ['sentinel_killed_combat'],
            notification: 'Полый Страж повержен в жестоком бою!',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-sentinel',
              status: 'completed',
            },
          },
        },
        {
          id: 'c_boss_switch_fork',
          text: 'Осознать ошибку и в последний момент ударить Обсидиановым камертоном!',
          targetSceneId: 'v_sentinel_relic_fork',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: { hasItem: 'relic-tuning-fork' },
        },
      ],
    },

    // 15. Босс: Меню выбора реликвии
    v_sentinel_relic_choice: {
      id: 'v_sentinel_relic_choice',
      chapterTitle: 'Глава IV: Реликвии Против Титана',
      location: 'Мост Врат Бездны',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'knight holding ancient relics standing firm against towering armored guardian surrounded by dark swirling water',
      actionFocus: 'Кейлен решает, какую древнюю силу противопоставить монолиту Стража',
      narrative: [
        'Полый Страж заносит клинок для сокрушительного удара. Его броня покрыта тысячелетними соляными наслоениями, отражающими обычную сталь.',
        '«Обычное железо его не возьмёт, Кейлен!» — кричит Сера. — «Используй реликвии Ордена!»',
      ],
      choices: [
        {
          id: 'c_relic_fork_shatter',
          text: 'Ударить Обсидиановым камертоном о каменный мост: сокрушить броню резонансом',
          targetSceneId: 'v_sentinel_relic_fork',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: { hasItem: 'relic-tuning-fork' },
          actionFocusPrompt: 'character slamming obsidian tuning fork into ground unleashing concentric sonic shockwaves that crack the guardian stone armor',
        },
        {
          id: 'c_relic_lantern_dispel',
          text: 'Распахнуть Приливный Фонарь: направить луч истины в забрало Стража',
          targetSceneId: 'v_sentinel_relic_lantern',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: { hasItem: 'relic-lantern' },
          actionFocusPrompt: 'character opening glowing lantern shutter projecting concentrated turquoise beam right into the hollow guardian visor slit',
        },
        {
          id: 'c_relic_direct_clash',
          text: 'Вступить в прямой бой со Стражем без помощи реликвий',
          targetSceneId: 'v_sentinel_combat',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
        },
      ],
    },

    // 16. Исход Б1: Применение фонаря
    v_sentinel_relic_lantern: {
      id: 'v_sentinel_relic_lantern',
      chapterTitle: 'Глава IV: Свет Истины',
      location: 'Мост Врат Бездны',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'blinding turquoise beam of light from brass lantern penetrating hollow guardian helmet, dark spirits escaping in mist, giant bowing down',
      actionFocus: 'Лазурный луч фонаря сжигает червеобразный морок в сердце Стража',
      narrative: [
        'Вы откидываете латунные заслонки приливного фонаря. Столп ослепительного бирюзового огня бьёт прямо в смотровую щель шлема Полого Стража!',
        'Из-под забрала с визгом вырываются клубы чёрного гнилостного дыма — глубинная скверна, веками осквернявшая разум благородного воина, не выдерживает священного пламени.',
        'Гигант роняет меч. Его янтарные глаза гаснут, сменяясь спокойным серебристым сиянием. Страж медленно опускается на одно колено и жестом открывает путь к Вратам.',
        '«Проходи... последний рыцарь Волнолома... заверши то... что мы не смогли...» — глухо звучит голос из-под шлема.',
      ],
      choices: [
        {
          id: 'c_lantern_pass',
          text: 'Поклониться очищенному Стражу и войти в Тронный Зал',
          targetSceneId: 'v_inner_sanctum_approach',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 25,
            relationshipDelta: 3,
            companionToast: 'Сера восхищена милосердием и силой фонаря (+3)',
            flagsSet: ['sentinel_redeemed'],
            notification: 'Полый Страж искуплен! Вы получили благословение стража (+25 Sanity).',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-sentinel',
              status: 'completed',
              newJournal: 'Приливный Фонарь очистил душу Полого Стража от векового морока.',
            },
          },
        },
      ],
    },

    // 17. Исход Б2: Применение камертона
    v_sentinel_relic_fork: {
      id: 'v_sentinel_relic_fork',
      chapterTitle: 'Глава IV: Акустический Разлом',
      location: 'Мост Врат Бездны',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'violent sonic shockwaves exploding outward from vibrating obsidian fork, the colossal guardian armor shattering into thousands of crystalline salt shards',
      actionFocus: 'Резонанс камертона взрывает соляной панцирь Полого Стража',
      narrative: [
        'Вы со всей силы бьёте острием обсидианового камертона о плиту моста. Звук рождается не в воздухе — он вспарывает саму воду и кости!',
        'Колоссальная звуковая волна синего цвета устремляется к титану. Встретив резонансную частоту соляной брони, вибрация нарастает с ужасающим визгом.',
        'Доспехи Стража покрываются сетью ослепительных трещин и с оглушительным звоном взрываются миллионом кристаллических осколков! Пустая оболочка кондуктора осыпается безжизненной пылью, обнажая проход к вратам.',
      ],
      choices: [
        {
          id: 'c_fork_pass',
          text: 'Ступить по осколкам поверженного стража прямо к створкам Тронного Зала',
          targetSceneId: 'v_inner_sanctum_approach',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            flagsSet: ['sentinel_shattered'],
            notification: 'Полый Страж разбит акустическим резонансом!',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-sentinel',
              status: 'completed',
              newJournal: 'Обсидиановый камертон расколол монолитную броню Стража на тысячи осколков.',
            },
          },
        },
      ],
    },

    // 18. Исход В: Жертва воспоминания
    v_sentinel_sacrifice: {
      id: 'v_sentinel_sacrifice',
      chapterTitle: 'Глава IV: Цена Памяти',
      location: 'Мост Врат Бездны',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'melancholic scene of knight touching hollow guardian chest, silver glowing soul threads detaching from knight head into the titan armor, sad solemn atmosphere',
      actionFocus: 'Кейлен добровольно отдаёт своё самое драгоценное воспоминание',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'pain',
      },
      narrative: [
        'Вы опускаете клевец и делаете шаг вперёд с открытыми ладонями. Клинок Стража замирает в дюйме от вашего горла.',
        '«Ты стоишь здесь не из ненависти, брат, — тихо говорите вы. — Ты забыл, ради чего держал оборону. Возьми мою память».',
        'Холодная латная перчатка стража касается вашего лба. Серебристые нити света вытягиваются из вашей памяти: вы навсегда забываете лицо матери и солнечный свет родной долины до потопа. Рассудок содрогается от ледяной пустоты.',
        'Страж вздрагивает, прижимая ладонь к груди. По его щеке из чернёного железа скатывается прозрачная капля. Он отступает в сторону, склонив голову.',
      ],
      choices: [
        {
          id: 'c_sacrifice_pass',
          text: 'Шагнуть сквозь врата с опустевшим, но свободным сердцем',
          targetSceneId: 'v_inner_sanctum_approach',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            sanityDelta: -30,
            flagsSet: ['memory_sacrificed'],
            notification: 'Воспоминание отдано. Рассудок пошатнулся (-30 Sanity), но путь открыт без крови.',
            questUpdate: {
              questId: 'quest-frozen-tides',
              subQuestId: 'sub-sentinel',
              status: 'completed',
              newJournal: 'Вы отдали воспоминание о доме, чтобы пробудить в Страже остатки рыцарской чести.',
            },
          },
        },
      ],
    },

    // 19. Путь к Тронному Залу
    v_inner_sanctum_approach: {
      id: 'v_inner_sanctum_approach',
      chapterTitle: 'Глава V: Сердце Прилива',
      location: 'Внутренний коридор святилища',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'grand arched hallway with walls of solid water held back by golden forcefields, schools of luminous deep sea fish swimming outside, gilded floor',
      actionFocus: 'Кейлен и Сера идут вдоль прозрачных водных стен, любуясь бездной',
      narrative: [
        'Врата Бездны распахиваются перед вами. Вы вступаете в коридор, где стены сложены не из камня, а из застывшей, словно хрусталь, морской воды.',
        'По ту сторону водных барьеров в вечной темноте величаво плывут исполинские скаты и люминесцентные медузы. Здесь царит абсолютная, благоговейная тишина.',
        'Впереди открывается колоссальный Тронный Зал Короля Приливов. В его центре, над ступенчатым зиккуратом из чёрного базальта, парит она — **Астролябия Короля Приливов**.',
      ],
      choices: [
        {
          id: 'c_approach_astrolabe',
          text: 'Взойти по базальтовым ступеням к парящей Астролябии',
          targetSceneId: 'v_astrolabe_dais',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          actionFocusPrompt: 'two characters ascending black basalt dais towards a spinning complex golden astrolabe glowing with immense celestial power',
        },
      ],
    },

    // 20. Постамент Астролябии (Развилка финалов)
    v_astrolabe_dais: {
      id: 'v_astrolabe_dais',
      chapterTitle: 'Глава V: Выбор Судеб',
      location: 'Тронный Зал Короля Приливов',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'breathtaking climax chamber with glowing golden astrolabe with concentric rotating rings floating above throne, water droplets hovering in mid air',
      actionFocus: 'Кейлен заносит руку над вращающимися золотыми кольцами Астролябии',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'anxious',
      },
      cgIllustration: {
        id: 'cg_astrolabe_climax',
        title: 'Астролябия Короля Приливов',
        subtitle: 'Точка схождения судеб океанического мира',
        url: '/images/preset_world_eldoria_1791453485261.webp',
      },
      narrative: [
        'Золотые кольца Астролябии вращаются в сложном трёхмерном танце, издавая мелодичный хрустальный звон. Капли воды в воздухе застыли неподвижно — гравитация подчинена воле древнего механизма.',
        'На каменном троне за постаментом покоится иссохший остов Короля Приливов в венце из ракушек и орихалка.',
        'Сера замирает рядом, её дыхание перехватывает: «Мы у цели, Кейлен. Астролябия в наших руках. Но что мы сделаем? Если мы активируем её истинный цикл — ты станешь новым повелителем океанов. Если разобьём — дамба рухнет, и море навсегда поглотит цитадель, освободив души. Или... мы можем воздвигнуть вечную печать, заперев бездну навсегда».',
      ],
      choices: [
        {
          id: 'c_ending_ascend',
          text: 'Синхронизировать разум с Астролябией: Стать Владыкой Застывших Вод',
          targetSceneId: 'v_ending_tide_lord',
          tag: 'ENDING',
          approach: 'Arcane',
          condition: { minSanity: 40 },
          actionFocusPrompt: 'character grasping the spinning golden astrolabe rings, golden and azure energy flowing into knight eyes and armor',
        },
        {
          id: 'c_ending_shatter',
          text: 'Сокрушить Астролябию боевым клевцом: Разрушить дамбу и освободить узников глубин',
          targetSceneId: 'v_ending_dam_break',
          tag: 'ENDING',
          approach: 'Audacious',
          actionFocusPrompt: 'knight swinging heavy war-pick with immense power to shatter the glowing golden astrolabe mechanism in an explosion of light',
        },
        {
          id: 'c_ending_seal',
          text: 'Объединить силы с Серой и начертать Печать Вечного Отлива: Запечатать цитадель навеки',
          targetSceneId: 'v_ending_seal_ward',
          tag: 'ENDING',
          approach: 'Diplomatic',
          condition: { hasItem: 'relic-lantern', minRelationship: 2 },
          actionFocusPrompt: 'two characters weaving complex ritual hand signs and using glowing lantern to weave an impenetrable azure barrier around the throne',
        },
      ],
    },

    // 21. Концовка 1: Владыка Застывших Вод
    v_ending_tide_lord: {
      id: 'v_ending_tide_lord',
      chapterTitle: 'Финал: Владыка Застывших Вод',
      location: 'Трон Вечного Прилива',
      isEnding: true,
      endingType: 'victory',
      endingTitle: 'Владыка Застывших Вод (Триумф Власти)',
      endingEpilogue:
        'Эпилог: Цитадель Велена возвысилась над волнами. Новый повелитель приливов диктует волю берегам, но бездна навсегда изменила его сердце.',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'triumphant majestic scene of knight wearing glowing crown of solidified water, standing atop the grand throne room, oceans parting around the citadel under a starry sky',
      actionFocus: 'Кейлен Вэнс восседает на Троне Приливов, повелевая океанами всего мира',
      narrative: [
        'Ваши пальцы смыкаются на центральной сфере Астролябии. Чудовищная приливная мощь трёх лун вливается в ваше естество, раскаляя кровь лазурным пламенем!',
        'Воды вокруг цитадели замирают, а затем с благоговейным рокотом расступаются до самого горизонта. Велен поднимается из пучины, обновлённый, сияющий белым мрамором и золотом.',
        'Сера преклоняет колено, глядя на вас со смесью страха и преданности. Вы больше не просто смертный рыцарь. Вы — новый Владыка Застывших Вод, хранитель приливов, чья воля отныне диктует судьбу морских путей.',
      ],
      choices: [],
    },

    // 22. Концовка 2: Разрушитель Дамбы
    v_ending_dam_break: {
      id: 'v_ending_dam_break',
      chapterTitle: 'Финал: Разрушитель Дамбы',
      location: 'Рушащийся Тронный Зал',
      isEnding: true,
      endingType: 'destruction',
      endingTitle: 'Разрушитель Дамбы (Очищение Пучиной)',
      endingEpilogue:
        'Эпилог: Воды поглотили темные залы циклопической твердыни. Души павших обрели мир в бескрайней океанской лазури.',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'dramatic cataclysmic scene of ancient gothic citadel crumbling into roaring massive ocean vortex, knight and companion escaping on boat under lightning',
      actionFocus: 'Золотая Астролябия разлетается на тысячи осколков под сокрушительным ударом',
      narrative: [
        'С глухим боевым кличем вы обрушиваете острый клюв клевца на золотое ядро Астролябии. Взрыв чистой гравитационной энергии ослепляет Тронный Зал!',
        'Стены трескаются, словно яичная скорлупа. Вековые оковы, удерживавшие океан, лопаются. Миллионы душ, скованных соляным мороком, с облегчённым вздохом растворяются в бурлящей воде, обретая долгожданный покой.',
        'Вы с Серой едва успеваете прыгнуть в аварийный спасательный челнок, когда циклопические шпили Велена с громоподобным грохотом окончательно погружаются в бездну. Проклятие цитадели смыто навсегда.',
      ],
      choices: [],
    },

    // 23. Концовка 3: Печать Вечного Отлива
    v_ending_seal_ward: {
      id: 'v_ending_seal_ward',
      chapterTitle: 'Финал: Печать Вечного Отлива',
      location: 'Запечатанный Рубеж Велена',
      isEnding: true,
      endingType: 'sacrifice',
      endingTitle: 'Печать Вечного Отлива (Истинные Хранители)',
      endingEpilogue:
        'Эпилог: Вечный шторм рассеялся над бастионами волнолома. Древнее зло заперто в глубинах нерушимым замком соляных чар.',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'peaceful solemn twilight scene of knight and archivist standing on rebuilt lighthouse bastion overlooking calm quiet ocean with ancient runes glowing on the dam',
      actionFocus: 'Кейлен и Сера смыкают ладони над священным фонарем, запирая глубины',
      narrative: [
        'Вы объединяете свет Приливного Фонаря и древние соляные глифы Серы. Вокруг постамента Астролябии вырастает монолитный защитный барьер из нерушимого кристалла.',
        'Механизм продолжает мерно вращаться, стабилизируя приливы, но вход в глубины запечатан навеки от жадных королей и безумных культистов.',
        'Вы возвращаетесь на внешний волнолом. Впервые за триста лет над бастионами Велена рассеивается вечный шторм, и сквозь тучи пробиваются чистые рассветные лучи солнца. Орден спасён, и ваш долг исполнен с честью.',
      ],
      choices: [],
    },

    // 24. Поражение: Потеря здоровья
    v_ending_defeat_hp: {
      id: 'v_ending_defeat_hp',
      chapterTitle: 'Поражение: Поглощение Пучиной',
      location: 'Тёмные глубины Велена',
      isEnding: true,
      endingType: 'defeat_health',
      endingTitle: 'Поглощение Пучиной (Смерть Тела)',
      endingEpilogue: 'Эпилог: Раны оказались фатальны. Тело павшего воина опустилось на илистое дно цитадели.',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'dark somber image of shattered knight armor sinking down into black abyssal water surrounded by glowing bioluminescent deep sea creatures',
      actionFocus: 'Кейлен теряет силы и погружается в холодные объятия приливной тьмы',
      narrative: [
        'Ваши раны слишком глубоки. Силы оставляют вас, и верный клевец со звоном падает на осклизлые плиты.',
        'Ледяная солёная вода смыкается над вашим лицом, заглушая крик Серы. Пучина забирает ещё одного рыцаря, пополнив ряды молчаливых приливных теней Затопленной Цитадели...',
      ],
      choices: [],
    },

    // 25. Поражение: Потеря рассудка
    v_ending_defeat_sanity: {
      id: 'v_ending_defeat_sanity',
      chapterTitle: 'Поражение: Утопление в Безумии',
      location: 'Омут Потерянных Душ',
      isEnding: true,
      endingType: 'defeat_sanity',
      endingTitle: 'Утопление в Безумии (Крах Разума)',
      endingEpilogue: 'Эпилог: Разум не выдержал приливного давления. Шёпот бездны заменил все мысли и воспоминания.',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'hallucinatory nightmare painting of knight kneeling with hands on helmet screaming as black water eyes and coral branches sprout from stone walls',
      actionFocus: 'Рассудок Кейлена окончательно растворяется в голосах древней пучины',
      narrative: [
        'Шёпот в стенах становится невыносимым грохотом тысячи тонущих голосов. Реальность трещит по швам.',
        'Вы срываете шлем, смеясь в унисон с поющим водоворотом. Камни больше не кажутся холодными — они зовут вас, обещая покой на илистом дне. Вы делаете шаг за край, становясь частью вечного хора Бездны...',
      ],
      choices: [],
    },
  },
};
