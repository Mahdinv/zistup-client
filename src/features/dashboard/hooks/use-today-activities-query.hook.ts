import { skipToken, useQuery } from "@tanstack/react-query";
import { getDailyActivities } from "../api/daily-activities.api";
import { activityQueryKeys } from "../constants/activity-query.constants";
import { dashboardDateQueryOptions } from "../constants/dashboard-date-query.constants";

export default function useDailyActivitiesQuery(date: string | null) {
  return useQuery({
    queryKey: activityQueryKeys.daily(date),
    queryFn:
      date !== null
        ? ({ signal }) => getDailyActivities(date, signal)
        : skipToken,
    ...dashboardDateQueryOptions,
  });
}
