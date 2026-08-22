/**
 * 料理靈感工具 - 食材比對邏輯
 *
 * 規則：
 * 1. 完全匹配（使用者食材涵蓋所有需求）優先。
 * 2. 只差 1~2 樣食材的料理也會顯示，並標示還缺什麼。
 * 3. 常備調味料／辛香料（見 recipes.js 的 PANTRY_STAPLES）不計入比對。
 * 4. 結果會依烹調方式做多元化排序，避免同一種做法排在一起。
 */

// 常見同義詞／別名 → 統一寫法（統一成 recipes.js 中使用的名稱）
const SYNONYMS = {
  "蛋": "雞蛋",
  "土雞蛋": "雞蛋",
  "絞肉": "豬絞肉",
  "豬肉末": "豬絞肉",
  "甘藍": "高麗菜",
  "包心菜": "高麗菜",
  "青花菜": "花椰菜",
  "西蘭花": "花椰菜",
  "花菜": "花椰菜",
  "青花椰菜": "花椰菜",
  "洋芋": "馬鈴薯",
  "馬鈴薯仔": "馬鈴薯",
  "胡蘿蔔": "紅蘿蔔",
  "紅蘿蔔絲": "紅蘿蔔",
  "敏豆": "四季豆",
  "花胡瓜": "小黃瓜",
  "青蔥": "蔥",
  "雞胸": "雞胸肉",
  "雞腿": "雞腿肉",
  "鮭魚片": "鮭魚",
  "鮭魚排": "鮭魚",
  // 肉品不分切法（片／絲／條都是同一個部位），但不同部位（里肌、絞肉、牛肋條等）維持區分
  "牛肉絲": "牛肉片",
  "牛肉條": "牛肉片",
  "牛腩": "牛肋條",
  "牛絞肉末": "牛絞肉",
  "豬肉片薄": "豬肉片",
  "豬肉絲": "豬肉片",
  "豬肉條": "豬肉片",
  "豬里肌肉": "豬里肌",
  "豬里肌片": "豬里肌",
  "小豆腐": "嫩豆腐",
  "老豆腐": "板豆腐",
  "傳統豆腐": "板豆腐",
  "嫩豆花": "嫩豆腐",
  "白蝦仁": "蝦仁",
  "白蝦": "蝦仁",
  "鱸魚片": "魚片",
  "鯛魚片": "魚片",
  "白身魚片": "魚片",
  "米飯": "白飯",
  "白米飯": "白飯",
  "冬粉絲": "冬粉",
  "粉絲": "冬粉",
  "香菇乾": "乾香菇",
  "杏鮑菇片": "杏鮑菇",
  "小玉米": "玉米筍",
  "玉米": "玉米粒",
  "蕹菜": "空心菜",
  "通菜": "空心菜",
  "應菜": "空心菜",
  "通心菜": "空心菜",
  "番薯葉": "地瓜葉",
  "甘藷葉": "地瓜葉"
};

function normalize(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "";
  return SYNONYMS[trimmed] || trimmed;
}

// 把使用者輸入的一段文字拆成正規化後的食材陣列（支援逗號、頓號、空白、換行分隔）
function parseInput(text) {
  return String(text || "")
    .split(/[,，、\s\n]+/)
    .map(normalize)
    .filter(Boolean);
}

// 依烹調方式把清單交錯排序，避免同一種做法排在一起
function diversify(list) {
  const buckets = {};
  const order = [];
  list.forEach((recipe) => {
    const key = recipe.method || "其他";
    if (!buckets[key]) {
      buckets[key] = [];
      order.push(key);
    }
    buckets[key].push(recipe);
  });

  const result = [];
  let i = 0;
  let remaining = list.length;
  while (remaining > 0) {
    for (const key of order) {
      const bucket = buckets[key];
      if (bucket[i]) {
        result.push(bucket[i]);
        remaining--;
      }
    }
    i++;
  }
  return result;
}

/**
 * 找出符合的料理。
 * @param {string[]} userIngredients - 使用者輸入、已正規化的食材陣列
 * @param {object[]} recipes - RECIPES 陣列
 * @returns {{exact: object[], near: object[]}} 每個項目都會附加 _missing（缺少的食材）與 _matchedCount
 */
function matchRecipes(userIngredients, recipes) {
  const userSet = new Set(userIngredients.map(normalize).filter(Boolean));

  const exact = [];
  const near = [];

  recipes.forEach((recipe) => {
    const missing = recipe.ingredients
      .filter((ing) => !userSet.has(normalize(ing.name)))
      .map((ing) => ing.name);
    const matchedCount = recipe.ingredients.length - missing.length;

    if (matchedCount === 0) return; // 使用者食材跟這道菜完全無關，不顯示

    const entry = Object.assign({}, recipe, {
      _missing: missing,
      _matchedCount: matchedCount,
      _isCombo: matchedCount >= 2 // 這道菜同時用到 2 種以上使用者輸入的食材
    });

    if (missing.length === 0) {
      exact.push(entry);
    } else if (missing.length <= 2) {
      near.push(entry);
    }
  });

  // 完全匹配：食材涵蓋越多（大份量料理）代表越「扎實」，其餘保持原順序
  exact.sort((a, b) => b.ingredients.length - a.ingredients.length);
  // 只差一點的：缺越少排越前面
  near.sort((a, b) => a._missing.length - b._missing.length);

  // 能同時組合多樣使用者食材的料理優先顯示，其餘單一食材的料理接在後面
  function comboFirst(list) {
    const combo = diversify(list.filter((r) => r._isCombo));
    const single = diversify(list.filter((r) => !r._isCombo));
    return combo.concat(single);
  }

  return {
    exact: comboFirst(exact),
    near: comboFirst(near)
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { normalize, parseInput, diversify, matchRecipes, SYNONYMS };
}
