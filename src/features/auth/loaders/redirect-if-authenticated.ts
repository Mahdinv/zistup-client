import { redirect } from "react-router-dom";

import { tokenStorage } from "@/shared/api";

export const redirectIfAuthenticated = () => {
  if (tokenStorage.has()) {
    throw redirect("/app/dashboard");
  }

  return null;
};
