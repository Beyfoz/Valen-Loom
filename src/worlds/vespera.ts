import { WorldModule } from '../types';
import { ITEM_ILLUSTRATIONS } from '../ui/itemIllustrations';

export const vesperaWorld: WorldModule = {
  id: 'vespera',
  title: 'Медный заговор Новой Весперы',
  subtitle: 'Стимпанк / викторианский часовой нуар-детектив',
  genre: 'Clockwork Steampunk / Gaslight Noir',
  coverImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
  artStyleName: 'Гуашь и тушь газового света',
  artStylePrompt:
    'masterpiece victorian clockwork steampunk gouache and ink noir illustration, warm amber gaslight cutting through thick rainy soot fog, intricate brass gears and copper pipes, trenchcoats, chiaroscuro reflections on cobblestone puddles, moody film noir cinematography',
  theme: {
    primary: '#F59E0B',
    accent: '#10B981',
    border: 'rgba(245, 158, 11, 0.35)',
    bgOverlay: 'rgba(12, 10, 8, 0.94)',
    fontFamilyTitle: "'Cinzel', Georgia, serif",
    fontFamilyBody: "'Lora', Georgia, serif",
    glowColor: '#F59E0B',
  },
  protagonist: {
    id: 'char-julian',
    name: 'Инспектор Джулиан Стерлинг',
    role: 'Специальный следователь Магистрата',
    affiliation: 'Особый часовой отдел',
    disposition: 'Protagonist',
    visualDescriptor:
      'sharp weary detective in a charcoal heavy woolen trenchcoat with brass buckles, wearing a battered fedora, smoking a brass-inlaid pipe, mechanical monocle over left eye',
    statusNote: 'Бывший армейский инженер, знающий каждую шестерню в подбрюшье Весперы.',
  },
  initialCompanion: {
    id: 'char-vivienne',
    name: 'Вивьен Кроу',
    role: 'Инженер подполья и взломщица механизмов',
    affiliation: 'Лига Свободных Стрелок',
    disposition: 'Loyal',
    visualDescriptor:
      'nimble young woman in leather grease-stained artisan waistcoat, tool belt with brass calipers, copper goggles pushed up on unruly dark auburn curls',
    statusNote: 'Ученица убитого мастера Бартоломью Вейна. Ищет правду любой ценой.',
  },
  initialStats: {
    health: 100,
    maxHealth: 100,
    sanity: 100,
    maxSanity: 100,
  },
  initialAttributes: {
    strength: 11,
    intellect: 15,
    perception: 14,
    charisma: 12,
  },
  endingsList: [
    {
      id: 'vesp_ending_justice',
      title: 'Разоблачение Часовой Ложи (Торжество Закона)',
      description: 'Инспектор Стерлинг раскрывает заговор лордов Часовой Ложи. Маятниковое Ядро спасено, закон восстановлен.',
      hint: 'Предъявите улики лордам и передайте шифровку по жандармским проводам Весперы.',
      endingType: 'victory',
      cgUrl: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
    },
    {
      id: 'vesp_ending_architect',
      title: 'Новый Архитектор Шестерней (Теневая Власть)',
      description: 'Джулиан берёт контроль над Маятниковым Ядром в свои руки, становясь тайным правителем Новой Весперы.',
      hint: 'Синхронизируйте Ядро с собственным ритмом и возьмите рычаги власти единолично.',
      endingType: 'victory',
      cgUrl: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
    },
    {
      id: 'vesp_ending_sabotage',
      title: 'Остановка Большого Маятника (Рождение Свободы)',
      description: 'Маятник замирает. Монополия Ложи разрушена, пар течет свободно по всем кварталам города.',
      hint: 'Опустите аварийный стопор вместе с Вивьен, уничтожив монополию времени.',
      endingType: 'destruction',
      cgUrl: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
    },
  ],
  chapters: [
    {
      id: 'vespera_ch1',
      number: 'Глава I',
      title: 'Остывающий Металл',
      startSceneId: 'vesp_workshop_scene',
      devPreset: { flags: ['investigated_workshop', 'clue_time_trade', 'clue_hale_hand', 'clue_hale_ordered'] },
    },
    {
      id: 'vespera_ch2',
      number: 'Глава II',
      title: 'Лабиринт Клапанов',
      startSceneId: 'vesp_catacombs_entry',
      devPreset: { flags: ['entered_catacombs', 'steam_puzzle_solved', 'league_ally', 'clue_pruitt_dividend'] },
    },
    {
      id: 'vespera_ch3',
      number: 'Глава III',
      title: 'Секундант Правосудия',
      startSceneId: 'vesp_inquisitor_chamber',
      devPreset: { flags: ['met_inquisitor', 'obtained_cryptic_letter', 'heard_alistair', 'clue_hale_ordered'] },
    },
    {
      id: 'vespera_ch4',
      number: 'Глава IV',
      title: 'Сердце Новой Весперы',
      startSceneId: 'vesp_cathedral_dais',
      devPreset: {
        flags: [
          'reached_clocktower_heart',
          'vivienne_confessed',
          'heard_alistair',
          'clue_time_trade',
          'league_ally',
          'clue_hale_ordered',
          'clue_hale_hand',
          'clue_pruitt_dividend',
        ],
      },
    },
  ],
  initialInventory: [
    {
      id: 'relic-reverse-chronometer',
      name: 'Хронометр с обратным анкером',
      category: 'Relic',
      rarity: 'relic',
      quantity: 1,
      charges: 3,
      maxCharges: 3,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['relic-reverse-chronometer'],
      description:
        'Экспериментальный карманный хронометр мастера Вейна. Нажатие на головку отматывает локальное время на 5 секунд назад.',
      loreNote:
        'Единственный прототип, созданный на основе кристалла флогистона. Способен спасти от смертельной ошибки.',
      useAction: {
        label: 'Отмотать время назад',
        description: 'Исправить фатальное действие и вернуть потраченное здоровье.',
        healthDelta: 20,
        consumedOnUse: false,
      },
    },
    {
      id: 'relic-wechsler-revolver',
      name: 'Паровой револьвер Векслера',
      category: 'Weapon',
      rarity: 'rare',
      quantity: 1,
      charges: 4,
      maxCharges: 4,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['relic-wechsler-revolver'],
      description:
        'Тяжёлый шестизарядный револьвер со встроенным микробойлером сжатого пара. Пробивает стальные листы автоматонов.',
      loreNote: 'Оружие офицеров часовой жандармерии времён осады Медного Хребта.',
      useAction: {
        label: 'Сделать паровой выстрел',
        description: 'Пробить броню цели мощным зарядом сжатого пара.',
        consumedOnUse: false,
      },
    },
    {
      id: 'item-opiate-tonic',
      name: 'Флакон опиатного тоника',
      category: 'Consumable',
      rarity: 'common',
      quantity: 2,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['item-opiate-tonic'],
      description:
        'Аптекарская настойка на эфире и лаванде. Снимает острую боль и возвращает самообладание рассудку.',
      loreNote: 'Выдаётся следователям для работы в чумных и газовых кварталах.',
      useAction: {
        label: 'Принять дозу тоника',
        description: 'Восстановить 25 здоровья и 25 рассудка.',
        healthDelta: 25,
        sanityDelta: 25,
        consumedOnUse: true,
      },
    },
    {
      id: 'key-lodge-cipher',
      name: 'Шифровальный ключ Ложи Маятника',
      category: 'Key',
      rarity: 'rare',
      quantity: 1,
      illustrationUrl: ITEM_ILLUSTRATIONS['key-lodge-cipher'],
      description:
        'Латунный перфорированный цилиндр, найденный во внутреннем кармане убитого мастера Вейна.',
      loreNote: 'Подходит к зашифрованным кодовым замкам лабораторий Ложи.',
    },
  ],
  initialQuests: [
    {
      id: 'quest-pendulum-core',
      title: 'Смерть часового мастера',
      objective: 'Раскрыть убийство Бартоломью Вейна и найти Маятниковое Ядро до наступления полуночи.',
      status: 'active',
      journalEntry:
        'Мастер Вейн найден мёртвым в своей мастерской на Бронзовой Улице. Его грудная клетка была вскрыта часовыми щипцами, а макет Маятникового Ядра похищен. Вивьен утверждает, что за этим стоит Ложа Маятника.',
      subQuests: [
        {
          id: 'sub-workshop',
          text: 'Осмотреть место преступления и найти скрытые следы убийцы',
          status: 'active',
        },
        {
          id: 'sub-catacombs',
          text: 'Спуститься в Паровые Катакомбы по следам белой смазки',
          status: 'active',
        },
        {
          id: 'sub-inquisitor',
          text: 'Одолеть или перепрограммировать Автоматона-Инквизитора "Секунданта"',
          status: 'active',
        },
        {
          id: 'sub-cathedral',
          text: 'Проникнуть в Собор Шестерён и решить судьбу Маятникового Ядра',
          status: 'active',
        },
      ],
    },
  ],
  startSceneId: 'vesp_workshop_scene',
  scenes: {
    // 1. Место преступления
    vesp_workshop_scene: {
      id: 'vesp_workshop_scene',
      chapterTitle: 'Глава I: Остывающий Металл',
      location: 'Мастерская Вейна на Бронзовой Улице',
      localImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      visualPrompt:
        'victorian steampunk detective inspecting a crime scene inside a cluttered clockmaker workshop, gas lamps flickering in rain, shattered clocks and brass parts',
      actionFocus: 'Инспектор Джулиан Стерлинг осматривает тело убитого часовщика у верстака',
      narrative: [
        'Дождь монотонно стучит по закопчённым витражам мастерской. В воздухе висит тяжёлый запах машинного масла, латунной стружки и медной крови.',
        'Тело мастера Бартоломью Вейна застыло в дубовом кресле перед верстаком. Из его левого рукава выпадает зажатый в окоченевших пальцах обгоревший телеграфный перфолист.',
        'Вивьен Кроу прислоняется к косяку, сжимая в руке разводной ключ. Её голос дрожит, но в глазах горит ярость: «Убийца знал, что искал, Джулиан. Он не тронул золото в сейфе. Пропал только сейфовый тубус с чертежами Маятникового Ядра — сердца, регулирующего подачу пара всему верхнему городу».',
      ],
      choices: [
        {
          id: 'c_vesp_inspect_body',
          text: 'Изучить характер ран на теле с помощью механического монокля',
          targetSceneId: 'vesp_corpse_clues',
          approach: 'Investigative',
          actionFocusPrompt: 'detective adjusting mechanical monocular lens examining strange clockwork puncture wounds on victim coat',
          effect: {
            flagsSet: ['clue_time_trade', 'clue_hale_ordered'],
          },
        },
        {
          id: 'c_vesp_inspect_vents',
          text: 'Осмотреть вентиляционный люк и следы белой машинной смазки на полу',
          targetSceneId: 'vesp_vent_trail',
          approach: 'Shadow',
          actionFocusPrompt: 'companion pointing flashlight at a trail of white oily residue leading into an iron floor grate',
          effect: {
            flagsSet: ['clue_time_trade', 'league_ally'],
          },
        },
        {
          id: 'c_vesp_decode_tape',
          text: 'Расшифровать перфоленту с помощью Шифровального Ключа Ложи',
          targetSceneId: 'vesp_decoded_telegram',
          approach: 'Arcane',
          condition: { hasItem: 'key-lodge-cipher' },
          effect: {
            flagsSet: ['clue_hale_hand', 'clue_hale_ordered', 'knows_conspiracy'],
          },
        },
      ],
    },

    // 2. Улики на теле
    vesp_corpse_clues: {
      id: 'vesp_corpse_clues',
      chapterTitle: 'Глава I: Почерк Часовой Ложи',
      location: 'Верстак мастера Вейна',
      localImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      visualPrompt:
        'detective discovering a hidden brass cylinder key mechanism inside the hollow heel of clockmaker boot',
      actionFocus: 'Джулиан находит скрытый тайник в каблуке мастера Вейна',
      narrative: [
        'Линзы монокля со щелчком фокусируются. Раны на груди оставлены не ножом — это трёхгранные гидравлические клещи, используемые только в элитных автоматонах марки «Секундант».',
        'Ощупывая обувь мастера, вы нажимаете на потайную пружину в каблуке правого сапога. Каблук отскакивает: внутри спрятан миниатюрный медный свисток высокочастотного резонанса!',
        '«Свисток аварийного сброса автоматонов! — ахает Вивьен. — Учитель знал, что за ним придут машины Ложи, и подготовил контрмеру!»',
      ],
      choices: [
        {
          id: 'c_take_whistle_catacombs',
          text: 'Взять свисток и немедленно спуститься по следам в Паровые Катакомбы',
          targetSceneId: 'vesp_catacombs_entry',
          approach: 'Investigative',
          effect: {
            itemsAdded: [
              {
                id: 'relic-whistle',
                name: 'Акустический свисток Вейна',
                category: 'Relic',
                quantity: 1,
                usable: true,
                description: 'Высокочастотный свисток. Вызывает сбой в гироскопах автоматонов Ложи.',
                loreNote: 'Настроен на частоту 24 000 Гц, не слышимую человеком.',
              },
            ],
            flagsSet: ['has_whistle', 'clue_time_trade', 'heard_alistair'],
            notification: 'Получен: Акустический свисток Вейна!',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-workshop',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 3. Следы смазки
    vesp_vent_trail: {
      id: 'vesp_vent_trail',
      chapterTitle: 'Глава I: Вниз по Трубам',
      location: 'Вентиляционная шахта',
      localImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      visualPrompt:
        'detective and woman crawling through steamy brass industrial ducts with hissing valves and copper pipes',
      actionFocus: 'Джулиан и Вивьен пробираются по шипящим вентиляционным коллекторам',
      narrative: [
        'Следы белой эмульсии ведут прямо к решётке обслуживания. Тяжёлые винты были вырваны чудовищной механической силой.',
        'Вы протискиваетесь в гудящий от горячего пара коллектор. Внизу слышен ритмичный, давящий на виски стук — главный паровой поршень города гонит давление в Паровые Катакомбы.',
      ],
      choices: [
        {
          id: 'c_vents_advance',
          text: 'Спуститься по чугунным скобам в Центральный Коллектор',
          targetSceneId: 'vesp_catacombs_entry',
          approach: 'Shadow',
          effect: {
            flagsSet: ['clue_time_trade', 'league_ally'],
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-workshop',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 4. Расшифрованная телеграмма
    vesp_decoded_telegram: {
      id: 'vesp_decoded_telegram',
      chapterTitle: 'Глава I: Тайный Приказ',
      location: 'Телеграфный терминал Вейна',
      localImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      visualPrompt:
        'deciphered paper strip glowing under amber gas lamp with text revealing a conspiracy by Lord Mayor and the Pendulum Lodge',
      actionFocus: 'Джулиан расшифровывает заговор высших сановников Весперы',
      narrative: [
        'Шифровальный ключ щёлкает в считывающем пазе. Обугленные дырочки на ленте выстраиваются в зловещий текст:',
        '«ОБЪЕКТ: ВЕЙН. ИЗЪЯТЬ ЯДРО ДО ПОЛУНОЧНОГО БОЯ. ПЕРЕКРЫТИЕ ПАРА В НИЖНИХ КВАРТАЛАХ СФОРМИРУЕТ НУЖНУЮ ПАНИКУ ДЛЯ ВВЕДЕНИЯ ЧРЕЗВЫЧАЙНОГО ПРАВЛЕНИЯ ЛОЖИ. СЕКУНДАНТ НАПРАВЛЕН».',
        '«Они хотят заморозить бедняков в трущобах, чтобы захватить абсолютную власть над городом!» — сжимает кулаки Вивьен.',
      ],
      choices: [
        {
          id: 'c_telegram_advance',
          text: 'Спешить в Катакомбы, зная замысел заговорщиков',
          targetSceneId: 'vesp_catacombs_entry',
          approach: 'Investigative',
          effect: {
            sanityDelta: 15,
            flagsSet: ['knows_conspiracy', 'clue_hale_hand', 'clue_hale_ordered'],
            notification: 'Заговор Ложи раскрыт! (+15 Sanity к решимости).',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-workshop',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 5. Паровые Катакомбы
    vesp_catacombs_entry: {
      id: 'vesp_catacombs_entry',
      chapterTitle: 'Глава II: Лабиринт Клапанов',
      location: 'Паровые Катакомбы Новой Весперы',
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'vast subterranean steampunk vault with giant copper pipes, hissing steam geysers, catwalks suspended over boiling runoff canals',
      actionFocus: 'Джулиан и Вивьен идут по подвесным мосткам сквозь клубы горячего пара',
      narrative: [
        'Паровые Катакомбы дышат, словно спящий левиафан. Тысячи медных труб разного калибра опутывают сводчатые кирпичные тоннели викторианской постройки.',
        'Внизу в кипящих сточных каналах бурлит вода. С мостков вдалеке доносится лязг тяжёлых стальных протезов — патруль наёмников Часовой Ложи прочёсывает сектор.',
        'Впереди — разводной мост к Центральному Маятниковому Узлу, но механизм моста заблокирован паровым клапаном высокого давления.',
      ],
      choices: [
        {
          id: 'c_catacomb_stealth',
          text: 'Обойти патруль по верхним трубам, заглушая шаги шипением пара',
          targetSceneId: 'vesp_steam_valve_puzzle',
          approach: 'Shadow',
          effect: {
            flagsSet: ['league_ally', 'clue_pruitt_dividend'],
          },
        },
        {
          id: 'c_catacomb_shoot_guards',
          text: 'Открыть огонь из Парового Револьвера по наёмникам Ложи',
          targetSceneId: 'vesp_guards_firefight',
          approach: 'Audacious',
          condition: { hasItem: 'relic-wechsler-revolver' },
          effect: {
            flagsSet: ['clue_hale_ordered'],
          },
        },
        {
          id: 'c_catacomb_overload_pipe',
          text: 'Перегрузить перепускной клапан, устроив паровую завесу',
          targetSceneId: 'vesp_steam_valve_puzzle',
          approach: 'Investigative',
          effect: {
            flagsSet: ['clue_pruitt_dividend', 'league_ally'],
          },
        },
      ],
    },

    // 6. Перестрелка с наёмниками
    vesp_guards_firefight: {
      id: 'vesp_guards_firefight',
      chapterTitle: 'Глава II: Свинец и Пар',
      location: 'Подвесные мостки катакомб',
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'gunfight on narrow metal catwalk in steampunk sewer, detective firing heavy steam revolver spitting fire and steam at masked guards',
      actionFocus: 'Джулиан стреляет из револьвера Векслера, сбивая наёмников с мостков',
      narrative: [
        'Вы вскидываете револьвер Векслера. Микробойлер взвывает, и выстрел гремит, как артиллерийский залп! Сноп перегретого пара и свинца разрывает бронзовый щит наёмника.',
        'Ответный залп из пневматических карабинов срезает поручень над вашей головой. Осколок меди задевает щёку, но вражеский строй смят.',
        'Оставшиеся в живых наёмники в панике отступают к Большому Залу Маятника.',
      ],
      choices: [
        {
          id: 'c_after_firefight_loot',
          text: 'Обыскать командира наёмников и забрать патроны и тоник',
          targetSceneId: 'vesp_steam_valve_puzzle',
          approach: 'Audacious',
          effect: {
            healthDelta: -10,
            screenShake: true,
            flagsSet: ['clue_pruitt_dividend', 'clue_hale_ordered'],
            itemsAdded: [
              {
                id: 'item-opiate-tonic',
                name: 'Флакон опиатного тоника',
                category: 'Consumable',
                quantity: 1,
                usable: true,
                description: 'Аптекарский тоник (+25 HP / +25 Sanity).',
                loreNote: 'Трофей с офицера Ложи.',
                useAction: {
                  label: 'Принять тоник',
                  description: 'Восстановить силы.',
                  healthDelta: 25,
                  sanityDelta: 25,
                  consumedOnUse: true,
                },
              },
            ],
            notification: 'Победа в перестрелке! Найден трофейный тоник (получена царапина -10 HP).',
          },
        },
      ],
    },

    // 7. Головоломка клапана
    vesp_steam_valve_puzzle: {
      id: 'vesp_steam_valve_puzzle',
      chapterTitle: 'Глава II: Гидравлический Затвор',
      location: 'Магистральный клапанный узел',
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'vivienne adjusting brass pressure gauge needles with wrench while detective keeps watch on metal platform',
      actionFocus: 'Вивьен сбрасывает критическое давление в паропроводе',
      narrative: [
        'Стрелка гигантского манометра дрожит в красной зоне — 450 фунтов на квадратный дюйм. Если клапан сорвёт, весь сектор ошпарит мгновенно.',
        'Вивьен быстро перенастраивает обводные трубки своим ключом: «Джулиан, держи маховик! Нужно синхронизировать левый выпускной золотник с тактом главного маятника!»',
      ],
      choices: [
        {
          id: 'c_valve_synchronized',
          text: 'Синхронизировать поворот вентиля точно по секундной стрелке Хронометра',
          targetSceneId: 'vesp_inquisitor_chamber',
          approach: 'Arcane',
          condition: { hasItem: 'relic-reverse-chronometer' },
          effect: {
            sanityDelta: 15,
            flagsSet: ['bridge_opened_perfect', 'clue_pruitt_dividend', 'heard_alistair'],
            notification: 'Безупречная синхронизация! Разводной мост опустился без шума.',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-catacombs',
              status: 'completed',
            },
          },
        },
        {
          id: 'c_valve_brute',
          text: 'С силой повернуть клапан наугад, рискуя выбросом пара',
          targetSceneId: 'vesp_inquisitor_chamber',
          approach: 'Audacious',
          effect: {
            healthDelta: -15,
            screenShake: true,
            flagsSet: ['heard_alistair'],
            notification: 'Пар обжёг плечо (-15 HP), но мост открыт.',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-catacombs',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 8. Зал Босса: Появление Автоматона-Инквизитора
    vesp_inquisitor_chamber: {
      id: 'vesp_inquisitor_chamber',
      chapterTitle: 'Глава III: Секундант Правосудия',
      location: 'Зал Большого Маятника',
      isKeyBossEncounter: true,
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'towering ten-foot brass and iron automaton inquisitor with glowing furnace heart, four arms holding giant shears and steam cannon, ticking loudly',
      actionFocus: 'Автоматон-Инквизитор "Секундант" преграждает путь к Маятниковому Ядру',
      narrative: [
        'Мост выводит вас в циклопический восьмиугольный зал. В центре зала мерно раскачивается Большой Маятник Весперы — стотонный золочёный груз, определяющий такт всего мегаполиса.',
        'У подножия пьедестала раздаётся оглушительный паровой свист. Из клубов сажи поднимается титан: **Автоматон-Инквизитор "Секундант"**.',
        'Его корпус отлит из тёмной бронзы, за решёткой груди полыхает угольная топка, а четыре манипулятора сжимают гидравлические клещи и скорострельный картечный пулемёт. Механический динамик хрипит металлом: «ИНСПЕКТОР СТЕРЛИНГ. ВАШЕ ВРЕМЯ ИСТЕКЛО».',
      ],
      choices: [
        {
          id: 'c_boss_combat_shoot',
          text: 'Лобовая атака: вести прицельный огонь по манометру топки из револьвера',
          targetSceneId: 'vesp_inquisitor_combat',
          approach: 'Audacious',
          actionFocusPrompt: 'detective rolling under massive brass mechanical claw firing heavy steam revolver directly into automaton glowing boiler grate',
        },
        {
          id: 'c_boss_relic_chronometer',
          text: 'Применить Хронометр с обратным анкером: загнать часовой механизм автоматона в парадокс',
          targetSceneId: 'vesp_inquisitor_chronometer',
          approach: 'Arcane',
          condition: { hasItem: 'relic-reverse-chronometer' },
          actionFocusPrompt: 'detective activating glowing brass pocketwatch freezing and rewinding the giant automaton movements mid strike',
        },
        {
          id: 'c_boss_relic_whistle',
          text: 'Использовать Акустический свисток Вейна: разрушить гироскоп машины резонансом',
          targetSceneId: 'vesp_inquisitor_whistle',
          approach: 'Investigative',
          condition: { hasItem: 'relic-whistle' },
          actionFocusPrompt: 'companion blowing ultra high frequency copper whistle causing automaton head gears to grind to a smoking halt',
        },
        {
          id: 'c_boss_bargain_sacrifice',
          text: 'Пойти на уступку: пожертвовать репутацией и отдать чертежи отца, чтобы пройти без боя',
          targetSceneId: 'vesp_inquisitor_sacrifice',
          approach: 'Surrender',
        },
      ],
    },

    // 9. Исход А: Лобовой бой с Секундантом
    vesp_inquisitor_combat: {
      id: 'vesp_inquisitor_combat',
      chapterTitle: 'Глава III: Огонь по Бойлеру',
      location: 'Зал Большого Маятника',
      isKeyBossEncounter: true,
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'dramatic explosion of steam and brass fragments as detective lands critical shot on giant automaton chest furnace',
      actionFocus: 'Точный паровой выстрел детонирует главный манометр Секунданта',
      narrative: [
        'Картечь свистит в воздухе, срезая полы вашего плаща. Вы делаете отчаянный подкат под взмах гигантских клещей, упираетесь спиной в колонну и взводите курок.',
        'Выстрел револьвера Векслера вонзается точно в стекло главного манометра! Перегретый пар под давлением 500 атмосфер вырывается наружу, разрывая медные сочленения автоматона изнутри.',
        'Титаническая машина заваливается набок, сотрясая зал, и снопы искр гаснут в растекающемся масле.',
      ],
      choices: [
        {
          id: 'c_combat_boss_victory',
          text: 'Отереть сажу с лица и подняться к пульту Собора Шестерён',
          targetSceneId: 'vesp_cathedral_dais',
          approach: 'Audacious',
          effect: {
            healthDelta: -30,
            sanityDelta: -10,
            screenShake: true,
            flagsSet: ['inquisitor_destroyed_combat', 'heard_alistair', 'clue_hale_ordered'],
            notification: 'Секундант уничтожен в бою! Получены ранения (-30 HP).',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-inquisitor',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 10. Исход Б1: Хронометр
    vesp_inquisitor_chronometer: {
      id: 'vesp_inquisitor_chronometer',
      chapterTitle: 'Глава III: Петля Времени',
      location: 'Зал Большого Маятника',
      isKeyBossEncounter: true,
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'surreal clockwork scene where golden time rift fractures around the automaton, gears spinning backwards in glowing ethereal sparks',
      actionFocus: 'Джулиан нажимает кнопку Хронометра, обращая внутренний ход автоматона вспять',
      narrative: [
        'Клещи Секунданта опускаются на вашу шею. В последнюю долю секунды вы вдавливаете заводную головку Хронометра с обратным анкером.',
        'Реальность со звоном трескается! Время вокруг автоматона начинает бешено вращаться назад: его зубчатые передачи вращаются против часовой стрелки с чудовищным ускорением.',
        'Хрупкие анкерные спуски не выдерживают парадокса обратного хода и со звоном срезаются. Секундант замирает в нелепой позе, заклиненный во временном тупике.',
      ],
      choices: [
        {
          id: 'c_chronometer_boss_victory',
          text: 'Обойти застывшего исполина и взойти к Маятниковому Ядру',
          targetSceneId: 'vesp_cathedral_dais',
          approach: 'Arcane',
          effect: {
            sanityDelta: 20,
            flagsSet: ['inquisitor_temporal_freeze', 'heard_alistair'],
            notification: 'Автоматон обезврежен парадоксом времени (+20 Sanity)!',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-inquisitor',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 11. Исход Б2: Свисток
    vesp_inquisitor_whistle: {
      id: 'vesp_inquisitor_whistle',
      chapterTitle: 'Глава III: Акустический Паралич',
      location: 'Зал Большого Маятника',
      isKeyBossEncounter: true,
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'automaton holding head as internal gyro compass spins violently out of control, steam venting harmlessly from its shoulders',
      actionFocus: 'Вивьен дует в свисток мастера Вейна, дезориентируя машину',
      narrative: [
        'Вивьен подносит медный свисток к губам. Человеческое ухо не слышит звука, но воздух содрогается от ультразвуковой вибрации.',
        'Внутри Секунданта жалобно взвывает гироскопический компас. Логические переключатели машины начинают беспорядочно щёлкать: автоматон теряет координаты цели, разворачивается и начинает крушить собственную пулемётную турель!',
        '«Путь свободен!» — кричит Вивьен, хватая вас за рукав.',
      ],
      choices: [
        {
          id: 'c_whistle_boss_victory',
          text: 'Пробежать мимо обезумевшей машины к главному терминалу',
          targetSceneId: 'vesp_cathedral_dais',
          approach: 'Investigative',
          effect: {
            flagsSet: ['inquisitor_confused', 'heard_alistair'],
            notification: 'Свисток Вейна спас жизни без единого выстрела!',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-inquisitor',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 12. Исход В: Жертва
    vesp_inquisitor_sacrifice: {
      id: 'vesp_inquisitor_sacrifice',
      chapterTitle: 'Глава III: Сделка с Машиной',
      location: 'Зал Большого Маятника',
      isKeyBossEncounter: true,
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'detective handing over a brass cylinder blueprint to automaton chest slot, weary compromised expression, gaslight shadows',
      actionFocus: 'Джулиан отдаёт фамильные чертежи ради спасения Вивьен',
      narrative: [
        '«Стой!» — командуете вы, доставая из нагрудного кармана запечатанный тубус с чертежами своего отца, основателя паровых сетей.',
        'Вы вставляете тубус в приёмный слот автоматона. Секундант считывает герб рода Стерлингов и медленно опускает клещи. «ДАННЫЕ ПРИНЯТЫ. ПРИОРИТЕТ 2. ПРОПУСК РАЗРЕШЁН».',
        'Вивьен смотрит на вас с болью: «Джулиан... ты отдал наследие семьи палачам». Тяжёлый груз компромисса давит на сердце (-30 Sanity).',
      ],
      choices: [
        {
          id: 'c_sacrifice_boss_advance',
          text: 'С тяжёлым сердцем подняться к Маятниковому Ядру',
          targetSceneId: 'vesp_cathedral_dais',
          approach: 'Surrender',
          effect: {
            sanityDelta: -30,
            flagsSet: ['father_blueprints_sacrificed', 'heard_alistair'],
            notification: 'Чертежи отца отданы врагам. Рассудок пошатнулся (-30 Sanity).',
            questUpdate: {
              questId: 'quest-pendulum-core',
              subQuestId: 'sub-inquisitor',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 13. Терминал Маятникового Ядра (Развилка финалов)
    vesp_cathedral_dais: {
      id: 'vesp_cathedral_dais',
      chapterTitle: 'Глава IV: Сердце Новой Весперы',
      location: 'Пульт Собора Шестерён',
      localImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      visualPrompt:
        'magnificent climax hall overlooking sprawling rainy steampunk city through giant clock face, glowing pulsating copper pendulum core in center',
      actionFocus: 'Джулиан и Вивьен стоят перед пультом Маятникового Ядра',
      narrative: [
        'Вы поднимаетесь на застеклённый балкон, расположенный прямо за циферблатом Главных Часов Новой Весперы. Сквозь римские цифры и капли дождя виден весь ночной город — море медных крыш, фонарей и дымящих труб.',
        'На медном постаменте пульсирует оно — **Маятниковое Ядро**. Хрустальная сфера, внутри которой парят золотые шестерни в растворе жидкого флогистона. Оно регулирует давление во всех паропроводах мегаполиса.',
        'Вивьен тяжело дышит: «До полуночи две минуты, Джулиан. Если мы передадим шифр в Магистрат — заговорщиков арестуют, и закон восторжествует. Если ты заберёшь Ядро себе — ты станешь теневым хозяином города. Но если мы отключим его... мы навсегда уничтожим монополию Часовой Ложи, дав людям свободу!»',
      ],
      choices: [
        {
          id: 'c_vesp_ending_justice',
          text: 'Передать данные в полицию и защитить Ядро: Разоблачение Часовой Ложи',
          targetSceneId: 'vesp_ending_justice',
          approach: 'Diplomatic',
          actionFocusPrompt: 'detective transmitting telegraph dispatch while securing the golden pendulum core with badge of office',
          effect: {
            flagsSet: ['vivienne_confessed', 'clue_time_trade', 'clue_hale_hand', 'clue_hale_ordered', 'heard_alistair'],
          },
        },
        {
          id: 'c_vesp_ending_architect',
          text: 'Подчинить Ядро себе: Стать Новым Архитектором Шестерней',
          targetSceneId: 'vesp_ending_architect',
          approach: 'Arcane',
          condition: { minSanity: 40 },
          actionFocusPrompt: 'detective absorbing power from the glowing copper core, adjusting pocketwatch with calculating ambitious smile',
          effect: {
            flagsSet: ['vivienne_confessed', 'clue_time_trade', 'clue_pruitt_dividend', 'heard_alistair'],
          },
        },
        {
          id: 'c_vesp_ending_sabotage',
          text: 'Повернуть аварийный рычаг: Остановить Большой Маятник и разрушить монополию',
          targetSceneId: 'vesp_ending_sabotage',
          approach: 'Audacious',
          actionFocusPrompt: 'companion and detective pulling massive master lever together causing city wide clock hands to stop at twelve',
          effect: {
            flagsSet: ['vivienne_confessed', 'league_ally', 'clue_time_trade', 'heard_alistair'],
          },
        },
      ],
    },

    // 14. Концовка 1: Закон и разоблачение
    vesp_ending_justice: {
      id: 'vesp_ending_justice',
      chapterTitle: 'Финал: Разоблачение Часовой Ложи',
      location: 'Ратуша Новой Весперы на рассвете',
      isEnding: true,
      endingType: 'victory',
      endingTitle: 'Разоблачение Часовой Ложи (Торжество Закона)',
      localImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      visualPrompt:
        'triumphant morning scene in steampunk city, detective Julian in trenchcoat walking out of courthouse with companion as corrupt officials are led away in brass handcuffs',
      actionFocus: 'Инспектор Стерлинг представляет улики против коррумпированных лордов',
      narrative: [
        'Шифровка с признанием уходит по всем полицейским проводам Весперы. С первыми ударами полуночи жандармерия окружает поместья лордов Часовой Ложи.',
        'Заговор раскрыт. Маятниковое Ядро возвращено на безопасный баланс, и пар ровным потоком согревает дома простых рабочих в трущобах.',
        'На рассвете вы стоите на ступенях магистрата рядом с Вивьен. Дождь прекратился, и солнце играет на медных шпилях. Закон выстоял, и имя мастера Вейна очищено навсегда.',
      ],
      choices: [],
    },

    // 15. Концовка 2: Новый Архитектор
    vesp_ending_architect: {
      id: 'vesp_ending_architect',
      chapterTitle: 'Финал: Новый Архитектор Шестерней',
      location: 'Теневой кабинет на вершине Башни Времени',
      isEnding: true,
      endingType: 'victory',
      endingTitle: 'Новый Архитектор Шестерней (Теневая Власть)',
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'dark noir silhouette of detective seated at an opulent brass desk overlooking the nocturnal clockwork city below, glowing pendulum core resting beside his pipe',
      actionFocus: 'Джулиан Стерлинг берёт в руки рычаги абсолютного контроля над городом',
      narrative: [
        'Вы отстраняете руку Вивьен и вводите персональный шифр в терминал Ядра. Городской ритм синхронизируется с биением вашего собственного пульса.',
        'Лорды Ложи теперь в вашей власти: одно нажатие рычага перекрывает пар любому кварталу, объявляя любого противника вне закона.',
        'Вивьен покидает башню, разочарованная вашей жаждой порядка. Вы остаётесь один в роскошном кабинете под мерный стук Маятника. Новая Веспера обрела своего истинного кукловода.',
      ],
      choices: [],
    },

    // 16. Концовка 3: Остановка Маятника
    vesp_ending_sabotage: {
      id: 'vesp_ending_sabotage',
      chapterTitle: 'Финал: Остановка Большого Маятника',
      location: 'Освобождённая Веспера',
      isEnding: true,
      endingType: 'destruction',
      endingTitle: 'Остановка Большого Маятника (Рождение Свободы)',
      localImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      visualPrompt:
        'dramatic celebration in the city streets, people looking up at the stopped giant clocktower with confetti of broken gears in sky, warm festive gaslights',
      actionFocus: 'Главный маятник замирает, освобождая город от тирании монополии',
      narrative: [
        'Вы с Вивьен срываете защитный кожух и опускаете аварийный стопор. С оглушительным скрежетом стотонный маятник замирает в наивысшей точке дуги.',
        'Стрелки всех часов в Новой Веспере останавливаются ровно в полночь. Клапаны высокого давления открываются, распределяя пар децентрализованно по всем районам.',
        'Снизу с улиц доносятся ликующие крики тысяч людей: фабричный свисток замолчал, монополия Ложи обратилась в прах. Город вступил в новую, непредсказуемую эру.',
      ],
      choices: [],
    },

    // 17. Поражение: Здоровье
    vesp_ending_defeat_hp: {
      id: 'vesp_ending_defeat_hp',
      chapterTitle: 'Поражение: Забытый в Стоках',
      location: 'Тёмные каналы катакомб',
      isEnding: true,
      endingType: 'defeat_health',
      endingTitle: 'Забытый в Стоках (Смерть на Мостках)',
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'somber noir scene of detective fedora floating in oily puddle beneath a flickering broken gas lamp',
      actionFocus: 'Джулиан оседает на чугунные плиты от смертельных ранений',
      narrative: [
        'Ожоги перегретого пара и пулевые раны берут своё. Зрение затягивает серая пелена сажи.',
        'Верный револьвер выскальзывает из ослабевших пальцев. Новая Веспера продолжает свой бессердечный механический ход, поглотив ещё одного честного следователя...',
      ],
      choices: [],
    },

    // 18. Поражение: Рассудок
    vesp_ending_defeat_sanity: {
      id: 'vesp_ending_defeat_sanity',
      chapterTitle: 'Поражение: Часовое Безумие',
      location: 'Лабиринт Тикающих Шестерён',
      isEnding: true,
      endingType: 'defeat_sanity',
      endingTitle: 'Часовое Безумие (Крах Разума)',
      localImage: '/src/assets/images/preset_world_neoverse_1791453496951.webp',
      visualPrompt:
        'hallucinatory victorian sketch of detective gripping temples as gears and clock faces twist violently in his vision',
      actionFocus: 'Разум Джулиана не выдерживает давления бесконечного тиканья часов',
      narrative: [
        'Тик. Так. Каждый щелчок секундной стрелки отдаётся в голове ударом кувалды. Вы начинаете видеть шестерни в лицах прохожих, в каплях дождя, в собственных венах.',
        'Логика рассыпается на тысячи сломанных пружин. Вы хохочете в темноте катакомб, вторя мерному грохоту поршней, навсегда потеряв грань между человеком и машиной...',
      ],
      choices: [],
    },
  },
};
