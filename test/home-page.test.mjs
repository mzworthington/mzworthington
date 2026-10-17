import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const home = readFileSync(new URL("../_layouts/home.html", import.meta.url), "utf8");

test("hero states the career span under the headline", () => {
  const hero = home.slice(home.indexOf('class="site-hero"'), home.indexOf("</header>"));
  assert.match(
    hero,
    /Engineering leader with over two decades of experience building and scaling software organisations, from music and fashion publishing to banking, the public sector, and global iGaming/,
  );
});
