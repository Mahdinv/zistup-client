import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@/index.css";

import Providers from "@/app/providers";
import router from "@/app/router";

import { configureHttpClient, queryClient } from "@/shared/api";

/* ---------------------------------- */
/* HTTP Client                        */
/* ---------------------------------- */

configureHttpClient({
  onUnauthorized: () => {
    queryClient.clear();

    window.location.replace("/auth/login");
  },
});

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

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const hideStartupScreen = async () => {
  const startupScreen = document.getElementById("startup-screen");
  if (!startupScreen) {
    return;
  }

  try {
    await document.fonts.ready;
    await waitForNextPaint();
    await delay(500);
  } finally {
    startupScreen.classList.add("startup-screen--hide");
    window.setTimeout(() => {
      startupScreen.remove();
    }, 320);
  }
};

void hideStartupScreen();
