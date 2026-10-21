// Const enum-style object supports erasableSyntaxOnly.
export const ServingUnit = {
  Slice: "slice",
  Serving: "serving",
  Bowl: "bowl",
  Piece: "piece",
  Sandwich: "sandwich",
  Skewer: "skewer",
  Count: "count",
  Spoon: "spoon",
  SmallBowl: "small_bowl",
  Bite: "bite",
  Glass: "glass",
} as const;
export type ServingUnit = (typeof ServingUnit)[keyof typeof ServingUnit];
export const servingUnitLabels: Record<ServingUnit, string> = {
  slice: "برش",
  serving: "پرس",
  bowl: "کاسه",
  piece: "تکه",
  sandwich: "ساندویچ",
  skewer: "سیخ",
  count: "تعداد",
  spoon: "قاشق",
  small_bowl: "کاسه کوچک",
  bite: "لقمه",
  glass: "لیوان",
};
export function formatServingUnit(unit: string | null | undefined): string {
  if (unit === "gram" || unit === "g") return "گرم";
  return unit && Object.hasOwn(servingUnitLabels, unit)
    ? servingUnitLabels[unit as ServingUnit]
    : "واحد نامشخص";
}
