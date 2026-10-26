import { normalizeApiError } from "./api-error";

/** HTTP responses (including 4xx/5xx) are API errors, not lost connections. */
export function isConnectionError(error: unknown): boolean {
  const { type } = normalizeApiError(error);
  return type === "network" || type === "timeout";
}

export function getApiErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

export function getApiErrorCode(error: unknown): number | undefined {
  return normalizeApiError(error).code;
}

export function isApiErrorCode(error: unknown, code: number): boolean {
  return normalizeApiError(error).code === code;
}

export function isUnauthorizedError(error: unknown): boolean {
  return normalizeApiError(error).status === 401;
}

export function shouldRetryQuery(
  failureCount: number,
  error: unknown,
): boolean {
  if (failureCount >= 2) {
    return false;
  }

  const normalized = normalizeApiError(error);

  if (normalized.type === "network" || normalized.type === "timeout") {
    return true;
  }

  return normalized.status !== undefined && normalized.status >= 500;
}
