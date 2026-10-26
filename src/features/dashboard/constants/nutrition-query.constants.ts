export const nutritionQueryKeys = {
  all: ["dashboard-nutrition"] as const,
  daily: (date: string | null) => [...nutritionQueryKeys.all, date] as const,
};
