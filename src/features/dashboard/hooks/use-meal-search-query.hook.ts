import { useQuery } from "@tanstack/react-query";
import { searchMeals } from "../api/meal-search.api";

const useMealSearchQuery = (search: string, enabled: boolean) => {
  const term = search.trim();
  return useQuery({
    queryKey: ["dashboard-meal-search", term],
    queryFn: ({ signal }) => searchMeals(term, signal),
    enabled: enabled && term.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Network/server retries use the shared QueryClient policy.
  });
};

export default useMealSearchQuery;
