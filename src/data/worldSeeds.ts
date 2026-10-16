import { WorldSeed, AppLanguage } from '../types';

export const HERO_BACKDROP_IMAGE =
  '/src/assets/images/hero_title_backdrop_1791455420848.webp';

export const WORLD_SEEDS_RU: WorldSeed[] = [
  {
    id: 'vaelen-citadel',
    title: 'Затопленная цитадель Велена',
    subtitle: 'Готическое глубинное фэнтези · Экспедиция за реликвией',
    genre: 'Тёмное мифическое фэнтези',
    coverImage: '/src/assets/images/preset_world_eldoria_1791455431121.webp',
    artStyleName: 'Кьяроскуро: чернила и масло гримуара',
    artStylePrompt:
      'Hand-crafted dark fantasy oil and ink illustration, dramatic chiaroscuro torchlight against deep obsidian and verdigris shadows, rich painterly brushwork, classic tabletop RPG book art style, muted gold and emerald accents',
    initialLocation: 'Затопленная дамба Велена',
    protagonist: {
      id: 'char-kaelen',
      name: 'Кейлен Вэнс',
      role: 'Искатель клятвенных реликвий',
      affiliation: 'Орден Пепельной Астролябии',
      disposition: 'Protagonist',
      visualDescriptor:
        'Высокий обветренный искатель приключений лет тридцати с резкими чертами лица, тёмные волосы с серебряной прядью убраны назад, бледный тонкий шрам пересекает левую бровь, одет в болотный непромокаемый плащ с пряжкой из полированной латуни поверх тёмной бригантины',
      statusNote: 'Держит незажжённый приливный фонарь на пороге дамбы.',
    },
    initialCompanion: {
      id: 'char-sera',
      name: 'Сера Никс',
      role: 'Опальный архивариус-шифровальщик',
      affiliation: 'Изгнана из Высокого Шпиля',
      disposition: 'Loyal',
      visualDescriptor:
        'Стройная девушка с медными короткими волосами, янтарные глаза за круглыми латунными очками, тёмное шерстяное пальто учёного с серебряными руническими нитями и походная сумка с костяными тубусами для свитков',
      statusNote: 'Изучает приливные письмена вдоль полузатопленной арки.',
    },
    initialQuest: {
      title: 'Корона застывших вод',
      objective:
        'Проникнуть в Затопленную цитадель до наступления прилива солнцестояния и вернуть Астролябию Короля Приливов.',
      status: 'Active',
      updatedTurn: 1,
      journalEntry:
        'Шлюзы Велена распахнулись впервые за сорок зим. Сера убеждена, что внутреннее святилище хранит мыслящий замок памяти, требующий кровь, забытое имя или древнюю реликвию суда.',
      subObjectives: [
        {
          id: 'sub-1',
          text: 'Пересечь Затопленную дамбу и отпереть Внешние шлюзовые врата',
          completed: false,
        },
        {
          id: 'sub-2',
          text: 'Выяснить, какую цену памяти требует Полый Страж',
          completed: false,
        },
        {
          id: 'sub-3',
          text: 'Отыскать Святилище Короля Приливов',
          completed: false,
        },
      ],
    },
    initialInventory: [
      {
        id: 'item-tide-lantern',
        name: 'Погасший приливный фонарь',
        category: 'Relic',
        quantity: 1,
        description:
          'Шестигранный латунный фонарь, фитили которого вспыхивают лишь при звуке древней клятвы или в присутствии утонувших призраков.',
        loreNote: 'Выкован последним смотрителем маяка Велена.',
        acquiredTurn: 1,
      },
      {
        id: 'item-cipher-key',
        name: 'Обсидиановый камертон',
        category: 'Key',
        quantity: 1,
        description:
          'Резонирует на частоте, разрушающей хрупкие соляные чары и пробуждающей спящую каменную кладку.',
        loreNote: 'Похищен Серой из хранилищ Высокого Шпиля.',
        acquiredTurn: 1,
      },
      {
        id: 'item-silver-vial',
        name: 'Флакон дистиллята звёздного света',
        category: 'Consumable',
        quantity: 2,
        description:
          'Возвращает кристальную ясность рассудка и позволяет различать невидимые чернила или призрачные следы на десять минут.',
        loreNote: 'Сварен в уединённом монастыре Грейхейвена.',
        acquiredTurn: 1,
      },
    ],
    openingNode: {
      id: 'node-turn-1',
      turnNumber: 1,
      chapterTitle: 'Глава I: Порог отступающей воды',
      location: 'Затопленная дамба Велена',
      narrative: [
        'Триста долгих лет подземное озеро Велена хранило свои тайны под сорока саженями чёрной ледяной воды. Сегодня ночью, в час мёртвого затмения, вода отступила — обнажив скользкую базальтовую дамбу, вдоль которой выстроились плачущие статуи утонувших королей. Ваш болотный плащ шумит на холодном сквозняке, а круглые латунные очки Серы отражают янтарные отблески вашего факела.',
        'Впереди, заслоняя циклопическую арку Внешних шлюзовых ворот, стоит фигура, которой не было ни на одной карте Ордена: Полый Страж, исполин в покрытых ракушками бронзовых доспехах со свинцовой книгой судеб в руках. Когда ваши сапоги отдаются эхом о камень, Страж медленно поднимает латную перчатку: «Назовите долг, за которым пришли, искатель, или отдайте одно воспоминание как плату за проход».',
      ],
      consequenceSummary:
        'Вы подошли к Затопленной цитадели во время редчайшего отлива и встретили Полого Стража у Внешних шлюзовых ворот.',
      sceneVisualDescription:
        'Kaelen Vance and Sera Nyx standing on a wet basalt causeway before towering submerged gothic stone arches rising from a misty underground lake, confronting a giant barnacle-encrusted bronze knight holding a lead ledger book, warm torchlight reflecting on dark water.',
      presentCharacterIds: ['char-kaelen', 'char-sera'],
      imageUrl: '/src/assets/images/preset_world_eldoria_1791455431121.webp',
      imageResolution: '1K',
      choices: [
        {
          id: 'c-1',
          text: 'Ударить Обсидиановым камертоном о бронзовый нагрудник Стража, чтобы проверить, скован ли он соляными чарами резонанса.',
          approach: 'Arcane',
          consequenceHint: 'Может сломать сковывающее заклятие или спровоцировать немедленный поединок.',
          requiredItem: 'Обсидиановый камертон',
        },
        {
          id: 'c-2',
          text: 'Выступить вперёд, подняв Погасший приливный фонарь, и объявить себя вестником Древнего Двора, возвращающим свет маяка.',
          approach: 'Diplomatic',
          consequenceHint: 'Проверит, признаёт ли древний часовой власть орденской реликвии.',
          requiredItem: 'Погасший приливный фонарь',
        },
        {
          id: 'c-3',
          text: 'Подать Сере тайный знак отвлечь Стража шифровальными свитками, а самому пробраться по узкому полузатопленному парапету в механизм шлюза.',
          approach: 'Shadow',
          consequenceHint: 'Позволит обойти пошлину памяти, но оставит Серу вести переговоры в одиночку.',
        },
      ],
      timestamp: 'Ход 01 · Мёртвое затмение',
    },
  },
  {
    id: 'vespera-clockwork',
    title: 'Медный заговор Новой Весперы',
    subtitle: 'Часовой нуар-детектив · Промышленный шпионаж',
    genre: 'Викторианский часовой нуар',
    coverImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
    artStyleName: 'Гуашь и тушь газового света',
    artStylePrompt:
      'Hand-crafted painterly gouache and ink illustration, Victorian clockwork cyber-noir aesthetic, rain-slicked cobblestones reflecting warm amber gaslights and slate-blue fog, brass automata and airships, expressive graphic novel concept art',
    initialLocation: 'Платформа 9, Главный эфирный вокзал',
    protagonist: {
      id: 'char-corvo',
      name: 'Джулиан Стерлинг',
      role: 'Частный инспектор хронометров',
      affiliation: 'Независимый сыщик',
      disposition: 'Protagonist',
      visualDescriptor:
        'Проницательный детектив лет тридцати восьми с аккуратной тёмной бородкой, одет в тёмный твидовый плащ с поднятым воротником, золотая цепочка карманных часов на бордовом жилете и тёмная от дождя шляпа-федора',
      statusNote: 'Ожидает в паровом тумане Платформы 9 с предсмертным шифром инженера.',
    },
    initialCompanion: {
      id: 'char-automaton',
      name: 'Веспер-7',
      role: 'Заводная почтовая гончая',
      affiliation: 'Привязана к Джулиану',
      disposition: 'Loyal',
      visualDescriptor:
        'Изящный заводной пёс из матовых латунных пластин и тёмного ореха, светящиеся янтарные стеклянные линзы глаз, тонкие пароотводные трубки на холке',
      statusNote: 'Берёт след озона и редкого алхимического масла.',
    },
    initialQuest: {
      title: 'Исчезнувший тринадцатый час',
      objective:
        'Раскрыть, кто убил главного часового мастера Мерсера и похитил Маятниковое Ядро, пока не остановился Великий Регулятор города.',
      status: 'Active',
      updatedTurn: 1,
      journalEntry:
        'Мерсер вложил окровавленную перфокарту мне в ладонь за секунды до падения с мостков вокзала. Все часы в Нижнем квартале уже отстают на три минуты.',
      subObjectives: [
        {
          id: 'sub-v1',
          text: 'Осмотреть роскошный дирижабль «Золотой Левиафан» до его отбытия с Платформы 9',
          completed: false,
        },
        {
          id: 'sub-v2',
          text: 'Расшифровать перфокарту мастера Мерсера',
          completed: false,
        },
      ],
    },
    initialInventory: [
      {
        id: 'item-punchcard',
        name: 'Перфокарта Мерсера из бронзы',
        category: 'Document',
        quantity: 1,
        description:
          'Перфорированная пластина с клеймом Министерства Времени, испачканная лазурным алхимическим маслом.',
        loreNote: 'Подходит только к секретным вычислительным ткацким станкам.',
        acquiredTurn: 1,
      },
      {
        id: 'item-loupe',
        name: 'Эфирный спектроскоп-лупа',
        category: 'Curio',
        quantity: 1,
        description:
          'Складная ювелирная линза, показывающая остаточное тепловое свечение и следы вмешательства в часовые механизмы.',
        loreNote: 'Собрана Джулианом вручную.',
        acquiredTurn: 1,
      },
    ],
    openingNode: {
      id: 'node-turn-1',
      turnNumber: 1,
      chapterTitle: 'Глава I: Туман над девятой платформой',
      location: 'Платформа 9, Главный эфирный вокзал',
      narrative: [
        'Холодный дождь барабанит по сводам Главного вокзала, превращая угольный дым и пар в густой янтарный туман. Сквозь свист швартовочных поршней слышно, как пассажирский дирижабль «Золотой Левиафан» натягивает железные тросы, готовясь к полуночному рейсу. Рядом с вашим сапогом латунные уши Веспера-7 чутко поворачиваются к закрытому трапу.',
        'Два драгуна Синдиката в клеёнчатых шинелях проверяют восковые пропуска, пока дама в бархатном оперном плаще торопливо следит за погрузкой массивного свинцового ящика, от которого исходит мерный, безошибочный ритм похищенного Маятникового Ядра.',
      ],
      consequenceSummary:
        'Вы выследили украденное Маятниковое Ядро на Платформе 9 прямо перед вылетом «Золотого Левиафана».',
      sceneVisualDescription:
        'Julian Sterling in a dark trench coat and Vesper-7 the brass clockwork hound standing on a wet cobblestone train and airship platform at night, warm amber gaslights in the fog, a massive brass airship moored in the background.',
      presentCharacterIds: ['char-corvo', 'char-automaton'],
      imageUrl: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      imageResolution: '1K',
      choices: [
        {
          id: 'cv-1',
          text: 'Подойти к даме в оперном плаще и предъявить перфокарту Мерсера, выдав себя за связного из Министерства.',
          approach: 'Diplomatic',
          consequenceHint: 'Рискованный блеф, который может открыть путь в каюту первого класса.',
          requiredItem: 'Перфокарта Мерсера из бронзы',
        },
        {
          id: 'cv-2',
          text: 'Приказать Весперу-7 проскользнуть под погрузочный кран и перекусить пневматический трос, обрушив ящик на перрон.',
          approach: 'Audacious',
          consequenceHint: 'Не даст Ядру покинуть город, но мгновенно встревожит драгунов.',
        },
        {
          id: 'cv-3',
          text: 'Использовать Эфирный спектроскоп-лупу для сканирования маркировки и проникнуть на борт по балластным цепям снизу.',
          approach: 'Shadow',
          consequenceHint: 'Позволит попасть на борт незамеченным и собрать улики.',
          requiredItem: 'Эфирный спектроскоп-лупа',
        },
      ],
      timestamp: 'Ход 01 · 23:57',
    },
  },
  {
    id: 'astral-archipelago',
    title: 'Странствие звёздных островов',
    subtitle: 'Мифическая небесная одиссея · Космическая картография',
    genre: 'Мифическое астральное фэнтези',
    coverImage: '/src/assets/images/preset_world_astral_1791455452771.webp',
    artStyleName: 'Иллюминированный небесный миф',
    artStylePrompt:
      'Hand-crafted mythic fantasy illustration, floating marble ruins tethered by golden chains in an indigo starlit sky, wooden sky-sailing vessels with luminous sails, rich painterly gouache and gold-leaf accents, classic fantasy book illustration',
    initialLocation: 'Шканцы небесной бригантины «Алкион»',
    protagonist: {
      id: 'char-lyra',
      name: 'Капитан Лира Солис',
      role: 'Астральный картограф и небесный капитан',
      affiliation: 'Вольная гильдия Ткачей Горизонта',
      disposition: 'Protagonist',
      visualDescriptor:
        'Уверенный небесный капитан с заплетёнными серебристо-русыми волосами, глубокий сапфировый адмиральский мундир с золотым небесным шитьём, секстант на груди и обветренное лицо',
      statusNote: 'Стоит у штурвала «Алкиона», приближаясь к дрейфующему острову.',
    },
    initialCompanion: {
      id: 'char-orion',
      name: 'Мастер Торн',
      role: 'Ветеран-квартирмейстер и призыватель звёзд',
      affiliation: 'Экипаж бригантины «Алкион»',
      disposition: 'Loyal',
      visualDescriptor:
        'Широкоплечий старый моряк с седой бородой, заплетённой в косы, латунная подзорная труба под мышкой, тёмно-синий морской бушлат и татуировки звёздных карт на предплечьях',
      statusNote: 'Удерживает якорные цепи от напора звёздного шквала.',
    },
    initialQuest: {
      title: 'Неизведанное девятое созвездие',
      objective:
        'Причалить к дрейфующему Острову Хоров и зажечь Астральный Маяк, пока Пустотный Шквал не поглотил торговые пути.',
      status: 'Active',
      updatedTurn: 1,
      journalEntry:
        'Золотые якорные цепи Острова Хоров были разорваны. Кто-то целенаправленно похищает звёздный янтарь из линзы маяка.',
      subObjectives: [
        {
          id: 'sub-a1',
          text: 'Пришвартовать «Алкион» к разбитому мраморному пирсу Острова Хоров',
          completed: false,
        },
        {
          id: 'sub-a2',
          text: 'Исследовать замолкшую башню маяка',
          completed: false,
        },
      ],
    },
    initialInventory: [
      {
        id: 'item-sextant',
        name: 'Секстант ткача горизонтов',
        category: 'Relic',
        quantity: 1,
        description:
          'Прокладывает безопасные воздушные течения сквозь гравитационные разломы и чует аномалии звёздного эфира.',
        loreNote: 'Передаётся в роду капитанов Солис из поколения в поколение.',
        acquiredTurn: 1,
      },
      {
        id: 'item-flare',
        name: 'Сигнальная ракета из солнечного янтаря',
        category: 'Consumable',
        quantity: 2,
        description:
          'Вспыхивает чистым полуденным сиянием, изгоняющим тварей пустоты или подающим весть далёким кораблям.',
        loreNote: 'Запечатана в герметичную медную гильзу.',
        acquiredTurn: 1,
      },
    ],
    openingNode: {
      id: 'node-turn-1',
      turnNumber: 1,
      chapterTitle: 'Глава I: Цепи дрейфующего Хора',
      location: 'Шканцы небесной бригантины «Алкион»',
      narrative: [
        'Звёздный свет пенится словно фосфоресцирующий прибой о деревянные борта «Алкиона», пока бригантина взмывает на тёплом потоке индиговых облаков. Прямо по курсу раскинулся Остров Хоров — парящий массив беломраморных храмов и кипарисовых рощ, чьи исполинские золотые цепи оборваны и с шипением роняют искры в бездну.',
        'У разбитой пристани маяка уже пришвартован чёрный корсарский люгер. В такелаже мастер Торн замечает мародёров в капюшонах, которые на лебёдках спускают из световой камеры сияющую клеть со звёздным янтарём.',
      ],
      consequenceSummary:
        'Вы нагнали дрейфующий Остров Хоров и застали небесных корсаров за разграблением Астрального Маяка.',
      sceneVisualDescription:
        'Captain Lyra Solis and Master Thorne on the wooden deck of a sky-brigantine sailing through an indigo starlit sky toward floating marble ruins tethered by broken golden chains, a lighthouse glowing in the distance.',
      presentCharacterIds: ['char-lyra', 'char-orion'],
      imageUrl: '/src/assets/images/preset_world_astral_1791455452771.webp',
      imageResolution: '1K',
      choices: [
        {
          id: 'ca-1',
          text: 'С помощью Секстанта поймать гравитационный вихрь под островом и взобраться на утёс маяка с невидимой стороны.',
          approach: 'Investigative',
          consequenceHint: 'Позволит устроить внезапную засаду мародёрам прямо в световой башне.',
          requiredItem: 'Секстант ткача горизонтов',
        },
        {
          id: 'ca-2',
          text: 'Запустить Сигнальную ракету из солнечного янтаря перед носом корсарского люгера и потребовать переговоров по Небесному кодексу.',
          approach: 'Audacious',
          consequenceHint: 'Вынудит капитана корсаров раскрыть свои намерения или принять бой.',
          requiredItem: 'Сигнальная ракета из солнечного янтаря',
        },
        {
          id: 'ca-3',
          text: 'Зацепить гарпунами оборванную золотую цепь острова и притянуть её лебёдками «Алкиона», чтобы остановить падение острова.',
          approach: 'Arcane',
          consequenceHint: 'Спасёт святыню от крушения в Пустотный Шквал до схватки с грабителями.',
        },
      ],
      timestamp: 'Ход 01 · Третья астральная стража',
    },
  },
];

export const WORLD_SEEDS_EN: WorldSeed[] = [
  {
    id: 'vaelen-citadel',
    title: 'The Sunken Citadel of Vaelen',
    subtitle: 'Gothic Abyssal Fantasy · Relic Expedition',
    genre: 'Dark Mythic Fantasy',
    coverImage: '/src/assets/images/preset_world_eldoria_1791455431121.webp',
    artStyleName: 'Chiaroscuro Oil & Ink Grimoire',
    artStylePrompt:
      'Hand-crafted dark fantasy oil and ink illustration, dramatic chiaroscuro torchlight against deep obsidian and verdigris shadows, rich painterly brushwork, classic tabletop RPG book art style, muted gold and emerald accents',
    initialLocation: 'The Drowned Causeway of Vaelen',
    protagonist: {
      id: 'char-kaelen',
      name: 'Kaelen Vance',
      role: 'Oathbound Relic Seeker',
      affiliation: 'Order of the Ashen Astrolabe',
      disposition: 'Protagonist',
      visualDescriptor:
        'Tall weathered adventurer in their early thirties, sharp cheekbones, silver-streaked dark raven hair tied back, a faint pale scar across the left eyebrow, wearing a high-collared moss-green oilskin cloak with a burnished brass astrolabe clasp over dark leather brigandine',
      statusNote: 'Carrying the unlit Tide-Lantern at the threshold of the causeway.',
    },
    initialCompanion: {
      id: 'char-sera',
      name: 'Sera Nyx',
      role: 'Disgraced Archivists’ Cipher',
      affiliation: 'Exiled from the High Spire',
      disposition: 'Loyal',
      visualDescriptor:
        'Slender woman with short copper-red hair, amber eyes behind round brass-rimmed spectacles, wearing a charcoal wool scholar coat lined with silver runic thread and a satchel of bone scroll-cases',
      statusNote: 'Studying the tidal inscriptions along the submerged archway.',
    },
    initialQuest: {
      title: 'The Crown of Still Waters',
      objective:
        'Breach the Sunken Citadel before the Solstice Tide rises and recover the Tide-King’s Astrolabe.',
      status: 'Active',
      updatedTurn: 1,
      journalEntry:
        'The floodgates of Vaelen have parted for the first time in forty winters. Sera believes the inner sanctum is guarded by a sentient memory-lock that demands either blood, a forgotten name, or a relic of the old court.',
      subObjectives: [
        {
          id: 'sub-1',
          text: 'Cross the Drowned Causeway and unlock the Outer Sluice Gate',
          completed: false,
        },
        {
          id: 'sub-2',
          text: 'Decipher why the Hollow Reeve demands a toll of memories',
          completed: false,
        },
        {
          id: 'sub-3',
          text: 'Locate the Sanctum of the Tide-King',
          completed: false,
        },
      ],
    },
    initialInventory: [
      {
        id: 'item-tide-lantern',
        name: 'Unlit Tide-Lantern',
        category: 'Relic',
        quantity: 1,
        description:
          'A hexagonal brass lantern whose wicks only burn in the presence of ancient oaths or submerged phantoms.',
        loreNote: 'Forged by the last lighthouse keeper of Vaelen.',
        acquiredTurn: 1,
      },
      {
        id: 'item-cipher-key',
        name: 'Obsidian Tuning Fork',
        category: 'Key',
        quantity: 1,
        description:
          'Resonates at a pitch that shatters brittle salt-wards and awakens dormant stonework.',
        loreNote: 'Stolen by Sera from the High Spire vaults.',
        acquiredTurn: 1,
      },
      {
        id: 'item-silver-vial',
        name: 'Vial of Starlight Distillate',
        category: 'Consumable',
        quantity: 2,
        description:
          'Restores clarity of mind and reveals invisible ink or spectral footprints for ten minutes.',
        loreNote: 'Brewed in the monastery of Greyhaven.',
        acquiredTurn: 1,
      },
    ],
    openingNode: {
      id: 'node-turn-1',
      turnNumber: 1,
      chapterTitle: 'Chapter I: Threshold of the Receding Tide',
      location: 'The Drowned Causeway of Vaelen',
      narrative: [
        'For three hundred years, the subterranean lake of Vaelen kept its secrets beneath forty fathoms of black water. Tonight, under the pull of a dead eclipse, the waters have drawn back—revealing a slick basalt causeway flanked by weeping statues of drowned kings. Your moss-green cloak snaps in the cold updraft as you stand beside Sera Nyx, whose brass spectacles glint in the amber glow of your torch.',
        'Ahead, blocking the colossal archway of the Outer Sluice Gate, stands a figure that was not in any of the Order’s maps: the Hollow Reeve, a towering sentinel of barnacle-encrusted bronze armour holding a ledger of beaten lead. As your boots echo on the wet stone, the Reeve raises a gauntleted hand. A voice like grinding millstones reverberates from within its helm: "State the debt you come to collect, seeker, or surrender one memory to pay the toll of passage."',
      ],
      consequenceSummary:
        'You arrived at the Sunken Citadel during the eclipse low-tide and encountered the Hollow Reeve guarding the Outer Sluice Gate.',
      sceneVisualDescription:
        'Kaelen Vance and Sera Nyx standing on a wet basalt causeway before towering submerged gothic stone arches rising from a misty underground lake, confronting a giant barnacle-encrusted bronze knight holding a lead ledger book, warm torchlight reflecting on dark water.',
      presentCharacterIds: ['char-kaelen', 'char-sera'],
      imageUrl: '/src/assets/images/preset_world_eldoria_1791455431121.webp',
      imageResolution: '1K',
      choices: [
        {
          id: 'c-1',
          text: 'Strike the Obsidian Tuning Fork against the Reeve’s bronze breastplate to test if its armor is bound by a harmonic salt-ward.',
          approach: 'Arcane',
          consequenceHint: 'May disrupt the sentinel’s binding or provoke an immediate duel.',
          requiredItem: 'Obsidian Tuning Fork',
        },
        {
          id: 'c-2',
          text: 'Step forward with the Unlit Tide-Lantern held high and claim you are an envoy of the Old Court returning the lighthouse flame.',
          approach: 'Diplomatic',
          consequenceHint: 'Tests whether the Reeve recognizes the authority of the Order’s relic.',
          requiredItem: 'Unlit Tide-Lantern',
        },
        {
          id: 'c-3',
          text: 'Signal Sera to distract the Reeve with her archival ciphers while you slip along the flooded parapet ledge into the sluice mechanism.',
          approach: 'Shadow',
          consequenceHint: 'Bypasses the toll but leaves Sera bargaining alone at the gate.',
        },
      ],
      timestamp: 'Turn 01 · Eclipse Low-Tide',
    },
  },
  {
    id: 'vespera-clockwork',
    title: 'The Brass Conspiracy of New Vespera',
    subtitle: 'Clockwork Noir Mystery · Industrial Espionage',
    genre: 'Victorian Clockwork Noir',
    coverImage: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
    artStyleName: 'Gouache & Ink Gaslight Noir',
    artStylePrompt:
      'Hand-crafted painterly gouache and ink illustration, Victorian clockwork cyber-noir aesthetic, rain-slicked cobblestones reflecting warm amber gaslights and slate-blue fog, brass automata and airships, expressive graphic novel concept art',
    initialLocation: 'Platform 9, Grand Aether Terminus',
    protagonist: {
      id: 'char-corvo',
      name: 'Julian Sterling',
      role: 'Private Chronometer Inspector',
      affiliation: 'Independent Investigator',
      disposition: 'Protagonist',
      visualDescriptor:
        'Sharp-featured detective in his late thirties, neatly trimmed dark beard, wearing a charcoal herringbone trench coat with upturned collar, brass pocket-watch chain across a burgundy waistcoat, and a rain-darkened fedora',
      statusNote: 'Waiting in the steam fog of Platform 9 with a dead engineer’s cipher.',
    },
    initialCompanion: {
      id: 'char-automaton',
      name: 'Vesper-7',
      role: 'Clockwork Courier Hound',
      affiliation: 'Bound to Julian',
      disposition: 'Loyal',
      visualDescriptor:
        'Sleek articulated hound crafted from brushed brass plates and dark walnut wood, glowing amber glass optical lenses, miniature steam vents along its shoulders',
      statusNote: 'Tracking the scent of ozone and rare alchemical lubricant.',
    },
    initialQuest: {
      title: 'The Missing Thirteenth Hour',
      objective:
        'Uncover who assassinated Chief Horologist Mercer and stole the Pendulum Core before the city’s Great Regulator stops.',
      status: 'Active',
      updatedTurn: 1,
      journalEntry:
        'Mercer pressed a bloodstained brass punch-card into my palm seconds before falling from the Terminus catwalk. Every clock in the Lower Ward is already running three minutes slow.',
      subObjectives: [
        {
          id: 'sub-v1',
          text: 'Inspect the luxury airship "Gilded Leviathan" before it departs Platform 9',
          completed: false,
        },
        {
          id: 'sub-v2',
          text: 'Decode Mercer’s bloodstained brass punch-card',
          completed: false,
        },
      ],
    },
    initialInventory: [
      {
        id: 'item-punchcard',
        name: 'Mercer’s Brass Punch-Card',
        category: 'Document',
        quantity: 1,
        description:
          'A perforated brass card stamped with the crest of the Ministry of Hours and stained with blue alchemical oil.',
        loreNote: 'Fits only into high-security analytical looms.',
        acquiredTurn: 1,
      },
      {
        id: 'item-loupe',
        name: 'Aether-Spectroscope Loupe',
        category: 'Curio',
        quantity: 1,
        description:
          'A folding jeweler’s lens that reveals residual heat signatures and clockwork tampering.',
        loreNote: 'Custom-built by Julian.',
        acquiredTurn: 1,
      },
    ],
    openingNode: {
      id: 'node-turn-1',
      turnNumber: 1,
      chapterTitle: 'Chapter I: Fog Over Platform Nine',
      location: 'Platform 9, Grand Aether Terminus',
      narrative: [
        'Rain hammers the vaulted glass roof of the Grand Aether Terminus, turning the coal smoke and steam into a thick amber haze. Above the hiss of mooring pistons, the luxury dirigible Gilded Leviathan strains against its iron cables, preparing for an unscheduled midnight departure. Beside your boots, Vesper-7’s brass ears pivot sharply toward the private gangway.',
        'Two Syndicate Dragoons in oilskin greatcoats guard the boarding ramp, checking wax-sealed passes while a woman in a velvet opera cloak hurriedly supervises the loading of a heavy lead-lined crate that hums with the unmistakable cadence of Mercer’s stolen Pendulum Core.',
      ],
      consequenceSummary:
        'You tracked the stolen Pendulum Core to Platform 9 just as the Gilded Leviathan prepares for takeoff.',
      sceneVisualDescription:
        'Julian Sterling in a dark trench coat and Vesper-7 the brass clockwork hound standing on a wet cobblestone train and airship platform at night, warm amber gaslights in the fog, a massive brass airship moored in the background.',
      presentCharacterIds: ['char-corvo', 'char-automaton'],
      imageUrl: '/src/assets/images/preset_world_neoverse_1791455441242.webp',
      imageResolution: '1K',
      choices: [
        {
          id: 'cv-1',
          text: 'Approach the woman in the velvet opera cloak directly and present Mercer’s Brass Punch-Card as if you are her Ministry contact.',
          approach: 'Diplomatic',
          consequenceHint: 'High-stakes bluff that could win you a cabin aboard the airship.',
          requiredItem: 'Mercer’s Brass Punch-Card',
        },
        {
          id: 'cv-2',
          text: 'Send Vesper-7 underneath the cargo crane to sever the pneumatic winch line, dropping the lead-lined crate onto the platform.',
          approach: 'Audacious',
          consequenceHint: 'Prevents the Core from leaving on the airship but alerts the Dragoons.',
        },
        {
          id: 'cv-3',
          text: 'Use the Aether-Spectroscope Loupe to scan the crate’s markings and stow away via the lower ballast chains.',
          approach: 'Shadow',
          consequenceHint: 'Gets you aboard unseen while gathering forensic proof.',
          requiredItem: 'Aether-Spectroscope Loupe',
        },
      ],
      timestamp: 'Turn 01 · 11:57 PM',
    },
  },
  {
    id: 'astral-archipelago',
    title: 'Voyage of the Star-Tethered Isles',
    subtitle: 'Mythic Sky-Sailing Odyssey · Cosmic Cartography',
    genre: 'Mythic Astral Fantasy',
    coverImage: '/src/assets/images/preset_world_astral_1791455452771.webp',
    artStyleName: 'Celestial Illuminated Mythos',
    artStylePrompt:
      'Hand-crafted mythic fantasy illustration, floating marble ruins tethered by golden chains in an indigo starlit sky, wooden sky-sailing vessels with luminous sails, rich painterly gouache and gold-leaf accents, classic fantasy book illustration',
    initialLocation: 'Quarterdeck of the Sky-Brigantine "Halcyon"',
    protagonist: {
      id: 'char-lyra',
      name: 'Captain Lyra Solis',
      role: 'Astral Cartographer & Sky-Captain',
      affiliation: 'Free Guild of Horizon Weavers',
      disposition: 'Protagonist',
      visualDescriptor:
        'Poised sky-captain with braided silver-blonde hair, deep indigo admiral coat with celestial gold embroidery, a sextant slung across her chest, and wind-burned cheeks',
      statusNote: 'At the helm of the Halcyon approaching a drifting shard-isle.',
    },
    initialCompanion: {
      id: 'char-orion',
      name: 'Master Thorne',
      role: 'Veteran Quartermaster & Star-Caller',
      affiliation: 'Crew of the Halcyon',
      disposition: 'Loyal',
      visualDescriptor:
        'Broad-shouldered older sailor with a braided salt-and-pepper beard, brass telescope tucked under one arm, wearing a weathered navy greatcoat and star-chart tattoos along his forearms',
      statusNote: 'Holding the anchor chains steady against the astral gale.',
    },
    initialQuest: {
      title: 'The Uncharted Ninth Constellation',
      objective:
        'Anchor at the drifting Choir-Isle and relight the Astral Beacon before the Void-Squall swallows the shipping lanes.',
      status: 'Active',
      updatedTurn: 1,
      journalEntry:
        'The golden anchor-chains of the Choir-Isle have snapped. Someone—or something—is harvesting the star-amber from its lighthouse.',
      subObjectives: [
        {
          id: 'sub-a1',
          text: 'Dock the Halcyon at the shattered marble pier of the Choir-Isle',
          completed: false,
        },
        {
          id: 'sub-a2',
          text: 'Investigate the silent lighthouse tower',
          completed: false,
        },
      ],
    },
    initialInventory: [
      {
        id: 'item-sextant',
        name: 'Horizon-Weaver Sextant',
        category: 'Relic',
        quantity: 1,
        description:
          'Plots safe wind-lanes through gravity rifts and detects celestial anomalies.',
        loreNote: 'Passed down through three generations of sky-captains.',
        acquiredTurn: 1,
      },
      {
        id: 'item-flare',
        name: 'Sun-Amber Signal Flare',
        category: 'Consumable',
        quantity: 2,
        description:
          'Blazes with pure solar radiance capable of banishing void-wraiths or signaling distant vessels.',
        loreNote: 'Packed in waterproof copper tubes.',
        acquiredTurn: 1,
      },
    ],
    openingNode: {
      id: 'node-turn-1',
      turnNumber: 1,
      chapterTitle: 'Chapter I: Chains of the Drifting Choir',
      location: 'Quarterdeck of the Sky-Brigantine "Halcyon"',
      narrative: [
        'Starlight foams like phosphorescent surf against the wooden hull of the Halcyon as your brigantine crests a rising thermal of indigo clouds. Dead ahead hangs the Choir-Isle—a floating massif of white marble temples and cypress groves whose massive golden tether-chains hang severed, trailing sparks into the abyss below.',
        'At the island’s ruined lighthouse dock, a sleek black corsair cutter is already moored. Through the rigging, Master Thorne spots hooded scavengers winching a glowing cage of star-amber down from the lantern room.',
      ],
      consequenceSummary:
        'You reached the drifting Choir-Isle and discovered sky-corsairs plundering the Astral Beacon.',
      sceneVisualDescription:
        'Captain Lyra Solis and Master Thorne on the wooden deck of a sky-brigantine sailing through an indigo starlit sky toward floating marble ruins tethered by broken golden chains, a lighthouse glowing in the distance.',
      presentCharacterIds: ['char-lyra', 'char-orion'],
      imageUrl: '/src/assets/images/preset_world_astral_1791455452771.webp',
      imageResolution: '1K',
      choices: [
        {
          id: 'ca-1',
          text: 'Use the Horizon-Weaver Sextant to ride the gravity wake beneath the island and board the lighthouse cliff from the blind side.',
          approach: 'Investigative',
          consequenceHint: 'Allows you to ambush the scavengers in the lantern room.',
          requiredItem: 'Horizon-Weaver Sextant',
        },
        {
          id: 'ca-2',
          text: 'Fire a Sun-Amber Signal Flare across the corsair cutter’s bow and demand their parley under the Sky-Admiralty Code.',
          approach: 'Audacious',
          consequenceHint: 'Forces the corsair captain to reveal their motives or engage.',
          requiredItem: 'Sun-Amber Signal Flare',
        },
        {
          id: 'ca-3',
          text: 'Grapple the severed golden tether-chain with the Halcyon’s winches to stabilize the island before confronting the raiders.',
          approach: 'Arcane',
          consequenceHint: 'Prevents the island from drifting into the Void-Squall.',
        },
      ],
      timestamp: 'Turn 01 · Third Astral Watch',
    },
  },
];

export function getWorldSeeds(lang: AppLanguage): WorldSeed[] {
  return lang === 'ru' ? WORLD_SEEDS_RU : WORLD_SEEDS_EN;
}

export const WORLD_SEEDS = WORLD_SEEDS_RU;
