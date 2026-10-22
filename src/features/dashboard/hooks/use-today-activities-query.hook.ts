import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDailyActivities } from "../api/daily-activities.api";
import { activityQueryKeys } from "../constants/activity-query.constants";
import {
  formatPlanDateForApi,
  getTehranCalendarDate,
} from "../lib/plan-date.utils";

const getToday = () => formatPlanDateForApi(getTehranCalendarDate());

export default function useTodayActivitiesQuery() {
  const [today, setToday] = useState(getToday);
  useEffect(() => {
    const updateToday = () => setToday(getToday());
    const timer = window.setInterval(updateToday, 60_000);
    window.addEventListener("focus", updateToday);
    document.addEventListener("visibilitychange", updateToday);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", updateToday);
      document.removeEventListener("visibilitychange", updateToday);
    };
  }, []);
  return useQuery({
    queryKey: activityQueryKeys.daily(today),
    queryFn: ({ signal }) => getDailyActivities(today, signal),
  });
}
