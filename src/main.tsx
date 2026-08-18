import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./shared/lib/chartjs-setup";
import "@/index.css";

import Providers from "@/app/providers";
import router from "@/app/router";
import { configureHttpClient, queryClient } from "@/shared/api";
import AppLoader from "./shared/base-components/app-loader";

configureHttpClient({
  onUnauthorized: () => {
    queryClient.clear();
    window.location.replace("/auth/login");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Suspense
        fallback={
          <AppLoader
            theme="neutral"
            fullScreen
            label="در حال بارگذاری زیست‌آپ..."
          />
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </Providers>
  </StrictMode>,
);
