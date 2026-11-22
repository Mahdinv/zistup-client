import { useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import QuickAddMeal from "../../src/features/dashboard/components/quick-add-meal/quick-add-meal";
import SuggestedMealsCard from "../../src/features/dashboard/components/dashboard/diet-goal-meal-suggestions/suggested-meals-card";
import { mapDietDay } from "../../src/features/dashboard/api/mappers/diet-day.mapper";
import useWeeklyDietPlanQuery from "../../src/features/game-workflow/hooks/use-weekly-diet-plan-query.hook";
import WeeklyDietPlanningPage from "../../src/features/game-workflow/pages/weekly-diet-planning-page";
import { httpClient } from "../../src/shared/api";
import "../../src/index.css";

httpClient.defaults.baseURL = window.location.origin;

function QuickAddHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open quick add</button>
      <QuickAddMeal
        open={open}
        onClose={() => setOpen(false)}
        isSubmitting={false}
        onSubmit={async (payload) => {
          await httpClient.post("/dashboard/meal-logs", payload);
          return true;
        }}
      />
    </>
  );
}

function SuggestedHarness() {
  const { data } = useWeeklyDietPlanQuery();
  const day = data?.data?.days?.[0];
  const meal = day && mapDietDay(day).meals[0];
  if (!meal?.main) return null;
  return (
    <SuggestedMealsCard
      item={{ ...meal.main, meal, mealTitle: meal.title }}
      initialTab="primary"
      date="2026-11-14"
      registrationDisabled={false}
    />
  );
}

const flow = new URLSearchParams(window.location.search).get("flow");
const queryClient = new QueryClient();
Object.assign(window, {
  refreshTestFoodInfo: () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard-food-info"] }),
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-center" />
    <main className="h-dvh">
      {flow === "suggested" ? (
        <SuggestedHarness />
      ) : flow === "weekly" ? (
        <WeeklyDietPlanningPage />
      ) : (
        <QuickAddHarness />
      )}
    </main>
  </QueryClientProvider>,
);
