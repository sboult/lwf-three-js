import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { build } from "esbuild";

await rm("dist/web", { force: true, recursive: true });

await build({
  entryPoints: ["src/server.ts"],
  outfile: "dist/web/index.js",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node24",
  banner: {
    js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);',
  },
  minify: true,
  sourcemap: true,
});

await build({
  entryPoints: ["src/client.ts"],
  outfile: "dist/web/public/client.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: true,
  sourcemap: true,
});

await mkdir("dist/web/public", { recursive: true });
await writeFile("dist/web/package.json", '{"type":"module"}\n');
await Promise.all([
  copyFile("src/assets/texture.png", "dist/web/public/texture.png"),
  copyFile("src/assets/texture.png", "dist/web/public/preview.png"),
]);
