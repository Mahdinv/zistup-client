export type CaloriesData = {
  consumed: number;
  target: number;
};

export type CaloriesResponse = {
  success: boolean;
  data: CaloriesData | null;
};
