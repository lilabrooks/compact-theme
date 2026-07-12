import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { publicFiles } from "./public-files.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "_site");

rmSync(output, { force: true, recursive: true });

for (const relativePath of publicFiles) {
  const destination = resolve(output, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(root, relativePath), destination);
}

console.log(`Built GitHub Pages artifact with ${publicFiles.length} public files.`);
