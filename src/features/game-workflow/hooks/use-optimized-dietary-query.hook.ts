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
    queryFn: ({ signal }) => getOptimizedDietary(signal),
    enabled,
    refetchInterval: (query) => {
      const isReady =
        query.state.status === "success" &&
        query.state.data?.success === true &&
        !!query.state.data.data;
      return isReady ? false : 5_000;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: true,
    ...options,
  });
};

export default useOptimizedDietaryQuery;
