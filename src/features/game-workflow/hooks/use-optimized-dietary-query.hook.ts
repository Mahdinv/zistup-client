import { queryOptions, useQuery } from "@tanstack/react-query";
import { getOptimizedDietary } from "../api/optimized-dietary.api";
import {
  latestDietCacheOptions,
  latestDietQueryKey,
} from "@/features/dashboard/constants/latest-diet-query.constants";

export const optimizedDietaryQueryOptions = queryOptions({
  queryKey: latestDietQueryKey,
  ...latestDietCacheOptions,
  queryFn: ({ signal }) => getOptimizedDietary(signal),
  retry: false,
});

type QueryOptions = Pick<
  typeof optimizedDietaryQueryOptions,
  "staleTime" | "gcTime" | "refetchOnMount"
>;

const useOptimizedDietaryQuery = (
  enabled: boolean,
  options: QueryOptions = {},
) => {
  return useQuery({
    ...optimizedDietaryQueryOptions,
    enabled,
    refetchInterval: (query) => {
      const isReady =
        query.state.status === "success" &&
        query.state.data?.success === true &&
        !!query.state.data.data;
      return isReady ? false : 5_000;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: true,
    ...options,
  });
};

export default useOptimizedDietaryQuery;
