// The latest plan belongs to the session, never to the selected Dashboard date.
export const latestDietQueryKey = ["diet-plans", "latest"] as const;
export const latestDietCacheOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
};
