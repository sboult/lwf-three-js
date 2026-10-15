import assert from "node:assert/strict";
import test from "node:test";
import { renderPage } from "../src/page.js";

test("renders an accessible animated Lambda page", () => {
  const html = renderPage();

  assert.match(html, /Spinning orange Lambda icon/);
  assert.match(html, /class="tile depth"/);
  assert.match(html, /#fffaf5/);
  assert.match(html, /@keyframes spin/);
  assert.match(html, /@keyframes glint/);
  assert.match(html, /prefers-reduced-motion/);
});
