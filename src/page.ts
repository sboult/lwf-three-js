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
        background: #0b1019;
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
          radial-gradient(circle at 50% 45%, #253147 0, #111827 34%, #080c13 72%);
      }

      .scene {
        width: min(68vw, 360px);
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        perspective: 900px;
      }

      .lambda {
        width: 72%;
        height: 72%;
        filter: drop-shadow(0 22px 30px rgb(255 153 0 / 28%));
        animation: spin 3.2s linear infinite;
        transform-style: preserve-3d;
      }

      .lambda path {
        fill: #ff9900;
        stroke: #ffc46b;
        stroke-width: 2;
        stroke-linejoin: round;
      }

      .label {
        position: fixed;
        bottom: 9vh;
        margin: 0;
        color: #aeb8c8;
        font-size: clamp(.8rem, 2vw, 1rem);
        letter-spacing: .28em;
        text-transform: uppercase;
      }

      @keyframes spin {
        from { transform: rotateY(0deg) rotateX(-8deg); }
        to { transform: rotateY(360deg) rotateX(-8deg); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lambda { animation: none; }
      }
    </style>
  </head>
  <body>
    <main class="scene" aria-label="Spinning orange Lambda icon">
      <svg class="lambda" viewBox="0 0 220 260" role="img" aria-label="Lambda">
        <path d="M36 20h65l31 75 24 58 27-51h37l-53 138h-38L75 58H36z"/>
      </svg>
    </main>
    <p class="label">AWS Lambda</p>
  </body>
</html>`;
}
