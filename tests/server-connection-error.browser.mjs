// Run with node; PLAYWRIGHT_MODULE_PATH can point to a bundled Playwright install.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const server = await createServer({
  server: { port: 5198, host: "127.0.0.1" },
  plugins: [
    {
      name: "connection-error-test-page",
      configureServer(vite) {
        vite.middlewares.use("/__connection-test", async (_req, res) => {
          res.setHeader("Content-Type", "text/html");
          res.end(
            await vite.transformIndexHtml(
              "/__connection-test",
              '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/tests/fixtures/connection-error-harness.tsx"></script></body></html>',
            ),
          );
        });
      },
    },
  ],
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || "msedge",
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const base = `http://127.0.0.1:${server.config.server.port}/__connection-test`;
try {
  for (const theme of ["light", "dark"]) {
    for (const [width, height] of [
      [320, 568],
      [350, 765],
      [375, 812],
      [768, 1024],
      [1280, 800],
      [667, 375],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${base}?theme=${theme}`);
      await page.getByRole("dialog").waitFor();
      const layout = await page
        .locator(".server-connection-error")
        .evaluate((element) => {
          const footer = element
            .querySelector("footer")
            .getBoundingClientRect();
          return {
            width: element.clientWidth,
            scrollWidth: element.scrollWidth,
            footerBottom: footer.bottom,
            footerTop: footer.top,
            background: getComputedStyle(element).backgroundColor,
          };
        });
      assert.equal(layout.width, layout.scrollWidth, `overflow at ${width}`);
      assert.ok(layout.footerBottom <= height && layout.footerTop > 0);
      assert.equal(
        layout.background,
        theme === "dark" ? "rgb(33, 38, 45)" : "rgb(244, 250, 253)",
      );
      await page
        .getByRole("button", { name: "تلاش مجدد", exact: true })
        .scrollIntoViewIfNeeded();
      if (width === 350 && process.env.CONNECTION_SCREENSHOT_DIR) {
        await page.screenshot({
          path: `${process.env.CONNECTION_SCREENSHOT_DIR}/connection-${theme}.png`,
        });
      }
    }
  }
  await page.goto(base);
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "تلاش مجدد", exact: true }).click();
  await page.getByRole("button", { name: "تلاش مجدد", exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.requestAttempts()), 2);
  await page.evaluate(() => window.recoverConnection());
  await page.getByRole("button", { name: "تلاش مجدد", exact: true }).click();
  await page.getByText("recovered", { exact: true }).waitFor();
  await page.getByRole("dialog").waitFor({ state: "detached" });

  await page.goto(`${base}?scenario=api`);
  await page.getByText("error", { exact: true }).waitFor();
  assert.equal(
    await page.getByRole("dialog").count(),
    0,
    "HTTP 500 stays an API error",
  );

  await page.goto(`${base}?scenario=offline`);
  await page.getByRole("dialog").waitFor();
  assert.equal(
    await page.evaluate(() => window.requestAttempts()),
    0,
    "offline requests are paused",
  );
  await page.evaluate(() => window.recoverConnection());
  await page.getByText("recovered", { exact: true }).waitFor();

  await page.goto(`${base}?scenario=mutation`);
  await page.getByText("submit", { exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.evaluate(() => window.recoverConnection());
  await page.getByRole("button", { name: "تلاش مجدد", exact: true }).click();
  await page.getByText("saved", { exact: true }).waitFor();
  await page.getByRole("dialog").waitFor({ state: "detached" });

  await page.goto(base);
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "برگشت به صفحه اصلی" }).click();
  await page.getByText("home", { exact: true }).waitFor();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.goto(`${base}?scenario=background`);
  await page.getByText("cached content", { exact: true }).waitFor();
  const backgroundToast = page.locator(
    '[data-sonner-toast][data-removed="false"]',
  );
  await backgroundToast.waitFor();
  assert.equal(
    await page.getByRole("dialog").count(),
    0,
    "cached UI remains usable during background failures",
  );
  await page.evaluate(() => window.recoverConnection());
  await backgroundToast.getByRole("button", { name: "تلاش مجدد" }).click();
  await page.getByText("recovered", { exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "Passed: responsive light/dark layouts, retry failure/recovery, API classification, offline pause, mutation callbacks, home action.",
  );
} finally {
  await browser.close();
  await server.close();
}
