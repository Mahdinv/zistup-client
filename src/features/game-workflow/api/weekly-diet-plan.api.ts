import { httpClient } from "@/shared/api";
import type { DietResponseDto } from "@/features/dashboard/api/dto/diet-response.dto";
import type { DietPlanResponse } from "./diet-plan.types";

export async function getWeeklyDietPlan() {
  const response = await httpClient.get<
    DietPlanResponse<Pick<DietResponseDto, "summary"> & Partial<Pick<DietResponseDto, "days">>>
  >("/diet/v2/plan", {
    params: { diet: "zistpa" },
  });

  return response.data;
}
