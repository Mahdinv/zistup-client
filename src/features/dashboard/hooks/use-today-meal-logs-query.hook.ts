import { skipToken, useQuery } from "@tanstack/react-query";
import { getMealLogs } from "../api/meal-logs.api";
import { mealLogsQueryKeys } from "../constants/meal-logs-query.constants";
import { dashboardDateQueryOptions } from "../constants/dashboard-date-query.constants";

export default function useMealLogsQuery(date: string | null) {
  return useQuery({
    queryKey: mealLogsQueryKeys.daily(date),
    queryFn:
      date !== null ? ({ signal }) => getMealLogs(date, signal) : skipToken,
    ...dashboardDateQueryOptions,
  });
}
