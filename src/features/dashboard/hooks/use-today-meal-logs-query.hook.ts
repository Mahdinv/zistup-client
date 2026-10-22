import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMealLogs } from "../api/meal-logs.api";
import { mealLogsQueryKeys } from "../constants/meal-logs-query.constants";
import {
  formatPlanDateForApi,
  getTehranCalendarDate,
} from "../lib/plan-date.utils";

const getToday = () => formatPlanDateForApi(getTehranCalendarDate());

export default function useTodayMealLogsQuery() {
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

  const query = useQuery({
    queryKey: mealLogsQueryKeys.daily(today),
    queryFn: ({ signal }) => getMealLogs(today, signal),
  });

  return { ...query, date: today };
}
