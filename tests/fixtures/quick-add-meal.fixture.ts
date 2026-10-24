import type { Food } from "../../src/features/dashboard/api/types/quick-add-meal.types";
export const TEST_FOODS: Food[] = [
  {
    id: "123",
    title: "غذای آزمایشی",
    defaultUnitId: "serving",
    servingWeightGrams: 350,
    amountGrams: 100,
    nutrition: {
      kcal: 300,
      protein: 12,
      fiber: 4,
      carbohydrates: 35,
      greenhouseGas: null,
      environmentalImpact: null,
      water: null,
    },
    generalUnits: [{ id: "serving", label: "پرس" }],
    parts: [
      { id: "bread", title: "ترکیب آزمایشی", kcal: 23, initialAmount: 80 },
    ],
  },
];
