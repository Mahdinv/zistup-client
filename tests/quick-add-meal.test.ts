import { TEST_FOODS } from "./fixtures/quick-add-meal.fixture.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  flowReducer,
  initialFlow,
} from "../src/features/dashboard/lib/quick-add-meal/quick-add-meal.state.ts";
import { getGeneralUnits } from "../src/features/dashboard/lib/quick-add-meal/quantity-units.ts";

test("navigation preserves query, meal, and quantities; closing cancels pending navigation", () => {
  let state = flowReducer(initialFlow, { type: "meal", mealId: "snack" });
  assert.equal(state.step, "meal");
  assert.equal(state.nextStep, "search");
  state = flowReducer(state, { type: "transition-complete" });
  state = flowReducer(state, { type: "query", query: "نان" });
  state = flowReducer(state, { type: "food", foodId: 324 });
  state = flowReducer(state, { type: "transition-complete" });
  assert.equal(state.quantity.amount, 1);
  state = flowReducer(state, {
    type: "quantity",
    quantity: { amount: 6, unitId: "bite" },
  });
  state = flowReducer(state, {
    type: "detailed",
    food: {
      ...TEST_FOODS[0],
      parts: TEST_FOODS[0].parts.map((part) => ({
        ...part,
        initialAmount: 80,
      })),
    },
  });
  assert.deepEqual(state.quantity, { amount: 6, unitId: "bite" });
  assert.deepEqual(state.detailed?.bread, { amount: 80, unitId: "gram" });
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
  for (const food of TEST_FOODS) {
    assert.deepEqual(
      getGeneralUnits(food)
        .slice(0, 4)
        .map((unit) => unit.id),
      ["palm", "bite", "spoon", "gram"],
    );
  }
  const state = flowReducer(
    {
      ...initialFlow,
      step: "search",
      selectedFoodId: 324,
      quantity: { amount: 243, unitId: "spoon" },
      detailed: { bread: { amount: 9, unitId: "sangak-palm" } },
    },
    { type: "food", foodId: 325 },
  );
  assert.equal(state.detailed, null);
  assert.equal(state.selectedFoodId, 325);
  assert.deepEqual(state.quantity, { amount: 1, unitId: "" });
});
