export const mealLogsQueryKeys = {
  all: ["dashboard-meal-logs"] as const,
  daily: (date: string) => [...mealLogsQueryKeys.all, date] as const,
};
