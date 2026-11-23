import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getWeeklyDietPlan } from "../api/weekly-diet-plan.api";

type QueryOptions = Pick<
  UseQueryOptions<Awaited<ReturnType<typeof getWeeklyDietPlan>>>,
  "enabled" | "staleTime" | "refetchInterval" | "refetchIntervalInBackground"
>;

export default function useWeeklyDietPlanQuery(options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["weekly-diet-plan", "zistpa"],
    queryFn: async () => {
      try {
        // Keep the request alive across StrictMode remounts so it can be shared.
        const response = await getWeeklyDietPlan();
        console.log("Weekly diet plan response:", response);
        return response;
      } catch (error) {
        console.error("Failed to fetch weekly diet plan:", error);
        throw error;
      }
    },
    staleTime: Infinity,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    ...options,
  });
}
