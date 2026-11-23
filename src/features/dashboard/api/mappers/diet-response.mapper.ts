import { mapDietDay } from "./diet-day.mapper";
import type { DietResponseDto } from "../dto/diet-response.dto";
import type { DietResponse } from "../types/diet-response.types";
import { mapShopping } from "./sopping.mapper";

export const mapDietResponse = (dto: DietResponseDto): DietResponse => ({
  summary: dto.summary,
  createdAtUtc: dto.created_at_utc,
  diet: dto.diet,
  dietGoalsSummary: dto.diet_goals_summary ?? null,
  // Only an explicit false requires confirmation; older responses may omit it.
  isConfirm: dto.isConfirm !== false,
  days: (dto.days ?? [])
    .map(mapDietDay)
    .sort((first, second) => first.day - second.day),
  shopping: mapShopping(dto.shopping),
});
