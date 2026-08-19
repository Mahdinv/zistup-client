import { redirect } from "react-router-dom";

import { tokenStorage } from "@/shared/api";

export const requireAuth = () => {
  if (!tokenStorage.has()) {
    throw redirect("/auth/login");
  }

  return null;
};
