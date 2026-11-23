import { httpClient } from "@/shared/api";

export async function confirmDietPlan() {
  const response = await httpClient.post("/diet/v2/plan/confirm", {
    diet: "zistpa",
  });
  return response.data;
}
