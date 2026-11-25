import { useQuery } from "@tanstack/react-query";
import useDebouncedValue from "@/shared/hooks/use-debounced-value.hook";
import { normalizeApiError } from "@/shared/api";
import { checkUsername } from "../api/auth.api";
import { RegistrationUsernameSchema } from "../schemas/register.schema";

export default function useUsernameAvailability(username: string) {
  const debouncedUsername = useDebouncedValue(username, 1000);
  const parsed = RegistrationUsernameSchema.safeParse(username);
  const valid = parsed.success;
  const settled = username === debouncedUsername;
  const query = useQuery({
    // Include the current input so any edit detaches and cancels the old request.
    queryKey: ["auth", "username-availability", username],
    queryFn: ({ signal }) =>
      checkUsername(parsed.success ? parsed.data : "", signal),
    enabled: valid && settled,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const status = !valid
    ? "idle"
    : !settled
      ? "debouncing"
      : query.isFetching || (!query.isSuccess && !query.isError)
        ? "checking"
        : query.isError
          ? "error"
          : query.data?.available
            ? "available"
            : "unavailable";

  return {
    status,
    username: parsed.success ? parsed.data : "",
    message: query.isError
      ? normalizeApiError(query.error).message
      : query.data?.message,
    retry: () => {
      if (valid && settled && !query.isFetching) void query.refetch();
    },
  };
}
