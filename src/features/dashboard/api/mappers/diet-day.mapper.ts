import type {
  DietDayDto,
  DietFoodDto,
  DietNutritionDto,
} from "../dto/diet-day.dto";
import type {
  DietDay,
  DietFood,
  DietIngredient,
  DietNutrition,
} from "../types/diet-day.types";

const numberOrZero = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;
const stringOrEmpty = (value: unknown): string =>
  typeof value === "string" ? value : "";
const isFood = (value: unknown): value is DietFoodDto =>
  typeof value === "object" &&
  value !== null &&
  "type" in value &&
  (value.type === "recipe" || value.type === "base_food");
const validId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

const mapNutrition = (
  dto: DietNutritionDto | null | undefined,
): DietNutrition => ({
  caloriesKcal: numberOrZero(dto?.calories_kcal),
  proteinG: numberOrZero(dto?.protein_g),
  carbohydrateG: numberOrZero(dto?.carbohydrate_g),
  fiberG: numberOrZero(dto?.fiber_g),
});

// Normalize once for main foods, alternatives and companions; keep legacy plans readable.
const mapIngredients = (value: unknown): DietIngredient[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item: unknown): DietIngredient[] => {
    if (typeof item === "string")
      return item.trim() ? [{ name: item.trim() }] : [];
    if (
      !item ||
      typeof item !== "object" ||
      !("name" in item) ||
      typeof item.name !== "string" ||
      !item.name.trim()
    )
      return [];
    const ingredient = item as Partial<DietIngredient>;
    return [
      {
        name: item.name.trim(),
        id: validId(ingredient.id) ? ingredient.id : undefined,
        ingredient_id: validId(ingredient.ingredient_id)
          ? ingredient.ingredient_id
          : undefined,
        type:
          ingredient.type === "recipe" || ingredient.type === "base_food"
            ? ingredient.type
            : undefined,
        source_id:
          typeof ingredient.source_id === "string"
            ? ingredient.source_id
            : undefined,
        // Unknown weight is not zero, and must not seed detailed logging quantities.
        grams:
          ingredient.grams == null
            ? ingredient.grams
            : typeof ingredient.grams === "number" &&
                Number.isFinite(ingredient.grams) &&
                ingredient.grams >= 0
              ? ingredient.grams
              : null,
      },
    ];
  });
};

const mapFood = (dto: DietFoodDto): DietFood => ({
  type: dto.type,
  id: stringOrEmpty(dto.id),
  // Never derive an API ID from the recipe's string display ID.
  foodId: [dto.food_id, dto.foodId].find(validId) ?? 0,
  title: stringOrEmpty(dto.title),
  source: stringOrEmpty(dto.source),
  category: stringOrEmpty(dto.category),
  imageUrl: typeof dto.image_url === "string" ? dto.image_url : null,
  quantity: {
    grams: numberOrZero(dto.quantity?.grams),
    servings: numberOrZero(dto.quantity?.servings),
    unit: stringOrEmpty(dto.quantity?.unit),
  },
  ingredients: mapIngredients(dto.ingredients),
  nutrition: mapNutrition(dto.nutrition),
  companions: mapFoods(dto.companions),
});

const mapFoods = (value: unknown): DietFood[] =>
  Array.isArray(value) ? value.filter(isFood).map(mapFood) : [];

export const mapDietDay = (dto: DietDayDto): DietDay => ({
  day: dto.day,
  title: stringOrEmpty(dto.title),
  nutrition: mapNutrition(dto.nutrition),
  meals: (Array.isArray(dto.meals) ? dto.meals : [])
    .filter((meal) => meal && typeof meal === "object")
    .map((meal) => ({
      id: stringOrEmpty(meal.id),
      key: stringOrEmpty(meal.key),
      title: stringOrEmpty(meal.title),
      status: stringOrEmpty(meal.status),
      main: isFood(meal.main) ? mapFood(meal.main) : null,
      companions: mapFoods(meal.companions),
      nutrition: mapNutrition(meal.nutrition),
      totalGrams: numberOrZero(meal.total_grams),
      // Preserve alternative positions: a missing first choice must not relabel the second.
      alternatives: Array.isArray(meal.alternatives)
        ? meal.alternatives.map((food) => (isFood(food) ? mapFood(food) : null))
        : [],
      replacement: meal.replacement
        ? {
            target: stringOrEmpty(meal.replacement.target),
            keepCompanions: meal.replacement.keep_companions === true,
            requiresRevalidation:
              meal.replacement.requires_revalidation === true,
          }
        : null,
    })),
});
