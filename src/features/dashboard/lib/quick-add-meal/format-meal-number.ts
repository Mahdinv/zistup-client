const formatters = {
  0: new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }),
  2: new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }),
  3: new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 3 }),
};
/** Presentation only: keep raw API values for calculations and submission. */
export function formatMealNumber(
  value: number | null | undefined,
  precision: 0 | 2 | 3 = 0,
): string {
  return value == null || !Number.isFinite(value)
    ? "—"
    : formatters[precision].format(precision === 0 ? Math.round(value) : value);
}
