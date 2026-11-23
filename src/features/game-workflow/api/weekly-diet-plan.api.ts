import { httpClient } from "@/shared/api";
import type { DietResponseDto } from "@/features/dashboard/api/dto/diet-response.dto";
import type { DietPlanResponse } from "./diet-plan.types";

export async function getWeeklyDietPlan() {
  const response = await httpClient.get<
    DietPlanResponse<
      Pick<DietResponseDto, "summary"> &
        Partial<Pick<DietResponseDto, "days" | "shopping">> & {
          status?: string;
        }
    > & { status?: boolean }
  >("/diet/v2/plan", {
    params: { diet: "zistpa" },
  });

  const result = response.data;

  return {
    ...result,
    // `success` is the response flag; `data.status` describes plan review.
    status:
      result.success === true &&
      result.status !== false &&
      Array.isArray(result.data?.shopping?.groups),
  };
}
