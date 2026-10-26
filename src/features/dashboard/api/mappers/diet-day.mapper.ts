import type {
  DietDayDto,
  DietFoodDto,
  DietNutritionDto,
} from "../dto/diet-day.dto";
import type { DietDay, DietFood, DietNutrition } from "../types/diet-day.types";

const mapNutrition = (dto: DietNutritionDto): DietNutrition => ({
  caloriesKcal: dto.calories_kcal,
  proteinG: dto.protein_g,
  carbohydrateG: dto.carbohydrate_g,
  fiberG: dto.fiber_g,
});

const mapFood = (dto: DietFoodDto): DietFood => ({
  id: dto.id,
  foodId: dto.foodId,
  title: dto.title,
  source: dto.source,
  category: dto.category,
  imageUrl: dto.image_url,
  quantity: dto.quantity,
  ingredients: dto.ingredients ?? [],
  nutrition: mapNutrition(dto.nutrition),
  companions: (dto.companions ?? []).map(mapFood),
});

export const mapDietDay = (dto: DietDayDto): DietDay => ({
  day: dto.day,
  title: dto.title,
  nutrition: mapNutrition(dto.nutrition),
  meals: (dto.meals ?? []).map((meal) => ({
    id: meal.id,
    key: meal.key,
    title: meal.title,
    status: meal.status,
    main: meal.main ? mapFood(meal.main) : null,
    companions: (meal.companions ?? []).map(mapFood),
    nutrition: mapNutrition(meal.nutrition),
    totalGrams: meal.total_grams,
    alternatives: (meal.alternatives ?? []).map(mapFood),
    replacement: {
      target: meal.replacement.target,
      keepCompanions: meal.replacement.keep_companions,
      requiresRevalidation: meal.replacement.requires_revalidation,
    },
  })),
});
