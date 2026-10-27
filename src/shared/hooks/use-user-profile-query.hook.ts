import { useEffect } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/features/game-workflow/api/demographic-information.api";
import { useUserProfileStore } from "../stores/user-profile.store";

export const userProfileQueryKey = ["userProfile"] as const;

export const userProfileQueryOptions = queryOptions({
  queryKey: userProfileQueryKey,
  queryFn: ({ signal }) => getUserProfile(signal),
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

export default function useUserProfileQuery(enabled = true) {
  const query = useQuery({ ...userProfileQueryOptions, enabled });
  const setUser = useUserProfileStore((state) => state.setUser);
  useEffect(() => {
    if (enabled && query.data) setUser(query.data);
  }, [enabled, query.data, query.dataUpdatedAt, setUser]);
  return query;
}
