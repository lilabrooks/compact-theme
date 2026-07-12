# Compact Theme

[![Tests](https://github.com/lilabrooks/compact-theme/actions/workflows/tests.yml/badge.svg)](https://github.com/lilabrooks/compact-theme/actions/workflows/tests.yml)
[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD--2--Clause-blue.svg)](LICENSE)
[![W3C validation](https://img.shields.io/w3c-validation/default?targetUrl=https%3A%2F%2Flilabrooks.github.io%2Fcompact-theme%2F)](https://validator.w3.org/nu/?doc=https%3A%2F%2Flilabrooks.github.io%2Fcompact-theme%2F)

Compact Theme is a portable HTML, CSS, and JavaScript theme built with IBM Plex Sans and IBM Plex Mono. It includes light and dark palettes, compact layouts, responsive navigation, and readable code blocks. Consumer sites need no framework, package install, or build step.

## Quick links

- [Live showcase](https://lilabrooks.github.io/compact-theme/)
- [Latest release](https://github.com/lilabrooks/compact-theme/releases/latest)
- [Download v1.0.0 ZIP](https://github.com/lilabrooks/compact-theme/releases/download/v1.0.0/compact-theme-v1.0.0.zip)
- [W3C validation](https://validator.w3.org/nu/?doc=https%3A%2F%2Flilabrooks.github.io%2Fcompact-theme%2F)

## Contents

- [Distribution](#distribution)
- [Files](#files)
- [Install](#install)
- [Theme behavior](#theme-behavior)
- [Code blocks](#code-blocks)
- [Layout and palette](#layout-and-palette)
- [Showcase](#showcase)
- [Tests and compatibility](#tests-and-compatibility)
- [Publishing](#publishing)
- [Licence and attribution](#licence-and-attribution)

## Distribution

Download the clean consumer bundle from the [latest GitHub release](https://github.com/lilabrooks/compact-theme/releases/latest). The current file is [`compact-theme-v1.0.0.zip`](https://github.com/lilabrooks/compact-theme/releases/download/v1.0.0/compact-theme-v1.0.0.zip).

The ZIP contains 11 public theme, documentation, font, and licence files. Tests, screenshots, package metadata, dependencies, and workflows appear only in GitHub's source archives. Future releases attach a new ZIP and SHA-256 checksum.

## Files

- `compact-theme.css`: colours, typography, components, responsive rules, and code styling
- `compact-theme.js`: theme preferences, language labels, and code-copy controls
- `index.html`: complete component reference and GitHub Pages entry point
- `fonts/`: bundled IBM Plex files and their SIL Open Font License
- `LICENSE` and `COPYRIGHT.txt`: BSD 2-Clause terms and attribution
- `.nojekyll`: prevents Jekyll processing when the repository is served directly

## Install

Copy the distribution into your site, keep `fonts/` beside the stylesheet, and load the assets:

```html
<link rel="stylesheet" href="/theme/compact-theme.css">
<script src="/theme/compact-theme.js" defer></script>
```

Relative paths work for GitHub project Pages and nested sites. Use `index.html` as the semantic starting point.

## Theme behavior

The first visit follows the system colour preference. Add the persistent control anywhere in the page:

```html
<button class="compact-theme-toggle" type="button" data-theme-toggle hidden>
  Theme
</button>
```

The script reveals the button and stores the choice in `localStorage`. Without JavaScript, the button stays hidden and the system palette still applies. Set `data-theme="light"` or `data-theme="dark"` on `<html>` to force a mode. Use `data-theme-storage-key="my-site-theme"` when several themes share one domain.

## Code blocks

Semantic code markup receives a label and copy button:

```html
<pre><code class="language-shell">npm install
npm test</code></pre>
```

Labels cover Shell, JavaScript, TypeScript, HTML, CSS, JSON, Markdown, Python, and YAML. Override a label or leave a block untouched:

```html
<pre data-code-label="Configuration"><code>theme: compact</code></pre>
<pre data-no-copy><code>This block receives no toolbar.</code></pre>
```

## Layout and palette

The main layout classes are:

- `compact-shell`: centred content width
- `compact-header`, `compact-brand`, `compact-nav`: header and navigation
- `compact-hero`, `compact-title`, `compact-lede`: opening section
- `compact-section`, `compact-section-head`, `compact-section-title`: content sections
- `compact-grid`, `compact-card`, `compact-card-title`: bordered card grid
- `compact-button`, `compact-button-primary`: actions
- `compact-footer`: footer

Base styles cover text, links, focus states, inline code, responsive media, and unenhanced `pre` elements. The shell grows from 1180px to 1360px on wide screens.

Override variables after the theme stylesheet:

```css
:root {
  --compact-accent: #82afff;
  --compact-content-width: 1180px;
}

[data-theme="light"] {
  --compact-accent: #315f9f;
}
```

## Showcase

The [GitHub Pages site](https://lilabrooks.github.io/compact-theme/) is the live reference for components, theme behavior, responsive layouts, accessibility utilities, and code treatment.

For local review, serve this directory with any static file server and open `index.html`.

## Tests and compatibility

| Area | Coverage |
| --- | --- |
| Browsers and CI | Chromium, Firefox, and WebKit from Playwright 1.61.1; pinned Noble Linux container |
| Functional behavior | Local assets, fonts, theme persistence, labels, copy controls, fragments, and semantic landmarks |
| Layout and visuals | Responsive checks from 320 to 3440px; light and dark Chromium baselines on macOS and Linux |
| Accessibility | Axe in Chromium, Firefox, and WebKit; keyboard focus and semantic checks |
| JavaScript fallback | Content, system palette, and raw code checked with JavaScript disabled in all 3 engines |
| HTML | Live page checked by the W3C Nu validator |
| Packaging | Exact 11-file allowlist with development-file leak and symlink checks |
| Tool consistency | Playwright package, CI image, and Linux snapshot image must use the same exact version |

Install the development tools once, then run the complete suite:

```shell
npm install
npx playwright install chromium firefox webkit
npm test
```

After an intentional visual change, review the page and update both baseline sets:

```shell
npm run test:update-snapshots
npm run test:update-snapshots:linux
```

The Linux command requires Docker.

## Publishing

Pushes to `main` test, build, and deploy the allowlisted `_site` artifact. Pull requests test without deploying. Set **GitHub Actions** as the Pages publishing source.

Tags matching `vMAJOR.MINOR.PATCH` test and publish a clean ZIP with its SHA-256 checksum. The release workflow can also rebuild an existing tag manually.

## Licence and attribution

The code, documentation, and example page use the BSD 2-Clause License. Redistribution must retain the copyright notice, conditions, and disclaimer in `LICENSE`.

Use this notice when referencing the theme:

```text
Compact Theme — Copyright (c) 2026 Lila Brooks
Licensed under the BSD 2-Clause License.
```

The bundled IBM Plex files retain IBM's copyright and use the SIL Open Font License in `fonts/LICENSE.txt`.
