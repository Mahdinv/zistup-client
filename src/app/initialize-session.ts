import { queryClient, tokenStorage } from "@/shared/api";
import { userProfileQueryOptions } from "@/shared/hooks/use-user-profile-query.hook";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";

export async function initializeSession() {
  if (!tokenStorage.has()) return null;
  const user = await queryClient.fetchQuery(userProfileQueryOptions);
  useUserProfileStore.getState().setUser(user);
  return null;
}
