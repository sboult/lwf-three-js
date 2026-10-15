import assert from "node:assert/strict";
import test from "node:test";
import { renderPage } from "../src/page.js";

test("renders an accessible animated Lambda page", () => {
  const html = renderPage();

  assert.match(html, /Spinning orange Lambda icon/);
  assert.match(html, /#ff9900/);
  assert.match(html, /@keyframes spin/);
  assert.match(html, /prefers-reduced-motion/);
});
