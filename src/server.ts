import express from "express";
import { renderPage } from "./page.js";

const [hostname, rawPort] = (
  process.env.AWS_LAMBDA_HTTP_ENDPOINT ??
  `127.0.0.1:${process.env.PORT ?? "3000"}`
).split(":");
const port = Number(rawPort);

export const app = express();

app.disable("x-powered-by");

app.get("/", (_request, response) => {
  response
    .set({
      "cache-control": "public, max-age=300",
      "content-security-policy":
        "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'",
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
