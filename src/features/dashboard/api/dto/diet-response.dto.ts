import type { DietDayDto } from "./diet-day.dto";
import type { ShoppingDto } from "./shopping.dto";
import type { DietGoalsSummary } from "../types/diet-goals-summary.types";

export type DietResponseDto = {
  created_at_utc: string;
  days: DietDayDto[];
  diet: { key: string; title: string };
  shopping: ShoppingDto;
  diet_goals_summary?: DietGoalsSummary | null;
};
