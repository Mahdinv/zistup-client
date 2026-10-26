export const activityQueryKeys = {
  all: ["dashboard-activities"] as const,
  daily: (date: string | null) => [...activityQueryKeys.all, date] as const,
};
