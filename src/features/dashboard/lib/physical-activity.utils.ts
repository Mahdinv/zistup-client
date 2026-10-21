import type { Exercise } from "../api/types/exercise.types";

const MAX_RECENT_EXERCISES = 3;

function uniqueRecentExercises(items: Exercise[]): Exercise[] {
  return items
    .filter(
      (item, index) =>
        items.findIndex((other) => other.id === item.id) === index,
    )
    .slice(0, MAX_RECENT_EXERCISES);
}

const RECENT_EXERCISES_KEY = "zistup:recent-exercises:v1";

function isExercise(value: unknown): value is Exercise {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    Number.isFinite(item.id) &&
    ["category", "sport", "label", "intensity"].every(
      (key) => typeof item[key] === "string",
    ) &&
    typeof item.met === "number" &&
    Number.isFinite(item.met) &&
    item.met > 0
  );
}

export function readRecentExercises(): Exercise[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(RECENT_EXERCISES_KEY) ?? "[]",
    );
    if (!Array.isArray(stored)) return [];
    return uniqueRecentExercises(stored.filter(isExercise));
  } catch {
    return [];
  }
}

export function writeRecentExercises(items: Exercise[]) {
  try {
    localStorage.setItem(
      RECENT_EXERCISES_KEY,
      JSON.stringify(uniqueRecentExercises(items)),
    );
  } catch {
    // Storage may be unavailable; the current drawer still retains recent items.
  }
}

export function rememberExercise(items: Exercise[], exercise: Exercise) {
  return uniqueRecentExercises([exercise, ...items]);
}

export function estimateActivityCalories(
  exercise: Exercise | null,
  minutes: number,
  weight?: number,
): number | null {
  if (!exercise || !weight || !Number.isFinite(weight) || weight <= 0)
    return null;
  // Standard MET estimate: kcal/min = MET × 3.5 × body weight in kg / 200.
  return Math.round(((exercise.met * 3.5 * weight) / 200) * minutes);
}
