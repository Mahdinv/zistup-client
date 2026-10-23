import { httpClient } from "@/shared/api";
import type {
  BasicInformation,
  ProfileGoalInformation,
  ProfileIdentity,
  ProfileBasicInformation,
} from "../schemas/basic-information.schema";

export async function addBasicInformation(
  data:
    | BasicInformation
    | ProfileBasicInformation
    | ProfileGoalInformation
    | ProfileIdentity,
) {
  const response = await httpClient.post("/users/editProfile", data);
  return response.data;
}
