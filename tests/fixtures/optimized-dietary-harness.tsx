import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import OptimizedDietaryPage from "../../src/features/game-workflow/pages/optimized-dietary-page";
import { httpClient } from "../../src/shared/api";
import "../../src/index.css";

httpClient.defaults.baseURL = window.location.origin;
const params = new URLSearchParams(window.location.search);
const client = new QueryClient();
if (params.has("cached")) {
  client.setQueryData(["weekly-diet-plan", "zistpa"], {
    success: true,
    status: true,
    data: { shopping: { basis: "week", groups: [] } },
  });
}

function Harness() {
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    document.documentElement.dataset.testMounted = "true";
  }, []);
  return (
    <>
      <button onClick={() => setMounted(false)}>Unmount test page</button>
      {mounted && <OptimizedDietaryPage />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/",
            state: params.has("existing") ? { origin: "/app/diets" } : null,
          },
        ]}
      >
        <Harness />
      </MemoryRouter>
    </QueryClientProvider>
  </StrictMode>,
);
