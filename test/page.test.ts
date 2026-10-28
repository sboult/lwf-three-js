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
  expect(html).toMatch(/Web Function Demo/);
  expect(html).toMatch(
    /href="https:\/\/docs\.aws\.amazon\.com\/lambda\/latest\/dg\/web-functions\.html"/,
  );
  expect(html).toMatch(
    /href="https:\/\/github\.com\/sboult\/lwf-three-js"/,
  );
  expect(html).toMatch(/<footer class="footer">/);
  expect(html).toMatch(/>View source code<\/a>/);
  expect(html).toMatch(/name="twitter:card" content="player"/);
  expect(html).toMatch(
    /name="twitter:player" content="https:\/\/lambda\.example\.com\/embed"/,
  );
  expect(html).toMatch(
    /name="twitter:image" content="https:\/\/lambda\.example\.com\/og\.png"/,
  );
  expect(html).toMatch(
    /property="og:image" content="https:\/\/lambda\.example\.com\/og\.png"/,
  );
  expect(html).toMatch(/property="og:image:width" content="1200"/);
  expect(html).toMatch(/property="og:image:height" content="630"/);
  expect(html).toMatch(/name="twitter:player:width" content="480"/);
  expect(html).toMatch(/name="twitter:player:height" content="480"/);
});

test("renders an embed with the heading and without share metadata", () => {
  const html = renderPage({ embed: true });

  expect(html).toMatch(/<body class="embed">/);
  expect(html).toMatch(/class="label"/);
  expect(html).toMatch(/Web Function Demo/);
  expect(html).not.toMatch(/twitter:card/);
  expect(html).not.toMatch(/\.embed \.scene/);
});
