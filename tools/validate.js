#!/usr/bin/env node
/**
 * 資料驗證：node tools/validate.js [--strict]
 *
 * 一般模式：只擋「結構錯誤」（id 重複、食材不在目錄、做法不在白名單…），
 *           覆蓋率不足（某食材食譜太少、time/bento 還沒補）只印警告。
 * --strict ：警告也算失敗。資料擴充做完後應該以 --strict 全過為準。
 *
 * 檢查項目見 EXPANSION-PLAN.md「驗證腳本」。
 */
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const STRICT = process.argv.includes("--strict");

// recipes.js 是瀏覽器用的純檔案（沒有 export），用 Function 包起來讀
function loadRecipes() {
  const src = fs.readFileSync(path.join(ROOT, "recipes.js"), "utf8");
  const mod = {};
  new Function("module", src + "\nmodule.exports = { RECIPES, PANTRY_STAPLES };")(mod);
  return mod.exports;
}

const { INGREDIENT_CATALOG, INGREDIENT_CATEGORIES } = require(path.join(ROOT, "ingredients.js"));
const { RECIPES, PANTRY_STAPLES } = loadRecipes();

// ── 白名單 ──────────────────────────────
const METHODS = ["炒", "煎", "蒸", "滷", "燒", "涼拌", "煮", "烤", "燉", "湯", "炸", "燴"];
const TOOLS = ["電鍋", "氣炸鍋", "烤箱", "免開火"];
const CUISINES = ["中式", "日式", "西式", "泰式", "韓式"];
const DIETS = ["葷", "素"];
const TAGS = ["健康", "高蛋白", "多纖維", "一鍋"];
const PREPS = ["weekend"];
const SEASONING_UNITS = ["大匙", "小匙", "杯", "瓣", "片", "根", "顆", "塊", "小塊", "少許", "適量"];
const UNITS = ["克", "顆", "條", "片", "塊", "根", "朵", "把", "碗", "盒", "杯", "大匙", "小匙", "包", "尾", "隻", "支"];

// 目標門檻（EXPANSION-PLAN.md）
const MIN_PER_INGREDIENT = 2;      // 既有食材：至少 2 道
const MIN_PER_NEW_INGREDIENT = 3;  // 2026-09-16 擴充新增的 30 種：至少 3 道
const NEW_INGREDIENTS = [
  "白蘿蔔", "大白菜", "絲瓜", "苦瓜", "南瓜", "芹菜", "A菜", "芥藍", "金針菇", "鴻喜菇", "冷凍三色豆",
  "豬五花", "排骨", "雞翅", "牛絞肉", "培根", "香腸",
  "蛤蜊", "透抽", "鯖魚", "鱈魚",
  "豆干", "油豆腐", "豆皮", "雞蛋豆腐", "毛豆",
  "麵條", "烏龍麵", "年糕", "吐司"
];
const MIN_PER_METHOD = 4;
const QUICK_SHARE_MIN = 0.65; // 平日快煮型（time ≤10 且非 weekend）佔比
const QUICK_MAX_MINUTES = 10;

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ── 1. 食材目錄本身 ──────────────────────────────
const canonical = new Set();
const aliasOwner = {};
INGREDIENT_CATALOG.forEach((item) => {
  if (!item.name) err("目錄項目缺 name：" + JSON.stringify(item));
  if (canonical.has(item.name)) err("目錄 name 重複：" + item.name);
  canonical.add(item.name);
  if (!INGREDIENT_CATEGORIES.includes(item.category)) err("目錄分類不在清單：" + item.name + " → " + item.category);
  if (!Array.isArray(item.aliases)) err("目錄 aliases 不是陣列：" + item.name);
});
INGREDIENT_CATALOG.forEach((item) => {
  item.aliases.forEach((a) => {
    if (canonical.has(a)) err("別名跟另一個正規名稱撞名：" + a + "（屬於 " + item.name + "）");
    if (aliasOwner[a] && aliasOwner[a] !== item.name) err("別名同時指到兩個食材：" + a + " → " + aliasOwner[a] + "／" + item.name);
    aliasOwner[a] = item.name;
    if (PANTRY_STAPLES.includes(a)) warn("別名跟常備調味料同名：" + a);
  });
});

// ── 2. 每道食譜 ──────────────────────────────
const ids = new Set();
const ingredientUse = {};
const methodUse = {};
let quickCount = 0;
let weekendCount = 0;
let taggedCount = 0;

RECIPES.forEach((r, idx) => {
  const label = r.id || "#" + idx;
  ["id", "name", "baseServings", "ingredients", "method", "cuisine", "diet", "steps"].forEach((k) => {
    if (r[k] === undefined || r[k] === null || r[k] === "") err(label + "：缺欄位 " + k);
  });
  if (ids.has(r.id)) err("id 重複：" + r.id);
  ids.add(r.id);

  if (!Array.isArray(r.ingredients) || !r.ingredients.length) err(label + "：ingredients 空的");
  else {
    r.ingredients.forEach((ing) => {
      if (!canonical.has(ing.name)) {
        if (aliasOwner[ing.name]) err(label + "：食材「" + ing.name + "」是別名，請改用正規名稱「" + aliasOwner[ing.name] + "」");
        else err(label + "：食材「" + ing.name + "」不在 ingredients.js 目錄");
      }
      if (typeof ing.amount !== "number" || !(ing.amount > 0)) err(label + "：" + ing.name + " 的 amount 要是正數");
      if (!UNITS.includes(ing.unit)) err(label + "：" + ing.name + " 的單位「" + ing.unit + "」不在白名單");
      const cat = INGREDIENT_CATALOG.find((x) => x.name === ing.name);
      if (cat && cat.whole && ing.unit !== "克" && !Number.isInteger(ing.amount)) err(label + "：" + ing.name + " 只能整數計量，寫了 " + ing.amount);
      ingredientUse[ing.name] = (ingredientUse[ing.name] || 0) + 1;
    });
  }
  if (!METHODS.includes(r.method)) err(label + "：method「" + r.method + "」不在白名單");
  methodUse[r.method] = (methodUse[r.method] || 0) + 1;
  if (!CUISINES.includes(r.cuisine)) err(label + "：cuisine「" + r.cuisine + "」不在白名單");
  if (!DIETS.includes(r.diet)) err(label + "：diet「" + r.diet + "」不在白名單");
  if (!Array.isArray(r.steps) || r.steps.length < 2) err(label + "：steps 至少 2 步");
  // 調味料（2026-09-17 起必填）：名稱不可空、單位在白名單、少許／適量的 amount 必須是 null
  if (!Array.isArray(r.seasonings) || !r.seasonings.length) err(label + "：seasonings 空的");
  else {
    const seen = new Set();
    r.seasonings.forEach((s) => {
      if (!s.name) err(label + "：seasonings 有項目缺 name");
      if (seen.has(s.name)) err(label + "：調味料重複 " + s.name);
      seen.add(s.name);
      if (r.ingredients.some((i) => i.name === s.name)) err(label + "：" + s.name + " 同時在 ingredients 與 seasonings");
      if (!SEASONING_UNITS.includes(s.unit)) err(label + "：調味料 " + s.name + " 的單位「" + s.unit + "」不在白名單");
      if (s.unit === "少許" || s.unit === "適量") {
        if (s.amount !== null) err(label + "：" + s.name + " 是少許／適量，amount 要是 null");
      } else if (typeof s.amount !== "number" || !(s.amount > 0)) err(label + "：" + s.name + " 的 amount 不是正數");
    });
    // 步驟明寫的用量要跟 seasonings 一致（例：「醬油 2 大匙」）
    const stepText = r.steps.join(" / ");
    r.seasonings.forEach((s) => {
      if (s.amount === null) return;
      const m = stepText.match(new RegExp(s.name + "(?:末|頭|泥|片|絲|粉)?\\s*(\\d+(?:\\.\\d+)?|半)\\s*" + s.unit));
      if (m) {
        const n = m[1] === "半" ? 0.5 : parseFloat(m[1]);
        if (n !== s.amount) err(label + "：" + s.name + " 步驟寫 " + n + " " + s.unit + "，seasonings 卻是 " + s.amount);
      }
    });
  }
  if (!Number.isInteger(r.baseServings) || r.baseServings < 1) err(label + "：baseServings 要是正整數");

  // 選填欄位：有寫就要合法
  if (r.tool !== undefined && !TOOLS.includes(r.tool)) err(label + "：tool「" + r.tool + "」不在白名單");
  if (r.prep !== undefined && !PREPS.includes(r.prep)) err(label + "：prep「" + r.prep + "」不在白名單");
  if (r.tags !== undefined) {
    if (!Array.isArray(r.tags)) err(label + "：tags 要是陣列");
    else r.tags.forEach((t) => { if (!TAGS.includes(t)) err(label + "：tag「" + t + "」不在白名單"); });
  }

  // 定位標記：time／bento。還沒補的先警告，--strict 才算錯
  const hasTime = Number.isInteger(r.time) && r.time > 0;
  const hasBento = typeof r.bento === "boolean";
  if (r.time !== undefined && !hasTime) err(label + "：time 要是正整數（分鐘）");
  if (r.bento !== undefined && !hasBento) err(label + "：bento 要是 true/false");
  if (!hasTime) warn(label + "：還沒標 time");
  if (!hasBento) warn(label + "：還沒標 bento");
  if (hasTime && hasBento) taggedCount++;

  if (r.prep === "weekend") {
    weekendCount++;
    if (r.bento !== true) err(label + "：週末備料型 bento 必須是 true");
  } else if (hasTime && r.time <= QUICK_MAX_MINUTES) {
    quickCount++;
  }
  if (r.diet === "素") {
    const meaty = (r.ingredients || []).filter((i) => {
      const c = INGREDIENT_CATALOG.find((x) => x.name === i.name);
      return c && !c.plant && (c.category === "肉類" || c.category === "海鮮");
    });
    if (meaty.length) err(label + "：標「素」但用了 " + meaty.map((i) => i.name).join("、"));
  }
});

// ── 3. 覆蓋率 ──────────────────────────────
INGREDIENT_CATALOG.forEach((item) => {
  const n = ingredientUse[item.name] || 0;
  const min = NEW_INGREDIENTS.includes(item.name) ? MIN_PER_NEW_INGREDIENT : MIN_PER_INGREDIENT;
  if (n < min) warn("食材「" + item.name + "」只有 " + n + " 道（目標 ≥" + min + "）");
});
Object.keys(ingredientUse).forEach((name) => {
  if (!canonical.has(name)) return; // 已在上面報錯
});
METHODS.forEach((m) => {
  const n = methodUse[m] || 0;
  if (n < MIN_PER_METHOD) warn("做法「" + m + "」只有 " + n + " 道（目標 ≥" + MIN_PER_METHOD + "）");
});
if (taggedCount === RECIPES.length) {
  const share = quickCount / RECIPES.length;
  if (share < QUICK_SHARE_MIN) warn("平日快煮型佔比 " + (share * 100).toFixed(0) + "%（目標 ≥" + QUICK_SHARE_MIN * 100 + "%）");
}

// ── 4. 摘要 ──────────────────────────────
const fmt = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + " " + v).join("、");
console.log("食譜 " + RECIPES.length + " 道｜目錄食材 " + INGREDIENT_CATALOG.length + " 種（食譜實際用到 " + Object.keys(ingredientUse).length + " 種）");
console.log("做法：" + fmt(methodUse));
console.log("已標 time＋bento：" + taggedCount + "/" + RECIPES.length + "｜快煮型 " + quickCount + "｜週末備料型 " + weekendCount);
if (warnings.length) console.log("\n⚠️  警告 " + warnings.length + " 條：\n  " + warnings.join("\n  "));
if (errors.length) console.log("\n❌ 錯誤 " + errors.length + " 條：\n  " + errors.join("\n  "));

const failed = errors.length > 0 || (STRICT && warnings.length > 0);
console.log("\n" + (failed ? "❌ 未通過" : "✅ 通過") + (STRICT ? "（strict）" : ""));
process.exit(failed ? 1 : 0);
