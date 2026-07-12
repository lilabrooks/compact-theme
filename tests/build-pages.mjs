import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "_site");

const files = [
  "COPYRIGHT.txt",
  "LICENSE",
  "README.md",
  "compact-theme.css",
  "compact-theme.js",
  "fonts/IBMPlexMono-Regular.woff2",
  "fonts/IBMPlexMono-SemiBold.woff2",
  "fonts/IBMPlexSans-Regular.woff2",
  "fonts/IBMPlexSans-SemiBold.woff2",
  "fonts/LICENSE.txt",
  "index.html"
];

rmSync(output, { force: true, recursive: true });

for (const relativePath of files) {
  const destination = resolve(output, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(root, relativePath), destination);
}

console.log(`Built GitHub Pages artifact with ${files.length} public files.`);
