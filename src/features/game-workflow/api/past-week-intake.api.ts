import { httpClient } from "@/shared/api";
import type { Category } from "./category.types";

export async function getFoodGroupsCategories(): Promise<Category[]> {
  const response = await httpClient.get("/diet/categories");
  return response.data.categories;
}
