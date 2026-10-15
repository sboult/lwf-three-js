import express from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { renderPage } from "./page.ts";

const [hostname, rawPort] = (
  process.env.AWS_LAMBDA_HTTP_ENDPOINT ??
  `127.0.0.1:${process.env.PORT ?? "3000"}`
).split(":");
const port = Number(rawPort);

export const app = express();
const clientBundlePath = process.env.AWS_LAMBDA_HTTP_ENDPOINT
  ? new URL("./client.js", import.meta.url)
  : path.resolve("dist/web/client.js");
const clientBundle = readFileSync(clientBundlePath, "utf8");
const texturePath = process.env.AWS_LAMBDA_HTTP_ENDPOINT
  ? new URL("./texture.png", import.meta.url)
  : path.resolve("dist/web/texture.png");
const texture = readFileSync(texturePath);

app.disable("x-powered-by");

app.get("/client.js", (_request, response) => {
  response.type("text/javascript").send(clientBundle);
});

app.get("/texture.png", (_request, response) => {
  response
    .set("cache-control", "public, max-age=86400")
    .type("image/png")
    .send(texture);
});

app.get("/", (_request, response) => {
  response
    .set({
      "cache-control": "public, max-age=300",
      "content-security-policy":
        "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
    })
    .type("html")
    .send(renderPage());
});

app.use((_request, response) => {
  response.status(404).type("text").send("Not found");
});

export const server = app.listen(port, hostname, () => {
  console.log(`Spinning Lambda is listening on http://${hostname}:${port}`);
});
