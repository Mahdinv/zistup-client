export const mealLogsQueryKeys = {
  all: ["dashboard-meal-logs"] as const,
  daily: (date: string | null) => [...mealLogsQueryKeys.all, date] as const,
};
