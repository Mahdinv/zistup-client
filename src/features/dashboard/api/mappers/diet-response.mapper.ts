import type { DietResponseDto } from "../dto/diet-response.dto";
import type { DietResponse } from "../types/diet-response.types";
import { mapShopping } from "./sopping.mapper";

export const mapDietResponse = (dto: DietResponseDto): DietResponse => ({
  createdAtUtc: dto.created_at_utc,
  diet: dto.diet,
  shopping: mapShopping(dto.shopping),
});
