import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getFoodSearchState,
  normalizeFoodSearch,
} from "../src/features/dashboard/lib/quick-add-meal/food-search.utils.ts";
const foods = [
  {
    id: 324,
    name: "خورش آلوچه",
    serving_unit: "serving",
    serving_weight: 300,
    nutrition: { calories_kcal: 588.3487 },
  },
];
const loaded = {
  data: { success: true, items: foods },
  isPending: false,
  isError: false,
  error: null,
};
test("server search preserves idle, loading, errors, empty, and results distinctly", () => {
  assert.equal(
    getFoodSearchState("  ", { ...loaded, isPending: true }).status,
    "idle",
  );
  assert.equal(
    getFoodSearchState("نان", { ...loaded, data: undefined, isPending: true })
      .status,
    "loading",
  );
  assert.equal(
    getFoodSearchState("نان", {
      ...loaded,
      isError: true,
      error: new Error("failed"),
    }).status,
    "error",
  );
  assert.equal(getFoodSearchState("پنير", loaded).status, "results");
  assert.deepEqual(getFoodSearchState("چلو", loaded), {
    status: "results",
    foods,
  });
  assert.equal(
    getFoodSearchState("نان", { ...loaded, data: { success: true, items: [] } })
      .status,
    "not-found",
  );
  assert.equal(normalizeFoodSearch("  پنير  "), "پنیر");
  assert.equal(getFoodSearchState("جدید", loaded, true).status, "loading");
  assert.equal(getFoodSearchState("  ", loaded, true).status, "idle");
});
