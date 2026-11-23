import type { DietDayDto } from "./diet-day.dto";
import type { DietResponse } from "../types/diet-response.types";
import type { ShoppingDto } from "./shopping.dto";
import type { DietGoalsSummary } from "../types/diet-goals-summary.types";

export type DietResponseDto = {
  summary?: DietResponse["summary"];
  created_at_utc: string;
  days: DietDayDto[];
  diet: { key: string; title: string };
  shopping: ShoppingDto;
  diet_goals_summary?: DietGoalsSummary | null;
  isConfirm?: boolean;
};
