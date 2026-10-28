import assert from "node:assert/strict";
import test from "node:test";
import { renderPage } from "../src/page.ts";

test("renders an accessible Three.js Lambda coaster page", () => {
  const html = renderPage({
    origin: "https://lambda.example.com",
    twitterSite: "@awsdevelopers",
  });

  assert.match(html, /Spinning orange AWS Lambda coaster/);
  assert.match(html, /id="lambda-canvas"/);
  assert.match(html, /src="\/client\.js"/);
  assert.match(html, /cursor: grab/);
  assert.match(html, /<span>AWS Lambda<\/span>/);
  assert.match(html, /<span>Web Functions<\/span>/);
  assert.match(html, /name="twitter:card" content="player"/);
  assert.match(
    html,
    /name="twitter:player" content="https:\/\/lambda\.example\.com\/embed"/,
  );
  assert.match(
    html,
    /name="twitter:image" content="https:\/\/lambda\.example\.com\/preview\.png"/,
  );
  assert.match(html, /name="twitter:player:width" content="480"/);
  assert.match(html, /name="twitter:player:height" content="480"/);
});

test("renders an embed with the heading and without share metadata", () => {
  const html = renderPage({ embed: true });

  assert.match(html, /<body class="embed">/);
  assert.match(html, /class="label"/);
  assert.match(html, /<span>AWS Lambda<\/span>/);
  assert.match(html, /<span>Web Functions<\/span>/);
  assert.doesNotMatch(html, /twitter:card/);
});
