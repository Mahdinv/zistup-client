import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import {
  ApiError,
  httpClient,
  queryClient,
  tokenStorage,
} from "../../../shared/api";
import type { AuthIdentifierDTO } from "./auth.types";

export async function getGoogleLoginUrl(): Promise<string> {
  const response = await httpClient.get<{ data: { url: string } }>("/google/url", {
    skipAuth: true,
  });
  const value = response.data?.data?.url;
  // Only navigate to Google's HTTPS authorization endpoint.
  let url: URL | undefined;
  try {
    if (typeof value === "string") url = new URL(value);
  } catch {
    // Invalid backend responses use the same safe error as an untrusted URL.
  }
  if (
    !url ||
    url.origin !== "https://accounts.google.com" ||
    url.username ||
    url.password
  ) {
    throw new ApiError({
      type: "api",
      message: "آدرس ورود با گوگل معتبر نیست.",
    });
  }
  return url.href;
}

export async function sendCode(input: AuthIdentifierDTO) {
  const response = await httpClient.post("/users/sendCode", input, {
    skipAuth: true,
  });
  return response;
}

export async function validateUser(data: {
  identifier: AuthIdentifierDTO;
  refCode?: string;
  code: string;
}) {
  const response = await httpClient.post(
    "/users/validate",
    { ...data.identifier, code: data.code, refCode: data.refCode },
    {
      skipAuth: true,
    },
  );
  return response.data.data;
}

export function logout() {
  tokenStorage.remove();
  queryClient.clear();
  useUserProfileStore.getState().clearUser();
}
