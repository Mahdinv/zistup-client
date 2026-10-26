// Re-entering a date fetches fresh data instead of displaying a cached snapshot.
export const dashboardDateQueryOptions = {
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: "always",
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  placeholderData: undefined,
} as const;
