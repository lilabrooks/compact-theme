import { existsSync, lstatSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "_site");

const expectedFiles = [
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return listFiles(path);
    return [relative(output, path)];
  });
}

assert(existsSync(output), "Pages artifact has not been built");

const actualFiles = listFiles(output).sort();
assert(JSON.stringify(actualFiles) === JSON.stringify(expectedFiles), `Unexpected Pages artifact contents:\n${actualFiles.join("\n")}`);

for (const relativePath of actualFiles) {
  assert(!lstatSync(resolve(output, relativePath)).isSymbolicLink(), `Pages artifact contains a symbolic link: ${relativePath}`);
}

for (const privatePath of [".github", "node_modules", "package-lock.json", "package.json", "playwright.config.js", "tests"]) {
  assert(!existsSync(resolve(output, privatePath)), `Development path leaked into Pages artifact: ${privatePath}`);
}

console.log(`Pages artifact checks passed (${actualFiles.length} allowlisted files, no development paths).`);
