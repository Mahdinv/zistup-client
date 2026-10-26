import { skipToken, useQuery } from "@tanstack/react-query";
import { getRadar } from "../api/radar.api";
import { radarQueryKeys } from "../constants/radar-query.constants";
import { dashboardDateQueryOptions } from "../constants/dashboard-date-query.constants";

export default function useRadarQuery(date: string | null) {
  return useQuery({
    queryKey: radarQueryKeys.daily(date),
    queryFn: date !== null ? ({ signal }) => getRadar(date, signal) : skipToken,
    ...dashboardDateQueryOptions,
  });
}
