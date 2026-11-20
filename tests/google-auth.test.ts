import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("Google WEB authentication and callback recovery", async (t) => {
  const server = await createServer({
    configFile: false,
    // Keep the SSR harness from invalidating a running development server's cache.
    cacheDir: "node_modules/.vite-google-auth-test",
    optimizeDeps: { noDiscovery: true, include: [] },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const entries = new Map<string, string>();
  const location = { href: "https://app.zistup.com/google/back" };
  const history = {
    state: { idx: 0 },
    replaceState: (_state: unknown, _title: string, path: string) => {
      location.href = new URL(path, location.href).href;
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => entries.set(key, value),
      removeItem: (key: string) => entries.delete(key),
    },
  });
  try {
    const { httpClient, queryClient, tokenStorage } =
      await server.ssrLoadModule("/src/shared/api/index.ts");
    const { googleCallback } = await server.ssrLoadModule(
      "/src/features/auth/loaders/google-callback.ts",
    );
    const { getGoogleLoginUrl, logout } = await server.ssrLoadModule(
      "/src/features/auth/api/auth.api.ts",
    );
    const { useUserProfileStore } = await server.ssrLoadModule(
      "/src/shared/stores/user-profile.store.ts",
    );
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location, history },
    });
    queryClient.setDefaultOptions({ queries: { retry: false } });
    const complete = {
      name: "Test",
      height: 170,
      sex: "female",
      diet: { key: "test", title: "Test" },
    };
    let profile: unknown = complete;
    let calls = 0;
    let fail = false;
    let authUrl = "https://accounts.google.com/o/oauth2/v2/auth?state=test";
    httpClient.defaults.adapter = async (config: {
      url: string;
      headers: { get: (key: string) => string };
      skipAuth?: boolean;
    }) => {
      if (config.url === "/google/url") {
        assert.equal(config.skipAuth, true);
        return {
          data: { success: true, data: { url: authUrl } },
          status: 200,
          config,
          headers: {},
        };
      }
      calls++;
      assert.equal(
        new URL(location.href).search,
        "",
        "credential is removed before profile request",
      );
      assert.equal(config.headers.get("Authorization"), "Bearer test-jwt");
      if (fail) throw new Error("private server details");
      return { data: { user: profile }, status: 200, config, headers: {} };
    };
    await t.test("authorization URL and unsafe response", async () => {
      assert.equal(await getGoogleLoginUrl(), authUrl);
      authUrl = "https://attacker.example/";
      await assert.rejects(getGoogleLoginUrl());
    });
    for (const [name, user, destination] of [
      ["existing user", complete, "/app/dashboard"],
      [
        "new user",
        { ...complete, height: null },
        "/onboarding/basic-information",
      ],
      ["missing plan", { ...complete, diet: null }, "/onboarding/choose-plan"],
    ] as const) {
      await t.test(name, async () => {
        logout();
        profile = user;
        calls = 0;
        location.href = "https://app.zistup.com/google/back?token=test-jwt";
        const first = googleCallback();
        assert.equal(location.href, "https://app.zistup.com/google/back");
        assert.equal(
          googleCallback(),
          first,
          "concurrent callbacks share one operation",
        );
        assert.equal((await first).headers.get("Location"), destination);
        assert.equal(calls, 1);
        assert.equal(tokenStorage.get(), "test-jwt");
        assert.deepEqual(useUserProfileStore.getState().user, user);
        // Simulate a reload: persisted JWT survives, memory/cache does not.
        queryClient.clear();
        useUserProfileStore.getState().clearUser();
        assert.equal(
          (await googleCallback()).headers.get("Location"),
          destination,
        );
        assert.equal(calls, 2);
      });
    }
    for (const query of [
      "",
      "?error=access_denied",
      "?token=test-jwt&error=failed",
      "?token=test-jwt",
    ]) {
      await t.test(
        `failure ${query ? "callback" : "missing token"}`,
        async () => {
          logout();
          fail = true;
          location.href = `https://app.zistup.com/google/back${query}`;
          assert.equal(
            (await googleCallback()).headers.get("Location"),
            "/auth/login",
          );
          assert.equal(tokenStorage.has(), false);
          assert.equal(useUserProfileStore.getState().user, null);
          assert.equal(location.href, "https://app.zistup.com/google/back");
        },
      );
    }
    queryClient.clear();
  } finally {
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "localStorage");
    await server.close();
  }
});
