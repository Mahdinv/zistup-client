const GRAMS_PER_KILOGRAM = 1000;

const FOOD_ITEM_GRAMS_PER_UNIT: Readonly<Record<string, number>> = {
  "source-1": 44,
  "source-30": 30,
};

export const formatGramQuantity = (
  quantityG: number | null | undefined,
): string => {
  if (quantityG == null || !Number.isFinite(quantityG) || quantityG < 0) {
    return "";
  }

  const grams = Math.round(quantityG);
  const kilograms = Math.floor(grams / GRAMS_PER_KILOGRAM);
  const remainingGrams = grams % GRAMS_PER_KILOGRAM;

  if (kilograms === 0) {
    return `${grams} گرم`;
  }

  return remainingGrams === 0
    ? `${kilograms} کیلو`
    : `${kilograms} کیلو و ${remainingGrams} گرم`;
};

export const formatFoodItemQuantity = (
  quantityG: number | null | undefined,
  itemId: string,
): string => {
  const gramsPerUnit = FOOD_ITEM_GRAMS_PER_UNIT[itemId];

  if (typeof gramsPerUnit !== "number") {
    return formatGramQuantity(quantityG);
  }

  if (quantityG == null || !Number.isFinite(quantityG) || quantityG < 0) {
    return "";
  }

  return `${Math.round(quantityG / gramsPerUnit)} عدد`;
};
