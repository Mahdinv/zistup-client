import type { User } from "@/features/game-workflow/api/user.types";

export function getUserAvatar(sex?: User["sex"]) {
  if (sex === "male") return "/pwa/user-avatars/men-avatar-one.webp";
  if (sex === "female") return "/pwa/user-avatars/women-avatar-one.webp";
  return null;
}
