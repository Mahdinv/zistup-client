import { httpClient } from "../../../shared/api";
import type { AuthIdentifierDTO } from "./auth.types";

export async function sendCode(input: AuthIdentifierDTO) {
  const response = await httpClient.post("/users/sendCode", input, {
    skipAuth: true,
  });
  return response;
}

export async function validateUser(data: {
  identifier: AuthIdentifierDTO;
  refCode?: string;
  code: string;
}) {
  const response = await httpClient.post(
    "/users/validate",
    { ...data.identifier, code: data.code, refCode: data.refCode },
    {
      skipAuth: true,
    },
  );
  return response.data.data;
}
