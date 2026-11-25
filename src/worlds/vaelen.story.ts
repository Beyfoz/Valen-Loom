import { StoryPack } from './storyKit';

export const vaelenStory: StoryPack = {
  worldId: 'vaelen',
  startSceneId: 'v_prologue_salt_vault',
  scenes: {
    // ----------------------------------------------------
    // ГЛАВА I: ВОЛНОЛОМ
    // ----------------------------------------------------

    // 1. v_prologue_salt_vault (старт)
    v_prologue_salt_vault: {
      id: 'v_prologue_salt_vault',
      chapterTitle: 'Глава I: Волнолом Шепчущих Вод',
      location: 'Склеп под Волноломом — Соляной Саркофаг',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'young knight waking inside translucent salt sarcophagus in dark flooded crypt, salt crystals breaking, lantern light reflecting in saltwater pool, mysterious young scholar woman waiting',
      actionFocus: 'Кейлен открывает глаза: треск соли и первый вдох после трёх сотен лет сна',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'neutral',
      },
      narrative: [
        'Соль трескается с сухим звуком ломающегося льда. Ледяная вода выплёскивается из саркофага, обжигая лёгкие первым вдохом за три века. Мышцы сведены судорогой, во рту — горький привкус застывшего времени и морской пены.',
        'Над тобой дрожит круглое стекло латунного фонаря. Лицо девушки в плаще Соляного Архива очерчено резкими тенями. Она пристально вглядывается в твои зрачки, губы её беззвучно шевелятся, будто отсчитывая секунды: «...семьдесят две, семьдесят три».',
        '[Сера Никс|neutral] «Дышите, сэр рыцарь. Вы спали триста двенадцать лет. Я Сера Никс, архивный проводник. Отлив открыл Волнолом всего на трое суток — в Ночь Трёх Лун прилив смоет всё».',
        'В твоей голове пульсирует тупая боль. Ты помнишь день, когда цитадель ушла под воду. Помнишь холодный наплечник старшего брата и мучительное чувство вины: почему ты проснулся здесь, а Эйрик остался держать мост один?',
      ],
      choices: [
        {
          id: 'c_vault_ask_brother',
          text: 'Схватить латную перчатку: «Где мой брат? Где Маршал Эйрик?»',
          targetSceneId: 'v_prologue_crossing',
          tag: 'DIALOGUE',
          approach: 'Investigative',
          effect: {
            sanityDelta: -3,
            flagsSet: ['asked_about_eirik'],
            notification: 'Ты спросил об Эйрике. Сера на миг отвела взгляд.',
          },
        },
        {
          id: 'c_vault_suspect_archive',
          text: 'Опереться на край каменной гробницы: «Кто послал тебя? Зачем Архиву спящий рыцарь?»',
          targetSceneId: 'v_prologue_crossing',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            relationshipDelta: -1,
            flagsSet: ['suspects_archive'],
            companionToast: 'Сера холодеет от недоверия (-1)',
            notification: 'Ты усомнился в намерениях Архива.',
          },
        },
        {
          id: 'c_vault_trust_silent',
          text: 'Опереться на протянутую руку девушки и молча кивнуть в знак благодарности',
          targetSceneId: 'v_prologue_crossing',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            relationshipDelta: 2,
            sanityDelta: 5,
            flagsSet: ['trusted_sera_early'],
            companionToast: 'Сера удивлена твоей спокойной выдержке (+2)',
            notification: 'Ты принял помощь без лишних слов. Тепло ладони прогнало холод склепа.',
          },
        },
      ],
    },

    // 2. v_prologue_crossing
    v_prologue_crossing: {
      id: 'v_prologue_crossing',
      chapterTitle: 'Глава I: Волнолом Шепчущих Вод',
      location: 'Затопленный пролив — Могила Кораблей',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'wooden rowboat navigating dark foggy waters between jagged black shipwrecks, distant titanic cyclopean citadel wall looming, pale dawn sky, three faint moons',
      actionFocus: 'Лодка скользит между остовами паломнических судов навстречу громаде Волнолома',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'anxious',
      },
      hotspots: [
        {
          id: 'hotspot-crossing-wreck',
          name: 'Обломки паломнической бригантины',
          description:
            'В просмолённом сундуке под слоем ракушек уцелело запечатанное сургучом письмо паломника.',
          position: { x: 35, y: 75 },
          check: {
            attribute: 'perception',
            dc: 11,
            label: 'Осмотреть обломки судна',
          },
          rewardFlag: 'found_pilgrim_letter',
          foundText:
            'Ты находишь «Письмо паломника» — крик отчаяния тех, кто пытался бежать из Велена до Великого Отказа.',
        },
      ],
      narrative: [
        'Лодка скользит по неподвижной, как смола, воде пролива. Вокруг из тумана вздымаются почерневшие рёбра кораблей — паломнический флот, разбившийся о рифы в день катастрофы.',
        'На востоке брезжит свинцовый рассвет. В небе над зубцами цитадели уже различимы три лунных серпа: серебряная Ниэль, багряная Хатра и тёмная, едва уловимая тень Орма.',
        '[Сера Никс|anxious] «Три правила Волнолома, сэр Кейлен, — негромко шепчет Сера, мерно опуская вёсла. — Не отвечай эху в стенах. Не называй своего истинного имени глубине. И никогда не отдавай память, не поторговавшись. Соль помнит каждого, кто нарушил закон».',
      ],
      choices: [
        {
          id: 'c_crossing_row_hard',
          text: 'Перехватить вёсла и налечь всем весом: выиграть драгоценное время отлива',
          targetSceneId: 'v_causeway_entrance',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          skillCheck: {
            attribute: 'strength',
            dc: 12,
            label: 'Грести сквозь приливное сопротивление',
            passMessage: 'Мощные гребки разгоняют лодку; вы достигаете внешних ворот раньше волны!',
            failMessage: 'Солёная смола обжигает содранные ладони, но лодка успевает причалить к ступеням.',
            passEffect: {
              healthDelta: 0,
              sanityDelta: 5,
              notification: 'Вы стремительно преодолели полосу рифов до подъёма волны.',
            },
            failEffect: {
              healthDelta: -5,
              sanityDelta: 0,
              notification: 'Суровый гребок содрал мозоли на онемевших руках (-5 HP).',
            },
          },
        },
        {
          id: 'c_crossing_recon_citadel',
          text: 'Вглядеться в циклопическую кладку Волнолома: оценить защитные бреши',
          targetSceneId: 'v_causeway_entrance',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            sanityDelta: 3,
            flagsSet: ['recon_causeway_breach'],
            notification: 'Ты приметил нижние водосбросы и древний герб Вэнсов над аркой.',
          },
        },
        {
          id: 'c_crossing_talk_rules',
          text: '«Почему нельзя называть имя глубине, Сера?»',
          targetSceneId: 'v_causeway_entrance',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            relationshipDelta: 1,
            flagsSet: ['knows_lullaby'],
            companionToast: 'Сера ценит твою осторожность (+1)',
            notification: '«Потому что глубина окликнет тебя в ответ тем же голосом», — ответила она.',
          },
        },
      ],
    },

    // 4. v_gate_echo_oyvin (Привратник Ойвин)
    v_gate_echo_oyvin: {
      id: 'v_gate_echo_oyvin',
      chapterTitle: 'Глава I: Волнолом Шепчущих Вод',
      location: 'Внешние Ворота Волнолома — Ниша Привратника',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'massive rusted iron gate set in cyclopean sea wall, carved stone mouth weeping salt crystals with faint blue eyes inside dark grille, salt merchant spirit',
      actionFocus: 'Соляное эхо в бронзовой решётке ворот оживает, требуя пошлину за проход',
      activeSpeaker: {
        name: 'Привратник Ойвин',
        emotion: 'smiling',
      },
      hotspots: [
        {
          id: 'hotspot-oyvin-grille',
          name: 'Бронзовая решётка рта',
          description:
            'На витых медных прутьях выбиты древние законы пошлины: «Плата взимается не серебром, но тем, о чём тоскует сердце».',
          position: { x: 50, y: 30 },
          check: {
            attribute: 'intellect',
            dc: 12,
            label: 'Прочесть закон пошлины',
          },
          rewardFlag: 'read_gate_law',
          foundText:
            'Закон Прилива гласит: каждое забытое чувство питает скрепы Короны.',
        },
      ],
      narrative: [
        'Из узкой амбразуры над сводом ворот доносится сухой шелестящий смешок. Соляные наросты на бронзовой решётке осыпаются белым дождём, являя пару светящихся сапфировых огоньков.',
        '[Привратник Ойвин|smiling] «Триста лет тишины, и вдруг — живые шаги! Живые сапоги, живое дыхание! Я Ойвин, смотритель пошлины. Ворота заперты на девять засовов. Чем платить будете, путник? Золото здесь сожрали крабы, а вот вкусное воспоминание... ах, я бы отдал пол-архива за один-единственный сладкий полдень!»',
        'Сера сжимает твой локоть: «Помни третье правило: торгуйся. Но не отдавай ничего важного».',
      ],
      choices: [
        {
          id: 'c_oyvin_give_apples',
          text: 'Отдать воспоминание: вкус спелых садовых яблок в долине Эйдерн',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            sanityDelta: -8,
            flagsSet: ['oyvin_friend', 'mem_apples_given'],
            notification:
              'Ты забыл вкус яблок из сада матери (-8 Sanity). Ойвин в экстазе отворяет нижнюю калитку!',
          },
        },
        {
          id: 'c_oyvin_speak_vance_name',
          text: 'Нарушить правило: «Я Кейлен Вэнс, рыцарь Волнолома! Открой во имя Ордена!»',
          targetSceneId: 'v_weeping_cloisters',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            relationshipDelta: -1,
            flagsSet: ['knows_eirik_name'],
            companionToast: 'Сера бледнеет: «Ты назвал имя глубине!» (-1)',
            notification:
              'Ойвин ахает: «Вэнс?! Маршальский род! Твой брат Эйрик до сих пор стоит у Врат Бездны!»',
          },
        },
        {
          id: 'c_oyvin_intimidate',
          text: 'Припугнуть эхо: «Открой створ, или я выбью решётку вместе с твоей солью»',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'DIALOGUE',
          approach: 'Arcane',
          skillCheck: {
            attribute: 'charisma',
            dc: 12,
            label: 'Подчинить болтливого стража авторитетом рыцаря',
            passMessage: 'Ойвин пугливо щёлкает зубами и поднимает шлюзовой засов!',
            failMessage: 'Ойвин визжит на всю стену, призывая приливных трупоедов!',
            passEffect: {
              flagsSet: ['oyvin_coerced'],
              notification: 'Ойвин заворчал и открыл боковой лаз без платы.',
            },
            failEffect: {
              healthDelta: -10,
              notification: 'Визг стража привлёк стаю соляных падальщиков! Засада на парапете!',
            },
            failTargetSceneId: 'v_parapet_ambush',
          },
        },
        {
          id: 'c_oyvin_back_causeway',
          text: 'Отступить на внешний парапет и осмотреть галереи клуатра',
          targetSceneId: 'v_weeping_cloisters',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },

    // 6. v_cloister_mara (Маленькая Мара)
    v_cloister_mara: {
      id: 'v_cloister_mara',
      chapterTitle: 'Глава I: Волнолом Шепчущих Вод',
      location: 'Плачущий Клуатр — Запустелый Неф',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'young frail girl covered in encrusted salt crystals huddling behind broken weeping saint statue, feral posture, wide fearful human eyes reflecting lantern light, compassionate knight kneeling',
      actionFocus: 'Фонарь выхватывает из тьмы не чудовище, а маленькую соляную девочку',
      activeSpeaker: {
        name: 'Мара',
        emotion: 'pain',
      },
      narrative: [
        'Шорох за опрокинутой статуей святого заставляет тебя обнажить оружие. Но из тени выступает не когтистый морской зверь.',
        'Перед вами на коленях жмётся худенькая фигурка девочки лет девяти. Её ветхое платье промокло и затвердело от соли, щёки и плечи покрыты белой хрупкой коркой, но в огромных карих глазах дрожит живой человеческий ужас. Она прижимает руки к голове, тихо подвывая сквозь сжатые зубы.',
        '[Сера Никс|anxious] «Приливный трупоед... нет, Кейлен, постой! Она не бросается. У неё просто... кончилась память. Жители Велена превращаются в падальщиков не от яда, а когда забывают, кто они такие».',
      ],
      choices: [
        {
          id: 'c_mara_give_memory',
          text: 'Опуститься на колено и коснуться её лба: отдать тёплое воспоминание о детстве',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            sanityDelta: -10,
            relationshipDelta: 2,
            flagsSet: ['mara_remembered'],
            companionToast: 'Сера тронута до слёз твоим милосердием (+2)',
            notification:
              'Девочка вздрагивает: «Мара... меня зовут Мара!» Соляная корка на её щеках тает слезами.',
          },
        },
        {
          id: 'c_mara_sing_lullaby',
          text: 'Спеть старинную веленскую колыбельную (требуется знание песни)',
          targetSceneId: 'v_scriptorium_archives',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          condition: {
            requiredFlags: ['knows_lullaby'],
          },
          effect: {
            sanityDelta: 15,
            relationshipDelta: 3,
            flagsSet: ['mara_remembered', 'mara_guided_secret'],
            companionToast: 'Сера тихо подпевает, восхищённая гармонией (+3)',
            notification:
              'Мара улыбается сквозь слёзы и манит вас в тайный осушенный ход прямо к Архивам!',
          },
        },
        {
          id: 'c_mara_spare',
          text: 'Опустить клинок, положить сухарь на плиту и осторожно обойти девочку',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            flagsSet: ['mara_spared'],
            notification: 'Вы не причинили ей вреда. Девочка тихо спряталась в расщелине.',
          },
        },
        {
          id: 'c_mara_slay',
          text: 'Прервать мучения твари быстрым ударом клевца: закон Волнолома суров',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            sanityDelta: -12,
            relationshipDelta: -3,
            flagsSet: ['mara_slain'],
            companionToast: 'Сера в ужасе от твоей беспощадности (-3)',
            notification: 'Ты оборвал жизнь соляной девочки. Тяжёлый груз пал на твою душу (-12 Sanity).',
          },
        },
      ],
    },
    // ----------------------------------------------------
    // ГЛАВА II: МЕХАНИЗМЫ УТОНУВШИХ
    // ----------------------------------------------------

    // 9. v_tidewarden_barracks
    v_tidewarden_barracks: {
      id: 'v_tidewarden_barracks',
      chapterTitle: 'Глава II: Механизмы Утонувших',
      location: 'Казармы Ордена Волнолома — Покои Рыцарей',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'flooded knight barracks, stone bunks covered in barnacles and dried salt, rusted weapon racks, heavy iron chest embossed with a hawk soaring over waves emblem, melancholic atmospheric light',
      actionFocus: 'Кейлен находит аккуратно застеленную койку и сундук с гербом своего рода',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'pain',
      },
      hotspots: [
        {
          id: 'hotspot-vance-chest',
          name: 'Кованый сундук с соколом над волной',
          description: 'Личный рундук Маршала Врат. Под слоем ветоши тускло блестит фамильный медальон.',
          position: { x: 70, y: 65 },
          check: {
            attribute: 'perception',
            dc: 11,
            label: 'Вскрыть гербовый замок',
          },
          rewardFlag: 'found_barracks',
          foundText:
            'Ты находишь Медальон Вэнсов («item-vance-medallion»)! Память о старшем брате Эйрике пронзает сердце.',
        },
      ],
      narrative: [
        'Казармы Ордена застыли во времени триста лет назад. На каменных нарах всё ещё лежат полуистлевшие шерстяные плащи, на стойках дремлют заржавевшие протазаны и трезубцы.',
        'В дальнем углу — твоя собственная койка. Одеяло туго заправлено по уставу. На изголовье лежит пожелтевший лист пергамента, исписанный знакомым резким почерком брата:',
        '«Кей, если ты читаешь это — значит, Ночь Трёх Лун настала, и ты проснулся один. Прости меня. Не ищи вины в себе. Я стёр твою клятву, чтобы ты не встал рядом со мной у Врат. Живи за нас обоих... — Эйрик».',
      ],
      choices: [
        {
          id: 'c_barracks_read_aloud',
          text: 'Прочесть письмо брата вслух Сере: поделиться болью',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: -5,
            relationshipDelta: 2,
            flagsSet: ['knows_eirik_name', 'found_barracks'],
            companionToast: 'Сера вздрагивает при слове «Архив» и прячет глаза (+2)',
            notification: 'Ты поделился правдой. Сера молчит, но в её взгляде сквозит глубокое сочувствие.',
          },
        },
        {
          id: 'c_barracks_grieve_silent',
          text: 'Сжать пергамент в ладони, молча спрятать медальон на груди и выйти в коридор',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            flagsSet: ['knows_eirik_name', 'found_barracks'],
            notification: 'Слёзы высохли солью на щеках. Ты берёшь память о брате с собой.',
          },
        },
      ],
    },

    // 10. v_memory_market (Рынок Памяти)
    v_memory_market: {
      id: 'v_memory_market',
      chapterTitle: 'Глава II: Механизмы Утонувших',
      location: 'Осушенный Шлюзовой Базар — Рынок Памяти',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'underwater subterranean market hall dimly lit by bioluminescent sea lamps, hooded faceless salt merchant behind brass counter displaying rows of glowing glass vials filled with swirling memories',
      actionFocus: 'Безликий соляной купец предлагает купить или продать драгоценные крупицы памяти',
      activeSpeaker: {
        name: 'Соляной Ростовщик',
        emotion: 'smiling',
      },
      reactivePages: [
        {
          at: 'end',
          requiredFlags: ['mem_apples_given'],
          text: '[Соляной Ростовщик|smiling] «О-о-о... чую сладкий призрак летних яблок в твоей ауре! Старик Ойвин уже хвастался добычей. Редкий, изысканный вкус!»',
        },
      ],
      hotspots: [
        {
          id: 'hotspot-memory-vials',
          name: 'Прилавок с запечатанными фиалами',
          description: 'Флаконы из дутого стекла, внутри которых мерцают чужие присяги, признания и закаты.',
          position: { x: 45, y: 60 },
          check: {
            attribute: 'perception',
            dc: 12,
            label: 'Изучить флаконы с воспоминаниями',
          },
          rewardFlag: 'studied_memory_market',
          foundText:
            'Ты понимаешь принцип Соляной Короны: память здесь имеет физический вес и обращается словно монета.',
        },
      ],
      narrative: [
        'В осушенном сводчатом зале среди коралловых арок развернулись латунные прилавки. За ними неподвижно стоит высокая фигура в мантии, сотканной из белых кристаллов.',
        '[Соляной Ростовщик|smiling] «Приветствую уцелевшего. Здесь память — единственная чеканная монета. Продай ненужное горе, купи забытую истину. Либо присягу павшего рыцаря, либо каплю дождевой воды из внешнего мира. Что угодно душе, пока в ней ещё остался огонь».',
      ],
      choices: [
        {
          id: 'c_market_sell_memory',
          text: 'Продать случайное воспоминание о солнце: получить дистиллят и склянку дождя',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            sanityDelta: -10,
            healthDelta: 15,
            flagsSet: ['sold_memory_market'],
            notification:
              'Ты продал воспоминание о солнечном тепле (-10 Sanity). Ростовщик отдаёт «item-vial-rain» и соль.',
          },
        },
        {
          id: 'c_market_buy_secret',
          text: 'Купить тайну чертежей Волнолома: слабость Полого Стража',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            sanityDelta: -5,
            flagsSet: ['knows_sentinel_pressure_valve'],
            notification:
              'Ростовщик шепчет: «За спиной Стража — гидравлический клапан сброса давления». Знание получено!',
          },
        },
        {
          id: 'c_market_haggle',
          text: 'Поторговаться: убедить купца уступить тайну без уплаты рассудка',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          skillCheck: {
            attribute: 'charisma',
            dc: 13,
            label: 'Заключить выгодную сделку с ростовщиком',
            passMessage: 'Купец восхищён твоей хваткой и открывает тайну даром!',
            failMessage: 'Купец коварен: пальцы из соли вытягивают воспоминание силой!',
            passEffect: {
              flagsSet: ['knows_sentinel_pressure_valve'],
              notification: 'Успех! Ты получил знание о клапане Стража без потерь рассудка.',
            },
            failEffect: {
              sanityDelta: -10,
              flagsSet: ['knows_sentinel_pressure_valve'],
              notification: 'Купец забрал воспоминание силой (-10 Sanity), но тайну открыл.',
            },
          },
        },
        {
          id: 'c_market_leave',
          text: 'Сказать: «Моя память не продаётся» — и вернуться в преддверие',
          targetSceneId: 'v_sluice_antechamber',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },

    // 12. v_camp_salt_fire
    v_camp_salt_fire: {
      id: 'v_camp_salt_fire',
      chapterTitle: 'Глава II: Механизмы Утонувших',
      location: 'Опорный шурф — Соляной Привал',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'quiet camp in a deep dry salt cavern, blue fire glowing softly on crystalline hearth, tired female scholar and weary knight resting, warm intimate gothic atmosphere',
      actionFocus: 'Привал у синего соляного костра: время доверительного разговора',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'neutral',
      },
      narrative: [
        'В сухой расщелине шурфа кристаллы соли горят ровным, лазурно-синим пламенем, не давая дыма. Тепло костра приятно согревает промокшие доспехи.',
        'Сера сидит, обхватив колени руками, и смотрит в огонь. «...сорок четыре, сорок пять... Знаешь, Кейлен, я сирота. Меня подобрали на побережье, когда мне было шесть. В Архиве тишина звенит так, что ломит виски. Поэтому я всегда считаю волны. Когда волна шумит — мир ещё жив».',
        'Она поворачивается к тебе: «А ты? Что ты помнишь о доме до катастрофы? О своей матери?»',
      ],
      choices: [
        {
          id: 'c_camp_tell_mother',
          text: 'Рассказать о матери и яблоне у крыльца в долине Эйдерн',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            relationshipDelta: 2,
            sanityDelta: -5,
            flagsSet: ['told_sera_mother'],
            companionToast: 'Сера слушает затаив дыхание, её взгляд теплеет (+2)',
            notification: 'Рассказывая, ты словно отдаёшь частицу тепла. Сера запомнит каждое слово.',
          },
        },
        {
          id: 'c_camp_ask_archive',
          text: 'Спросить напрямик: «Что на самом деле нужно Приме Мелиор от Астролябии?»',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            flagsSet: ['sera_partial_truth'],
            companionToast: 'Сера вздрагивает и сбивается со счёта волн',
            notification:
              'Сера отводит глаза: «Архив хочет спасти побережье. Любой ценой». Её голос дрожит.',
          },
        },
        {
          id: 'c_camp_ask_whispers',
          text: '«О чём поёт шёпот в стенах, Сера? Научи меня слышать его»',
          targetSceneId: 'v_salt_chapel',
          tag: 'DIALOGUE',
          approach: 'Arcane',
          effect: {
            relationshipDelta: 1,
            flagsSet: ['knows_lullaby'],
            companionToast: 'Сера напевает тихую веленскую колыбельную (+1)',
            notification: 'Ты выучил древнюю колыбельную соляных сестёр!',
          },
        },
        {
          id: 'c_camp_rest_silent',
          text: 'Закрыть глаза и отдохнуть в тишине под треск синего огня',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'CAUTIOUS',
          approach: 'Surrender',
          effect: {
            healthDelta: 20,
            sanityDelta: 10,
            notification: 'Короткий сон вернул силы телу и разуму (+20 HP, +10 Sanity).',
          },
        },
      ],
    },

    // 13. v_observatory_star (Иллюминатор в Пропасть: Падающая звезда Эльтар)
    v_observatory_star: {
      id: 'v_observatory_star',
      chapterTitle: 'Глава II: Механизмы Утонувших',
      location: 'Глубинная Обсерватория — Иллюминатор в Пропасть',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'titanic cosmic fallen star trapped at the bottom of underwater oceanic abyss inside glowing frozen time sphere, ancient bronze armillary sphere model, breathtaking majestic gothic sci-fantasy',
      actionFocus: 'Сера и Кейлен смотрят сквозь хрустальный купол на застывшую звезду Эльтар',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'anxious',
      },
      hotspots: [
        {
          id: 'hotspot-observatory-crown',
          name: 'Бронзовая модель Короны',
          description:
            'Миниатюрная копия Короны Застывших Вод. На медных ободьях выбиты имена всех сорока тысяч жителей Велена.',
          position: { x: 50, y: 70 },
          check: {
            attribute: 'intellect',
            dc: 13,
            label: 'Изучить гравировку Короны',
          },
          rewardFlag: 'knows_crown_truth',
          foundText:
            'На ободьях выгравированы имена горожан: «Если назвать каждого — память вернётся». Это ключ к секретному спасению Велена!',
        },
      ],
      narrative: [
        'Сера подводит тебя к огромному круглому иллюминатору в наклонном базальтовом полу обсерватории. Здесь нет рыб и светящихся кораллов — внизу зияет абсолютная Пропасть Чёрных Вод.',
        'На самом её дне, скованная колоссальными кольцами Астролябии, мерцает упавшая звезда Эльтар. Она размером с целый город, и от её застывшего бледного огня вибрирует сама толща океана. Звезда падает уже триста лет — по волоску в год.',
        '[Сера Никс|anxious] «Вот ради чего всё это было. Король поймал падающую звезду в каплю застывшего времени. Но купол держится не на магии — он питается памятью сорока тысяч соляных душ...»',
      ],
      choices: [
        {
          id: 'c_star_study_model',
          text: 'Изучить бронзовую модель Короны: разглядеть гравировку имён горожан',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            sanityDelta: 10,
            relationshipDelta: 1,
            flagsSet: ['knows_crown_truth'],
            notification: 'Ты разглядел имена на модели Короны: каждый соляной помнит своё имя!',
          },
        },
        {
          id: 'c_star_touch_glass',
          text: 'Прижать ладонь к холодному стеклу иллюминатора: ощутить пульс звезды',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          skillCheck: {
            attribute: 'perception',
            dc: 12,
            label: 'Выдержать звёздный взор Эльтара',
            passMessage: 'Ты видишь сквозь стекло древнее пламя и обретаешь ясность мысли (+15 Sanity)!',
            failMessage: 'Ледяной холод космоса обжигает разум ужасом перед масштабом бездны (-10 Sanity).',
            passEffect: {
              sanityDelta: 15,
              flagsSet: ['saw_star_vision'],
              notification: 'Видение застывшей звезды укрепило волю рыцаря (+15 Sanity).',
            },
            failEffect: {
              sanityDelta: -10,
              flagsSet: ['feared_star'],
              notification: 'Бездна вселила первобытный страх (-10 Sanity).',
            },
          },
        },
        {
          id: 'c_star_turn_away',
          text: 'Отвернуться от головокружительной бездны и продолжить путь к Скрипторию',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },

    // 14. v_chapel_isolde (Хор Соляных Сестёр и Мать Изольда)
    v_chapel_isolde: {
      id: 'v_chapel_isolde',
      chapterTitle: 'Глава II: Механизмы Утонувших',
      location: 'Соляная Капелла — Алтарь Застывшего Хора',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'crystalline sunken chapel with towering statues of weeping veiled nuns made entirely of translucent white salt, blue spectral light from choir, venerable salt mother spirit standing before altar',
      actionFocus: 'Мать Изольда и Хор Соляных Сестёр поют песнь добровольного заклания',
      activeSpeaker: {
        name: 'Мать Изольда',
        emotion: 'neutral',
      },
      hotspots: [
        {
          id: 'hotspot-choir-altar',
          name: 'Соляной алтарь с отпечатками ладоней',
          description: 'Сотни углублений от девичьих ладоней. Каждая сестра отдала память добровольно.',
          position: { x: 50, y: 70 },
          check: {
            attribute: 'intellect',
            dc: 12,
            label: 'Прочесть присягу сестёр',
          },
          rewardFlag: 'studied_choir_oath',
          foundText:
            'Запись на алтаре: «Мы встали щитом добровольно. Пусть никто не разрушит наш хор без нашего согласия».',
        },
      ],
      narrative: [
        'Своды капеллы сотканы из белоснежной сверкающей соли. В нишах стоят десятки застывших фигур монахинь в покрывалах. Из их приоткрытых губ льётся несмолкающий чистый многоголосый хор.',
        'От алтаря отделяется высокая пожилая монахиня, чьё лицо кажется выточенным из алебастра.',
        '[Мать Изольда|neutral] «Мы Хор Сестёр Волнолома, рыцарь. Триста лет назад мы сами выбрали стать солью, чтобы удержать своды над спящими. Мы не жертвы тирана. Не решай за нас во второй раз, путник. Спой с нами нашу колыбельную — или уйди с миром».',
      ],
      choices: [
        {
          id: 'c_isolde_sing_lullaby',
          text: 'Запеть веленскую колыбельную (требуется знание песни)',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: {
            requiredFlags: ['knows_lullaby'],
          },
          effect: {
            sanityDelta: 20,
            relationshipDelta: 1,
            flagsSet: ['shard_lullaby'],
            itemsAdded: [
              {
                id: 'shard-lullaby',
                name: 'Осколок Колыбельной',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                description: 'Кристаллизованное созвучие Хора Сестёр. Один из трёх Осколков Памяти.',
                loreNote: 'Хранит чистую память тех, кто ушёл в соль добровольно ради спасения города.',
                effectSummary: 'Необходим для истинного финала «Возвращённая Память».',
                acquiredLocation: 'Соляная Капелла',
                usable: false,
              },
            ],
            notification: 'Хор вторит твоей песне! Мать Изольда передаёт Осколок Колыбельной («shard-lullaby»)!',
          },
        },
        {
          id: 'c_isolde_sera_sings',
          text: 'Попросить Серу спеть: её чистый голос подхватывает гармонию Хора',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          condition: {
            minRelationship: 3,
          },
          effect: {
            relationshipDelta: 2,
            sanityDelta: 15,
            flagsSet: ['shard_lullaby'],
            itemsAdded: [
              {
                id: 'shard-lullaby',
                name: 'Осколок Колыбельной',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                description: 'Кристаллизованное созвучие Хора Сестёр. Один из трёх Осколков Памяти.',
                loreNote: 'Хранит чистую память тех, кто ушёл в соль добровольно ради спасения города.',
                effectSummary: 'Необходим для истинного финала «Возвращённая Память».',
                acquiredLocation: 'Соляная Капелла',
                usable: false,
              },
            ],
            companionToast: 'Сера поёт с замиранием сердца (+2)',
            notification: 'Сера спела для сестёр! Хор вручает вам Осколок Колыбельной («shard-lullaby»)!',
          },
        },
        {
          id: 'c_isolde_leave',
          text: 'Склонить голову в почтении и тихо покинуть священный хор',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },
    // ----------------------------------------------------
    // ГЛАВА III: ШЕПЧУЩИЙ СКРИПТОРИЙ
    // ----------------------------------------------------

    // 17. v_scriptorium_truth
    v_scriptorium_truth: {
      id: 'v_scriptorium_truth',
      chapterTitle: 'Глава III: Шепчущий Скрипторий',
      location: 'Скрипторий — Потайной Архиварий',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'ancient waterlogged archive room with towering bookshelves encrusted with salt, glowing parchment with handwritten margin notes, pale scholar woman caught looking pale and guilty',
      actionFocus: 'Кейлен читает тайную пометку на полях фолианта: заговор Архива раскрыт',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'anxious',
      },
      narrative: [
        'Ты прижимаешь пергамент к латунному фонарю. Сера нарочно перепрыгнула три абзаца, но выцветшие чернила на полях не скрыть.',
        'Почерк резкий, уверенный — рука Примы Мелиор сорокалетней давности:',
        '«*Держатель не вернётся. Каждый цикл выжигает память дочиста, пока человек не обратится в соляной монолит, подобный Стражу Ворот. Предупредить спящего? Нет. Не предупреждать. Побережье важнее одной жизни. — М.К.*»',
        'Сера застывает, сжимая полы плаща. Её пальцы побелели. Она открывает рот, но слова застревают в горле.',
      ],
      choices: [
        {
          id: 'c_truth_confront_sera',
          text: 'Повернуть фонарь на Серу: «Ты знала. Мелиор послала тебя вести меня на убой?»',
          targetSceneId: 'v_sera_confession',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            flagsSet: ['noticed_sera_omission', 'knows_archive_plan'],
            notification: 'Ты потребовал ответа. Взгляд Серы полон боли и раскаяния.',
          },
        },
        {
          id: 'c_truth_stay_silent',
          text: 'Спрятать пергамент, промолчать и продолжить путь, не подавая виду',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            relationshipDelta: -1,
            flagsSet: ['noticed_sera_omission', 'knows_archive_plan', 'sera_unconfronted'],
            notification: 'Ты промолчал, но трещина недоверия легла между вами (-1).',
          },
        },
      ],
    },

    // 18. v_sera_confession
    v_sera_confession: {
      id: 'v_sera_confession',
      chapterTitle: 'Глава III: Шепчущий Скрипторий',
      location: 'Скрипторий — Уединённый Свод',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'young dark-haired female scholar crying softly in shadowy flooded cloister, hand clutching brass signet ring, knight standing solemnly before her, candle-like salt lanterns',
      actionFocus: 'Исповедь Серы Никс: слёзы, правда о приказе Примы и выбор прощения',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'pain',
      },
      narrative: [
        'Сера закрывает лицо ладонями. Плечи её мелко дрожат, она сбивается со счёта волн — впервые за всё ваше странствие.',
        '[Сера Никс|pain] «Да! Да, чёрт возьми! Мелиор приказала мне разбудить тебя, провести через шлюзы и убедить положить руку на кольца Астролябии! Она сказала, что это единственный способ спасти двести тысяч жизней в Трех Гаванях! Я думала... я думала, что это справедливо. Что это высокий долг. Пока не увидела твои глаза в склепе. Пока ты не поблагодарил меня просто за то, что я подала руку...»',
        'Она поднимает мокрое от слёз лицо, протягивая тебе латунную печать Соляного Архива: «Я не могу больше лгать тебе, Кейлен. Сделай со мной что хочешь. Но не отдавай себя Астролябии вслепую».',
      ],
      choices: [
        {
          id: 'c_confess_forgive',
          text: '«Ты была орудием в чужих руках, Сера. Я прощаю тебя. Мы найдём другой путь»',
          targetSceneId: 'v_scriptorium_archives',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            relationshipDelta: 3,
            sanityDelta: 10,
            flagsSet: ['sera_confessed', 'sera_forgiven'],
            itemsAdded: [
              {
                id: 'item-archive-sign',
                name: 'Знак Соляного Архива',
                category: 'Curio',
                rarity: 'rare',
                quantity: 1,
                description: 'Латунная печать проводника Архива, переданная Серой в знак искупления.',
                loreNote: 'Открывает тайные замки Архива и доказывает расторжение договора с Примой.',
                effectSummary: 'Символ доверия и раскаяния спутницы.',
                acquiredLocation: 'Шепчущий Скрипторий',
                usable: false,
              },
            ],
            companionToast: 'Сера поражена твоим великодушием (+3)',
            notification: 'Ты простил Серу. Узы доверия стали несокрушимыми.',
          },
        },
        {
          id: 'c_confess_denounce',
          text: 'Отвергнуть печать: «Ты вела меня на плаху триста лет спустя. Не подходи ко мне»',
          targetSceneId: 'v_scriptorium_archives',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            relationshipDelta: -3,
            sanityDelta: -10,
            flagsSet: ['sera_confessed', 'sera_denounced'],
            companionToast: 'Сера раздавлена твоим приговором (-3)',
            notification: 'Ты оттолкнул спутницу. Между вами осталась лишь ледяная пропасть.',
          },
        },
        {
          id: 'c_confess_use_cold',
          text: 'Забрать печать молча: «Твой долг — довести меня до Врат. Ни слова больше»',
          targetSceneId: 'v_scriptorium_archives',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
          effect: {
            flagsSet: ['sera_confessed', 'sera_used_cold'],
            itemsAdded: [
              {
                id: 'item-archive-sign',
                name: 'Знак Соляного Архива',
                category: 'Curio',
                rarity: 'rare',
                quantity: 1,
                description: 'Латунная печать проводника Архива, изъятая у Серы.',
                loreNote: 'Открывает тайные замки Архива.',
                effectSummary: 'Знак холодной прагматичности.',
                acquiredLocation: 'Шепчущий Скрипторий',
                usable: false,
              },
            ],
            notification: 'Сера замолчала. Её шутки и подсчёт волн смолкли навсегда.',
          },
        },
      ],
    },

    // 19. v_scriptorium_archives (Осушенный Реестр — закрывает битую ссылку!)
    v_scriptorium_archives: {
      id: 'v_scriptorium_archives',
      chapterTitle: 'Глава III: Шепчущий Скрипторий',
      location: 'Тайный Архив Скриптория — Свинцовый Реестр',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'vast cavernous flooded library drained of black water, towering lead tablets inscribed with thousands of names in gold leaf, quiet awe-inspiring sanctuary of solemn memory',
      actionFocus: 'Кейлен читает запись в Свинцовом Реестре: имя старшего брата выбито золотом',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'pain',
      },
      hotspots: [
        {
          id: 'hotspot-ledger-vance',
          name: 'Свинцовая плита рода Вэнсов',
          description:
            'На тяжёлом свинцовом листе выбиты имена рыцарей: «Вэнс, Кейлен: не уплачено — сокрыт». Ниже: «Вэнс, Эйрик, Маршал Врат: уплачено полностью — Страж Врат».',
          position: { x: 50, y: 55 },
          check: {
            attribute: 'intellect',
            dc: 11,
            label: 'Прочесть реестровую запись',
          },
          rewardFlag: 'read_ledger',
          foundText:
            'Истина сокрушает сознание: Полый Страж, стерегущий Врата Бездны — твой родной старший брат Эйрик!',
        },
        {
          id: 'hotspot-ledger-valve',
          name: 'Дневник главного инженера дамбы',
          description: 'Чертежи гидравлического контура Волнолома с пометкой о клапане давления.',
          position: { x: 75, y: 70 },
          check: {
            attribute: 'perception',
            dc: 11,
            label: 'Изучить инженерный дневник',
          },
          rewardFlag: 'knows_sentinel_pressure_valve',
          foundText:
            'Ты находишь точную схему: затылочный гидроклапан брони Стража сбрасывает давление при ударе клевцом!',
        },
      ],
      narrative: [
        'Осушенный зал Реестра огромен. Вдоль стен до самого потолка тянутся монументальные свинцовые плиты. На них тончайшим резцом высечены имена всех сорока тысяч жителей Велена, отдавших воспоминания морю три века назад.',
        'Перед плитой маршалов ты замираешь. Пальцы в латной перчатке касаются золочёных букв:',
        '«*Вэнс, Кейлен: плата не взималась. Помещён в Соляной Сон по приказу Короля и Маршала.*»',
        'И строчкой ниже: «*Вэнс, Эйрик: уплачено сердцем, клятвой и памятью. Назначен Вечным Стражем Врат.*»',
        'Эйрик отдал всего себя, чтобы удержать мост и защитить твой сон. Он не предавал тебя. Он принёс себя в жертву.',
      ],
      choices: [
        {
          id: 'c_archives_to_crypt',
          text: 'Спуститься в Забытую Крипту Ордена: отдать дань памяти Командору',
          targetSceneId: 'v_forgotten_crypt',
          tag: 'RECON',
          approach: 'Investigative',
          effect: {
            flagsSet: ['knows_eirik_name', 'read_ledger'],
            notification: 'Ты спускаешься в крипту с открытыми глазами на правду о брате.',
          },
        },
        {
          id: 'c_archives_to_depths',
          text: 'Пройти через сводчатые глубины прямо к рубежу Бездны',
          targetSceneId: 'v_drowned_scriptorium_depths',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            flagsSet: ['knows_eirik_name', 'read_ledger'],
            notification: 'Ты ступаешь вперёд. Впереди ждёт мост и твой брат.',
          },
        },
        {
          id: 'c_archives_return_scriptorium',
          text: 'Вернуться в залы Скриптория: сопоставить найденное с другими хрониками',
          targetSceneId: 'v_scriptorium_entry',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },
    // ----------------------------------------------------
    // ГЛАВА IV: ВРАТА БЕЗДНЫ И ПОЛЫЙ СТРАЖ
    // ----------------------------------------------------

    // 21. v_bridge_eve (Канун Моста)
    v_bridge_eve: {
      id: 'v_bridge_eve',
      chapterTitle: 'Глава IV: Врата Бездны',
      location: 'Базальтовый выступ — Канун Моста Бездны',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'solemn moonlit cliff edge overlooking immense bottomless black abyss, three moons in dark violet sky, distant colossal guardian standing silent on cyclopean bridge, knight and scholar resting by campfire',
      actionFocus: 'Кейлен и Сера у края Пропасти: три луны в зените перед решающей битвой',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'neutral',
      },
      reactivePages: [
        {
          at: 'end',
          requiredFlags: ['sera_forgiven'],
          text: '[Сера Никс|smiling] «Кейлен... спасибо, что не оттолкнул меня. Что бы ни ждало за мостом — я с тобой. Мой долг теперь перед тобой, а не перед Архивом».',
        },
        {
          at: 'end',
          requiredFlags: ['sera_denounced'],
          text: '[Сера Никс|pain] «Я доведу тебя до врат, как велела Мелиор. Больше мне нечего тебе сказать».',
        },
      ],
      narrative: [
        'Вы выходите на узкий базальтовый выступ. Внизу разверзается Пропасть Чёрных Вод — исполинская бездна, на самом дне которой мерцает застывший холодный огонь упавшей звезды Эльтар.',
        'В небе три луны сходятся в единую линию затмения: серебряная Ниэль, багряная Хатра и бездонный Орм. Ночь Трёх Лун началась.',
        'Впереди над бездной выгнулся циклопический каменный мост. Посреди него, опершись на исполинский метеоритный палаш, неподвижно застыл исполин в монолитной соляной броне — Полый Страж. Твой брат.',
      ],
      choices: [
        {
          id: 'c_bridge_eve_camp',
          text: 'Сделать последний привал: собраться с духом перед выходом на мост',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'CAUTIOUS',
          approach: 'Surrender',
          effect: {
            healthDelta: 20,
            sanityDelta: 15,
            notification: 'Глоток дождевой воды и минута тишины укрепили дух (+20 HP, +15 Sanity).',
          },
        },
        {
          id: 'c_bridge_eve_advance',
          text: 'Шагнуть на мост навстречу брату',
          targetSceneId: 'v_abyssal_chasm',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
        },
      ],
    },

    // 23. v_sentinel_recall (Имя пробивает броню)
    v_sentinel_recall: {
      id: 'v_sentinel_recall',
      chapterTitle: 'Глава IV: Врата Бездны',
      location: 'Мост Врат Бездны — Рубеж Стража',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'armored eight-foot giant guardian freezing mid-strike, tears of pure saltwater breaking through dark iron helm visor, glowing memories surrounding kneeling younger knight',
      actionFocus: 'Голос Кейлена пробивает вековую глухоту соли: Страж замирает',
      activeSpeaker: {
        name: 'Полый Страж',
        emotion: 'pain',
      },
      narrative: [
        '«Эйрик!» — твой голос звенит над ревущей пучиной, отражаясь от базальтовых сводов. — «Эйрик, брат мой! Это я, Кейлен! Ты просил меня жить за нас обоих!»',
        'Исполинский палаш замирает в ладони Стража в нескольких дюймах от твоей груди. Соляные наросты на забрале покрываются сеткой трещин.',
        'Из глубин шлема раздаётся надтреснутый, хриплый шёпот — голос, который ты слышал каждое утро своего детства:',
        '[Полый Страж|pain] «...Кей?.. Это ты?.. Живой... Я держу мост триста зим... Я забыл лица, забыл солнце... но твоё имя держало мои руки. Я не уверен... что во мне ещё осталось что-то человеческое... но я помню тебя».',
      ],
      choices: [
        {
          id: 'c_recall_to_resolution',
          text: 'Опустить оружие и сделать шаг к брату с раскрытыми ладонями',
          targetSceneId: 'v_sentinel_defeated',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 30,
            relationshipDelta: 3,
            flagsSet: ['sentinel_recalled', 'eirik_at_peace'],
            companionToast: 'Сера плачет от благоговения перед силой братской любви (+3)',
            notification: 'Имя брата растопило лёд забвения! Эйрик обрёл покой (+30 Sanity).',
          },
        },
      ],
    },

    // 25. v_sentinel_defeated (Развязка босса — закрывает вторую битую ссылку!)
    v_sentinel_defeated: {
      id: 'v_sentinel_defeated',
      chapterTitle: 'Глава IV: Врата Бездны',
      location: 'Мост Врат Бездны — Поверженный Рубеж',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'massive hollow guardian armor kneeling down solemnly or dissipating into shimmering crystalline salt dust on bridge, open doorway to inner sanctum behind him glowing with golden ethereal light',
      actionFocus: 'Рубеж преодолён: Полый Страж отступает или рассыпается, открывая путь к Тронному Залу',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'neutral',
      },
      reactivePages: [
        {
          at: 'end',
          requiredFlags: ['sentinel_recalled'],
          text: '[Полый Страж|smiling] «Иди, Кей... заверши то, что мы начали. Я прикрою твой отход от Бездны до самого рассвета».',
        },
        {
          at: 'end',
          requiredFlags: ['sentinel_redeemed'],
          text: '[Полый Страж|neutral] «Свет фонаря сжёг морок. Возьми мой наплечный знак... пусть Орден знает, что мы не дрогнули».',
        },
        {
          at: 'end',
          requiredFlags: ['memory_sacrificed'],
          text: '[Полый Страж|pain] «Я сохраню лицо нашей матери в своём сердце... пока жив последний кристалл этой брони».',
        },
        {
          at: 'end',
          anyFlags: ['sentinel_killed_combat', 'sentinel_valve_punctured', 'sentinel_shattered'],
          text: '[Сера Никс|pain] «Кейлен... взгляни на его расколотый наплечник. Сокол над волной. Это герб твоего рода Вэнсов... Полым Стражем был твой старший брат Маршал Эйрик».',
        },
        {
          at: 'end',
          anyFlags: ['sentinel_killed_combat', 'sentinel_valve_punctured', 'sentinel_shattered'],
          text: '[Кейлен Вэнс|pain] «Эйрик... ты отдал всё, чтобы удержать мост для меня. Прости меня, брат. Я завершу то, ради чего ты пал».',
        },
      ],
      hotspots: [
        {
          id: 'hotspot-sentinel-gong',
          name: 'Наплечный знак Маршала Врат',
          description:
            'Золотой наплечник с гербом сокола над волной. Резонирует с чистой памятью о братстве.',
          position: { x: 50, y: 60 },
          check: {
            attribute: 'intellect',
            dc: 10,
            label: 'Снять священный знак Маршала',
          },
          requiredFlag: 'eirik_at_peace',
          rewardFlag: 'shard_name',
          foundText:
            'Ты получаешь Осколок Имени («shard-name»)! Третий и последний Осколок Памяти у тебя в руках!',
        },
      ],
      narrative: [
        'Грохот битвы стихает. Над бездной остаётся лишь мерный глухой рокот океанических приливов.',
        'Мост открыт. Врата Бездны медленно распахиваются, обнажая внутреннюю галерею из застывшей водяной толщи, ведущую к Тронному Залу Короля Приливов.',
        'Перед вами лежит путь к Астролябии. Судьба Затопленной Цитадели и падающей звезды решится за этим порогом.',
      ],
      choices: [
        {
          id: 'c_defeated_take_shard_name',
          text: 'Принять напутствие Эйрика и взять Осколок Имени (требуется мирный исход)',
          targetSceneId: 'v_inner_sanctum_approach',
          tag: 'RELIC',
          approach: 'Arcane',
          condition: {
            anyFlags: ['sentinel_recalled', 'sentinel_redeemed', 'memory_sacrificed', 'eirik_at_peace'],
          },
          effect: {
            flagsSet: ['shard_name'],
            itemsAdded: [
              {
                id: 'shard-name',
                name: 'Осколок Имени',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                description: 'Кристаллизованное имя старшего брата Эйрика Вэнса. Третий Осколок Памяти.',
                loreNote: 'Хранит узы братства, победившие триста лет вечного соляного морока.',
                effectSummary: 'Необходим для истинного финала «Возвращённая Память».',
                acquiredLocation: 'Мост Врат Бездны',
                usable: false,
              },
            ],
            notification: 'Ты принял Осколок Имени («shard-name»)! Все три Осколка Памяти собраны!',
          },
        },
        {
          id: 'c_defeated_honor_fallen',
          text: 'Остаться и почтить павшего брата: преклонить колено перед доспехом',
          targetSceneId: 'v_inner_sanctum_approach',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            sanityDelta: 5,
            notification: 'Ты склоняешь колено перед доспехом брата. Тишина приносит покой растерзанному разуму (+5 рассудка).',
          },
        },
        {
          id: 'c_defeated_proceed_sanctum',
          text: 'Шагнуть во внутреннее святилище навстречу Астролябии',
          targetSceneId: 'v_inner_sanctum_approach',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
        },
      ],
    },
    // ----------------------------------------------------
    // ГЛАВА V: СЕРДЦЕ ПРИЛИВА И ФИНАЛЫ
    // ----------------------------------------------------

    // 27. v_throne_prima (Прима Мелиор Ксайн)
    v_throne_prima: {
      id: 'v_throne_prima',
      chapterTitle: 'Глава V: Сердце Прилива',
      location: 'Преддверие Тронного Зала — Пост Примы',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'grand flooded antechamber with marble columns covered in crystalline salt, formidable elderly matriarch in scholar robes flanked by six masked salt reapers with scythes, tense dramatic standoff',
      actionFocus: 'Прима Мелиор преграждает путь к Астролябии: холодный прагматизм против свободы',
      activeSpeaker: {
        name: 'Прима Мелиор Ксайн',
        emotion: 'neutral',
      },
      reactivePages: [
        {
          at: 'end',
          requiredFlags: ['sera_confessed', 'sera_forgiven'],
          minRelationship: 4,
          text: '[Сера Никс|angry] «Остановись, Прима! Я больше не твоя пешка. Кейлен не станет вашей соляной марионеткой!» Мелиор впервые меняется в лице.',
        },
      ],
      narrative: [
        'В высоких воротах Тронного Зала путь преграждает женщина с высокой причёской из поседевших волос, скреплённой костяными спицами. Её мантия расшита золотыми знаками Архива. За её спиной неподвижно застыли шесть рослых фигур в масках — Жницы Соли.',
        '[Прима Мелиор Ксайн|neutral] «Добро пожаловать к порогу судьбы, сэр Кейлен. Вы проделали долгий путь сквозь три века. Я не злодейка и не враг вам. Если вы разобьёте Астролябию — звезда Эльтар рухнет, и двухсоттысячное население Трёх Гаваней смоет волной в один вздох. Единственный выход — вы должны положить руку на кольца и стать Держателем. Мы с Архивом станем вашим разумом».',
      ],
      choices: [
        {
          id: 'c_prima_sway',
          text: 'Переубедить Мелиор: доказать, что вечная жертва одного человека исчерпала себя',
          targetSceneId: 'v_astrolabe_dais',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          skillCheck: {
            attribute: 'charisma',
            dc: 14,
            label: 'Сломить уверенность верховного архивиста',
            passMessage: 'Мелиор потрясена силой твоих доводов и велит Жницам опустить серпы!',
            failMessage: 'Мелиор непреклонна, но в замешательстве отступает на шаг.',
            passEffect: {
              flagsSet: ['meliora_swayed'],
              notification: 'Прима Мелиор поколеблена и позволяет пройти без боя.',
            },
            failEffect: {
              notification: 'Мелиор холодно отступает, пропуская вас к Астролябии.',
            },
          },
        },
        {
          id: 'c_prima_side',
          text: 'Согласиться с её расчётом: «Побережье превыше всего. Я займу трон»',
          targetSceneId: 'v_astrolabe_dais',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            relationshipDelta: -3,
            flagsSet: ['sided_meliora'],
            companionToast: 'Сера в отчаянии от твоего смирения (-3)',
            notification: 'Ты принял условия Архива. Мелиор склоняет голову в почтении.',
          },
        },
        {
          id: 'c_prima_combat',
          text: 'Обнажить клинок: оттеснить Жниц силой оружия',
          targetSceneId: 'v_astrolabe_dais',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            healthDelta: -15,
            flagsSet: ['meliora_defeated'],
            notification: 'Сталь рассекает соляные серпы! Жницы отброшены (-15 HP).',
          },
        },
      ],
    },

    // 28. v_king_echo (Голос Короля Ауреана)
    v_king_echo: {
      id: 'v_king_echo',
      chapterTitle: 'Глава V: Сердце Прилива',
      location: 'Алтарь Астролябии — Резонанс Короны',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'spinning golden rings of giant astrolabe, spectral golden crowned king silhouette speaking gently, glowing memory fragments swirling in air, profound spiritual atmosphere',
      actionFocus: 'Прикосновение к кольцам Астролябии: дух Короля Ауреана открывает тайну искупления',
      activeSpeaker: {
        name: 'Король Ауреан III',
        emotion: 'pain',
      },
      narrative: [
        'Ты осторожно касаешься внешнего золотого обруча механизма. Звон трёхмерных колец наполняет зал чистейшей музыкой сфер, и в центре сияния материализуется призрачный силуэт в венце из орихалка.',
        '[Король Ауреан III|pain] «Кейлен, дитя Волнолома... три века мне стыдно перед моим народом. Я запер звезду их памятью и обещал вернуть её, когда опасность минует. Но я пал раньше, чем настал этот день. Не верь тем, кто твердит, будто выход — новый Держатель. Астролябию можно обратить вспять».',
        'Он простирает светящиеся ладони: «Назови каждого из шепчущих по имени. Верни им Осколки Памяти. Соль растает, люди проснутся и сами удержат звезду вместе! Они учились держать её триста лет. Собери три Осколка: песнь Хора, клятву Ордена и имя брата».',
      ],
      choices: [
        {
          id: 'c_king_heard',
          text: '«Я слышу тебя, Ваше Величество. Память вернётся народу Велена»',
          targetSceneId: 'v_astrolabe_dais',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 25,
            flagsSet: ['heard_king'],
            notification: 'Тайна Астролябии открыта! Доступен секретный путь «Возвращённая Память»!',
          },
        },
      ],
    },

    // 30. v_ending_return (Истинный финал — «Возвращённая Память»)
    v_ending_return: {
      id: 'v_ending_return',
      chapterTitle: 'Финал: Возвращённая Память',
      location: 'Возрождённый Велен — Рассвет над Морем',
      isEnding: true,
      endingType: 'victory',
      endingTitle: 'Возвращённая Память (Истинный Финал)',
      endingEpilogue:
        'Эпилог: Соль растаяла чистыми ручьями. Сорок тысяч душ проснулись и удержали падающую звезду вместе. Велен всплыл свободным городом.',
      localImage: '/images/preset_world_eldoria_1791455431121.webp',
      visualPrompt:
        'magnificent golden dawn over flooded gothic city rising from ocean, smiling young female scholar with tears looking at resurrected people, gentle knight standing beside tall brother holding a blossoming apple branch',
      actionFocus: 'Истинный триумф: соляные кристаллы тают, возрождая павших жителей Велена',
      activeSpeaker: {
        name: 'Сера Никс',
        emotion: 'smiling',
      },
      narrative: [
        'Ты вкладываешь три Осколка Памяти в золотое средоточие Астролябии: чистую колыбельную сестёр, непоколебимую присягу рыцарей и священное имя брата.',
        'Сера встаёт рядом и во весь голос читает страницы Свинцового Реестра, называя сорок тысяч имён. Из глубин коридоров доносится звонкий детский смех Мары, подхватывающей песню, а в воздухе звучит величественный хор Матери Изольды.',
        'Белая соль в стенах начинает таять, обращаясь чистейшей живительной влагой. Соляные изваяния вздрагивают, открывают живые тёплые глаза и делают первые глубокие вдохи. Сорок тысяч соединённых разумов сплетают сияющую сеть — и падающая звезда Эльтар плавно, без разрушения, оседает мирным светозарным островом в заливе.',
        'Рядом с тобой стоит Эйрик. Его тяжёлая броня растаяла, открыв лицо с добрыми морщинами у глаз. Он протягивает тебе спелое румяное яблоко и тепло усмехается: «Мы дома, Кей».',
        '[Сера Никс|smiling] «Волны... Кейлен, я сбилась со счёта. Больше не нужно считать».',
      ],
      choices: [],
    },

    // 31. v_ending_new_sentinel (Самопожертвование — «Вахта Вэнсов»)
    v_ending_new_sentinel: {
      id: 'v_ending_new_sentinel',
      chapterTitle: 'Финал: Вахта Вэнсов',
      location: 'Мост Врат Бездны — Вечный Пост',
      isEnding: true,
      endingType: 'sacrifice',
      endingTitle: 'Вахта Вэнсов (Рыцарский Долг)',
      endingEpilogue:
        'Эпилог: Кейлен встал на мост, приняв доспехи Стража, чтобы старший брат мог уйти на покой. Сера дала клятву вернуться с ответом.',
      localImage: '/images/preset_world_eldoria_1791453485261.webp',
      visualPrompt:
        'melancholic twilight scene on cyclopean bridge, young knight donning the heavy salt guardian armor while older brother leaves into the dawn with tears, sad brave heroine looking back from rowboat',
      actionFocus: 'Кейлен занимает мост вместо брата, принимая вечную вахту над пучиной',
      activeSpeaker: {
        name: 'Кейлен Вэнс',
        emotion: 'neutral',
      },
      narrative: [
        'Ты делаешь шаг к поверженной соляной броне и поднимаешь исполинский палаш Маршала Врат. «Твоя вахта окончена, Эйрик. Три века ты держал оборону один. Теперь моя очередь».',
        'Соляные кристаллы мягко обвивают твои латы, укрепляя металл несокрушимой силой океанических глубин. Эйрик опускается на колени, плача слезами облегчения, а затем медленно уходит к рассветному выходу.',
        'Сера останавливается у края ступеней. Ветер треплет её волосы: «Я вернусь через год, Кейлен. Я найду способ снять проклятие. Считай волны... и жди меня».',
      ],
      choices: [],
    },
  },

  patches: {


    // Патч v_causeway_entrance

    v_causeway_entrance: {
      prependChoices: [
        {
          id: 'c_causeway_shout_oyvin',
          text: 'Постучать рукоятью в бронзовую решётку амбразуры: окликнуть смотрителя ворот',
          targetSceneId: 'v_gate_echo_oyvin',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
        },
      ],
    },

    // Патч v_weeping_cloisters
    v_weeping_cloisters: {
      prependChoices: [
        {
          id: 'c_cloisters_hear_mara',
          text: 'Прислушаться к жалобному скулежу за статуей плачущего святого',
          targetSceneId: 'v_cloister_mara',
          tag: 'RECON',
          approach: 'Investigative',
        },
      ],
    },

    // Патч v_sluice_antechamber: выбор казарм и рынка
    v_sluice_antechamber: {
      prependChoices: [
        {
          id: 'c_sluice_to_barracks',
          text: 'Осмотреть боковую галерею: казармы Ордена Волнолома',
          targetSceneId: 'v_tidewarden_barracks',
          tag: 'RECON',
          approach: 'Investigative',
        },
        {
          id: 'c_sluice_to_market',
          text: 'Спуститься к осушенным шлюзовым рядам: Рынок Памяти',
          targetSceneId: 'v_memory_market',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
        },
      ],
    },

    // Патч v_salt_mine_shaft: привал у синего огня
    v_salt_mine_shaft: {
      appendChoices: [
        {
          id: 'c_shaft_to_camp',
          text: 'Разжечь синий костёр в сухом шурфе: устроить привал с Серой',
          targetSceneId: 'v_camp_salt_fire',
          tag: 'CAUTIOUS',
          approach: 'Shadow',
        },
      ],
    },

    // Патч v_abyssal_observatory: взгляд на застывшую звезду Эльтар
    v_abyssal_observatory: {
      prependChoices: [
        {
          id: 'c_observatory_to_star',
          text: 'Подойти к иллюминатору Пропасти: взглянуть на звезду Эльтар',
          targetSceneId: 'v_observatory_star',
          tag: 'RECON',
          approach: 'Investigative',
        },
      ],
    },

    // Патч v_salt_chapel: разговор с Изольдой
    v_salt_chapel: {
      prependChoices: [
        {
          id: 'c_chapel_to_isolde',
          text: 'Приблизиться к алтарю Хора: заговорить с Матерью Изольдой',
          targetSceneId: 'v_chapel_isolde',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
        },
      ],
    },

    // Патч v_scriptorium_codex: проверка на пропущенную строку
    v_scriptorium_codex: {
      prependChoices: [
        {
          id: 'c_codex_check_omission',
          text: 'Перехватить край пергамента: «Сера, ты пропустила три строки. Что там написано?»',
          targetSceneId: 'v_scriptorium_truth',
          tag: 'RECON',
          approach: 'Investigative',
          skillCheck: {
            attribute: 'perception',
            dc: 13,
            label: 'Заметить сокрытую строку в фолианте',
            passMessage: 'Твой намётанный глаз улавливает пометку на полях: тайна раскрыта!',
            failMessage: 'Сера быстро захлопывает фолиант, отводя глаза (-1)',
            passEffect: {
              flagsSet: ['noticed_sera_omission'],
              notification: 'Ты настоял на проверке и увидел пометку Примы Мелиор!',
            },
            failEffect: {
              relationshipDelta: -1,
              notification: 'Сера увильнула от ответа, а ты упустил момент.',
            },
            failTargetSceneId: 'v_scriptorium_entry',
          },
        },
      ],
    },

    // Патч v_forgotten_crypt: Осколок Присяги
    v_forgotten_crypt: {
      prependChoices: [
        {
          id: 'c_crypt_oath_shard',
          text: 'Не трогать клинок. Преклонить колено и выслушать присягу Командора',
          targetSceneId: 'v_scriptorium_archives',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            sanityDelta: 10,
            flagsSet: ['shard_oath'],
            itemsAdded: [
              {
                id: 'shard-oath',
                name: 'Осколок Присяги',
                category: 'Relic',
                rarity: 'relic',
                quantity: 1,
                description: 'Кристаллизованная рыцарская честь Командора Вальдемара. Второй Осколок Памяти.',
                loreNote: 'Хранит непоколебимый обет защищать спящих до рассвета.',
                effectSummary: 'Необходим для истинного финала «Возвращённая Память».',
                acquiredLocation: 'Забытая Крипта',
                usable: false,
              },
            ],
            notification:
              'Дух Командора благословляет тебя! Вы получили Осколок Присяги («shard-oath», +10 Sanity).',
          },
        },
      ],
    },

    // Патч v_drowned_scriptorium_depths: перенаправление к кануну моста
    v_drowned_scriptorium_depths: {
      prependChoices: [
        {
          id: 'c_depths_to_bridge_eve',
          text: 'Выйти на базальтовый карниз над Пропастью: Канун Моста',
          targetSceneId: 'v_bridge_eve',
          tag: 'RECON',
          approach: 'Investigative',
        },
      ],
    },

    // Патч v_abyssal_chasm: скрытый выбор окликнуть брата
    v_abyssal_chasm: {
      prependChoices: [
        {
          id: 'c_chasm_call_eirik_name',
          text: 'Окликнуть Стража по имени: «Эйрик! Брат мой!»',
          targetSceneId: 'v_sentinel_recall',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          hideIfLocked: true,
          condition: {
            anyFlags: ['knows_eirik_name', 'read_ledger', 'found_barracks'],
          },
        },
      ],
    },
    // Патч v_inner_sanctum_approach: путь через Приму Мелиор
    v_inner_sanctum_approach: {
      replaceChoices: [
        {
          id: 'c_sanctum_to_prima',
          text: 'Вступить в преддверие Тронного Зала: встретить Приму Мелиор',
          targetSceneId: 'v_throne_prima',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
        },
      ],
    },

    // Патч v_astrolabe_dais: истинный финал, эхо короля и вахта
    v_astrolabe_dais: {
      prependChoices: [
        {
          id: 'c_dais_true_return',
          text: 'Возвращённая Память: вложить три Осколка и назвать каждого из сорока тысяч',
          targetSceneId: 'v_ending_return',
          tag: 'ENDING',
          approach: 'Arcane',
          condition: {
            requiredFlags: ['heard_king'],
            hasItemsAll: ['shard-lullaby', 'shard-oath', 'shard-name'],
            minRelationship: 3,
          },
          effect: {
            sanityDelta: 50,
            relationshipDelta: 5,
            flagsSet: ['ending_returned_memory'],
            notification: 'Ты запеваешь имена сорока тысяч павших душ. Соль тает весенним половодьем!',
          },
        },
        {
          id: 'c_dais_vance_watch',
          text: 'Вахта Вэнсов: принять доспехи Стража, чтобы брат мог уйти на покой',
          targetSceneId: 'v_ending_new_sentinel',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          condition: {
            anyFlags: ['eirik_at_peace', 'sentinel_recalled', 'sentinel_redeemed', 'memory_sacrificed'],
          },
          effect: {
            flagsSet: ['ending_vance_watch'],
            notification: 'Ты возлагаешь руку на палаш Маршала. Брат свободен, но ты остаёшься на мосту.',
          },
        },
        {
          id: 'c_dais_consult_king',
          text: 'Прикоснуться к внешнему золотому кольцу: воззвать к эху Короля Ауреана',
          targetSceneId: 'v_king_echo',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
        },
      ],
    },

    // Патч исходов босса: перенаправление к v_sentinel_defeated
    v_sentinel_relic_lantern: {
      replaceChoices: [
        {
          id: 'c_lantern_pass',
          text: 'Поклониться очищенному Стражу: Рубеж преодолён',
          targetSceneId: 'v_sentinel_defeated',
          tag: 'DIALOGUE',
          approach: 'Diplomatic',
          effect: {
            sanityDelta: 25,
            relationshipDelta: 3,
            flagsSet: ['sentinel_redeemed', 'eirik_at_peace'],
            notification: 'Полый Страж искуплен! Вы получили благословение брата (+25 Sanity).',
          },
        },
      ],
    },

    v_sentinel_relic_fork: {
      replaceChoices: [
        {
          id: 'c_fork_pass',
          text: 'Ступить по осколкам поверженного стража: Рубеж преодолён',
          targetSceneId: 'v_sentinel_defeated',
          tag: 'AUDACIOUS',
          approach: 'Audacious',
          effect: {
            flagsSet: ['sentinel_shattered', 'sentinel_killed_combat'],
            notification: 'Полый Страж разбит акустическим резонансом!',
          },
        },
      ],
    },

    v_sentinel_sacrifice: {
      replaceChoices: [
        {
          id: 'c_sacrifice_pass',
          text: 'Шагнуть сквозь врата с опустевшим, но свободным сердцем: Рубеж преодолён',
          targetSceneId: 'v_sentinel_defeated',
          tag: 'SACRIFICE',
          approach: 'Surrender',
          effect: {
            sanityDelta: -30,
            flagsSet: ['memory_sacrificed', 'eirik_at_peace'],
            notification: 'Воспоминание отдано. Путь открыт без крови.',
          },
        },
      ],
    },
  },

  redirects: {},

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
    {
      id: 'v_ending_return',
      title: 'Возвращённая Память (Истинный Финал)',
      description: 'Кейлен возвращает память народу Велена через три Осколка Памяти и слово Короля. Звезда оседает мирным островом, а город возрождается.',
      hint: 'Соберите три Осколка Памяти (Колыбельной, Присяги, Имени), услышьте совет Короля Ауреана и заслужите доверие Серы.',
      endingType: 'victory',
      cgUrl: '/images/preset_world_eldoria_1791455431121.webp',
    },
    {
      id: 'v_ending_new_sentinel',
      title: 'Вахта Вэнсов',
      description: 'Кейлен встаёт на мост, принимая соляные доспехи Полого Стража, чтобы старший брат Эйрик мог наконец уйти на покой.',
      hint: 'Примиритесь с братом на мосту и выберите самопожертвование во имя его освобождения.',
      endingType: 'sacrifice',
      cgUrl: '/images/preset_world_eldoria_1791453485261.webp',
    },
  ],
};

