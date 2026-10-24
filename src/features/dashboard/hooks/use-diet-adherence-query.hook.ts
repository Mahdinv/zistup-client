import { skipToken, useQuery } from "@tanstack/react-query";
import { getDietAdherence } from "../api/diet-adherence.api";
import { dietAdherenceQueryKeys } from "../constants/diet-adherence-query.constants";

export default function useDietAdherenceQuery(date: string | null) {
  return useQuery({
    queryKey: dietAdherenceQueryKeys.daily(date),
    queryFn:
      date !== null
        ? ({ signal }) => getDietAdherence(date, signal)
        : skipToken,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
