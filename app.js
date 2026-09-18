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
  const pickerEl = document.getElementById("picker");
  const pickerBar = document.getElementById("picker-bar");
  const pickerPanel = document.getElementById("picker-panel");
  const pickerSummary = document.getElementById("picker-summary");
  const pickerAction = document.getElementById("picker-action");
  const tokenRow = document.getElementById("token-row");

  const PAGE_SIZE = 20; // 預設清單一次顯示幾道
  let defaultShown = PAGE_SIZE;
  // 已選食材（tokens）；輸入框只放「還在打的字」，按 Enter／找料理才併進來
  let selected = [];

  function currentIngredients() {
    return uniqList(selected.concat(parseInput(input.value)));
  }
  function uniqList(list) {
    return Array.from(new Set(list.filter(Boolean)));
  }
  function commitInput() {
    selected = uniqList(selected.concat(parseInput(input.value)));
    input.value = "";
  }

  const QUICK_MAX_MINUTES = 10;
  // 篩選狀態：quick/bento/weekend/onepot/healthy 是開關；其餘是下拉
  const filters = { quick: false, bento: false, weekend: false, onepot: false, healthy: false };
  let activeCategory = null;

  const MIN_SERVINGS = 1;
  const MAX_SERVINGS = 10;
  const DISCRETE_UNITS = ["顆", "條", "片", "塊", "根", "朵", "把", "碗", "盒", "包", "支"];

  let currentRecipe = null;
  let currentServings = 1;

  const CHEVRON = '<svg class="card-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m9 6 6 6-6 6"></path></svg>';

  function timeBlock(recipe) {
    const muted = recipe.bento ? "" : " muted";
    return (
      '<div class="time-block' + muted + '">' +
      '<div class="n">' + recipe.time + "</div>" +
      '<div class="u">分鐘</div>' +
      "</div>"
    );
  }

  // 卡片上的小標籤：便當／週末優先，其餘做法、器具、葷素、tags
  function pillRow(recipe, extraPills) {
    const pills = [];
    if (recipe.prep === "weekend") pills.push('<span class="pill weekend">週末做一鍋</span>');
    if (recipe.bento) pills.push('<span class="pill bento">便當 OK</span>');
    else if (recipe.method === "湯") pills.push('<span class="pill">現煮現喝</span>');
    if (recipe.tool) pills.push('<span class="pill">' + recipe.tool + "</span>");
    else pills.push('<span class="pill">' + recipe.method + "</span>");
    if (recipe.diet === "素") pills.push('<span class="pill">素</span>');
    (recipe.tags || []).forEach((t) => {
      if (t !== "一鍋" || !recipe.tool) pills.push('<span class="pill">' + t + "</span>");
    });
    return '<div class="pill-row">' + pills.join("") + (extraPills || "") + "</div>";
  }

  function cardHtml(recipe, showMissing) {
    let extra = "";
    if (showMissing && recipe._missing && recipe._missing.length) {
      extra = '<span class="pill missing">還缺 ' + recipe._missing.join("、") + "</span>";
    } else if (recipe._isCombo) {
      extra = '<span class="pill match">用到你 ' + recipe._matchedCount + " 樣食材</span>";
    }
    return (
      '<button class="recipe-card" data-id="' + recipe.id + '">' +
      timeBlock(recipe) +
      '<div class="card-body">' +
      '<div class="name">' + recipe.name + "</div>" +
      pillRow(recipe, extra) +
      "</div>" +
      CHEVRON +
      "</button>"
    );
  }

  function groupHtml(title, className, recipes, showMissing, note, footer) {
    if (!recipes.length) return "";
    const cards = recipes.map((r) => cardHtml(r, showMissing)).join("");
    return (
      '<div class="result-group ' + className + '">' +
      '<div class="group-head">' +
      "<h2>" + title + '<span class="result-count">' + recipes.length + " 道</span></h2>" +
      (note ? '<span class="group-note">' + note + "</span>" : "") +
      "</div>" +
      '<div class="card-grid">' + cards + "</div>" +
      (footer || "") +
      "</div>"
    );
  }

  function renderResults(exact, near) {
    if (!exact.length && !near.length) {
      resultsEl.innerHTML =
        '<p class="no-result">沒有找到符合的料理，試試看少選一種食材，或換成其他常見食材。</p>';
      return;
    }
    resultsEl.innerHTML =
      groupHtml("可以直接煮", "exact", exact, false) +
      groupHtml("只差一兩樣", "near", near, true);
  }

  function findRecipeById(id) {
    return RECIPES.find((r) => r.id === id);
  }

  const WHOLE_INGREDIENTS = new Set(INGREDIENT_CATALOG.filter((i) => i.whole).map((i) => i.name));

  // 依人數比例換算食材份量，並四捨五入成看起來合理的數字
  function scaleAmount(amount, ratio, unit, name) {
    const scaled = amount * ratio;
    let rounded;
    if (WHOLE_INGREDIENTS.has(name) && unit !== "克") {
      // 雞蛋、雞翅這類只能一顆一顆算：無條件捨去成整數、最少 1
      // （3 顆／2 人 → 1 人份是 1 顆不是 2 顆；寧可少一點，2026-09-17 Bryant 定）
      rounded = Math.max(1, Math.floor(scaled + 1e-9));
    } else if (DISCRETE_UNITS.indexOf(unit) !== -1) {
      rounded = Math.round(scaled * 2) / 2; // 最小到 0.5
      if (rounded < 0.5) rounded = 0.5;
    } else if (unit === "克") {
      rounded = scaled < 50 ? Math.round(scaled / 5) * 5 : Math.round(scaled / 10) * 10;
      if (rounded < 5) rounded = 5;
    } else if (unit === "大匙") {
      rounded = Math.round(scaled * 2) / 2;
      if (rounded < 0.5) rounded = 0.5;
    } else if (unit === "小匙") {
      // 少鹽原則（2026-09-18）：小匙允許到 1/4，鹽減人份時不會被抬回半小匙
      rounded = Math.round(scaled * 4) / 4;
      if (rounded < 0.25) rounded = 0.25;
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
    const whole = Math.floor(n);
    const frac = Math.round((n - whole) * 4) / 4;
    if (frac === 0.5) return whole + ".5";
    if (frac === 0.25 || frac === 0.75) return whole + "又" + (frac === 0.25 ? "1/4" : "3/4");
    return String(n);
  }

  function ingredientTableHtml(recipe, servings) {
    const ratio = servings / recipe.baseServings;
    const rows = recipe.ingredients
      .map((ing) => {
        const amount = scaleAmount(ing.amount, ratio, ing.unit, ing.name);
        return '<div class="row"><span class="name">' + ing.name + '</span><span class="amount">' + formatAmount(amount) + " " + ing.unit + "</span></div>";
      })
      .join("");
    return '<div class="ingredient-table">' + rows + "</div>";
  }

  // 調味料：蒜瓣、薑片、辣椒這類論個的最少 1、取整；少許／適量（amount 為 null）不換算
  const SEASONING_WHOLE_UNITS = ["瓣", "片", "根", "顆", "塊", "小塊", "段"];

  function scaleSeasoning(item, ratio) {
    if (item.amount === null || item.amount === undefined) return item.unit;
    let n;
    if (SEASONING_WHOLE_UNITS.indexOf(item.unit) !== -1) {
      n = Math.max(1, Math.round(item.amount * ratio));
    } else {
      n = scaleAmount(item.amount, ratio, item.unit, item.name);
    }
    return formatAmount(n) + " " + item.unit;
  }

  function seasoningTableHtml(recipe, servings) {
    const list = recipe.seasonings || [];
    if (!list.length) return "";
    const ratio = servings / recipe.baseServings;
    const rows = list
      .map((s) => '<div class="row"><span class="name">' + s.name + '</span><span class="amount">' + scaleSeasoning(s, ratio) + "</span></div>")
      .join("");
    return (
      '<h3 class="seasoning-title">調味料</h3>' +
      '<div class="ingredient-table seasoning-table">' + rows +
      '<div class="pantry">鹽、糖、醬油、蒜、薑這些常備品不用選就能找到食譜；用量以 1 大匙 = 15 ml、1 小匙 = 5 ml 計</div>' +
      "</div>"
    );
  }

  // 「動手時間」之外的等待提示：資料沒有 wait 欄位，依類型給一句
  function waitNote(recipe) {
    let text = "";
    if (recipe.prep === "weekend") text = "週末做一鍋，分裝冷藏可放 3 天";
    else if (recipe.tool === "電鍋") text = "電鍋按下去就不用顧，等它跳起來";
    else if (recipe.tool === "烤箱" || recipe.tool === "氣炸鍋") text = "進" + recipe.tool + "之後不用顧火";
    else if (recipe.method === "燉" || recipe.method === "滷") text = "動手之外還要小火慢燉，不用一直顧";
    if (!text) return "";
    return (
      '<div class="wait-note">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>' +
      "<span>" + text + "</span></div>"
    );
  }

  function renderModalBody() {
    const recipe = currentRecipe;
    const stepList = recipe.steps
      .map((st, i) => '<li><span class="step-no">' + (i + 1) + '</span><span class="step-text">' + st + "</span></li>")
      .join("");
    const pills = [];
    if (recipe.prep === "weekend") pills.push('<span class="pill weekend">週末做一鍋</span>');
    if (recipe.bento) pills.push('<span class="pill bento">便當 OK</span>');
    pills.push('<span class="pill">' + recipe.cuisine + "・" + recipe.method + "・" + recipe.diet + (recipe.tool ? "・" + recipe.tool : "") + "</span>");

    modalBody.innerHTML =
      '<div class="sheet-handle"></div>' +
      '<div class="detail-head">' +
      '<div class="detail-title"><h2>' + recipe.name + "</h2>" +
      '<div class="pill-row">' + pills.join("") + "</div></div>" +
      '<div class="time-hero"><div class="n">' + recipe.time + '</div><div class="u">分鐘動手</div></div>' +
      "</div>" +
      waitNote(recipe) +
      '<div class="section-head"><h3>準備材料</h3>' +
      '<div class="servings-control">' +
      '<button type="button" class="servings-btn" data-action="dec" aria-label="減少人份">－</button>' +
      '<span class="servings-count">' + currentServings + " 人份</span>" +
      '<button type="button" class="servings-btn" data-action="inc" aria-label="增加人份">＋</button>' +
      "</div></div>" +
      ingredientTableHtml(recipe, currentServings) +
      seasoningTableHtml(recipe, currentServings) +
      '<h3 class="steps-title">步驟</h3>' +
      '<ol class="steps">' + stepList + "</ol>";
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
    const title = anyFilterOn() ? "符合條件的料理" : "10 分鐘開飯";
    const shown = list.slice(0, defaultShown);
    const remaining = list.length - shown.length;
    const footer = remaining > 0
      ? '<div class="more-row"><button type="button" class="more-btn" id="more-btn">再看 ' + Math.min(PAGE_SIZE, remaining) + " 道</button></div>"
      : "";
    resultsEl.innerHTML = groupHtml(title, "default", shown, false, "時間短的在前", footer);
    // 數量顯示用總數，不是本頁數
    const count = resultsEl.querySelector(".result-count");
    if (count) count.textContent = list.length + " 道";
  }

  function runSearch() {
    const userIngredients = currentIngredients();
    syncIngredientChips(userIngredients);
    renderTokens(selected);
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
    defaultShown = PAGE_SIZE;
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
  [methodSel, toolSel, dietSel, cuisineSel].forEach((sel) => sel.addEventListener("change", () => {
    defaultShown = PAGE_SIZE;
    sel.classList.toggle("set", !!sel.value);
    runSearch();
  }));

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
    const chosen = new Set(currentIngredients());
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
    commitInput();
    selected = selected.includes(name) ? selected.filter((n) => n !== name) : selected.concat(name);
    runSearch();
  });

  // ── 食材選擇面板（收合條／已選 tokens） ──────────────────────────────
  function renderTokens(tokens) {
    const all = currentIngredients();
    tokenRow.innerHTML = tokens
      .map((n) =>
        '<button type="button" class="token" data-ingredient="' + n + '" aria-label="移除 ' + n + '"><span>' + n + "</span>" +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"></path></svg></button>'
      ).join("");
    if (all.length) {
      pickerSummary.textContent = all.join("、");
      pickerSummary.classList.add("has-items");
      pickerAction.textContent = "改食材";
    } else {
      pickerSummary.textContent = "冰箱有什麼？點選或輸入食材";
      pickerSummary.classList.remove("has-items");
      pickerAction.textContent = "選食材";
    }
  }

  function setPickerOpen(open) {
    pickerPanel.hidden = !open;
    pickerBar.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && !activeCategory) {
      activeCategory = INGREDIENT_CATEGORIES[0];
      renderCategoryChips();
      renderIngredientChips();
    }
  }

  pickerBar.addEventListener("click", () => setPickerOpen(pickerPanel.hidden));

  tokenRow.addEventListener("click", (e) => {
    const t = e.target.closest(".token");
    if (!t) return;
    const name = t.dataset.ingredient;
    selected = selected.filter((n) => n !== name);
    runSearch();
  });

  resultsEl.addEventListener("click", (e) => {
    if (e.target.closest("#more-btn")) {
      defaultShown += PAGE_SIZE;
      renderDefault();
    }
  });

  renderCategoryChips();
  renderTokens([]);
  renderDefault();

  searchBtn.addEventListener("click", () => { commitInput(); runSearch(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { commitInput(); runSearch(); }
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
