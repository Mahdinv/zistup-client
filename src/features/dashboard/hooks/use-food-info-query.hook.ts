import { useQuery, skipToken } from "@tanstack/react-query";
import { getFoodInfo } from "../api/food-info.api";
import { mapFoodInfo } from "../api/mappers/food-info.mapper";
export default function useFoodInfoQuery(
  foodId: number | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["dashboard-food-info", foodId],
    queryFn:
      foodId != null ? ({ signal }) => getFoodInfo(foodId, signal) : skipToken,
    enabled: enabled && foodId != null,
    select: mapFoodInfo,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
