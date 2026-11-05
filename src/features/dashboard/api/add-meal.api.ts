import { httpClient } from "@/shared/api";
import type { AddMealRequest } from "./types/add-meal.types";

export async function addMeal(payload: AddMealRequest): Promise<void> {
  await httpClient.post(
    "/dashboard/meal-logs",
    payload,
  );
}
