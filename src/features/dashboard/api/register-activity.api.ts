import { ApiError, httpClient } from "@/shared/api";
import type {
  RegisterActivityRequest,
  RegisterActivityResponse,
} from "./types/register-activity.types";

export async function registerActivity(
  payload: RegisterActivityRequest,
): Promise<RegisterActivityResponse> {
  const response = await httpClient.post<RegisterActivityResponse>(
    "/dashboard/activities",
    payload,
  );
  if (!response.data.success) {
    throw new ApiError({
      type: "api",
      message: "ثبت فعالیت ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "POST",
      url: "/dashboard/activities",
    });
  }
  return response.data;
}
