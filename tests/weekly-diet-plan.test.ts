import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

test("weekly plan normalizes response readiness without confusing review status", async () => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const storage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: () => null },
  });
  try {
    const { httpClient } = await server.ssrLoadModule(
      "/src/shared/api/index.ts",
    );
    const { getWeeklyDietPlan } = await server.ssrLoadModule(
      "/src/features/game-workflow/api/weekly-diet-plan.api.ts",
    );
    // Relevant fields from the real response: no boolean status at the top level.
    const plan = {
      status: "needs_review",
      shopping: { basis: "week", groups: [] },
    };
    for (const [payload, expected] of [
      [{ success: true, data: plan }, true],
      [{ success: true, status: true, data: plan }, true],
      [{ success: true, status: false, data: plan }, false],
      [{ success: true, data: null }, false],
      [{ success: true, data: { status: "needs_review" } }, false],
    ] as const) {
      httpClient.defaults.adapter = async (config) => {
        assert.equal(config.url, "/diet/v2/plan");
        assert.deepEqual(config.params, { diet: "zistpa" });
        return { data: payload, status: 200, config, headers: {} };
      };
      const result = await getWeeklyDietPlan();
      assert.equal(result.status, expected);
      assert.deepEqual(
        result.data,
        payload.data,
        "Preserve plan fields and review status",
      );
      assert.equal(result.success, payload.success);
    }
  } finally {
    await server.close();
    if (storage) Object.defineProperty(globalThis, "localStorage", storage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
