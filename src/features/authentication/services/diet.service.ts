import { httpClient } from "../../../shared/api";
import type { ConventionalGlobalDiet } from "../schemas/conventional-global-diet.schema";

export async function getDiets() {
  const response = await httpClient.get("/diet/list");
  return response.data.list;
}

export async function addConventionalGlobalDiet(data: ConventionalGlobalDiet) {
  const response = await httpClient.post("/diet/session", data);
  return response;
}
