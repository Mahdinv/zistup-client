import type { ShoppingDto } from "./shopping.dto";

export type DietResponseDto = {
  created_at_utc: string;
  diet: { key: string; title: string };
  shopping: ShoppingDto;
};
