import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerActivity } from "../api/register-activity.api";
import { activityQueryKeys } from "../constants/activity-query.constants";

export default function useRegisterActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerActivity,
    // The endpoint provides no idempotency key; retries must be explicit.
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
}
