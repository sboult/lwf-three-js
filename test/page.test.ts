import assert from "node:assert/strict";
import test from "node:test";
import { renderPage } from "../src/page.ts";

test("renders an accessible Three.js Lambda coaster page", () => {
  const html = renderPage();

  assert.match(html, /Spinning orange AWS Lambda coaster/);
  assert.match(html, /id="lambda-canvas"/);
  assert.match(html, /src="\/client\.js"/);
});
