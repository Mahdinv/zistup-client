export const activityQueryKeys = {
  all: ["dashboard-activities"] as const,
  daily: (date: string) => [...activityQueryKeys.all, date] as const,
};
