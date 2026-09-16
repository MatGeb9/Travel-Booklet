// Tout ce qui n'est pas le jour-le-jour : méta du voyage, réservations, préparatifs,
// pages « à la carte » par ville, arbitrages, shopping, budget, et les cartes à montrer.
// Source unique : le PDF « Chine — 11-26 septembre 2026 (v8) ».
export const BUILD = "v1";

export const TRIP = {
  id: "chine-2026-09",          // identifiant stable : range les photos et, plus tard, les carnets
  title: "Chine",
  han: "中国",
  subtitle: "Shanghai · Chongqing · Chengdu · Xi'an",
  dates: "11 – 26 septembre 2026",
  tz: "Asia/Shanghai",
  firstDay: "2026-09-12",      // J1 = atterrissage
  departure: "2026-09-11",     // décollage de Luxembourg
  lastDay: "2026-09-26",
  hero: "Un vol vers l'ouest, deux trains qui remontent, un vol pour refermer la boucle : Chongqing la verticale, les pandas de Chengdu, et l'armée enterrée de Xi'an.",
  kpis: [["15", "jours"], ["14", "nuits"], ["4", "villes"], ["8 000", "soldats enterrés"]],
};

// Pastilles : texte du tag -> [couleur de fond, couleur du texte]
export const TAGS = {
  "RÉSERVÉ": "ok", "CONFIRMÉ": "ok", "INCLUS": "ok",
  "PASSEPORT": "hot", "BLOQUANT": "hot",
  "À RÉSERVER": "act", "RÉSERVER": "act", "CRÉNEAU": "act", "À PRENDRE": "act",
  "LISTE DE MIRINA": "gold", "SUR VOTRE LISTE": "gold", "VOTRE LISTE": "gold",
  "OPTION": "mute", "AU CHOIX": "mute", "DIMANCHE SEULEMENT": "mute", "CE SOIR PLUTÔT QUE DEMAIN": "act",
  "SHOPPING": "buy", "TRAIN": "go", "VOL": "go",
};

export const CITIES = [
  { key: "Shanghai", han: "上海", color: "#E3322D" },
  { key: "Chongqing", han: "重庆", color: "#E8873B" },
  { key: "Chengdu", han: "成都", color: "#2FA37C" },
  { key: "Xi'an", han: "西安", color: "#C9962E" },
  { key: "Retour", han: "回程", color: "#7B8494" },
];

// --- Ce qui est verrouillé (p. 3) ---
export const BOOKED = [
  ["KL1710 Luxembourg → Amsterdam", "11 sept. · 10 h 45", "≈ 1 h de vol"],
  ["KL895 Amsterdam → Shanghai Pudong T1", "11 sept. · 15 h 00", "arrivée 9 h 25 le 12"],
  ["Waiting Century Hotel · Jing'an Railway Station", "12 – 15 sept.", "3 nuits · 114 €"],
  ["Shanghai Disneyland · deux billets adulte 1 jour", "14 sept.", "voucher Trip.com"],
  ["3U8972 Shanghai Pudong T2 → Chongqing Jiangbei T3", "15 sept. · 11 h 05", "arrivée 13 h 50 · 142,76 €"],
  ["SEYA Panoramic Hotel · Jiefangbei, 58e étage", "15 – 18 sept.", "3 nuits · spa inclus"],
  ["The Hidden House · Kuanzhai Alley, Chengdu", "18 – 21 sept.", "3 nuits · cour privée"],
  ["Elegant Hotel Xi'an Bell Tower Yongningmen", "21 – 24 sept.", "3 nuits · intra-muros"],
  ["MU2153 Xi'an Xianyang T5 → Shanghai Hongqiao T2", "24 sept. · 10 h 00", "arrivée 12 h 15 · 122,56 €"],
  ["Grand Hyatt Shanghai · tour Jin Mao, Pudong", "24 – 26 sept.", "2 nuits"],
  ["AF117 Shanghai Pudong → Paris CDG", "26 sept.", "≈ 12 h de vol"],
  ["AF4604 Paris CDG → Luxembourg", "26 sept. · le soir", "≈ 1 h de vol"],
];

// --- À réserver (p. 3 + p. 27). date = échéance, pour l'alerte du jour. ---
export const TODOS = [
  { id: "t-train1", title: "Train Chongqing → Chengdu, 18 sept. matin", date: "2026-09-03", where: "15 j avant · 12306", level: "BLOQUANT",
    detail: "La vente ouvre 15 jours avant, soit le 3 septembre — avant votre décollage. À prendre depuis chez vous sur 12306 ou Trip.com, en seconde classe, sur un départ matinal : 9 h pour Chengdu." },
  { id: "t-train2", title: "Train Chengdu → Xi'an, 21 sept. matin", date: "2026-09-06", where: "15 j avant · 12306", level: "BLOQUANT",
    detail: "Même chose, ouverture le 6 septembre. Départ 8 h 30 pour Xi'an, seconde classe largement suffisante." },
  { id: "t-panda", title: "Base des pandas, 19 sept. · créneau du matin", date: "2026-09-05", where: "14 j avant · Trip.com", level: "À RÉSERVER",
    detail: "C'est un samedi : le quota journalier part vite. Réserver le jour d'ouverture des ventes et viser le tout premier créneau, 7 h 30." },
  { id: "t-terre", title: "Armée de terre cuite, 22 sept.", date: "2026-09-15", where: "7 j avant · 18 h en Europe", level: "À RÉSERVER",
    detail: "La seule réservation qui s'ouvre en cours de route. Minuit heure de Pékin, soit 18 h en Europe le 15 septembre, pendant que vous serez à Chongqing. Mettez une alarme." },
  { id: "t-musee", title: "Musée d'histoire du Shaanxi, 23 sept.", date: "2026-09-22", where: "la veille · gratuit, sur créneau", level: "CRÉNEAU",
    detail: "Entrée gratuite mais créneau à réserver, et les places partent la veille au soir." },
  { id: "t-spa", title: "Spa Tempête à l'hôtel de Chongqing", date: "2026-09-17", where: "2 h avant · +86 23 6330 6800", level: "INCLUS",
    detail: "Compris dans la chambre, pour deux, une seule fois pour tout le séjour. Créneaux 9 h – 11 h et 13 h – minuit. À caler le jeudi 17 au soir, au retour de Wulong : appelez depuis le train vers 19 h." },
  { id: "t-wulong", title: "Excursion Wulong, 17 sept. · train + entrée", date: "2026-09-03", where: "avec les autres trains", level: "À RÉSERVER",
    detail: "Billet de train à prendre en même temps que les deux autres trajets, dès le 3 septembre." },
  { id: "t-diner", title: "Dîner du 25 · Mi-Automne", date: "2026-09-24", where: "en arrivant le 24", level: "À RÉSERVER",
    detail: "Un vendredi de Mi-Automne, rien ne se trouve à la porte : réserver dès le 24 au soir." },
];

// --- Avant de partir (p. 4) ---
export const PREP = [
  { icon: "🛂", title: "Entrée", text: "Exemption de visa de 30 jours pour les passeports français, allemands et luxembourgeois, prolongée jusqu'au 31 décembre 2026. Passeport valide 6 mois, et billet de sortie à présenter — imprimer la confirmation AF117." },
  { icon: "💳", title: "Payer", text: "Installer Alipay et y rattacher une Visa ou Mastercard avant le départ, depuis une connexion européenne. Prévenir la banque : le premier débit « Hangzhou » est souvent bloqué. WeChat Pay en secours. Un peu de liquide pour les échoppes de marché." },
  { icon: "📶", title: "Se connecter", text: "eSIM chinoise achetée à l'avance, et VPN installé et testé avant de partir — il ne se télécharge plus une fois sur place. Google Maps est inutilisable : prendre Amap, et Didi pour les taxis." },
  { icon: "🕗", title: "Décalage", text: "+6 h en septembre. Toute la Chine vit sur le fuseau de Pékin." },
  { icon: "🪪", title: "Le passeport est le billet", text: "Trains, armée de terre cuite, base des pandas, musées, Disneyland : tout fonctionne au nom réel, et c'est le passeport qu'on scanne au portique. Le laisser à l'hôtel, c'est rester dehors." },
  { icon: "🚄", title: "Les trains", text: "Application 12306 en anglais (inscription au passeport) ou Trip.com, même tarif. Vente ouverte 15 jours avant le départ, à 6 h heure de Pékin. Seconde classe largement suffisante." },
  { icon: "🌦️", title: "Météo", text: "Shanghai 28/21 °C, humide, fin de saison des typhons. Bassin du Sichuan 26/20 °C, couvert et moite. Xi'an 26/15 °C, plus sec. Un imperméable léger, pas de parapluie." },
  { icon: "🧳", title: "Bagage retour", text: "Si vous achetez un drone ou une veste, gardez de la place : franchise KLM et Air France à 23 kg, et les batteries lithium voyagent en cabine, jamais en soute." },
];

// --- Pages « à la carte » par ville (p. 20-23) ---
export const GUIDES = [
  {
    city: "Shanghai", title: "La liste de Mirina, côté Shanghai",
    intro: "Les adresses de Mirina, rangées par usage, avec le jour où chacune est posée. Une règle avant tout : copiez les caractères chinois dans Amap — c'est le seul moyen de faire comprendre une adresse à un chauffeur.",
    sections: [
      { h: "La table", items: [
        ["大壶春 · Da Hu Chun", "136 rue du Sichuan Centre, Huangpu. Maison de shengjianbao de 1932, Bib Gourmand : fond croustillant, farce dense, pas de bouillon qui gicle. 8 h – 21 h, self-service. Dimanche 13, au déjeuner."],
        ["味香斋 · Wei Xiang Zhai", "14 rue Yandang, Huangpu. Quatre-vingts ans au même endroit, quatre plats à la carte, et les nouilles à la pâte de sésame qui font sa réputation. Vendredi 25, au déjeuner."],
        ["定兴路蛋饼 · Ding Xing Lu Dan Bing", "6 rue Dingxing, Huangpu. Le petit-déjeuner shanghaïen : une crêpe à l'œuf pliée sur le trottoir. Avant 9 h, sinon il n'y a plus de pâte."],
        ["莱莱小笼包 · Lai Lai Xiao Long", "Les xiaolongbao, plusieurs adresses en ville. C'est la spécialité de Shanghai, pas une spécialité chinoise générique — la peau doit être fine et le bouillon brûlant."],
        ["光明邨 · Guang Ming Cun", "Huaihai Centre, ancienne concession française. L'institution du quartier et sa file permanente devant le comptoir des plats à emporter."],
        ["Xiesanbao et Zhuangshi Longxing", "Les deux préférées de l'auteure de la liste, et les deux que je n'ai pas pu localiser. À chercher sur Amap sur place, comme le dit la vidéo."],
      ]},
      { h: "Les temples", items: [
        ["龙华寺 · Longhua", "Le plus ancien et le plus grand de Shanghai, fondé en 242. Vendredi 25 au matin, un jour de fête : encens, offrandes, familles."],
        ["玉佛禅寺 · Bouddha de jade", "Putuo. Deux bouddhas de jade rapportés de Birmanie à la fin du XIXe siècle. Jeudi 24 après-midi."],
        ["静安寺 · Jing'an", "1 700 ans d'histoire, des toits d'or incongrus au milieu des tours — et à cinq minutes de votre premier hôtel. Spectaculaire de nuit."],
        ["城隍庙 · Chenghuang", "Le temple du dieu de la ville, à Yuyuan, avec le pont aux neuf coudes : ses angles droits empêcheraient les mauvais esprits de suivre. Dimanche 13 au matin."],
      ]},
      { h: "Les vues", items: [
        ["Condé Bar · Regent on the Bund", "60 Huangpu Road, Hongkou, à l'extrémité nord du Bund. Terrasse plein cadre sur Pudong : on s'assoit de jour et on voit les tours s'allumer. Réserver. Samedi 12 au soir."],
        ["天安千树 · Tianan Quanshu", "Le « jardin suspendu de Babylone » de Heatherwick : mille arbres plantés au sommet de colonnes de béton, au bord de la Suzhou Creek. Jeudi 24, fin d'après-midi."],
        ["The Louis · le paquebot LV", "789 Nanjing West Road, HKRI Taikoo Hui. Trente mètres de haut, coque monogramme, trois niveaux d'exposition et un café. Gratuit, mais créneau d'une heure à réserver sur le mini-programme WeChat « My LV ». Vendredi 25 après-midi."],
        ["豫园 · les lanternes de la Mi-Automne", "Installations lumineuses le long du pont aux neuf coudes, lunes géantes, défilé de la déesse de la Lune. Elle tourne des semaines — allez-y le 24, pas le 25."],
        ["Le Bund, de nuit", "Les concessions d'un côté, Pudong de l'autre. Le premier soir et le dernier : la même vue, jamais la même."],
      ]},
    ],
    table: null,
  },
  {
    city: "Chongqing", title: "Tarifs, horaires et adresses",
    intro: "Chongqing est la ville où Mirina a envoyé le plus d'adresses, et celle où vous avez le moins de temps. Ce qui est placé tient ici ; ce qui s'exclut est dans « Les choix à faire ».",
    table: { head: ["Site", "Entrée", "Horaires · quand"], rows: [
      ["Hongyadong · 洪崖洞", "Gratuit", "9 h – 23 h · lumières 19 h 30 · mardi"],
      ["Shibati · 十八梯 et Deyi World · 得意世界", "Gratuit", "ouverts tard · mardi après dîner"],
      ["L'Œil des Nuages · 云端之眼", "68 CNY − 22 %", "1 h avant le couchant · mardi"],
      ["Liziba · 李子坝", "Gratuit", "6 h 30 – 22 h 30 · mercredi tôt"],
      ["Temple Luohan · 罗汉寺", "≈ 10 CNY", "mercredi matin"],
      ["Ciqikou et le temple Baolun · 宝轮寺", "Gratuit", "mercredi après-midi"],
      ["Téléphérique du Yangtsé", "≈ 4 € / 7 €", "8 h – 22 h · mercredi au couchant"],
      ["Xiahaoli · 下浩里", "Gratuit", "boutiques 10 h – 21 h · mercredi"],
      ["Wulong · 武隆", "≈ 20 €", "9 h – 16 h · jeudi"],
      ["Dazu · 大足石刻 · l'alternative", "≈ 15 €", "8 h 30 – 18 h"],
      ["Chiyou Jiuli City · 蚩尤九黎城 · Pengshui", "20 CNY", "illuminations 19 h 30"],
      ["Laojundong · 老君洞 · Nanshan", "Gratuit", "non placé"],
      ["People's Auditorium · 人民大礼堂", "≈ 10 CNY", "non placé"],
      ["Temple Hong'en · 鸿恩寺 · 打铁花 le soir", "Gratuit", "6 h 30 – 21 h 30 · non placé"],
    ]},
    sections: [
      { h: "Manger — tout est dans Yuzhong, à pied de l'hôtel", items: [
        ["井到吃老火锅 · le hot pot de quartier", "Rue Linjiang, ruelle Dajing. Le hot pot que les locaux citent en premier : suif de bœuf, poivre du Sichuan, marmite yuanyang si vous voulez survivre. Mardi 15 au dîner."],
        ["面壁糖水 · Mian Bi Sweet Water", "大井巷12号, deux portes plus loin. Desserts glacés — l'extincteur d'après hot pot. Mardi 15, dans la foulée."],
        ["鬼包子 · Gui Baozi", "八一路238号, place Bayi, niveau 1. Baozi vapeur à 2 €, baozi frits et lait de soja à 3 €. File longue, file rapide. Mercredi 16 à 7 h 45."],
        ["花市豌杂面 · Hua Shi Pea Noodles", "民生路85号. Nouilles aux pois cassés et wontons. Rapide, léger, local. Mercredi 16 au déjeuner."],
        ["2048香龙虾 · dry pot aux crevettes", "和平路245号, Qixinggang. Le dry pot : même piment que le hot pot, sans le bouillon. L'alternative si vous avez déjà eu votre dose de marmite."],
        ["八一好吃街 · la rue Bayi", "Le couloir de néons en bas de votre tour. Brochettes, tofu, poulet bobo. On grignote debout, on n'y dîne pas. Mardi 15 en fin d'après-midi."],
      ]},
    ],
  },
  {
    city: "Chengdu", title: "La ville où l'on a le droit de ne rien faire",
    intro: "La seule étape où vos listes parlent autant de centres commerciaux futuristes que de pandas — et elles ont raison, c'est une ville double.",
    table: { head: ["Site", "Entrée", "Horaires · quand"], rows: [
      ["Base des pandas · 大熊猫基地", "55 CNY", "créneau 7 h 30 · samedi 19"],
      ["Shufengyayun · opéra du Sichuan", "148 CNY", "10 h – 22 h · vendredi 18"],
      ["Chunxi Road, Taikoo Li, IFS puis SKP-S et parc Jiaozi", "Gratuit", "samedi 19, après-midi et soir"],
      ["Songxianqiao · 送仙桥", "Gratuit", "dimanche 20 au matin"],
      ["Eastern Suburb Memory · 东郊记忆", "Gratuit", "dimanche 20 après-midi"],
      ["Shu Yan Fu · 蜀宴赋 · dans 东郊记忆", "À réserver", "service 18 h 30 · 98 min"],
      ["Leshan · 乐山大佛 · alternative", "≈ 80 CNY", "1 h de TGV · journée"],
      ["Dujiangyan · 都江堰 · alternative", "80 CNY", "8 h – 22 h · 1 h de train"],
      ["Mont Qingcheng · 青城山 et Zhongshuge", "80 CNY", "8 h – 17 h 30"],
      ["Luodai · 洛带古镇 · bourg hakka", "Gratuit", "demi-journée · non placé"],
      ["Musée du Sichuan · bronzes de Sanxingdui", "Gratuit", "non placé"],
    ]},
    sections: [
      { h: "Le Chengdu moderne", items: [
        ["IFS et son panda", "Un panda géant escalade la façade de l'IFS, les fesses dans le vide au-dessus de la rue. C'est la photo de Chengdu — et Taikoo Li et Chunxi Road sont juste à côté."],
        ["SKP et SKP-S", "Le centre commercial le plus futuriste du voyage : une installation de bambous lumineux dehors, des pandas sculptés à l'entrée du SKP-S. Ça se visite comme un musée, pas comme une galerie marchande."],
        ["Le parc Jiaozi la nuit", "Des passerelles courbes qui s'allument en bleu au-dessus de l'eau. À enchaîner avec SKP, c'est juste à côté."],
        ["东郊记忆", "Une usine des années 1950 devenue friche créative : briques, cheminées, galeries, concerts. Le contraire de Kuanzhai — et Shu Yan Fu est dedans."],
      ]},
      { h: "Le dîner en empereur", items: [
        ["蜀宴赋 · Shu Yan Fu", "Un banquet immersif de 98 minutes sous projections à 360°, avec danses et comédiens : Han Wudi, Li Bai, Yang Guifei viennent parler aux convives. Deux services, 12 h 30 et 18 h 30."],
        ["Le costume est fourni", "Hanfu, coiffure et maquillage fournis par une équipe sur place. C'est la réponse à votre envie de tenue traditionnelle — mieux que le banquet de Chongqing, et dans un meilleur décor."],
        ["Réserver tôt", "Classé troisième restaurant de Chengdu sur Tripadvisor — rare pour un dîner-spectacle. Les deux services partent vite le week-end."],
        ["Deux costumes, pas un doublon", "Shu Yan Fu le dimanche 20, le hanfu de Xi'an le mercredi 23. L'un est un spectacle, l'autre une journée entière en ville."],
      ]},
    ],
  },
  {
    city: "Xi'an", title: "Ce qui se mange et ce qui s'achète",
    intro: "Xi'an est la ville où vos listes parlent surtout de nourriture — et à raison. Une distinction utile avant tout : le quartier musulman est halal, donc agneau et bœuf seulement. Les grands plats au porc de Xi'an se mangent ailleurs, en ville.",
    table: null,
    sections: [
      { h: "La table", items: [
        ["羊肉泡馍 · le pain trempé", "Le plat de Xi'an. On vous apporte un pain sec et un bol vide : c'est vous qui émiettez le pain, puis la cuisine verse le bouillon d'agneau. Vingt minutes de travail avant de manger, et c'est exactement le but. Mercredi 23, au déjeuner."],
        ["水盆羊肉 · l'autre version", "Même agneau, mais en gros morceaux dans un bouillon clair, servi avec le mo à part. On fourre la viande et le piment dans le pain, puis on alterne une bouchée, une gorgée."],
        ["肉夹馍 · le combo local", "Le sandwich de Xi'an. Version classique au porc effiloché, version 肘子 au jarret braisé, version 粉蒸 au porc cuit à la vapeur de riz. Le trio complet, c'est roujiamo + liangpi (nouilles froides) + une bouteille d'Ice Peak, la limonade orange locale."],
        ["裤带面 · les nouilles-ceintures", "Les fameuses biangbiang, larges comme une ceinture, tirées à la main et noyées sous le piment. Le caractère qui les nomme compte cinquante-six traits."],
        ["辣肉花卷 · le roulé au porc pimenté", "Une brioche torsadée fourrée de porc et de piment, tranchée sur la plaque. Vendue à la rue."],
        ["Les brochettes", "Xi'an est une ville d'agneau et de bœuf grillés, et ses brochettes n'ont besoin d'aucun assaisonnement compliqué. Le soir, partout."],
        ["Le banquet de raviolis", "Dix-huit formes de jiaozi servies à la suite, chacune avec sa farce. Une institution de la ville. Mardi 22 au soir, après l'armée de terre cuite."],
      ]},
      { h: "Acheter", items: [
        ["书院门 · Shuyuanmen", "La rue des lettrés, en bas des remparts côté sud. Pinceaux, encre, papier de riz, et le sceau gravé à votre nom pendant que vous attendez. Les vrais souvenirs sont ici, pas dans le quartier musulman. Lundi 21, 17 h 30."],
        ["大唐不夜城 · Grand Tang Mall", "L'avenue Tang illuminée : boutiques, spectacles de rue, lanternes. C'est autant un décor qu'un lieu d'achat. Mercredi 23 au soir."],
        ["大悦城 · Joy City et 万象城 · MixC", "Les deux centres commerciaux modernes, près de la pagode. Pop Mart, bubble tea, marques chinoises. Joy City pour la halte, MixC pour le haut de gamme."],
        ["Qujiang Creative Circle", "Le quartier néon de Qujiang, à prolonger après Datang si la soirée est encore jeune."],
      ]},
      { h: "Et un rendez-vous manqué", items: [
        ["古观音禅寺 · le ginkgo millénaire", "L'arbre de 1 400 ans que la légende attribue à l'empereur Taizong, au pied du mont Zhongnan, à trente kilomètres au sud de Xi'an — environ une heure de route. Pendant trois semaines chaque automne, il devient une colonne d'or et sa chute tapisse la cour d'un tapis jaune. Mais la saison court de fin octobre à novembre, avec un pic dans la première quinzaine de novembre. En septembre, c'est un grand arbre vert. Gardez-le pour un voyage d'automne — il le mérite."],
      ]},
    ],
  },
];

// --- Les choix à faire (p. 24) ---
export const CHOICES = [
  { n: 1, title: "Mercredi après-midi : Ciqikou ou The Ring",
    opts: [["Ciqikou", "Le vieux bourg de porcelaine à 25 min de métro, avec le temple Baolun caché dans ses ruelles. Bondé et reconstruit, mais c'est le seul quartier ancien que vous verrez de jour."],
           ["The Ring · 光环购物公园", "Sept étages et 42 m de forêt intérieure, cascade de vingt mètres. À Chongguang, ligne 5, trente-cinq minutes, plus une réservation WeChat pour entrer."]],
    verdict: "Ciqikou. Le temple Baolun est inclus, la logistique du soir tient, et The Ring vous ferait traverser la ville dans le mauvais sens juste avant le téléphérique." },
  { n: 2, title: "Mercredi soir : la colline ou le palais",
    opts: [["Zhang San / Ding Lao Tou", "Le barbecue à flanc de colline. On monte à pied, on arrive essoufflé, et la skyline entière est en face. Lanternes dans les arbres, musique live."],
           ["Li Yan Ba Guo", "Le banquet immersif style palais : spectacle, une trentaine de plats, et costumes, coiffure et maquillage à louer sur place."]],
    verdict: "Le barbecue. Cette vue-là n'existe qu'à Chongqing, alors que le costume, vous l'aurez à Xi'an le mercredi 23 — en vrai hanfu et devant un meilleur décor." },
  { n: 3, title: "Jeudi : Wulong, Dazu, ou les deux bouts de la même ligne",
    opts: [["Wulong", "Les trois arches calcaires et la gorge de Longshuixia. 20 €, 9 h – 16 h, 1 h 30 de train. Journée pleine, et votre seule vraie journée de nature du séjour."],
           ["Dazu", "50 000 sculptures rupestres du IXe au XIIIe siècle, un Bouddha couché de 31 m. 15 €, 8 h 30 – 18 h, 1 h de train. Demi-journée, dix fois moins de monde — et une après-midi libre à la clé."]],
    verdict: "Wulong, sauf si vous voulez récupérer une demi-journée. Dazu libère l'après-midi et absorbe alors le People's Auditorium et Laojundong, qui n'entrent nulle part ailleurs." },
  { n: 4, title: "La troisième voie du jeudi : Wulong puis Pengshui",
    opts: [["Chiyou Jiuli City · 蚩尤九黎城", "La cité miao de Pengshui : un palais de 99 m à onze portes, des piliers-totems de 24 m, et des illuminations vers 19 h 30 que les Chinois comparent à Hongyadong. Entrée 20 CNY."],
           ["La logistique", "Pengshui est sur la même ligne ferroviaire que Wulong, une demi-heure plus loin. Wulong jusqu'à 15 h 30, train jusqu'à Pengshui Ouest, spectacle de lumière à 19 h 30, dernier train à 21 h 39, retour à Chongqing vers 23 h. Didi fonctionne à Pengshui — réservez la course de retour à l'avance, tout le monde sort en même temps."]],
    verdict: "Faisable, mais c'est une journée de brute et il faut déplacer le spa au mardi ou au mercredi soir. À ne tenter que si la météo annonce clair : par temps couvert, ni le canyon ni les illuminations ne rendent." },
  { n: 5, title: "Ce qui ne rentre pas, et ce que je retirerais",
    opts: [["Sans slot", "Laojundong (老君洞), temple taoïste de 1 300 ans au-dessus de la ville, rive sud, demi-journée. Temple Hong'en et son 打铁花 — une soirée, rive nord. People's Auditorium, trente minutes mais à l'autre bout de Yuzhong."],
           ["À retirer franchement", "Nanshan One Tree (南山一棵树). C'est un belvédère de la rive sud, et vous en avez déjà deux — l'Œil des Nuages à 520 m et la colline du barbecue."]],
    verdict: "Le compte qui vous a recommandé Nanshan One Tree lui met deux étoiles et quatre à Dazu. C'est aussi mon classement." },
  { n: 6, title: "Les deux autres choix, hors Chongqing",
    opts: [["Dimanche 20, à Chengdu", "Leshan (train, bus, escaliers, foule du dimanche) ou le marché de Songxianqiao à vingt minutes du centre. Vu votre liste de courses, Songxianqiao."],
           ["Mercredi 23, à Xi'an", "Le musée du Shaanxi et le hanfu, ou le mont Hua. Le mont Hua prend la journée entière — et il vous coûterait le costume."]],
    verdict: "Et un qui ne se choisit pas : le ginkgo millénaire du temple Guanyin n'est doré que de fin octobre à novembre." },
];

// --- Shopping (p. 25) ---
export const SHOPPING = [
  { title: "La veste « style empereur »", text: "Mauvaise nouvelle d'abord : les capsules Nouvel An de Nike et Adidas sortent en décembre-janvier, en séries limitées, et ont disparu des rayons dès février. Le magasin Adidas de Nanjing Road garde le plus longtemps l'assortiment complet — à tenter, sans y croire.\n\nBonne nouvelle ensuite : ce que vous décrivez existe toute l'année chez les marques chinoises. 李宁 · China Li-Ning fait exactement ça — broderies de dragon, rouge et or, coupes impériales — et Anta suit. Leurs magasins amiraux sont sur Nanjing East Road.\n\nEt si vous voulez la vraie chose plutôt qu'une veste de sport : c'est un tangzhuang ou un magua, veste de brocart à brandebourgs. Xi'an, autour de la pagode de l'Oie sauvage, en vend des centaines — mercredi 23." },
  { title: "La tenue traditionnelle", text: "Xi'an, sans hésiter. Le hanfu y est une industrie : location, vente, coiffure, maquillage, photographe. Datang Buyecheng le soir est le décor fait pour. Shanghai en vend aussi, plus cher et moins bien." },
  { title: "Les marchés aux puces", text: "Cangbao Lou, 457 Fangbang Zhong Lu, Shanghai — dimanche 13 au petit matin, tout se joue avant 9 h. Dongtai Road, cité par tous les vieux guides, a été démoli.\n\nSongxianqiao, Chengdu — le plus grand de l'ouest chinois, dimanche 20. Sept pièces sur dix sont des reproductions : négociez au tiers." },
  { title: "La seconde main de luxe", text: "Shanghai est la capitale asiatique du vintage de marque. Golikooo Vintage pour le Chanel et des murs entiers de bagues et de broches ; Aloooooha Vintage pour le Fendi, le Dior et les pièces uniques. La sélection n'a pas d'équivalent en Europe.\n\nPour le prêt-à-porter : Looknow Park, multimarque de créateurs chinois, et Basement FG, l'équivalent local de Brandy Melville en moins cher." },
  { title: "Les baguettes", text: "Évitez les étals à touristes. Les belles paires sont en bois précieux ou en laque, par coffret de cinq ou dix. Les boutiques de musée (Shanghai, Shaanxi) en vendent d'excellentes, sans marchandage. Ne plantez jamais les baguettes dans le riz : c'est le geste des offrandes aux morts." },
  { title: "Les cigarettes", text: "中华 · Zhonghua est la marque de prestige, celle qu'on offre. Elle se vend dans les bureaux du monopole d'État (中国烟草), pas dans les supérettes. Comptez 60 à 100 CNY le paquet.\n\nAttention au retour : 200 cigarettes par personne en franchise à l'entrée de l'UE, et l'ensemble de vos achats ne doit pas dépasser 430 € par personne par voie aérienne. Au-delà, il faut déclarer." },
  { title: "La décoration", text: "Un sceau gravé à votre nom — pierre, une demi-heure d'attente, le graveur transcrit phonétiquement : Shuyuanmen, Xi'an, lundi 21. Le souvenir le plus personnel du voyage.\n\nEnsuite : théières d'Yixing et calligraphie à Songxianqiao, papiers découpés à Yuyuan, affiches de propagande à Cangbao Lou." },
  { title: "La DJI Osmo Action 6", text: "2 998 CNY à son lancement chinois, soit environ 366 €, contre 379 € de prix conseillé en Europe pour le combo standard. L'écart est de quelques euros et il disparaît dès qu'il y a une promotion en France.\n\nAchetez-la pour l'essayer et repartir avec, pas pour économiser. Garantie chinoise, pas de rétractation européenne : demandez en boutique si l'appareil du marché chinois fonctionne avec l'application DJI Mimo internationale. Batteries en cabine." },
  { title: "Le thé", text: "Chengdu, en boutique : demandez à goûter, c'est l'usage." },
  { title: "La règle du marchandage", text: "Sur un marché, le premier prix annoncé à un étranger est trois à cinq fois le prix réel. Contre-proposez au tiers, souriez, laissez un silence, et soyez prêt à partir. En boutique fixe et dans les magasins de marque, on ne négocie pas." },
];

// --- Budget (p. 26) ---
export const BUDGET = {
  rows: [
    ["Vols internationaux · déjà payés", "—", "950 €"],
    ["3U8972 Shanghai → Chongqing · payé", "—", "142,76 €"],
    ["MU2153 Xi'an → Shanghai · payé", "—", "122,56 €"],
    ["Hôtel Shanghai, 3 nuits · payé", "—", "114,00 €"],
    ["Hôtels Chongqing, Chengdu, Xi'an, Grand Hyatt · payés", "—", "à reporter"],
    ["Disneyland Shanghai, deux billets · payés", "—", "à reporter"],
    ["Train Chongqing → Chengdu, 2e classe", "85 – 155", "10 – 19 €"],
    ["Train Chengdu → Xi'an, 2e classe", "221 – 335", "27 – 41 €"],
    ["Excursion Wulong · train + entrées", "400 – 600", "49 – 73 €"],
    ["Entrées · terre cuite 120, pandas 55, Œil des Nuages 53, Shanghai Tower 180…", "750 – 950", "91 – 116 €"],
    ["Repas, 15 jours", "3 300 – 4 900", "400 – 600 €"],
    ["Métro, Didi, navettes aéroport", "800 – 1 100", "98 – 134 €"],
    ["eSIM et VPN", "—", "25 – 40 €"],
    ["DJI Osmo Action 6 · si vous la prenez là-bas", "2 998", "≈ 366 €"],
  ],
  total: ["Reste à dépenser sur place", "700 – 1 050 €"],
  foot: "Conversion indicative sur la base d'environ 8,2 CNY pour 1 €, à revérifier avant de partir. La caméra à elle seule consomme presque toute la franchise douanière de 430 € par personne : gardez la facture et déclarez si vous dépassez.",
  notes: [
    ["Plus rien d'ouvert côté hôtels", "Les cinq hébergements sont payés, Chongqing compris. Ne restent que les deux billets de train — moins de 60 € à deux pour les deux trajets — et le budget d'achats, qui est le seul vrai inconnu."],
    ["Ce qui ne coûte presque rien", "Les repas : entre 30 et 120 CNY par personne, hot pot compris. Et le spa de Chongqing, l'Œil des Nuages à 22 % de remise et le salon VIP du vol vers Chongqing sont déjà compris dans ce que vous avez payé — pensez à les utiliser."],
  ],
};

// --- Cartes à montrer : le cœur de l'app sur place. ---
// han = ce qu'on montre en grand, fr = ce que ça veut dire, sub = adresse / précision.
export const PHRASES = [
  { group: "Dire l'essentiel", items: [
    { han: "你好", fr: "Bonjour", sub: "Nǐ hǎo" },
    { han: "谢谢", fr: "Merci", sub: "Xièxie" },
    { han: "多少钱？", fr: "Combien ça coûte ?", sub: "Duōshao qián" },
    { han: "太贵了", fr: "C'est trop cher", sub: "Tài guì le · et on contre-propose au tiers" },
    { han: "买单", fr: "L'addition, s'il vous plaît", sub: "Mǎidān" },
    { han: "洗手间在哪里？", fr: "Où sont les toilettes ?", sub: "Xǐshǒujiān zài nǎlǐ" },
    { han: "请带我去这里", fr: "Emmenez-moi ici, s'il vous plaît", sub: "Qǐng dài wǒ qù zhèlǐ · à montrer avec une adresse" },
  ]},
  { group: "À table", items: [
    { han: "不要辣", fr: "Pas de piment, merci", sub: "Bù yào là" },
    { han: "微辣", fr: "Un peu épicé seulement", sub: "Wēi là · si vous voulez survivre au hot pot" },
    { han: "鸳鸯锅", fr: "La marmite séparée, moitié épicée", sub: "Yuānyāng guō" },
  ]},
  { group: "Chongqing · les adresses", items: [
    { han: "井到吃老火锅", fr: "Le hot pot de quartier", sub: "Rue Linjiang, ruelle Dajing · mardi 15 au dîner" },
    { han: "面壁糖水", fr: "Les desserts glacés d'après hot pot", sub: "大井巷12号 · deux portes plus loin" },
    { han: "鬼包子", fr: "Gui Baozi, le petit-déjeuner", sub: "八一路238号, place Bayi · mercredi 16 à 7 h 45" },
    { han: "花市豌杂面", fr: "Hua Shi, nouilles aux pois cassés", sub: "民生路85号 · mercredi 16 au déjeuner" },
    { han: "2048香龙虾", fr: "Dry pot aux crevettes", sub: "和平路245号, Qixinggang" },
    { han: "张三的烤肉", fr: "Zhang San BBQ, le barbecue de la colline", sub: "Mercredi 16 à 19 h 30 · un Didi ne trouvera pas en latin" },
    { han: "丁老头烤肉", fr: "Ding Lao Tou, le jumeau du précédent", sub: "Même carte, autre colline" },
    { han: "洪崖洞", fr: "Hongyadong", sub: "Lumières 19 h 30 · le point de vue est en face" },
    { han: "云端之眼", fr: "L'Œil des Nuages", sub: "201 Xinhua Road, 67e étage · 68 CNY − 22 %" },
    { han: "十八梯", fr: "Shibati, les escaliers du vieux Chongqing", sub: "Gratuit, ouvert tard" },
    { han: "得意世界", fr: "Deyi World, le canyon de néons", sub: "Jiaochangkou" },
    { han: "李子坝", fr: "Liziba, le métro qui traverse l'immeuble", sub: "6 h 30 – 22 h 30 · avant 9 h" },
    { han: "罗汉寺", fr: "Temple Luohan, les 500 arhats", sub: "≈ 10 CNY · mercredi matin" },
    { han: "宝轮寺", fr: "Temple Baolun, caché dans Ciqikou", sub: "Gratuit, il est dedans" },
    { han: "下浩里", fr: "Xiahaoli, rive sud", sub: "Au bout du téléphérique · jusqu'à 21 h" },
    { han: "八一好吃街", fr: "La rue à manger de Bayi", sub: "En bas de votre tour" },
    { han: "武隆", fr: "Wulong, les trois ponts naturels", sub: "1 h 30 de train · jeudi 17" },
    { han: "大足石刻", fr: "Dazu, les sculptures rupestres", sub: "L'alternative à Wulong · 1 h de train" },
  ]},
  { group: "Chengdu · les adresses", items: [
    { han: "大熊猫基地", fr: "Base des pandas", sub: "55 CNY · créneau 7 h 30 · porte Sud" },
    { han: "送仙桥古玩市场", fr: "Marché d'antiquités de Songxianqiao", sub: "Dimanche 20 au matin · négociez au tiers" },
    { han: "东郊记忆", fr: "Eastern Suburb Memory", sub: "Dimanche 20 après-midi · Shu Yan Fu est dedans" },
    { han: "蜀宴赋", fr: "Shu Yan Fu, le dîner en empereur", sub: "Service 18 h 30 · 98 min · à réserver" },
    { han: "隐栖堂", fr: "The Hidden House, votre hôtel", sub: "Kuanzhai Alley · métro People's Park" },
    { han: "春熙路", fr: "Chunxi Road, la rue piétonne", sub: "Taikoo Li et l'IFS sont juste à côté" },
    { han: "洛带古镇", fr: "Luodai, le bourg hakka", sub: "Gratuit · demi-journée" },
  ]},
  { group: "Xi'an · les adresses", items: [
    { han: "兵马俑", fr: "Armée de terre cuite", sub: "120 CNY · le passeport est le billet" },
    { han: "书院门", fr: "Shuyuanmen, la rue des lettrés", sub: "Sceau gravé à votre nom · lundi 21" },
    { han: "大唐不夜城", fr: "Datang Buyecheng, la cité Tang", sub: "Mercredi 23 au soir" },
    { han: "大慈恩寺", fr: "Da Ci'en et la grande pagode", sub: "Mercredi 23 à midi" },
    { han: "大悦城", fr: "Joy City Mall", sub: "À deux pas de la pagode" },
    { han: "羊肉泡馍", fr: "Le pain trempé dans le bouillon d'agneau", sub: "Le plat de Xi'an · mercredi 23" },
    { han: "肉夹馍", fr: "Roujiamo, le sandwich de Xi'an", sub: "Avec liangpi et un Ice Peak" },
    { han: "裤带面", fr: "Les nouilles larges comme des ceintures", sub: "Biangbiang · Huimin Jie" },
    { han: "古观音禅寺", fr: "Le temple au ginkgo millénaire", sub: "Doré seulement fin octobre – novembre" },
  ]},
  { group: "Shanghai · les adresses", items: [
    { han: "大壶春", fr: "Da Hu Chun, shengjianbao de 1932", sub: "136 rue du Sichuan Centre · dimanche 13" },
    { han: "味香斋", fr: "Wei Xiang Zhai, nouilles au sésame", sub: "14 rue Yandang, Huangpu · vendredi 25" },
    { han: "定兴路蛋饼", fr: "La crêpe à l'œuf du matin", sub: "6 rue Dingxing · avant 9 h" },
    { han: "光明邨", fr: "Guang Ming Cun", sub: "Huaihai Centre, ancienne concession française" },
    { han: "龙华寺", fr: "Temple Longhua, fondé en 242", sub: "Vendredi 25 au matin" },
    { han: "玉佛禅寺", fr: "Temple du Bouddha de jade", sub: "Putuo · jeudi 24 après-midi" },
    { han: "静安寺", fr: "Temple Jing'an", sub: "À cinq minutes du premier hôtel" },
    { han: "城隍庙", fr: "Temple Chenghuang, à Yuyuan", sub: "Dimanche 13 au matin" },
    { han: "豫园", fr: "Yuyuan et les lanternes de la Mi-Automne", sub: "Y aller le 24, pas le 25" },
    { han: "天安千树", fr: "Tianan Quanshu, le jardin suspendu", sub: "Suzhou Creek · jeudi 24" },
    { han: "中华", fr: "Zhonghua, les cigarettes de prestige", sub: "Au monopole d'État 中国烟草, 60 – 100 CNY" },
  ]},
];
