import { create } from "zustand";
import type { User } from "@/features/game-workflow/api/user.types";

type UserProfileState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

// Query owns fetching/caching; this non-persisted store exposes the current profile.
export const useUserProfileStore = create<UserProfileState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
