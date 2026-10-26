import { skipToken, useQuery } from "@tanstack/react-query";
import { getDietAdherence } from "../api/diet-adherence.api";
import { dietAdherenceQueryKeys } from "../constants/diet-adherence-query.constants";
import { dashboardDateQueryOptions } from "../constants/dashboard-date-query.constants";

export default function useDietAdherenceQuery(date: string | null) {
  return useQuery({
    queryKey: dietAdherenceQueryKeys.daily(date),
    queryFn:
      date !== null
        ? ({ signal }) => getDietAdherence(date, signal)
        : skipToken,
    ...dashboardDateQueryOptions,
  });
}
