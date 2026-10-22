import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/features/game-workflow/api/demographic-information.api";
import { useUserProfileStore } from "../stores/user-profile.store";

export const userProfileQueryKey = ["userProfile"] as const;

export default function useUserProfileQuery(enabled = true) {
  const query = useQuery({
    queryKey: userProfileQueryKey,
    queryFn: ({ signal }) => getUserProfile(signal),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const setUser = useUserProfileStore((state) => state.setUser);
  useEffect(() => {
    if (enabled && query.data) setUser(query.data);
  }, [enabled, query.data, query.dataUpdatedAt, setUser]);
  return query;
}
