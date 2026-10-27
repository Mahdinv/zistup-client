import type { User } from "@/features/game-workflow/api/user.types";

export function getPostAuthPath(user: User) {
  if (
    [user.name, user.height, user.sex].some(
      (value) => value == null || String(value).trim() === "",
    )
  ) {
    return "/onboarding/basic-information";
  }
  if (!user.diet?.key?.trim() || !user.diet?.title?.trim()) {
    return "/onboarding/choose-plan";
  }
  return "/app/dashboard";
}
