import { httpClient } from "@/shared/api";
import type { FoodInfoRequest, FoodInfoResponse } from "./types/food-info.types";
export async function getFoodInfo(
  payload: FoodInfoRequest,
  signal?: AbortSignal,
): Promise<FoodInfoResponse> {
  const response = await httpClient.post<FoodInfoResponse>(
    "/dashboard/food-info",
    payload,
    { signal },
  );
  return response.data;
}
