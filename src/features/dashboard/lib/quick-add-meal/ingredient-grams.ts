export const GRAM_STEP = 5;
export function roundIngredientGrams(value: number): number {
  return Math.max(GRAM_STEP, Math.round(value / GRAM_STEP) * GRAM_STEP);
}
export function getIngredientGramValues(amount: number): number[] {
  const maximum = Math.max(1000, roundIngredientGrams(amount) + 1000);
  return Array.from(
    { length: maximum / GRAM_STEP },
    (_, index) => (index + 1) * GRAM_STEP,
  );
}
