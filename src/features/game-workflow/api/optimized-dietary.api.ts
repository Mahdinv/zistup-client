import { httpClient } from "@/shared/api";
import type { DietResponseDto } from "@/features/dashboard/api/dto/diet-response.dto";
import type { OptimizedDietaryResponse } from "./optimized-dietary.types";
import { mapDietResponse } from "@/features/dashboard/api/mappers/diet-response.mapper";

export async function getOptimizedDietary(
  signal?: AbortSignal,
): Promise<OptimizedDietaryResponse> {
  const response = await httpClient.get<{
    success: boolean;
    data?: DietResponseDto | null;
  }>("diet-plans/latest", { signal, allowUnsuccessfulResponse: true });

  const { success, data } = response.data;
  // A pending or incomplete payload must not reach the plan mapper or finish loading.
  if (
    success !== true ||
    !data ||
    !data.created_at_utc ||
    !Number.isFinite(Date.parse(data.created_at_utc)) ||
    !data.diet?.key?.trim() ||
    !data.diet?.title?.trim() ||
    !Array.isArray(data.days) ||
    data.days.length === 0 ||
    !Array.isArray(data.shopping?.groups)
  ) {
    return { success: false, data: null };
  }

  return {
    success: true,
    data: mapDietResponse(data),
  };
}
