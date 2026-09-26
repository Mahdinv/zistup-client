import { httpClient } from "@/shared/api";
import type { OptimizedDietaryResponse } from "./optimized-dietary.types";

export async function getOptimizedDietary(): Promise<OptimizedDietaryResponse> {
  const response =
    await httpClient.get<OptimizedDietaryResponse>("diet-plans/latest");

  return response.data;
}
