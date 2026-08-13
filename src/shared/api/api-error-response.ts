export type ApiFailureResponse = {
  success: false;
  error: {
    code: number;
    message: string;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * در زمان اجرا بررسی می‌کند پاسخ واقعاً
 * همان ساختار خطای مورد توافق Backend باشد.
 */
export function isApiFailureResponse(
  value: unknown,
): value is ApiFailureResponse {
  if (!isRecord(value)) {
    return false;
  }

  if (value.success !== false || !isRecord(value.error)) {
    return false;
  }

  return (
    typeof value.error.code === "number" &&
    Number.isFinite(value.error.code) &&
    typeof value.error.message === "string" &&
    value.error.message.trim().length > 0
  );
}
