import { httpClient } from "@/shared/api";
import type { RadarResponse } from "./types/radar.types";

export async function getRadar(
  date: string,
  signal?: AbortSignal,
): Promise<RadarResponse> {
  const response = await httpClient.get<RadarResponse>("/dashboard/radar", {
    params: { date },
    signal,
  });

  return response.data;
}
