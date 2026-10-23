import { useQuery } from "@tanstack/react-query";
import { getProfileAvatars } from "../api/profile-avatars.api";

export default function useProfileAvatarsQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["profileAvatars"],
    queryFn: ({ signal }) => getProfileAvatars(signal),
    enabled,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
