import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5199 },
  plugins: [
    {
      name: "error-boundary-test-page",
      configureServer(vite) {
        vite.middlewares.use("/__error-test", async (_req, res) => {
          res.setHeader("Content-Type", "text/html");
          res.end(
            await vite.transformIndexHtml(
              "/__error-test",
              '<html><body><div id="root"></div><script type="module" src="/tests/fixtures/error-boundary-harness.tsx"></script></body></html>',
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
const uncaught = [];
page.on("pageerror", (error) => uncaught.push(error.message));
const base = `http://127.0.0.1:${server.config.server.port}/__error-test`;
const fallback = page.locator('section[role="alert"]');
const toasts = page.locator('[data-sonner-toast][data-removed="false"]');
try {
  await page.goto(base);
  await fallback.waitFor();
  await toasts.first().waitFor();
  assert.equal(
    await toasts.count(),
    1,
    "one toast for a caught error in StrictMode",
  );
  await page.getByRole("button", { name: "Unaffected 0" }).click();
  await page.getByRole("button", { name: "Unaffected 1" }).waitFor();
  const attempts = await page.evaluate(() => window.renderAttempts());
  await fallback.getByRole("button").click();
  await fallback.waitFor();
  assert.ok(
    (await page.evaluate(() => window.renderAttempts())) > attempts,
    "retry remounts the failed section",
  );
  await page.getByRole("link", { name: "Healthy page" }).click();
  await page.getByText("Healthy content", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Unaffected 1" }).waitFor();
  await page.getByRole("link", { name: "Broken page" }).click();
  await fallback.waitFor();
  await page.evaluate(() => window.recoverRender());
  await fallback.getByRole("button").click();
  await page.getByText("Recovered section", { exact: true }).waitFor();
  await fallback.waitFor({ state: "detached" });

  await page.goto(`${base}?scenario=loader`);
  await fallback.waitFor();
  await toasts.first().waitFor();
  await page.getByRole("button", { name: "Unaffected 0" }).click();
  await page.evaluate(() => window.recoverRender());
  await fallback.getByRole("button").click();
  await page.getByText("Loader recovered", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Unaffected 1" }).waitFor();

  await page.goto(`${base}?scenario=optional`);
  await toasts.first().waitFor();
  assert.equal(
    await fallback.count(),
    0,
    "optional UI failure needs only a toast",
  );
  await page.getByText("Healthy content", { exact: true }).waitFor();
  await page.evaluate(() => window.recoverRender());
  await toasts.getByRole("button", { name: "تلاش مجدد" }).click();
  await page.getByText("Recovered section", { exact: true }).waitFor();

  await page.goto(`${base}?scenario=root`);
  await fallback.waitFor();
  await toasts.first().waitFor();
  await page.evaluate(() => window.recoverRender());
  await fallback.getByRole("button").click();
  await page.getByText("Recovered section", { exact: true }).waitFor();
  assert.deepEqual(
    uncaught,
    [],
    "all injected render and loader failures are caught",
  );
  console.log(
    "Passed: scoped render recovery, persistent failures, navigation/state preservation, loader retry, optional toast recovery, root fallback with live Toaster.",
  );
} finally {
  await browser.close();
  await server.close();
}
