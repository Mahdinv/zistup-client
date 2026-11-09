import { useQuery, skipToken } from "@tanstack/react-query";
import { getFoodInfo } from "../api/food-info.api";
import { mapFoodInfo } from "../api/mappers/food-info.mapper";
import type { FoodInfoRequest } from "../api/types/food-info.types";
export default function useFoodInfoQuery(
  foodId: number | null,
  foodType: FoodInfoRequest["type"] | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["dashboard-food-info", foodId, foodType],
    queryFn:
      foodId != null && foodType != null
        ? ({ signal }) => getFoodInfo({ id: foodId, type: foodType }, signal)
        : skipToken,
    enabled: enabled && foodId != null && foodType != null,
    select: mapFoodInfo,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
