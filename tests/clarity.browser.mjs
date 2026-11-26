// npm pack clarity-js@0.8.77 --pack-destination node_modules/.tmp --ignore-scripts
// Extract under node_modules/.tmp/clarity-runtime, or set CLARITY_RUNTIME_PATH.
// No project dependency and no production analytics submissions are required.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build, preview } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const runtime = await readFile(
  process.env.CLARITY_RUNTIME_PATH ||
    "node_modules/.tmp/clarity-runtime/package/build/clarity.js",
  "utf8",
);
const outDir = "node_modules/.tmp/clarity-browser-test";
await build({
  configFile: false,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
  },
  define: {
    "import.meta.env.VITE_CLARITY_PROJECT_ID": JSON.stringify("testproject"),
  },
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: { input: "tests/fixtures/clarity-harness.html" },
  },
});
const server = await preview({
  configFile: false,
  build: { outDir },
  preview: { host: "127.0.0.1", port: 5197, strictPort: true },
});
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || "msedge",
});
const base = "http://127.0.0.1:5197";
const safe = `${base}/onboarding/choose-plan`;
const records = [];
const commands = [];
let tags = 0;
let tagDelay = 0;
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  serviceWorkers: "block",
});
await context.exposeBinding("recordPayload", (_source, data) =>
  records.push(JSON.parse(data)),
);
await context.exposeBinding("recordCommand", (_source, args) =>
  commands.push(args),
);
await context.route("**/*", async (route) => {
  const url = route.request().url();
  if (url.startsWith("https://www.clarity.ms/tag/")) {
    tags++;
    if (tagDelay) await new Promise((resolve) => setTimeout(resolve, tagDelay));
    // Real official SDK, local upload sink. track:false models Consent Mode.
    const body = `(()=>{ const runtimeExports=(()=>{const exports={}; ${runtime}\nreturn exports;})(); const api=runtimeExports.clarity;
      const queue=window.clarity.q||[];
      window.clarity=(name,...args)=>{window.recordCommand([name,...args]);return api[name](...args)};
      window.clarity.v=api.version;
      api.start({projectId:'testproject',track:false,content:false,mask:['body'],lean:false,delay:100,upload:data=>window.recordPayload(data)});
      queue.forEach(args=>window.clarity(...args)); })();`;
    await route
      .fulfill({ contentType: "application/javascript", body })
      .catch(() => {});
  } else if (url.startsWith(base)) {
    if (route.request().isNavigationRequest())
      await route.fulfill({
        contentType: "text/html",
        path: `${outDir}/tests/fixtures/clarity-harness.html`,
      });
    else await route.continue();
  } else await route.abort();
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const pause = (ms = 250) => page.waitForTimeout(ms);
const eventTypes = () =>
  new Set(
    records
      .flatMap((payload) => [...(payload.a || []), ...(payload.p || [])])
      .map((event) => event[1]),
  );
const waitFor = async (condition, label) => {
  for (let i = 0; i < 100; i++) {
    if (condition()) return;
    await pause(100);
  }
  console.log({
    events: [...eventTypes()],
    tags,
    errors,
    commands,
    payloadCount: records.length,
    state: await page.evaluate(() => ({
      clarity: typeof window.clarity,
      scripts: [...document.scripts].map((s) => s.src),
      consent: localStorage.getItem("zistup.analytics-consent.v2"),
      referrer: document.referrer,
    })),
  });
  assert.fail(label);
};
const prompt = () =>
  page.getByRole("complementary", { name: "حریم خصوصی و آمار استفاده" });
const withdraw = () => page.evaluate(() => window.testSetConsent("denied"));
const accept = () =>
  page.getByRole("button", { name: "می‌پذیرم", exact: true }).click();
const deny = () =>
  page.getByRole("button", { name: "نمی‌پذیرم", exact: true }).click();
try {
  await page.goto(safe);
  assert.equal(await prompt().count(), 1, "StrictMode shows one prompt");
  assert.equal(tags, 0, "No SDK before consent");
  await deny();
  assert.equal(
    await prompt().count(),
    0,
    "Decline removes the whole UI immediately",
  );
  const remaining = await page.evaluate(
    () =>
      Number(localStorage.getItem("zistup.analytics-consent-reminder-at")) -
      Date.now(),
  );
  assert(
    remaining > 86_390_000 && remaining <= 86_400_000,
    "Decline is remembered for 24 hours",
  );
  await page.reload();
  await page.waitForFunction(() => window.testNavigate);
  assert.equal(
    await prompt().count(),
    0,
    "Decline survives reload without a prompt",
  );
  const reminderTab = await context.newPage();
  await reminderTab.goto(`${base}/app/profile`);
  await reminderTab.waitForFunction(() => window.testNavigate);
  assert.equal(
    await reminderTab.getByRole("complementary").count(),
    0,
    "Decline survives a new tab session",
  );
  await reminderTab.evaluate(() => window.testNavigate("/app/diets"));
  assert.equal(
    await reminderTab.getByRole("complementary").count(),
    0,
    "SPA navigation does not repeat the prompt",
  );
  // Advance only the reminder deadline; exercise the real mounted-app timer.
  await reminderTab.evaluate(() =>
    localStorage.setItem(
      "zistup.analytics-consent-reminder-at",
      String(Date.now() + 1500),
    ),
  );
  await prompt().waitFor({ state: "visible" });
  assert.equal(
    await prompt().count(),
    1,
    "Expiry shows exactly one prompt without a reload",
  );
  assert.equal(tags, 0, "Expiry never grants consent");
  await page.reload();
  await prompt().waitFor({ state: "visible" });
  assert.equal(tags, 0, "Expired denial also remains untracked after reload");
  await reminderTab.reload();
  await reminderTab.getByRole("complementary").waitFor({ state: "visible" });
  await accept();
  assert.equal(await prompt().count(), 0, "Acceptance removes the whole UI");
  await reminderTab.getByRole("complementary").waitFor({ state: "hidden" });
  await reminderTab.reload();
  await reminderTab.waitForFunction(() => window.testNavigate);
  assert.equal(
    await reminderTab.getByRole("complementary").count(),
    0,
    "Acceptance persists across tabs and reloads",
  );
  await reminderTab.close();
  await waitFor(
    () => tags === 1 && records.length > 0,
    "SDK should capture the actual app DOM",
  );
  assert.equal(await page.locator("iframe").count(), 0);
  assert(eventTypes().has(5), "Real Discover recording event");
  await page.locator("main").click({ position: { x: 10, y: 10 } });
  await page.mouse.move(200, 650);
  await page.mouse.wheel(0, 600);
  await page.evaluate(() => {
    const p = document.createElement("p");
    p.textContent = "private-mask-sentinel";
    document.querySelector("main").append(p);
  });
  await waitFor(
    () => eventTypes().has(9) && eventTypes().has(10) && eventTypes().has(6),
    "Real click, scroll and mutation events",
  );
  assert(
    !JSON.stringify(records).includes("private-mask-sentinel"),
    "Text is masked in actual recording payloads",
  );
  assert(
    commands.some(
      ([name, value]) =>
        name === "consentv2" &&
        value.analytics_Storage === "granted" &&
        value.ad_Storage === "denied",
    ),
  );
  await page.evaluate(() => window.testRevalidate());
  await pause();
  assert.equal(
    tags,
    1,
    "StrictMode, repeated setup and revalidation initialize only once",
  );

  const oldDocument = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => window.testNavigate("/app/profile"));
  await page.waitForURL(`${base}/app/profile`);
  await page.waitForFunction(() => window.sensitiveLoaderRan);
  assert.notEqual(
    await page.evaluate(() => performance.timeOrigin),
    oldDocument,
    "Excluded DOM loads only in a fresh document",
  );
  assert.equal(await page.locator("#clarity-script").count(), 0);
  assert(!JSON.stringify(records).includes("private-health-777"));
  const excludedDocument = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => window.testNavigate("/app/diets"));
  await page.waitForURL(`${base}/app/diets`);
  assert.equal(
    await page.evaluate(() => performance.timeOrigin),
    excludedDocument,
    "Excluded routes retain SPA navigation",
  );
  await page.evaluate(() => window.testNavigate("/onboarding/choose-plan"));
  await page.waitForURL(safe);
  await waitFor(
    () => tags === 2,
    "Entering audited route gets a fresh recording document",
  );
  assert.equal(
    await prompt().count(),
    0,
    "Accepted consent survives navigation",
  );
  const beforeWithdrawal = await page.evaluate(() => performance.timeOrigin);
  await withdraw();
  await page.waitForFunction(
    (old) => performance.timeOrigin !== old,
    beforeWithdrawal,
  );
  await pause(1500);
  assert.equal(
    await page.locator("#clarity-script").count(),
    0,
    "Withdrawal destroys recorder and delayed restarts",
  );
  assert.equal(tags, 2);
  const afterWithdrawal = records.length;
  await page.locator("main").click({ position: { x: 10, y: 10 } });
  await pause(1200);
  assert.equal(
    records.length,
    afterWithdrawal,
    "No new collection after withdrawal reload",
  );

  // Re-consent is needed when migrating from the previous navigation-only v1 UI.
  await page.evaluate(() => {
    localStorage.removeItem("zistup.analytics-consent.v2");
    localStorage.setItem("zistup.analytics-consent.v1", "granted");
  });
  await page.reload();
  assert(
    await page
      .getByRole("button", { name: "می‌پذیرم", exact: true })
      .isVisible(),
  );
  assert.equal(tags, 2);
  await page.evaluate(() => {
    localStorage.setItem("zistup.analytics-consent.v2", "granted");
    sessionStorage.clear();
  });
  const excluded = [
    "/auth/login",
    "/google/back?token=private-token",
    "/onboarding/basic-information",
    "/onboarding/choose-plan/conventional-global-diets",
    "/onboarding/choose-plan/conventional-global-diets/123",
    "/app/dashboard",
    "/app/diets",
    "/app/profile",
    "/app/zistyar",
    "/game-workflow",
    "/game-workflow/demographic-information",
    "/game-workflow/tablemates",
    "/game-workflow/past-week-intake",
    "/game-workflow/preferred-food",
    "/game-workflow/free-shopping",
    "/game-workflow/limited-shopping",
    "/game-workflow/social-alignment",
    "/game-workflow/optimized-dietary",
    "/game-workflow/optimized-dietary/weekly-diet-planning",
    "/missing",
    "/onboarding/choose-plan?token=private-token",
    "/onboarding/choose-plan#private-hash",
  ];
  for (const path of excluded) {
    await page.goto(base + path);
    await pause(80);
    assert.equal(await page.locator("#clarity-script").count(), 0, path);
  }
  assert.equal(
    tags,
    2,
    "Every excluded route remains uninstrumented despite consent",
  );
  assert(!JSON.stringify(records).includes("private-token"));

  await page.goto(safe);
  await waitFor(() => tags === 3, "Clean entry starts SDK");
  const other = await context.newPage();
  await other.goto(`${base}/app/profile`);
  await other.waitForFunction(() => window.testSetConsent);
  await other.evaluate(() => window.testSetConsent("denied"));
  await pause(1200);
  assert.equal(
    await page.locator("#clarity-script").count(),
    0,
    "Cross-tab withdrawal destroys document",
  );
  await other.close();
  await page.evaluate(() =>
    localStorage.removeItem("zistup.analytics-consent-reminder-at"),
  );
  await page.reload();
  tagDelay = 1000;
  await accept();
  await waitFor(() => tags === 4, "Begin delayed SDK download");
  await withdraw();
  await pause(1500);
  assert.equal(
    await page.locator("#clarity-script").count(),
    0,
    "Withdrawal during SDK download stays disabled",
  );
  tagDelay = 0;
  await page.evaluate(() => {
    localStorage.setItem("zistup.analytics-consent.v2", "granted");
    sessionStorage.clear();
  });
  await page.goto(safe);
  await page.waitForFunction(() => window.clarity?.v);
  const beforeHistory = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() =>
    history.pushState(null, "", "/app/profile?token=private-history"),
  );
  await page.waitForURL(`${base}/app/profile?token=private-history`);
  await page.waitForFunction(
    (old) => performance.timeOrigin !== old,
    beforeHistory,
  );
  assert.equal(await page.locator("#clarity-script").count(), 0);
  await page.goBack();
  await page.waitForURL(safe);
  await page.waitForFunction(() => window.clarity?.v);
  await page.goForward();
  await page.waitForURL(`${base}/app/profile?token=private-history`);
  await pause();
  assert.equal(
    await page.locator("#clarity-script").count(),
    0,
    "Forward restores only an untracked sensitive document",
  );

  await page.goto(safe);
  await page.waitForFunction(() => window.clarity?.v);
  const beforeRedirect = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => {
    window.testRedirectOnLoad = true;
    window.testRevalidate();
  });
  await page.waitForURL(`${base}/app/profile?token=private-redirect`);
  await page.waitForFunction(
    (old) => performance.timeOrigin !== old,
    beforeRedirect,
  );
  assert.equal(
    await page.locator("#clarity-script").count(),
    0,
    "Loader redirect cannot bypass document boundary",
  );
  assert(!JSON.stringify(records).includes("private-history"));
  assert(!JSON.stringify(records).includes("private-redirect"));

  await page.goto(safe);
  await page.waitForFunction(() => window.clarity?.v);
  const beforeHash = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() =>
    window.testNavigate("/onboarding/choose-plan#private-fragment"),
  );
  await page.waitForURL(`${safe}#private-fragment`);
  await page.waitForFunction(
    (old) => performance.timeOrigin !== old,
    beforeHash,
  );
  assert.equal(
    await page.locator("#clarity-script").count(),
    0,
    "Hash-only navigation is isolated",
  );
  assert(!JSON.stringify(records).includes("private-fragment"));

  // Denial remains effective even if both storage mechanisms fail after acceptance.
  await page.goto(safe);
  await page.waitForFunction(() => window.clarity?.v);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.removeItem = () => {
      throw new Error("blocked");
    };
  });
  await withdraw();
  await page.waitForURL(`${safe}#analytics-off`);
  await pause(1200);
  assert.equal(
    await page.locator("#clarity-script").count(),
    0,
    "Failed denial persistence cannot resurrect recording",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: persistent acceptance, 24-hour decline reminder, cross-tab prompt sync, real SDK recording/mutation/click/scroll payloads, masking, StrictMode, all excluded routes, document boundaries, SPA revalidation, cross-tab withdrawal and script-load race",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
