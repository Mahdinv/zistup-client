import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createMemoryRouter } from "react-router-dom";
import { onlineManager, QueryObserver } from "@tanstack/react-query";

const destination = "/game-workflow/optimized-dietary/weekly-diet-planning";
const plan = {
  created_at_utc: "2026-11-14 16:48:07",
  diet: { key: "zistpa", title: "زیستاپ" },
  days: [{ day: 1, meals: [] }],
  shopping: { basis: "week", groups: [] },
};

async function settled(router: ReturnType<typeof createMemoryRouter>) {
  if (router.state.initialized && router.state.navigation.state === "idle")
    return;
  await new Promise<void>((resolve) => {
    const unsubscribe = router.subscribe((state) => {
      if (state.initialized && state.navigation.state === "idle") {
        unsubscribe();
        resolve();
      }
    });
  });
}

test("registered diet confirmation mapping and entry routing", async (t) => {
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
    value: { getItem: () => "test-session" },
  });
  const { queryClient, httpClient } = await server.ssrLoadModule(
    "/src/shared/api/index.ts",
  );
  try {
    const { mapDietResponse } = await server.ssrLoadModule(
      "/src/features/dashboard/api/mappers/diet-response.mapper.ts",
    );
    const { optimizedDietaryQueryOptions } = await server.ssrLoadModule(
      "/src/features/game-workflow/hooks/use-optimized-dietary-query.hook.ts",
    );
    const { redirectUnconfirmedDiet } = await server.ssrLoadModule(
      "/src/features/dashboard/loaders/redirect-unconfirmed-diet.ts",
    );
    const { userProfileQueryKey } = await server.ssrLoadModule(
      "/src/shared/hooks/use-user-profile-query.hook.ts",
    );
    const { requireCompleteProfile } = await server.ssrLoadModule(
      "/src/features/auth/loaders/require-complete-profile.ts",
    );
    const resetClient = () => {
      queryClient.clear();
      queryClient.setQueryData(userProfileQueryKey, {
        name: "Test",
        height: 170,
        sex: "female",
        diet: plan.diet,
      });
    };
    const routerFor = (
      path: string,
      history: { initialEntries?: string[]; initialIndex?: number } = {},
    ) =>
      createMemoryRouter(
        [
          {
            loader: requireCompleteProfile,
            children: [
              { path: "/app/dashboard", loader: redirectUnconfirmedDiet },
              { path: "/app/diets", loader: redirectUnconfirmedDiet },
            ],
          },
          { path: destination },
          { path: "/onboarding/basic-information" },
        ],
        { initialEntries: [path], ...history },
      );
    let payload: unknown;
    let requests = 0;
    let profileRequests = 0;
    let fail = false;
    let gate: Promise<void> | undefined;
    httpClient.defaults.adapter = async (config) => {
      if (config.url === "/users/profile") {
        profileRequests++;
        return {
          data: {
            user: {
              name: "Test",
              height: null,
              sex: "female",
              diet: plan.diet,
            },
          },
          status: 200,
          config,
          headers: {},
        };
      }
      assert.equal(config.url, "diet/v2/plan/registered");
      requests++;
      await gate;
      if (fail) throw new Error("Request failed");
      return { data: payload, status: 200, config, headers: {} };
    };

    await t.test(
      "exact isConfirm field maps without changing DietResponse",
      () => {
        assert.equal(
          mapDietResponse({ ...plan, isConfirm: false }).isConfirm,
          false,
        );
        assert.equal(
          mapDietResponse({ ...plan, isConfirm: true }).isConfirm,
          true,
        );
        assert.equal(mapDietResponse(plan).isConfirm, true);
        assert.equal(
          mapDietResponse({ ...plan, is_confirm: false }).isConfirm,
          true,
        );
      },
    );

    await t.test(
      "only explicit unconfirmed zistpa redirects from either entry",
      async () => {
        for (const path of ["/app/dashboard", "/app/diets"]) {
          for (const [response, expected] of [
            [
              { success: true, data: { ...plan, isConfirm: false } },
              destination,
            ],
            [{ success: true, data: { ...plan, isConfirm: true } }, path],
            [
              {
                success: true,
                data: {
                  ...plan,
                  diet: { key: "other", title: "Other" },
                  isConfirm: false,
                },
              },
              path,
            ],
            [{ success: true, data: plan }, path],
            [{ success: true, data: null }, path],
            [{ success: false, data: null }, path],
            [{ success: true, data: { isConfirm: false } }, path],
          ] as const) {
            resetClient();
            payload = response;
            requests = 0;
            const router = routerFor(path);
            try {
              await settled(router);
              assert.equal(router.state.location.pathname, expected);
              assert.equal(
                requests,
                1,
                "The destination does not repeat the guard",
              );
              assert.equal(router.state.errors, null);
            } finally {
              router.dispose();
            }
          }
        }
      },
    );

    await t.test(
      "stale unconfirmed cache waits for the server; pages share the request",
      async () => {
        resetClient();
        queryClient.setQueryData(
          optimizedDietaryQueryOptions.queryKey,
          {
            success: true,
            data: mapDietResponse({ ...plan, isConfirm: false }),
          },
          { updatedAt: Date.now() - 6 * 60 * 1000 },
        );
        payload = { success: true, data: { ...plan, isConfirm: true } };
        requests = 0;
        let release!: () => void;
        gate = new Promise<void>((resolve) => {
          release = resolve;
        });
        const router = routerFor("/app/dashboard");
        const observer = new QueryObserver(
          queryClient,
          optimizedDietaryQueryOptions,
        );
        const unsubscribe = observer.subscribe(() => {});
        try {
          assert.equal(router.state.initialized, false);
          assert.equal(router.state.location.pathname, "/app/dashboard");
          release();
          await settled(router);
          assert.equal(router.state.location.pathname, "/app/dashboard");
          assert.equal(requests, 1);
          await router.navigate("/app/diets");
          assert.equal(router.state.location.pathname, "/app/diets");
          assert.equal(
            requests,
            2,
            "Each protected entry refreshes confirmation once while sharing page requests",
          );
        } finally {
          release();
          gate = undefined;
          unsubscribe();
          router.dispose();
        }
      },
    );

    await t.test(
      "Back and Forward refresh confirmation and replace blocked history entries",
      async () => {
        const previous = "/onboarding/basic-information";
        for (const path of ["/app/dashboard", "/app/diets"]) {
          for (const delta of [-1, 1]) {
            resetClient();
            payload = { success: true, data: { ...plan, isConfirm: true } };
            requests = 0;
            const router = routerFor(path, {
              initialEntries:
                delta === -1
                  ? [previous, path, destination]
                  : [previous, destination, path],
              initialIndex: delta === -1 ? 1 : 2,
            });
            try {
              await settled(router);
              assert.equal(router.state.location.pathname, path);
              assert.equal(requests, 1);
              await router.navigate(-delta);
              await settled(router);
              assert.equal(router.state.location.pathname, destination);

              // The server changed while the old confirmed plan is still fresh in Query.
              payload = { success: true, data: { ...plan, isConfirm: false } };
              await router.navigate(delta);
              await settled(router);
              assert.equal(
                router.state.location.pathname,
                destination,
                `${path} must guard POP ${delta}`,
              );
              assert.equal(
                requests,
                2,
                "One shared request per protected entry",
              );
              assert.equal(router.state.historyAction, "REPLACE");

              // Replacing the blocked entry lets Back leave instead of bouncing forever.
              await router.navigate(-1);
              await settled(router);
              if (delta === 1) {
                await router.navigate(-1);
                await settled(router);
              }
              assert.equal(router.state.location.pathname, previous);
              assert.equal(
                requests,
                2,
                "Review and unrelated entries do not refetch the plan",
              );
            } finally {
              router.dispose();
            }
          }
        }
      },
    );

    await t.test(
      "incomplete profiles retain onboarding priority and share profile validation",
      async () => {
        queryClient.clear();
        requests = 0;
        profileRequests = 0;
        payload = { success: true, data: { ...plan, isConfirm: false } };
        const router = routerFor("/app/dashboard");
        try {
          await settled(router);
          assert.equal(
            router.state.location.pathname,
            "/onboarding/basic-information",
          );
          assert.equal(requests, 0);
          assert.equal(profileRequests, 1);
        } finally {
          router.dispose();
        }
      },
    );

    await t.test(
      "offline request errors settle in the route error boundary without redirecting",
      async () => {
        resetClient();
        requests = 0;
        fail = true;
        onlineManager.setOnline(false);
        const router = routerFor("/app/dashboard");
        try {
          await settled(router);
          assert.equal(router.state.location.pathname, "/app/dashboard");
          assert.ok(router.state.errors);
          assert.equal(requests, 1);
        } finally {
          onlineManager.setOnline(true);
          router.dispose();
        }
      },
    );
  } finally {
    queryClient.clear();
    await server.close();
    if (storage) Object.defineProperty(globalThis, "localStorage", storage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
