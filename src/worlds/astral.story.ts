import { StoryPack } from './storyKit';

export const astralStory: StoryPack = {
  worldId: 'astral',
  startSceneId: 'astral_prologue_harbor',
  scenes: {
    astral_prologue_harbor: {
      id: 'astral_prologue_harbor',
      chapterTitle: 'Ночь первая: Гавань, где гаснет первая звезда',
      location: 'Нижние доки Гавани Шпиля',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'floating celestial harbor at twilight, wooden docks tethered to flying islands, a distant star winking out in a silver hawk constellation, young female captain clutching a comet shard talisman, ether mist, atmospheric',
      actionFocus: 'Лира у края причала: первая звезда в созвездии Ястреба гаснет прямо на глазах',
      activeSpeaker: { name: 'Лира', emotion: 'neutral' },
      narrative: [
        'Звезда не падает — она гаснет так, будто кто-то прижал её мокрым пальцем. Только что в правом крыле Серебряного Ястреба дрожал холодный белый огонь, а в следующий миг там осталась лишь слепая сажа неба. Вокруг замирает гавань: звон такелажа стихает, и даже чайки с обгоревшими перьями оседают на канаты без единого крика.',
        'Осколок Кометы на твоей шее отзывается коротким уколом жара под тканью мешочка. Двенадцать лет ты носишь этот кусок звёздного огня. Двенадцать лет люди шепчутся за твоей спиной, что твой отец ранил бога и оставил дочь расплачиваться с небесами.',
        '[Орион|anxious] «Первая, — раздаётся из тени корабельного крана тихий, словно сквозь вату, голос. Орион стоит, прислонившись к просмолённому столбу, и не сводит глаз с пустого места в созвездии. — Осталось шесть. Когда умолкнет седьмая, архипелаг сорвётся вниз, Лира».',
        'В портовой таверне за спиной кто-то поднимает чарку. Последняя кружка крепкого перебродившего эфирного мёда перед долгим выходом в открытую пустоту.',
      ],
      choices: [
        {
          id: 'c_harbor_toast_father',
          text: 'Поднять флягу за Идриса Солиса: «За то, чтобы довести дело до конца»',
          targetSceneId: 'astral_prologue_crew',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          hint: 'Команда вспомнит гарпун отца.',
          effect: {
            sanityDelta: 5,
            flagsSet: ['toasted_father'],
            notification: 'Ты подняла тост за отца. Осколок на миг потеплел.',
          },
        },
        {
          id: 'c_harbor_toast_wind',
          text: 'Плеснуть каплю за борт: «За попутный эфир и крепкий руль»',
          targetSceneId: 'astral_prologue_crew',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            healthDelta: 5,
            notification: 'Эфирные течения принимают подношение.',
          },
        },
        {
          id: 'c_harbor_silent_resolve',
          text: 'Сжать мешочек с осколком и шагнуть на трап молча',
          targetSceneId: 'astral_prologue_crew',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            sanityDelta: -2,
            relationshipDelta: 1,
            companionToast: 'Орион молча кивает твоей решимости.',
            notification: 'Никаких слов. Только долг.',
          },
        },
      ],
    },

    astral_prologue_crew: {
      id: 'astral_prologue_crew',
      chapterTitle: 'Ночь первая: Экипаж «Алкиона»',
      location: 'Кают-компания «Алкиона»',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'cramped brass-trimmed ship cabin illuminated by glowing glass spheres, three crew members gathered around a star chart table, young navigator girl, weathered boatswain, cheeky engineer, tense camaraderie',
      actionFocus: 'Лира собирает экипаж перед отплытием: кому доверить правый борт?',
      activeSpeaker: { name: 'Лира', emotion: 'neutral' },
      narrative: [
        'Кают-компания «Алкиона» пахнет сушёными водорослями, оружейной смазкой и тлеющим можжевельником. Карта островов прижата к столу медным астролябическим циркулем. Три пары глаз смотрят на тебя сквозь табачный дым.',
        '«Алкион» готов к взлёту, но в пустоте между островами каждый капитан держится за того, кто прикрывает спину у штурвала. Твой выбор определит, чей голос будет звучать громче всего в часы беды.',
      ],
      choices: [
        {
          id: 'c_crew_choose_tavi',
          text: 'Позвать Тави «Иглу»: «Мне нужны твои зоркие глаза на марсе, штурман»',
          targetSceneId: 'astral_deck_scene',
          tag: 'DIALOGUE',
          approach: 'Investigative',
          hint: 'Тави будет с тобой до самого Маяка.',
          effect: {
            flagsSet: ['crew_tavi'],
            relationshipDelta: 1,
            notification: 'Тави занимает пост штурмана.',
          },
        },
        {
          id: 'c_crew_choose_kryazh',
          text: 'Хлопнуть по плечу Мирона Кряжа: «Старый волк, держи такелаж и палубу»',
          targetSceneId: 'astral_deck_scene',
          tag: 'CAUTIOUS',
          approach: 'Diplomatic',
          hint: 'Опыт ветерана убережёт от поспешных ошибок.',
          effect: {
            flagsSet: ['crew_kryazh'],
            relationshipDelta: 1,
            notification: 'Боцман Кряж встаёт у главного брашпиля.',
          },
        },
        {
          id: 'c_crew_choose_fray',
          text: 'Окликнуть Джина Фрэя: «Заведи турбины так, чтобы черти взвыли, механик»',
          targetSceneId: 'astral_deck_scene',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          hint: 'Фрэй выжмет предельную тягу из котлов.',
          effect: {
            flagsSet: ['crew_fray'],
            relationshipDelta: 1,
            notification: 'Джин Фрэй уходит в машинное отделение.',
          },
        },
      ],
    },

    astral_aurora_drift: {
      id: 'astral_aurora_drift',
      chapterTitle: 'Ночь первая: Зов в сиянии',
      location: 'Эфирный шлейф Серебряного Потока',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'skiff cutting through glowing green and violet celestial aurora, waves of starlight reflecting on brass hull, ghostly whale silhouette singing in the ether clouds, breathtaking, serene',
      actionFocus: '«Алкион» входит в полосу авроры: из глубины сияния доносится первый отзвук песни китов',
      activeSpeaker: { name: 'Орион', emotion: 'smiling' },
      narrative: [
        'Зелёные и сапфировые волны света захлёстывают фальшборт, как морская пена. Воздух звенит колокольчиками, и волосы на затылке встают дыбом от статического электричества.',
        'И тут сквозь мерное гудение турбин пробивается звук. Это не крик и не музыка — это вибрация огромного, размером с остров, существа, которое поёт в толще пустоты, приветствуя корабль.',
        '[Орион|smiling] «Они ещё живы, Лира, — шепчет Орион, и его глаза на миг вспыхивают первородным лазурным огнём. — Слышишь? Первая песня. Они помнят нас».',
      ],
      choices: [
        {
          id: 'c_aurora_listen_deeply',
          text: 'Вслушаться в частоту песни и записать созвучие',
          targetSceneId: 'astral_whale_graveyard',
          tag: 'RECON',
          approach: 'Investigative',
          hint: 'Открывает знание о китовых песнях.',
          effect: {
            sanityDelta: 6,
            flagsSet: ['heard_first_song'],
            notification: 'Ты уловила гармонию Первой Песни.',
          },
        },
        {
          id: 'c_aurora_push_speed',
          text: 'Поймать гребень эфирной волны и лечь на курс к Кладбищу',
          targetSceneId: 'astral_whale_graveyard',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            healthDelta: 5,
            notification: '«Алкион» скользит по сиянию на предельной скорости.',
          },
        },
      ],
    },

    astral_whale_song: {
      id: 'astral_whale_song',
      chapterTitle: 'Ночь вторая: Последняя из спевших',
      location: 'Сердце Кладбища Звёздных Китов',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'colossal dying star whale drifting among giant glowing ribcages in a nebula, a charred harpoon with a bronze plate lodged in its flank, faint golden ether rippling from its song, a small celestial skiff and a tense young captain at the rail, mournful, cinematic, painterly',
      actionFocus: 'Лира у борта: из рёбер умирающего кита торчит гарпун с именем её отца',
      activeSpeaker: { name: 'Орион', emotion: 'pain' },
      narrative: [
        'Хруст. Не звук — ощущение: кость под килем «Алкиона» лопается, как наст по весне, и по палубе проходит сухая дрожь. Ты замираешь у штурвала. Вокруг парят рёбра, каждое длиннее мачты, и серебряный лишайник осыпается с них пыльцой, оседая на твоих рукавах.',
        'Эфир дрожит. Не ветер — именно эфир: вибрация идёт сквозь подошвы, ложится в зубы, в ключицы, в тот угол груди, где у людей обычно прячется страх. Это не эхо старых песен. Песня идёт сейчас — низкая, тягучая, с длинными паузами, будто певице каждый раз не хватает воздуха на следующую ноту.',
        'Она висит в самом сердце кладбища — последняя из спевших. Бок разорван от плавника до хвоста; из-под рёбер, там, где у неё должно быть сердце, торчит обугленное древко гарпуна. На древке, в бронзе, потемневшей за двенадцать лет, выбито: «И. СОЛИС».',
        'Ты не читаешь надпись — ты узнаёшь почерк. Отец всегда давил на последнюю букву сильнее, чем нужно. Под именем нацарапано ещё что-то, ножом, наспех, когда ему было уже не до красоты: «За четыре тысячи на Осыпающемся. Прости».',
        'Осколок в мешочке на твоей шее теплеет. Не жжёт — подстраивается, как струна, нашедшая чужую ноту. Он узнаёт её песню. Или она — его.',
        '[Орион|pain] «Её зовут…» Он не договаривает. Губы шевелятся, но дальше идёт только эфир — имя, которое человеческий рот произнести не может. Он отворачивается так резко, будто его ударили, и вцепляется в планшир до побелевших пальцев.',
        'Потом он смотрит на тебя. Не на гарпун, не на кита — на тебя. В этом взгляде нет мольбы и нет обвинения. Есть ожидание, такое тяжёлое, что воздух между вами кажется твёрдым. Он ничего не просит. Он ждёт, что ты сделаешь это сама.',
        'Над кладбищем в созвездии Ястреба горят шесть звёзд. К рассвету останется пять. Кит поворачивает к палубе огромный глаз, затянутый молочной плёнкой, и песня срывается на хрип. Она не умирает. Это хуже: она умирает медленно — и всё слышит.',
      ],
      reactivePages: [
        {
          at: 7,
          requiredFlags: ['crew_tavi'],
          text: '[Тави|anxious] «Капитан… там фамилия. Наша. Это ведь не он? Скажи, что это просто какой-то другой Солис». Девчонка прячет руки в рукава, чтобы ты не увидела, как они дрожат.',
        },
        {
          at: 7,
          requiredFlags: ['crew_kryazh'],
          text: '[Кряж|neutral] Боцман снимает шапку. Впервые на твоей памяти. «Так дышат, когда всё уже решили, — глухо говорит он. — Только ещё не умерли. Не тяни, капитан. Что бы ты ни выбрала — не тяни».',
        },
        {
          at: 7,
          requiredFlags: ['crew_fray'],
          text: '[Фрэй|pain] «Я бы пошутил, — тихо говорит механик. — Честно. На такой случай всегда есть что-то в запасе. А сейчас в голове пусто, как в выжженном котле». Он стискивает гаечный ключ так, что костяшки белеют.',
        },
        {
          at: 'end',
          minRelationship: 3,
          text: '[Орион|anxious] Его ладонь на мгновение накрывает твою на планшире — холодная, дрожащая. «Что бы ты ни выбрала… останься рядом, когда станет тихо. Пожалуйста».',
        },
      ],
      choices: [
        {
          id: 'c_song_draw_harpoon',
          text: 'Вырвать гарпун отца и закончить её муку',
          targetSceneId: 'astral_lotus_arrival',
          tag: 'SACRIFICE',
          approach: 'Audacious',
          hint: 'Необратимо: Имя этого кита будет потеряно навсегда.',
          actionFocusPrompt:
            'captain wrenching a charred bronze-plated harpoon out of a dying star whale as golden ether bleeds into the void, bones cracking, crew frozen',
          effect: {
            sanityDelta: -4,
            relationshipDelta: -2,
            companionToast: 'Орион не смотрит на тебя до самого утра.',
            flagsSet: ['father_truth', 'harpoon_drawn', 'name_whale_mother_lost'],
            itemsAdded: [
              {
                id: 'item-solis-harpoon',
                name: 'Гарпун «Падающая Звезда»',
                category: 'Weapon',
                rarity: 'rare',
                quantity: 1,
                description:
                  'Обугленное древко с бронзовой планкой. Остриё до сих пор хранит золотой налёт драконьего огня.',
                loreNote:
                  'Идрис Солис выбил на нём своё имя и приписал: «За четыре тысячи на Осыпающемся. Прости».',
                effectSummary: 'Открывает ветки, связанные с прошлым Идриса Солиса.',
                acquiredLocation: 'Кладбище Звёздных Китов',
              },
            ],
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-whale-graveyard',
              status: 'completed',
            },
            notification: 'Гарпун «Падающая Звезда» теперь у тебя. Песня оборвалась.',
          },
        },
        {
          id: 'c_song_sing_until_dawn',
          text: 'Остаться до рассвета и петь ей Имена',
          targetSceneId: 'astral_lotus_arrival',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          hint: 'Стоит ночи: Серебряный Флот выиграет время.',
          actionFocusPrompt:
            'captain and a glowing human-faced companion singing together on the deck of a skiff beneath a dying star whale, ribbons of gold ether rising like a choir, dawn breaking over giant bones',
          effect: {
            sanityDelta: 8,
            healthDelta: -5,
            relationshipDelta: 2,
            companionToast: 'Орион впервые поёт вместе с тобой.',
            flagsSet: [
              'father_truth',
              'sang_names',
              'laid_offering',
              'night_lost_to_song',
              'name_whale_mother_kept',
            ],
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-whale-graveyard',
              status: 'completed',
            },
            notification: 'Ты потеряла ночь. Серебряный Флот приближается.',
          },
        },
        {
          id: 'c_song_turn_away',
          text: 'Отвернуться и приказать идти дальше',
          targetSceneId: 'astral_lotus_arrival',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          hint: 'Осколок усилится. Правда об отце останется закрытой.',
          actionFocusPrompt:
            'captain turning her back on a dying whale, a small leather pouch at her chest glowing warm gold, crew silently averting their eyes, ship sliding away between giant ribs',
          effect: {
            sanityDelta: -3,
            relationshipDelta: -1,
            flagsSet: ['father_denied', 'shard_warmed'],
            questUpdate: {
              questId: 'quest-celestial-haven',
              subQuestId: 'sub-whale-graveyard',
              status: 'completed',
            },
            notification: 'Осколок горит у груди тёплым, довольным огнём.',
          },
        },
      ],
    },

    astral_lotus_arrival: {
      id: 'astral_lotus_arrival',
      chapterTitle: 'Ночь третья: Острова Забвения',
      location: 'Архипелаг Цветущих Лотосов',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'lush ethereal floating islands overgrown with giant violet and indigo lotus blossoms, sweet fragrant mist, glowing lanterns in willows, velvet pavilion at water edge, mysterious elegant matriarch awaiting on silk cushions',
      actionFocus: '«Алкион» входит в душистый фиолетовый туман Лотосовых Островов',
      activeSpeaker: { name: 'Матушка Лотос', emotion: 'smiling' },
      narrative: [
        'За рифами Кладбища эфир меняет плотность. Исчезает звон ледяных пустот — вместо него на обшивку «Алкиона» ложится тёплый, влажный фиалковый туман, пахнущий мёдом, увядающими лилиями и дождевой пылью. Острова здесь не из камня — они сплетены из корней колоссальных звёздных лотосов, чьи лепестки размером с палубу корабля покачиваются на невидимых волнах.',
        'Над мачтами мерцает небо. В созвездии Серебряного Ястреба остаётся лишь пять звёзд, и третья из них — в левом крыле — уже дрожит бессильным, желтеющим накалом. Времени мало, но ветер стихает сам собой, убаюканный сладким воздухом архипелага.',
        'У причала из сплетённых лоз корабль встречают без оружия. Среди фонарей из лунного шёлка, на усыпанных лепестками ступенях, вас ждёт Матушка Лотос — высокая женщина с глазами цвета старого янтаря и улыбкой той, кто пережил сотни приливов и никуда не торопится.',
        '[Матушка Лотос|smiling] «Добро пожаловать в тихую гавань, капитан Солис. Я помню этот разворот плеч и этот осколок под холщовым мешком. Твой отец сидел на этих же ступенях ровно двенадцать лет назад. Сложи оружие. Никто не уходит отсюда голодным или безутешным».',
      ],
      reactivePages: [
        {
          at: 2,
          requiredFlags: ['crew_tavi'],
          text: '[Тави|anxious] «Капитан… тут воздух такой, будто в подушку лицом уткнулся. Не хочется ни на марс лезть, ни карты смотреть… Это неправильно, Лира». Девочка борется с зевотой.',
        },
        {
          at: 2,
          requiredFlags: ['crew_kryazh'],
          text: '[Кряж|neutral] Боцман затягивает верёвку вокруг предплечья до белизны: «Лотосный дурман. Старики говорили: хлебнёшь здешней воды — забудешь, в каком порту оставил мать. Держи ухо востро, капитан».',
        },
        {
          at: 2,
          requiredFlags: ['crew_fray'],
          text: '[Фрэй|anxious] «Даже котлы стали мурлыкать тише, — бормочет механик, протирая глаза. — Как будто пар превращается в сироп. Мне это не нравится, Лира».',
        },
        {
          at: 'end',
          requiredFlags: ['night_lost_to_song'],
          text: '[Орион|anxious] «Мы потеряли ночь у костей кита, Лира, — тихо шепчет Орион, не спуская глаз с хозяйки сада. — Серебряный Флот уже впереди нас. Не задерживайся здесь».',
        },
      ],
      choices: [
        {
          id: 'c_lotus_accept_hospitality',
          text: 'Принять приглашение и сойти на шёлковый помост',
          targetSceneId: 'astral_lotus_feast',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 4,
            relationshipDelta: 1,
            notification: 'Ты ступаешь под своды шатра Матушки Лотос.',
          },
        },
        {
          id: 'c_lotus_demand_answers',
          text: 'Не выпускать эфес шпаги: «Сначала ответь, что искал здесь Идрис Солис»',
          targetSceneId: 'astral_lotus_feast',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            sanityDelta: 1,
            flagsSet: ['father_regret'],
            notification: 'Матушка Лотос грустно улыбается в ответ на твою настороженность.',
          },
        },
        {
          id: 'c_lotus_stay_vigilant',
          text: 'Приказать экипажу оставаться на борту и сойти на берег с Орионом',
          targetSceneId: 'astral_lotus_feast',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            healthDelta: 5,
            relationshipDelta: 1,
            notification: 'Экипаж остаётся в боевой готовности на «Алкионе».',
          },
        },
      ],
    },

    astral_lotus_feast: {
      id: 'astral_lotus_feast',
      chapterTitle: 'Ночь третья: Пир усыплённых сердец',
      location: 'Шатёр Матушки Лотос',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'opulent interior of floating pavilion, brass censers pouring violet smoke, crystal goblet with glowing nectar, aged wise woman pouring elixir, captain holding glowing pendant, melancholy feast',
      actionFocus: 'Пир в шатре: кубок с росой лотоса и тяжёлые признания об Идрисе Солисе',
      activeSpeaker: { name: 'Матушка Лотос', emotion: 'neutral' },
      narrative: [
        'Шатёр устлан слоями бирюзового и фиалкового бархата. Серебряные курильницы источают сладкий дым, от которого мысли становятся плавными, словно масло в лампе. На низком столике перед тобой стоит кубок из цельного звёздного кварца, до краев наполненный светящейся росой лотоса.',
        '«Идрис был нетерпелив, — говорит Матушка Лотос, проводя тонкими пальцами по краю кубка. — Он пришёл сюда с обгоревшими руками и кровью дракона на сапогах. Он хотел одного: забыть тот крик, который издал Вьярэль, когда гарпун пробил чешую. Он выпил две капли росы — и впервые за много лет уснул без кошмаров».',
        'Она пододвигает кубок ближе. Жидкость внутри переливается золотыми искрами. «Один глоток, капитан Лира. Он исцелит раны на теле и затянет трещины в твоём рассудке. Но плата — один час сна, где прошлое отпускает тебя. Разве ты не устала тащить чужую вину?»',
        'Осколок Кометы на твоей груди вздрагивает, посылая тревожный импульс холода сквозь ткань.',
      ],
      reactivePages: [
        {
          at: 2,
          requiredFlags: ['crew_tavi'],
          text: '[Тави|anxious] Тави заглядывает в шатёр, прижимая к себе штурманскую сумку: «Лира, не пей… У неё в кувшине звёзды плавают, как дохлые мотыльки. Пойдём отсюда».',
        },
        {
          at: 2,
          requiredFlags: ['father_truth'],
          text: '[Орион|pain] Орион сжимает кулаки: «Твой отец бежал от того, что натворил. Он заглушил совесть здесь, а расплачиваться оставил китов и тебя. Не повторяй его бегства».',
        },
        {
          at: 'end',
          minRelationship: 4,
          text: '[Орион|anxious] Орион касается твоего плеча: «Если ты уснёшь, я останусь стеречь. Но обещай, что вернёшься ко мне из морока».',
        },
      ],
      choices: [
        {
          id: 'c_feast_drink_dew',
          text: 'Пригубить Росу Лотоса: смыть боль и принять покой',
          targetSceneId: 'astral_lotus_dream',
          tag: 'SACRIFICE',
          approach: 'Diplomatic',
          hint: 'Восстановит силы, но погрузит в глубокий морок.',
          effect: {
            healthDelta: 15,
            sanityDelta: 15,
            flagsSet: ['lotus_tempted', 'lost_a_night'],
            itemsAdded: [
              {
                id: 'item-lotus-dew',
                name: 'Роса Лотоса',
                category: 'Consumable',
                rarity: 'uncommon',
                quantity: 1,
                usable: true,
                description:
                  'Светящийся нектар из сердца звёздного лотоса. Исцеляет тело, но туманит память сладким забвением.',
                loreNote:
                  'Матушка Лотос собирает эту росу с цветов, цветущих лишь в преддверии гибели созвездий.',
                effectSummary:
                  'Восстанавливает здоровье ценой лёгкого тумана в мыслях.',
                useAction: {
                  label: 'Испить росу',
                  description: 'Восстановить 20 HP ценой ясности ума.',
                  healthDelta: 20,
                  sanityDelta: -5,
                  consumedOnUse: true,
                },
              },
            ],
            notification: 'Ты вкусила Росу Лотоса. Сладкий дурман смывает усталость.',
          },
        },
        {
          id: 'c_feast_refuse_dew',
          text: 'Отодвинуть кубок: «Мне нужна память, а не забвение. Где его дневник?»',
          targetSceneId: 'astral_lotus_dream',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            sanityDelta: -2,
            relationshipDelta: 1,
            flagsSet: ['father_regret'],
            itemsAdded: [
              {
                id: 'item-lotus-dew',
                name: 'Флакон Росы Лотоса',
                category: 'Consumable',
                rarity: 'uncommon',
                quantity: 1,
                usable: true,
                description: 'Запечатанный фиал с эликсиром Матушки Лотос.',
                loreNote: 'Взят с собой как лекарство на чёрный день.',
                effectSummary: 'Целебный эликсир.',
                useAction: {
                  label: 'Использовать флакон',
                  description: 'Восстановить 20 HP.',
                  healthDelta: 20,
                  consumedOnUse: true,
                },
              },
            ],
            notification: 'Ты забираешь фиал с собой, сохранив ясность разума.',
          },
        },
        {
          id: 'c_feast_question_lotus',
          text: 'Всмотреться в глаза Матушки: «Почему ты помогаешь Серебряному Флоту?»',
          targetSceneId: 'astral_lotus_dream',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            sanityDelta: 3,
            relationshipDelta: 1,
            flagsSet: ['admiral_deal_open'],
            notification: 'Матушка признаётся: адмирал Вор брал росу для своих раненых.',
          },
        },
      ],
    },

    astral_lotus_dream: {
      id: 'astral_lotus_dream',
      chapterTitle: 'Ночь третья: Морок об отце',
      location: 'Озеро Иллюзий / Палуба сна',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'surreal dreamscape of floating starry ocean, ghost of a weathered sea captain with a dragon harpoon standing in mist, young female captain reaching out, collapsing ethereal reflections, waking dawn',
      actionFocus: 'Видение Идриса Солиса в зыбком эфирном мареве',
      activeSpeaker: { name: 'Лира', emotion: 'anxious' },
      narrative: [
        'Веки тяжелеют. Пространство шатра растворяется, рассыпаясь фиолетовыми искрами, и ты оказываешься на палубе «Алкиона», дрейфующего посреди бездонного стеклянного зеркала. Вокруг нет звёзд — лишь бесконечная гладь, отражающая пустоту.',
        'У штурвала спиной к тебе стоит человек в потёртой кожаной куртке шкипера. Его руки перевязаны почерневшими бинтами, а за плечом висит тот самый гарпун. Идрис Солис.',
        'Он не оборачивается, но его голос звучит прямо в твоей голове — хриплый, уставший, виноватый: «Лира… ты не должна была идти за мной. Я думал, что если сорву огонь, острова смогут жить вечно. Без тирании небесного дракона. А получилось… получилось, что я просто сломал колесо».',
        'Тень отца делает шаг к борту, указывая рукой на горизонт, где сквозь фиолетовый туман проглядывают скалы Пролива Сирен. «Не слушай их песен, дочка. И не верь тому, кто называет себя Орионом. Он не человек. Он пришёл забрать то, что я украл».',
        'Сон начинает трещать по швам. Третья звезда в созвездии Ястреба вспыхивает прощальной красной искрой и гаснет. Наступает рассвет четвёртой ночи.',
      ],
      reactivePages: [
        {
          at: 3,
          requiredFlags: ['lotus_tempted'],
          text: '[Лира|pain] Сладкий туман лотоса тянет вниз, обещая вечный покой рядом с призраком отца. Руки тяжелеют, пальцы с трудом нащупывают рукоять оружия.',
        },
        {
          at: 3,
          requiredFlags: ['crew_fray'],
          text: '[Фрэй|smiling] Сквозь морок доносится далёкий скрежет железа: «Капитан! Котлы греются, пора сниматься с якоря!» Голос Фрэя помогает зацепиться за реальность.',
        },
        {
          at: 'end',
          minRelationship: 3,
          text: '[Орион|anxious] «Лира, очнись! — сквозь туман прорывается голос Ориона. — Сирены уже чуют нас. Проснись!»',
        },
      ],
      choices: [
        {
          id: 'c_dream_break_vision',
          text: 'Вонзить ногти в ладони, сбросить наваждение и встать к штурвалу',
          targetSceneId: 'astral_siren_strait',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            sanityDelta: 5,
            flagsSet: ['broke_lotus_dream'],
            notification: 'Ты разрываешь морок волей разума. «Алкион» выходит в Пролив.',
          },
        },
        {
          id: 'c_dream_embrace_farewell',
          text: 'Коснуться плеча призрака: «Я прощаю тебя, отец. Но свой путь выберу сама»',
          targetSceneId: 'astral_siren_strait',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 8,
            relationshipDelta: 1,
            flagsSet: ['father_truth', 'broke_lotus_dream'],
            notification: 'Тяжесть на сердце отступает. Ты отпускаешь прошлое.',
          },
        },
        {
          id: 'c_dream_linger_in_mist',
          text: 'Задержаться ещё на миг, пытаясь рассмотреть лицо отца в тумане',
          targetSceneId: 'astral_siren_strait',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            sanityDelta: -5,
            flagsSet: ['lost_a_night'],
            notification: 'Ты промедлила. Драгоценные часы упущены — Флот подошёл ближе.',
          },
        },
      ],
    },

    astral_siren_strait: {
      id: 'astral_siren_strait',
      chapterTitle: 'Ночь четвёртая: Пролив Сирен',
      location: 'Пролив Поющих Рифов',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'dramatic night skiff navigating between jagged floating obsidian reefs, luminous siren-like ether apparitions hovering over water, companion gripping rail in agony, glowing sapphire eyes, stormy celestial skies',
      actionFocus: '«Алкион» среди поющих рифов: сирены зовут спутника Лиры его истинным именем',
      activeSpeaker: { name: 'Орион', emotion: 'pain' },
      narrative: [
        'Пролив Сирен встречает корабль обсидиановыми скалами, висящими в пустоте подобно частоколу гигантских чёрных клыков. Эфирный ветер свистит сквозь расщелины, и в этом свисте рождается многоголосый, леденящий кровь хор. Это не женщины — это светоносные тени, сотканные из звёздной пены и памяти погибших матросов.',
        'Четвёртая звезда в созвездии Серебряного Ястреба угасает на глазах. На небе остаётся всего три огня. Воздух становится сухим и разреженным, а гравитация парящих островов ощутимо вздрагивает.',
        'Песня сирен набирает силу. Она бьёт по барабанным перепонкам, но слова звучат не для тебя. Они обращены к тому, кто стоит у левого борта.',
        '«Сиэль… — шепчут светящиеся тени, скользя вдоль бортов корвета. — Сиэль, дитя Вьярэля! Сбрось чужую человеческую кожу! Вернись в глубь небесной бездны, последний из звёздного выводка! Зачем ты идёшь с той, чей отец пролил нашу кровь?»',
        'Орион падает на колени на доски палубы. Его человеческое лицо искажается судорогой, а сквозь кожу на висках и ладонях проступает пульсирующее сапфировое сияние — такое же, какое ты видела у раненого кита.',
      ],
      reactivePages: [
        {
          at: 3,
          requiredFlags: ['crew_tavi'],
          text: '[Тави|anxious] «Лира! Что с ним?! Его глаза… они светятся, как дно океана!» Тави пятится к мачте, сжимая в руке абордажный кортик.',
        },
        {
          at: 3,
          requiredFlags: ['crew_kryazh'],
          text: '[Кряж|angry] «Я же чуял неладное, — глухо рычит Кряж, опуская руку на топор у бизань-мачты. — Он не из нашей плоти, капитан. Скажи слово — и я свяжу его, пока он не потопил нас всех».',
        },
        {
          at: 3,
          requiredFlags: ['crew_fray'],
          text: '[Фрэй|pain] «Держись за штурвал, Лира! — кричит Фрэй. — Эфирный вихрь затягивает нас на скалы! Разбирайся с парнем, а я удержу тягу!»',
        },
        {
          at: 'end',
          minRelationship: 3,
          text: '[Орион|pain] «Лира… не слушай их… — задыхается Орион, судорожно протягивая к тебе руку. — Я не враг тебе… пожалуйста, помоги мне удержать форму!»',
        },
      ],
      choices: [
        {
          id: 'c_siren_hold_orion',
          text: 'Схватить Ориона за руку и заглушить зов сирен своим голосом',
          targetSceneId: 'astral_admiral_ambush',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          hint: 'Укрепит связь со спутником и раскроет часть правды.',
          effect: {
            sanityDelta: 4,
            relationshipDelta: 2,
            flagsSet: ['heard_siren_truth'],
            notification: 'Ты удерживаешь Ориона от распада. Он шепчет: «Спасибо, Лира…»',
          },
        },
        {
          id: 'c_siren_demand_name',
          text: 'Прижать его к мачте: «Кто ты такой, чёрт возьми?! Почему они зовут тебя Сиэлем?!»',
          targetSceneId: 'astral_admiral_ambush',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            sanityDelta: -3,
            relationshipDelta: -2,
            flagsSet: ['heard_siren_truth'],
            notification: 'Орион прячет взгляд, полный боли и вины.',
          },
        },
        {
          id: 'c_siren_blast_wind',
          text: 'Использовать турбины и Призму Ветра, чтобы прорвать строй сирен',
          targetSceneId: 'astral_admiral_ambush',
          tag: 'CAUTIOUS',
          approach: 'Investigative',
          condition: {
            anyFlags: ['crew_fray'],
            hasItem: 'relic-wind-prism',
          },
          effect: {
            healthDelta: 5,
            flagsSet: ['heard_siren_truth'],
            notification: '«Алкион» с рёвом проносится мимо рифов, оставляя сирен позади.',
          },
        },
      ],
    },

    astral_admiral_ambush: {
      id: 'astral_admiral_ambush',
      chapterTitle: 'Ночь четвёртая: Засада Серебряного Флота',
      location: 'Выход из Пролива Сирен / Борт дредноута «Вектор»',
      localImage: '/images/preset_world_astral_1791455452771.webp',
      visualPrompt:
        'massive brass-armored celestial battleship looming out of the ether mists, spotlights targeting a small skiff, stern aristocratic admiral in silver-embroidered naval coat standing on bridge rail, tense standoff',
      actionFocus: 'Адмирал Кассиан Вор преграждает путь «Алкиону» на выходе из пролива',
      activeSpeaker: { name: 'Адмирал Вор', emotion: 'neutral' },
      narrative: [
        'Едва вой сирен затихает за кормой, как туман впереди вспыхивает резкими лучами эфирных прожекторов. Из мглы бесшумно выплывает исполинский бронированный корпус — флагман Серебряного Флота, броненосец «Вектор». Его сдвоенные паро-эфирные орудия наведены прямо на нос «Алкиона».',
        'На верхней галерее флагмана, опершись на трость с набалдашником из звёздного серебра, стоит адмирал Кассиан Вор. Его парадный мундир безупречен, а в ледяных серых глазах нет ярости — лишь холодная точность флотоводца, сделавшего строгий математический расчёт.',
        '[Адмирал Вор|neutral] «Капитан Лира Солис. Я ожидал вас раньше. Впрочем, если вы тратили ночи на кладбищенские песни и лотосные сны, неудивительно, что созвездие Ястреба уже наполовину мертво. На небе осталось всего три звезды».',
        'Он поднимает перчатку, и орудийные расчёты замирают. «Я здесь не для того, чтобы топить ваш корвет. Моя цель — спасти семьдесят тысяч душ на нижних островах. Если Маяк не получит искру, архипелаг рухнет в бездну. Отдайте мне Осколок Кометы, Лира. Мои инженеры знают, как извлечь из него энергию без сказок о поющих драконах».',
      ],
      reactivePages: [
        {
          at: 2,
          anyFlags: ['night_lost_to_song', 'lost_a_night'],
          text: '[Адмирал Вор|neutral] «Вы потеряли драгоценную ночь, Лира, — холодно добавляет адмирал. — Пока вы искали романтику среди костей, мои дозорные закрыли все фарватеры к Селестии. Вы в ловушке».',
        },
        {
          at: 2,
          requiredFlags: ['crew_kryazh'],
          text: '[Кряж|neutral] Кряж сплёвывает за борт: «Вор не стреляет сразу. Значит, боится, что от залпа осколок сдетонирует и разнесёт его корыто. Держи марку, капитан».',
        },
        {
          at: 3,
          requiredFlags: ['heard_siren_truth'],
          text: '[Орион|angry] «Не слушай его, Лира! — тихо, но твёрдо говорит Орион. — Он сожжёт осколок в топках своего флагмана! Архипелаг продержится год, а потом рухнет навсегда вместе с костями Вьярэля!»',
        },
        {
          at: 'end',
          requiredFlags: ['crew_tavi'],
          text: '[Тави|anxious] Тави шепчет из-за штурвала: «Капитан, у них орудийные порты открыты… скажи, куда рулить».',
        },
      ],
      choices: [
        {
          id: 'c_ambush_parley',
          text: 'Вступить в переговоры: «Покажите ваши расчёты, адмирал. Мы оба хотим спасти острова»',
          targetSceneId: 'astral_spire_approach',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          hint: 'Открывает возможность союза с Адмиралом.',
          effect: {
            sanityDelta: 3,
            relationshipDelta: -1,
            flagsSet: ['admiral_parley', 'admiral_deal_open'],
            itemsAdded: [
              {
                id: 'item-admiral-seal',
                name: 'Сигнальная Печать Адмирала',
                category: 'Key',
                rarity: 'rare',
                quantity: 1,
                description:
                  'Тяжёлый серебряный перстень с гербом Серебряного Флота. Даёт свободный проход через патрули.',
                loreNote:
                  'Вор бросил её на палубу «Алкиона» как залог будущей сделки у Врат.',
                effectSummary:
                  'Облегчает переговоры с Флотом и открывает альтернативные исходы.',
              },
            ],
            notification:
              'Адмирал соглашается пропустить вас к Селестии для повторной встречи у Врат.',
          },
        },
        {
          id: 'c_ambush_refuse_defiant',
          text: '«Осколок останется у меня, Вор. Стреляй, если посмеешь рискнуть!»',
          targetSceneId: 'astral_spire_approach',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          hint: 'Враждебность Флота, но Орион признателен за твою верность.',
          effect: {
            healthDelta: -10,
            sanityDelta: 4,
            relationshipDelta: 3,
            flagsSet: ['admiral_enemy'],
            notification:
              'Орудия Флота дают предупредительный залп, но «Алкион» прорывается в облака Селестии!',
          },
        },
        {
          id: 'c_ambush_slip_away',
          text: 'Бросить «Алкион» в крутое пике сквозь эфирную брешь под килем броненосца',
          targetSceneId: 'astral_spire_approach',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            healthDelta: -5,
            sanityDelta: 2,
            flagsSet: ['admiral_parley'],
            notification:
              'Ловкий манёвр оставляет флагман позади. Впереди сияют башни Селестии.',
          },
        },
      ],
    },

    astral_selestia_garden: {
      id: 'astral_selestia_garden',
      chapterTitle: 'Ночь пятая: Сады Звёздных Имён',
      location: 'Парящие террасы Селестии',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'floating marble celestial observatory gardens, glowing celestial flora, giant brass astrolabes, a wise mechanical owl perched on starlight sundial, ethereal and sacred',
      actionFocus: 'Лира и Орион ступают на мраморные террасы: механическая сова-астролябия читает звёзды',
      activeSpeaker: { name: 'Фаэль Хутто', emotion: 'neutral' },
      narrative: [
        'Пятая ночь. В созвездии Серебряного Ястреба осталось только две звезды. Небо на востоке наливается глубокой, мёртвой синевой — острова теряют гравитационную опору, и белые мраморные плиты Селестии тихо вздрагивают под подошвами.',
        'Здесь нет ветра. Только перезвон бронзовых шестерён в кронах хрустальных деревьев. На витом парапете сидит Фаэль Хутто — древний хранитель обсерватории, сова из полированной меди с линзами вместо глаз.',
        '[Фаэль Хутто|neutral] «Приветствую странников с осколком кометы. Вы пришли за Именами, пока последнее эхо не затихло в пустоте? Стены этого сада хранят вибрации трёх первых дочерей Вьярэля. Слушайте внимательно».',
        'На трёх алтарях сада высечены созвучия: Селест (Держащая Ветер), Аурель (Золотой Прилив) и Борея (Дыхание Льда).',
      ],
      choices: [
        {
          id: 'c_garden_read_all_names',
          text: 'Прикоснуться к звёздным алтарям и запечатлеть все три Имени',
          targetSceneId: 'astral_observatory_truth',
          tag: 'RECON',
          approach: 'Investigative',
          hint: 'Необходимо для истинной песни возвращения.',
          effect: {
            sanityDelta: 8,
            flagsSet: ['name_celest', 'name_aurel', 'name_borea'],
            notification: 'Ты узнала три Имени китов: Селест, Аурель и Борея.',
          },
        },
        {
          id: 'c_garden_hurry_observatory',
          text: 'Взять лишь имя Ветра и спешить к Главному Телескопу',
          targetSceneId: 'astral_observatory_truth',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            flagsSet: ['name_celest'],
            notification: 'Ты записала имя Селест и поспешила дальше.',
          },
        },
      ],
    },

    astral_observatory_truth: {
      id: 'astral_observatory_truth',
      chapterTitle: 'Ночь пятая: Карта Памяти',
      location: 'Купол Великой Астролябии',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'inside a giant domed celestial observatory, holographic star chart revealing ether beast lineages, companion trembling as starlight projects a whale silhouette over his human body, shocking reveal',
      actionFocus: 'Проектор звёздного света освещает Ориона: на куполе разворачивается правда о его рождении',
      activeSpeaker: { name: 'Лира', emotion: 'neutral' },
      narrative: [
        'Луч проектора падает в центр зала, и звёздная карта разворачивается полусферой под самым куполом. Нити света связывают кости на Кладбище, раненого дракона Вьярэля и... фигуру рядом с тобой.',
        'Свет бьёт в грудь Ориона. Но тень, падающая на мраморный пол — это не тень человека. Это силуэт огромного сапфирового китёнка с плавниками из чистого звёздного огня.',
        'Записи Ордена Безмолвного Небосвода вспыхивают золотыми письменами: «Субъект 07. Сиэль. Последнее дитя Вьярэля. Связан ритуалом плоти, дабы вести гарпунщика к колыбели».',
        'Ты медленно поворачиваешься к спутнику. Он не пытается закрыться. Он просто опускает голову.',
      ],
      choices: [
        {
          id: 'c_truth_confront_orion',
          text: 'Потребовать ответа: «Ты вел меня сюда с самого начала. Кто ты на самом деле?»',
          targetSceneId: 'astral_orion_confession',
          tag: 'DIALOGUE',
          approach: 'Investigative',
          effect: {
            flagsSet: ['orion_exposed'],
            notification: 'Тайна раскрыта. Орион больше не может молчать.',
          },
        },
      ],
    },

    astral_orion_confession: {
      id: 'astral_orion_confession',
      chapterTitle: 'Ночь пятая: Исповедь Сиэля',
      location: 'Балкон Звёздного Горизонта',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'melancholic balcony over endless purple cosmos, young man glowing with ethereal whale markings, holding a spool of golden celestial thread, crying tears of starlight, emotional catharsis',
      actionFocus: 'Орион открывает правду о своём долге и протягивает Нить Имён',
      activeSpeaker: { name: 'Орион', emotion: 'pain' },
      narrative: [
        '[Орион|pain] «Да. Моё имя Сиэль, — его голос ломается, двоясь низким китовым обертоном. — Когда твой отец вырвал осколок, песня начала затухать. Орден заковал меня в эту плоть, чтобы я нашёл человека с осколком и привёл его к Вратам».',
        '«Я лгал тебе, Лира. Я боялся, что если ты узнаешь правду, ты испугаешься чудовища и повернёшь назад. Но теперь я вижу... ты несёшь эту ношу так же, как нёс твой отец. С болью, но не сгибаясь».',
        'Он достаёт из-за пазухи моток тончайшей, звенящей золотой пряжи. Нить мерцает, пульсируя в такт биению сердца.',
        '«Это Нить Имён. Её прял Ткач ещё до того, как острова поднялись в небо. Вплети в неё Имена китов, Лира. Только так можно вернуть песню Вьярэлю без гибели всего живого».',
      ],
      reactivePages: [
        {
          at: 'end',
          minRelationship: 4,
          text: '[Орион|smiling] «Что бы ты ни решила... я благодарен за каждый час, что мы шли бок о бок. Человек ты или дочь гарпунщика — ты спасла меня от вечного безмолвия».',
        },
        {
          at: 2,
          requiredFlags: ['crew_tavi'],
          text: '[Тави|anxious] Тави выглядывает из арки, теребя край плаща: «Значит, ты правда тот самый китёнок из детских сказок? А мы думали, ты просто молчун с красивыми глазами… Не бойся, мы тебя не бросим».',
        },
        {
          at: 2,
          requiredFlags: ['crew_kryazh'],
          text: '[Кряж|neutral] Кряж медленно кивает: «Я видал всякое в эфире. Но верность измеряется не чешуёй или кожей, парень, а тем, чью спину ты прикрываешь у штурвала».',
        },
        {
          at: 2,
          requiredFlags: ['crew_fray'],
          text: '[Фрэй|smiling] «Так вот почему от тебя пахло озоном и морской солью! — фыркает Фрэй. — А я-то думал, это дешёвый одеколон из нижних доков».',
        },
      ],
      choices: [
        {
          id: 'c_confession_forgive',
          text: 'Простить Сиэля: «Ты боялся за свой дом. Я не держу зла, Сиэль»',
          targetSceneId: 'astral_gates_leviathan',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          hint: 'Ключ к истинной концовке Песни Возвращения.',
          effect: {
            sanityDelta: 8,
            relationshipDelta: 4,
            flagsSet: ['orion_forgiven', 'sang_names'],
            itemsAdded: [
              {
                id: 'item-thread-of-names',
                name: 'Нить Имён',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                description:
                  'Тончайшая золотая пряжа, сотканная древним Ткачом ещё до рождения архипелага. Хранит созвучия истинных имён звёздных китов.',
                loreNote:
                  'Орион носил её у сердца всю дорогу от Нижней Гавани до Селестии.',
                effectSummary:
                  'Необходима для Песни Возвращения и истинного финала.',
                acquiredLocation: 'Балкон Звёздного Горизонта',
              },
            ],
            notification: 'Ты простила Сиэля. Связь между вами крепка как никогда.',
          },
        },
        {
          id: 'c_confession_blame',
          text: 'Осудить за обман: «Ты использовал меня и экипаж как поводырей к алтарю»',
          targetSceneId: 'astral_gates_leviathan',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            sanityDelta: -4,
            relationshipDelta: -3,
            flagsSet: ['orion_blamed', 'sang_names'],
            itemsAdded: [
              {
                id: 'item-thread-of-names',
                name: 'Нить Имён',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                description:
                  'Тончайшая золотая пряжа, сотканная древним Ткачом ещё до рождения архипелага. Хранит созвучия истинных имён звёздных китов.',
                loreNote:
                  'Орион носил её у сердца всю дорогу от Нижней Гавани до Селестии.',
                effectSummary:
                  'Необходима для Песни Возвращения и истинного финала.',
                acquiredLocation: 'Балкон Звёздного Горизонта',
              },
            ],
            notification: 'Сиэль принимает твой упрёк, сгорая от вины.',
          },
        },
        {
          id: 'c_confession_focus_duty',
          text: 'Сжать Нить Имён и посмотреть на горизонт: «Время слов прошло. Впереди Врата»',
          targetSceneId: 'astral_gates_leviathan',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            sanityDelta: 2,
            relationshipDelta: 1,
            flagsSet: ['sang_names'],
            itemsAdded: [
              {
                id: 'item-thread-of-names',
                name: 'Нить Имён',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                description:
                  'Тончайшая золотая пряжа, сотканная древним Ткачом ещё до рождения архипелага. Хранит созвучия истинных имён звёздных китов.',
                loreNote:
                  'Орион носил её у сердца всю дорогу от Нижней Гавани до Селестии.',
                effectSummary:
                  'Необходима для Песни Возвращения и истинного финала.',
                acquiredLocation: 'Балкон Звёздного Горизонта',
              },
            ],
            notification:
              'Нить Имён у тебя в руках. Корабль ложится на курс к Вратам Эфира.',
          },
        },
      ],
    },

    astral_gates_leviathan: {
      id: 'astral_gates_leviathan',
      chapterTitle: 'Ночь шестая: Врата Эфира и Разлом Тишины',
      location: 'Врата Эфира — Разлом Тишины',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'titanic celestial leviathan dragon curled around cosmic gateway of ancient silver arches and blue aurora rift, starlight aura',
      actionFocus:
        'Исполинский звёздный зверь стережёт проход к вершине Маяка',
      narrative: [
        'Здесь кончаются острова и начинается чистая пустота. Врата Эфира — две циклопические арки из звёздного серебра, между которыми кипит лазурный разлом.',
        'Вокруг створок обвился Левиафан-Страж. Его чешуя мерцает тысячами забытых созвездий, а хвост легко переломил бы киль трёхмачтовика пополам. Он не спит — его сапфировые очи следят за каждым вздохом «Алкиона».',
        '[Орион|anxious] «Он не пропускал смертных шесть сотен лет. Если у нас нет ключа — нам не пережить этот штиль».',
      ],
      reactivePages: [
        {
          at: 'end',
          requiredFlags: ['sang_names'],
          text: '[Орион|smiling] «Нить Имён дрожит в твоей руке. Он чувствует созвучие... он знает, чьи голоса мы несём».',
        },
        {
          at: 'end',
          requiredFlags: ['admiral_parley'],
          text: '[Тави|anxious] «Вор дал нам печать флота. Но признает ли древний зверь имперскую железяку?»',
        },
      ],
      choices: [
        {
          id: 'c_gates_leviathan_truth',
          text: 'Опустить оружие и вслушаться: древний шёпот раненого бога (услышать правду)',
          targetSceneId: 'astral_leviathan_truth',
          approach: 'Arcane',
          tag: 'DIALOGUE',
          hideIfLocked: true,
          condition: {
            anyFlags: ['sang_names', 'father_truth', 'orion_forgiven'],
          },
          effect: {
            sanityDelta: 10,
            relationshipDelta: 2,
            notification: 'Ты вслушиваешься в песнь Левиафана. Древний зверь открывает свой истинный лик.',
          },
        },
        {
          id: 'c_gates_use_thread',
          text: 'Спеть три Имени через Нить Имён (Селест, Орэль, Борея)',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Arcane',
          tag: 'RELIC',
          condition: {
            requiredFlags: ['sang_names'],
          },
          effect: {
            sanityDelta: 20,
            relationshipDelta: 2,
            flagsSet: ['leviathan_sang_peace'],
            notification:
              'Левиафан склоняет исполинскую голову. Врата распахиваются с пением небесных колоколов!',
          },
        },
        {
          id: 'c_gates_admiral_seal',
          text: 'Поднять Сигнальную Печать адмирала Вора и протаранить створ',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Diplomatic',
          tag: 'RELIC',
          condition: {
            requiredFlags: ['admiral_parley'],
          },
          effect: {
            sanityDelta: -5,
            healthDelta: -10,
            flagsSet: ['leviathan_forced'],
            notification:
              'Печать резонирует с пушками Вора! Страж вздрагивает от шока, и корабль прорывается внутрь.',
          },
        },
        {
          id: 'c_gates_audacious_ram',
          text: 'Ввести «Алкион» в пике и проскользнуть между витками хвоста',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Audacious',
          tag: 'AUDACIOUS',
          effect: {
            healthDelta: -20,
            sanityDelta: -10,
            flagsSet: ['leviathan_dodged'],
            notification:
              'Борт трещит от звёздных искр, но манёвр удаётся! Вы за Вратами!',
          },
        },
        {
          id: 'c_gates_combat_slugfest',
          text: 'Дать бой титану: открыть огонь из всех звёздных баллист корвета',
          targetSceneId: 'astral_leviathan_combat',
          approach: 'Audacious',
          tag: 'AUDACIOUS',
        },
        {
          id: 'c_gates_wind_prism',
          text: 'Поднять Призму Звёздного Ветра: спеть древнюю песнь гармонии',
          targetSceneId: 'astral_leviathan_prism',
          approach: 'Arcane',
          tag: 'RELIC',
          condition: { hasItem: 'relic-wind-prism' },
        },
        {
          id: 'c_gates_comet_flash',
          text: 'Ударить Осколком Кометы о штурвал: ослепить стража вспышкой',
          targetSceneId: 'astral_leviathan_shard',
          approach: 'Audacious',
          tag: 'RELIC',
          condition: { hasItem: 'relic-comet-shard' },
        },
        {
          id: 'c_gates_soul_sacrifice',
          text: 'Выйти на бушприт с открытым сердцем: пожертвовать искру звёздного тепла',
          targetSceneId: 'astral_leviathan_sacrifice',
          approach: 'Surrender',
          tag: 'SACRIFICE',
        },
      ],
    },

    astral_leviathan_truth: {
      id: 'astral_leviathan_truth',
      chapterTitle: 'Ночь шестая: Врата Эфира и Разлом Тишины',
      location: 'Врата Эфира — Разум Звёздного Дракона',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'deep spiritual dreamscape inside celestial whale cosmic mind, constellation veins pulsing with starlight, majestic ancient wounded dragon opening huge gentle eyes',
      actionFocus: 'Левиафан говорит разумом Лиры: раскрыта правда о ране Вьярэля',
      activeSpeaker: {
        name: 'Левиафан',
        emotion: 'pain',
      },
      narrative: [
        'Когда ты опускаешь оружие, пространство между арками Врат сжимается. Рёв чудовища растворяется, обращаясь в глубокую, медленную песнь — ту самую, которой сотканы эти небеса.',
        'Левиафан — это не тюремщик и не страж. Это сам **Вьярэль**, Великий Звёздный Дракон, свернувшийся вокруг раны, нанесённой двенадцать лет назад гарпуном твоего отца.',
        '[Левиафан|pain] «Дитя гарпунщика... ты принесла обратно моё сердце. Твой отец ранил меня от страха, но умирая, плакал и заклинал вернуть искру. Я ждал носителя Осколка, чтобы спеть последнюю колыбельную миру...»',
        'Орион опускается на колени на носу корабля: «Он не враг нам, Лира. Он просто истекает светом».',
      ],
      choices: [
        {
          id: 'c_truth_commune_proceed',
          text: 'Прикоснуться к звёздному рогу дракона: «Мы вернём твой огонь в Маяк»',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Arcane',
          tag: 'DIALOGUE',
          effect: {
            sanityDelta: 25,
            relationshipDelta: 3,
            flagsSet: ['leviathan_understood', 'leviathan_communed'],
            companionToast: 'Орион плачет от благоговения: связь с драконом восстановлена (+3)',
            notification:
              'Истина Левиафана постигнута! Дракон благословляет «Алкион» на проход к Маяку (+25 Sanity).',
          },
        },
      ],
    },

    astral_gates_beyond: {
      id: 'astral_gates_beyond',
      chapterTitle: 'Ночь шестая: Врата Эфира и Разлом Тишины',
      location: 'За Вратами Эфира — Створы Небесного Предела',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'ship emerging past titanic cosmic gateway into calm breathtaking starlight sea beneath soaring lighthouse peak, imperial dreadnought waiting quietly in shadow',
      actionFocus: '«Алкион» выходит за Врата: впереди подножие Маяка и флагман адмирала Вора',
      activeSpeaker: {
        name: 'Лира Солис',
        emotion: 'neutral',
      },
      narrative: [
        'Разлом остаётся за кормой. «Алкион» скользит в зеркально гладком эфирном течении, где звёзды отражаются под килем словно на поверхности ночного озера.',
        'Впереди вздымается циклопический остров Небесный Предел, увенчанный древней спиралью Звёздного Маяка. Но у самого подножия мраморных ступеней на рейде стоит закованный в воронёную сталь дредноут Серебряного Флота — «Вектор».',
        'На верхней палубе флагмана вспыхивает сигнальный огонь переговорщика.',
      ],
      choices: [
        {
          id: 'c_beyond_admiral_parley',
          text: 'Принять сигнал адмирала: сойти на палубу для финальных переговоров',
          targetSceneId: 'astral_admiral_final',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
        },
        {
          id: 'c_beyond_direct_ascent',
          text: 'Обойти дредноут по звёздному течению и сразу взойти на ступени Маяка',
          targetSceneId: 'astral_beacon_ascent',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
        },
      ],
    },

    astral_admiral_final: {
      id: 'astral_admiral_final',
      chapterTitle: 'Ночь шестая: Врата Эфира и Разлом Тишины',
      location: 'Флагман «Вектор» — Кают-компания Адмирала',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'iron dreadnought officers wardroom, austere silver admiral standing before star chart table, young female captain and companion, tense diplomatic atmosphere',
      actionFocus: 'Адмирал Кассиан Вор делает последнее предложение перед восхождением на Маяк',
      activeSpeaker: {
        name: 'Адмирал Кассиан Вор',
        emotion: 'neutral',
      },
      narrative: [
        'Адмирал Вор встречает вас без стражи, сложив руки за спиной перед огромной астронавигационной картой. Его мундир строг, в голосе нет ни капли высокомерия — лишь усталая тяжесть человека долга.',
        '[Адмирал Кассиан Вор|neutral] «Капитан Солис. Позади нас четыре тысячи семей на колониальных баржах. Их турбины заглохнут, как только погаснет седьмая звезда Ястреба. Если вы отдадите Осколок Флоту — мои инженеры стабилизируют двигатели ценой огня одного зверя, но люди выживут. Если отдадите его китам — вы рискуете всем миром ради древнего мифа».',
      ],
      choices: [
        {
          id: 'c_admiral_deal_trade',
          text: 'Заключить договор: согласиться передать Осколок Флоту на вершине Маяка',
          targetSceneId: 'astral_beacon_ascent',
          tag: 'SACRIFICE',
          approach: 'Diplomatic',
          effect: {
            flagsSet: ['admiral_deal_open', 'traded_shard'],
            notification: 'Ты пообещала Осколок адмиралу Вору. Флот гарантирует защиту колонистам.',
          },
        },
        {
          id: 'c_admiral_refuse_honor',
          text: '«Небо принадлежит всем, адмирал. Мы зажжём Маяк по закону Первородных»',
          targetSceneId: 'astral_beacon_ascent',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            relationshipDelta: 1,
            flagsSet: ['admiral_rejected'],
            companionToast: 'Орион гордится твоей верностью небесам (+1)',
            notification: 'Вор сдержанно отдаёт честь: «Тогда решайте на вершине, капитан».',
          },
        },
      ],
    },

    astral_beacon_ascent: {
      id: 'astral_beacon_ascent',
      chapterTitle: 'Ночь седьмая: Вершина Первой Звезды',
      location: 'Колыбель Вьярэля — Алтарь Маяка',
      isKeyBossEncounter: true,
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'apex of floating star lighthouse, crystalline dais under open cosmos where the dying Hawk star pulsates faint golden pulse',
      actionFocus:
        'Решающий выбор: судьба Первой Звезды, китов и небесного архипелага',
      narrative: [
        'Вершина Звёздного Маяка парит над всем сотворённым миром. Под вами раскинулось бескрайнее море облаков, пробитое серебряными шпилями островов.',
        'В центре алтаря — Колыбель Вьярэля. Последняя звезда Ястреба тускнеет здесь, пульсируя слабым янтарным теплом, похожим на затухающий вздох птицы.',
        'Орион встаёт рядом, держа в ладони свой Первородный Осколок. Его пальцы дрожат. «Всё сходится к этому мигу, капитан. Мой род украл эту искру двести лет назад. Теперь выбор за тобой».',
      ],
      reactivePages: [
        {
          at: 'end',
          requiredFlags: ['crew_tavi'],
          text: '[Тави|smiling] «Что бы ты ни решила, капитан... я с тобой до последней заклёпки. Даже если небеса рухнут».',
        },
        {
          at: 'end',
          requiredFlags: ['crew_kryazh'],
          text: '[Кряж|neutral] «Старый Идрис смотрел бы на тебя с гордостью, Лира. Делай то, ради чего мы вышли из гавани».',
        },
        {
          at: 'end',
          requiredFlags: ['crew_fray'],
          text: '[Фрэй|smiling] «Ветер шепчет, что эта ночь войдёт в баллады на тысячу зим. Сделай её красивой».',
        },
      ],
      choices: [
        {
          id: 'c_end_return_song',
          text: 'Песнь Возвращения: вернуть Осколок в Колыбель и спеть Имена (Истинный Финал)',
          targetSceneId: 'astral_ending_return',
          approach: 'Arcane',
          tag: 'ENDING',
          condition: {
            hasItem: 'relic-comet-shard',
            requiredFlags: ['father_truth', 'sang_names', 'orion_forgiven'],
            anyFlags: ['leviathan_communed', 'leviathan_understood'],
            minRelationship: 4,
          },
          effect: {
            sanityDelta: 30,
            relationshipDelta: 3,
            flagsSet: ['ending_true_return'],
            notification:
              'Ты запеваешь Песнь Возвращения. Небосвод откликается тысячегласым хором!',
          },
        },
        {
          id: 'c_end_fleet_pact',
          text: 'Передать Осколок Серебряному Флоту (спасти четыре тысячи душ)',
          targetSceneId: 'astral_ending_fleet',
          approach: 'Diplomatic',
          tag: 'ENDING',
          condition: {
            requiredFlags: ['admiral_deal_open'],
          },
          effect: {
            sanityDelta: -10,
            relationshipDelta: -2,
            flagsSet: ['ending_fleet_victory'],
            notification:
              'Флагман Вора поднимает сигнальные огни победы над островами.',
          },
        },
        {
          id: 'c_end_free_sky',
          text: 'Разбить Осколок о Колыбель: свобода ветру, острова пусть летят сами',
          targetSceneId: 'astral_ending_free_sky',
          approach: 'Audacious',
          tag: 'ENDING',
          effect: {
            sanityDelta: 10,
            healthDelta: -10,
            flagsSet: ['ending_free_sky'],
            notification:
              'Звёздная искра взрывается дождём метеоров по всему архипелагу!',
          },
        },
        {
          id: 'c_end_beacon_ignite',
          text: 'Зажечь Маяк: Открыть Гавань Первородных Звёзд для всех мореплавателей',
          targetSceneId: 'astral_ending_beacon',
          approach: 'Diplomatic',
          tag: 'ENDING',
          effect: {
            notification: 'Золотой луч Маяка соединяет все парящие острова в единый архипелаг!',
          },
        },
        {
          id: 'c_end_merge_song',
          text: 'Слиться с эфирным потоком: Родить Легенду о Песни Левиафанов',
          targetSceneId: 'astral_ending_merge',
          approach: 'Arcane',
          tag: 'ENDING',
          condition: { minSanity: 40 },
          effect: {
            notification: 'Лира и экипаж возносятся в вечную небесную песнь.',
          },
        },
        {
          id: 'c_end_constellations_rebirth',
          text: 'Пожертвовать Осколком Кометы: Возродить Погасшие Созвездия и новое небо',
          targetSceneId: 'astral_ending_constellations',
          approach: 'Audacious',
          tag: 'ENDING',
          condition: {
            hasItem: 'relic-comet-shard',
          },
          effect: {
            notification: 'Осколок рассыпается в небе, рождая новые созвездия!',
          },
        },
        {
          id: 'c_end_inspect_ancient_dais',
          text: 'Осмотреть древний постамент Погасшего Маяка Первородных Звёзд',
          targetSceneId: 'astral_beacon_dais',
          approach: 'Investigative',
          tag: 'RECON',
        },
      ],
    },

    astral_ending_return: {
      id: 'astral_ending_return',
      isEnding: true,
      endingType: 'victory',
      chapterTitle: 'Эпилог: Рассвет Звёздных Китов',
      location: 'Возрождённый Архипелаг',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'magnificent dawn with golden star whale leaping across skies of restored floating islands, ship sailing alongside joyful crew',
      actionFocus:
        'Истинный финал: звезда Ястреба вспыхивает вечным светом, киты возвращаются',
      narrative: [
        'Когда Нить Имён соединяется с Осколком, звук разрывает небеса не громом, а чистейшей нотой хрустального колокола.',
        'Звезда Ястреба раскрывает золотые крылья над алтарём. Из глубин эфира, привлечённые светом, поднимаются тени звёздных китов — сотни сияющих исполинов плывут сквозь рассветные облака.',
        'Орион опускается на колени, по щекам его текут слёзы облегчения: «Мы искупили долг... Они вернулись». Острова больше не падают. «Алкион» ложится на обратный курс под ликующие крики экипажа.',
      ],
      choices: [],
    },

    astral_ending_fleet: {
      id: 'astral_ending_fleet',
      isEnding: true,
      endingType: 'sacrifice',
      chapterTitle: 'Эпилог: Железный Порядок Серебряного Флота',
      location: 'Селестия под флагами Империи',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'iron dreadnoughts patrolling skies around secured star spire, industrial cold order, admiral saluting captain',
      actionFocus:
        'Финал Флота: порядок куплен ценой звёздной свободы',
      narrative: [
        'Осколок помещён в бронированный реактор «Вектора». Адмирал Кассиан Вор сдерживает слово: четырём тысячам колонистов гарантирована безопасность, а архипелаг взят под защиту Серебряного Флота.',
        'Но небо больше не поёт. Звёздные киты уходят в недосягаемые бездны, изгоняемые стуком имперских турбин. Острова закованы в чугунные якоря.',
        'Орион молча смотрит на серый рассвет. «Они выживут, Лира. Но небо уже никогда не будет прежним». В твоём кармане — пожизненный каперский патент и тяжесть необратимого выбора.',
      ],
      choices: [],
    },

    astral_ending_free_sky: {
      id: 'astral_ending_free_sky',
      isEnding: true,
      endingType: 'destruction',
      chapterTitle: 'Эпилог: Ветер Свободного Неба',
      location: 'Бескрайний Дрейфующий Эфир',
      localImage: '/images/preset_world_astral_1791453508871.webp',
      visualPrompt:
        'wild untamed skies with scattered fragments of islands floating freely, ship flying into infinite horizon with billowing sails',
      actionFocus:
        'Финал Свободы: раскол оков и вечное плавание в неведомое',
      narrative: [
        'Удар раскалывает Осколок на миллионы сверкающих светлячков. Волна сырой магии срывает цепи, сдувает имперские кордоны и расшвыривает острова в вольный, неуправляемый дрейф.',
        'Ни Маяка, ни Флота, ни предначертанных путей. Только бескрайнее небо, полное опасностей, чудес и абсолютной свободы.',
        '«Алкион» ловит свежий порыв первозданного шторма. Лира сжимает штурвал — впереди целый неизведанный мир, где каждый остров теперь ищет собственную орбиту.',
      ],
      choices: [],
    },
  },
  patches: {
    astral_deck_scene: {
      appendChoices: [
        {
          id: 'c_deck_steer_aurora',
          text: 'Повернуть штурвал к мерцающей Авроре (дрейф в сиянии)',
          targetSceneId: 'astral_aurora_drift',
          approach: 'Investigative',
        },
      ],
    },
    astral_whale_graveyard: {
      appendChoices: [
        {
          id: 'c_graveyard_follow_song',
          text: 'Пойти на звук: среди костей кто-то поёт',
          targetSceneId: 'astral_whale_song',
          approach: 'Investigative',
        },
      ],
    },
    astral_spire_aligned: {
      appendChoices: [
        {
          id: 'c_spire_to_selestia_garden',
          text: 'Сойти на звёздные террасы Садов Селестии',
          targetSceneId: 'astral_selestia_garden',
          approach: 'Investigative',
          tag: 'RECON',
          effect: {
            notification: 'Ты спускаешься на террасы Садов Селестии.',
          },
        },
      ],
    },
    astral_leviathan_combat: {
      replaceChoices: [
        {
          id: 'c_leviathan_combat_pass',
          text: 'Провести повреждённый корабль сквозь Врата к Небесному Пределу',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Audacious',
          effect: {
            healthDelta: -35,
            sanityDelta: -10,
            screenShake: true,
            flagsSet: ['leviathan_fought'],
            notification: 'Победа в яростной схватке! Корабль и Лира изранены (-35 HP).',
          },
        },
      ],
    },
    astral_leviathan_prism: {
      replaceChoices: [
        {
          id: 'c_leviathan_prism_pass',
          text: 'Пройти сквозь Врата под почётным эскортом Звёздного Дракона',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Arcane',
          effect: {
            sanityDelta: 30,
            flagsSet: ['leviathan_communed'],
            notification: 'Левиафан признал вас истинными хранителями небес (+30 Sanity)!',
          },
        },
      ],
    },
    astral_leviathan_shard: {
      replaceChoices: [
        {
          id: 'c_leviathan_shard_pass',
          text: 'Выйти на финишную прямую к острову Небесный Предел',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Audacious',
          effect: {
            flagsSet: ['leviathan_blinded'],
            notification: 'Вспышка кометы расчистила путь!',
          },
        },
      ],
    },
    astral_leviathan_sacrifice: {
      replaceChoices: [
        {
          id: 'c_leviathan_sacrifice_pass',
          text: 'Шагнуть сквозь Врата с изменившимся, но непреклонным сердцем',
          targetSceneId: 'astral_gates_beyond',
          approach: 'Surrender',
          effect: {
            sanityDelta: -30,
            flagsSet: ['light_sacrificed'],
            notification: 'Жертва принята. Рассудок пошатнулся от космического холода (-30 Sanity).',
          },
        },
      ],
    },
  },

  redirects: {
    // В библии сцена называется astral_beacon_approach; в коде astral_beacon_ascent
    astral_beacon_approach: 'astral_beacon_ascent',
    // В библии концовка называется astral_ending_silver («Век Серебра»); в коде astral_ending_fleet
    astral_ending_silver: 'astral_ending_fleet',
  },

  endingsList: [
    {
      id: 'astral_ending_beacon',
      title: 'Гавань Первородных Звёзд',
      description: 'Маяк зажжён светом Осколка. Золотой столб света соединяет все парящие острова в единый архипелаг.',
      hint: 'Зажгите Маяк силой Осколка на вершине Небесного Предела.',
      endingType: 'victory',
      cgUrl: '/images/preset_world_astral_1791455452771.webp',
    },
    {
      id: 'astral_ending_merge',
      title: 'Песнь Левиафанов',
      description: 'Лира и экипаж сливаются с эфирным потоком и звёздными китами в вечную легенду.',
      hint: 'Слейтесь с космическим потоком при высоком уровне стойкости духа (Sanity >= 40).',
      endingType: 'victory',
      cgUrl: '/images/preset_world_astral_1791453508871.webp',
    },
    {
      id: 'astral_ending_constellations',
      title: 'Возрождение Созвездий',
      description: 'Взрыв кометного осколка сеет семена новых звёзд, рождая новые парящие континенты и созвездия.',
      hint: 'Пожертвуйте Осколком Кометы, бросив его в центр чаши Маяка.',
      endingType: 'sacrifice',
      cgUrl: '/images/preset_world_astral_1791455452771.webp',
    },
    {
      id: 'astral_ending_return',
      title: 'Песнь Возвращения (Истинный Финал)',
      description: 'Осколок возвращён в Колыбель, Нить Имён запевает песнь китов, а Орион возвращается в истинный облик звёздного китёнка Сиэля.',
      hint: 'Узнайте правду об отце, выучите три Имени, простите Ориона, поймите Левиафана и заслужите наивысшее доверие спутника.',
      endingType: 'victory',
      cgUrl: '/images/preset_world_astral_1791453508871.webp',
    },
    {
      id: 'astral_ending_fleet',
      title: 'Век Серебра (Порядок Флота)',
      description: 'Осколок передан адмиралу Кассиану Вору. Четыре тысячи колонистов спасены ценой пленения звёздных китов.',
      hint: 'Заключите соглашение с адмиралом Вором о передаче Осколка.',
      endingType: 'sacrifice',
      cgUrl: '/images/preset_world_astral_1791453508871.webp',
    },
    {
      id: 'astral_ending_free_sky',
      title: 'Ветер Свободного Неба',
      description: 'Осколок разбит о Колыбель: свобода ветру, острова свободно дрейфуют в бескрайней небесной шири.',
      hint: 'Разбейте Осколок о Колыбель, отказавшись и от Маяка, и от власти Флота.',
      endingType: 'destruction',
      cgUrl: '/images/preset_world_astral_1791453508871.webp',
    },
  ],
};
