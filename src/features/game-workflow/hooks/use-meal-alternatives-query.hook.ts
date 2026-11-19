import { useQuery } from "@tanstack/react-query";
import { getMealAlternatives, type MealType } from "../api/meal-alternatives.api";

export default function useMealAlternativesQuery(meal: MealType, open: boolean) {
  return useQuery({
    queryKey: ["meal-alternatives", "zistpa", meal],
    enabled: open,
    queryFn: async () => {
      try {
        // Share the in-flight request across remounts rather than cancelling it.
        const response = await getMealAlternatives(meal);
        console.log("Meal alternatives response:", response);
        return response;
      } catch (error) {
        console.error("Failed to fetch meal alternatives:", error);
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
