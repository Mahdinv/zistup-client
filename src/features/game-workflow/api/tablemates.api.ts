import { httpClient } from "@/shared/api";
import type { TablematesForm } from "../schemas/tablemates.schema";
import type { Tablemate } from "./tablemate.types";

export async function getTablemates(): Promise<Tablemate[]> {
  const response = await httpClient.post("/users/get/tablemates");
  return response.data.tablemates;
}

export async function addTablemates(data: TablematesForm | { tablemates: [] }) {
  const response = await httpClient.post("/users/add/tablemate", data);
  return response.data;
}
