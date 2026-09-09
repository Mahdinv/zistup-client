import { httpClient } from "@/shared/api";
import type { PreferredFoodForm } from "../schemas/preferred-food.schema";
import type { PreferredFood } from "./preferred-food.types";

export async function addPreferredFood(data: PreferredFoodForm) {
  const response = await httpClient.post("/users/preferred-foods", data);
  return response;
}

export async function getPreferredFoods(): Promise<PreferredFood[]> {
  const response = await httpClient.get("/users/preferred-foods");
  return response.data.data;
}
