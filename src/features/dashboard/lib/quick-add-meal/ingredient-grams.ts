export const GRAM_STEP = 5;
export const INGREDIENT_UNITS = [
  { id: "gram", label: "گرم", grams: 1 },
  { id: "spoon", label: "قاشق", grams: 15 },
  { id: "teaspoon", label: "قاشق چای‌خوری", grams: 4 },
  { id: "cup", label: "پیمانه", grams: 240 },
  { id: "handful", label: "مشت", grams: 30 },
  { id: "count", label: "عدد", grams: 45 },
  { id: "fruit", label: "عدد (میوه)", grams: 150 },
  { id: "piece", label: "تکه", grams: 40 },
  { id: "palm", label: "کف دست", grams: 120 },
  { id: "glass", label: "لیوان", grams: 200 },
  { id: "bite", label: "لقمه", grams: 35 },
  { id: "cube", label: "حبه", grams: 5 },
];
export function ingredientQuantityToGrams(selection: { unitId: string; amount: number }): number | null {
  const unit = INGREDIENT_UNITS.find((unit) => unit.id === selection.unitId);
  const grams = unit ? selection.amount * unit.grams : NaN;
  return Number.isFinite(grams) && grams >= 0 ? grams : null;
}
export function roundIngredientGrams(value: number): number {
  return Math.max(0, Math.round(value / GRAM_STEP) * GRAM_STEP);
}
export function getIngredientGramValues(amount: number): number[] {
  const maximum = Math.max(1000, roundIngredientGrams(amount) + 1000);
  return Array.from(
    { length: maximum / GRAM_STEP + 1 },
    (_, index) => index * GRAM_STEP,
  );
}
