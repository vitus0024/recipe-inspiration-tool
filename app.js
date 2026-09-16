(function () {
  const input = document.getElementById("ingredient-input");
  const searchBtn = document.getElementById("search-btn");
  const resultsEl = document.getElementById("results");
  const modal = document.getElementById("detail-modal");
  const modalBody = document.getElementById("modal-body");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const closeModalBtn = document.getElementById("close-modal");

  const MIN_SERVINGS = 1;
  const MAX_SERVINGS = 10;
  const DISCRETE_UNITS = ["顆", "條", "片", "塊", "根", "朵", "把", "碗", "盒", "包", "支"];

  let currentRecipe = null;
  let currentServings = 1;

  function tagRow(recipe, servingsOverride) {
    const dietClass = recipe.diet === "素" ? "veg" : "";
    const servingsLabel = (servingsOverride || recipe.baseServings) + "人份";
    return (
      '<div class="tag-row">' +
      '<span class="tag">' + recipe.cuisine + "</span>" +
      '<span class="tag">' + recipe.method + "</span>" +
      '<span class="tag ' + dietClass + '">' + recipe.diet + "</span>" +
      '<span class="tag">' + servingsLabel + "</span>" +
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
      "<h2>" + title + "</h2>" +
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

  function runSearch() {
    const userIngredients = parseInput(input.value);
    if (!userIngredients.length) {
      resultsEl.innerHTML =
        '<p class="empty-state">先輸入手邊的食材，按「找料理」看看今晚能煮什麼 🍳</p>';
      return;
    }
    const { exact, near } = matchRecipes(userIngredients, RECIPES);
    renderResults(exact, near);
  }

  searchBtn.addEventListener("click", runSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
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
