import { redirect } from "react-router-dom";
import { queryClient } from "@/shared/api";
import {
  userProfileQueryKey,
  userProfileQueryOptions,
} from "@/shared/hooks/use-user-profile-query.hook";
import type { User } from "@/features/game-workflow/api/user.types";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import { getPostAuthPath } from "./get-post-auth-path";
import { requireAuth } from "./require-auth";

export async function requireCompleteProfile() {
  requireAuth();
  const cachedUser = queryClient.getQueryData<User>(userProfileQueryKey);
  // Reuse startup validation; refresh incomplete profiles after onboarding edits.
  const user = await queryClient.fetchQuery({
    ...userProfileQueryOptions,
    ...(cachedUser && getPostAuthPath(cachedUser) !== "/app/dashboard"
      ? { staleTime: 0 }
      : {}),
  });
  useUserProfileStore.getState().setUser(user);
  const destination = getPostAuthPath(user);
  if (destination !== "/app/dashboard") throw redirect(destination);
  return null;
}
