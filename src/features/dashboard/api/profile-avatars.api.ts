import { httpClient } from "@/shared/api";

export async function getProfileAvatars(signal?: AbortSignal) {
  const response = await httpClient.get<{ avatars: string[] }>(
    "/users/avatars",
    { signal },
  );
  return response.data.avatars;
}
