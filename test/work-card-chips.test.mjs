import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const template = readFileSync(new URL("../_includes/side_projects.html", import.meta.url), "utf8");

function element(tag, attrs = {}) {
  const node = {
    tag,
    attrs: { ...attrs },
    hidden: Boolean(attrs.hidden),
    children: [],
    parent: null,
    listeners: {},
    setAttribute(name, value) {
      this.attrs[name] = String(value);
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null;
    },
    addEventListener(type, fn) {
      this.listeners[type] = this.listeners[type] || [];
      this.listeners[type].push(fn);
    },
    matches(selector) {
      return matches(this, selector);
    },
    querySelector(selector) {
      return walk(this).find((candidate) => matches(candidate, selector)) || null;
    },
    querySelectorAll(selector) {
      return walk(this).filter((candidate) => matches(candidate, selector));
    },
  };
  return node;
}

function walk(node) {
  const found = [];
  for (const child of node.children) {
    found.push(child, ...walk(child));
  }
  return found;
}

function matches(node, selector) {
  if (selector.startsWith("#")) return node.attrs.id === selector.slice(1);
  if (selector.startsWith(".")) return (node.attrs.class || "").split(/\s+/).includes(selector.slice(1));
  return node.tag === selector;
}

function append(parent, child) {
  child.parent = parent;
  parent.children.push(child);
  return child;
}

function click(node) {
  for (const fn of node.listeners.click || []) fn();
}

test("clicking a grouped project chip reveals that part and collapses it again", async () => {
  assert.match(template, /item\.description/);
  assert.match(template, /aria-expanded/);
  assert.match(template, /work-card__part-panel/);

  const { bindWorkCardChips } = await import("../assets/js/work-cards.js");
  const card = element("li", { class: "work-card work-card--group" });
  const list = append(card, element("ul", { class: "work-card__parts" }));
  const canvas = append(
    append(list, element("li")),
    element("button", {
      class: "work-card__chip",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "part-archlens-canvas",
    }),
  );
  const cli = append(
    append(list, element("li")),
    element("button", {
      class: "work-card__chip",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "part-archlens-cli",
    }),
  );
  const panels = append(card, element("div", { class: "work-card__part-panels" }));
  const canvasPanel = append(
    panels,
    element("div", { id: "part-archlens-canvas", class: "work-card__part-panel", hidden: true }),
  );
  const cliPanel = append(
    panels,
    element("div", { id: "part-archlens-cli", class: "work-card__part-panel", hidden: true }),
  );

  bindWorkCardChips(card);

  click(canvas);
  assert.equal(canvas.getAttribute("aria-expanded"), "true");
  assert.equal(canvasPanel.hidden, false);
  assert.equal(cli.getAttribute("aria-expanded"), "false");
  assert.equal(cliPanel.hidden, true);

  click(cli);
  assert.equal(canvas.getAttribute("aria-expanded"), "false");
  assert.equal(canvasPanel.hidden, true);
  assert.equal(cli.getAttribute("aria-expanded"), "true");
  assert.equal(cliPanel.hidden, false);

  click(cli);
  assert.equal(cli.getAttribute("aria-expanded"), "false");
  assert.equal(cliPanel.hidden, true);
});
