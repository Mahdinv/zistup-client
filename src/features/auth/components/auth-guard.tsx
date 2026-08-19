import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { tokenStorage } from "@/shared/api";

type AuthGuardProps = {
  children?: ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const isAuthenticated = tokenStorage.has();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default AuthGuard;
