import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import {
  ApiError,
  httpClient,
  queryClient,
  tokenStorage,
} from "../../../shared/api";
import type {
  AuthIdentifierDTO,
  UsernameAvailability,
  UsernameRegistrationVerifyDTO,
  PasswordLoginDTO,
  PasswordLoginResult,
  ForgotPasswordDTO,
  ForgotPasswordResult,
  VerifyForgotPasswordDTO,
  VerifyForgotPasswordResult,
  ResetForgotPasswordDTO,
  ResetForgotPasswordResult,
} from "./auth.types";
import z from "zod";

async function postRecovery<T>(
  path: string,
  input: unknown,
  schema: z.ZodType<T>,
): Promise<T> {
  const response = await httpClient.post<unknown>(path, input, {
    skipAuth: true,
  });
  const result = z
    .object({ success: z.literal(true), data: schema })
    .safeParse(response.data);
  if (!result.success)
    throw new ApiError({
      type: "api",
      message: "پاسخ بازیابی رمز عبور معتبر نیست. دوباره تلاش کنید.",
    });
  return result.data.data;
}

export function forgotPassword(
  input: ForgotPasswordDTO,
): Promise<ForgotPasswordResult> {
  return postRecovery(
    "/users/password/forgot",
    input,
    z.object({ mobile: z.string().min(1), message: z.string() }),
  );
}

export function verifyForgotPassword(
  input: VerifyForgotPasswordDTO,
): Promise<VerifyForgotPasswordResult> {
  return postRecovery(
    "/users/password/forgot/verify",
    input,
    z.object({
      reset_token: z.string().min(1),
      expires_in: z.number().int().positive(),
    }),
  );
}

export function resetForgotPassword(
  input: ResetForgotPasswordDTO,
): Promise<ResetForgotPasswordResult> {
  return postRecovery(
    "/users/password/forgot/reset",
    input,
    z.object({ message: z.string() }),
  );
}

const passwordLoginResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.number(),
    name: z.string(),
    mobile: z.string(),
    username: z.string(),
    token: z.string().trim().min(1),
  }),
});

export async function loginWithPassword(
  input: PasswordLoginDTO,
): Promise<PasswordLoginResult> {
  const response = await httpClient.post<unknown>(
    "/users/login/password",
    input,
    { skipAuth: true },
  );
  const result = passwordLoginResponseSchema.safeParse(response.data);
  if (!result.success) {
    throw new ApiError({
      type: "api",
      message: "پاسخ ورود معتبر نیست. دوباره تلاش کنید.",
    });
  }
  return result.data.data;
}

const usernameCheckFields = {
  success: z.literal(true),
  username: z.string(),
  message: z.string(),
};

const usernameCheckResponseSchema = z.discriminatedUnion("available", [
  z.object({
    ...usernameCheckFields,
    available: z.literal(true),
    reason: z.null(),
  }),
  z.object({
    ...usernameCheckFields,
    available: z.literal(false),
    reason: z.enum(["taken", "invalid"]),
  }),
]);

export async function checkUsername(
  username: string,
  signal?: AbortSignal,
): Promise<UsernameAvailability> {
  const response = await httpClient.post<unknown>(
    "/users/username/check",
    { username },
    { skipAuth: true, signal },
  );
  const result = usernameCheckResponseSchema.safeParse(response.data);
  if (!result.success || result.data.username !== username) {
    throw new ApiError({
      type: "api",
      message: "پاسخ بررسی نام کاربری معتبر نیست. دوباره تلاش کنید.",
    });
  }
  return result.data;
}

export async function getGoogleLoginUrl(): Promise<string> {
  const response = await httpClient.get<{ data: { url: string } }>(
    "/google/url",
    {
      skipAuth: true,
    },
  );
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

export async function validateUser(
  data:
    | {
        identifier: AuthIdentifierDTO;
        refCode?: string;
        code: string;
      }
    | UsernameRegistrationVerifyDTO,
) {
  const response = await httpClient.post(
    "/users/validate",
    "identifier" in data
      ? { ...data.identifier, code: data.code, refCode: data.refCode }
      : data,
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
