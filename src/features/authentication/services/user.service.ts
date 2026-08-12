import { httpClient } from "../../../shared/api";
import type { DemographicInformation } from "../schemas/demographic-information.schema";

export async function addDemographicInformation(data: DemographicInformation) {
  const response = await httpClient.post("/users/editProfile", data);
  return response.data;
}
