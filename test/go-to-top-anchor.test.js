import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// A sticky header reports its stuck position as the fragment target, so
// href="#top" only nudges the page by scroll-padding instead of y=0.
test("Top link targets a non-sticky anchor ahead of the site header", () => {
  const header = readFileSync(new URL("../_includes/header.html", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../_layouts/default.html", import.meta.url), "utf8");
  const post = readFileSync(new URL("../_layouts/post.html", import.meta.url), "utf8");

  assert.match(post, /class="go-to-top[^"]*" href="#top"/);
  assert.doesNotMatch(header, /id="top"/);
  const topId = layout.indexOf('id="top"');
  const headerInclude = layout.indexOf("include header.html");
  assert.ok(topId !== -1 && topId < headerInclude);
});
