import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import test from "node:test";

const folio = readFileSync(new URL("../_sass/_folio-layout.scss", import.meta.url), "utf8");

function writingMainRule() {
  const writing = folio.slice(folio.indexOf("body.is-writing {"));
  const marker = ">main {";
  const start = writing.indexOf(marker);
  assert.notEqual(start, -1, "writing layout declares a main rule");
  return writing.slice(start, writing.indexOf("}", start));
}

test("writing code button keeps the github mark at icon size", () => {
  const writing = folio.slice(folio.indexOf("body.is-writing {"));
  const mediaRule = writing.slice(writing.indexOf("article svg"));
  const buttonRule = writing.slice(writing.indexOf("article .button {"));

  assert.match(mediaRule, /article svg:not\(\.svg-icon\)/);
  assert.match(buttonRule, /\.svg-icon\s*\{[^}]*height:\s*1rem/);
  assert.match(buttonRule, /\.svg-icon\s*\{[^}]*width:\s*1rem/);
});

test("writing column padding sits inside the viewport width", () => {
  const main = writingMainRule();

  assert.match(main, /width:\s*min\(100%,\s*50rem\)/);
  assert.match(main, /padding-inline:\s*clamp\(1rem,\s*3vw,\s*2\.5rem\)/);
  assert.match(main, /box-sizing:\s*border-box/);
  assert.match(main, /min-width:\s*0/);
  assert.match(main, /max-width:\s*100%/);
});
