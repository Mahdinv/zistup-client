import type { Shopping } from "./shopping.types";

export type DietResponse = {
  createdAtUtc: string;
  diet: { key: string; title: string };
  shopping: Shopping;
};
