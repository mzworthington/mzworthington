import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import test from "node:test";

const post = readFileSync(
  new URL("../_posts/2026-10-24-building-a-story-box-for-romy.markdown", import.meta.url),
  "utf8",
);
const layout = readFileSync(new URL("../_layouts/post.html", import.meta.url), "utf8");
const demoButton = readFileSync(new URL("../_includes/try_the_demo.html", import.meta.url), "utf8");
const folio = readFileSync(new URL("../_sass/_folio-layout.scss", import.meta.url), "utf8");

test("the story box post sends readers to the public demo", () => {
  assert.match(post, /^demo:\s*https:\/\/romini\.party\s*$/m);
  assert.match(post, /\[romini\.party\]\(https:\/\/romini\.party\)/);
  assert.match(post, /\[play with the demo dashboard\]\(https:\/\/romini\.party\)/);
  assert.match(layout, /try_the_demo\.html/);
  assert.match(layout, /class="post-actions"/);
  assert.match(demoButton, /class="button"/);
  assert.match(demoButton, /page\.demo/);
  assert.match(demoButton, /Try the demo/);

  const writing = folio.slice(folio.indexOf("body.is-writing {"));
  const actions = writing.slice(writing.indexOf("article .post-actions"));
  assert.match(actions, /display:\s*flex/);
  assert.match(actions, /flex-wrap:\s*wrap/);
});
