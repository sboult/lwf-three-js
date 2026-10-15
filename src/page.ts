export function renderPage(): string {
  const lambdaMark = `
    <svg class="mark" viewBox="0 0 1000 1000" aria-hidden="true">
      <path d="M250 205 H520 L760 695 H845 V810 H665 L405 325 H250 Z M405 810 H205 L405 410 L515 620 Z"/>
    </svg>`;

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
          radial-gradient(circle at 50% 42%, #303d55 0, #121a29 36%, #070a10 74%);
      }

      .scene {
        width: min(72vw, 430px);
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        perspective: 1100px;
      }

      .spinner {
        --thickness: 34px;
        position: relative;
        width: 76%;
        aspect-ratio: 1;
        transform-style: preserve-3d;
        animation: spin 5.5s cubic-bezier(.45, 0, .55, 1) infinite;
      }

      .tile {
        position: absolute;
        inset: 0;
        border-radius: 16%;
        backface-visibility: hidden;
      }

      .front,
      .back {
        display: grid;
        place-items: center;
        overflow: hidden;
      }

      .front {
        background:
          linear-gradient(145deg, rgb(255 255 255 / 18%), transparent 28%),
          linear-gradient(145deg, #f48416 0%, #db5f08 58%, #bb4300 100%);
        border: 1px solid rgb(255 207 153 / 45%);
        box-shadow:
          inset 0 2px 3px rgb(255 255 255 / 24%),
          inset -12px -14px 22px rgb(100 27 0 / 22%),
          0 28px 48px rgb(0 0 0 / 38%),
          0 12px 38px rgb(255 111 0 / 22%);
        transform: translateZ(calc(var(--thickness) / 2));
      }

      .front::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(115deg, transparent 32%, rgb(255 255 255 / 16%) 47%, transparent 61%);
        transform: translateX(-110%);
        animation: glint 5.5s ease-in-out infinite;
      }

      .back {
        background:
          linear-gradient(145deg, rgb(255 255 255 / 8%), transparent 32%),
          linear-gradient(145deg, #c84b00, #8e2d00);
        border: 1px solid rgb(255 166 92 / 34%);
        box-shadow: inset 10px 12px 24px rgb(66 17 0 / 30%);
        transform: rotateY(180deg) translateZ(calc(var(--thickness) / 2));
      }

      .back .mark {
        opacity: .68;
        filter: drop-shadow(0 5px 3px rgb(46 10 0 / 35%));
      }

      .side {
        position: absolute;
        border-radius: 5px;
        backface-visibility: hidden;
        background:
          linear-gradient(90deg, rgb(255 255 255 / 9%), transparent 38%),
          linear-gradient(#b13b00, #702000);
        box-shadow: inset 0 0 8px rgb(54 13 0 / 36%);
      }

      .left,
      .right {
        top: 8%;
        width: var(--thickness);
        height: 84%;
      }

      .left {
        left: calc(var(--thickness) / -2);
        transform: rotateY(-90deg);
      }

      .right {
        right: calc(var(--thickness) / -2);
        transform: rotateY(90deg);
      }

      .top,
      .bottom {
        left: 8%;
        width: 84%;
        height: var(--thickness);
        background:
          linear-gradient(rgb(255 255 255 / 13%), transparent 45%),
          linear-gradient(90deg, #d95508, #8d2900);
      }

      .top {
        top: calc(var(--thickness) / -2);
        transform: rotateX(90deg);
      }

      .bottom {
        bottom: calc(var(--thickness) / -2);
        transform: rotateX(-90deg);
      }

      .mark {
        width: 78%;
        height: 78%;
        overflow: visible;
        filter: drop-shadow(0 7px 4px rgb(91 25 0 / 30%));
      }

      .mark path {
        fill: none;
        stroke: #fffaf5;
        stroke-width: 34;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .label {
        position: fixed;
        top: 9vh;
        margin: 0;
        color: #aeb8c8;
        font-size: clamp(.8rem, 2vw, 1rem);
        letter-spacing: .28em;
        text-transform: uppercase;
      }

      @keyframes spin {
        0% { transform: rotateX(-10deg) rotateY(-28deg) rotateZ(-2deg); }
        50% { transform: rotateX(8deg) rotateY(152deg) rotateZ(2deg); }
        100% { transform: rotateX(-10deg) rotateY(332deg) rotateZ(-2deg); }
      }

      @keyframes glint {
        0%, 22% { transform: translateX(-110%); }
        42%, 100% { transform: translateX(110%); }
      }

      @media (prefers-reduced-motion: reduce) {
        .spinner { animation: none; transform: rotateX(-8deg) rotateY(-22deg); }
        .front::after { animation: none; }
      }
    </style>
  </head>
  <body>
    <main class="scene" aria-label="Spinning orange Lambda icon">
      <div class="spinner">
        <div class="side left" aria-hidden="true"></div>
        <div class="side right" aria-hidden="true"></div>
        <div class="side top" aria-hidden="true"></div>
        <div class="side bottom" aria-hidden="true"></div>
        <div class="tile back" aria-hidden="true">${lambdaMark}</div>
        <div class="tile front">
          <svg class="mark" viewBox="0 0 1000 1000" role="img" aria-label="AWS Lambda">
            <path d="M250 205 H520 L760 695 H845 V810 H665 L405 325 H250 Z M405 810 H205 L405 410 L515 620 Z"/>
          </svg>
        </div>
      </div>
    </main>
    <p class="label">AWS Lambda Web Functions</p>
  </body>
</html>`;
}
