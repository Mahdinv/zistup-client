import { httpClient } from "@/shared/api";
import type {
  RegisterActivityRequest,
  RegisterActivityResponse,
} from "./types/register-activity.types";

export async function registerActivity(
  payload: RegisterActivityRequest,
): Promise<RegisterActivityResponse> {
  const response = await httpClient.post<RegisterActivityResponse>(
    "/dashboard/activities",
    payload,
  );
  return response.data;
}
