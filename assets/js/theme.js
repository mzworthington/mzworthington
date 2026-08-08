(function () {
  var STORAGE_KEY = "mzworthington-theme";
  var THEMES = ["mist", "folio"];
  var DEFAULT_THEME = "mist";

  function normalize(theme) {
    return THEMES.indexOf(theme) >= 0 ? theme : DEFAULT_THEME;
  }

  function currentTheme() {
    return normalize(document.documentElement.getAttribute("data-theme"));
  }

  function applyTheme(theme, persist) {
    var next = normalize(theme);
    document.documentElement.setAttribute("data-theme", next);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      var styles = getComputedStyle(document.documentElement);
      var color = styles.getPropertyValue("--theme-color").trim();
      if (color) meta.setAttribute("content", color);
    }

    document.querySelectorAll("[data-theme-set]").forEach(function (button) {
      var pressed = button.getAttribute("data-theme-set") === next;
      button.setAttribute("aria-pressed", pressed ? "true" : "false");
    });

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (_err) {
        // Ignore private-mode / blocked storage.
      }
    }
  }

  function bindSwitcher() {
    document.querySelectorAll("[data-theme-set]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyTheme(button.getAttribute("data-theme-set"), true);
      });
    });
  }

  // Sync pressed state if head script already set the attribute.
  applyTheme(currentTheme(), false);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindSwitcher);
  } else {
    bindSwitcher();
  }
})();
