import { createServer } from "node:http";
import { renderPage } from "./page.js";

const port = Number(process.env.PORT ?? 3000);
const hostname = "127.0.0.1";

const server = createServer((request, response) => {
  if (request.url !== "/") {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "content-security-policy":
      "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
  });
  response.end(renderPage());
});

server.listen(port, hostname, () => {
  console.log(`Spinning Lambda is running at http://${hostname}:${port}`);
});
