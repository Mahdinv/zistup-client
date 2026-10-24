import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/shared/api";
import { addMeal } from "../api/add-meal.api";
import type { AddMealPayload } from "../api/types/add-meal.types";
import { mealLogsQueryKeys } from "../constants/meal-logs-query.constants";
import { dietAdherenceQueryKeys } from "../constants/diet-adherence-query.constants";
import { caloriesQueryKeys } from "../constants/calories-query.constants";
import { radarQueryKeys } from "../constants/radar-query.constants";

export default function useAddMealMutation() {
  const queryClient = useQueryClient();
  const submissionInFlight = useRef(false);
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: addMeal,
    onSuccess: async () => {
      toast.success("غذا با موفقیت ثبت شد");
      // Keep submission pending until active dashboard views refresh.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: mealLogsQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dietAdherenceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: caloriesQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: radarQueryKeys.all }),
      ]);
    },
    onError: (error) => toast.error(normalizeApiError(error).message),
  });
  const submitMeal = async (submission: AddMealPayload): Promise<boolean> => {
    if (submissionInFlight.current) return false;
    submissionInFlight.current = true;
    try {
      await mutateAsync(submission);
      return true;
    } catch {
      return false;
    } finally {
      submissionInFlight.current = false;
    }
  };
  return { submitMeal, isPending, isSuccess, submissionInFlight };
}
