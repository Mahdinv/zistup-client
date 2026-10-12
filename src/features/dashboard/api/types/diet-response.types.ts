import type { DietDay } from "./diet-day.types";
import type { Shopping } from "./shopping.types";

export type DietResponse = {
  createdAtUtc: string;
  days: DietDay[];
  diet: { key: string; title: string };
  shopping: Shopping;
};
