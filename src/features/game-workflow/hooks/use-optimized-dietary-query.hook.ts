import { useQuery } from "@tanstack/react-query";
import { getOptimizedDietary } from "../api/optimized-dietary.api";

const useOptimizedDietaryQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["optimized-dietary-result"],
    queryFn: getOptimizedDietary,
    enabled,

    refetchInterval: (query) => {
      const status = query.state.data?.status;

      return status === false ? 5_000 : false;
    },

    retry: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });
};

export default useOptimizedDietaryQuery;
