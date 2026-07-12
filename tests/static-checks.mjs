import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const requiredFiles = [
  ".nojekyll",
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

for (const relativePath of requiredFiles) {
  assert(existsSync(resolve(root, relativePath)), `Missing required file: ${relativePath}`);
}

assert(!existsSync(resolve(root, "example.html")), "Stale example.html should not exist");
assert(statSync(resolve(root, ".nojekyll")).size === 0, ".nojekyll must remain empty");

const html = readFileSync(resolve(root, "index.html"), "utf8");
const css = readFileSync(resolve(root, "compact-theme.css"), "utf8");
const javascript = readFileSync(resolve(root, "compact-theme.js"), "utf8");
const license = readFileSync(resolve(root, "LICENSE"), "utf8");
const fontLicense = readFileSync(resolve(root, "fonts/LICENSE.txt"), "utf8");

assert(/^<!doctype html>/i.test(html), "index.html must start with an HTML5 doctype");
assert(/<html\s+lang="en"/i.test(html), "index.html must declare its language");
assert(/<meta\s+name="viewport"/i.test(html), "index.html must include a viewport meta tag");
assert(/<script\s+src="\.\/compact-theme\.js"\s+defer><\/script>/i.test(html), "Theme script must load with defer");
assert((html.match(/<h1\b/gi) || []).length === 1, "index.html must contain exactly one h1");
assert((html.match(/<main\b/gi) || []).length === 1, "index.html must contain exactly one main landmark");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert(new Set(ids).size === ids.length, "index.html contains duplicate ids");

const fragmentLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
for (const fragment of fragmentLinks) {
  assert(ids.includes(fragment), `Missing fragment target: #${fragment}`);
}

const localReferences = [...html.matchAll(/<(?:a|link|script)\b[^>]*\b(?:href|src)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => !/^(?:#|https?:|mailto:|tel:|data:)/i.test(reference));

for (const reference of localReferences) {
  const cleanReference = reference.split(/[?#]/)[0];
  const target = cleanReference === "./" ? "index.html" : cleanReference.replace(/^\.\//, "");
  assert(existsSync(resolve(root, target)), `Broken local reference: ${reference}`);
}

const declaredVariables = new Set([...css.matchAll(/(--compact-[a-z-]+)\s*:/g)].map((match) => match[1]));
const usedVariables = new Set([...css.matchAll(/var\((--compact-[a-z-]+)/g)].map((match) => match[1]));
for (const variable of usedVariables) {
  assert(declaredVariables.has(variable), `Undefined CSS variable: ${variable}`);
}

assert(javascript.includes('"use strict"'), "Theme JavaScript must use strict mode");
assert(license.includes("BSD 2-Clause License"), "Software licence identifier is missing");
assert(license.includes("Copyright (c) 2026 Lila Brooks"), "Software copyright notice is missing");
assert(fontLicense.includes("SIL OPEN FONT LICENSE Version 1.1"), "IBM font licence is missing");

console.log(`Static checks passed (${requiredFiles.length} required files, ${localReferences.length} local references).`);
