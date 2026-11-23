import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import OptimizedDietaryPage from "../../src/features/game-workflow/pages/optimized-dietary-page";
import WeeklyDietPlanningPage from "../../src/features/game-workflow/pages/weekly-diet-planning-page";
import { weeklyDietPlanQueryOptions } from "../../src/features/game-workflow/hooks/use-weekly-diet-plan-query.hook";
import { httpClient } from "../../src/shared/api";
import "../../src/index.css";

httpClient.defaults.baseURL = window.location.origin;
const params = new URLSearchParams(window.location.search);
const client = new QueryClient();
const basketPath = "/game-workflow/optimized-dietary";
const weeklyPath = `${basketPath}/weekly-diet-planning`;
if (params.has("cached")) {
  client.setQueryData(weeklyDietPlanQueryOptions.queryKey, {
    success: true,
    status: true,
    data:
      params.get("cached") === "invalid"
        ? null
        : {
            shopping: {
              basis: "week",
              groups: [
                {
                  id: "grains",
                  title: "Cached basket",
                  item_count: 0,
                  items: [
                    {
                      id: "cached-rice",
                      title: "Cached rice",
                      source_id: 1,
                      quantity_g: 500,
                      image_url: "",
                      quantity_label: "500 g",
                    },
                  ],
                },
              ],
            },
          },
  });
}
if (params.has("pending")) {
  client.setQueryData(weeklyDietPlanQueryOptions.queryKey, {
    success: true,
    status: false,
    data: null,
  });
}

function Harness() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    document.documentElement.dataset.testMounted = "true";
  }, []);
  return (
    <>
      <button onClick={() => setMounted(false)}>Unmount test page</button>
      <button
        onClick={() => void navigate(basketPath, { state: location.state })}
      >
        Back to basket
      </button>
      <output data-testid="route">{location.pathname}</output>
      {mounted && (
        <Routes>
          <Route path={basketPath} element={<OptimizedDietaryPage />} />
          <Route path={weeklyPath} element={<WeeklyDietPlanningPage />} />
        </Routes>
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: params.has("weekly") ? weeklyPath : basketPath,
            state: params.has("existing") ? { origin: "/app/diets" } : null,
          },
        ]}
      >
        <Harness />
      </MemoryRouter>
    </QueryClientProvider>
  </StrictMode>,
);
