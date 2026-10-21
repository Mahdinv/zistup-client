import type { Nutrition } from "../api/types/quick-add-meal.types";
export const GENERAL_AMOUNTS = Array.from({ length: 1000 }, (_, i) => i + 1);
export const nutrients = [
  {
    key: "protein",
    label: "پروتئین",
    unit: "g",
    precision: 0,
    color: "bg-red-400",
  },
  {
    key: "fiber",
    precision: 0,
    label: "فیبر",
    unit: "g",
    color: "bg-green-400",
  },
  {
    key: "carbohydrates",
    label: "کربوهیدرات",
    unit: "g",
    precision: 0,
    color: "bg-orange-200",
  },
  {
    key: "greenhouseGas",
    label: "انتشار گازهای گلخانه‌ای",
    unit: "کیلو",
    precision: 3,
    color: "bg-blue-400",
  },
  {
    key: "environmentalImpact",
    label: "اثر محیط زیستی",
    unit: "شاخص EF",
    precision: 2,
    color: "bg-green-500",
  },
  {
    key: "water",
    label: "مصرف آب",
    unit: "لیتر",
    precision: 0,
    color: "bg-blue-500",
  },
] satisfies {
  key: Exclude<keyof Nutrition, "kcal">;
  label: string;
  unit: string;
  color: string;
  precision: 0 | 2 | 3;
}[];
export const nutrientSlides = { perView: "auto" as const, spacing: 8 };
