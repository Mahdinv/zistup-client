import { httpClient } from "@/shared/api";
import type { DietAdherenceResponse } from "./types/diet-adherence.types";

export async function getDietAdherence(
  date: string,
  signal?: AbortSignal,
): Promise<DietAdherenceResponse | null> {
  const response = await httpClient.get<DietAdherenceResponse>(
    "/dashboard/diet-adherence",
    {
      params: { date },
      signal,
    },
  );

  return response.data || null;
}
