import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@/shared/lib/chartjs-setup";
import "@/index.css";

import Providers from "@/app/providers";
import ConnectionErrorBoundary from "@/app/connection-error-boundary";
import ErrorBoundary from "@/shared/base-components/error-boundary";
import createAppRouter from "@/app/router";

import { configureHttpClient, queryClient } from "@/shared/api";
import { setupImageRetry } from "./shared/lib/image-retry";

/* ---------------------------------- */
/* HTTP Client                        */
/* ---------------------------------- */

configureHttpClient({
  onUnauthorized: () => {
    queryClient.clear();
    useUserProfileStore.getState().clearUser();

    window.location.replace("/auth/login");
  },
});

setupImageRetry();
// Loaders start immediately; configure API/session error handling first.
const router = createAppRouter();

/* ---------------------------------- */
/* React Root                         */
/* ---------------------------------- */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <ErrorBoundary fallback={null}>
        <ConnectionErrorBoundary onHome={() => void router.navigate("/app/dashboard")} />
      </ErrorBoundary>
    </Providers>
  </StrictMode>,
);

/* ---------------------------------- */
/* Startup Screen                     */
/* ---------------------------------- */

const waitForNextPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });

const hideStartupScreen = async () => {
  const startupScreen = document.getElementById("startup-screen");
  if (!startupScreen) {
    return;
  }

  let fontTimeout: ReturnType<typeof setTimeout> | undefined;
  try {
    // A stalled font download must not cover the loader or recovery screen forever.
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => {
        fontTimeout = setTimeout(resolve, 1500);
      }),
    ]);
    await waitForNextPaint();
  } finally {
    clearTimeout(fontTimeout);
    startupScreen.classList.add("startup-screen--hide");
    await Promise.allSettled(
      startupScreen.getAnimations().map((animation) => animation.finished),
    );
    startupScreen.remove();
  }
};

void hideStartupScreen();
