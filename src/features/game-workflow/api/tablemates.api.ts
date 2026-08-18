import { httpClient } from "@/shared/api";
import type { TablematesForm } from "../schemas/tablemates.schema";

export async function addTablemates(data: TablematesForm) {
  const response = await httpClient.post("/users/add/tablemate", data);
  return response.data;
}
