import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("username checking follows the supplied contract and rejects unsafe results", async (t) => {
  const server = await createServer({
    configFile: false,
    cacheDir: "node_modules/.vite-username-check-test",
    optimizeDeps: { noDiscovery: true, include: [] },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  try {
    const { httpClient } = await server.ssrLoadModule(
      "/src/shared/api/index.ts",
    );
    const { checkUsername } = await server.ssrLoadModule(
      "/src/features/auth/api/auth.api.ts",
    );
    const controller = new AbortController();
    let response: unknown;
    let requestedUsername = "testuser";
    httpClient.defaults.adapter = async (config: {
      url: string;
      method: string;
      data: string;
      skipAuth: boolean;
      signal: AbortSignal;
    }) => {
      assert.equal(config.url, "/users/username/check");
      assert.equal(config.method, "post");
      assert.deepEqual(JSON.parse(config.data), {
        username: requestedUsername,
      });
      assert.equal(config.skipAuth, true);
      assert.equal(config.signal, controller.signal);
      return { data: response, status: 200, headers: {}, config };
    };
    for (const [available, reason, username] of [
      [true, null, "testuser"],
      [false, "taken", "testuser"],
      [false, "invalid", "test user"],
    ] as const) {
      await t.test(`maps ${reason ?? "available"}`, async () => {
        requestedUsername = username;
        response = {
          success: true,
          username,
          available,
          reason,
          message: "پیام سرور",
        };
        const result = await checkUsername(username, controller.signal);
        assert.equal(result.available, available);
        assert.equal(result.reason, reason);
        assert.equal(result.message, "پیام سرور");
      });
    }
    requestedUsername = "testuser";
    for (const invalid of [
      {
        success: true,
        username: "otheruser",
        available: true,
        reason: null,
        message: "OK",
      },
      {
        success: true,
        username: "testuser",
        available: "true",
        reason: null,
        message: "OK",
      },
      {
        success: true,
        username: "testuser",
        available: true,
        reason: "taken",
        message: "OK",
      },
      { success: true },
    ]) {
      response = invalid;
      await assert.rejects(
        checkUsername(requestedUsername, controller.signal),
        /پاسخ بررسی نام کاربری معتبر نیست/,
      );
    }
    response = { success: false, error: { message: "خطای سرور" } };
    await assert.rejects(
      checkUsername(requestedUsername, controller.signal),
      /خطای سرور/,
    );
  } finally {
    await server.close();
  }
});
