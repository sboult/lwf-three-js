import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const publicDirectory = path.resolve("dist/local/public");

await mkdir(publicDirectory, { recursive: true });
await Promise.all([
  build({
    entryPoints: ["src/client.ts"],
    outfile: path.join(publicDirectory, "client.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true,
  }),
  copyFile("src/assets/texture.png", path.join(publicDirectory, "texture.png")),
  copyFile("src/assets/texture.png", path.join(publicDirectory, "preview.png")),
]);

process.env.PUBLIC_DIRECTORY = publicDirectory;
await import("./server.ts");
