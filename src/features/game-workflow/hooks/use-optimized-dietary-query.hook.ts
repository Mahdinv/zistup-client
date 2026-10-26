import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getOptimizedDietary } from "../api/optimized-dietary.api";
import {
  latestDietCacheOptions,
  latestDietQueryKey,
} from "@/features/dashboard/constants/latest-diet-query.constants";

type QueryOptions = Pick<
  UseQueryOptions<Awaited<ReturnType<typeof getOptimizedDietary>>>,
  "staleTime" | "gcTime" | "refetchOnMount"
>;

const useOptimizedDietaryQuery = (
  enabled: boolean,
  options: QueryOptions = {},
) => {
  return useQuery({
    queryKey: latestDietQueryKey,
    ...latestDietCacheOptions,
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
