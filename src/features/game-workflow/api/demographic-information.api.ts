import { httpClient } from "@/shared/api";
import type { DemographicInformationForm } from "../schemas/demographic-informations.schema";
import type { User } from "./user.types";

export async function getUserProfile(signal?: AbortSignal): Promise<User> {
  const response = await httpClient.get<{ user: User }>("/users/profile", {
    signal,
  });
  return response.data.user;
}

export async function addDemographicInformation(
  data: DemographicInformationForm,
) {
  const response = await httpClient.post("/users/editProfile", data);
  return response.data;
}
