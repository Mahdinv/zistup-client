import { redirect } from "react-router-dom";
import { queryClient } from "@/shared/api";
import { userProfileQueryOptions } from "@/shared/hooks/use-user-profile-query.hook";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import { getPostAuthPath } from "./get-post-auth-path";
import { requireAuth } from "./require-auth";

export async function requireCompleteProfile() {
  requireAuth();
  // Refresh on entry so completing onboarding cannot reuse an incomplete profile.
  const user = await queryClient.fetchQuery({
    ...userProfileQueryOptions,
    staleTime: 0,
  });
  useUserProfileStore.getState().setUser(user);
  const destination = getPostAuthPath(user);
  if (destination !== "/app/dashboard") throw redirect(destination);
  return null;
}
