import { copyFile, rm, writeFile } from "node:fs/promises";
import { build } from "esbuild";

await rm("dist/web", { force: true, recursive: true });

await build({
  entryPoints: ["src/server.ts"],
  outfile: "dist/web/index.js",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node24",
  minify: true,
  sourcemap: true,
});

await build({
  entryPoints: ["src/client.ts"],
  outfile: "dist/web/client.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: true,
  sourcemap: true,
});

await writeFile("dist/web/package.json", '{"type":"module"}\n');
await copyFile("src/assets/texture.png", "dist/web/texture.png");
