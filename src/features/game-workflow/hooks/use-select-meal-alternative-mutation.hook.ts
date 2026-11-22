import { useMutation, useQueryClient } from "@tanstack/react-query";
import { latestDietQueryKey } from "@/features/dashboard/constants/latest-diet-query.constants";
import {
  selectMealAlternative,
  type MealSelection,
} from "../api/meal-alternatives.api";

export default function useSelectMealAlternativeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MealSelection) => selectMealAlternative(payload),
    retry: false,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["weekly-diet-plan", "zistpa"],
        }),
        queryClient.invalidateQueries({ queryKey: latestDietQueryKey }),
      ]);
    },
  });
}
