import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import WeeklyDietPlanningPage from "../../src/features/game-workflow/pages/weekly-diet-planning-page";
import { redirectUnconfirmedDiet } from "../../src/features/dashboard/loaders/redirect-unconfirmed-diet";
import { latestDietQueryKey } from "../../src/features/dashboard/constants/latest-diet-query.constants";
import { userProfileQueryKey } from "../../src/shared/hooks/use-user-profile-query.hook";
import { httpClient, queryClient, tokenStorage } from "../../src/shared/api";
import "../../src/index.css";

httpClient.defaults.baseURL = window.location.origin;
tokenStorage.set("test-session");
const diet = { key: "zistpa", title: "زیستاپ" };
queryClient.setQueryData(userProfileQueryKey, {
  name: "Test",
  height: 170,
  sex: "female",
  diet,
});
queryClient.setQueryData(latestDietQueryKey, {
  success: true,
  data: { diet, isConfirm: false },
});

const router = createMemoryRouter(
  [
    {
      path: "/game-workflow/optimized-dietary/weekly-diet-planning",
      element: <WeeklyDietPlanningPage />,
    },
    {
      path: "/game-workflow/optimized-dietary",
      element: <p>Loading destination</p>,
    },
    {
      path: "/app/dashboard",
      loader: redirectUnconfirmedDiet,
      element: <p>Dashboard destination</p>,
    },
  ],
  { initialEntries: ["/game-workflow/optimized-dietary/weekly-diet-planning"] },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <div
        data-testid="weekly-container"
        style={{
          width: "min(100%, 420px)",
          height: "calc(100dvh - 48px)",
          margin: "24px auto",
          overflow: "hidden",
        }}
      >
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  </StrictMode>,
);
