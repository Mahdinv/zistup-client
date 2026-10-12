import type { DietResponse } from "@/features/dashboard/api/types/diet-response.types";

export type LoaderStepType = {
  id: number;
  title: string;
  description: string;
  status: "in-progress" | "pending" | "completed";
};

export type OptimizedDietaryResponse = {
  success: boolean;
  data: DietResponse;
};
