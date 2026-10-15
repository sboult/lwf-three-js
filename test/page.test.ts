import assert from "node:assert/strict";
import test from "node:test";
import { renderPage } from "../src/page.js";

test("renders an accessible animated Lambda page", () => {
  const html = renderPage();

  assert.match(html, /Spinning orange Lambda icon/);
  assert.match(html, /class="tile back"/);
  assert.match(html, /class="side left"/);
  assert.match(html, /class="side right"/);
  assert.match(html, /class="side top"/);
  assert.match(html, /class="side bottom"/);
  assert.match(html, /#fffaf5/);
  assert.match(html, /@keyframes spin/);
  assert.match(html, /@keyframes glint/);
  assert.match(html, /prefers-reduced-motion/);
});
