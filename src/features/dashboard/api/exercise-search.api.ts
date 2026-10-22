import { httpClient } from "@/shared/api";
import type { ExerciseSearchResponse } from "./types/exercise.types";

export async function searchExercises(text: string, signal?: AbortSignal) {
  const response = await httpClient.post<ExerciseSearchResponse>(
    "/dashboard/exercises/search",
    { text: text.trim() },
    { signal },
  );
  return response.data;
}
