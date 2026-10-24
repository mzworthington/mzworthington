import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { activeHeadingId, chipScrollDelta } from "../assets/js/section-nav.js";

const story = readFileSync(
  new URL("../_posts/2026-10-03-building-a-story-box-for-romy.markdown", import.meta.url),
  "utf8",
);
const layout = readFileSync(new URL("../_layouts/post.html", import.meta.url), "utf8");
const include = readFileSync(new URL("../_includes/section_nav.html", import.meta.url), "utf8");
const folio = readFileSync(new URL("../_sass/_folio-layout.scss", import.meta.url), "utf8");

test("the section that has reached the chip row is the current one", () => {
  const headings = [
    { id: "what-it-had-to-be", top: 40 },
    { id: "the-wooden-cube", top: 800 },
  ];

  assert.equal(activeHeadingId(headings, 120), "what-it-had-to-be");
  assert.equal(activeHeadingId(headings, 800), "the-wooden-cube");
  assert.equal(activeHeadingId([{ id: "what-it-had-to-be", top: 400 }], 120), null);
});

test("a chip past the edge of the row is the one that scrolls", () => {
  const list = { left: 0, right: 300 };

  assert.equal(chipScrollDelta({ left: 20, right: 140 }, list, 12), 0);
  assert.equal(chipScrollDelta({ left: 280, right: 420 }, list, 12), 132);
  assert.equal(chipScrollDelta({ left: -40, right: 80 }, list, 12), -52);
});

test("the story page opts into a heading nav that stays inside the screen", () => {
  assert.match(story, /^section_nav:\s*true$/m);
  assert.match(layout, /include section_nav\.html/);
  assert.match(layout, /type="module"[^>]*section-nav\.js/);
  assert.match(include, /split: '<h2'/);
  assert.match(include, /aria-label="On this page"/);
  assert.match(folio, /nav\.section-nav:not\(\[id="toc"\]\)/);
  assert.match(folio, /flex-wrap:\s*wrap/);
  assert.match(folio, /flex-wrap:\s*nowrap/);
  assert.match(folio, /overflow-x:\s*auto/);
});
