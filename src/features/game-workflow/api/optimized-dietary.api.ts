import { httpClient } from "@/shared/api";
import type { DietResponseDto } from "@/features/dashboard/api/dto/diet-response.dto";
import type { OptimizedDietaryResponse } from "./optimized-dietary.types";
import { mapDietResponse } from "@/features/dashboard/api/mappers/diet-response.mapper";

export async function getOptimizedDietary(): Promise<OptimizedDietaryResponse> {
  const response = await httpClient.get<{
    success: boolean;
    data: DietResponseDto;
  }>("diet-plans/latest");

  return {
    success: response.data.success,
    data: mapDietResponse(response.data.data),
  };
}
