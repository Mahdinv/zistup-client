import useOptimizedDietaryQuery from "@/features/game-workflow/hooks/use-optimized-dietary-query.hook";

// Subscribe to the same plan cache as Dashboard; do not copy server state.
export default function useDietsQuery() {
  const query = useOptimizedDietaryQuery(true);
  return {
    ...query,
    data: query.data?.success
      ? (query.data.data.dietGoalsSummary ?? null)
      : undefined,
  };
}
