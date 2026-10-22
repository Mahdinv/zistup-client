import { ApiError, httpClient } from "@/shared/api";
import type { DailyActivitiesResponse } from "./types/daily-activities.types";

export async function getDailyActivities(
  date: string,
  signal?: AbortSignal,
): Promise<DailyActivitiesResponse> {
  const response = await httpClient.get<DailyActivitiesResponse>(
    "/dashboard/activities",
    {
      params: { date },
      signal,
    },
  );
  if (!response.data.success) {
    throw new ApiError({
      type: "api",
      message: "دریافت فعالیت‌های امروز ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "GET",
      url: "/dashboard/activities",
    });
  }
  return response.data;
}
