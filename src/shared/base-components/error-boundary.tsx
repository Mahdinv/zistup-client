import { Component, useEffect, type ErrorInfo, type ReactNode } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import Button from "./button";

type ErrorBoundaryProps = {
  children: ReactNode;
  resetKey?: string;
  onReset?: () => void;
  fallback?: ReactNode;
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

export function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <section
      role="alert"
      dir="rtl"
      className="m-4 flex flex-col items-center gap-3 rounded-2xl bg-blue-100 p-4 text-center text-dark dark:bg-darker-blue-200 dark:text-white"
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
          <ErrorFallback onRetry={this.reset} />
        ) : (
          this.props.fallback
        )}
      </>
    );
  }
}
