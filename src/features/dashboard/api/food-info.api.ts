import { httpClient } from "@/shared/api";
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
  return response.data;
}
