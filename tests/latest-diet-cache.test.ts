import assert from "node:assert/strict";
import { test } from "node:test";
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import {
  latestDietCacheOptions,
  latestDietQueryKey,
} from "../src/features/dashboard/constants/latest-diet-query.constants.ts";

test("Dashboard and Diets share requests, reuse fresh plans, and refresh after invalidation", async () => {
  const client = new QueryClient();
  let requests = 0;
  const options = {
    ...latestDietCacheOptions,
    queryKey: latestDietQueryKey,
    queryFn: async () => ({ version: ++requests }),
  };
  try {
    const [dashboard, diets] = await Promise.all([
      client.fetchQuery(options),
      client.fetchQuery(options),
    ]);
    assert.equal(requests, 1);
    assert.deepEqual(dashboard, diets);

    // Tab remounts and date-driven renders retain the same plan observer key.
    const observer = new QueryObserver(client, options);
    const unsubscribe = observer.subscribe(() => {});
    for (let day = 0; day < 7; day++) {
      observer.setOptions(options);
      await client.fetchQuery(options);
    }
    assert.equal(requests, 1);
    await client.invalidateQueries({ queryKey: latestDietQueryKey });
    assert.equal(requests, 2);
    assert.equal(observer.getCurrentResult().data?.version, 2);
    unsubscribe();
    await client.fetchQuery(options);
    assert.equal(requests, 2);
  } finally {
    client.clear();
  }
});
