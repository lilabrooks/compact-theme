# Compact Theme

[![Tests](https://github.com/lilabrooks/compact-theme/actions/workflows/tests.yml/badge.svg)](https://github.com/lilabrooks/compact-theme/actions/workflows/tests.yml)
[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD--2--Clause-blue.svg)](LICENSE)

Compact Theme is a portable static website theme built around IBM Plex Sans and IBM Plex Mono. It includes light and dark palettes, compact editorial layouts, responsive navigation, readable code blocks, and automatic copy buttons.

It uses plain CSS and JavaScript. There is no build step or package dependency.

## Files

- `compact-theme.css`: colours, typography, layout components, responsive rules, and code styling
- `compact-theme.js`: theme switching, preference storage, language labels, and code-copy controls
- `index.html`: complete starter page and GitHub Pages entry point
- `LICENSE`: the BSD 2-Clause software licence
- `COPYRIGHT.txt`: the attribution and copyright notice to retain
- `.nojekyll`: bypasses Jekyll processing on GitHub Pages
- `fonts/`: the bundled IBM Plex font files and their licence

## Add it to a site

Copy this folder into the site, then include the stylesheet and script:

```html
<link rel="stylesheet" href="/theme/compact-theme.css">
<script src="/theme/compact-theme.js" defer></script>
```

Relative paths work too. Keep the `fonts` directory beside the stylesheet.

## Theme switching

The theme follows the visitor's system preference until they choose a mode. Add this button anywhere in the page:

```html
<button class="compact-theme-toggle" type="button" data-theme-toggle hidden>
  Theme
</button>
```

The script reveals the button, switches between light and dark mode, and remembers the selection in `localStorage`.

To force a mode without JavaScript, set `data-theme` on the root element:

```html
<html lang="en" data-theme="dark">
```

Use `light` for the light palette. Remove the attribute to return to the system preference.

For multiple themes on the same domain, give this theme its own storage key:

```html
<html lang="en" data-theme-storage-key="my-site-theme">
```

## Code blocks

Use semantic code markup. The script adds the toolbar and copy control:

```html
<pre><code class="language-shell">npm install
npm run build</code></pre>
```

Supported language labels include Shell, JavaScript, TypeScript, HTML, CSS, JSON, Markdown, Python, and YAML. Set a custom label on either the `pre` or `code` element:

```html
<pre data-code-label="Configuration"><code>theme: compact</code></pre>
```

Add `data-no-copy` to the `pre` or `code` element to leave a block unmodified.

Short references use ordinary inline code:

```html
<p>Edit <code>config.yml</code> before publishing.</p>
```

## Layout classes

The example page demonstrates the main layout classes:

- `compact-shell`: centred content width
- `compact-header`, `compact-brand`, `compact-nav`: site header
- `compact-hero`, `compact-title`, `compact-lede`: opening section
- `compact-section`, `compact-section-head`, `compact-section-title`: compact content sections
- `compact-grid`, `compact-card`, `compact-card-title`: bordered card grid
- `compact-button`, `compact-button-primary`: links and actions
- `compact-footer`: compact footer

The base stylesheet also styles body text, links, focus states, inline code, and unenhanced `pre` elements.

## Change the palette

Override the CSS variables after loading the theme:

```css
:root {
  --compact-accent: #82afff;
  --compact-content-width: 1180px;
}

[data-theme="light"] {
  --compact-accent: #315f9f;
}
```

Dark and light mode keep separate background, text, muted-text, divider, panel, and accent values. Code blocks intentionally keep a dark surface in both modes so scripts stay visually distinct.

The default content shell grows from 1180px to 1360px on wide screens. Override `--compact-content-width` after loading the theme to use a fixed maximum width.

## Preview

Serve this directory with any static file server and open the site root or `index.html`.

## Tests

The published theme has no runtime dependencies. Development tests use Playwright and Axe to check Chromium, Firefox, and WebKit behavior, responsive layouts, theme persistence, code copying, local assets, accessibility rules, and visual baselines.

Install the development dependencies and browser binaries once:

```shell
npm install
npx playwright install chromium firefox webkit
```

Run the complete suite:

```shell
npm test
```

After an intentional visual change, review the rendered pages and update the Chromium baselines:

```shell
npm run test:update-snapshots
npm run test:update-snapshots:linux
```

The Linux update command requires Docker. GitHub Actions runs the same suite for every push and pull request in a pinned Playwright Linux image. Visual baselines are stored separately for macOS and Linux so font-rendering differences do not create false failures.

## GitHub Pages deployment

Pushes to `main` run the complete test suite, build an allowlisted `_site` artifact, and deploy it through GitHub Pages after the tests pass. Pull requests run tests without deploying.

The public artifact contains only the theme page, stylesheet, script, documentation, licences, and bundled fonts. Development dependencies, tests, screenshots, package metadata, and workflow files remain outside the deployed site.

In the repository's Pages settings, select **GitHub Actions** as the publishing source.

## Releases

Semantic-version tags in the form `vMAJOR.MINOR.PATCH` trigger the release workflow. It runs the complete test suite, builds the allowlisted public distribution, creates a ZIP archive and SHA-256 checksum, and publishes both files to the matching GitHub release.

The workflow can also be run manually for an existing semantic-version tag. Re-running it replaces the generated ZIP and checksum without changing the tagged source.

## Licence and attribution

Compact Theme code, documentation, and example page are licensed under the BSD 2-Clause License. You may use, modify, and redistribute them, including commercially, provided redistributed copies retain the copyright notice, licence conditions, and disclaimer in `LICENSE`.

Use this attribution notice when referencing the theme:

```text
Compact Theme — Copyright (c) 2026 Lila Brooks
Licensed under the BSD 2-Clause License.
```

The bundled IBM Plex font files retain IBM's copyright and are distributed under the SIL Open Font License in `fonts/LICENSE.txt`.
