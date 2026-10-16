import { CodexEntry } from '../types';

export function isCodexEntryUnlocked(
  entry: CodexEntry,
  state: {
    flags?: Record<string, boolean>;
    history?: string[];
    inventory?: { id: string }[];
    currentSceneId?: string;
  }
): boolean {
  if (!entry) return false;

  // 1. Direct flag check
  if (entry.unlockFlag && state?.flags?.[entry.unlockFlag]) {
    return true;
  }

  // 2. Starter entries (about protagonist / initial companion, open from beginning)
  if (entry.isStarter) {
    return true;
  }

  // 3. Related visited scenes from narrative history or current scene
  if (entry.relatedScenes && entry.relatedScenes.length > 0) {
    const historySet = new Set(state?.history || []);
    if (state?.currentSceneId) {
      historySet.add(state.currentSceneId);
    }
    for (const sceneId of entry.relatedScenes) {
      if (historySet.has(sceneId)) {
        return true;
      }
    }
  }

  // 4. Related inventory items acquired
  if (entry.relatedItems && entry.relatedItems.length > 0 && state?.inventory) {
    const inventorySet = new Set(state.inventory.map((item) => item.id));
    for (const itemId of entry.relatedItems) {
      if (inventorySet.has(itemId)) {
        return true;
      }
    }
  }

  return false;
}

export const ASTRAL_CODEX: CodexEntry[] = [
  {
    id: 'cx_vyarel',
    title: 'Вьярэль, Звёздный Дракон',
    category: 'Лор',
    unlockFlag: 'heard_first_song',
    content:
      'Первородный архитектор астрального свода. В незапамятные времена Вьярэль спел парящие острова в бытие, закрепив их в эфирных реках силой своего сердечного огня. Его ранение разорвало ткань неба, и теперь острова медленно оседают в нижний туман.',
    hint: 'Прислушайтесь к течениям эфира и первой песне китов.',
    relatedScenes: [
      'astral_whale_song',
      'astral_gates_leviathan',
      'astral_beacon_ascent',
      'astral_cradle_final',
      'astral_ending_dawn',
      'astral_ending_whales',
      'astral_ending_merge',
    ],
    relatedItems: ['relic-comet-shard', 'item-whale-bone-pendant'],
  },
  {
    id: 'cx_beacon_origins',
    title: 'Маяк Первородных Звёзд',
    category: 'Локации',
    unlockFlag: 'heard_first_song',
    content:
      'Колыбель звёздного огня на Небесном Пределе. Когда пламя Маяка горит, нити звёздного света удерживают парящие острова на нужной высоте над бездной. Без Осколка Кометы Маяк обречён навсегда погаснуть с последней звездой Ястреба.',
    hint: 'Узнайте о природе созвездия Серебряного Ястреба.',
    relatedScenes: [
      'astral_prologue_harbor',
      'astral_beacon_ascent',
      'astral_cradle_final',
      'astral_ending_beacon',
    ],
    relatedItems: ['relic-comet-shard', 'item-astral-lantern'],
  },
  {
    id: 'cx_star_whales',
    title: 'Звёздные Киты',
    category: 'Лор',
    unlockFlag: 'father_truth',
    content:
      'Исполинские эфирные создания, дети Вьярэля. Их многоголосые песни продолжают первоначальный гимн Творения. Пока киты поют в эфире, гравитационные течения не дают островам рассыпаться.',
    hint: 'Найдите последнюю из спевших на Кладбище Китов.',
    relatedScenes: [
      'astral_whale_song',
      'astral_whale_graveyard',
      'astral_gates_leviathan',
      'astral_leviathan_truth',
    ],
    relatedItems: ['item-whale-bone-pendant', 'item-celestial-lyre'],
  },
  {
    id: 'cx_song_of_names',
    title: 'Песнь Имён',
    category: 'Лор',
    unlockFlag: 'sang_names',
    content:
      'Древнейший напев, связывающий каждого кита с первородным драконом. Произнесение их истинных имён восстанавливает гармонию эфира и исцеляет раны, нанесённые звёздным зверям людьми.',
    hint: 'Останьтесь на Кладбище Китов до рассвета и спойте Имена.',
    relatedScenes: [
      'astral_whale_song',
      'astral_selestia_garden',
      'astral_gates_leviathan',
      'astral_cradle_final',
    ],
    relatedItems: ['item-celestial-lyre'],
  },
  {
    id: 'cx_hawk_constellation',
    title: 'Созвездие Серебряного Ястреба',
    category: 'Лор',
    unlockFlag: 'toasted_father',
    content:
      'Семь ярких звёзд, венчающих небесный купол. Каждую ночь угасает ровно одна звезда. Когда погаснет седьмая, архипелаг потеряет опору и рухнет в пучину небытия.',
    hint: 'Поднимите традиционный тост перед отплытием корвета.',
    isStarter: true,
    relatedScenes: ['astral_prologue_harbor', 'astral_prologue_crew', 'astral_aurora_drift'],
  },
  {
    id: 'cx_idris_solis',
    title: 'Идрис Солис',
    category: 'Персонажи',
    unlockFlag: 'father_truth',
    content:
      'Отец Лиры, величайший гарпунёр своего поколения. Двенадцать лет назад он вонзил гарпун «Падающая Звезда» в грудь Вьярэля у Врат Эфира, вырвав Осколок Кометы. Позже он осознал содеянное и вернулся, чтобы исправить ошибку ценой собственной жизни.',
    hint: 'Осмотрите гарпун, торчащий из рёбер кита.',
    isStarter: true,
    relatedScenes: [
      'astral_prologue_harbor',
      'astral_whale_song',
      'astral_lotus_arrival',
      'astral_lotus_feast',
    ],
    relatedItems: ['item-harpoon-pendant'],
  },
  {
    id: 'cx_orion_siel',
    title: 'Орион / Сиэль',
    category: 'Персонажи',
    unlockFlag: 'orion_exposed',
    content:
      'Странствующий монах в одеждах из кометного шёлка. На самом деле — Сиэль, последний детёныш звёздных китов, обращённый Орденом Безмолвного Небосвода в человека. Он ведёт Лиру к Маяку, зная, что лишь её огонь способен оживить небо.',
    hint: 'Узнайте тайну Ориона в Садах Селестии.',
    isStarter: true,
    relatedScenes: [
      'astral_prologue_harbor',
      'astral_siren_strait',
      'astral_selestia_garden',
      'astral_observatory_truth',
      'astral_orion_confession',
    ],
    relatedItems: ['item-celestial-lyre'],
  },
  {
    id: 'cx_admiral_vor',
    title: 'Адмирал Кассиан Вор',
    category: 'Персонажи',
    unlockFlag: 'admiral_parley',
    content:
      'Командующий Серебряным Флотом. Холодный прагматик, питающий эфирные турбины кораблей остаточным жаром драконьих костей. Он не злодей, а капитан, спасающий миллионы беженцев ценой гибели древних существ.',
    hint: 'Вступите в переговоры с флагманом Флота.',
    relatedScenes: [
      'astral_admiral_ambush',
      'astral_dreadnought_parley',
      'astral_fleet_encounter',
      'astral_admiral_final',
    ],
    relatedItems: ['item-silver-pass'],
  },
  {
    id: 'cx_silver_fleet',
    title: 'Серебряный Флот',
    category: 'Фракции',
    unlockFlag: 'admiral_parley',
    content:
      'Огромная армада закованных в серебро парящих дредноутов. Они охраняют торговые караваны и ищут любые источники драконьего тепла для поддержания работы своих гравитационных двигателей.',
    hint: 'Встретьтесь с патрулями Серебряного Флота.',
    relatedScenes: [
      'astral_admiral_ambush',
      'astral_dreadnought_parley',
      'astral_fleet_encounter',
      'astral_admiral_final',
    ],
    relatedItems: ['item-silver-pass'],
  },
  {
    id: 'cx_silent_vault_order',
    title: 'Орден Безмолвного Небосвода',
    category: 'Фракции',
    unlockFlag: 'orion_exposed',
    content:
      'Монашеский орден навигатора и хранителей забытых созвездий. Они умеют переплетать память эфира и человеческую плоть, скрывая величайшие тайны звёздного моря.',
    hint: 'Раскройте тайну происхождения навигатора.',
    relatedScenes: [
      'astral_selestia_garden',
      'astral_observatory_truth',
      'astral_gates_leviathan',
    ],
  },
  {
    id: 'cx_alcyon_corvette',
    title: 'Корвет «Алкион»',
    category: 'Фракции',
    unlockFlag: 'toasted_father',
    content:
      'Легендарный небесный корвет Лиры Солис с резным носом в виде лазурной птицы. Его паруса сотканы из эфирного льна, позволяющего ловить даже тончайшие звёздные течения.',
    hint: 'Поднимитесь на палубу корвета.',
    isStarter: true,
    relatedScenes: ['astral_prologue_harbor', 'astral_prologue_crew', 'astral_aurora_drift'],
  },
  {
    id: 'cx_harpoon_star',
    title: 'Гарпун «Падающая Звезда»',
    category: 'Документы',
    unlockFlag: 'father_truth',
    content:
      'Обугленное древко с гравировкой «И. СОЛИС» и припиской: «За четыре тысячи на Осыпающемся. Прости». Реликвия трагической охоты, изменившей судьбу архипелага.',
    hint: 'Найдите гарпун на Кладбище Звёздных Китов.',
    relatedScenes: ['astral_whale_song', 'astral_lotus_arrival', 'astral_lotus_dream'],
    relatedItems: ['item-harpoon-pendant'],
  },
  {
    id: 'cx_secret_return',
    title: 'Песнь Возвращения',
    category: 'Секреты',
    unlockFlag: 'orion_forgiven',
    content:
      'Истинная утраченная гармония Творения. Возвращение Осколка Кометы в лоно Маяка с одновременным пением Имён возвращает Ориону его истинный облик великого белого кита и наполняет звёздное небо вечным светом.',
    hint: 'Простите Ориона и познайте тайну китов.',
    relatedScenes: [
      'astral_orion_confession',
      'astral_cradle_final',
      'astral_ending_return',
      'astral_ending_merge',
    ],
  },
];

export const VAELEN_CODEX: CodexEntry[] = [
  {
    id: 'cx_star_eltar',
    title: 'Звезда Эльтар',
    category: 'Лор',
    unlockFlag: 'knows_crown_truth',
    content:
      'Небесное тело, упавшее на континент три столетия назад. Поймано Орденом Волнолома в «каплю застывшего времени» над Пропастью Чёрных Вод. Звезда до сих пор падает на волосок в год, излучая холодный свет сквозь толщу глубин.',
    hint: 'Осмотрите бронзовую модель Короны в Обсерватории.',
    relatedScenes: [
      'v_abyssal_observatory',
      'v_observatory_star',
      'v_inner_sanctum_approach',
      'v_astrolabe_dais',
      'v_ending_tide_lord',
      'v_ending_dam_break',
      'v_ending_seal_ward',
    ],
    relatedItems: ['relic-astrolabe-ring', 'item-salt-memory-shard-3'],
  },
  {
    id: 'cx_crown_still_waters',
    title: 'Корона Застывших Вод',
    category: 'Локации',
    unlockFlag: 'knows_crown_truth',
    content:
      'Колоссальный гидромагический купол, удерживающий океанские валы над затопленным Веленом. Питается кристаллизованной памятью горожан через золотые кольца Астролябии.',
    hint: 'Изучите чертежи Короны в Скриптории или Обсерватории.',
    relatedScenes: [
      'v_scriptorium_entry',
      'v_scriptorium_archives',
      'v_abyssal_observatory',
      'v_observatory_star',
      'v_astrolabe_dais',
    ],
    relatedItems: ['relic-astrolabe-ring', 'item-scriptorium-rubbing'],
  },
  {
    id: 'cx_three_rules',
    title: 'Три Правила Волнолома',
    category: 'Лор',
    unlockFlag: 'asked_about_eirik',
    content:
      'Завет Ордена для входящих в цитадель: «Не отвечай эху, не называй имя глубине, не отдавай память, не поторговавшись».',
    hint: 'Поговорите с Серой во время переправы к дамбе.',
    isStarter: true,
    relatedScenes: [
      'v_causeway_entrance',
      'v_prologue_salt_vault',
      'v_prologue_crossing',
      'v_causeway_crossing',
    ],
  },
  {
    id: 'cx_hollow_sentinel',
    title: 'Полый Страж',
    category: 'Персонажи',
    unlockFlag: 'knows_eirik_name',
    content:
      'Маршал Врат Эйрик Вэнс, старший брат Кейлена. Первым отдал воспоминания о собственной жизни, чтобы заковать себя в зачарованные латы и охранять мост к Тронному залу.',
    hint: 'Узнайте имя Стража в казармах или реестре свинцовых плит.',
    relatedScenes: [
      'v_tidewarden_barracks',
      'v_barracks_lead_registry',
      'v_abyssal_chasm',
      'v_sentinel_combat',
      'v_sentinel_recall',
      'v_sentinel_defeated',
    ],
  },
  {
    id: 'cx_gatekeeper_oyvin',
    title: 'Привратник Ойвин',
    category: 'Персонажи',
    unlockFlag: 'oyvin_friend',
    content:
      'Соляное эхо в бронзовой решётке ворот. Триста лет скучал в одиночестве. Обожает болтать и готов пропустить любого в обмен на яркое воспоминание о вкусе спелых яблок.',
    hint: 'Поторгуйтесь с голосом в воротах Волнолома.',
    relatedScenes: [
      'v_gate_echo_oyvin',
      'v_gate_echo_chamber',
      'v_sluice_antechamber',
    ],
  },
  {
    id: 'cx_salt_mara',
    title: 'Мара, Безымянная',
    category: 'Персонажи',
    unlockFlag: 'mara_remembered',
    content:
      'Маленькая девочка из древнего Велена, у которой истощился соляной слой памяти. Обратилась в приливного падальщика, но вспомнила колыбельную матери, когда путник поделился воспоминанием.',
    hint: 'Пощадите и верните память существу в Плачущих галереях.',
    relatedScenes: [
      'v_weeping_cloisters',
      'v_cloister_mara',
      'v_mara_confrontation',
    ],
  },
  {
    id: 'cx_sister_isolde',
    title: 'Мать Изольда и Хор',
    category: 'Персонажи',
    unlockFlag: 'shard_lullaby',
    content:
      'Хор Соляных Сестёр, добровольно слившийся со стенами часовни. Они поют вечную колыбельную звезде Эльтар и хранят один из трёх осколков изначальной памяти.',
    hint: 'Спойте колыбельную у Соляного алтаря в Часовне.',
    relatedScenes: [
      'v_salt_chapel',
      'v_chapel_isolde',
      'v_chapel_blessing',
      'v_chapel_memory_vision',
    ],
    relatedItems: ['item-salt-memory-shard-1'],
  },
  {
    id: 'cx_prima_meliora',
    title: 'Прима Мелиор Ксайн',
    category: 'Персонажи',
    unlockFlag: 'knows_archive_plan',
    content:
      'Глава Соляного Архива. Холодная учёная с побережья, верящая, что вечное самопожертвование одного Держателя — справедливая цена за спасение двухсот тысяч жителей Трёх Гаваней.',
    hint: 'Найдите скрытые пометки Мелиор в книгах Скриптория.',
    relatedScenes: [
      'v_scriptorium_entry',
      'v_scriptorium_truth',
      'v_scriptorium_archives',
      'v_throne_prima',
    ],
    relatedItems: ['item-scriptorium-rubbing'],
  },
  {
    id: 'cx_salt_ledger',
    title: 'Реестр Платы',
    category: 'Документы',
    unlockFlag: 'read_ledger',
    content:
      'Свинцовые плиты в осушенных архивах, где выбиты имена сорока тысяч горожан. Среди них записи: «Вэнс, Кейлен: не уплачено» и «Вэнс, Эйрик, Маршал: уплачено полностью — Страж».',
    hint: 'Осмотрите архивные плиты в Скриптории.',
    relatedScenes: [
      'v_scriptorium_archives',
      'v_scriptorium_truth',
      'v_tidewarden_barracks',
      'v_drowned_scriptorium_depths',
      'v_scriptorium_codex',
    ],
  },
  {
    id: 'cx_secret_restored_memory',
    title: 'Возвращённая Память',
    category: 'Секреты',
    unlockFlag: 'heard_king',
    content:
      'Секретный способ обратить Астролябию вспять: назвать каждого из сорока тысяч по имени, объединив три Осколка Памяти (Колыбельной, Присяги и Имени). Тогда люди проснутся и удержат звезду сообща.',
    hint: 'Прикоснитесь к кольцам Астролябии и услышьте эхо Короля.',
    relatedScenes: [
      'v_king_echo',
      'v_astrolabe_dais',
      'v_ending_tide_lord',
      'v_ending_seal_ward',
      'v_ending_return',
    ],
    relatedItems: [
      'item-salt-memory-shard-1',
      'item-salt-memory-shard-2',
      'item-salt-memory-shard-3',
    ],
  },
];

export const VESPERA_CODEX: CodexEntry[] = [
  {
    id: 'cx_pendulum_core',
    title: 'Маятниковое Ядро',
    category: 'Лор',
    unlockFlag: 'heard_alistair',
    content:
      'Колоссальный механизм в Соборе Шестерён, задающий ритм и паровое давление всему мегаполису. Построен тридцать лет назад Алистером Стерлингом и Бартоломью Вейном на кристаллах флогистона.',
    hint: 'Прослушайте цилиндр Алистера Стерлинга.',
    isStarter: true,
    relatedScenes: [
      'vesp_cathedral_dais',
      'vesp_ending_justice',
      'vesp_ending_architect',
      'vesp_ending_sabotage',
    ],
    relatedItems: ['relic-reverse-chronometer', 'relic-wechsler-revolver'],
  },
  {
    id: 'cx_borrowed_time',
    title: 'Время взаймы (Сток)',
    category: 'Лор',
    unlockFlag: 'clue_time_trade',
    content:
      'Экономическая система Новой Весперы. Чтобы Ядро не взорвалось от резонанса, избыточный хроно-потенциал откачивается у бедняков Нижнего Часа и передаётся лордам Верхнего Города в виде «Дивидендов».',
    hint: 'Посетите ломбард «Золотой Миг» или кварталы Нижнего Часа.',
    relatedScenes: [
      'vesp_workshop_scene',
      'vesp_corpse_clues',
      'vesp_vent_trail',
      'vesp_catacombs_entry',
    ],
  },
  {
    id: 'cx_clockwork_lodge',
    title: 'Часовая Ложа',
    category: 'Фракции',
    unlockFlag: 'clue_hale_ordered',
    content:
      'Тайный совет патрициев и верховных инженеров. Лорды Ложи живут более ста сорока лет, выглядя тридцатилетними, расплачиваясь за свою молодость украденными годами рабочих.',
    hint: 'Найдите улики о приказах руководства в морге или кабинете Вейна.',
    relatedScenes: [
      'vesp_decoded_telegram',
      'vesp_guards_firefight',
      'vesp_inquisitor_chamber',
    ],
    relatedItems: ['key-lodge-cipher'],
  },
  {
    id: 'cx_free_hands_league',
    title: 'Лига Свободных Стрелок',
    category: 'Фракции',
    unlockFlag: 'league_ally',
    content:
      'Подпольное сопротивление фабричных механиков и литейщиков под предводительством Мамы Грейс Айронсайд. Они борются за уничтожение Стока и возвращение времени народу.',
    hint: 'Заключите союз с Лигой в их подпольном убежище.',
    isStarter: true,
    relatedScenes: [
      'vesp_workshop_scene',
      'vesp_vent_trail',
      'vesp_catacombs_entry',
      'vesp_steam_valve_puzzle',
    ],
  },
  {
    id: 'cx_edmund_hale',
    title: 'Сэр Эдмунд Хэйл',
    category: 'Персонажи',
    unlockFlag: 'clue_hale_hand',
    content:
      'Комиссар Особого часового отдела, наставник Джулиана и Хронарх Ложи. Пытается уберечь город от катастрофы любой ценой, считая Сток «грязным, но неизбежным долгом».',
    hint: 'Сличите подпись «Э.Х.» на дешифрованной телеграмме.',
    relatedScenes: [
      'vesp_decoded_telegram',
      'vesp_inquisitor_chamber',
      'vesp_cathedral_dais',
    ],
    relatedItems: ['key-lodge-cipher'],
  },
  {
    id: 'cx_lady_pruitt',
    title: 'Леди Оттолин Прюитт',
    category: 'Персонажи',
    unlockFlag: 'clue_pruitt_dividend',
    content:
      'Хранительница Дивидендов. Ей сто сорок лет, но выглядит она на тридцать пять. Вода в её бокале не колышется, а карманные часы замирают в её ладонях.',
    hint: 'Нанесите визит в ложу Оперы «Золотой Анкер».',
    relatedScenes: [
      'vesp_catacombs_entry',
      'vesp_steam_valve_puzzle',
      'vesp_cathedral_dais',
    ],
  },
  {
    id: 'cx_automaton_secundant',
    title: 'Автоматон «Секундант»',
    category: 'Персонажи',
    unlockFlag: 'heard_alistair',
    content:
      'Тяжёлый охранный механизм, в грудь которого вшит фонографический цилиндр Алистера Стерлинга. Глубокий программный приоритет обязывает его защищать род Стерлингов.',
    hint: 'Вскройте грудную пластину автоматона в катакомбах.',
    relatedScenes: [
      'vesp_inquisitor_chamber',
      'vesp_inquisitor_combat',
      'vesp_inquisitor_chronometer',
      'vesp_inquisitor_whistle',
      'vesp_inquisitor_sacrifice',
    ],
    relatedItems: ['relic-whistle'],
  },
  {
    id: 'cx_zero_hour',
    title: 'Нулевой Час',
    category: 'Секреты',
    unlockFlag: 'vivienne_confessed',
    content:
      'Протокол обратного хода Маятника на один период. Возвращает все украденные годы истинным владельцам, обнуляет дивиденды патрициев и превращает Ядро в обычные городские часы.',
    hint: 'Добейтесь признания Вивьен и объедините расчеты Нулевого Часа.',
    relatedScenes: [
      'vesp_cathedral_dais',
      'vesp_ending_justice',
      'vesp_ending_architect',
      'vesp_ending_sabotage',
    ],
  },
];

export function getDefaultWorldCodex(worldId: string): CodexEntry[] {
  if (worldId === 'astral') return ASTRAL_CODEX;
  if (worldId === 'vespera') return VESPERA_CODEX;
  return VAELEN_CODEX;
}
