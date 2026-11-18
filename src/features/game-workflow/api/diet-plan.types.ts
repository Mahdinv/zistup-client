import type { DietResponse } from "@/features/dashboard/api/types/diet-response.types";

export type DietPlanResponse<TData = DietResponse> =
  | { success: true; data: TData }
  | { success: false; data: null };
