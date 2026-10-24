import { useQuery } from "@tanstack/react-query";
import { getNutrition } from "../api/nutrition.api";
import { nutritionQueryKeys } from "../constants/nutrition-query.constants";

export default function useNutritionQuery(date: string) {
  return useQuery({
    queryKey: nutritionQueryKeys.daily(date),
    queryFn: ({ signal }) => getNutrition(date, signal),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
