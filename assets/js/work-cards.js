export function bindWorkCardChips(root) {
  var cards =
    root.matches && root.matches(".work-card--group")
      ? [root]
      : Array.from(root.querySelectorAll(".work-card--group"));

  cards.forEach(bindCard);
}

function bindCard(card) {
  var chips = card.querySelectorAll(".work-card__chip");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var expanded = chip.getAttribute("aria-expanded") === "true";
      closeChips(card);
      if (!expanded) openChip(card, chip);
    });
  });
}

function closeChips(card) {
  card.querySelectorAll(".work-card__chip").forEach(function (chip) {
    chip.setAttribute("aria-expanded", "false");
  });
  card.querySelectorAll(".work-card__part-panel").forEach(function (panel) {
    panel.hidden = true;
  });
}

function openChip(card, chip) {
  var panelId = chip.getAttribute("aria-controls");
  var panel = panelId ? card.querySelector("#" + panelId) : null;
  chip.setAttribute("aria-expanded", "true");
  if (panel) panel.hidden = false;
}

if (typeof document !== "undefined") {
  bindWorkCardChips(document);
}
