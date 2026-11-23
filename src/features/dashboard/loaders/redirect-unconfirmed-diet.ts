import { replace } from "react-router-dom";
import { queryClient } from "@/shared/api";
import { requireCompleteProfile } from "@/features/auth/loaders/require-complete-profile";
import { optimizedDietaryQueryOptions } from "@/features/game-workflow/hooks/use-optimized-dietary-query.hook";

export async function redirectUnconfirmedDiet() {
  // Parent and child loaders run concurrently; keep the profile guard first.
  await requireCompleteProfile();
  const response = await queryClient.fetchQuery({
    ...optimizedDietaryQueryOptions,
    // Recheck confirmation on every entry, including history POP navigations.
    staleTime: 0,
    // Route loaders must settle even when the browser reports itself offline.
    networkMode: "always",
  });

  if (
    response.success === true &&
    response.data?.diet?.key === "zistpa" &&
    response.data.isConfirm === false
  ) {
    return replace("/game-workflow/optimized-dietary/weekly-diet-planning");
  }

  return null;
}
