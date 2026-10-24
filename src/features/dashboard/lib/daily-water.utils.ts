export const DAILY_WATER_GOAL = 8;

const storageKey = (date: string) => `zistup:daily-water:v1:${date}`;

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
