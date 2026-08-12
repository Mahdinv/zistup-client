import type { AuthHeaderConfig } from "./auth-route-handle";

export type AuthNavigationState<T = unknown> = {
  data?: T;
  authHeader?: AuthHeaderConfig;
};
