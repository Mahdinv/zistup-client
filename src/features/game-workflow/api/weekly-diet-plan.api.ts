import { ApiError, httpClient, isApiFailureResponse } from "@/shared/api";
import type { DietResponseDto } from "@/features/dashboard/api/dto/diet-response.dto";

export async function getWeeklyDietPlan() {
  const response = await httpClient.get<{
    success: boolean;
    status?: boolean;
    data?:
      | (Pick<DietResponseDto, "summary"> &
          Partial<Pick<DietResponseDto, "days" | "shopping">> & {
            status?: string;
          })
      | null;
  }>("/diet/v2/plan", {
    params: { diet: "zistpa" },
    allowUnsuccessfulResponse: true,
  });

  const result = response.data;
  // An explicit pending response is data, while API failures retain their error UI.
  if (
    result.success === false &&
    (result.status !== false || result.data != null || "error" in result)
  ) {
    const failure = isApiFailureResponse(result) ? result : undefined;
    throw new ApiError({
      type: "api",
      code: failure?.error.code,
      message: failure?.error.message ?? "انجام درخواست ناموفق بود.",
      status: response.status,
      method: "GET",
      url: response.config.url,
    });
  }

  return {
    ...result,
    // `success` is the response flag; `data.status` describes plan review.
    status:
      result.success === true &&
      result.status !== false &&
      Array.isArray(result.data?.shopping?.groups),
  };
}
