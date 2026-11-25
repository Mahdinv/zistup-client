export const DAILY_WATER_GOAL = 8;

export const DAILY_WATER_LABELS = [
  "مصرف صفر",
  "یک لیوان",
  "دو لیوان",
  "سه لیوان",
  "چهار لیوان",
  "پنج لیوان",
  "شش لیوان",
  "هفت لیوان",
  "هشت لیوان",
] as const;

const STORAGE_PREFIX = "zistup:daily-water";
const storageKey = (date: string) => `${STORAGE_PREFIX}:v1:${date}`;

const isCalendarDate = (date: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const instant = new Date(`${date}T00:00:00Z`);
  return (
    Number.isFinite(instant.getTime()) &&
    instant.toISOString().slice(0, 10) === date
  );
};

export function cleanupDailyWaterBeforePlan(planStartDate: string): void {
  // Never prune against a missing or invalid plan, or the selected calendar day.
  if (!isCalendarDate(planStartDate)) return;

  try {
    // Iterate backwards because removing a key shifts localStorage indices.
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);
      if (!key) continue;
      const suffix = key.startsWith(`${STORAGE_PREFIX}:`)
        ? key.slice(STORAGE_PREFIX.length + 1)
        : null;
      if (key === STORAGE_PREFIX || (suffix && /^v\d+$/.test(suffix))) {
        // Undated legacy counts cannot belong to a particular plan day.
        // Preserve structured/unknown legacy data rather than guessing its dates.
        const value = localStorage.getItem(key);
        if (value !== null && /^-?\d+$/.test(value.trim())) {
          localStorage.removeItem(key);
        }
        continue;
      }
      if (suffix === null) continue;

      const date = /^(?:v\d+:)?(\d{4}-\d{2}-\d{2})$/.exec(suffix)?.[1];
      // Include legacy unversioned dates and earlier versions. Keep unknown
      // formats and newer dates so an older cached plan cannot erase new data.
      if (date && isCalendarDate(date) && date < planStartDate) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Storage restrictions must not prevent date navigation or water tracking.
  }
}

export function readDailyWater(date: string): number {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(storageKey(date)) ?? "0",
    );
    return typeof value === "number" && Number.isInteger(value)
      ? Math.min(DAILY_WATER_GOAL, Math.max(0, value))
      : 0;
  } catch {
    return 0;
  }
}

export function writeDailyWater(date: string, glasses: number): void {
  try {
    localStorage.setItem(storageKey(date), String(glasses));
  } catch {
    // Keep the current count usable when storage is blocked or full.
  }
}
