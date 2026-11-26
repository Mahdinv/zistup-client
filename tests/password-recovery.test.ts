import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("password recovery preserves API payloads, masking, and expiration contract", async () => {
  const server = await createServer({
    configFile: false,
    cacheDir: "node_modules/.vite-password-recovery-test",
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
    const { forgotPassword, verifyForgotPassword, resetForgotPassword } =
      await server.ssrLoadModule("/src/features/auth/api/auth.api.ts");
    let response: unknown;
    let expected: { url: string; payload: unknown };
    httpClient.defaults.adapter = async (config: {
      url: string;
      data: string;
      skipAuth: boolean;
    }) => {
      assert.equal(config.skipAuth, true);
      assert.equal(config.url, expected.url);
      assert.deepEqual(JSON.parse(config.data), expected.payload);
      return { data: response, status: 200, headers: {}, config };
    };
    expected = {
      url: "/users/password/forgot",
      payload: { username: "testuser" },
    };
    response = {
      success: true,
      data: { mobile: "0912***789", message: "ارسال شد" },
    };
    assert.equal((await forgotPassword(expected.payload)).mobile, "0912***789");
    expected = {
      url: "/users/password/forgot/verify",
      payload: { username: "testuser", code: "1234" },
    };
    response = {
      success: true,
      data: { reset_token: "reset-test-token", expires_in: 900 },
    };
    assert.deepEqual(await verifyForgotPassword(expected.payload), {
      reset_token: "reset-test-token",
      expires_in: 900,
    });
    for (const expires_in of [0, -1, "900", null]) {
      response = {
        success: true,
        data: { reset_token: "reset-test-token", expires_in },
      };
      await assert.rejects(
        verifyForgotPassword(expected.payload),
        /پاسخ بازیابی رمز عبور معتبر نیست/,
      );
    }
    expected = {
      url: "/users/password/forgot/reset",
      payload: { reset_token: "reset-test-token", password: "AB12!!ab" },
    };
    response = { success: true, data: { message: "رمز عبور تغییر کرد" } };
    assert.equal(
      (await resetForgotPassword(expected.payload)).message,
      "رمز عبور تغییر کرد",
    );
    response = {
      success: false,
      error: { code: 1007, message: "کد معتبر نیست" },
    };
    await assert.rejects(
      resetForgotPassword(expected.payload),
      /کد معتبر نیست/,
    );
  } finally {
    await server.close();
  }
});
