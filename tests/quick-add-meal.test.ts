import assert from "node:assert/strict";
import { test } from "node:test";
import {
  flowReducer,
  initialFlow,
  createSubmission,
} from "../src/features/dashboard/components/quick-add-meal/quick-add-meal.state.ts";
import {
  searchFoods,
  MOCK_FOODS,
  getGeneralUnits,
} from "../src/features/dashboard/components/quick-add-meal/quick-add-meal.data.ts";

test("search distinguishes idle, results, and not-found and normalizes Persian letters", () => {
  assert.equal(searchFoods("  ").status, "idle");
  assert.equal(searchFoods("چلو").status, "results");
  assert.equal(searchFoods("چلغوز").status, "not-found");
  assert.equal(searchFoods("پنير").status, "results");
});
test("navigation preserves query, meal, and quantities; closing cancels pending navigation", () => {
  let state = flowReducer(initialFlow, { type: "meal", mealId: "snack" });
  assert.equal(state.step, "meal");
  assert.equal(state.nextStep, "search");
  state = flowReducer(state, { type: "transition-complete" });
  state = flowReducer(state, { type: "query", query: "نان" });
  state = flowReducer(state, { type: "food", food: MOCK_FOODS[0] });
  state = flowReducer(state, { type: "transition-complete" });
  state = flowReducer(state, {
    type: "quantity",
    quantity: { amount: 6, unitId: "bite" },
  });
  state = flowReducer(state, { type: "detailed" });
  assert.deepEqual(state.quantity, { amount: 6, unitId: "bite" });
  assert.deepEqual(state.detailed?.bread, { amount: 2, unitId: "sangak-palm" });
  const submission = createSubmission(state)!;
  assert.equal(submission.mealId, "snack");
  assert.equal(submission.foodId, MOCK_FOODS[0].id);
  state = flowReducer(state, { type: "back" });
  assert.equal(state.detailed, null);
  assert.equal(state.step, "details");
  state = flowReducer(state, { type: "back" });
  state = flowReducer(state, { type: "transition-complete" });
  assert.equal(state.step, "search");
  assert.equal(state.query, "نان");
  assert.equal(state.quantity.amount, 6);
  state = flowReducer(state, { type: "back" });
  state = flowReducer(state, { type: "reset" });
  state = flowReducer(state, { type: "transition-complete" });
  assert.deepEqual(state, initialFlow);
});
test("local units remain available and selecting a new food clears previous details", () => {
  for (const food of MOCK_FOODS) {
    assert.deepEqual(
      getGeneralUnits(food)
        .slice(0, 3)
        .map((unit) => unit.id),
      ["bite", "spoon", "gram"],
    );
  }
  const state = flowReducer(
    {
      ...initialFlow,
      step: "search",
      food: MOCK_FOODS[0],
      detailed: { bread: { amount: 9, unitId: "sangak-palm" } },
    },
    { type: "food", food: MOCK_FOODS[1] },
  );
  assert.equal(state.detailed, null);
  assert.equal(state.food?.id, MOCK_FOODS[1].id);
});

test("large mapped portions remain selectable without an unbounded wheel", async () => {
  const { getDetailedAmounts } =
    await import("../src/features/dashboard/components/quick-add-meal/quick-add-meal.state.ts");
  const quantity = { amount: 1000, unitId: "serving" };
  const food = MOCK_FOODS[1];
  const values = getDetailedAmounts(food, quantity);
  assert.ok(values.includes(12000));
  assert.ok(values.length < 820);
  assert.equal(new Set(values).size, values.length);
});
