import { QueryClient } from "@tanstack/react-query";

import { shouldRetryQuery } from "./error.helpers";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,

      retryDelay: (attemptIndex) => {
        return Math.min(1_000 * 2 ** attemptIndex, 10_000);
      },
    },

    mutations: {
      /**
       * POST، PATCH و DELETE را
       * خودکار تکرار نمی‌کنیم.
       */
      retry: false,
    },
  },
});
