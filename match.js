/**
 * 料理靈感工具 - 食材比對邏輯
 *
 * 規則：
 * 1. 完全匹配（使用者食材涵蓋所有需求）優先。
 * 2. 只差 1~2 樣食材的料理也會顯示，並標示還缺什麼。
 * 3. 常備調味料／辛香料（見 recipes.js 的 PANTRY_STAPLES）不計入比對。
 * 4. 結果會依烹調方式做多元化排序，避免同一種做法排在一起。
 */

// 別名 → 正規名稱，從 ingredients.js 的 INGREDIENT_CATALOG 自動生成
// （瀏覽器裡 INGREDIENT_CATALOG 是全域變數；node 測試時改用 require）
const _CATALOG =
  typeof INGREDIENT_CATALOG !== "undefined"
    ? INGREDIENT_CATALOG
    : require("./ingredients.js").INGREDIENT_CATALOG;

const SYNONYMS = {};
_CATALOG.forEach((item) => {
  item.aliases.forEach((alias) => {
    SYNONYMS[alias] = item.name;
  });
});

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
