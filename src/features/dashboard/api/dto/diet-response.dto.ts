import type { DietDayDto } from "./diet-day.dto";
import type { ShoppingDto } from "./shopping.dto";

export type DietResponseDto = {
  created_at_utc: string;
  days: DietDayDto[];
  diet: { key: string; title: string };
  shopping: ShoppingDto;
};
