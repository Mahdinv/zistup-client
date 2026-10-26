import type { Category } from "@/features/game-workflow/api/category.types";

type DietGoalQuantity = { value: number | null; unit: string };

export type DietGoalCategory = Omit<Category, "foodGroups"> & {
  foodGroups: (Category["foodGroups"][number] & {
    unit: string;
    wanted: DietGoalQuantity;
    provided: DietGoalQuantity & { grams: number };
  })[];
};

export type DietGoalsSummary = {
  diet: { key: string; title: string };
  categories: DietGoalCategory[];
};
