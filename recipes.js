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
 *   - bento ：隔天便當 OK。Bryant 2026-09-16 定的原則：
 *             ・葉菜快炒 → true（便當要有足夠蔬菜量與種類才均衡；只有便當取向的新食譜才挑蒸過／微波過不易變色的青菜，現煮現吃的不限）
 *             ・涼拌菜 → true（便當分開放就好，生菜涼拌也算）
 *             ・湯品 → false
 *             ・茶碗蒸、溏心蛋（整顆不切）、蒸魚 → true；韭菜炒蛋、涼拌皮蛋豆腐 → false（他不喜歡帶便當）
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
    bento: true,
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
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "雞蛋放入滾水中煮 6.5 分鐘，撈起冰鎮剝殼",
      "醬油、味醂、水以 1:1:1 混合煮滾放涼",
      "雞蛋放入醬汁中冷藏浸泡至少 4 小時",
      "取出即可（現吃可對切；帶便當整顆放，不要切開）"
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
      { name: "杏鮑菇", amount: 2, unit: "根" },
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
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
    bento: true,
    tags: ["健康", "多纖維"],
    steps: [
      "蝦米泡軟，地瓜葉摘取嫩葉嫩莖",
      "熱油鍋，爆香蝦米、蒜末",
      "加入地瓜葉大火快炒",
      "加鹽調味即可"
    ]
  },
  // ══════════════════════════════════════════════════
  // 第一批（2026-09-16）：週末備料型 —— 一次做一鍋，分裝 3 天便當
  // ══════════════════════════════════════════════════

  // ── 滷 ──────────────────────────────
  {
    id: "ribs-braised-radish",
    name: "白蘿蔔滷排骨",
    baseServings: 4,
    ingredients: [
      { name: "排骨", amount: 600, unit: "克" },
      { name: "白蘿蔔", amount: 1, unit: "條" }
    ],
    method: "滷",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "排骨冷水下鍋汆燙去血水，撈起沖淨；白蘿蔔去皮切大塊",
      "熱少許油爆香薑片、蔥段，下排骨略炒",
      "加醬油 4 大匙、米酒 2 大匙、糖 1 小匙、水蓋過食材",
      "煮滾後放白蘿蔔，蓋鍋小火滷 40 分鐘（電鍋外鍋 1.5 杯水亦可）",
      "放涼分裝，冷藏可放 3 天，隔夜更入味"
    ]
  },
  {
    id: "wings-soy-braised",
    name: "醬滷雞翅滷蛋",
    baseServings: 4,
    ingredients: [
      { name: "雞翅", amount: 8, unit: "支" },
      { name: "雞蛋", amount: 4, unit: "顆" }
    ],
    method: "滷",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "雞蛋水煮 8 分鐘剝殼；雞翅擦乾，熱鍋少油煎至兩面上色",
      "加蒜頭、薑片、醬油 4 大匙、米酒 2 大匙、糖 1 小匙、水 1.5 杯",
      "放入水煮蛋，煮滾後蓋鍋小火滷 20 分鐘",
      "開蓋轉中火收汁至濃稠",
      "放涼分裝，便當時雞翅、滷蛋各一份"
    ]
  },
  {
    id: "doufugan-braised-egg",
    name: "豆干滷蛋",
    baseServings: 4,
    ingredients: [
      { name: "豆干", amount: 6, unit: "片" },
      { name: "雞蛋", amount: 4, unit: "顆" }
    ],
    method: "滷",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "雞蛋水煮 8 分鐘剝殼；豆干對切成三角",
      "鍋中放醬油 4 大匙、糖 1 大匙、八角 1 顆、蒜頭、蔥段、水 2 杯煮滾",
      "放入豆干、水煮蛋，小火滷 25 分鐘",
      "熄火浸泡 30 分鐘以上更入味",
      "豆干切片、滷蛋對切，分裝進便當"
    ]
  },
  {
    id: "mushroom-minced-pork-sauce",
    name: "香菇肉燥",
    baseServings: 4,
    ingredients: [
      { name: "豬絞肉", amount: 400, unit: "克" },
      { name: "乾香菇", amount: 6, unit: "朵" },
      { name: "油豆腐", amount: 8, unit: "塊" }
    ],
    method: "滷",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "乾香菇泡軟切丁，香菇水留著；油豆腐對切",
      "熱鍋少油，豬絞肉炒散至出油上色，下紅蔥頭（或蒜末）、香菇丁炒香",
      "加醬油 4 大匙、米酒 2 大匙、糖 1 大匙、五香粉少許，炒出醬香",
      "加香菇水＋清水共 2 杯，放油豆腐，煮滾後小火滷 30 分鐘",
      "分裝冷藏；便當淋飯、拌麵、配燙青菜都可以"
    ]
  },
  {
    id: "chicken-thigh-rice-cooker-braised",
    name: "電鍋香菇滷雞腿",
    baseServings: 4,
    ingredients: [
      { name: "雞腿肉", amount: 500, unit: "克" },
      { name: "乾香菇", amount: 4, unit: "朵" },
      { name: "白蘿蔔", amount: 1, unit: "條" }
    ],
    method: "滷",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    tool: "電鍋",
    prep: "weekend",
    steps: [
      "雞腿肉切大塊；乾香菇泡軟；白蘿蔔去皮切塊",
      "全部放入電鍋內鍋，加薑片、醬油 3 大匙、米酒 1 大匙、糖 1 小匙、水 1 杯",
      "外鍋 1.5 杯水，按下開關，跳起後燜 15 分鐘",
      "開蓋翻拌讓上下入味均勻",
      "分裝冷藏；雞腿不會柴，重熱也好吃"
    ]
  },

  // ── 燒／燉 ──────────────────────────────
  {
    id: "pork-belly-red-braised",
    name: "紅燒五花肉",
    baseServings: 4,
    ingredients: [
      { name: "豬五花", amount: 600, unit: "克" },
      { name: "雞蛋", amount: 4, unit: "顆" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "葷",
    time: 12,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "五花肉切 3 公分塊，冷水下鍋汆燙撈起；雞蛋水煮 8 分鐘剝殼",
      "熱鍋少油，五花肉煎至四面上色、逼出多餘油脂倒掉",
      "下蒜頭、薑片、蔥段炒香，加醬油 4 大匙、米酒 3 大匙、糖 1 大匙炒勻",
      "加水蓋過肉，放入水煮蛋，煮滾後蓋鍋小火燒 50 分鐘",
      "開蓋收汁至濃稠；放涼冷藏後可先撇掉表面凝固的油再帶便當"
    ]
  },
  {
    id: "beef-brisket-radish-stew",
    name: "蘿蔔燉牛肋條",
    baseServings: 4,
    ingredients: [
      { name: "牛肋條", amount: 600, unit: "克" },
      { name: "白蘿蔔", amount: 1, unit: "條" },
      { name: "紅蘿蔔", amount: 1, unit: "條" }
    ],
    method: "燉",
    cuisine: "中式",
    diet: "葷",
    time: 12,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "牛肋條切塊汆燙去血水；白蘿蔔、紅蘿蔔去皮切滾刀塊",
      "熱鍋少油爆香薑片、蔥段，下牛肉略炒",
      "加醬油 3 大匙、米酒 2 大匙、水蓋過食材，煮滾後小火燉 60 分鐘",
      "放入白蘿蔔、紅蘿蔔續燉 20 分鐘至軟",
      "加鹽調味；分裝冷藏，牛肉隔夜更軟"
    ]
  },
  {
    id: "chicken-pumpkin-stew",
    name: "南瓜燉雞",
    baseServings: 4,
    ingredients: [
      { name: "雞腿肉", amount: 500, unit: "克" },
      { name: "南瓜", amount: 400, unit: "克" },
      { name: "洋蔥", amount: 1, unit: "顆" }
    ],
    method: "燉",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "雞腿肉切塊，鹽、米酒抓醃；南瓜帶皮切塊；洋蔥切絲",
      "熱鍋少油，雞皮面朝下煎至上色，下洋蔥炒軟",
      "加南瓜、醬油 2 大匙、水 1 杯，煮滾後蓋鍋小火燉 15 分鐘",
      "南瓜軟了但還成塊時熄火，加鹽、黑胡椒調味",
      "分裝冷藏；南瓜重熱不出水，很適合便當"
    ]
  },
  {
    id: "beef-tomato-ragu",
    name: "義式番茄肉醬",
    baseServings: 4,
    ingredients: [
      { name: "牛絞肉", amount: 400, unit: "克" },
      { name: "番茄", amount: 4, unit: "顆" },
      { name: "洋蔥", amount: 1, unit: "顆" }
    ],
    method: "燉",
    cuisine: "西式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "番茄切丁，洋蔥切碎",
      "熱鍋 1 大匙油，洋蔥炒軟，下牛絞肉炒散至上色",
      "加番茄丁、鹽、黑胡椒、少許糖，煮滾後小火燉 25 分鐘至濃稠",
      "有義式香料或番茄糊可加，沒有也可以",
      "分裝冷藏；配義大利麵、拌飯、夾吐司都行"
    ]
  },
  {
    id: "napa-cabbage-braised",
    name: "白菜滷",
    baseServings: 4,
    ingredients: [
      { name: "大白菜", amount: 600, unit: "克" },
      { name: "乾香菇", amount: 4, unit: "朵" },
      { name: "蝦米", amount: 2, unit: "大匙" },
      { name: "豆皮", amount: 2, unit: "片" }
    ],
    method: "燒",
    cuisine: "中式",
    diet: "葷",
    time: 12,
    bento: true,
    tags: ["健康", "多纖維", "一鍋"],
    prep: "weekend",
    steps: [
      "大白菜切大片；乾香菇泡軟切絲；蝦米泡軟；豆皮切段",
      "熱鍋 1 大匙油，爆香蝦米、香菇絲、蒜末",
      "下白菜梗先炒軟，再加葉子，加醬油 2 大匙、香菇水 1 杯",
      "放豆皮，蓋鍋小火燒 20 分鐘至白菜軟爛",
      "加鹽、白胡椒調味，喜歡可勾薄芡；分裝冷藏"
    ]
  },
  {
    id: "mackerel-miso-simmered",
    name: "味噌煮鯖魚",
    baseServings: 4,
    ingredients: [
      { name: "鯖魚", amount: 2, unit: "片" }
    ],
    method: "燒",
    cuisine: "日式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "鯖魚切段（若用鹽漬鯖魚，醬汁鹽量減半）",
      "鍋中放味噌 2 大匙、味醂 2 大匙、醬油 1 大匙、糖 1 小匙、薑絲、水 1 杯煮滾",
      "魚皮朝上放入，蓋上鋁箔紙（落蓋）小火煮 12 分鐘",
      "開蓋，湯匙舀醬汁淋魚身，收汁至濃稠",
      "分裝冷藏；冷了也好吃，帶便當不用重熱"
    ]
  },

  // ── 烤箱／氣炸鍋 ──────────────────────────────
  {
    id: "wings-honey-soy-roasted",
    name: "蜂蜜醬油烤雞翅",
    baseServings: 4,
    ingredients: [
      { name: "雞翅", amount: 8, unit: "支" }
    ],
    method: "烤",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "烤箱",
    prep: "weekend",
    steps: [
      "雞翅擦乾，用醬油 2 大匙、蜂蜜 1 大匙、蒜末、米酒 1 大匙醃 30 分鐘以上（隔夜更好）",
      "烤箱預熱 200°C，雞翅排在鋪鋁箔的烤盤上",
      "烤 20 分鐘，翻面刷剩餘醃醬再烤 5 分鐘至上色",
      "放涼分裝，冷的也好吃"
    ]
  },
  {
    id: "ribs-garlic-roasted",
    name: "蒜香烤排骨",
    baseServings: 4,
    ingredients: [
      { name: "排骨", amount: 600, unit: "克" }
    ],
    method: "烤",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "烤箱",
    prep: "weekend",
    steps: [
      "排骨用醬油 3 大匙、蒜末 1 大匙、米酒 1 大匙、糖 1 小匙、黑胡椒醃 1 小時以上",
      "烤箱預熱 200°C，排骨平鋪烤盤",
      "烤 25 分鐘，翻面再烤 10 分鐘至表面焦香",
      "放涼分裝；便當重熱前噴一點水就不會乾"
    ]
  },
  {
    id: "roasted-vegetable-tray",
    name: "烤箱烤蔬菜盤",
    baseServings: 4,
    ingredients: [
      { name: "南瓜", amount: 300, unit: "克" },
      { name: "甜椒", amount: 2, unit: "顆" },
      { name: "鴻喜菇", amount: 1, unit: "包" }
    ],
    method: "烤",
    cuisine: "西式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["健康", "多纖維"],
    tool: "烤箱",
    prep: "weekend",
    steps: [
      "南瓜帶皮切 1 公分厚片；甜椒切塊；鴻喜菇剝散",
      "全部用 1 大匙油、鹽、黑胡椒、蒜末拌勻，平鋪烤盤",
      "烤箱 200°C 烤 20 分鐘，中途翻一次",
      "分裝冷藏；三天份的便當配菜一次搞定，重熱不變色"
    ]
  },
  {
    id: "pork-belly-air-fried",
    name: "氣炸脆皮五花",
    baseServings: 4,
    ingredients: [
      { name: "豬五花", amount: 500, unit: "克" }
    ],
    method: "烤",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "氣炸鍋",
    prep: "weekend",
    steps: [
      "五花肉整條，用鹽、五香粉、蒜末抹勻醃 30 分鐘，皮面擦乾",
      "氣炸鍋 180°C 炸 15 分鐘，翻面",
      "轉 200°C 再炸 10 分鐘至皮酥",
      "放涼切片分裝；便當重熱 1 分鐘就好，不要熱太久"
    ]
  },

  // ── 便當常備小菜 ──────────────────────────────
  {
    id: "edamame-doufugan-stir",
    name: "毛豆炒豆干",
    baseServings: 4,
    ingredients: [
      { name: "毛豆", amount: 200, unit: "克" },
      { name: "豆干", amount: 5, unit: "片" },
      { name: "紅蘿蔔", amount: 1, unit: "條" }
    ],
    method: "炒",
    cuisine: "中式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白", "多纖維"],
    prep: "weekend",
    steps: [
      "毛豆仁滾水燙 3 分鐘撈起；豆干、紅蘿蔔切小丁",
      "熱鍋 1 大匙油，豆干丁煎至微黃",
      "加紅蘿蔔丁炒軟，再下毛豆",
      "加醬油 1 大匙、鹽、白胡椒拌炒均勻",
      "分裝冷藏，可放 3 天；冷熱都好吃"
    ]
  },
  {
    id: "edamame-garlic-salad",
    name: "蒜香涼拌毛豆",
    baseServings: 4,
    ingredients: [
      { name: "毛豆", amount: 300, unit: "克" }
    ],
    method: "涼拌",
    cuisine: "中式",
    diet: "素",
    time: 5,
    bento: true,
    tags: ["健康", "高蛋白"],
    prep: "weekend",
    steps: [
      "毛豆仁滾水加鹽燙 4 分鐘，撈起冰鎮瀝乾",
      "蒜末、醬油 1 大匙、香油 1 小匙、辣椒（可省）拌勻",
      "毛豆拌入醬汁，冷藏 30 分鐘入味",
      "分裝，便當分開放一格"
    ]
  },
  // ══════════════════════════════════════════════════
  // 第二批（2026-09-16）：平日快煮型 —— 湯／蒸／燴／炸＋海鮮
  // ══════════════════════════════════════════════════

  // ── 湯（現煮現喝，不進便當）──────────────────────────────
  {
    id: "clam-loofah-soup",
    name: "蛤蜊絲瓜湯",
    baseServings: 2,
    ingredients: [
      { name: "蛤蜊", amount: 300, unit: "克" },
      { name: "絲瓜", amount: 1, unit: "條" }
    ],
    method: "湯",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "蛤蜊泡鹽水吐沙 30 分鐘；絲瓜去皮切滾刀塊",
      "水 3 杯加薑絲煮滾，放絲瓜煮 2 分鐘",
      "下蛤蜊，開口即熄火（煮久肉會縮）",
      "加鹽、米酒少許調味即可"
    ]
  },
  {
    id: "bitter-melon-rib-soup",
    name: "苦瓜排骨湯",
    baseServings: 2,
    ingredients: [
      { name: "排骨", amount: 300, unit: "克" },
      { name: "苦瓜", amount: 1, unit: "條" }
    ],
    method: "湯",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: false,
    tags: ["健康", "高蛋白", "一鍋"],
    steps: [
      "排骨冷水下鍋汆燙撈起沖淨；苦瓜去籽切塊",
      "排骨加水 5 杯、薑片，煮滾後小火燉 30 分鐘",
      "放苦瓜續煮 15 分鐘至軟",
      "加鹽調味；喜歡可放幾顆蛤蜊或小魚乾提鮮"
    ]
  },
  {
    id: "enoki-egg-tofu-soup",
    name: "金針菇雞蛋豆腐湯",
    baseServings: 2,
    ingredients: [
      { name: "金針菇", amount: 1, unit: "包" },
      { name: "雞蛋豆腐", amount: 1, unit: "盒" },
      { name: "雞蛋", amount: 1, unit: "顆" }
    ],
    method: "湯",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "高蛋白", "一鍋"],
    steps: [
      "金針菇去根剝散；雞蛋豆腐切塊；雞蛋打散",
      "水 3 杯煮滾，放金針菇煮 1 分鐘",
      "放雞蛋豆腐，加鹽、白胡椒調味",
      "淋入蛋液成蛋花，滴幾滴香油即可"
    ]
  },
  {
    id: "corn-egg-drop-soup",
    name: "玉米蛋花湯",
    baseServings: 2,
    ingredients: [
      { name: "玉米粒", amount: 1, unit: "杯" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "湯",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "雞蛋打散",
      "水 3 杯煮滾，放玉米粒煮 2 分鐘",
      "加鹽、白胡椒，太白粉水勾薄芡",
      "淋入蛋液攪成蛋花，撒蔥花即可"
    ]
  },
  {
    id: "celery-fish-soup",
    name: "芹菜魚片湯",
    baseServings: 2,
    ingredients: [
      { name: "魚片", amount: 200, unit: "克" },
      { name: "芹菜", amount: 2, unit: "根" }
    ],
    method: "湯",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "高蛋白", "一鍋"],
    steps: [
      "魚片切塊，用鹽、米酒、少許太白粉抓醃；芹菜切末",
      "水 3 杯加薑絲煮滾",
      "放魚片，轉小火煮 2 分鐘至熟（不要翻攪）",
      "加鹽、白胡椒，撒芹菜末、滴香油即可"
    ]
  },
  {
    id: "salmon-miso-soup",
    name: "鮭魚味噌湯",
    baseServings: 2,
    ingredients: [
      { name: "鮭魚", amount: 150, unit: "克" },
      { name: "嫩豆腐", amount: 1, unit: "盒" },
      { name: "海帶芽", amount: 1, unit: "大匙" }
    ],
    method: "湯",
    cuisine: "日式",
    diet: "葷",
    time: 6,
    bento: false,
    tags: ["健康", "高蛋白", "一鍋"],
    steps: [
      "鮭魚切塊（可用煎鮭魚剩的邊角）；豆腐切丁",
      "水 3 杯煮滾，放鮭魚煮 3 分鐘",
      "放豆腐、海帶芽煮 1 分鐘",
      "轉小火，取一勺熱湯調開味噌 1.5 大匙倒回鍋中，撒蔥花即可"
    ]
  },
  {
    id: "hot-sour-soup",
    name: "酸辣湯",
    baseServings: 2,
    ingredients: [
      { name: "黑木耳", amount: 3, unit: "朵" },
      { name: "嫩豆腐", amount: 1, unit: "盒" },
      { name: "紅蘿蔔", amount: 1, unit: "條" },
      { name: "雞蛋", amount: 1, unit: "顆" }
    ],
    method: "湯",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: false,
    tags: ["健康", "一鍋"],
    steps: [
      "黑木耳、紅蘿蔔切絲；豆腐切條；雞蛋打散",
      "水 3 杯煮滾，放木耳、紅蘿蔔煮 3 分鐘",
      "放豆腐，加醬油 1 大匙、鹽調味，太白粉水勾芡",
      "淋入蛋液成蛋花，熄火",
      "加烏醋 2 大匙、白胡椒粉 1 小匙（酸辣味在這一步，起鍋才加）"
    ]
  },
  {
    id: "beef-udon-soup",
    name: "牛肉烏龍麵",
    baseServings: 2,
    ingredients: [
      { name: "烏龍麵", amount: 2, unit: "包" },
      { name: "牛肉片", amount: 200, unit: "克" },
      { name: "洋蔥", amount: 1, unit: "顆" }
    ],
    method: "湯",
    cuisine: "日式",
    diet: "葷",
    time: 8,
    bento: false,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "洋蔥切絲",
      "水 3 杯、醬油 2 大匙、味醂 2 大匙、糖 1 小匙煮滾，放洋蔥煮軟",
      "放烏龍麵煮 2 分鐘鬆開",
      "牛肉片一片片下鍋，變色即熄火",
      "撒蔥花、七味粉即可"
    ]
  },

  // ── 蒸（電鍋按下去等）──────────────────────────────
  {
    id: "cod-steamed",
    name: "清蒸鱈魚",
    baseServings: 2,
    ingredients: [
      { name: "鱈魚", amount: 1, unit: "片" }
    ],
    method: "蒸",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["健康", "高蛋白"],
    tool: "電鍋",
    steps: [
      "鱈魚擦乾，兩面抹少許鹽、米酒，鋪薑絲",
      "電鍋外鍋 1 杯水，蒸 10 分鐘至魚肉可撥開",
      "倒掉盤中蒸出的水，淋醬油 1 大匙",
      "鋪蔥絲，燒 1 大匙熱油淋上即可"
    ]
  },
  {
    id: "egg-tofu-minced-pork-steamed",
    name: "肉末蒸雞蛋豆腐",
    baseServings: 2,
    ingredients: [
      { name: "雞蛋豆腐", amount: 1, unit: "盒" },
      { name: "豬絞肉", amount: 100, unit: "克" }
    ],
    method: "蒸",
    cuisine: "中式",
    diet: "葷",
    time: 6,
    bento: true,
    tags: ["高蛋白"],
    tool: "電鍋",
    steps: [
      "雞蛋豆腐切厚片排盤",
      "豬絞肉加醬油 1 大匙、米酒、太白粉、蒜末拌勻，鋪在豆腐上",
      "電鍋外鍋 1 杯水，蒸 12 分鐘",
      "撒蔥花，淋一點醬油即可"
    ]
  },
  {
    id: "clam-steamed-egg",
    name: "蛤蜊蒸蛋",
    baseServings: 2,
    ingredients: [
      { name: "蛤蜊", amount: 200, unit: "克" },
      { name: "雞蛋", amount: 3, unit: "顆" }
    ],
    method: "蒸",
    cuisine: "中式",
    diet: "葷",
    time: 5,
    bento: true,
    tags: ["高蛋白"],
    tool: "電鍋",
    steps: [
      "蛤蜊泡鹽水吐沙；雞蛋打散，加 1.5 倍溫水、少許鹽，過篩",
      "蛤蜊排在深盤中，倒入蛋液",
      "蓋保鮮膜或盤子，電鍋外鍋 1 杯水，蒸至蛋液凝固、蛤蜊開口（約 12 分鐘）",
      "撒蔥花、滴香油即可"
    ]
  },
  {
    id: "chicken-mushroom-steamed",
    name: "香菇木耳蒸雞",
    baseServings: 2,
    ingredients: [
      { name: "雞腿肉", amount: 300, unit: "克" },
      { name: "香菇", amount: 3, unit: "朵" },
      { name: "黑木耳", amount: 2, unit: "朵" }
    ],
    method: "蒸",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白", "一鍋"],
    tool: "電鍋",
    steps: [
      "雞腿肉切塊，用醬油 1 大匙、米酒 1 大匙、太白粉、薑絲抓醃 10 分鐘",
      "香菇切片、木耳撕小片，跟雞肉拌勻鋪盤",
      "電鍋外鍋 1 杯水，蒸 15 分鐘",
      "撒蔥花即可；盤底湯汁拌飯很香"
    ]
  },

  // ── 燴（勾芡淋飯）──────────────────────────────
  {
    id: "mixed-veg-egg-rice-bowl",
    name: "三色豆滑蛋燴飯",
    baseServings: 2,
    ingredients: [
      { name: "冷凍三色豆", amount: 1, unit: "杯" },
      { name: "雞蛋", amount: 3, unit: "顆" },
      { name: "白飯", amount: 2, unit: "碗" }
    ],
    method: "燴",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["高蛋白", "一鍋"],
    steps: [
      "三色豆免解凍；雞蛋打散加少許鹽",
      "熱鍋 1 大匙油，蛋液炒至半熟盛起",
      "同鍋放三色豆，加水 1 杯、醬油 1 大匙、鹽煮滾，太白粉水勾芡",
      "倒回滑蛋輕拌，淋在白飯上即可"
    ]
  },
  {
    id: "cod-tomato-braised",
    name: "番茄燴鱈魚",
    baseServings: 2,
    ingredients: [
      { name: "鱈魚", amount: 1, unit: "片" },
      { name: "番茄", amount: 2, unit: "顆" }
    ],
    method: "燴",
    cuisine: "中式",
    diet: "葷",
    time: 8,
    bento: true,
    tags: ["健康", "高蛋白"],
    steps: [
      "鱈魚擦乾拍薄薄太白粉；番茄切丁",
      "熱鍋 1 大匙油，鱈魚煎至兩面微黃盛起",
      "同鍋下蒜末、番茄丁炒出汁，加水半杯、醬油 1 大匙、糖少許",
      "放回鱈魚小火燴 3 分鐘，湯汁收濃即可"
    ]
  },
  {
    id: "enoki-tofu-braised",
    name: "金針菇燴豆腐",
    baseServings: 2,
    ingredients: [
      { name: "金針菇", amount: 1, unit: "包" },
      { name: "嫩豆腐", amount: 1, unit: "盒" }
    ],
    method: "燴",
    cuisine: "中式",
    diet: "素",
    time: 8,
    bento: true,
    tags: ["健康", "一鍋"],
    steps: [
      "金針菇去根剝散；豆腐切塊",
      "熱鍋 1 大匙油，蒜末爆香，下金針菇炒軟",
      "加水半杯、醬油 1 大匙、蠔油（素蠔油）1 小匙煮滾",
      "放豆腐煮 2 分鐘，太白粉水勾芡，撒蔥花即可"
    ]
  },

  // ── 炸 ──────────────────────────────
  {
    id: "squid-crispy-fried",
    name: "香酥炸透抽",
    baseServings: 2,
    ingredients: [
      { name: "透抽", amount: 300, unit: "克" }
    ],
    method: "炸",
    cuisine: "中式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "透抽去內臟切圈，擦乾，用鹽、米酒、蒜末醃 5 分鐘",
      "均勻沾裹地瓜粉（或太白粉），靜置 2 分鐘回潮",
      "油燒到 170°C（筷子插入冒小泡），下鍋炸 2 分鐘至金黃酥脆",
      "撒胡椒鹽、九層塔（有就加）即可"
    ]
  },
  {
    id: "chicken-karaage",
    name: "日式唐揚炸雞",
    baseServings: 2,
    ingredients: [
      { name: "雞腿肉", amount: 300, unit: "克" }
    ],
    method: "炸",
    cuisine: "日式",
    diet: "葷",
    time: 10,
    bento: true,
    tags: ["高蛋白"],
    steps: [
      "雞腿肉切一口大小，用醬油 1.5 大匙、米酒 1 大匙、薑泥、蒜泥醃 15 分鐘",
      "沾裹太白粉，抖掉多餘的粉",
      "油 170°C 炸 3 分鐘撈起，靜置 2 分鐘",
      "油升溫至 190°C 回炸 1 分鐘逼油、更酥",
      "擠檸檬汁；便當菜的經典，冷了也好吃"
    ]
  },
  // ══════════════════════════════════════════════════
  // 第三批（2026-09-16）：平日快煮型 —— 新葉菜（A菜、芥藍）、培根／香腸、麵／年糕／吐司
  // ══════════════════════════════════════════════════

  // ── A菜（現煮現吃）──────────────────────────────
  {
    id: "a-choy-garlic",
    name: "蒜炒A菜",
    baseServings: 2,
    ingredients: [{ name: "A菜", amount: 300, unit: "克" }],
    method: "炒", cuisine: "中式", diet: "素",
    time: 5, bento: false, tags: ["健康", "多纖維"],
    steps: [
      "A菜洗淨切段，梗葉分開",
      "熱鍋 1 大匙油，蒜末爆香",
      "先下梗炒 30 秒，再下葉大火快炒至軟",
      "加鹽調味即可，A菜易出水，起鍋要快"
    ]
  },
  {
    id: "a-choy-shimeji",
    name: "鴻喜菇炒A菜",
    baseServings: 2,
    ingredients: [
      { name: "A菜", amount: 250, unit: "克" },
      { name: "鴻喜菇", amount: 1, unit: "包" }
    ],
    method: "炒", cuisine: "中式", diet: "素",
    time: 6, bento: false, tags: ["健康", "多纖維"],
    steps: [
      "A菜切段；鴻喜菇剝散",
      "熱鍋 1 大匙油，蒜末爆香，下鴻喜菇炒至微軟出香",
      "加A菜大火快炒",
      "加鹽、少許醬油調味即可"
    ]
  },
  {
    id: "a-choy-sausage",
    name: "香腸炒A菜",
    baseServings: 2,
    ingredients: [
      { name: "香腸", amount: 2, unit: "條" },
      { name: "A菜", amount: 250, unit: "克" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 6, bento: false, tags: ["多纖維"],
    steps: [
      "香腸斜切薄片；A菜切段",
      "冷鍋下香腸片，小火煎至出油微焦",
      "下蒜末、A菜轉大火快炒",
      "加少許鹽即可（香腸已有鹹味）"
    ]
  },

  // ── 芥藍（便當友善：蒸過重熱不變色）──────────────────────────────
  {
    id: "gai-lan-oyster-sauce",
    name: "蠔油芥藍",
    baseServings: 2,
    ingredients: [{ name: "芥藍", amount: 300, unit: "克" }],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 6, bento: true, tags: ["健康", "多纖維"],
    steps: [
      "芥藍去老梗，梗厚的對剖",
      "滾水加少許油、鹽，芥藍燙 1 分鐘撈起",
      "熱鍋 1 小匙油，蒜末、薑絲爆香，下芥藍快炒",
      "加蠔油 1 大匙、少許水拌勻即可"
    ]
  },
  {
    id: "gai-lan-beef",
    name: "芥藍炒牛肉",
    baseServings: 2,
    ingredients: [
      { name: "芥藍", amount: 250, unit: "克" },
      { name: "牛肉片", amount: 200, unit: "克" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 8, bento: true, tags: ["健康", "高蛋白", "多纖維"],
    steps: [
      "牛肉片用醬油、太白粉、米酒抓醃；芥藍切段",
      "大火熱鍋 1 大匙油，牛肉快炒至變色盛起",
      "同鍋蒜末爆香，下芥藍炒 2 分鐘",
      "加回牛肉，加蠔油 1 大匙拌炒均勻即可"
    ]
  },
  {
    id: "gai-lan-squid-celery",
    name: "芹菜芥藍炒透抽",
    baseServings: 2,
    ingredients: [
      { name: "透抽", amount: 250, unit: "克" },
      { name: "芥藍", amount: 200, unit: "克" },
      { name: "芹菜", amount: 2, unit: "根" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 8, bento: true, tags: ["健康", "高蛋白", "多纖維"],
    steps: [
      "透抽切圈或切花；芥藍、芹菜切段",
      "透抽滾水燙 20 秒撈起（先燙再炒才不會出水變老）",
      "熱鍋 1 大匙油，蒜末、薑絲爆香，下芥藍、芹菜炒 1 分鐘",
      "加回透抽，加醬油 1 大匙、米酒 1 大匙、白胡椒大火快炒即可"
    ]
  },

  // ── 培根 ──────────────────────────────
  {
    id: "bacon-baby-corn",
    name: "培根炒玉米筍",
    baseServings: 2,
    ingredients: [
      { name: "培根", amount: 3, unit: "片" },
      { name: "玉米筍", amount: 8, unit: "根" },
      { name: "甜椒", amount: 1, unit: "顆" }
    ],
    method: "炒", cuisine: "西式", diet: "葷",
    time: 6, bento: true, tags: ["多纖維"],
    steps: [
      "培根切段；玉米筍對剖；甜椒切條",
      "冷鍋下培根，小火煎至出油微焦",
      "下玉米筍、甜椒轉中火炒 2 分鐘",
      "加黑胡椒、少許鹽即可"
    ]
  },
  {
    id: "bacon-egg-toast",
    name: "培根蛋吐司",
    baseServings: 2,
    ingredients: [
      { name: "吐司", amount: 4, unit: "片" },
      { name: "培根", amount: 2, unit: "片" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "煎", cuisine: "西式", diet: "葷",
    time: 6, bento: false, tags: ["高蛋白"],
    steps: [
      "吐司烤或乾煎至微焦",
      "培根煎至微焦盛起，用鍋中培根油煎蛋（喜歡半熟或全熟自己決定）",
      "吐司夾培根、蛋，撒黑胡椒",
      "有生菜、番茄片就夾進去"
    ]
  },
  {
    id: "bacon-cabbage-pasta",
    name: "培根高麗菜義大利麵",
    baseServings: 2,
    ingredients: [
      { name: "義大利麵", amount: 180, unit: "克" },
      { name: "培根", amount: 3, unit: "片" },
      { name: "高麗菜", amount: 200, unit: "克" }
    ],
    method: "煮", cuisine: "西式", diet: "葷",
    time: 10, bento: true, tags: ["多纖維"],
    steps: [
      "義大利麵依包裝時間煮，留半碗煮麵水；培根切段；高麗菜切片",
      "冷鍋下培根煎至出油，下蒜末炒香",
      "加高麗菜炒軟，加煮麵水半碗",
      "拌入義大利麵，加鹽、黑胡椒拌勻即可"
    ]
  },

  // ── 香腸 ──────────────────────────────
  {
    id: "sausage-mixed-veg",
    name: "香腸炒三色豆",
    baseServings: 2,
    ingredients: [
      { name: "香腸", amount: 2, unit: "條" },
      { name: "冷凍三色豆", amount: 1, unit: "杯" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 6, bento: true, tags: ["一鍋"],
    steps: [
      "香腸切丁；三色豆免解凍",
      "冷鍋下香腸丁，小火煎至出油",
      "下三色豆轉中火炒 3 分鐘",
      "加黑胡椒、少許醬油即可，便當配菜零前處理"
    ]
  },
  {
    id: "sausage-fried-rice",
    name: "香腸蛋炒飯",
    baseServings: 2,
    ingredients: [
      { name: "白飯", amount: 2, unit: "碗" },
      { name: "香腸", amount: 2, unit: "條" },
      { name: "雞蛋", amount: 2, unit: "顆" },
      { name: "冷凍三色豆", amount: 0.5, unit: "杯" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 8, bento: true, tags: ["一鍋"],
    steps: [
      "香腸切丁；雞蛋打散；白飯打散（隔夜飯較佳）",
      "冷鍋下香腸丁煎至出油，下蛋液炒散",
      "加白飯、三色豆大火拌炒至粒粒分明",
      "加鹽、白胡椒、蔥花拌勻即可"
    ]
  },

  // ── 麵條 ──────────────────────────────
  {
    id: "noodle-chive-sprout-stir",
    name: "韭菜豆芽炒麵",
    baseServings: 2,
    ingredients: [
      { name: "麵條", amount: 200, unit: "克" },
      { name: "豆芽菜", amount: 150, unit: "克" },
      { name: "韭菜", amount: 1, unit: "把" }
    ],
    method: "炒", cuisine: "中式", diet: "素",
    time: 8, bento: true, tags: ["多纖維", "一鍋"],
    steps: [
      "麵條煮至八分熟撈起瀝乾（油麵可免煮）；韭菜切段",
      "熱鍋 1 大匙油，蒜末爆香，下豆芽炒 30 秒",
      "加麵條、醬油 2 大匙、烏醋 1 小匙、白胡椒拌炒",
      "起鍋前加韭菜拌兩下即可"
    ]
  },
  {
    id: "noodle-sesame-cold",
    name: "麻醬涼麵",
    baseServings: 2,
    ingredients: [
      { name: "麵條", amount: 200, unit: "克" },
      { name: "小黃瓜", amount: 1, unit: "條" },
      { name: "雞胸肉", amount: 150, unit: "克" }
    ],
    method: "涼拌", cuisine: "中式", diet: "葷",
    time: 8, bento: true, tags: ["高蛋白"],
    steps: [
      "麵條煮熟，沖冷水瀝乾拌少許香油；雞胸肉水煮撕絲；小黃瓜切絲",
      "芝麻醬 2 大匙先用溫水 2 大匙調開，再加醬油 1 大匙、糖 1 小匙、蒜末、烏醋少許",
      "麵鋪底，放雞絲、小黃瓜絲，淋醬",
      "帶便當時醬另外裝，吃前再拌"
    ]
  },
  {
    id: "noodle-zhajiang",
    name: "炸醬麵",
    baseServings: 2,
    ingredients: [
      { name: "麵條", amount: 200, unit: "克" },
      { name: "豬絞肉", amount: 200, unit: "克" },
      { name: "豆干", amount: 3, unit: "片" },
      { name: "小黃瓜", amount: 1, unit: "條" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 10, bento: true, tags: ["高蛋白"],
    steps: [
      "豆干切小丁；小黃瓜切絲；麵條煮熟",
      "熱鍋 1 大匙油，豬絞肉炒散上色，下豆干丁、蒜末炒香",
      "加甜麵醬 2 大匙、豆瓣醬 1 大匙、糖 1 小匙、水半杯，小火煮 5 分鐘收濃",
      "醬淋麵上，鋪小黃瓜絲拌勻；醬可多做，冷藏 3 天"
    ]
  },

  // ── 烏龍麵 ──────────────────────────────
  {
    id: "udon-clam-enoki",
    name: "蛤蜊金針菇烏龍麵",
    baseServings: 2,
    ingredients: [
      { name: "烏龍麵", amount: 2, unit: "包" },
      { name: "蛤蜊", amount: 250, unit: "克" },
      { name: "金針菇", amount: 1, unit: "包" }
    ],
    method: "煮", cuisine: "日式", diet: "葷",
    time: 8, bento: false, tags: ["健康", "一鍋"],
    steps: [
      "蛤蜊吐沙；金針菇去根剝散",
      "水 3 杯加薑絲煮滾，放烏龍麵煮 2 分鐘",
      "下金針菇、蛤蜊，開口即熄火",
      "加鹽、米酒少許，撒蔥花即可"
    ]
  },
  {
    id: "udon-pork-belly-stir",
    name: "五花肉炒烏龍麵",
    baseServings: 2,
    ingredients: [
      { name: "烏龍麵", amount: 2, unit: "包" },
      { name: "豬五花", amount: 150, unit: "克" },
      { name: "高麗菜", amount: 200, unit: "克" }
    ],
    method: "炒", cuisine: "日式", diet: "葷",
    time: 8, bento: true, tags: ["一鍋"],
    steps: [
      "五花肉片切段；高麗菜切片；烏龍麵用熱水沖散",
      "冷鍋下五花肉煎至出油微焦",
      "下高麗菜炒軟，加烏龍麵",
      "加醬油 2 大匙、味醂 1 大匙、少許烏醋拌炒，撒柴魚片即可"
    ]
  },

  // ── 年糕 ──────────────────────────────
  {
    id: "tteokbokki",
    name: "韓式辣炒年糕",
    baseServings: 2,
    ingredients: [
      { name: "年糕", amount: 300, unit: "克" },
      { name: "高麗菜", amount: 150, unit: "克" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "炒", cuisine: "韓式", diet: "葷",
    time: 8, bento: true, tags: ["一鍋"],
    steps: [
      "雞蛋水煮 8 分鐘剝殼；高麗菜切片；年糕泡水 5 分鐘",
      "鍋中水 1.5 杯、韓式辣醬 2 大匙、醬油 1 大匙、糖 1 大匙煮滾",
      "放年糕、高麗菜煮 5 分鐘至醬汁濃稠",
      "放水煮蛋滾一下裹醬即可"
    ]
  },
  {
    id: "rice-cake-napa-pork",
    name: "白菜肉片炒年糕",
    baseServings: 2,
    ingredients: [
      { name: "年糕", amount: 300, unit: "克" },
      { name: "大白菜", amount: 250, unit: "克" },
      { name: "豬肉片", amount: 150, unit: "克" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 8, bento: true, tags: ["一鍋"],
    steps: [
      "豬肉片用醬油、太白粉抓醃；大白菜切片；年糕泡水",
      "熱鍋 1 大匙油，肉片炒至變色，下蒜末、白菜梗炒軟",
      "加白菜葉、年糕、水半杯、醬油 1.5 大匙",
      "蓋鍋燜 3 分鐘至年糕軟，加鹽、白胡椒拌勻即可"
    ]
  },
  {
    id: "rice-cake-seaweed-egg-soup",
    name: "年糕海帶蛋湯",
    baseServings: 2,
    ingredients: [
      { name: "年糕", amount: 200, unit: "克" },
      { name: "海帶芽", amount: 1, unit: "大匙" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "湯", cuisine: "韓式", diet: "葷",
    time: 6, bento: false, tags: ["一鍋"],
    steps: [
      "年糕泡水；雞蛋打散",
      "水 3 杯煮滾，加醬油 1 大匙、蒜末，放年糕煮 3 分鐘至軟",
      "放海帶芽煮 1 分鐘",
      "淋蛋液成蛋花，撒蔥花、滴香油即可"
    ]
  },

  // ── 吐司 ──────────────────────────────
  {
    id: "toast-pizza",
    name: "吐司披薩",
    baseServings: 2,
    ingredients: [
      { name: "吐司", amount: 4, unit: "片" },
      { name: "番茄", amount: 1, unit: "顆" },
      { name: "玉米粒", amount: 0.5, unit: "杯" }
    ],
    method: "烤", cuisine: "西式", diet: "素",
    time: 5, bento: false, tags: [],
    tool: "烤箱",
    steps: [
      "番茄切薄片",
      "吐司抹番茄醬，鋪番茄片、玉米粒，有起司就撒",
      "烤箱 200°C 烤 8 分鐘至邊緣酥脆",
      "撒黑胡椒即可；冰箱剩的培根、甜椒都能加"
    ]
  },
  {
    id: "french-toast",
    name: "法式吐司",
    baseServings: 2,
    ingredients: [
      { name: "吐司", amount: 4, unit: "片" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "煎", cuisine: "西式", diet: "葷",
    time: 5, bento: false, tags: [],
    steps: [
      "雞蛋打散，加牛奶 3 大匙（沒有用水）、糖 1 小匙",
      "吐司兩面沾滿蛋液",
      "熱鍋放一小塊奶油或少許油，中小火煎至兩面金黃",
      "淋蜂蜜或撒糖粉即可"
    ]
  },
  // ══════════════════════════════════════════════════
  // 第四批（2026-09-16）：補齊覆蓋率 —— 瓜類、豆製品、絞肉、鯖魚鱈魚、炸物
  // ══════════════════════════════════════════════════

  // ── 豆製品 ──────────────────────────────
  {
    id: "napa-fried-tofu-stir",
    name: "白菜炒油豆腐",
    baseServings: 2,
    ingredients: [
      { name: "大白菜", amount: 300, unit: "克" },
      { name: "油豆腐", amount: 6, unit: "塊" }
    ],
    method: "炒", cuisine: "中式", diet: "素",
    time: 8, bento: true, tags: ["健康", "多纖維", "一鍋"],
    steps: [
      "大白菜切片，梗葉分開；油豆腐對切",
      "熱鍋 1 大匙油，蒜末爆香，下白菜梗炒軟",
      "加白菜葉、油豆腐、醬油 1.5 大匙、水 3 大匙",
      "蓋鍋燜 3 分鐘，加鹽、白胡椒拌勻即可"
    ]
  },
  {
    id: "tofu-skin-fried-tofu-braised",
    name: "滷豆皮油豆腐",
    baseServings: 4,
    ingredients: [
      { name: "豆皮", amount: 3, unit: "片" },
      { name: "油豆腐", amount: 8, unit: "塊" }
    ],
    method: "滷", cuisine: "中式", diet: "素",
    time: 6, bento: true, tags: ["高蛋白", "一鍋"],
    prep: "weekend",
    steps: [
      "豆皮切段；油豆腐用熱水沖掉表面油",
      "鍋中放醬油 4 大匙、糖 1 大匙、八角 1 顆、蒜頭、薑片、水 2 杯煮滾",
      "放豆皮、油豆腐，小火滷 20 分鐘，中途翻面",
      "熄火浸泡入味；分裝冷藏，便當的素蛋白質來源"
    ]
  },
  {
    id: "tofu-skin-chive-egg",
    name: "豆皮韭黃炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "豆皮", amount: 2, unit: "片" },
      { name: "韭黃", amount: 1, unit: "把" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "炒", cuisine: "中式", diet: "素",
    time: 8, bento: true, tags: ["健康", "高蛋白"],
    steps: [
      "豆皮切條；韭黃切段；雞蛋打散",
      "熱鍋 1 大匙油，豆皮煎至微黃",
      "倒入蛋液炒至半熟，下韭黃快炒",
      "加醬油 1 大匙、鹽拌勻即可"
    ]
  },
  {
    id: "egg-tofu-pan-fried",
    name: "香煎雞蛋豆腐",
    baseServings: 2,
    ingredients: [{ name: "雞蛋豆腐", amount: 1, unit: "盒" }],
    method: "煎", cuisine: "中式", diet: "素",
    time: 6, bento: true, tags: ["高蛋白"],
    steps: [
      "雞蛋豆腐切 1.5 公分厚片，用廚房紙巾吸乾",
      "薄薄拍一層太白粉",
      "熱鍋 1 大匙油，中小火煎至兩面金黃（翻面要輕）",
      "淋醬油、撒蔥花、柴魚片即可"
    ]
  },

  // ── 瓜類 ──────────────────────────────
  {
    id: "loofah-egg-stir",
    name: "絲瓜炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "絲瓜", amount: 1, unit: "條" },
      { name: "雞蛋", amount: 2, unit: "顆" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 8, bento: false, tags: ["健康", "高蛋白"],
    steps: [
      "絲瓜去皮切滾刀塊；雞蛋打散",
      "熱鍋 1 大匙油，蛋液炒至半熟盛起",
      "同鍋蒜末、薑絲爆香，下絲瓜炒 1 分鐘，加水 2 大匙蓋鍋燜 2 分鐘",
      "加回炒蛋，加鹽拌勻即可；絲瓜出水多，現煮現吃"
    ]
  },
  {
    id: "loofah-squid-braised",
    name: "絲瓜燴透抽",
    baseServings: 2,
    ingredients: [
      { name: "絲瓜", amount: 1, unit: "條" },
      { name: "透抽", amount: 200, unit: "克" }
    ],
    method: "燴", cuisine: "中式", diet: "葷",
    time: 8, bento: false, tags: ["健康", "高蛋白", "一鍋"],
    steps: [
      "絲瓜去皮切塊；透抽切圈",
      "熱鍋 1 大匙油，薑絲爆香，下絲瓜炒 1 分鐘",
      "加水半杯、鹽、米酒 1 大匙，蓋鍋燜 2 分鐘",
      "下透抽煮 1 分鐘變白即熄火，太白粉水勾薄芡即可"
    ]
  },
  {
    id: "bitter-melon-egg",
    name: "苦瓜炒蛋",
    baseServings: 2,
    ingredients: [
      { name: "苦瓜", amount: 1, unit: "條" },
      { name: "雞蛋", amount: 3, unit: "顆" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 8, bento: true, tags: ["健康", "高蛋白"],
    steps: [
      "苦瓜去籽、刮掉白膜切薄片，用鹽抓 5 分鐘擠掉苦水；雞蛋打散",
      "熱鍋 1 大匙油，蒜末爆香，下苦瓜炒 2 分鐘",
      "倒入蛋液，待底部凝固再翻炒",
      "加鹽、少許醬油拌勻即可"
    ]
  },
  {
    id: "bitter-melon-dried-fish",
    name: "小魚乾炒苦瓜",
    baseServings: 2,
    ingredients: [
      { name: "苦瓜", amount: 1, unit: "條" },
      { name: "小魚乾", amount: 30, unit: "克" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 8, bento: true, tags: ["健康", "多纖維"],
    steps: [
      "苦瓜去籽刮白膜切片，鹽抓 5 分鐘擠掉苦水；小魚乾沖水瀝乾",
      "熱鍋 1 大匙油，小火把小魚乾、蒜末、豆豉（有就加）炒香",
      "下苦瓜轉大火炒 2 分鐘，加水 2 大匙蓋鍋燜 1 分鐘",
      "加醬油 1 小匙、少許糖拌勻即可"
    ]
  },
  {
    id: "pumpkin-rice-cooker-steamed",
    name: "電鍋蒸南瓜",
    baseServings: 2,
    ingredients: [{ name: "南瓜", amount: 400, unit: "克" }],
    method: "蒸", cuisine: "中式", diet: "素",
    time: 3, bento: true, tags: ["健康", "多纖維"],
    tool: "電鍋",
    steps: [
      "南瓜帶皮切 2 公分厚片（皮蒸過可吃）",
      "排盤，撒少許鹽",
      "電鍋外鍋 1 杯水，蒸至跳起（約 15 分鐘）",
      "便當主食或配菜都行，重熱不變色不出水"
    ]
  },

  // ── 快炒配菜 ──────────────────────────────
  {
    id: "dried-fish-green-pepper",
    name: "小魚乾炒青椒",
    baseServings: 2,
    ingredients: [
      { name: "小魚乾", amount: 30, unit: "克" },
      { name: "青椒", amount: 2, unit: "顆" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 6, bento: true, tags: ["健康", "多纖維"],
    steps: [
      "小魚乾沖水瀝乾；青椒去籽切條",
      "熱鍋 1 大匙油，小火把小魚乾、蒜末、辣椒炒香酥",
      "下青椒轉大火炒 1 分鐘",
      "加醬油 1 小匙、少許糖拌勻即可"
    ]
  },
  {
    id: "edamame-shrimp-baby-corn",
    name: "毛豆蝦仁炒玉米筍",
    baseServings: 2,
    ingredients: [
      { name: "蝦仁", amount: 150, unit: "克" },
      { name: "毛豆", amount: 100, unit: "克" },
      { name: "玉米筍", amount: 6, unit: "根" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 6, bento: true, tags: ["健康", "高蛋白", "多纖維"],
    steps: [
      "蝦仁去腸泥，鹽、太白粉抓醃；玉米筍斜切；毛豆仁燙 2 分鐘",
      "熱鍋 1 大匙油，蝦仁炒至變色盛起",
      "同鍋蒜末爆香，下玉米筍、毛豆炒 2 分鐘",
      "加回蝦仁，加鹽、米酒拌炒即可"
    ]
  },
  {
    id: "baby-corn-shimeji-zucchini",
    name: "玉米筍炒鴻喜菇",
    baseServings: 2,
    ingredients: [
      { name: "玉米筍", amount: 6, unit: "根" },
      { name: "鴻喜菇", amount: 1, unit: "包" },
      { name: "櫛瓜", amount: 1, unit: "條" }
    ],
    method: "炒", cuisine: "中式", diet: "素",
    time: 6, bento: true, tags: ["健康", "多纖維"],
    steps: [
      "玉米筍對剖；鴻喜菇剝散；櫛瓜切半月片",
      "熱鍋 1 大匙油，蒜末爆香，下鴻喜菇炒至出香",
      "加玉米筍、櫛瓜炒 2 分鐘",
      "加鹽、黑胡椒、少許醬油拌勻即可"
    ]
  },
  {
    id: "celery-pork-stir",
    name: "芹菜炒肉絲",
    baseServings: 2,
    ingredients: [
      { name: "芹菜", amount: 4, unit: "根" },
      { name: "豬肉片", amount: 150, unit: "克" }
    ],
    method: "炒", cuisine: "中式", diet: "葷",
    time: 6, bento: true, tags: ["健康", "高蛋白"],
    steps: [
      "豬肉切絲，醬油、太白粉抓醃；芹菜去葉切段",
      "熱鍋 1 大匙油，肉絲炒至變色盛起",
      "同鍋蒜末、辣椒爆香，下芹菜炒 1 分鐘",
      "加回肉絲，加鹽、米酒拌炒即可"
    ]
  },

  // ── 絞肉／肉類 ──────────────────────────────
  {
    id: "beef-patty",
    name: "牛肉漢堡排",
    baseServings: 4,
    ingredients: [
      { name: "牛絞肉", amount: 500, unit: "克" },
      { name: "洋蔥", amount: 1, unit: "顆" }
    ],
    method: "煎", cuisine: "西式", diet: "葷",
    time: 10, bento: true, tags: ["高蛋白"],
    prep: "weekend",
    steps: [
      "洋蔥切碎，炒軟放涼",
      "牛絞肉加洋蔥、鹽 1 小匙、黑胡椒、蛋 1 顆（可省）摔打至有黏性，分 4 份壓成餅",
      "熱鍋 1 大匙油，中火每面煎 3 分鐘，加水 2 大匙蓋鍋燜 2 分鐘",
      "一次煎 4 片，分裝冷藏或冷凍；便當重熱前噴點水"
    ]
  },
  {
    id: "beef-basil-thai",
    name: "打拋牛肉",
    baseServings: 2,
    ingredients: [
      { name: "牛絞肉", amount: 250, unit: "克" },
      { name: "番茄", amount: 1, unit: "顆" },
      { name: "九層塔", amount: 1, unit: "把" }
    ],
    method: "炒", cuisine: "泰式", diet: "葷",
    time: 8, bento: true, tags: ["高蛋白"],
    steps: [
      "番茄切丁；九層塔摘葉",
      "熱鍋 1 大匙油，蒜末、辣椒爆香，下牛絞肉炒散至上色",
      "加魚露 1 大匙、醬油 1 大匙、糖 1 小匙、番茄丁炒 1 分鐘",
      "熄火拌入九層塔，配白飯"
    ]
  },
  {
    id: "beef-curry",
    name: "咖哩牛肉",
    baseServings: 4,
    ingredients: [
      { name: "牛肋條", amount: 500, unit: "克" },
      { name: "馬鈴薯", amount: 2, unit: "顆" },
      { name: "紅蘿蔔", amount: 1, unit: "條" }
    ],
    method: "燉", cuisine: "日式", diet: "葷",
    time: 10, bento: true, tags: ["一鍋"],
    prep: "weekend",
    steps: [
      "牛肋條切塊；馬鈴薯、紅蘿蔔切滾刀塊",
      "熱鍋 1 大匙油，牛肉煎至上色，加水蓋過，煮滾後小火燉 40 分鐘",
      "放馬鈴薯、紅蘿蔔續燉 15 分鐘",
      "熄火加咖哩塊拌至融化，再小火煮 5 分鐘；分裝冷藏，隔夜更好吃"
    ]
  },
  {
    id: "wings-garlic-pan-fried",
    name: "蒜香煎雞翅",
    baseServings: 2,
    ingredients: [{ name: "雞翅", amount: 6, unit: "支" }],
    method: "煎", cuisine: "中式", diet: "葷",
    time: 10, bento: true, tags: ["高蛋白"],
    steps: [
      "雞翅擦乾，兩面劃一刀，用鹽、黑胡椒、蒜末抓醃 10 分鐘",
      "冷鍋少油，雞翅皮面朝下，中小火煎 5 分鐘至金黃",
      "翻面加水 3 大匙蓋鍋燜 5 分鐘至熟透",
      "開蓋淋醬油 1 小匙收乾即可"
    ]
  },

  // ── 魚 ──────────────────────────────
  {
    id: "mackerel-pan-fried",
    name: "香煎鯖魚",
    baseServings: 2,
    ingredients: [
      { name: "鯖魚", amount: 1, unit: "片" },
      { name: "檸檬", amount: 0.5, unit: "顆" }
    ],
    method: "煎", cuisine: "日式", diet: "葷",
    time: 6, bento: true, tags: ["高蛋白"],
    steps: [
      "鯖魚擦乾（薄鹽鯖魚不用再加鹽），魚皮劃兩刀",
      "熱鍋 1 小匙油，魚皮朝下中火煎 4 分鐘不要動它",
      "翻面煎 2 分鐘至熟",
      "擠檸檬汁、配蘿蔔泥即可"
    ]
  },
  {
    id: "mackerel-air-fried",
    name: "氣炸鹽烤鯖魚",
    baseServings: 2,
    ingredients: [{ name: "鯖魚", amount: 1, unit: "片" }],
    method: "烤", cuisine: "日式", diet: "葷",
    time: 3, bento: true, tags: ["高蛋白"],
    tool: "氣炸鍋",
    steps: [
      "鯖魚擦乾，兩面抹薄薄一層鹽（薄鹽鯖魚免抹）",
      "氣炸鍋 180°C，魚皮朝上炸 10 分鐘",
      "皮起泡微焦即可，擠檸檬汁",
      "零油煙，便當魚首選"
    ]
  },
  {
    id: "cod-zucchini-pan-fried",
    name: "香煎鱈魚佐櫛瓜",
    baseServings: 2,
    ingredients: [
      { name: "鱈魚", amount: 1, unit: "片" },
      { name: "櫛瓜", amount: 1, unit: "條" }
    ],
    method: "煎", cuisine: "西式", diet: "葷",
    time: 8, bento: true, tags: ["健康", "高蛋白"],
    steps: [
      "鱈魚擦乾，鹽、黑胡椒調味，薄拍太白粉；櫛瓜切 1 公分圓片",
      "熱鍋 1 大匙油，鱈魚中火每面煎 3 分鐘盛起",
      "同鍋櫛瓜片煎至兩面微焦，撒鹽",
      "擺盤，擠檸檬汁即可"
    ]
  },

  // ── 炸 ──────────────────────────────
  {
    id: "pork-cutlet-fried",
    name: "日式炸豬排",
    baseServings: 2,
    ingredients: [{ name: "豬里肌", amount: 2, unit: "片" }],
    method: "炸", cuisine: "日式", diet: "葷",
    time: 10, bento: true, tags: ["高蛋白"],
    steps: [
      "豬里肌片斷筋拍鬆，鹽、黑胡椒調味",
      "依序沾麵粉→蛋液→麵包粉，壓緊",
      "油 170°C 炸 3 分鐘翻面再 2 分鐘至金黃，起鍋瀝油靜置 2 分鐘再切",
      "配高麗菜絲、豬排醬；便當冷了也不軟"
    ]
  },
  {
    id: "king-oyster-mushroom-fried",
    name: "鹽酥杏鮑菇",
    baseServings: 2,
    ingredients: [
      { name: "杏鮑菇", amount: 3, unit: "根" },
      { name: "九層塔", amount: 1, unit: "把" }
    ],
    method: "炸", cuisine: "中式", diet: "素",
    time: 8, bento: true, tags: [],
    steps: [
      "杏鮑菇用手撕成條，用醬油 1 大匙、蒜末、五香粉醃 5 分鐘",
      "沾裹地瓜粉，靜置 2 分鐘回潮",
      "油 170°C 炸 3 分鐘至金黃酥脆，起鍋前丟九層塔炸 5 秒",
      "撒胡椒鹽即可"
    ]
  }

];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { RECIPES, PANTRY_STAPLES };
}
