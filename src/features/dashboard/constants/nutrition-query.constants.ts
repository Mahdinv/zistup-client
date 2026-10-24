export const nutritionQueryKeys = {
  all: ["dashboard-nutrition"] as const,
  daily: (date: string) => [...nutritionQueryKeys.all, date] as const,
};
