import { ApiError, httpClient } from "@/shared/api";
import type { FoodInfoResponse } from "./types/food-info.types";
export async function getFoodInfo(
  id: number,
  signal?: AbortSignal,
): Promise<FoodInfoResponse> {
  const response = await httpClient.post<FoodInfoResponse>(
    "/dashboard/food-info",
    { id },
    { signal },
  );
  if (!response.data.success)
    throw new ApiError({
      type: "api",
      message: "دریافت اطلاعات غذا ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "POST",
      url: "/dashboard/food-info",
    });
  return response.data;
}
