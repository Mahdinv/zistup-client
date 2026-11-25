import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import { deleteActivity } from "../api/daily-activities.api";
import { activityQueryKeys } from "../constants/activity-query.constants";

export default function useDeleteActivityMutation() {
  const queryClient = useQueryClient();
  const inFlight = useRef(false);
  const mutation = useMutation({
    mutationFn: deleteActivity,
    retry: false,
    onSuccess: async () => {
      toast.success("فعالیت حذف شد");
      await queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
    onSettled: () => {
      inFlight.current = false;
    },
  });

  const remove = (id: number) => {
    if (inFlight.current) return;
    inFlight.current = true;
    mutation.mutate(id);
  };

  return {
    remove,
    isPending: mutation.isPending,
    variables: mutation.variables,
  };
}
