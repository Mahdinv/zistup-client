export const radarQueryKeys = {
  all: ["dashboard-radar"] as const,
  daily: (date: string) => [...radarQueryKeys.all, date] as const,
};
