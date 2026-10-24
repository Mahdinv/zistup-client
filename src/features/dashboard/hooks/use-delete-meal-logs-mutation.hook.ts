import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import { deleteDayMealLogs, deleteMealLog } from "../api/meal-logs.api";
import { mealLogsQueryKeys } from "../constants/meal-logs-query.constants";
import { dietAdherenceQueryKeys } from "../constants/diet-adherence-query.constants";

type DeleteMealLogsRequest =
  { kind: "single"; id: number; date: string } | { kind: "day"; date: string };

export default function useDeleteMealLogsMutation() {
  const queryClient = useQueryClient();
  const inFlight = useRef(false);
  const mutation = useMutation({
    mutationFn: (request: DeleteMealLogsRequest) =>
      request.kind === "single"
        ? deleteMealLog(request.id)
        : deleteDayMealLogs(request.date),
    retry: false,
    onSuccess: async (_, request) => {
      toast.success(
        request.kind === "single" ? "وعده حذف شد" : "وعده‌های روز حذف شدند",
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: mealLogsQueryKeys.daily(request.date),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: dietAdherenceQueryKeys.daily(request.date),
          exact: true,
        }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
    onSettled: () => {
      inFlight.current = false;
    },
  });

  const remove = (request: DeleteMealLogsRequest) => {
    if (inFlight.current) return;
    inFlight.current = true;
    mutation.mutate(request);
  };

  return {
    remove,
    isPending: mutation.isPending,
    variables: mutation.variables,
  };
}
