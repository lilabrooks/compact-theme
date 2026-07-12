import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 320, height: 568, columns: 1, header: "column", shell: 288 },
  { name: "mobile-breakpoint", width: 760, height: 900, columns: 1, header: "column", shell: 728 },
  { name: "tablet", width: 768, height: 1024, columns: 2, header: "row", shell: 720 },
  { name: "large-tablet", width: 1024, height: 1366, columns: 2, header: "row", shell: 976 },
  { name: "desktop", width: 1440, height: 900, columns: 2, header: "row", shell: 1180 },
  { name: "wide", width: 1920, height: 1080, columns: 2, header: "row", shell: 1344 },
  { name: "wide-qhd", width: 2560, height: 1440, columns: 2, header: "row", shell: 1360 },
  { name: "ultrawide", width: 3440, height: 1440, columns: 2, header: "row", shell: 1360 }
];

const visualViewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 2560, height: 1440 }
];

test("loads local assets and enhances the page", async ({ page }) => {
  const browserProblems = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) browserProblems.push(message.text());
  });
  page.on("pageerror", (error) => browserProblems.push(error.message));

  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveTitle("Compact Theme showcase");
  await expect(page.locator("html")).toHaveClass(/compact-theme-ready/);
  await expect(page.locator(".compact-code-frame")).toHaveCount(4);
  await expect(page.locator(".compact-code-label")).toHaveText(["HTML", "Shell", "Theme tokens", "Page head"]);
  await expect(page.locator("#code").getByRole("button", { name: "Copy HTML code" })).toBeVisible();

  const fontsLoaded = await page.evaluate(() => ({
    mono: document.fonts.check('14px "IBM Plex Mono"'),
    sans: document.fonts.check('17px "IBM Plex Sans"')
  }));
  expect(fontsLoaded).toEqual({ mono: true, sans: true });
  expect(browserProblems).toEqual([]);
});

test("showcases the published components and utilities", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".compact-card")).toHaveCount(14);
  await expect(page.getByRole("img", { name: "Responsive Compact Theme media sample" })).toBeVisible();
  await expect(page.locator("pre[data-no-copy]")).toBeVisible();
  await expect(page.locator("pre[data-no-copy]").locator("xpath=..")).not.toHaveClass(/compact-code-frame/);
  await expect(page.locator(".compact-sr-only")).toHaveText("section");
  await expect(page.getByRole("link", { name: "Download latest release" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Validate this page" })).toBeVisible();
});

test("uses semantic landmarks and valid fragment targets", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();

  const integrity = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll("[id]"), (element) => element.id);
    const fragments = Array.from(document.querySelectorAll('a[href^="#"]'), (link) => link.getAttribute("href"));
    return {
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
      missingTargets: fragments.filter((href) => href.length > 1 && !document.getElementById(href.slice(1))),
      buttonsWithoutType: document.querySelectorAll("button:not([type])").length
    };
  });

  expect(integrity).toEqual({ duplicateIds: [], missingTargets: [], buttonsWithoutType: 0 });
});

test("has no detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("switches theme and persists the selection", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Use light mode" });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Use dark mode" })).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Use dark mode" })).toBeVisible();
});

test("copies code in Chromium", async ({ browserName, context, page }) => {
  test.skip(browserName !== "chromium", "Clipboard verification runs in Chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:4173" });
  await page.goto("/");

  const codeSection = page.locator("#code");
  await codeSection.getByRole("button", { name: "Copy HTML code" }).click();
  await expect(codeSection.getByRole("button", { name: "HTML code copied" })).toHaveText("Copied");

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe('<link rel="stylesheet" href="./compact-theme.css">\n<script src="./compact-theme.js" defer></script>');
});

test("keeps the page readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("[data-theme-toggle]")).toBeHidden();
  await expect(page.locator(".compact-code-frame")).toHaveCount(0);
  await expect(page.locator("pre").first()).toBeVisible();

  await context.close();
});

test("keeps responsive layouts within the viewport", async ({ page }) => {
  for (const viewport of viewports) {
    await test.step(viewport.name, async () => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const grid = getComputedStyle(document.querySelector(".compact-grid"));
        const header = getComputedStyle(document.querySelector(".compact-header"));
        const shell = document.querySelector(".compact-shell").getBoundingClientRect();
        const pre = document.querySelector("pre");
        return {
          columns: grid.gridTemplateColumns.split(" ").filter(Boolean).length,
          header: header.flexDirection,
          overflow: root.scrollWidth > root.clientWidth,
          shell: shell.width,
          codeScroll: pre.scrollWidth > pre.clientWidth
        };
      });

      expect(metrics.overflow).toBe(false);
      expect(metrics.columns).toBe(viewport.columns);
      expect(metrics.header).toBe(viewport.header);
      expect(metrics.shell).toBeCloseTo(viewport.shell, 0);
      if (viewport.width === 320) expect(metrics.codeScroll).toBe(true);
    });
  }
});

for (const viewport of visualViewports) {
  for (const theme of ["light", "dark"]) {
    test(`${viewport.name} ${theme} @visual`, async ({ browserName, page }) => {
      test.skip(browserName !== "chromium", "Visual baselines use Chromium");
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("compact-theme", selectedTheme);
      }, theme);
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page).toHaveScreenshot(`${viewport.name}-${theme}.png`, {
        fullPage: true,
        scale: "css"
      });
    });
  }
}
