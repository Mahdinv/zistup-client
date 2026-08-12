import axios, { isAxiosError } from "axios";

import { isApiFailureResponse } from "./api-response.types";

export type ApiErrorType =
  "api" | "network" | "timeout" | "cancelled" | "unknown";

type ApiErrorOptions = {
  type: ApiErrorType;
  message: string;
  code?: number;
  status?: number;
  method?: string;
  url?: string;
};

export class ApiError extends Error {
  readonly name = "ApiError";

  readonly type: ApiErrorType;
  readonly code?: number;
  readonly status?: number;
  readonly method?: string;
  readonly url?: string;

  constructor(options: ApiErrorOptions) {
    super(options.message);

    this.type = options.type;
    this.code = options.code;
    this.status = options.status;
    this.method = options.method;
    this.url = options.url;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (isAxiosError(error)) {
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;

    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return new ApiError({
        type: "cancelled",
        message: "درخواست لغو شد.",
        method,
        url,
      });
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError({
        type: "timeout",
        message: "زمان پاسخ‌گویی سرور تمام شد. دوباره تلاش کنید.",
        method,
        url,
      });
    }

    if (!error.response) {
      return new ApiError({
        type: "network",
        message: "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.",
        method,
        url,
      });
    }

    const status = error.response.status;
    const responseData = error.response.data;

    if (isApiFailureResponse(responseData)) {
      return new ApiError({
        type: "api",
        code: responseData.error.code,
        message: responseData.error.message,
        status,
        method,
        url,
      });
    }

    return new ApiError({
      type: "api",
      status,
      method,
      url,
      message:
        status >= 500
          ? "خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید."
          : "انجام درخواست ناموفق بود.",
    });
  }

  return new ApiError({
    type: "unknown",
    message: "خطای غیرمنتظره‌ای رخ داد.",
  });
}
