/**
 * 料理靈感工具 - 食材目錄
 *
 * INGREDIENT_CATALOG 是全站唯一的食材清單：
 *   - name     ：正規名稱，recipes.js 的 ingredients[].name 一律用這個
 *   - category ：分類，畫面上的「點選分類標籤」照這個分組
 *   - aliases  ：使用者可能打的其他叫法，match.js 會把它們統一成 name
 *   - plant    ：（選填）放在肉類／海鮮分類但其實是植物（海帶芽），素食檢查會放行
 *
 * 新增食譜時若用到目錄沒有的食材，先加進這裡（tools/validate.js 會擋）。
 * 常備調味料（鹽、糖、醬油、蒜、薑…）不在目錄裡，見 recipes.js 的 PANTRY_STAPLES。
 */

const INGREDIENT_CATEGORIES = ["葉菜", "瓜果根莖", "菇類", "肉類", "海鮮", "蛋豆製品", "主食"];

const INGREDIENT_CATALOG = [
  // ── 葉菜 ──────────────────────────────
  { name: "高麗菜", category: "葉菜", aliases: ["甘藍", "包心菜", "高麗菜絲"] },
  { name: "空心菜", category: "葉菜", aliases: ["蕹菜", "通菜", "應菜", "通心菜"] },
  { name: "地瓜葉", category: "葉菜", aliases: ["番薯葉", "甘藷葉"] },
  { name: "菠菜", category: "葉菜", aliases: ["波菜"] },
  { name: "青江菜", category: "葉菜", aliases: ["湯匙菜", "上海青", "青江"] },
  { name: "韭菜", category: "葉菜", aliases: [] },
  { name: "韭黃", category: "葉菜", aliases: [] },
  { name: "花椰菜", category: "葉菜", aliases: ["青花菜", "西蘭花", "花菜", "青花椰菜", "綠花椰"] },
  { name: "豆芽菜", category: "葉菜", aliases: ["豆芽", "綠豆芽", "銀芽"] },
  { name: "九層塔", category: "葉菜", aliases: ["羅勒", "塔仔"] },
  { name: "蔥", category: "葉菜", aliases: ["青蔥", "蔥花"] },
  { name: "大白菜", category: "葉菜", aliases: ["白菜", "結球白菜", "包心白菜"] },
  { name: "芹菜", category: "葉菜", aliases: ["台芹", "西芹", "西洋芹"] },
  { name: "A菜", category: "葉菜", aliases: ["a菜", "萵苣葉", "小萵苣", "鵝仔菜", "本島萵苣"] },
  { name: "芥藍", category: "葉菜", aliases: ["芥蘭", "格藍菜", "芥藍菜"] },

  // ── 瓜果根莖 ──────────────────────────────
  { name: "番茄", category: "瓜果根莖", aliases: ["西紅柿", "牛番茄", "大番茄"] },
  { name: "紅蘿蔔", category: "瓜果根莖", aliases: ["胡蘿蔔", "紅蘿蔔絲"] },
  { name: "秋葵", category: "瓜果根莖", aliases: ["黃秋葵", "羊角豆"] },
  { name: "小黃瓜", category: "瓜果根莖", aliases: ["花胡瓜", "黃瓜"] },
  { name: "四季豆", category: "瓜果根莖", aliases: ["敏豆"] },
  { name: "洋蔥", category: "瓜果根莖", aliases: ["蔥頭"] },
  { name: "馬鈴薯", category: "瓜果根莖", aliases: ["洋芋", "馬鈴薯仔", "土豆"] },
  { name: "茄子", category: "瓜果根莖", aliases: [] },
  { name: "青椒", category: "瓜果根莖", aliases: [] },
  { name: "甜椒", category: "瓜果根莖", aliases: ["彩椒", "紅甜椒", "黃甜椒"] },
  { name: "櫛瓜", category: "瓜果根莖", aliases: ["夏南瓜", "節瓜"] },
  { name: "玉米粒", category: "瓜果根莖", aliases: ["玉米", "玉米罐頭"] },
  { name: "玉米筍", category: "瓜果根莖", aliases: ["小玉米", "珍珠筍"] },
  { name: "檸檬", category: "瓜果根莖", aliases: ["萊姆"] },
  { name: "白蘿蔔", category: "瓜果根莖", aliases: ["菜頭", "蘿蔔"] },
  { name: "絲瓜", category: "瓜果根莖", aliases: ["菜瓜"] },
  { name: "苦瓜", category: "瓜果根莖", aliases: ["白玉苦瓜", "山苦瓜"] },
  { name: "南瓜", category: "瓜果根莖", aliases: ["金瓜", "栗子南瓜"] },
  { name: "冷凍三色豆", category: "瓜果根莖", aliases: ["三色豆", "三色蔬菜", "冷凍蔬菜"] },

  // ── 菇類 ──────────────────────────────
  { name: "香菇", category: "菇類", aliases: ["鮮香菇", "生香菇"] },
  { name: "乾香菇", category: "菇類", aliases: ["香菇乾"] },
  { name: "杏鮑菇", category: "菇類", aliases: ["杏鮑菇片"] },
  { name: "黑木耳", category: "菇類", aliases: ["木耳"] },
  { name: "金針菇", category: "菇類", aliases: ["金菇"] },
  { name: "鴻喜菇", category: "菇類", aliases: ["鴻禧菇", "蟹味菇", "雪白菇"] },

  // ── 肉類 ──────────────────────────────
  { name: "雞胸肉", category: "肉類", aliases: ["雞胸", "雞柳"] },
  { name: "雞腿肉", category: "肉類", aliases: ["雞腿", "去骨雞腿", "去骨雞腿排"] },
  { name: "豬絞肉", category: "肉類", aliases: ["絞肉", "豬肉末"] },
  // 肉品不分切法（片／絲／條都是同一個部位），但不同部位維持區分
  { name: "豬肉片", category: "肉類", aliases: ["豬肉絲", "豬肉條", "豬肉片薄", "梅花肉片", "豬肉"] },
  { name: "豬里肌", category: "肉類", aliases: ["豬里肌肉", "豬里肌片", "里肌肉", "里肌"] },
  { name: "牛肉片", category: "肉類", aliases: ["牛肉絲", "牛肉條", "牛肉", "火鍋牛肉片"] },
  { name: "牛肋條", category: "肉類", aliases: ["牛腩"] },
  { name: "豬五花", category: "肉類", aliases: ["五花肉", "三層肉", "五花", "五花肉片"] },
  { name: "排骨", category: "肉類", aliases: ["小排", "豬小排", "子排", "豬排骨"] },
  { name: "雞翅", category: "肉類", aliases: ["二節翅", "三節翅", "翅小腿", "雞翅膀"] },
  { name: "牛絞肉", category: "肉類", aliases: ["牛肉末", "牛絞肉末"] },
  { name: "培根", category: "肉類", aliases: [] },
  { name: "香腸", category: "肉類", aliases: ["台式香腸", "臘腸"] },

  // ── 海鮮 ──────────────────────────────
  { name: "蝦仁", category: "海鮮", aliases: ["白蝦仁", "白蝦", "蝦"] },
  { name: "鮭魚", category: "海鮮", aliases: ["鮭魚片", "鮭魚排"] },
  { name: "魚片", category: "海鮮", aliases: ["鱸魚片", "鯛魚片", "白身魚片", "鯛魚"] },
  { name: "蝦米", category: "海鮮", aliases: ["開陽"] },
  { name: "小魚乾", category: "海鮮", aliases: ["丁香魚"] },
  { name: "海帶芽", category: "海鮮", aliases: ["裙帶菜", "海帶"], plant: true }, // 海藻，素食可用
  { name: "蛤蜊", category: "海鮮", aliases: ["蛤蠣", "蛤仔", "文蛤", "海瓜子"] },
  { name: "透抽", category: "海鮮", aliases: ["花枝", "中卷", "小卷", "魷魚", "烏賊"] },
  { name: "鯖魚", category: "海鮮", aliases: ["鹽漬鯖魚", "薄鹽鯖魚", "青花魚"] },
  { name: "鱈魚", category: "海鮮", aliases: ["鱈魚片", "扁鱈", "圓鱈"] },

  // ── 蛋豆製品 ──────────────────────────────
  { name: "雞蛋", category: "蛋豆製品", aliases: ["蛋", "土雞蛋"] },
  { name: "皮蛋", category: "蛋豆製品", aliases: ["松花蛋"] },
  { name: "嫩豆腐", category: "蛋豆製品", aliases: ["小豆腐", "嫩豆花", "盒裝豆腐", "涼拌豆腐"] },
  { name: "板豆腐", category: "蛋豆製品", aliases: ["老豆腐", "傳統豆腐"] },
  { name: "豆干", category: "蛋豆製品", aliases: ["豆乾", "豆腐乾", "五香豆干"] },
  { name: "油豆腐", category: "蛋豆製品", aliases: ["豆泡", "油豆泡", "三角油豆腐"] },
  { name: "豆皮", category: "蛋豆製品", aliases: ["生豆皮", "豆包", "腐皮"] },
  { name: "雞蛋豆腐", category: "蛋豆製品", aliases: ["玉子豆腐", "蛋豆腐"] },
  { name: "毛豆", category: "蛋豆製品", aliases: ["毛豆仁", "枝豆"] },

  // ── 主食 ──────────────────────────────
  { name: "白米", category: "主食", aliases: ["米", "生米"] },
  { name: "白飯", category: "主食", aliases: ["米飯", "白米飯", "飯", "隔夜飯"] },
  { name: "冬粉", category: "主食", aliases: ["冬粉絲", "粉絲"] },
  { name: "義大利麵", category: "主食", aliases: ["義麵", "spaghetti"] },
  { name: "麵條", category: "主食", aliases: ["白麵", "油麵", "陽春麵", "麵", "關廟麵"] },
  { name: "烏龍麵", category: "主食", aliases: ["烏冬", "讚岐烏龍麵"] },
  { name: "年糕", category: "主食", aliases: ["韓式年糕", "寧波年糕", "條狀年糕"] },
  { name: "吐司", category: "主食", aliases: ["土司", "白吐司", "麵包"] }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { INGREDIENT_CATALOG, INGREDIENT_CATEGORIES };
}
