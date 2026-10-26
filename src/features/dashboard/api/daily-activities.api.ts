import { httpClient } from "@/shared/api";
import type { DailyActivitiesResponse } from "./types/daily-activities.types";

export async function getDailyActivities(
  date: string,
  signal?: AbortSignal,
): Promise<DailyActivitiesResponse | null> {
  const response = await httpClient.get<DailyActivitiesResponse>(
    "/dashboard/activities",
    {
      params: { date },
      signal,
    },
  );
  return response.data || null;
}
