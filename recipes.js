/**
 * 料理靈感工具 - 食譜資料
 *
 * PANTRY_STAPLES：家裡通常都有、不需要使用者輸入的常備調味料／辛香料。
 * 這些項目不會出現在每道菜的 ingredients 陣列中（但可能出現在 steps 文字裡）。
 *
 * 每道食譜的 ingredients 是主要食材陣列，每項為 { name, amount, unit }：
 *   - amount / unit 是「baseServings 人份」的份量，畫面上會依使用者選的人數等比例換算。
 *   - 常備調味料（鹽、糖、醬油、蒜、薑、蔥少許等）不列入 ingredients，只會出現在 steps 文字裡。
 *   - ingredients[].name 一律用 ingredients.js 目錄裡的正規名稱。
 *
 * 定位標記（給「下班十分鐘開飯」排序與篩選用，定義見 EXPANSION-PLAN.md）：
 *   - time  ：實際動手分鐘數，等待不計（電鍋按下去、烤箱烤、醃、燉、冷藏都不算）。≤10 進首頁清單。
 *   - bento ：隔天便當 OK —— 冷了不難吃、重複加熱不出水不變硬、沒有生食。
 *             葉菜快炒（空心菜、地瓜葉、菠菜、青江菜）重熱會黑會出水 → false；湯品 → false；生菜涼拌、溏心蛋 → false。
 *   - tags  ：健康（有蔬菜或菇＋油 ≤1 大匙／2 人份＋不用咖哩塊等現成醬料包，三條都要）、高蛋白、多纖維、一鍋
 *   - tool  ：（選填）電鍋、氣炸鍋、烤箱、免開火 —— 器具是篩選條件，method 仍是動作
 *   - prep  ：（選填）"weekend" ＝ 週末備料型，一次做一鍋分裝 3 天便當；bento 必為 true
 */

const PANTRY_STAPLES = [
  "鹽", "糖", "醬油", "食用油", "香油", "白胡椒粉", "黑胡椒粉",
  "米酒", "太白粉", "蒜", "薑", "蔥", "辣椒", "白醋", "烏醋"
];

const RECIPES = [
  // ── 雞蛋 ──────────────────────────────
  {
    id: "egg-tomato",
    name: "番茄炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "番茄", amount: 2, unit: "顆" },
      { name: "雞蛋", amount: 3, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "番茄切滾刀塊，雞蛋打散加一點鹽",
      "熱油鍋，蛋液下鍋炒至半凝固盛起",
      "鍋中留油，放入番茄塊炒軟出汁",
      "加少許糖、鹽調味，燜煮 1 分鐘",
      "倒入炒蛋拌勻即可"
    ]
  },
  {
    id: "egg-scallion",
    name: "蔥花蛋",
    baseServings: 2,
    ingredients: [
      { name: "雞蛋", amount: 3, unit: "顆" },
      { name: "蔥", amount: 2, unit: "根" }
    ],
    method: "煎",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "雞蛋打散，加蔥花、鹽拌勻",
      "熱鍋下油，倒入蛋液",
      "轉小火煎至底部金黃",
      "翻面續煎至兩面熟透",
      "切塊盛盤"
    ]
  },
  {
    id: "egg-chawanmushi",
    name: "日式茶碗蒸",
    baseServings: 2,
    ingredients: [
      { name: "雞蛋", amount: 2, unit: "顆" },
      { name: "香菇", amount: 2, unit: "朵" },
      { name: "雞胸肉", amount: 80, unit: "克" }
    ],
    method: "蒸",
    cuisine: "日式",
    diet: "葷",
    time: 5,
    bento: false,
    tags: ["高蛋白"],
    tool: "電鍋",
    steps: [
      "雞蛋打散，加 2 倍高湯（或水）過篩",
      "香菇切片、雞胸肉切小丁，加入蛋液",
      "倒入蒸碗，覆蓋保鮮膜",
      "電鍋外鍋加半杯水，蒸至凝固（約 12 分鐘）",
      "取出撒蔥花即可"
    ]
  },
  {
    id: "egg-chive",
    name: "韭菜炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "韭菜", amount: 100, unit: "克" },
      { name: "雞蛋", amount: 3, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "高蛋白"],
    steps: [
      "韭菜洗淨切段，雞蛋打散",
      "熱油鍋，倒入蛋液炒至半熟盛起",
      "鍋中加韭菜段炒至微軟",
      "加鹽調味，倒入炒蛋拌炒均勻即可"
    ]
  },
  {
    id: "egg-miso-softboil",
    name: "味噌溏心蛋",
    baseServings: 4,
    ingredients: [
      { name: "雞蛋", amount: 6, unit: "顆" }
    ],
    method: "滷",
    cuisine: "日式",
    diet: "葷",
    time: 5,
    bento: false,
    tags: ["高蛋白"],
    steps: [
      "雞蛋放入滾水中煮 6.5 分鐘，撈起冰鎮剝殼",
      "醬油、味醂、水以 1:1:1 混合煮滾放涼",
      "雞蛋放入醬汁中冷藏浸泡至少 4 小時",
      "取出對切即可"
    ]
  },

  // ── 豆腐 ──────────────────────────────
  {
    id: "tofu-mapo",
    name: "麻婆豆腐",
    baseServings: 2,
    ingredients: [
      { name: "板豆腐", amount: 1, unit: "塊" },
      { name: "豬絞肉", amount: 150, unit: "克" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "豆腐切丁，滾水汆燙撈起備用",
      "熱油爆香蒜末、薑末、辣椒",
      "下豬絞肉炒散炒香",
      "加入豆瓣醬炒出紅油，加水或高湯煮滾",
      "放入豆腐丁煮 3 分鐘，太白粉水勾芡",
      "撒蔥花、花椒粉即可"
    ]
  },
  {
    id: "tofu-century-egg",
    name: "涼拌皮蛋豆腐",
    baseServings: 2,
    ingredients: [
      { name: "嫩豆腐", amount: 1, unit: "盒" },
      { name: "皮蛋", amount: 2, unit: "顆" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "葷",
    time: 3,
    bento: false,
    tags: ["高蛋白"],
    tool: "免開火",
    steps: [
      "嫩豆腐切塊擺盤，皮蛋切瓣鋪上",
      "醬油、香油、糖調成醬汁",
      "淋上醬汁",
      "撒柴魚片、蔥花即可"
    ]
  },
  {
    id: "tofu-miso-soup",
    name: "味噌豆腐湯",
    baseServings: 2,
    ingredients: [
      { name: "嫩豆腐", amount: 1, unit: "盒" },
      { name: "海帶芽", amount: 1, unit: "大匙" }
    ],
    method: "煮",
    cuisine: "日式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "水煮滾，放入豆腐丁、海帶芽",
      "轉小火，取一勺熱湯調開味噌醬",
      "倒回鍋中拌勻（味噌不可久煮）",
      "撒蔥花即可"
    ]
  },
  {
    id: "tofu-pan-fried",
    name: "煎豆腐佐醬油蔥花",
    baseServings: 2,
    ingredients: [
      { name: "板豆腐", amount: 1, unit: "塊" }
    ],
    method: "煎",
    cuisine: "中式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "板豆腐切片，用廚房紙巾吸乾水分",
      "熱油鍋，豆腐片煎至兩面金黃",
      "盛盤，淋醬油",
      "撒蔥花、白芝麻即可"
    ]
  },
  {
    id: "tofu-braised",
    name: "紅燒豆腐",
    baseServings: 2,
    ingredients: [
      { name: "板豆腐", amount: 1, unit: "塊" },
      { name: "香菇", amount: 3, unit: "朵" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "素",
    time: 10,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    steps: [
      "豆腐切塊，煎至表面微金黃盛起",
      "爆香蒜末、香菇片",
      "加醬油、水、少許糖煮滾",
      "放入豆腐燒 5 分鐘入味",
      "太白粉水勾薄芡，撒蔥花即可"
    ]
  },

  // ── 雞胸肉 ──────────────────────────────
  {
    id: "chicken-breast-garlic",
    name: "蒜香雞胸肉",
    baseServings: 2,
    ingredients: [
      { name: "雞胸肉", amount: 300, unit: "克" }
    ],
    method: "煎",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "雞胸肉切薄片，用鹽、米酒、太白粉抓醃 10 分鐘",
      "熱油鍋，蒜末爆香",
      "雞胸肉片下鍋煎至兩面金黃熟透",
      "加醬油拌炒均勻即可"
    ]
  },
  {
    id: "chicken-breast-shred-salad",
    name: "涼拌雞絲",
    baseServings: 2,
    ingredients: [
      { name: "雞胸肉", amount: 250, unit: "克" },
      { name: "小黃瓜", amount: 1, unit: "條" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: false,
    tags: ["健康", "高蛋白"],
    steps: [
      "雞胸肉水煮至熟（約 15 分鐘），放涼後撕絲",
      "小黃瓜切絲",
      "醬油、香油、白醋、糖調成醬汁",
      "雞絲、小黃瓜絲拌入醬汁即可"
    ]
  },
  {
    id: "chicken-breast-miso-bake",
    name: "味噌烤雞胸",
    baseServings: 2,
    ingredients: [
      { name: "雞胸肉", amount: 300, unit: "克" }
    ],
    method: "烤",
    cuisine: "日式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "烤箱",
    prep: "weekend",
    steps: [
      "雞胸肉用味噌、米酒醃 30 分鐘以上",
      "烤箱預熱 200°C",
      "雞胸肉入烤箱烤 15~18 分鐘至熟",
      "取出切片即可"
    ]
  },
  {
    id: "chicken-breast-scallion",
    name: "蔥爆雞胸肉",
    baseServings: 2,
    ingredients: [
      { name: "雞胸肉", amount: 300, unit: "克" },
      { name: "蔥", amount: 3, unit: "根" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "雞胸肉切片，鹽、太白粉抓醃",
      "蔥切段，蔥白蔥綠分開",
      "熱油鍋，雞胸肉片炒至變色",
      "加蔥白炒香，再加蔥綠快速拌炒",
      "加醬油調味即可"
    ]
  },
  {
    id: "chicken-breast-lemon",
    name: "檸檬香煎雞胸",
    baseServings: 2,
    ingredients: [
      { name: "雞胸肉", amount: 300, unit: "克" },
      { name: "檸檬", amount: 1, unit: "顆" }
    ],
    method: "煎",
    cuisine: "西式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "雞胸肉拍鬆，用鹽、黑胡椒調味",
      "熱油鍋，雞胸肉煎至兩面金黃熟透",
      "起鍋前擠上檸檬汁",
      "切片盛盤即可"
    ]
  },

  // ── 雞腿肉 ──────────────────────────────
  {
    id: "chicken-thigh-pan",
    name: "香煎雞腿排",
    baseServings: 2,
    ingredients: [
      { name: "雞腿肉", amount: 400, unit: "克" }
    ],
    method: "煎",
    cuisine: "西式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "雞腿肉用鹽、黑胡椒醃 10 分鐘，皮面劃刀",
      "冷鍋皮面朝下，開中火慢煎逼油",
      "煎至皮酥脆金黃後翻面",
      "續煎至熟透，靜置 3 分鐘後切片"
    ]
  },
  {
    id: "chicken-thigh-three-cup",
    name: "三杯雞腿",
    baseServings: 2,
    ingredients: [
      { name: "雞腿肉", amount: 400, unit: "克" },
      { name: "九層塔", amount: 0.5, unit: "把" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "雞腿肉切塊，香油爆香薑片、蒜頭",
      "下雞腿塊炒至變色",
      "加醬油、米酒、少許糖，蓋鍋燜煮 10 分鐘",
      "開蓋收汁，起鍋前加九層塔拌勻即可"
    ]
  },
  {
    id: "chicken-thigh-miso-bake",
    name: "味噌烤雞腿",
    baseServings: 2,
    ingredients: [
      { name: "雞腿肉", amount: 400, unit: "克" }
    ],
    method: "烤",
    cuisine: "日式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "烤箱",
    prep: "weekend",
    steps: [
      "雞腿肉用味噌、味醂、米酒醃 1 小時以上",
      "烤箱預熱 200°C",
      "雞腿皮面朝上入烤箱烤 20 分鐘至熟",
      "取出靜置後切塊"
    ]
  },
  {
    id: "chicken-diced-bell-pepper",
    name: "彩椒炒雞丁",
    baseServings: 2,
    ingredients: [
      { name: "雞腿肉", amount: 350, unit: "克" },
      { name: "甜椒", amount: 1, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "雞腿肉切丁，鹽、太白粉抓醃",
      "甜椒切塊",
      "熱油鍋，雞丁炒至變色盛起",
      "鍋中炒甜椒至微軟，加回雞丁",
      "加醬油拌炒均勻即可"
    ]
  },

  // ── 豬絞肉 ──────────────────────────────
  {
    id: "pork-mince-ants-tree",
    name: "螞蟻上樹",
    baseServings: 2,
    ingredients: [
      { name: "豬絞肉", amount: 150, unit: "克" },
      { name: "冬粉", amount: 60, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "冬粉泡軟剪短",
      "爆香蒜末、辣椒，下豬絞肉炒散",
      "加豆瓣醬、醬油炒香",
      "加水煮滾，放入冬粉煮至吸汁",
      "撒蔥花即可"
    ]
  },
  {
    id: "pork-mince-green-bean",
    name: "絞肉炒四季豆",
    baseServings: 2,
    ingredients: [
      { name: "豬絞肉", amount: 150, unit: "克" },
      { name: "四季豆", amount: 200, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    steps: [
      "四季豆切段",
      "爆香蒜末，下豬絞肉炒至變色",
      "加入四季豆拌炒",
      "加醬油、少許水，蓋鍋燜煮 3 分鐘至熟",
      "開蓋收汁即可"
    ]
  },
  {
    id: "pork-mince-eggplant",
    name: "魚香茄子",
    baseServings: 2,
    ingredients: [
      { name: "豬絞肉", amount: 100, unit: "克" },
      { name: "茄子", amount: 2, unit: "條" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "葷",
    time: 12,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "茄子切長段，過油或乾煎至軟身盛起",
      "爆香蒜末、薑末、辣椒",
      "下豬絞肉炒散",
      "加豆瓣醬、醬油、烏醋、糖炒勻",
      "放入茄子拌炒入味，太白粉水勾芡",
      "撒蔥花即可"
    ]
  },
  {
    id: "pork-mince-bell-pepper",
    name: "青椒鑲肉",
    baseServings: 2,
    ingredients: [
      { name: "豬絞肉", amount: 200, unit: "克" },
      { name: "青椒", amount: 2, unit: "顆" }
    ],
    method: "煎",
    cuisine: "中式",
    diet: "葷",
    time: 12,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "青椒對半切開去籽",
      "豬絞肉加鹽、太白粉、蔥花拌至有黏性",
      "絞肉餡填入青椒中",
      "熱鍋少油，肉面朝下煎至金黃",
      "翻面加水加蓋燜熟即可"
    ]
  },
  {
    id: "pork-mince-tomato-sauce",
    name: "番茄肉燥",
    baseServings: 2,
    ingredients: [
      { name: "豬絞肉", amount: 200, unit: "克" },
      { name: "番茄", amount: 2, unit: "顆" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "番茄切小塊",
      "爆香蒜末，下豬絞肉炒散炒香",
      "加入番茄塊炒軟出汁",
      "加醬油、糖，加水燜煮 10 分鐘",
      "可拌飯或拌麵享用"
    ]
  },

  // ── 豬肉片/里肌 ──────────────────────────────
  {
    id: "pork-slice-ginger",
    name: "薑燒豬肉",
    baseServings: 2,
    ingredients: [
      { name: "豬肉片", amount: 250, unit: "克" }
    ],
    method: "炒",
    cuisine: "日式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "豬肉片用醬油、味醂、薑泥醃 10 分鐘",
      "熱油鍋，豬肉片下鍋煎至變色",
      "淋入醃醬煮至收汁",
      "盛盤即可"
    ]
  },
  {
    id: "pork-loin-sweet-sour",
    name: "健康版糖醋里肌",
    baseServings: 2,
    ingredients: [
      { name: "豬里肌", amount: 250, unit: "克" }
    ],
    method: "煎",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "豬里肌切塊，鹽、太白粉抓醃",
      "熱油鍋，肉塊煎至兩面金黃熟透盛起",
      "鍋中加番茄醬、白醋、糖、少許水煮滾",
      "放回肉塊拌炒均勻裹醬即可"
    ]
  },
  {
    id: "pork-slice-chive",
    name: "韭黃炒肉絲",
    baseServings: 2,
    ingredients: [
      { name: "豬肉片", amount: 200, unit: "克" },
      { name: "韭黃", amount: 100, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "豬肉絲用醬油、太白粉抓醃",
      "韭黃切段",
      "熱油鍋，肉絲炒至變色盛起",
      "鍋中加韭黃快炒至微軟",
      "加回肉絲，加鹽拌勻即可"
    ]
  },
  {
    id: "pork-slice-moo-shu",
    name: "木須炒肉",
    baseServings: 2,
    ingredients: [
      { name: "豬肉片", amount: 150, unit: "克" },
      { name: "黑木耳", amount: 50, unit: "克" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "豬肉絲醃太白粉、醬油；木耳切絲；蛋打散炒熟盛起",
      "熱油鍋，肉絲炒至變色",
      "加木耳絲拌炒",
      "加回炒蛋，加醬油、鹽拌勻即可"
    ]
  },

  // ── 牛肉 ──────────────────────────────
  {
    id: "beef-scallion",
    name: "蔥爆牛肉",
    baseServings: 2,
    ingredients: [
      { name: "牛肉片", amount: 250, unit: "克" },
      { name: "蔥", amount: 3, unit: "根" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "牛肉片用醬油、太白粉、米酒抓醃",
      "蔥切段，蔥白蔥綠分開",
      "大火熱油鍋，牛肉片快炒至變色盛起（避免久炒變老）",
      "鍋中爆香蔥白，加回牛肉、蔥綠快速拌炒",
      "加鹽調味即可"
    ]
  },
  {
    id: "beef-black-pepper",
    name: "黑胡椒牛柳",
    baseServings: 2,
    ingredients: [
      { name: "牛肉片", amount: 250, unit: "克" },
      { name: "洋蔥", amount: 0.5, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "牛肉片用醬油、太白粉抓醃",
      "洋蔥切絲",
      "大火熱油鍋，牛肉片快炒盛起",
      "鍋中炒洋蔥絲至微軟",
      "加回牛肉，加黑胡椒、醬油拌炒均勻即可"
    ]
  },
  {
    id: "beef-bell-pepper",
    name: "牛肉炒青椒",
    baseServings: 2,
    ingredients: [
      { name: "牛肉片", amount: 250, unit: "克" },
      { name: "青椒", amount: 2, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "牛肉片用醬油、太白粉抓醃",
      "青椒切絲",
      "大火熱油鍋，牛肉片快炒盛起",
      "鍋中炒青椒絲至微軟",
      "加回牛肉拌炒，加鹽調味即可"
    ]
  },
  {
    id: "beef-tomato-stew",
    name: "番茄燉牛肉",
    baseServings: 3,
    ingredients: [
      { name: "牛肋條", amount: 400, unit: "克" },
      { name: "番茄", amount: 3, unit: "顆" },
      { name: "馬鈴薯", amount: 2, unit: "顆" }
    ],
    method: "燉",
    cuisine: "西式",
    diet: "葷",
    time: 15,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "牛肋條切塊，汆燙去血水",
      "番茄、馬鈴薯切塊",
      "爆香洋蔥（可用蔥薑代替），下牛肉塊略炒",
      "加番茄塊、水（蓋過食材），燉煮 40 分鐘",
      "加馬鈴薯續燉 15 分鐘至軟爛",
      "加鹽調味即可"
    ]
  },

  // ── 鮭魚 ──────────────────────────────
  {
    id: "salmon-pan-fried",
    name: "香煎鮭魚排",
    baseServings: 2,
    ingredients: [
      { name: "鮭魚", amount: 2, unit: "片" }
    ],
    method: "煎",
    cuisine: "西式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "鮭魚用鹽、黑胡椒醃 10 分鐘，擦乾表面水分",
      "熱油鍋，魚皮朝下煎至酥脆",
      "翻面續煎至熟透",
      "擠檸檬汁即可"
    ]
  },
  {
    id: "salmon-miso-bake",
    name: "味噌烤鮭魚",
    baseServings: 2,
    ingredients: [
      { name: "鮭魚", amount: 2, unit: "片" }
    ],
    method: "烤",
    cuisine: "日式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "烤箱",
    steps: [
      "鮭魚用味噌、味醂醃 30 分鐘",
      "烤箱預熱 200°C",
      "鮭魚入烤箱烤 12~15 分鐘至熟",
      "取出即可"
    ]
  },
  {
    id: "salmon-rice",
    name: "鮭魚炊飯",
    baseServings: 3,
    ingredients: [
      { name: "鮭魚", amount: 2, unit: "片" },
      { name: "白米", amount: 2, unit: "杯" },
      { name: "紅蘿蔔", amount: 0.5, unit: "條" }
    ],
    method: "煮",
    cuisine: "日式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    tool: "電鍋",
    steps: [
      "白米洗淨放入電鍋內鍋，紅蘿蔔切丁",
      "鮭魚、紅蘿蔔丁鋪在米上",
      "加醬油、米酒、水（比平常煮飯略少）",
      "按下開關煮熟後燜 10 分鐘",
      "取出鮭魚去皮去骨，與飯拌勻即可"
    ]
  },

  // ── 蝦仁 ──────────────────────────────
  {
    id: "shrimp-garlic",
    name: "蒜蓉炒蝦仁",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 200, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "蝦仁去腸泥，用鹽、太白粉抓醃",
      "熱油鍋，蒜末爆香",
      "蝦仁下鍋快炒至變色捲曲",
      "加鹽、米酒調味即可"
    ]
  },
  {
    id: "shrimp-egg",
    name: "蝦仁炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 150, unit: "克" },
      { name: "雞蛋", amount: 3, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "蝦仁去腸泥，雞蛋打散加鹽",
      "熱油鍋，蝦仁炒至變色盛起",
      "倒入蛋液炒至半凝固",
      "加回蝦仁拌炒均勻即可"
    ]
  },
  {
    id: "shrimp-lemon-salad",
    name: "涼拌檸檬蝦",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 200, unit: "克" },
      { name: "小黃瓜", amount: 1, unit: "條" }
    ],
    method: "涼拌",
    cuisine: "泰式",
    diet: "葷",
    time: 8,
    bento: false,
    tags: ["健康", "高蛋白"],
    steps: [
      "蝦仁川燙至熟，冰鎮",
      "小黃瓜切片",
      "檸檬汁、糖、辣椒調成醬汁",
      "蝦仁、小黃瓜拌入醬汁即可"
    ]
  },
  {
    id: "shrimp-vermicelli",
    name: "蝦仁冬粉煲",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 200, unit: "克" },
      { name: "冬粉", amount: 60, unit: "克" }
    ],
    method: "煮",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "冬粉泡軟剪短，鋪於鍋底",
      "蝦仁鋪在冬粉上",
      "爆香蒜末，加醬油、水煮成醬汁淋上",
      "蓋鍋燜煮 5~8 分鐘至蝦熟粉軟",
      "撒蔥花即可"
    ]
  },

  // ── 魚片 ──────────────────────────────
  {
    id: "fish-steamed",
    name: "破布子蒸魚片",
    baseServings: 2,
    ingredients: [
      { name: "魚片", amount: 2, unit: "片" }
    ],
    method: "蒸",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: false,
    tags: ["健康", "高蛋白"],
    tool: "電鍋",
    steps: [
      "魚片鋪盤，鋪上薑絲、破布子",
      "電鍋外鍋加水，蒸 10~12 分鐘至熟",
      "取出淋少許醬油",
      "撒蔥絲，淋熱油激香即可"
    ]
  },
  {
    id: "fish-doubanjiang",
    name: "豆瓣魚片",
    baseServings: 2,
    ingredients: [
      { name: "魚片", amount: 2, unit: "片" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "魚片用太白粉薄薄拍粉",
      "熱油鍋，魚片煎至兩面微金盛起",
      "爆香蒜末、薑末、豆瓣醬",
      "加水、醬油煮滾",
      "放回魚片略煮，太白粉水勾芡即可"
    ]
  },
  {
    id: "fish-lemon",
    name: "檸檬魚片",
    baseServings: 2,
    ingredients: [
      { name: "魚片", amount: 2, unit: "片" }
    ],
    method: "煎",
    cuisine: "西式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "魚片用鹽、黑胡椒調味",
      "熱油鍋，魚片煎至兩面金黃熟透",
      "起鍋前擠上檸檬汁",
      "盛盤即可"
    ]
  },

  // ── 高麗菜 ──────────────────────────────
  {
    id: "cabbage-garlic",
    name: "蒜炒高麗菜",
    baseServings: 2,
    ingredients: [
      { name: "高麗菜", amount: 300, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "高麗菜洗淨剝片",
      "熱油鍋，蒜末爆香",
      "高麗菜下鍋大火快炒",
      "加鹽、少許水，蓋鍋燜 1 分鐘至軟即可"
    ]
  },
  {
    id: "cabbage-dried-shrimp",
    name: "開陽高麗菜",
    baseServings: 2,
    ingredients: [
      { name: "高麗菜", amount: 300, unit: "克" },
      { name: "蝦米", amount: 1, unit: "大匙" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "蝦米泡軟，高麗菜剝片",
      "熱油鍋，爆香蝦米、蒜末",
      "加入高麗菜大火快炒",
      "加鹽、少許水燜煮 1 分鐘即可"
    ]
  },
  {
    id: "cabbage-salad",
    name: "涼拌高麗菜絲",
    baseServings: 2,
    ingredients: [
      { name: "高麗菜", amount: 250, unit: "克" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "素",
    time: 8,
    bento: false,
    tags: ["健康", "多纖維"],
    tool: "免開火",
    steps: [
      "高麗菜切細絲，加鹽抓醃出水後擠乾",
      "白醋、糖、香油調成醬汁",
      "高麗菜絲拌入醬汁",
      "冷藏 20 分鐘入味即可"
    ]
  },
  {
    id: "cabbage-miso-soup",
    name: "味噌高麗菜湯",
    baseServings: 2,
    ingredients: [
      { name: "高麗菜", amount: 200, unit: "克" }
    ],
    method: "煮",
    cuisine: "日式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "高麗菜切片",
      "水煮滾，放入高麗菜煮軟",
      "轉小火，取一勺熱湯調開味噌",
      "倒回鍋中拌勻即可"
    ]
  },
  {
    id: "cabbage-pork",
    name: "高麗菜炒肉絲",
    baseServings: 2,
    ingredients: [
      { name: "高麗菜", amount: 250, unit: "克" },
      { name: "豬肉片", amount: 120, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白", "多纖維"],
    steps: [
      "豬肉絲用醬油、太白粉抓醃",
      "高麗菜剝片",
      "熱油鍋，肉絲炒至變色盛起",
      "鍋中加高麗菜快炒",
      "加回肉絲，加鹽拌勻燜 1 分鐘即可"
    ]
  },

  // ── 花椰菜 ──────────────────────────────
  {
    id: "broccoli-garlic",
    name: "蒜炒花椰菜",
    baseServings: 2,
    ingredients: [
      { name: "花椰菜", amount: 250, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 6,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "花椰菜切小朵，滾水汆燙 1 分鐘撈起",
      "熱油鍋，蒜末爆香",
      "花椰菜下鍋快炒",
      "加鹽調味即可"
    ]
  },
  {
    id: "broccoli-shrimp",
    name: "蝦仁炒花椰菜",
    baseServings: 2,
    ingredients: [
      { name: "花椰菜", amount: 200, unit: "克" },
      { name: "蝦仁", amount: 150, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白", "多纖維"],
    steps: [
      "花椰菜切小朵汆燙備用",
      "蝦仁去腸泥，太白粉抓醃",
      "熱油鍋，蝦仁炒至變色盛起",
      "鍋中加花椰菜快炒，加回蝦仁",
      "加鹽拌勻即可"
    ]
  },
  {
    id: "broccoli-mustard-salad",
    name: "涼拌芥末花椰菜",
    baseServings: 2,
    ingredients: [
      { name: "花椰菜", amount: 250, unit: "克" }
    ],
    method: "涼拌",
    cuisine: "日式",
    diet: "素",
    time: 6,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "花椰菜切小朵，滾水汆燙後冰鎮瀝乾",
      "醬油、芥末、糖調成醬汁",
      "花椰菜拌入醬汁即可"
    ]
  },

  // ── 青江菜 ──────────────────────────────
  {
    id: "bokchoy-garlic",
    name: "蒜炒青江菜",
    baseServings: 2,
    ingredients: [
      { name: "青江菜", amount: 250, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "青江菜洗淨對切",
      "熱油鍋，蒜末爆香",
      "青江菜下鍋快炒至微軟",
      "加鹽調味即可"
    ]
  },
  {
    id: "bokchoy-oyster-sauce",
    name: "蠔油青江菜",
    baseServings: 2,
    ingredients: [
      { name: "青江菜", amount: 250, unit: "克" }
    ],
    method: "煮",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "青江菜滾水汆燙 30 秒撈起排盤",
      "蠔油、少許水、糖煮滾成醬汁",
      "淋在青江菜上",
      "撒蒜酥即可"
    ]
  },
  {
    id: "bokchoy-dried-shrimp",
    name: "開陽青江菜",
    baseServings: 2,
    ingredients: [
      { name: "青江菜", amount: 250, unit: "克" },
      { name: "蝦米", amount: 1, unit: "大匙" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "蝦米泡軟，青江菜對切",
      "熱油鍋，爆香蝦米、蒜末",
      "加入青江菜快炒",
      "加鹽調味即可"
    ]
  },

  // ── 菠菜 ──────────────────────────────
  {
    id: "spinach-salad",
    name: "涼拌菠菜",
    baseServings: 2,
    ingredients: [
      { name: "菠菜", amount: 200, unit: "克" }
    ],
    method: "涼拌",
    cuisine: "日式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "菠菜滾水汆燙 30 秒，冰鎮瀝乾切段",
      "醬油、香油、白芝麻拌勻",
      "菠菜拌入醬汁即可"
    ]
  },
  {
    id: "spinach-garlic",
    name: "蒜炒菠菜",
    baseServings: 2,
    ingredients: [
      { name: "菠菜", amount: 200, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "菠菜洗淨切段",
      "熱油鍋，蒜末爆香",
      "菠菜下鍋快炒至軟",
      "加鹽調味即可"
    ]
  },
  {
    id: "spinach-egg-soup",
    name: "菠菜蛋花湯",
    baseServings: 2,
    ingredients: [
      { name: "菠菜", amount: 100, unit: "克" },
      { name: "雞蛋", amount: 1, unit: "顆" }
    ],
    method: "煮",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "菠菜洗淨切段，雞蛋打散",
      "水煮滾，放入菠菜煮軟",
      "加鹽調味",
      "淋入蛋液攪散成蛋花即可"
    ]
  },

  // ── 四季豆 ──────────────────────────────
  {
    id: "green-bean-dry-fried",
    name: "乾煸四季豆",
    baseServings: 2,
    ingredients: [
      { name: "四季豆", amount: 250, unit: "克" },
      { name: "豬絞肉", amount: 80, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "四季豆去頭尾，煎或炸至表皮起皺盛起",
      "爆香蒜末、辣椒，下豬絞肉炒香",
      "加回四季豆拌炒",
      "加醬油、糖調味即可"
    ]
  },
  {
    id: "green-bean-garlic",
    name: "蒜炒四季豆",
    baseServings: 2,
    ingredients: [
      { name: "四季豆", amount: 250, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 6,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "四季豆去頭尾切段",
      "熱油鍋，蒜末爆香",
      "四季豆下鍋炒，加少許水燜煮 3 分鐘至熟",
      "加鹽調味即可"
    ]
  },
  {
    id: "green-bean-salad",
    name: "涼拌四季豆",
    baseServings: 2,
    ingredients: [
      { name: "四季豆", amount: 250, unit: "克" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "四季豆去頭尾，滾水汆燙 3 分鐘至熟，冰鎮",
      "切段，加醬油、香油、蒜末拌勻即可"
    ]
  },

  // ── 茄子 ──────────────────────────────
  {
    id: "eggplant-garlic",
    name: "蒜燒茄子",
    baseServings: 2,
    ingredients: [
      { name: "茄子", amount: 2, unit: "條" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "茄子切長段",
      "熱油鍋，蒜末爆香",
      "茄子下鍋煎軟",
      "加醬油、水，蓋鍋燜煮 5 分鐘至軟即可"
    ]
  },
  {
    id: "eggplant-century-egg",
    name: "涼拌皮蛋茄子",
    baseServings: 2,
    ingredients: [
      { name: "茄子", amount: 2, unit: "條" },
      { name: "皮蛋", amount: 2, unit: "顆" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["健康"],
    steps: [
      "茄子整條蒸 10 分鐘至軟，放涼撕條",
      "皮蛋切丁",
      "醬油、蒜末、香油調成醬汁",
      "茄子、皮蛋淋上醬汁拌勻即可"
    ]
  },

  // ── 馬鈴薯 ──────────────────────────────
  {
    id: "potato-shred-vinegar",
    name: "醋溜馬鈴薯絲",
    baseServings: 2,
    ingredients: [
      { name: "馬鈴薯", amount: 2, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["健康"],
    steps: [
      "馬鈴薯切細絲，泡水去澱粉後瀝乾",
      "熱油鍋，乾辣椒、蒜末爆香",
      "馬鈴薯絲下鍋快炒",
      "加白醋、鹽炒至熟脆即可"
    ]
  },
  {
    id: "potato-curry-stew",
    name: "咖哩馬鈴薯燉肉",
    baseServings: 3,
    ingredients: [
      { name: "馬鈴薯", amount: 2, unit: "顆" },
      { name: "豬肉片", amount: 250, unit: "克" },
      { name: "紅蘿蔔", amount: 1, unit: "條" }
    ],
    method: "燉",
    cuisine: "日式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["一鍋"],
    prep: "weekend",
    steps: [
      "馬鈴薯、紅蘿蔔切塊",
      "熱油鍋，豬肉片炒至變色",
      "加入馬鈴薯、紅蘿蔔略炒",
      "加水蓋過食材，煮滾後燉 15 分鐘",
      "轉小火加入咖哩塊拌至融化，續煮 5 分鐘即可"
    ]
  },
  {
    id: "potato-roasted",
    name: "烤馬鈴薯塊",
    baseServings: 2,
    ingredients: [
      { name: "馬鈴薯", amount: 3, unit: "顆" }
    ],
    method: "烤",
    cuisine: "西式",
    diet: "素",
    time: 5,
    bento: true,
    tags: ["健康"],
    tool: "烤箱",
    steps: [
      "馬鈴薯切塊，用油、鹽、黑胡椒拌勻",
      "烤箱預熱 200°C",
      "馬鈴薯入烤箱烤 25~30 分鐘至金黃即可"
    ]
  },

  // ── 紅蘿蔔 ──────────────────────────────
  {
    id: "carrot-egg",
    name: "紅蘿蔔炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "紅蘿蔔", amount: 1, unit: "條" },
      { name: "雞蛋", amount: 3, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "紅蘿蔔切細絲，雞蛋打散",
      "熱油鍋，紅蘿蔔絲炒軟",
      "倒入蛋液炒至凝固",
      "加鹽調味即可"
    ]
  },
  {
    id: "carrot-salad",
    name: "涼拌紅蘿蔔絲",
    baseServings: 2,
    ingredients: [
      { name: "紅蘿蔔", amount: 1, unit: "條" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "素",
    time: 6,
    bento: false,
    tags: ["健康"],
    tool: "免開火",
    steps: [
      "紅蘿蔔切細絲，加鹽抓醃出水後擠乾",
      "白醋、糖、香油調成醬汁",
      "紅蘿蔔絲拌入醬汁即可"
    ]
  },

  // ── 番茄（egg 之外） ──────────────────────────────
  {
    id: "tomato-tofu-egg-soup",
    name: "番茄豆腐蛋花湯",
    baseServings: 2,
    ingredients: [
      { name: "番茄", amount: 2, unit: "顆" },
      { name: "嫩豆腐", amount: 1, unit: "盒" },
      { name: "雞蛋", amount: 1, unit: "顆" }
    ],
    method: "煮",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "番茄切塊，豆腐切丁，雞蛋打散",
      "水煮滾，加入番茄煮軟出色",
      "加入豆腐丁煮滾",
      "加鹽調味，淋入蛋液成蛋花即可"
    ]
  },
  {
    id: "tomato-vegetable-stew",
    name: "義式番茄燉菜",
    baseServings: 2,
    ingredients: [
      { name: "番茄", amount: 2, unit: "顆" },
      { name: "櫛瓜", amount: 1, unit: "條" },
      { name: "洋蔥", amount: 0.5, unit: "顆" }
    ],
    method: "燉",
    cuisine: "西式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["健康", "多纖維", "一鍋"],
    prep: "weekend",
    steps: [
      "番茄、櫛瓜、洋蔥切塊",
      "熱油鍋，洋蔥炒軟",
      "加入番茄、櫛瓜拌炒",
      "加少許水，蓋鍋燉煮 15 分鐘",
      "加鹽、黑胡椒調味即可"
    ]
  },

  // ── 小黃瓜 ──────────────────────────────
  {
    id: "cucumber-salad",
    name: "涼拌小黃瓜",
    baseServings: 2,
    ingredients: [
      { name: "小黃瓜", amount: 2, unit: "條" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康"],
    tool: "免開火",
    steps: [
      "小黃瓜拍裂切段，加鹽抓醃 10 分鐘後倒去水分",
      "蒜末、白醋、糖、香油調成醬汁",
      "小黃瓜拌入醬汁，冷藏 20 分鐘入味即可"
    ]
  },
  {
    id: "cucumber-garlic-stir",
    name: "蒜味小黃瓜炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "小黃瓜", amount: 2, unit: "條" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "小黃瓜切片，雞蛋打散",
      "熱油鍋，蛋液炒至半熟盛起",
      "鍋中蒜末爆香，加小黃瓜快炒",
      "加回炒蛋，加鹽拌勻即可"
    ]
  },

  // ── 菇類 ──────────────────────────────
  {
    id: "mushroom-mix-stir",
    name: "三色炒菇",
    baseServings: 2,
    ingredients: [
      { name: "香菇", amount: 4, unit: "朵" },
      { name: "杏鮑菇", amount: 2, unit: "條" },
      { name: "紅蘿蔔", amount: 0.5, unit: "條" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "香菇、杏鮑菇切片，紅蘿蔔切絲",
      "熱油鍋，蒜末爆香",
      "放入所有菇類、紅蘿蔔絲拌炒",
      "加醬油、少許水燜煮 3 分鐘",
      "加鹽調味即可"
    ]
  },
  {
    id: "king-oyster-mushroom-oyster-sauce",
    name: "蠔油杏鮑菇",
    baseServings: 2,
    ingredients: [
      { name: "杏鮑菇", amount: 3, unit: "條" }
    ],
    method: "煎",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["健康"],
    steps: [
      "杏鮑菇切厚片",
      "熱油鍋，杏鮑菇煎至兩面金黃",
      "加蠔油、少許水煮至收汁",
      "撒蔥花即可"
    ]
  },
  {
    id: "shiitake-chicken-soup",
    name: "香菇雞湯",
    baseServings: 3,
    ingredients: [
      { name: "雞腿肉", amount: 400, unit: "克" },
      { name: "乾香菇", amount: 6, unit: "朵" }
    ],
    method: "燉",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: false,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "乾香菇泡軟切片，雞腿肉切塊汆燙去血水",
      "所有食材放入鍋中，加水蓋過食材",
      "煮滾後轉小火燉 30 分鐘",
      "加鹽調味即可"
    ]
  },

  // ── 主食類 ──────────────────────────────
  {
    id: "egg-fried-rice",
    name: "蛋炒飯",
    baseServings: 2,
    ingredients: [
      { name: "白飯", amount: 2, unit: "碗" },
      { name: "雞蛋", amount: 2, unit: "顆" },
      { name: "蔥", amount: 1, unit: "根" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["一鍋"],
    steps: [
      "白飯（隔夜飯較佳）用飯匙打散，雞蛋打散",
      "熱油鍋，倒入蛋液快速炒散",
      "加入白飯拌炒，讓每粒飯都裹上蛋液",
      "加鹽、白胡椒粉調味",
      "起鍋前加蔥花拌勻即可"
    ]
  },
  {
    id: "tomato-pasta",
    name: "番茄義大利麵",
    baseServings: 2,
    ingredients: [
      { name: "義大利麵", amount: 180, unit: "克" },
      { name: "番茄", amount: 3, unit: "顆" },
      { name: "洋蔥", amount: 0.5, unit: "顆" }
    ],
    method: "煮",
    cuisine: "西式",
    diet: "素",
    time: 10,
    bento: true,
    tags: ["健康"],
    steps: [
      "義大利麵依包裝時間煮熟撈起，留半碗煮麵水",
      "番茄切塊，洋蔥切碎",
      "熱油鍋，洋蔥炒軟，加番茄炒出汁",
      "加鹽、黑胡椒調味，倒入煮麵水略煮",
      "拌入義大利麵炒勻即可"
    ]
  },
  {
    id: "mixed-vegetable-rice",
    name: "彩蔬炊飯",
    baseServings: 3,
    ingredients: [
      { name: "白米", amount: 2, unit: "杯" },
      { name: "紅蘿蔔", amount: 0.5, unit: "條" },
      { name: "玉米粒", amount: 100, unit: "克" },
      { name: "香菇", amount: 3, unit: "朵" }
    ],
    method: "煮",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: true,
    tags: ["健康", "多纖維", "一鍋"],
    tool: "電鍋",
    steps: [
      "白米洗淨放入電鍋內鍋，紅蘿蔔、香菇切丁",
      "所有食材鋪在米上，加醬油、水（比平常略少）",
      "按下開關煮熟後燜 10 分鐘",
      "打開拌勻即可"
    ]
  },
  {
    id: "japchae-glass-noodle",
    name: "韓式雜菜冬粉",
    baseServings: 2,
    ingredients: [
      { name: "冬粉", amount: 80, unit: "克" },
      { name: "菠菜", amount: 100, unit: "克" },
      { name: "紅蘿蔔", amount: 0.5, unit: "條" },
      { name: "豬肉片", amount: 100, unit: "克" }
    ],
    method: "炒",
    cuisine: "韓式",
    diet: "葷",
    time: 15,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "冬粉泡軟煮熟剪短；菠菜汆燙；紅蘿蔔切絲",
      "豬肉絲用醬油、糖抓醃",
      "熱油鍋，豬肉絲炒熟盛起，紅蘿蔔絲炒軟盛起",
      "同鍋加冬粉、醬油、香油、糖拌炒",
      "加回所有食材拌勻，撒白芝麻即可"
    ]
  },

  // ── 豆芽菜 ──────────────────────────────
  {
    id: "bean-sprout-stir",
    name: "蒜炒豆芽菜",
    baseServings: 2,
    ingredients: [
      { name: "豆芽菜", amount: 250, unit: "克" },
      { name: "韭菜", amount: 50, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "豆芽菜洗淨瀝乾，韭菜切段",
      "熱油鍋，蒜末爆香",
      "豆芽菜下鍋大火快炒",
      "加韭菜段拌炒，加鹽調味即可"
    ]
  },

  // ── 秋葵 ──────────────────────────────
  {
    id: "okra-salad",
    name: "涼拌秋葵",
    baseServings: 2,
    ingredients: [
      { name: "秋葵", amount: 10, unit: "條" }
    ],
    method: "涼拌",
    cuisine: "日式",
    diet: "素",
    time: 5,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "秋葵去蒂，滾水汆燙 2 分鐘後冰鎮",
      "切片，淋上醬油、柴魚片",
      "即可享用"
    ]
  },
  {
    id: "okra-garlic-stir",
    name: "蒜炒秋葵",
    baseServings: 2,
    ingredients: [
      { name: "秋葵", amount: 12, unit: "條" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "秋葵去蒂，斜切成片",
      "熱油鍋，蒜末爆香",
      "秋葵下鍋大火快炒 1~2 分鐘",
      "加鹽調味即可"
    ]
  },
  {
    id: "okra-roasted",
    name: "烤秋葵",
    baseServings: 2,
    ingredients: [
      { name: "秋葵", amount: 12, unit: "條" }
    ],
    method: "烤",
    cuisine: "西式",
    diet: "素",
    time: 3,
    bento: true,
    tags: ["健康", "多纖維"],
    tool: "烤箱",
    steps: [
      "秋葵去蒂，用油、鹽拌勻",
      "烤箱預熱 200°C",
      "秋葵入烤箱烤 8~10 分鐘至表面微焦",
      "取出即可"
    ]
  },
  {
    id: "okra-miso-soup",
    name: "秋葵味噌湯",
    baseServings: 2,
    ingredients: [
      { name: "秋葵", amount: 8, unit: "條" },
      { name: "嫩豆腐", amount: 0.5, unit: "盒" }
    ],
    method: "煮",
    cuisine: "日式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "秋葵去蒂切片，豆腐切丁",
      "水煮滾，放入秋葵、豆腐煮 2 分鐘",
      "轉小火，取一勺熱湯調開味噌",
      "倒回鍋中拌勻即可"
    ]
  },
  {
    id: "okra-egg-stir",
    name: "秋葵炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "秋葵", amount: 10, unit: "條" },
      { name: "雞蛋", amount: 3, unit: "顆" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "秋葵去蒂切片，雞蛋打散加鹽",
      "熱油鍋，蛋液炒至半凝固盛起",
      "鍋中加秋葵片快炒 1 分鐘",
      "加回炒蛋拌勻即可"
    ]
  },
  {
    id: "beef-okra-stir",
    name: "秋葵炒牛肉",
    baseServings: 2,
    ingredients: [
      { name: "牛肉片", amount: 200, unit: "克" },
      { name: "秋葵", amount: 10, unit: "條" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "牛肉片用醬油、太白粉抓醃",
      "秋葵去蒂切片",
      "大火熱油鍋，牛肉片快炒至變色盛起",
      "鍋中加秋葵快炒 1 分鐘",
      "加回牛肉，加蠔油拌炒均勻即可"
    ]
  },
  {
    id: "beef-okra-donburi",
    name: "秋葵牛肉丼",
    baseServings: 2,
    ingredients: [
      { name: "牛肉片", amount: 200, unit: "克" },
      { name: "秋葵", amount: 8, unit: "條" },
      { name: "白飯", amount: 2, unit: "碗" }
    ],
    method: "煮",
    cuisine: "日式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "秋葵去蒂，滾水汆燙 1 分鐘後切片",
      "醬油、味醂、糖、水調成醬汁",
      "牛肉片下鍋煮至變色，倒入醬汁煮滾",
      "加入秋葵片略煮 1 分鐘",
      "盛在白飯上即可"
    ]
  },

  // ── 蝦仁（追加） ──────────────────────────────
  {
    id: "shrimp-garlic-bake",
    name: "蒜烤蝦仁",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 250, unit: "克" }
    ],
    method: "烤",
    cuisine: "西式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "烤箱",
    steps: [
      "蝦仁去腸泥，用鹽、黑胡椒調味",
      "蒜末、少許油拌入蝦仁",
      "烤箱預熱 200°C，蝦仁排盤入烤箱烤 8~10 分鐘",
      "取出擠檸檬汁即可"
    ]
  },
  {
    id: "shrimp-curry",
    name: "咖哩蝦仁",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 250, unit: "克" },
      { name: "洋蔥", amount: 0.5, unit: "顆" }
    ],
    method: "燒",
    cuisine: "日式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "蝦仁去腸泥，洋蔥切絲",
      "熱油鍋，洋蔥炒軟",
      "加水煮滾，轉小火加入咖哩塊拌至融化",
      "放入蝦仁煮至變色熟透即可"
    ]
  },
  {
    id: "shrimp-tofu-braised",
    name: "蝦仁豆腐煲",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 200, unit: "克" },
      { name: "嫩豆腐", amount: 1, unit: "盒" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "蝦仁去腸泥，豆腐切塊",
      "熱油鍋，蒜末爆香，蝦仁炒至變色盛起",
      "鍋中加水、醬油煮滾，放入豆腐煮 2 分鐘",
      "加回蝦仁，太白粉水勾薄芡",
      "撒蔥花即可"
    ]
  },
  {
    id: "shrimp-egg-pancake",
    name: "蝦仁烘蛋",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 150, unit: "克" },
      { name: "雞蛋", amount: 4, unit: "顆" }
    ],
    method: "煎",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "蝦仁去腸泥，雞蛋打散加鹽",
      "熱油鍋，蝦仁炒至半熟",
      "倒入蛋液，轉小火加蓋煎至底部金黃",
      "翻面續煎至兩面熟透即可"
    ]
  },

  // ── 空心菜 ──────────────────────────────
  {
    id: "water-spinach-garlic",
    name: "蒜炒空心菜",
    baseServings: 2,
    ingredients: [
      { name: "空心菜", amount: 300, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "空心菜洗淨切段，梗葉分開",
      "熱油鍋，蒜末爆香",
      "先下梗部拌炒，再加葉子快炒",
      "加鹽調味即可"
    ]
  },
  {
    id: "water-spinach-fermented-tofu",
    name: "腐乳空心菜",
    baseServings: 2,
    ingredients: [
      { name: "空心菜", amount: 300, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "空心菜洗淨切段",
      "豆腐乳用少許水調開備用",
      "熱油鍋，蒜末爆香",
      "空心菜下鍋大火快炒，倒入腐乳醬拌炒均勻即可"
    ]
  },
  {
    id: "water-spinach-salad",
    name: "涼拌空心菜",
    baseServings: 2,
    ingredients: [
      { name: "空心菜", amount: 250, unit: "克" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "空心菜切段，滾水汆燙 30 秒後冰鎮瀝乾",
      "醬油、蒜末、香油、糖調成醬汁",
      "空心菜拌入醬汁即可"
    ]
  },
  {
    id: "water-spinach-dried-shrimp",
    name: "開陽空心菜",
    baseServings: 2,
    ingredients: [
      { name: "空心菜", amount: 300, unit: "克" },
      { name: "蝦米", amount: 1, unit: "大匙" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "蝦米泡軟，空心菜切段",
      "熱油鍋，爆香蝦米、蒜末",
      "加入空心菜大火快炒",
      "加鹽調味即可"
    ]
  },
  {
    id: "water-spinach-beef",
    name: "空心菜炒牛肉",
    baseServings: 2,
    ingredients: [
      { name: "空心菜", amount: 250, unit: "克" },
      { name: "牛肉片", amount: 200, unit: "克" }
    ],
    method: "炒",
    cuisine: "泰式",
    diet: "葷",
    time: 8,
    bento: false,
    tags: ["健康", "高蛋白"],
    steps: [
      "牛肉片用醬油、太白粉抓醃，空心菜切段",
      "大火熱油鍋，牛肉片快炒至變色盛起",
      "鍋中蒜末、辣椒爆香，空心菜下鍋快炒",
      "加回牛肉拌炒，加蠔油調味即可"
    ]
  },

  // ── 地瓜葉 ──────────────────────────────
  {
    id: "sweet-potato-leaves-garlic",
    name: "蒜炒地瓜葉",
    baseServings: 2,
    ingredients: [
      { name: "地瓜葉", amount: 300, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "地瓜葉洗淨摘取嫩葉嫩莖",
      "熱油鍋，蒜末爆香",
      "地瓜葉下鍋大火快炒",
      "加鹽調味即可"
    ]
  },
  {
    id: "sweet-potato-leaves-dried-fish",
    name: "小魚乾炒地瓜葉",
    baseServings: 2,
    ingredients: [
      { name: "地瓜葉", amount: 300, unit: "克" },
      { name: "小魚乾", amount: 20, unit: "克" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "小魚乾泡水稍軟，地瓜葉摘取嫩葉嫩莖",
      "熱油鍋，爆香小魚乾、蒜末",
      "加入地瓜葉大火快炒",
      "加鹽調味即可"
    ]
  },
  {
    id: "sweet-potato-leaves-salad",
    name: "涼拌地瓜葉",
    baseServings: 2,
    ingredients: [
      { name: "地瓜葉", amount: 250, unit: "克" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "地瓜葉滾水汆燙 1 分鐘後冰鎮瀝乾",
      "醬油、蒜末、香油調成醬汁",
      "地瓜葉拌入醬汁即可"
    ]
  },
  {
    id: "sweet-potato-leaves-miso-soup",
    name: "地瓜葉味噌湯",
    baseServings: 2,
    ingredients: [
      { name: "地瓜葉", amount: 150, unit: "克" }
    ],
    method: "煮",
    cuisine: "日式",
    diet: "素",
    time: 5,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "地瓜葉洗淨切段",
      "水煮滾，放入地瓜葉煮軟",
      "轉小火，取一勺熱湯調開味噌",
      "倒回鍋中拌勻即可"
    ]
  },
  {
    id: "sweet-potato-leaves-dried-shrimp",
    name: "開陽地瓜葉",
    baseServings: 2,
    ingredients: [
      { name: "地瓜葉", amount: 300, unit: "克" },
      { name: "蝦米", amount: 1, unit: "大匙" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "多纖維"],
    steps: [
      "蝦米泡軟，地瓜葉摘取嫩葉嫩莖",
      "熱油鍋，爆香蝦米、蒜末",
      "加入地瓜葉大火快炒",
      "加鹽調味即可"
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { RECIPES, PANTRY_STAPLES };
}
