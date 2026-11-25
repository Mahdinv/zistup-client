import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("registration and phone verification retain their distinct API payloads", async () => {
  const server = await createServer({
    configFile: false,
    cacheDir: "node_modules/.vite-registration-auth-test",
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
    const { sendCode, validateUser } = await server.ssrLoadModule(
      "/src/features/auth/api/auth.api.ts",
    );
    const calls: { url: string; payload: unknown }[] = [];
    let fail = false;
    httpClient.defaults.adapter = async (config: {
      url: string;
      data: string;
      skipAuth: boolean;
    }) => {
      assert.equal(config.skipAuth, true);
      calls.push({ url: config.url, payload: JSON.parse(config.data) });
      return {
        data: fail
          ? { success: false, error: { message: "کد معتبر نیست" } }
          : {
              success: true,
              data: { token: "test-token", user: { name: null } },
            },
        status: 200,
        headers: {},
        config,
      };
    };
    await sendCode({ mobile: "09123456789" });
    assert.deepEqual(calls.pop(), {
      url: "/users/sendCode",
      payload: { mobile: "09123456789" },
    });
    const registration = {
      mobile: "09123456789",
      code: "1234",
      username: "TestUser",
      password: "AB12!!ab",
      name: "نام واردشده توسط کاربر",
      version: "1.0",
      versionCode: 101,
    };
    assert.equal((await validateUser(registration)).token, "test-token");
    assert.deepEqual(calls.pop(), {
      url: "/users/validate",
      payload: registration,
    });
    await validateUser({
      identifier: { mobile: "09123456789" },
      code: "1234",
      refCode: "REF",
    });
    assert.deepEqual(calls.pop()?.payload, {
      mobile: "09123456789",
      code: "1234",
      refCode: "REF",
    });
    await validateUser({
      identifier: { email: "demo@example.com" },
      code: "1234",
    });
    assert.deepEqual(calls.pop()?.payload, {
      email: "demo@example.com",
      code: "1234",
    });
    fail = true;
    await assert.rejects(validateUser(registration), /کد معتبر نیست/);
  } finally {
    await server.close();
  }
});
