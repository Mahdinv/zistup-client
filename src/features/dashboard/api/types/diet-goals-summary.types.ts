import type { Category } from "@/features/game-workflow/api/category.types";

export type DietGoalsSummary = {
  diet: { key: string; title: string };
  categories: Category[];
};
