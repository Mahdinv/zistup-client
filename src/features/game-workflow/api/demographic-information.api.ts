import { httpClient } from "@/shared/api";
import type { DemographicInformationForm } from "../schemas/demographic-informations.schema";

export async function addDemographicInformation(
  data: DemographicInformationForm,
) {
  const response = await httpClient.post("/users/editProfile", data);
  return response.data;
}
