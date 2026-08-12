import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Providers from "./app/providers.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./app/router.tsx";
import { configureHttpClient, queryClient, tokenStorage } from "./shared/api";

configureHttpClient({
  onUnauthorized: () => {
    tokenStorage.remove();
    queryClient.clear();
    window.location.replace("/auth/login");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
