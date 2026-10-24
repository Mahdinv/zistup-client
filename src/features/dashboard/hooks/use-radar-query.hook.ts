import { useQuery } from "@tanstack/react-query";
import { getRadar } from "../api/radar.api";
import { radarQueryKeys } from "../constants/radar-query.constants";

export default function useRadarQuery(date: string) {
  return useQuery({
    queryKey: radarQueryKeys.daily(date),
    queryFn: ({ signal }) => getRadar(date, signal),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
