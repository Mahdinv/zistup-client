import { useQuery, skipToken } from "@tanstack/react-query";
import { useCallback } from "react";
import { getFoodInfo } from "../api/food-info.api";
import { mapFoodInfo } from "../api/mappers/food-info.mapper";
import type { FoodInfoRequest, FoodInfoResponse } from "../api/types/food-info.types";
import type { DietFoodDto } from "../api/dto/diet-day.dto";
export default function useFoodInfoQuery(
  foodId: number | null,
  foodType: FoodInfoRequest["type"] | null,
  enabled: boolean,
  planIngredients?: DietFoodDto["ingredients"],
) {
  return useQuery({
    queryKey: ["dashboard-food-info", foodId, foodType],
    queryFn:
      foodId != null && foodType != null
        ? ({ signal }) => getFoodInfo({ id: foodId, type: foodType }, signal)
        : skipToken,
    enabled: enabled && foodId != null && foodType != null,
    // Keep the cache recipe-specific and project the selected meal per drawer.
    select: useCallback(
      (response: FoodInfoResponse) => mapFoodInfo(response, planIngredients),
      [planIngredients],
    ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
