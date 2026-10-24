export const dietAdherenceQueryKeys = {
  all: ["dashboard-diet-adherence"] as const,
  daily: (date: string | null) =>
    [...dietAdherenceQueryKeys.all, date] as const,
};
