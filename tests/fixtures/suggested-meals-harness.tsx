import { useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import DashboardThemeProvider from "../../src/features/dashboard/context/dashboard-theme-context";
import SuggestedMealsCard from "../../src/features/dashboard/components/dashboard/diet-goal-meal-suggestions/suggested-meals-card";
import { mapDietDay } from "../../src/features/dashboard/api/mappers/diet-day.mapper";
import type { DietDayDto } from "../../src/features/dashboard/api/dto/diet-day.dto";
import "../../src/index.css";

const response: { data: { days: DietDayDto[] } } = await fetch(
  "/__plan-response",
).then((res) => res.json());
const tabs = ["primary", "alternative-1", "alternative-2"] as const;
const cards = response.data.days.flatMap(mapDietDay).flatMap((day) =>
  day.meals.flatMap((meal) =>
    [meal.main, ...meal.alternatives].flatMap((food, index) =>
      food && index < 3
        ? [
            {
              item: { ...food, meal, mealTitle: meal.title },
              initialTab: tabs[index],
            },
          ]
        : [],
    ),
  ),
);
function Harness() {
  const [index, setIndex] = useState(0);
  Object.assign(window, {
    testShowCard: setIndex,
    testCardCount: cards.length,
  });
  return (
    <div className="h-dvh overflow-auto p-4">
      <SuggestedMealsCard
        key={index}
        {...cards[index]}
        date="2026-11-14"
        registrationDisabled={false}
      />
      <Toaster />
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    <DashboardThemeProvider>
      <Harness />
    </DashboardThemeProvider>
  </QueryClientProvider>,
);
