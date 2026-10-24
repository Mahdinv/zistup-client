import { skipToken, useQuery } from "@tanstack/react-query";
import { getCalories } from "../api/calories.api";
import { caloriesQueryKeys } from "../constants/calories-query.constants";

export default function useCaloriesQuery(date: string | null) {
  return useQuery({
    queryKey: caloriesQueryKeys.daily(date),
    queryFn:
      date !== null ? ({ signal }) => getCalories(date, signal) : skipToken,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
