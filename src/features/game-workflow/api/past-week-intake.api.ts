import { httpClient } from "@/shared/api";
import type { Category } from "./category.types";
import type { PastWeekIntakeForm } from "../schemas/past-week-intake.schema";

export async function getFoodGroupsCategories(): Promise<Category[]> {
  const response = await httpClient.get("/diet/categories");
  return response.data.categories;
}

export async function addPastWeekIntake(data: PastWeekIntakeForm) {
  const finalData = {
    items: data.items.map((item) =>
      Object.fromEntries(
        Object.entries(item).filter(([key]) => key !== "categoryId"),
      ),
    ),
  };
  const response = await httpClient.post("/diet/past-week-intake", finalData);
  return response.data;
}
