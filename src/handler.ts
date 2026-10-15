import type {
  APIGatewayProxyResultV2,
  Handler,
  LambdaFunctionURLHandler,
} from "aws-lambda";
import { renderPage } from "./page.js";

export const handler: Handler<
  Parameters<LambdaFunctionURLHandler>[0],
  APIGatewayProxyResultV2
> = async () => ({
  statusCode: 200,
  headers: {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "public, max-age=300",
    "content-security-policy":
      "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
  },
  body: renderPage(),
});
