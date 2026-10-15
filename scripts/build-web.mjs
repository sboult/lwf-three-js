import { rm } from "node:fs/promises";
import { build } from "esbuild";

await rm("dist/web", { force: true, recursive: true });

await build({
  entryPoints: ["src/server.ts"],
  outfile: "dist/web/index.js",
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node24",
  minify: true,
  sourcemap: true,
});
