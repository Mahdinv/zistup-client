export const caloriesQueryKeys = {
  all: ["dashboard-calories"] as const,
  daily: (date: string | null) => [...caloriesQueryKeys.all, date] as const,
};
