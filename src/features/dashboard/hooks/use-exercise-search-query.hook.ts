import { useQuery } from "@tanstack/react-query";
import { searchExercises } from "../api/exercise-search.api";

export default function useExerciseSearchQuery(
  search: string,
  enabled: boolean,
) {
  const term = search.trim();
  return useQuery({
    queryKey: ["dashboard-exercise-search", term],
    queryFn: ({ signal }) => searchExercises(term, signal),
    enabled: enabled && term.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
