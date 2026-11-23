import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { normalizeApiError } from "@/shared/api";
import { latestDietQueryKey } from "@/features/dashboard/constants/latest-diet-query.constants";
import { confirmDietPlan } from "../api/confirm-diet-plan.api";
import { weeklyDietPlanQueryOptions } from "./use-weekly-diet-plan-query.hook";

export default function useConfirmDietPlanMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const submissionInFlight = useRef(false);
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: confirmDietPlan,
    retry: false,
    onSuccess: async () => {
      // Mark both plans stale; Dashboard's loader owns the next registered read.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: latestDietQueryKey,
          refetchType: "none",
        }),
        queryClient.invalidateQueries({
          queryKey: weeklyDietPlanQueryOptions.queryKey,
          refetchType: "none",
        }),
      ]);
      await navigate("/app/dashboard", { replace: true });
    },
    onError: (error) => toast.error(normalizeApiError(error).message),
    onSettled: () => {
      submissionInFlight.current = false;
    },
  });

  const submit = () => {
    if (submissionInFlight.current || isPending || isSuccess) return;
    submissionInFlight.current = true;
    mutate();
  };

  return { submit, isPending, isSuccess };
}
