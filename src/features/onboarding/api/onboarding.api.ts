import { httpClient } from "@/shared/api";
import type { BasicInformation } from "../schemas/basic-information.schema";

export async function addBasicInformation(data: BasicInformation) {
  const response = await httpClient.post("/users/editProfile", data);
  return response.data;
}
