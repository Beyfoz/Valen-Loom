import { WorldModule } from '../types';
import { ITEM_ILLUSTRATIONS } from '../ui/itemIllustrations';

export const astralWorld: WorldModule = {
  id: 'astral',
  title: 'Странствие звёздных островов',
  subtitle: 'Мифическая астральная одиссея',
  genre: 'Mythic Astral Odyssey / Floating Isles',
  coverImage: '/images/preset_world_astral_1791455452771.webp',
  artStyleName: 'Иллюминированный небесный миф',
  artStylePrompt:
    'masterpiece illuminated celestial myth art, luminous starlight gold leaf filigree, glowing cyan cosmic nebulas, floating celestial archipelagos in violet void, crystalline sailing skiffs, mythological fantasy illustration',
  theme: {
    primary: '#818CF8',
    accent: '#38BDF8',
    border: 'rgba(129, 140, 248, 0.35)',
    bgOverlay: 'rgba(10, 8, 22, 0.94)',
    fontFamilyTitle: "'Cinzel', Georgia, serif",
    fontFamilyBody: "'Lora', Georgia, serif",
    glowColor: '#38BDF8',
  },
  protagonist: {
    id: 'char-lyra',
    name: 'Капитан Лира Солис',
    role: 'Капитан небесного корвета «Алкион»',
    affiliation: 'Вольные Звёздные Корсары',
    disposition: 'Protagonist',
    visualDescriptor:
      'daring athletic woman captain in deep midnight-blue coat trimmed with golden astral constellations, billowing silk scarf, wearing a brass star-sextant holster',
    statusNote: 'Рождена под созвездием Серебряного Ястреба. Чувствует течения эфира как собственное дыхание.',
  },
  initialCompanion: {
    id: 'char-orion',
    name: 'Орион Скиталец',
    role: 'Звёздный монах и навигатор',
    affiliation: 'Орден Безмолвного Небосвода',
    disposition: 'Loyal',
    visualDescriptor:
      'tall serene monk in flowing pearl-white and violet robes woven from comet silk, wearing an illuminated bronze astrolabe diadem on forehead',
    statusNote: 'Помнит имена всех погасших звёзд. Хранит тайны небесных путей.',
  },
  initialStats: {
    health: 100,
    maxHealth: 100,
    sanity: 100,
    maxSanity: 100,
  },
  initialAttributes: {
    strength: 12,
    intellect: 13,
    perception: 15,
    charisma: 14,
  },
  endingsList: [
    {
      id: 'astral_ending_beacon',
      title: 'Гавань Первородных Звёзд (Триумф Путешественников)',
      description: 'Маяк зажжён. Золотой луч связывает все парящие острова в единый архипелаг, наступает золотой век мореплавания.',
      hint: 'Зажгите пламя Маяка Первородных при помощи Эфирного Компаса.',
      endingType: 'victory',
      cgUrl: '/images/preset_world_astral_1791455452771.webp',
    },
    {
      id: 'astral_ending_merge',
      title: 'Песнь Левиафанов (Бессмертие в Звёздах)',
      description: 'Лира и корабль «Алкион» сливаются с чистым звёздным эфиром, становясь вечным созвездием хранителей небес.',
      hint: 'Ступите в чашу Маяка и соедините душу с первородным космическим ветром.',
      endingType: 'victory',
      cgUrl: '/images/preset_world_astral_1791453508871.webp',
    },
    {
      id: 'astral_ending_constellations',
      title: 'Возрождение Созвездий (Новая Эра Мира)',
      description: 'Взрыв кометного осколка сеет семена новых звёзд, рождая новые парящие континенты и созвездия.',
      hint: 'Пожертвуйте Осколком Кометы, бросив его в центр чаши Маяка.',
      endingType: 'sacrifice',
      cgUrl: '/images/preset_world_astral_1791455452771.webp',
    },
  ],
  chapters: [
    {
      id: 'astral_night1',
      number: 'Ночь первая',
      title: 'Гавань, где гаснет первая звезда',
      startSceneId: 'astral_prologue_harbor',
      devPreset: { flags: ['toasted_father', 'heard_first_song'] },
    },
    {
      id: 'astral_night2',
      number: 'Ночь вторая',
      title: 'Последняя из спевших',
      startSceneId: 'astral_whale_song',
      devPreset: { flags: ['whale_heard', 'whale_resonant', 'father_truth', 'heard_first_song'] },
    },
    {
      id: 'astral_night3',
      number: 'Ночь третья',
      title: 'Острова Забвения',
      startSceneId: 'astral_lotus_arrival',
      devPreset: { flags: ['lotus_met', 'father_regret', 'father_truth'] },
    },
    {
      id: 'astral_night4',
      number: 'Ночь четвёртая',
      title: 'Пролив Сирен',
      startSceneId: 'astral_siren_strait',
      devPreset: { flags: ['orion_true_name_known', 'admiral_parley'] },
    },
    {
      id: 'astral_night5',
      number: 'Ночь пятая',
      title: 'Сады Звёздных Имён',
      startSceneId: 'astral_selestia_garden',
      devPreset: { flags: ['owl_met', 'name_celest', 'orion_exposed', 'orion_forgiven', 'sang_names'] },
    },
    {
      id: 'astral_night6',
      number: 'Ночь шестая',
      title: 'Врата Эфира и Разлом Тишины',
      startSceneId: 'astral_gates_leviathan',
      devPreset: { flags: ['thread_of_names_ready', 'leviathan_calmed', 'sang_names', 'orion_forgiven', 'admiral_parley'] },
    },
    {
      id: 'astral_night7',
      number: 'Ночь седьмая',
      title: 'Вершина Первой Звезды',
      startSceneId: 'astral_beacon_ascent',
      devPreset: {
        flags: [
          'cradle_reached',
          'beacon_final_choice',
          'toasted_father',
          'heard_first_song',
          'father_truth',
          'sang_names',
          'orion_exposed',
          'admiral_parley',
          'orion_forgiven',
        ],
      },
    },
  ],
  initialInventory: [
    {
      id: 'relic-wind-prism',
      name: 'Призма Звёздного Ветра',
      category: 'Relic',
      rarity: 'relic',
      quantity: 1,
      charges: 3,
      maxCharges: 3,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['relic-wind-prism'],
      description:
        'Огранённый кристалл из окаменевшего северного сияния. Преломляет звёздный ветер и рассеивает космический морок.',
      loreNote:
        'Дар небесных ткачей. Позволяет кораблю совершать немыслимые кульбиты в потоках эфира.',
      useAction: {
        label: 'Сфокусировать призму',
        description: 'Рассеять космическую тьму и уловить попутный звёздный ветер.',
        sanityDelta: 15,
        consumedOnUse: false,
      },
    },
    {
      id: 'relic-comet-shard',
      name: 'Осколок Упавшей Кометы',
      category: 'Relic',
      rarity: 'relic',
      quantity: 1,
      charges: 2,
      maxCharges: 2,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['relic-comet-shard'],
      description:
        'Пульсирующий лазурным жаром фрагмент звёздного ядра. При ударе испускает ослепительный солнечный огонь.',
      loreNote: 'Осколок метеора, пронзившего сердце Великого Звёздного Дракона.',
      useAction: {
        label: 'Высвободить жар кометы',
        description: 'Нанести сокрушительный звёздный урон или растопить кристаллические преграды.',
        consumedOnUse: false,
      },
    },
    {
      id: 'item-ether-elixir',
      name: 'Астральный эликсир эфира',
      category: 'Consumable',
      rarity: 'rare',
      quantity: 2,
      usable: true,
      illustrationUrl: ITEM_ILLUSTRATIONS['item-ether-elixir'],
      description:
        'Светящаяся фиалковая жидкость, собранная из росы парящих лотосов. Заживляет раны и проясняет взор.',
      loreNote: 'Питает душу звёздным светом, отгоняя безмолвие пустоты.',
      useAction: {
        label: 'Испить эликсир',
        description: 'Восстановить 25 здоровья и 25 рассудка.',
        healthDelta: 25,
        sanityDelta: 25,
        consumedOnUse: true,
      },
    },
    {
      id: 'key-star-sextant',
      name: 'Небесный секстант Алкиона',
      category: 'Key',
      rarity: 'rare',
      quantity: 1,
      illustrationUrl: ITEM_ILLUSTRATIONS['key-star-sextant'],
      description:
        'Изящный навигационный прибор из лунного серебра с линзами из звёздного кварца.',
      loreNote: 'Открывает путь сквозь иллюзорные рифы Пояса Эфирных Бурь.',
    },
  ],
  initialQuests: [
    {
      id: 'quest-celestial-haven',
      title: 'Песнь Парящих Островов',
      objective: 'Провести корвет «Алкион» сквозь Эфирный Риф и зажечь Погасший Маяк Первородных Звёзд.',
      status: 'active',
      journalEntry:
        'Корвет «Алкион» вышел из гавани Серебряного Пика. Впереди лежит Великая Небесная Бездна, где между парящими островами рыщут астральные левиафаны. Наша цель — Маяк Первородных Звёзд на острове Небесный Предел.',
      subQuests: [
        {
          id: 'sub-whale-graveyard',
          text: 'Преодолеть Кладбище Звёздных Китов и избежать космических рифов',
          status: 'active',
        },
        {
          id: 'sub-observatory-spire',
          text: 'Исследовать руины Обсерваторного Шпиля на острове Селестия',
          status: 'active',
        },
        {
          id: 'sub-leviathan',
          text: 'Одолеть или усмирить Астрального Левиафана у Врат Эфира',
          status: 'active',
        },
        {
          id: 'sub-beacon-light',
          text: 'Зажечь Погасший Маяк Первородных Звёзд и решить судьбу созвездий',
          status: 'active',
        },
      ],
    },
  ],
  startSceneId: 'astral_deck_scene',
  scenes: {
    // 1. Палуба корвета
    astral_deck_scene: {
      id: 'astral_deck_scene',
      chapterTitle: 'Глава I: Паруса из Северного Сияния',
      location: 'Палуба небесного корвета «Алкион»',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'magnificent celestial fantasy galleon sailing through violet clouds and floating crystalline islands, sails made of shimmering auroras, captain woman at brass helm',
      actionFocus: 'Капитан Лира Солис сжимает штурвал, ведя корвет к парящему архипелагу',
      narrative: [
        'Шёлковые паруса «Алкиона», сотканные из пойманного северного сияния, трепещут под натиском солнечного ветра. Под килем корабля простирается бездонная фиолетовая бездна, усеянная мириадами далёких мерцающих созвездий.',
        'Орион поднимает телескоп из лунного серебра. Его взор прикован к гигантским парящим островам, дрейфующим впереди: «Впереди Кладбище Звёздных Китов, капитан. Эфирные течения там коварны, а древние кости левиафанов притягивают осколки комет».',
        'Перед носом корабля разворачивается развилка звёздных течений: верхний поток кажется тихим, но овеян ледяной мглой, а нижний бурлит от звёздной плазмы, но ведёт кратчайшим путём.',
      ],
      choices: [
        {
          id: 'c_astral_upper_current',
          text: 'Использовать Небесный Секстант и войти в верхний поток с холодной точностью',
          targetSceneId: 'astral_whale_graveyard',
          approach: 'Investigative',
          condition: { hasItem: 'key-star-sextant' },
          actionFocusPrompt: 'captain sighting through celestial brass sextant aligning course with glowing starry navigational lines',
          effect: {
            sanityDelta: 10,
            notification: 'Секстант проложил безопасный курс сквозь звёздные вихри.',
          },
        },
        {
          id: 'c_astral_dive_current',
          text: 'Направить нос корабля в нижний плазменный поток на полной скорости',
          targetSceneId: 'astral_plasma_dive',
          approach: 'Audacious',
          actionFocusPrompt: 'celestial skiff diving steeply through brilliant golden and magenta astral plasma slipstream',
        },
        {
          id: 'c_astral_prism_scout',
          text: 'Активировать Призму Звёздного Ветра, чтобы осветить опасности впереди',
          targetSceneId: 'astral_aurora_drift',
          approach: 'Arcane',
          condition: { hasItem: 'relic-wind-prism' },
        },
      ],
    },

    // 2. Кладбище Звездных Китов
    astral_whale_graveyard: {
      id: 'astral_whale_graveyard',
      chapterTitle: 'Глава I: Кости Левиафанов',
      location: 'Кладбище Звёздных Китов',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'hauntingly beautiful celestial scene of enormous glowing whale skeleton arching over floating isles amidst nebulae, ship gliding silently beneath',
      actionFocus: '«Алкион» бесшумно скользит сквозь исполинские светящиеся рёбра звёздного кита',
      narrative: [
        'Исполинские кости древних звёздных китов парят в невесомости, обвитые серебристыми звёздными лишайниками. Каждый позвонок размером с целый замок, а внутри черепов теплятся затухающие сверхновые.',
        '«Они летели к Маяку до того, как мир разбился на острова, — шепчет Орион, благоговейно касаясь борта. — Их память всё ещё поёт в пустоте».',
        'На одном из парящих костяных островов мерцает нетронутый навигационный кристалл павшего корсара.',
      ],
      choices: [
        {
          id: 'c_graveyard_salvage',
          text: 'Причалить шлюпкой к костяному монолиту и забрать кристалл',
          targetSceneId: 'astral_crystal_salvage',
          approach: 'Investigative',
        },
        {
          id: 'c_graveyard_fly_spire',
          text: 'Не тревожить покой гигантов и взять курс на Обсерваторный Шпиль',
          targetSceneId: 'astral_spire_approach',
          approach: 'Diplomatic',
          effect: {
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-whale-graveyard',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 3. Плазменное пике
    astral_plasma_dive: {
      id: 'astral_plasma_dive',
      chapterTitle: 'Глава I: Огненное Скольжение',
      location: 'Плазменный вихрь Алкиона',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'thrilling action scene of celestial ship buffeted by solar winds and blazing cosmic fire, crew lashing down rigging against the storm',
      actionFocus: 'Лира удерживает штурвал в кипящем солнечном шторме',
      narrative: [
        'Плазменный поток подхватывает «Алкион» со скоростью метеора! Бортовые канаты звенят от напряжения, а медная обшивка раскаляется докрасна.',
        'Вы чудом выводите корабль из водоворота, пронесясь в считанных ярдах от парящего кометного астероида. Скорость позволила срезать полдня пути, но обшивка получила повреждения.',
      ],
      choices: [
        {
          id: 'c_plasma_repaired',
          text: 'Погасить угли на парусах и подойти к острову Селестия',
          targetSceneId: 'astral_spire_approach',
          approach: 'Audacious',
          effect: {
            healthDelta: -15,
            screenShake: true,
            notification: 'Корвет выдержал плазменную бурю! Получены ожоги (-15 HP).',
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-whale-graveyard',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 4. Поиск кристалла
    astral_crystal_salvage: {
      id: 'astral_crystal_salvage',
      chapterTitle: 'Глава I: Слеза Метеора',
      location: 'Остов звёздного кита',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'captain discovering a radiant blue celestial crystal pulsating with pure cosmic light in the heart of an ancient fossil',
      actionFocus: 'Лира извлекает древний Звёздный Резонатор из окаменевшего хрусталя',
      narrative: [
        'Среди окаменевших созвездий в грудной клетке кита вы находите древний Звёздный Резонатор — прибор, способный улавливать песню эфирных существ.',
        'Здесь же уцелел запечатанный сосуд с чистейшим астральным эликсиром, вобравшим в себя свет тысячи комет.',
      ],
      choices: [
        {
          id: 'c_crystal_taken',
          text: 'Поднять артефакты на борт и лететь к Обсерваторному Шпилю',
          targetSceneId: 'astral_spire_approach',
          approach: 'Investigative',
          effect: {
            itemsAdded: [
              {
                id: 'item-ether-elixir',
                name: 'Астральный эликсир эфира',
                category: 'Consumable',
                quantity: 1,
                usable: true,
                description: 'Астральный эликсир (+25 HP / +25 Sanity).',
                loreNote: 'Добыт из остова древнего кита.',
                useAction: {
                  label: 'Испить эликсир',
                  description: 'Восстановить силы.',
                  healthDelta: 25,
                  sanityDelta: 25,
                  consumedOnUse: true,
                },
              },
            ],
            flagsSet: ['has_whale_resonator'],
            notification: 'Получен звёздный эликсир и Резонатор китов!',
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-whale-graveyard',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 5. Подход к Обсерваторному Шпилю
    astral_spire_approach: {
      id: 'astral_spire_approach',
      chapterTitle: 'Глава II: Остров Селестия',
      location: 'Остров Селестия, Обсерваторный Шпиль',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'breathtaking floating island crowned with ancient white marble observatory spire surrounded by spinning planetary rings and brass mirrors',
      actionFocus: 'Лира и Орион высаживаются на мраморные террасы парящего острова',
      narrative: [
        '«Алкион» бросает якорь из звёздной меди у парящего острова Селестия. Беломраморный остров покрыт цветущими лавандовыми садами, чьи лепестки медленно кружатся в невесомости.',
        'Над островом вздымается Обсерваторный Шпиль — грандиозная башня из лунного камня, увенчанная системой вращающихся зеркал и линз.',
        'Орион изучает рунические надписи у подножия башни: «Здесь хранится Звёздная Карта Первородных. Без неё мы не сможем пройти сквозь Пояс Эфирных Бурь к Маяку».',
      ],
      choices: [
        {
          id: 'c_spire_align_mirrors',
          text: 'Сфокусировать луч света с помощью Призмы Звёздного Ветра на главном зеркале',
          targetSceneId: 'astral_spire_aligned',
          approach: 'Arcane',
          condition: { hasItem: 'relic-wind-prism' },
          actionFocusPrompt: 'character focusing prism beam into giant observatory brass lens projecting starmap onto night sky',
        },
        {
          id: 'c_spire_solve_cipher',
          text: 'Разгадать созвездия вручную с помощью Небесного Секстанта',
          targetSceneId: 'astral_spire_aligned',
          approach: 'Investigative',
          condition: { hasItem: 'key-star-sextant' },
        },
        {
          id: 'c_spire_melt_ice',
          text: 'Растопить космический лед на механизме Осколком Упавшей Кометы',
          targetSceneId: 'astral_spire_aligned',
          approach: 'Audacious',
          condition: { hasItem: 'relic-comet-shard' },
        },
        {
          id: 'c_spire_manual_approach',
          text: 'Осмотреть подножие Шпиля и подняться по внешним ступеням',
          targetSceneId: 'astral_spire_aligned',
          approach: 'Investigative',
        },
      ],
    },

    // 6. Шпиль настроен: Звездная карта
    astral_spire_aligned: {
      id: 'astral_spire_aligned',
      chapterTitle: 'Глава II: Созвездия Истины',
      location: 'Купол Обсерваторного Шпиля',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'vast celestial hologram of the galaxy filling the dome room, glowing blue constellations pointing path through dark nebula vortex',
      actionFocus: 'Голограмма звёздной карты открывает безопасный фарватер к Вратам Эфира',
      narrative: [
        'Механизмы шпиля с мелодичным перезвоном оживают. Зеркала поворачиваются, и гигантская трёхмерная проекция созвездий заполняет весь свод купола!',
        'Золотая нить звёздного пути протягивается сквозь самое опасное место небосвода — Врата Эфира. Там, у входа в Небесный Предел, дремлет древний страж.',
        '«Левиафан Эфира... — тихо произносит Орион. — Звёздный Дракон, хранитель первородного пламени. Нам придётся встретиться с ним лицом к лицу».',
      ],
      choices: [
        {
          id: 'c_spire_sail_gates',
          text: 'Поднять паруса корвета и направиться к Вратам Эфира',
          targetSceneId: 'astral_gates_leviathan',
          approach: 'Audacious',
          effect: {
            sanityDelta: 20,
            flagsSet: ['has_celestial_chart'],
            notification: 'Звёздная Карта получена! Вы готовы к решающему переходу (+20 Sanity).',
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-observatory-spire',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 7. Врата Эфира: Появление Левиафана
    astral_gates_leviathan: {
      id: 'astral_gates_leviathan',
      chapterTitle: 'Глава III: Дракон Созвездий',
      location: 'Врата Эфира',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'epic mythological encounter, immense celestial star dragon leviathan woven from nebulas and starlight coiling around colossal floating crystal arches',
      actionFocus: 'Астральный Левиафан вздымается из глубин туманности перед корветом',
      narrative: [
        'Врата Эфира представляют собой циклопическую арку из цельного звёздного хрусталя, повисшую над бездной кипящих туманностей.',
        'Когда «Алкион» приближается к проходу, космическая тьма вскипает. Из глубин эфира поднимается существо колоссальных размеров — **Астральный Левиафан**, Звёздный Дракон-Скиталец.',
        'Его тело сотканно из живого света пульсаров, глаза мерцают серебряным холодом, а размах крыльев затмевает луны. Зверь издаёт утробный гул, заставляющий дрожать мачты корвета.',
      ],
      choices: [
        {
          id: 'c_leviathan_combat',
          text: 'Принять бой: развернуть корвет бортом и дать залп звёздными гарпунами',
          targetSceneId: 'astral_leviathan_combat',
          approach: 'Audacious',
          actionFocusPrompt: 'celestial ship firing glowing harpoons with solar fire lines at the colossal cosmic star dragon',
        },
        {
          id: 'c_leviathan_relic_prism',
          text: 'Использовать Призму Звёздного Ветра: настроить песню эфира в унисон со зверем',
          targetSceneId: 'astral_leviathan_prism',
          approach: 'Arcane',
          condition: { hasItem: 'relic-wind-prism' },
          actionFocusPrompt: 'captain raising prism projecting beautiful harmonious harmonic auroral waves soothing the cosmic beast',
        },
        {
          id: 'c_leviathan_relic_shard',
          text: 'Высвободить силу Осколка Кометы: ослепить Левиафана вспышкой первородного пламени',
          targetSceneId: 'astral_leviathan_shard',
          approach: 'Audacious',
          condition: { hasItem: 'relic-comet-shard' },
          actionFocusPrompt: 'character hurling blazing comet shard creating immense supernova flash momentarily blinding the dragon',
        },
        {
          id: 'c_leviathan_sacrifice',
          text: 'Принести в жертву частицу звёздного света души Лиры: усмирить дракона добровольным даром',
          targetSceneId: 'astral_leviathan_sacrifice',
          approach: 'Surrender',
        },
      ],
    },

    // 8. Исход А: Лобовой бой с Левиафаном
    astral_leviathan_combat: {
      id: 'astral_leviathan_combat',
      chapterTitle: 'Глава III: Битва в Невесомости',
      location: 'Врата Эфира',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'dramatic space naval battle, ship firing blazing balistas at majestic star leviathan, solar flare explosions illuminating ship deck',
      actionFocus: '«Алкион» ведёт отчаянный огонь, маневрируя между хвостом дракона',
      narrative: [
        '«Огонь правого борта!» — командует Лира. Орудия корвета изрыгают залп пылающих звёздных гарпунов. Снаряды вонзаются в плазменную шкуру титана.',
        'Левиафан с яростным рёвом обрушивает хвост на корму корабля. Палуба трещит, осколки лунного дерева разлетаются градом, сбивая экипаж с ног.',
        'Лира лично совершает отчаянный манёвр за штурвалом, пронзая крыло зверя якорным тараном. Исполин отступает вглубь туманности, освобождая створ Врат.',
      ],
      choices: [
        {
          id: 'c_leviathan_combat_pass',
          text: 'Провести повреждённый корабль сквозь Врата к Маяку',
          targetSceneId: 'astral_beacon_dais',
          approach: 'Audacious',
          effect: {
            healthDelta: -35,
            sanityDelta: -10,
            screenShake: true,
            flagsSet: ['leviathan_fought'],
            notification: 'Победа в яростной схватке! Корабль и Лира изранены (-35 HP).',
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-leviathan',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 9. Исход Б1: Призма Ветра
    astral_leviathan_prism: {
      id: 'astral_leviathan_prism',
      chapterTitle: 'Глава III: Песнь Гармонии',
      location: 'Врата Эфира',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'peaceful majestic cosmic communion, captain with prism singing ethereal light song, star dragon leaning huge head down towards ship softly',
      actionFocus: 'Призма Звёздного Ветра сплетает свет корабля с душой Левиафана',
      narrative: [
        'Вы поднимаете Призму Звёздного Ветра над головой. Кристалл начинает вибрировать, излучая волны чистейшего лазурного и изумрудного света.',
        'Орион затягивает древнюю песнь Ордена, и свет призмы преобразуется в гармоническую мелодию, разгоняющую космическую стужу.',
        'Левиафан замирает. Ярость в его глазах уступает место древней мудрости. Исполин склоняет огромную голову к носу «Алкиона», позволяя Лире коснуться своего звёздного рога, и расправляет крылья, указывая путь к Маяку.',
      ],
      choices: [
        {
          id: 'c_leviathan_prism_pass',
          text: 'Пройти сквозь Врата под почётным эскортом Звёздного Дракона',
          targetSceneId: 'astral_beacon_dais',
          approach: 'Arcane',
          effect: {
            sanityDelta: 30,
            flagsSet: ['leviathan_communed'],
            notification: 'Левиафан признал вас истинными хранителями небес (+30 Sanity)!',
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-leviathan',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 10. Исход Б2: Осколок Кометы
    astral_leviathan_shard: {
      id: 'astral_leviathan_shard',
      chapterTitle: 'Глава III: Сверхновая Вспышка',
      location: 'Врата Эфира',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'blinding brilliant flash of gold and blue light from comet shard illuminating the entire astral void as dragon recoils in awe',
      actionFocus: 'Лира раскалывает осколок кометы, ослепляя Левиафана чистым пламенем',
      narrative: [
        'Вы ударяете Осколком Кометы о бронзовый набалдашник штурвала. Звёздный кристалл детонирует с ослепительным сиянием миниатюрной сверхновой звезды!',
        'Волна солнечного жара омывает пространство. Левиафан, чьи глаза привыкли к вечной темноте бездны, отшатывается и сворачивается в защитное кольцо.',
        'Воспользовавшись моментом, «Алкион» на полных парусах проносится сквозь створ Врат Эфира, оставляя ослеплённого зверя позади.',
      ],
      choices: [
        {
          id: 'c_leviathan_shard_pass',
          text: 'Выйти на финишную прямую к острову Небесный Предел',
          targetSceneId: 'astral_beacon_dais',
          approach: 'Audacious',
          effect: {
            flagsSet: ['leviathan_blinded'],
            notification: 'Вспышка кометы расчистила путь!',
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-leviathan',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 11. Исход В: Жертва Лиры
    astral_leviathan_sacrifice: {
      id: 'astral_leviathan_sacrifice',
      chapterTitle: 'Глава III: Дар Звёздного Света',
      location: 'Врата Эфира',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'emotional scene of captain standing on ship prow offering glowing starlight from her chest to the majestic cosmic dragon, bittersweet atmosphere',
      actionFocus: 'Лира отдаёт частицу тепла своей души великому стражу',
      narrative: [
        '«Ты голоден не по плоти, древний, — произносит Лира, выходя на бушприт. — Ты тысячелетиями одинок в этой тьме».',
        'Она раскрывает ладони у груди. Сияющая искра её внутреннего звёздного тепла отделяется от сердца и парит навстречу Левиафану. Зверь вбирает свет, и его пламя теплеет.',
        'Холод пронзает душу Лиры: часть её детских воспоминаний и беззаботной радости растворяется в космосе (-30 Sanity). Левиафан склоняет голову и безмолвно уступает дорогу.',
      ],
      choices: [
        {
          id: 'c_leviathan_sacrifice_pass',
          text: 'Шагнуть сквозь Врата с изменившимся, но непреклонным сердцем',
          targetSceneId: 'astral_beacon_dais',
          approach: 'Surrender',
          effect: {
            sanityDelta: -30,
            flagsSet: ['light_sacrificed'],
            notification: 'Жертва принята. Рассудок пошатнулся от космического холода (-30 Sanity).',
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-leviathan',
              status: 'completed',
            },
          },
        },
      ],
    },

    // 12. Постамент Погасшего Маяка (Развилка финалов)
    astral_beacon_dais: {
      id: 'astral_beacon_dais',
      chapterTitle: 'Глава IV: Погасший Маяк Первородных',
      location: 'Остров Небесный Предел, Вершина Маяка',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'grand mythological climax atop highest floating peak, ancient golden brazier beacon surrounded by empty constellation sockets under infinite starfield',
      actionFocus: 'Лира и Орион стоят у потухшей чаши Первородного Маяка',
      narrative: [
        '«Алкион» причаливает к вершине острова Небесный Предел — наивысшей точке известного мироздания. Здесь небо кажется настолько близким, что звёзды можно коснуться рукой.',
        'Перед вами высится Погасший Маяк Первородных Звёзд — исполинская чаша из белого орихалка. Веками её свет угас, отчего небесные острова отдалялись друг от друга, погружаясь в изоляцию.',
        'Орион оборачивается к Лире: «Час настал, капитан. Мы можем зажечь Маяк и соединить все парящие острова единым безопасным звёздным путём. Мы можем слиться с космическим потоком, став вечными хранителями эфира. Или... мы можем возродить погибшие созвездия, подарив миру новое небо!»',
      ],
      choices: [
        {
          id: 'c_astral_ending_beacon',
          text: 'Зажечь Маяк: Открыть Гавань Первородных Звёзд для всех мореплавателей',
          targetSceneId: 'astral_ending_beacon',
          approach: 'Diplomatic',
          actionFocusPrompt: 'captain igniting the massive brazier unleashing a soaring brilliant golden pillar of light cutting through galaxies',
        },
        {
          id: 'c_astral_ending_merge',
          text: 'Слиться с эфирным потоком: Родить Легенду о Песни Левиафанов',
          targetSceneId: 'astral_ending_merge',
          approach: 'Arcane',
          condition: { minSanity: 40 },
          actionFocusPrompt: 'captain and crew ascending into luminous celestial forms sailing eternal ship among the star constellations',
        },
        {
          id: 'c_astral_ending_constellations',
          text: 'Пожертвовать Осколком Кометы: Возродить Погасшие Созвездия и новый мир',
          targetSceneId: 'astral_ending_constellations',
          approach: 'Audacious',
          actionFocusPrompt: 'character shattering comet shard into the sky creating dozens of new dazzling constellations of starlight',
        },
      ],
    },

    // 13. Концовка 1: Гавань Первородных Звезд
    astral_ending_beacon: {
      id: 'astral_ending_beacon',
      chapterTitle: 'Финал: Гавань Первородных Звёзд',
      location: 'Осиянный Небесный Предел',
      isEnding: true,
      endingType: 'victory',
      endingTitle: 'Гавань Первородных Звёзд (Триумф Путешественников)',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'breathtaking triumphant sunrise across celestial multiverse, glowing bridge of starlight connecting floating islands, fleets of ships arriving happily',
      actionFocus: 'Золотой столб света Маяка соединяет все парящие острова в единый архипелаг',
      narrative: [
        'Пламя взмывает в зенит! Золотой луч Маяка Первородных пронзает ткань пространства, озаряя каждый парящий остров до самого края мироздания.',
        'Эфирные мосты света выстраиваются между островами, и звуки радостных колоколов доносятся из сотен гаваней. Разрозненные миры вновь обрели друг друга.',
        '«Алкион» становится флагманом Великого Небесного Флота, а имя капитана Лиры Солис навсегда вписано золотыми буквами в карты звёздных путей.',
      ],
      choices: [],
    },

    // 14. Концовка 2: Песнь Левиафанов
    astral_ending_merge: {
      id: 'astral_ending_merge',
      chapterTitle: 'Финал: Песнь Левиафанов',
      location: 'Космический Дрейф',
      isEnding: true,
      endingType: 'victory',
      endingTitle: 'Песнь Левиафанов (Бессмертие в Звёздах)',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'mythic transcendent scene of the ship and captain transformed into shimmering starlight constellation gliding alongside cosmic whales',
      actionFocus: 'Лира и «Алкион» становятся вечным созвездием хранителей',
      narrative: [
        'Вы ступаете в чашу Маяка, соединяя душу с первородным эфиром. Дерево «Алкиона» трансформируется в мерцающий звёздный хрусталь, а паруса становятся живым северным сиянием.',
        'Вы и ваша команда выходите за пределы смертной природы. Теперь ваш корабль дрейфует бок о бок со звёздными китами и левиафанами, вечно оберегая странников от тьмы.',
        'По ночам мореплаватели на далёких островах смотрят в небо и загадывают желания, видя летящий среди звёзд корвет «Алкион».',
      ],
      choices: [],
    },

    // 15. Концовка 3: Возрождение Созвездий
    astral_ending_constellations: {
      id: 'astral_ending_constellations',
      chapterTitle: 'Финал: Возрождение Созвездий',
      location: 'Новый Небосвод',
      isEnding: true,
      endingType: 'sacrifice',
      endingTitle: 'Возрождение Созвездий (Новая Эра Мира)',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'spectacular cosmic dawn with dozens of new radiant constellations blooming in the night sky like golden lotus flowers over floating islands',
      actionFocus: 'Взрыв кометного осколка засевает пустоту семенами новых звёзд',
      narrative: [
        'Вы бросаете Осколок Кометы в центр чаши. Взрыв чистой космической материи взметается вверх, рождая тысячи новых звёзд и планет.',
        'Погасшие созвездия вспыхивают с новой, невиданной прежде силой. Пустота заполняется теплом, и новые парящие континенты начинают формироваться из космической пыли.',
        'Мир не просто спасён — он переродился. Вы стоите на мостике своего корабля, готовые отправиться в путешествие по неизведанным звёздам нового неба.',
      ],
      choices: [],
    },

    // 16. Поражение: Здоровье
    astral_ending_defeat_hp: {
      id: 'astral_ending_defeat_hp',
      chapterTitle: 'Поражение: Падение в Бездну',
      location: 'Бездонная пустота эфира',
      isEnding: true,
      endingType: 'defeat_health',
      endingTitle: 'Падение в Бездну (Гибель Корвета)',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'tragic somber painting of burning shattered celestial sails falling down into endless purple starless void',
      actionFocus: '«Алкион» с разломанными мачтами медленно погружается во тьму',
      narrative: [
        'Плазменные бури и когти чудовищ разорвали паруса. Последний штурвал выскальзывает из рук Лиры.',
        'Обломки гордого корвета «Алкион» медленно кружатся, падая в ледяное безмолвие Великой Бездны, где никогда не восходит звёздное солнце...',
      ],
      choices: [],
    },

    // 17. Поражение: Рассудок
    astral_ending_defeat_sanity: {
      id: 'astral_ending_defeat_sanity',
      chapterTitle: 'Поражение: Забвение в Пустоте',
      location: 'Шёпот звёздного холода',
      isEnding: true,
      endingType: 'defeat_sanity',
      endingTitle: 'Забвение в Пустоте (Крах Разума)',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'hallucinatory cosmic artwork of captain drifting with eyes full of cold white stars, fading into pure void',
      actionFocus: 'Разум Лиры растворяется в бесконечной холодности вселенной',
      narrative: [
        'Бесконечность космоса оказалась слишком велика для смертного разума. Лица соратников, координаты и цели стираются из памяти, сменяясь ледяным звёздным шумом.',
        'Вы отпускаете штурвал, зачарованно глядя в бездну с пустой улыбкой. Вы стали пленником вечного космического шёпота, забывшим собственное имя...',
      ],
      choices: [],
    },
  },
};
