import { expect, test } from "vitest";
import { renderPage } from "../src/page.ts";

test("renders an accessible Three.js Lambda coaster page", () => {
  const html = renderPage({
    origin: "https://lambda.example.com",
    twitterSite: "@awsdevelopers",
  });

  expect(html).toMatch(/Spinning orange AWS Lambda coaster/);
  expect(html).toMatch(/id="lambda-canvas"/);
  expect(html).toMatch(/src="\/client\.js"/);
  expect(html).toMatch(/cursor: grab/);
  expect(html).toMatch(/<span>AWS Lambda<\/span>/);
  expect(html).toMatch(/<span>Web Functions<\/span>/);
  expect(html).toMatch(/name="twitter:card" content="player"/);
  expect(html).toMatch(
    /name="twitter:player" content="https:\/\/lambda\.example\.com\/embed"/,
  );
  expect(html).toMatch(
    /name="twitter:image" content="https:\/\/lambda\.example\.com\/preview\.png"/,
  );
  expect(html).toMatch(/name="twitter:player:width" content="480"/);
  expect(html).toMatch(/name="twitter:player:height" content="480"/);
});

test("renders an embed with the heading and without share metadata", () => {
  const html = renderPage({ embed: true });

  expect(html).toMatch(/<body class="embed">/);
  expect(html).toMatch(/class="label"/);
  expect(html).toMatch(/<span>AWS Lambda<\/span>/);
  expect(html).toMatch(/<span>Web Functions<\/span>/);
  expect(html).not.toMatch(/twitter:card/);
});
