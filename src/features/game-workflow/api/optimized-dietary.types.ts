export type LoaderStepType = {
  id: number;
  title: string;
  description: string;
  status: "in-progress" | "pending" | "completed";
};

export type DietResponse = {
  id: number;
  title: string;
};

export type OptimizedDietaryResponse = {
  success: boolean;
  data: unknown;
};
