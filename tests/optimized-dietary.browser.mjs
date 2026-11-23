// Run with Node and Playwright; PLAYWRIGHT_MODULE_PATH may point to an existing installation.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const ready = {
  success: true,
  data: {
    schema_version: "3.0",
    status: "needs_review",
    generation: { status: "idle" },
    validation: { valid: false, publishable: false },
    shopping: {
      basis: "week",
      groups: [
        {
          id: "grains",
          title: "Test basket",
          item_count: 1,
          items: [
            {
              id: "rice",
              source_id: 1,
              title: "Test rice",
              quantity_g: 500,
              image_url: "",
              quantity_label: "500 g",
            },
          ],
        },
      ],
    },
  },
};
const server = await createServer({
  cacheDir: "node_modules/.vite-optimized-dietary-test",
  server: { host: "127.0.0.1", port: 0 },
  plugins: [
    {
      name: "optimized-dietary-harness",
      configureServer(vite) {
        vite.middlewares.use("/__optimized-dietary", async (req, res) => {
          res.setHeader("Content-Type", "text/html");
          res.end(
            await vite.transformIndexHtml(
              req.originalUrl,
              '<html><body><div id="root"></div><script type="module" src="/tests/fixtures/optimized-dietary-harness.tsx"></script></body></html>',
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
  ...(process.env.BROWSER_EXECUTABLE_PATH
    ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH }
    : { channel: process.env.BROWSER_CHANNEL || "msedge" }),
});
const base = server.resolvedUrls.local[0];
const errors = [];
async function open(search, respond) {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
  await page.route("**/diet/v2/plan?diet=zistpa", respond);
  await page.route("**/diet/v2/plan/registered", () => {
    assert.fail("The optimized page must not request the registered plan");
  });
  await page.goto(`${base}__optimized-dietary${search}`);
  await page.getByRole("button", { name: "Unmount test page" }).waitFor();
  await page
    .locator('html[data-test-mounted="true"]')
    .waitFor({ state: "attached" });
  return page;
}
async function advance(page, ms) {
  await page.clock.fastForward(ms);
  // Allow React effects and TanStack Query's batched notifications to settle.
  await page.waitForTimeout(20);
  await page.clock.runFor(1);
}
async function waitForInitialDelay(page) {
  for (const ms of [3000, 3000, 3000, 6000, 4000, 4000, 6999]) {
    await advance(page, ms - 1);
  }
}

async function waitForFinalStep(page) {
  for (let i = 0; i < 50; i++) {
    await advance(page, 1);
    if (
      /text-white/.test(
        await page.locator("ol li h2").last().getAttribute("class"),
      )
    )
      return;
  }
  assert.fail("The final loader step must complete after the ready response");
}

async function waitForRequests(page, expected, getRequests) {
  for (let i = 0; i < 100 && getRequests() !== expected; i++) {
    await page.waitForTimeout(20);
  }
  assert.equal(getRequests(), expected);
}

try {
  let requests = 0;
  let held;
  const page = await open("", async (route) => {
    requests++;
    if (requests === 4) {
      held = route;
      return;
    }
    await route.fulfill(
      requests === 3
        ? { status: 500, json: { message: "Temporary failure" } }
        : {
            json: {
              success: true,
              ...(requests === 1 ? { status: false } : {}),
              data: requests === 1 ? ready.data : {},
            },
          },
    );
  });
  await waitForInitialDelay(page);
  assert.equal(
    requests,
    0,
    "No request before 30 seconds, including StrictMode remounts",
  );
  await advance(page, 1);
  await waitForRequests(page, 1, () => requests);
  assert.equal(requests, 1);
  assert.equal(await page.locator("ol li").count(), 7);
  for (let expected = 2; expected <= 4; expected++) {
    await advance(page, 5000);
    await waitForRequests(page, expected, () => requests);
    assert.equal(
      requests,
      expected,
      "Poll at five seconds across pending, missing status, and errors",
    );
  }
  for (let i = 0; i < 3; i++) await advance(page, 5000);
  assert.equal(
    requests,
    4,
    "A slow request must be shared instead of duplicated",
  );
  await held.fulfill({ json: ready });
  await waitForFinalStep(page);
  assert.equal(
    await page.locator("ol li").count(),
    7,
    "Keep the final loader animation visible",
  );
  assert.match(
    await page.locator("ol li h2").last().getAttribute("class"),
    /text-white/,
  );
  await advance(page, 650);
  await page.getByText("Test basket", { exact: true }).waitFor();
  assert.equal(await page.locator("ol").count(), 0);
  await advance(page, 20000);
  assert.equal(requests, 4, "Stop polling after status is true");
  await page.close();
  console.log(
    "PASS delayed polling, error recovery, slow-request deduplication, final loader and basket",
  );

  requests = 0;
  const cached = await open("?cached", async (route) => {
    requests++;
    await route.fulfill({ json: ready });
  });
  // Simulate a background tab whose chained loader timers have run late.
  await advance(cached, 29998);
  assert.equal(requests, 0);
  assert.equal(
    await cached.getByText("Test basket", { exact: true }).count(),
    0,
  );
  await advance(cached, 1);
  await waitForFinalStep(cached);
  await advance(cached, 650);
  await cached.getByText("Test basket", { exact: true }).waitFor();
  assert.equal(
    requests,
    1,
    "Cached completion must still fetch after the delay",
  );
  await cached.close();
  console.log(
    "PASS cached data cannot skip the delay or leave the loader stuck",
  );

  requests = 0;
  const existing = await open("?existing", async (route) => {
    requests++;
    await route.fulfill({ json: ready });
  });
  await advance(existing, 1);
  await advance(existing, 100);
  await existing.getByText("Test basket", { exact: true }).waitFor();
  assert.equal(
    requests,
    1,
    "Existing plans keep immediate loading and share StrictMode requests",
  );
  await existing.close();

  requests = 0;
  const unmounted = await open("", async (route) => {
    requests++;
    await route.fulfill({ json: ready });
  });
  await unmounted.getByRole("button", { name: "Unmount test page" }).click();
  await advance(unmounted, 60000);
  assert.equal(requests, 0, "Unmounting must clear the initial-delay timer");
  await unmounted.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS existing-plan loading, timer cleanup, and no runtime errors",
  );
} finally {
  await browser.close();
  await server.close();
}
