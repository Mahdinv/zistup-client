import { ApiError, httpClient } from "@/shared/api";
import type { ExerciseSearchResponse } from "./types/exercise.types";

export async function searchExercises(text: string, signal?: AbortSignal) {
  const response = await httpClient.post<ExerciseSearchResponse>(
    "/dashboard/exercises/search",
    { text: text.trim() },
    { signal },
  );
  if (!response.data.success) {
    throw new ApiError({
      type: "api",
      message: "جستجوی فعالیت ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "POST",
      url: "/dashboard/exercises/search",
    });
  }
  return response.data;
}
