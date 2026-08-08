(function () {
  var THEMES = ["mist", "folio"];
  var DEFAULT_THEME = "folio";
  var PARAM = "theme";

  function normalize(theme) {
    if (!theme) return DEFAULT_THEME;
    return THEMES.indexOf(String(theme).toLowerCase()) >= 0
      ? String(theme).toLowerCase()
      : DEFAULT_THEME;
  }

  function themeFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      return normalize(params.get(PARAM));
    } catch (_err) {
      return DEFAULT_THEME;
    }
  }

  function applyTheme(theme) {
    var next = normalize(theme);
    document.documentElement.setAttribute("data-theme", next);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      var styles = getComputedStyle(document.documentElement);
      var color = styles.getPropertyValue("--theme-color").trim();
      if (color) meta.setAttribute("content", color);
    }
  }

  applyTheme(themeFromQuery());

  // Print / PDF CV (footer control on home)
  var printDetailsState = [];

  function openDetailsForPrint() {
    printDetailsState = [];
    document.querySelectorAll("details").forEach(function (details) {
      printDetailsState.push({ el: details, open: details.open });
      details.open = true;
    });
  }

  function restoreDetailsAfterPrint() {
    printDetailsState.forEach(function (entry) {
      entry.el.open = entry.open;
    });
    printDetailsState = [];
  }

  window.addEventListener("beforeprint", openDetailsForPrint);
  window.addEventListener("afterprint", restoreDetailsAfterPrint);

  document.querySelectorAll("[data-print-cv]").forEach(function (button) {
    button.addEventListener("click", function () {
      openDetailsForPrint();
      window.print();
    });
  });
})();
