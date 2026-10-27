import {
  Component,
  useContext,
  useEffect,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import {
  DashboardThemeContext,
  type DashboardTheme,
} from "@/features/dashboard/context/dashboard-theme-context";
import Button from "./button";

type ErrorBoundaryProps = {
  children: ReactNode;
  resetKey?: string;
  onReset?: () => void;
  fallback?: ReactNode;
  theme?: DashboardTheme;
};

function ErrorNotification({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    let id: string | number | undefined;
    // Wait for Toaster subscriptions; cancel StrictMode's discarded effect.
    const timer = setTimeout(() => {
      id = toast.error(getApiErrorMessage(error), {
        action: { label: "تلاش مجدد", onClick: retry },
      });
    }, 0);
    return () => {
      clearTimeout(timer);
      if (id !== undefined) toast.dismiss(id);
    };
  }, [error, retry]);
  return null;
}

export function ErrorFallback({
  onRetry,
  theme,
}: {
  onRetry: () => void;
  theme?: DashboardTheme;
}) {
  const dashboardTheme = useContext(DashboardThemeContext);
  const resolvedTheme = theme ?? dashboardTheme?.theme ?? "dark";
  return (
    <section
      role="alert"
      dir="rtl"
      className={`dashboard-theme m-4 flex min-w-0 flex-col items-center gap-3 rounded-2xl border p-4 text-center font-peyda shadow-[0_4px_4px_0_rgba(0,0,0,0.04)] ${resolvedTheme === "light" ? "border-gray-100 bg-blue-100 text-dark scheme-light" : "border-darker-blue-100 bg-darker-blue-200 text-white scheme-dark"}`}
    >
      <p>نمایش این بخش با مشکل مواجه شد.</p>
      <div className="w-full max-w-60">
        <Button
          title="تلاش مجدد"
          classes="btn btn-primary-green min-h-12 focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={onRetry}
        />
      </div>
    </section>
  );
}

/** Isolate failed UI; never re-render a throwing subtree until explicitly reset. */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: unknown }
> {
  state = { hasError: false, error: undefined as unknown };
  private mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("UI error", error, info.componentStack);
  }

  componentDidUpdate(previous: ErrorBoundaryProps) {
    if (this.state.hasError && previous.resetKey !== this.props.resetKey) {
      this.reset();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private reset = () => {
    if (!this.mounted) return;
    this.props.onReset?.();
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <>
        <ErrorNotification error={this.state.error} retry={this.reset} />
        {this.props.fallback === undefined ? (
          <ErrorFallback onRetry={this.reset} theme={this.props.theme} />
        ) : (
          this.props.fallback
        )}
      </>
    );
  }
}
