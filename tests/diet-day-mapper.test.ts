import assert from "node:assert/strict";
import { test } from "node:test";
import { mapDietDay } from "../src/features/dashboard/api/mappers/diet-day.mapper.ts";
import type {
  DietDayDto,
  DietFoodDto,
} from "../src/features/dashboard/api/dto/diet-day.dto.ts";

const food: DietFoodDto = {
  id: "recipe-display-code",
  food_id: 225,
  type: "recipe",
  title: "Test food",
  source: "test",
  category: "test",
  image_url: null,
  quantity: { grams: 270, servings: 1.5, unit: "serving" },
  nutrition: {
    calories_kcal: 100,
    protein_g: 2,
    carbohydrate_g: 3,
    fiber_g: 4,
  },
  ingredients: [
    {
      id: 117,
      ingredient_id: 117,
      name: "Beans",
      type: "base_food",
      source_id: "ING_138",
      grams: null,
    },
  ],
};
function map(
  main: unknown,
  alternatives: unknown = [],
  companions: unknown = [],
) {
  return mapDietDay({
    day: 1,
    title: "day",
    meals: [{ id: "meal", key: "breakfast", main, alternatives, companions }],
  } as unknown as DietDayDto).meals[0];
}

test("v2 objects and nullable weights normalize identically for all food positions", () => {
  const meal = map({ ...food, companions: [food] }, [food], [food]);
  for (const mapped of [
    meal.main,
    meal.alternatives[0],
    meal.companions[0],
    meal.main?.companions[0],
  ]) {
    assert.equal(mapped?.foodId, 225);
    assert.equal(mapped?.id, "recipe-display-code");
    assert.equal(mapped?.type, "recipe");
    assert.deepEqual(mapped?.ingredients[0], food.ingredients?.[0]);
    assert.equal(mapped?.quantity.grams, 270);
  }
});
test("only a valid numeric food_id/foodId becomes the API identity", () => {
  assert.equal(
    map({ ...food, food_id: undefined, foodId: 658, type: "base_food" }).main
      ?.foodId,
    658,
  );
  assert.equal(map({ ...food, food_id: 225, foodId: 658 }).main?.foodId, 225);
  assert.equal(
    map({ ...food, id: "123", food_id: "123", foodId: null }).main?.foodId,
    0,
  );
  assert.equal(map({ ...food, food_id: -1, foodId: 4.5 }).main?.foodId, 0);
  assert.equal(map({ ...food, type: "unexpected" }).main, null);
});
test("legacy, missing and malformed ingredient collections never become React objects", () => {
  const result = map({
    ...food,
    ingredients: [
      " Legacy ",
      null,
      42,
      {},
      { name: {} },
      { name: " " },
      { name: " valid ", grams: "bad" },
    ],
  });
  assert.deepEqual(
    result.main?.ingredients.map((item) => item.name),
    ["Legacy", "valid"],
  );
  assert.equal(result.main?.ingredients[1].grams, null);
  for (const ingredients of [undefined, null, {}, "bad"])
    assert.deepEqual(map({ ...food, ingredients }).main?.ingredients, []);
});
test("missing nested food data is safe and alternative slots remain stable", () => {
  const meal = map(
    { type: "recipe", ingredients: [], companions: [null, {}, food] },
    [null, food],
    null,
  );
  assert.equal(meal.main?.quantity.grams, 0);
  assert.equal(meal.main?.nutrition.caloriesKcal, 0);
  assert.equal(meal.main?.companions.length, 1);
  assert.equal(meal.alternatives[0], null);
  assert.equal(meal.alternatives[1]?.foodId, 225);
  assert.deepEqual(meal.companions, []);
  assert.deepEqual(map(null, {}).alternatives, []);
});
