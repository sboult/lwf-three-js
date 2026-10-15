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
  twitterSite = "@seanboult",
}: PageOptions = {}): string {
  const title = "AWS Lambda Web Functions";
  const description = "Interactive 3D AWS Lambda coaster";
  const playerUrl = origin ? `${origin}/embed` : undefined;
  const imageUrl = origin ? `${origin}/preview.png` : undefined;

  const cardMetadata =
    !embed && playerUrl && imageUrl
      ? `
    <meta name="twitter:card" content="player">
    <meta name="twitter:site" content="${escapeAttribute(twitterSite)}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:player" content="${escapeAttribute(playerUrl)}">
    <meta name="twitter:player:width" content="480">
    <meta name="twitter:player:height" content="480">
    <meta name="twitter:image" content="${escapeAttribute(imageUrl)}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${escapeAttribute(imageUrl)}">`
      : "";

  const bodyClass = embed ? "embed" : "share";
  const heading = embed
    ? ""
    : `
    <h1 class="label">
      <span>AWS Lambda</span>
      <span>Web Functions</span>
    </h1>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${description}">
    <title>${title}</title>${cardMetadata}
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
        display: grid;
        place-items: center;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 42%, #303d55 0, #121a29 36%, #070a10 74%);
      }

      .scene {
        width: min(82vw, 560px);
        aspect-ratio: 1;
      }

      .embed .scene {
        width: 100vw;
        height: 100vh;
        aspect-ratio: auto;
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
        position: fixed;
        top: 7vh;
        margin: 0;
        color: #f4f7fb;
        font-size: clamp(1.8rem, 5vw, 3.4rem);
        font-weight: 800;
        line-height: .98;
        letter-spacing: -.035em;
        text-align: center;
      }

      .label span { display: block; }
    </style>
    <script src="/client.js" type="module"></script>
  </head>
  <body class="${bodyClass}">
    <main class="scene" aria-label="Spinning orange AWS Lambda coaster">
      <canvas id="lambda-canvas"></canvas>
    </main>${heading}
  </body>
</html>`;
}
