import axios, { isAxiosError } from "axios";

import { ApiError, normalizeApiError } from "./api-error";

import { isApiFailureResponse } from "./api-response.types";

import { tokenStorage } from "./token-storage";

type HttpClientConfiguration = {
  onUnauthorized?: () => void | Promise<void>;
};

let clientConfiguration: HttpClientConfiguration = {};

let handlingUnauthorized = false;

export function configureHttpClient(
  configuration: HttpClientConfiguration,
): void {
  clientConfiguration = configuration;
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Version: import.meta.env.VITE_APP_VERSION,
  },
});

httpClient.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = tokenStorage.get();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

httpClient.interceptors.response.use((response) => {
  if (isApiFailureResponse(response.data)) {
    throw new ApiError({
      type: "api",
      code: response.data.error.code,
      message: response.data.error.message,
      status: response.status,
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
    });
  }
  return response;
});

httpClient.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    const originalConfig = isAxiosError(error) ? error.config : undefined;
    const normalized = normalizeApiError(error);
    if (
      normalized.status === 401 &&
      !originalConfig?.skipAuth &&
      !handlingUnauthorized
    ) {
      handlingUnauthorized = true;
      try {
        tokenStorage.remove();

        await clientConfiguration.onUnauthorized?.();
      } finally {
        handlingUnauthorized = false;
      }
    }

    return Promise.reject(normalized);
  },
);
