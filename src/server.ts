import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_TWITTER_SITE, EMBED_PATH } from "./constants.ts";
import { renderPage } from "./page.ts";

const DEFAULT_PORT = "3000";
const STATIC_CACHE_MAX_AGE = "1d";
const PAGE_CACHE_CONTROL = "public, max-age=300";
const BASE_CONTENT_SECURITY_POLICY =
  "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'";

const [hostname, rawPort] = (
  process.env.AWS_LAMBDA_HTTP_ENDPOINT ??
  `127.0.0.1:${process.env.PORT ?? DEFAULT_PORT}`
).split(":");
const port = Number(rawPort);

export const app = express();
const publicDirectory = process.env.AWS_LAMBDA_HTTP_ENDPOINT
  ? fileURLToPath(new URL("./public/", import.meta.url))
  : path.resolve("dist/web/public");

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(
  express.static(publicDirectory, {
    fallthrough: true,
    index: false,
    maxAge: STATIC_CACHE_MAX_AGE,
  }),
);

function requestOrigin(request: express.Request): string {
  const configuredOrigin = process.env.PUBLIC_ORIGIN?.replace(/\/+$/, "");
  if (configuredOrigin) {
    return configuredOrigin;
  }

  const forwardedProtocol = request.get("x-forwarded-proto")?.split(",")[0];
  const protocol = forwardedProtocol?.trim() || request.protocol;
  return `${protocol}://${request.get("host")}`;
}

function commonHeaders(response: express.Response): express.Response {
  return response.set({
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
  });
}

app.get("/", (request, response) => {
  const origin = requestOrigin(request);

  commonHeaders(response)
    .set({
      "cache-control": PAGE_CACHE_CONTROL,
      "content-security-policy": `${BASE_CONTENT_SECURITY_POLICY}; frame-ancestors 'none'`,
    })
    .type("html")
    .send(
      renderPage({
        origin,
        twitterSite: process.env.TWITTER_SITE ?? DEFAULT_TWITTER_SITE,
      }),
    );
});

app.get(EMBED_PATH, (_request, response) => {
  commonHeaders(response)
    .set({
      "cache-control": PAGE_CACHE_CONTROL,
      "content-security-policy": `${BASE_CONTENT_SECURITY_POLICY}; frame-ancestors https://x.com https://twitter.com https://*.x.com https://*.twitter.com`,
    })
    .type("html")
    .send(renderPage({ embed: true }));
});

app.use((_request, response) => {
  response.status(404).type("text").send("Not found");
});

export const server = app.listen(port, hostname, () => {
  console.log(`Spinning Lambda is listening on http://${hostname}:${port}`);
});
