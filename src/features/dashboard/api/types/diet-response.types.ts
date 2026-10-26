import type { DietDay } from "./diet-day.types";
import type { Shopping } from "./shopping.types";
import type { DietGoalsSummary } from "./diet-goals-summary.types";

export type DietResponse = {
  createdAtUtc: string;
  days: DietDay[];
  diet: { key: string; title: string };
  shopping: Shopping;
  dietGoalsSummary?: DietGoalsSummary | null;
};
