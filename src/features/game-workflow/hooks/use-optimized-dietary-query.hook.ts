import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getOptimizedDietary } from "../api/optimized-dietary.api";

type QueryOptions = Pick<
  UseQueryOptions<Awaited<ReturnType<typeof getOptimizedDietary>>>,
  "staleTime" | "gcTime" | "refetchOnMount"
>;

const useOptimizedDietaryQuery = (
  enabled: boolean,
  options: QueryOptions = {},
) => {
  return useQuery({
    queryKey: ["optimized-dietary-result"],
    queryFn: getOptimizedDietary,
    enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.success;
      return status === false ? 5_000 : false;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    ...options,
  });
};

export default useOptimizedDietaryQuery;
