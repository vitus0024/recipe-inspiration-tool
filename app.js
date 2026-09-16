(function () {
  const input = document.getElementById("ingredient-input");
  const searchBtn = document.getElementById("search-btn");
  const resultsEl = document.getElementById("results");
  const modal = document.getElementById("detail-modal");
  const modalBody = document.getElementById("modal-body");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const closeModalBtn = document.getElementById("close-modal");
  const quickFilterEl = document.getElementById("quick-filters");
  const methodSel = document.getElementById("filter-method");
  const toolSel = document.getElementById("filter-tool");
  const dietSel = document.getElementById("filter-diet");
  const cuisineSel = document.getElementById("filter-cuisine");
  const categoryChipsEl = document.getElementById("category-chips");
  const ingredientChipsEl = document.getElementById("ingredient-chips");

  const QUICK_MAX_MINUTES = 10;
  // 篩選狀態：quick/bento/weekend/onepot/healthy 是開關；其餘是下拉
  const filters = { quick: false, bento: false, weekend: false, onepot: false, healthy: false };
  let activeCategory = null;

  const MIN_SERVINGS = 1;
  const MAX_SERVINGS = 10;
  const DISCRETE_UNITS = ["顆", "條", "片", "塊", "根", "朵", "把", "碗", "盒", "包", "支"];

  let currentRecipe = null;
  let currentServings = 1;

  function metaRow(recipe) {
    const parts = ['<span class="time">⏱ ' + recipe.time + " 分</span>"];
    if (recipe.prep === "weekend") parts.push("<span>📅 週末做一鍋</span>");
    if (recipe.bento) parts.push("<span>🍱 便當 OK</span>");
    if (recipe.tool) parts.push("<span>" + recipe.tool + "</span>");
    return '<div class="meta-row">' + parts.join("") + "</div>";
  }

  function tagRow(recipe, servingsOverride) {
    const dietClass = recipe.diet === "素" ? "veg" : "";
    const servingsLabel = (servingsOverride || recipe.baseServings) + "人份";
    const extra = (recipe.tags || [])
      .map((t) => '<span class="tag veg">' + t + "</span>")
      .join("");
    return (
      '<div class="tag-row">' +
      '<span class="tag">' + recipe.cuisine + "</span>" +
      '<span class="tag">' + recipe.method + "</span>" +
      '<span class="tag ' + dietClass + '">' + recipe.diet + "</span>" +
      '<span class="tag">' + servingsLabel + "</span>" +
      extra +
      "</div>"
    );
  }

  function cardHtml(recipe, showMissing) {
    const missingHtml = showMissing && recipe._missing.length
      ? '<div class="missing">還缺：<b>' + recipe._missing.join("、") + "</b></div>"
      : "";
    const comboHtml = recipe._isCombo
      ? '<div class="combo-badge">🍽️ 一次用到你 ' + recipe._matchedCount + ' 樣食材</div>'
      : "";
    return (
      '<button class="recipe-card" data-id="' + recipe.id + '">' +
      comboHtml +
      '<div class="name">' + recipe.name + "</div>" +
      metaRow(recipe) +
      tagRow(recipe) +
      missingHtml +
      "</button>"
    );
  }

  function groupHtml(title, className, recipes, showMissing) {
    if (!recipes.length) return "";
    const cards = recipes.map((r) => cardHtml(r, showMissing)).join("");
    return (
      '<div class="result-group ' + className + '">' +
      "<h2>" + title + '<span class="result-count">' + recipes.length + " 道</span></h2>" +
      '<div class="card-grid">' + cards + "</div>" +
      "</div>"
    );
  }

  function renderResults(exact, near) {
    if (!exact.length && !near.length) {
      resultsEl.innerHTML =
        '<p class="no-result">沒有找到符合的料理，試試看少輸入一種食材，或換成其他常見食材。</p>';
      return;
    }
    resultsEl.innerHTML =
      groupHtml("可以直接煮 👍", "exact", exact, false) +
      groupHtml("只差一兩樣 🛒", "near", near, true);
  }

  function findRecipeById(id) {
    return RECIPES.find((r) => r.id === id);
  }

  // 依人數比例換算食材份量，並四捨五入成看起來合理的數字
  function scaleAmount(amount, ratio, unit) {
    const scaled = amount * ratio;
    let rounded;
    if (DISCRETE_UNITS.indexOf(unit) !== -1) {
      rounded = Math.round(scaled * 2) / 2; // 最小到 0.5
      if (rounded < 0.5) rounded = 0.5;
    } else if (unit === "克") {
      rounded = scaled < 50 ? Math.round(scaled / 5) * 5 : Math.round(scaled / 10) * 10;
      if (rounded < 5) rounded = 5;
    } else if (unit === "大匙" || unit === "小匙") {
      rounded = Math.round(scaled * 2) / 2;
      if (rounded < 0.5) rounded = 0.5;
    } else if (unit === "杯") {
      rounded = Math.round(scaled * 4) / 4;
      if (rounded < 0.25) rounded = 0.25;
    } else {
      rounded = Math.round(scaled * 10) / 10;
    }
    return rounded;
  }

  function formatAmount(n) {
    if (Number.isInteger(n)) return String(n);
    if (n === 0.5) return "半";
    if (n === 0.25) return "1/4";
    if (n === 0.75) return "3/4";
    if (n === 1.25) return "1又1/4";
    if (n === 1.5) return "1.5";
    if (n === 1.75) return "1又3/4";
    return String(n);
  }

  function ingredientListHtml(recipe, servings) {
    const ratio = servings / recipe.baseServings;
    return recipe.ingredients
      .map((ing) => {
        const amount = scaleAmount(ing.amount, ratio, ing.unit);
        return "<li>" + ing.name + "　" + formatAmount(amount) + ing.unit + "</li>";
      })
      .join("");
  }

  function renderModalBody() {
    const recipe = currentRecipe;
    const stepList = recipe.steps.map((s) => "<li>" + s + "</li>").join("");

    modalBody.innerHTML =
      "<h2>" + recipe.name + "</h2>" +
      metaRow(recipe) +
      tagRow(recipe, currentServings) +
      '<div class="servings-control">' +
      "<span>份量</span>" +
      '<button type="button" class="servings-btn" data-action="dec" aria-label="減少人份">－</button>' +
      '<span class="servings-count">' + currentServings + " 人份</span>" +
      '<button type="button" class="servings-btn" data-action="inc" aria-label="增加人份">＋</button>' +
      "</div>" +
      "<h3>準備材料</h3>" +
      "<ul>" + ingredientListHtml(recipe, currentServings) + "</ul>" +
      "<h3>步驟</h3>" +
      "<ol>" + stepList + "</ol>";
  }

  function openDetail(recipe) {
    currentRecipe = recipe;
    currentServings = recipe.baseServings;
    renderModalBody();
    modal.classList.remove("hidden");
  }

  function closeDetail() {
    modal.classList.add("hidden");
    currentRecipe = null;
  }

  // ── 篩選 ──────────────────────────────
  function passesFilters(r) {
    if (filters.quick && !(r.time <= QUICK_MAX_MINUTES && r.prep !== "weekend")) return false;
    if (filters.bento && !r.bento) return false;
    if (filters.weekend && r.prep !== "weekend") return false;
    if (filters.onepot && !(r.tags || []).includes("一鍋")) return false;
    if (filters.healthy && !(r.tags || []).includes("健康")) return false;
    if (methodSel.value && r.method !== methodSel.value) return false;
    if (toolSel.value && r.tool !== toolSel.value) return false;
    if (dietSel.value && r.diet !== dietSel.value) return false;
    if (cuisineSel.value && r.cuisine !== cuisineSel.value) return false;
    return true;
  }

  function anyFilterOn() {
    return Object.keys(filters).some((k) => filters[k]) ||
      methodSel.value || toolSel.value || dietSel.value || cuisineSel.value;
  }

  // 沒輸入食材時的預設清單：平日快煮型（動手 ≤10 分、非週末備料），時間短的排前面
  function defaultList() {
    const base = anyFilterOn()
      ? RECIPES.filter(passesFilters)
      : RECIPES.filter((r) => r.time <= QUICK_MAX_MINUTES && r.prep !== "weekend");
    const sorted = base.slice().sort((a, b) => a.time - b.time);
    return diversify(sorted);
  }

  function renderDefault() {
    const list = defaultList();
    if (!list.length) {
      resultsEl.innerHTML = '<p class="no-result">這組篩選條件沒有料理，放寬一點試試。</p>';
      return;
    }
    const title = anyFilterOn() ? "符合條件的料理" : "⏱ 10 分鐘開飯";
    resultsEl.innerHTML = groupHtml(title, "default", list, false);
  }

  function runSearch() {
    const userIngredients = parseInput(input.value);
    syncIngredientChips(userIngredients);
    if (!userIngredients.length) {
      renderDefault();
      return;
    }
    const { exact, near } = matchRecipes(userIngredients, RECIPES);
    renderResults(exact.filter(passesFilters), near.filter(passesFilters));
  }

  // ── 篩選 chips 與下拉 ──────────────────────────────
  function fillSelect(sel, values) {
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
  }
  function uniq(list) {
    return Array.from(new Set(list.filter(Boolean)));
  }
  fillSelect(methodSel, uniq(RECIPES.map((r) => r.method)));
  fillSelect(toolSel, uniq(RECIPES.map((r) => r.tool)));
  fillSelect(dietSel, ["葷", "素"]);
  fillSelect(cuisineSel, uniq(RECIPES.map((r) => r.cuisine)));

  quickFilterEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const key = chip.dataset.filter;
    filters[key] = !filters[key];
    // 「10 分鐘」跟「週末備料」互斥
    if (key === "quick" && filters.quick) filters.weekend = false;
    if (key === "weekend" && filters.weekend) filters.quick = false;
    quickFilterEl.querySelectorAll(".chip").forEach((c) => {
      c.classList.toggle("active", !!filters[c.dataset.filter]);
    });
    runSearch();
  });
  [methodSel, toolSel, dietSel, cuisineSel].forEach((sel) => sel.addEventListener("change", runSearch));

  // ── 食材分類標籤 ──────────────────────────────
  function renderCategoryChips() {
    categoryChipsEl.innerHTML = INGREDIENT_CATEGORIES.map((c) =>
      '<button type="button" class="chip category' + (c === activeCategory ? " active" : "") +
      '" data-category="' + c + '">' + c + "</button>"
    ).join("");
  }

  function renderIngredientChips() {
    if (!activeCategory) {
      ingredientChipsEl.hidden = true;
      ingredientChipsEl.innerHTML = "";
      return;
    }
    const chosen = new Set(parseInput(input.value));
    ingredientChipsEl.innerHTML = INGREDIENT_CATALOG
      .filter((i) => i.category === activeCategory)
      .map((i) =>
        '<button type="button" class="chip ingredient' + (chosen.has(i.name) ? " active" : "") +
        '" data-ingredient="' + i.name + '">' + i.name + "</button>"
      ).join("");
    ingredientChipsEl.hidden = false;
  }

  function syncIngredientChips(userIngredients) {
    const chosen = new Set(userIngredients);
    ingredientChipsEl.querySelectorAll(".chip").forEach((c) => {
      c.classList.toggle("active", chosen.has(c.dataset.ingredient));
    });
  }

  categoryChipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = activeCategory === chip.dataset.category ? null : chip.dataset.category;
    renderCategoryChips();
    renderIngredientChips();
  });

  ingredientChipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const name = chip.dataset.ingredient;
    const current = parseInput(input.value);
    const next = current.includes(name) ? current.filter((n) => n !== name) : current.concat(name);
    input.value = next.join("、");
    runSearch();
  });

  renderCategoryChips();
  renderDefault();

  searchBtn.addEventListener("click", runSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
  // 邊打邊找（清空時立刻回到預設清單）
  let inputTimer = null;
  input.addEventListener("input", () => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(runSearch, 250);
  });

  resultsEl.addEventListener("click", (e) => {
    const card = e.target.closest(".recipe-card");
    if (!card) return;
    const recipe = findRecipeById(card.dataset.id);
    if (recipe) openDetail(recipe);
  });

  modalBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".servings-btn");
    if (!btn || !currentRecipe) return;
    if (btn.dataset.action === "inc" && currentServings < MAX_SERVINGS) {
      currentServings++;
    } else if (btn.dataset.action === "dec" && currentServings > MIN_SERVINGS) {
      currentServings--;
    }
    renderModalBody();
  });

  closeModalBtn.addEventListener("click", closeDetail);
  modalBackdrop.addEventListener("click", closeDetail);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
})();
