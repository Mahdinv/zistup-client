export const radarQueryKeys = {
  all: ["dashboard-radar"] as const,
  daily: (date: string | null) => [...radarQueryKeys.all, date] as const,
};
