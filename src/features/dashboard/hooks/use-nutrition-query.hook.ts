import { skipToken, useQuery } from "@tanstack/react-query";
import { getNutrition } from "../api/nutrition.api";
import { nutritionQueryKeys } from "../constants/nutrition-query.constants";
import { dashboardDateQueryOptions } from "../constants/dashboard-date-query.constants";

export default function useNutritionQuery(date: string | null) {
  return useQuery({
    queryKey: nutritionQueryKeys.daily(date),
    queryFn:
      date !== null ? ({ signal }) => getNutrition(date, signal) : skipToken,
    ...dashboardDateQueryOptions,
  });
}
