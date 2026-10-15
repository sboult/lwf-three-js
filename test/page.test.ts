import assert from "node:assert/strict";
import test from "node:test";
import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { handler } from "../src/handler.js";
import { renderPage } from "../src/page.js";

test("renders an accessible animated Lambda page", () => {
  const html = renderPage();

  assert.match(html, /Spinning orange Lambda icon/);
  assert.match(html, /#ff9900/);
  assert.match(html, /@keyframes spin/);
  assert.match(html, /prefers-reduced-motion/);
});

test("handler returns the page as HTML", async () => {
  const response = (await handler(
    {} as never,
    {} as never,
    () => {},
  )) as APIGatewayProxyStructuredResultV2;

  assert.equal(response?.statusCode, 200);
  assert.equal(response?.headers?.["content-type"], "text/html; charset=utf-8");
  assert.match(response?.body ?? "", /<svg class="lambda"/);
});
