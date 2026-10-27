import { useContext, useEffect, type ReactNode } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useRouteError,
  type RouteObject,
} from "react-router-dom";
import { toast } from "sonner";
import ErrorBoundary, {
  ErrorFallback,
} from "@/shared/base-components/error-boundary";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import {
  DashboardThemeContext,
  readDashboardTheme,
} from "@/features/dashboard/context/dashboard-theme-context";

function useRouteErrorTheme() {
  const { pathname } = useLocation();
  const dashboardTheme = useContext(DashboardThemeContext);
  // A layout failure removes its provider; resolve the saved theme before paint.
  return pathname === "/app" || pathname.startsWith("/app/")
    ? (dashboardTheme?.theme ?? readDashboardTheme())
    : "dark";
}

function RecoverableRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { reset } = useQueryErrorResetBoundary();
  const theme = useRouteErrorTheme();
  return (
    <ErrorBoundary resetKey={location.key} onReset={reset} theme={theme}>
      {children}
    </ErrorBoundary>
  );
}

function RouteErrorFallback() {
  const theme = useRouteErrorTheme();
  const error = useRouteError();
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useQueryErrorResetBoundary();
  const retry = () => {
    reset();
    // A fresh navigation resets the router's boundary and reruns failed loaders.
    void navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      {
        replace: true,
        state: location.state,
      },
    );
  };
  useEffect(() => {
    console.error("Route error", error);
    let id: string | number | undefined;
    const timer = setTimeout(() => {
      id = toast.error(getApiErrorMessage(error));
    }, 0);
    return () => {
      clearTimeout(timer);
      if (id !== undefined) toast.dismiss(id);
    };
  }, [error]);
  return <ErrorFallback onRetry={retry} theme={theme} />;
}

// Keep the route tree and layout state intact; each route owns only its failures.
export function withErrorBoundaries(routes: RouteObject[]): RouteObject[] {
  return routes.map((route): RouteObject => {
    const errorElement = route.errorElement ?? <RouteErrorFallback />;
    const element =
      route.element == null ? (
        route.element
      ) : (
        <RecoverableRoute>{route.element}</RecoverableRoute>
      );
    if (route.index) return { ...route, element, errorElement };
    return {
      ...route,
      element,
      errorElement,
      children: route.children && withErrorBoundaries(route.children),
    };
  });
}
