import { replace } from "react-router-dom";
import { toast } from "sonner";
import { tokenStorage } from "@/shared/api";
import { initializeSession } from "@/app/initialize-session";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import { logout } from "../api/auth.api";
import { getPostAuthPath } from "./get-post-auth-path";

let pending: Promise<Response> | undefined;

export function googleCallback() {
  // Read the live URL so revalidation cannot replay a consumed credential.
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token")?.trim();
  const failed = url.searchParams.has("error");
  window.history.replaceState(window.history.state, "", url.pathname);

  if (pending) return pending;
  pending = completeCallback(token, failed).finally(() => {
    pending = undefined;
  });
  return pending;
}

async function completeCallback(token: string | undefined, failed: boolean) {
  try {
    if (failed) throw new Error("OAuth failed");
    if (token) {
      // Cancel old queries and discard the previous account before accepting a JWT.
      logout();
      tokenStorage.set(token);
    } else if (!tokenStorage.has()) {
      throw new Error("Missing credential");
    }
    // Also resumes a refresh after the credential has been removed from the URL.
    await initializeSession();
    const user = useUserProfileStore.getState().user;
    if (!user) throw new Error("Missing profile");
    return replace(getPostAuthPath(user));
  } catch {
    logout();
    // Never display provider or server messages which might contain credentials.
    toast.error("ورود با گوگل انجام نشد. لطفاً دوباره تلاش کنید.");
    return replace("/auth/login");
  }
}
