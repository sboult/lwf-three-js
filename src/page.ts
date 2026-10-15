export function renderPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Spinning Lambda</title>
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
        top: 9vh;
        margin: 0;
        color: #aeb8c8;
        font-size: clamp(.8rem, 2vw, 1rem);
        letter-spacing: .28em;
        text-transform: uppercase;
      }
    </style>
    <script src="/client.js" type="module"></script>
  </head>
  <body>
    <main class="scene" aria-label="Spinning orange AWS Lambda coaster">
      <canvas id="lambda-canvas"></canvas>
    </main>
    <p class="label">AWS Lambda Web Functions</p>
  </body>
</html>`;
}
