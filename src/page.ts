import {
  APP_DESCRIPTION,
  APP_TITLE,
  CLIENT_SCRIPT_PATH,
  DEFAULT_TWITTER_SITE,
  DOCUMENTATION_URL,
  EMBED_PATH,
  PREVIEW_IMAGE_PATH,
  SOURCE_CODE_URL,
} from "./constants.ts";

export interface PageOptions {
  embed?: boolean;
  origin?: string;
  twitterSite?: string;
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderPage({
  embed = false,
  origin,
  twitterSite = DEFAULT_TWITTER_SITE,
}: PageOptions = {}): string {
  const playerUrl = origin ? `${origin}${EMBED_PATH}` : undefined;
  const imageUrl = origin ? `${origin}${PREVIEW_IMAGE_PATH}` : undefined;

  const cardMetadata =
    !embed && playerUrl && imageUrl
      ? `
    <meta name="twitter:card" content="player">
    <meta name="twitter:site" content="${escapeAttribute(twitterSite)}">
    <meta name="twitter:title" content="${APP_TITLE}">
    <meta name="twitter:description" content="${APP_DESCRIPTION}">
    <meta name="twitter:player" content="${escapeAttribute(playerUrl)}">
    <meta name="twitter:player:width" content="480">
    <meta name="twitter:player:height" content="480">
    <meta name="twitter:image" content="${escapeAttribute(imageUrl)}">
    <meta property="og:title" content="${APP_TITLE}">
    <meta property="og:description" content="${APP_DESCRIPTION}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${escapeAttribute(imageUrl)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${APP_DESCRIPTION}">`
      : "";

  const bodyClass = embed ? "embed" : "share";
  const heading = `
    <h1 class="label">
      <a class="docs-link" href="${DOCUMENTATION_URL}" target="_blank" rel="noreferrer">
        Web Function Demo
      </a>
    </h1>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${APP_DESCRIPTION}">
    <title>${APP_TITLE}</title>${cardMetadata}
    <style>
      :root {
        color-scheme: dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
        background: #080c13;
        color: #f7f8fa;
      }

      * { box-sizing: border-box; }

      body {
        min-height: 100vh;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 42%, #303d55 0, #121a29 36%, #070a10 74%);
      }

      .scene {
        width: min(82vw, 68vh, 560px);
        aspect-ratio: 1;
      }

      .content {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #lambda-canvas {
        display: block;
        width: 100%;
        height: 100%;
        cursor: grab;
        touch-action: none;
        filter: drop-shadow(0 26px 26px rgb(0 0 0 / 32%));
      }

      #lambda-canvas:active { cursor: grabbing; }

      .label {
        position: relative;
        z-index: 1;
        margin: 7vh 0 0;
        color: #f4f7fb;
        font-size: clamp(1.8rem, 5vw, 3.4rem);
        font-weight: 800;
        line-height: 1.08;
        letter-spacing: -.035em;
        text-align: center;
      }

      .label span { display: block; }

      .docs-link {
        color: #58a6ff;
        text-decoration: underline;
        text-decoration-thickness: .06em;
        text-underline-offset: .16em;
      }

      .source-link {
        color: #c8d8f0;
        font-size: .9rem;
        text-underline-offset: .25em;
      }

      .source-link:hover { color: #fff; }

      .footer {
        position: fixed;
        z-index: 1;
        bottom: 3vh;
        left: 50%;
        transform: translateX(-50%);
      }
    </style>
    <script src="${CLIENT_SCRIPT_PATH}" type="module"></script>
  </head>
  <body class="${bodyClass}">
    ${heading}
    <div class="content">
      <main class="scene" aria-label="Spinning orange AWS Lambda coaster">
        <canvas id="lambda-canvas"></canvas>
      </main>
    </div>
    <footer class="footer">
      <a class="source-link" href="${SOURCE_CODE_URL}" target="_blank" rel="noreferrer">View source code</a>
    </footer>
  </body>
</html>`;
}
