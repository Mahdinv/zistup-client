import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";

test("Development is disabled; only the audited clean route is eligible", async () => {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  try {
    const api = await server.ssrLoadModule("/src/app/analytics/clarity.ts");
    assert.equal(api.clarityEnabled, false);
    assert.equal(api.readAnalyticsConsent(), null);
    assert(
      api.isClarityLocationSafe({
        pathname: "/onboarding/choose-plan",
        search: "",
        hash: "",
      }),
    );
    for (const pathname of [
      "/google/back",
      "/auth/login",
      "/app/dashboard",
      "/app/diets",
      "/app/profile",
      "/app/zistyar",
      "/onboarding/basic-information",
      "/onboarding/choose-plan/conventional-global-diets",
      "/onboarding/choose-plan/conventional-global-diets/12",
      "/game-workflow",
      "/game-workflow/preferred-food",
      "/unknown",
    ]) {
      assert.equal(
        api.isClarityLocationSafe({ pathname, search: "", hash: "" }),
        false,
      );
    }
    for (const extras of [
      { search: "?token=secret", hash: "" },
      { search: "", hash: "#secret" },
    ]) {
      assert.equal(
        api.isClarityLocationSafe({
          pathname: "/onboarding/choose-plan",
          ...extras,
        }),
        false,
      );
    }
    api.prepareClarityDocument();
    api.setupClarity({
      subscribe: () => assert.fail("Development must not subscribe"),
    });
  } finally {
    await server.close();
  }
});

test("Missing or invalid production IDs fail closed", async () => {
  for (const id of ["", "bad/id"]) {
    const server = await createServer({
      configFile: false,
      define: {
        "import.meta.env.PROD": "true",
        "import.meta.env.VITE_CLARITY_PROJECT_ID": JSON.stringify(id),
      },
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: "custom",
    });
    try {
      const { clarityEnabled } = await server.ssrLoadModule(
        "/src/app/analytics/clarity.ts",
      );
      assert.equal(clarityEnabled, false);
    } finally {
      await server.close();
    }
  }
});
