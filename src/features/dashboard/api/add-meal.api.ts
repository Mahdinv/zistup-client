import { httpClient } from "@/shared/api";
import type { AddMealPayload } from "./types/add-meal.types";

export async function addMeal(payload: AddMealPayload): Promise<void> {
  await httpClient.post(
    "/dashboard/meal-logs",
    payload,
  );
}
