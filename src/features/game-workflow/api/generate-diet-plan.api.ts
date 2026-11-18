import { httpClient } from "@/shared/api";

export async function generateDietPlan(diet: string): Promise<void> {
  await httpClient.post("/diet/v2/generate", { diet });
}
