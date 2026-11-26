import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("password login sends the exact contract and preserves server errors", async () => {
  const server = await createServer({
    configFile: false,
    cacheDir: "node_modules/.vite-password-login-test",
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
    const { loginWithPassword } = await server.ssrLoadModule(
      "/src/features/auth/api/auth.api.ts",
    );
    const credentials = { username: "testuser", password: "123456" };
    const user = {
      id: 125,
      name: "نام کاربر",
      mobile: "09123456789",
      username: "testuser",
      token: "test-jwt",
    };
    let response: unknown = { success: true, data: user };
    httpClient.defaults.adapter = async (config: {
      url: string;
      data: string;
      skipAuth: boolean;
    }) => {
      assert.equal(config.url, "/users/login/password");
      assert.equal(config.skipAuth, true);
      assert.deepEqual(JSON.parse(config.data), credentials);
      return { data: response, status: 200, headers: {}, config };
    };
    assert.deepEqual(await loginWithPassword(credentials), user);
    response = {
      success: false,
      error: { code: 1007, message: "ورود ناموفق" },
    };
    await assert.rejects(
      loginWithPassword(credentials),
      (error: { message: string; code: number }) =>
        error.message === "ورود ناموفق" && error.code === 1007,
    );
    response = { success: true, data: { ...user, token: "" } };
    await assert.rejects(
      loginWithPassword(credentials),
      /پاسخ ورود معتبر نیست/,
    );
    assert.deepEqual(credentials, { username: "testuser", password: "123456" });
  } finally {
    await server.close();
  }
});
