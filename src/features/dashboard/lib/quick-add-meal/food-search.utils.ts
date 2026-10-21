import type { MealSearchResponse } from "../../api/types/meal-search.types";
import type { SearchState } from "../../api/types/quick-add-meal.types";

export const normalizeFoodSearch = (value: string) =>
  value
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\s‌]+/g, " ");

export function getFoodSearchState(
  query: string,
  resource: {
    data: MealSearchResponse | undefined;
    isPending: boolean;
    isError: boolean;
    error: unknown;
  },
  isDebouncing = false,
): SearchState {
  if (!normalizeFoodSearch(query)) return { status: "idle" };
  if (isDebouncing) return { status: "loading" };
  if (resource.isError) return { status: "error", error: resource.error };
  if (resource.isPending || !resource.data) return { status: "loading" };
  const foods = resource.data.items;
  return foods.length ? { status: "results", foods } : { status: "not-found" };
}
