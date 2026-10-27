import { useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient, type Mutation } from "@tanstack/react-query";
import {
  getApiErrorMessage,
  isConnectionError,
} from "@/shared/api/error.helpers";
import { toast } from "sonner";
import ServerConnectionError from "@/shared/base-components/server-connection-error";

/** Keep request owners mounted so retries retain their data and success callbacks. */
export default function ConnectionErrorBoundary({
  onHome,
}: {
  onHome: () => void;
}) {
  const client = useQueryClient();
  const [, refresh] = useReducer((value: number) => value + 1, 0);
  const [retrying, setRetrying] = useState(false);
  const [candidate, setCandidate] = useState<Mutation | null>(null);
  const [dismissed, setDismissed] = useState<Set<object>>(() => new Set());

  useEffect(() => {
    const unsubscribeQueries = client.getQueryCache().subscribe((event) => {
      if (event.type === "updated") {
        const { query, action } = event;
        const id = `connection-${query.queryHash}`;
        if (
          action.type === "error" &&
          query.isActive() &&
          query.state.data !== undefined &&
          isConnectionError(query.state.error)
        ) {
          toast.error(getApiErrorMessage(query.state.error), {
            id,
            action: {
              label: "تلاش مجدد",
              onClick: () => {
                // Query state continues to own failures and their existing UI.
                void query
                  .fetch(undefined, { cancelRefetch: false })
                  .catch(() => {});
              },
            },
          });
        } else if (action.type === "success") {
          toast.dismiss(id);
        }
      }
      refresh();
    });
    const unsubscribeMutations = client
      .getMutationCache()
      .subscribe((event) => {
        if (
          event.type === "updated" &&
          (isConnectionError(event.mutation.state.error) ||
            event.mutation.state.isPaused)
        ) {
          setCandidate(event.mutation);
        }
        refresh();
      });
    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
    };
  }, [client]);

  const queries = client
    .getQueryCache()
    .getAll()
    .filter(
      (query) =>
        query.isActive() &&
        query.state.data === undefined &&
        !dismissed.has(query.state) &&
        (isConnectionError(query.state.error) ||
          query.state.fetchStatus === "paused"),
    );
  const mutation =
    candidate &&
    !dismissed.has(candidate.state) &&
    (isConnectionError(candidate.state.error) || candidate.state.isPaused)
      ? candidate
      : null;
  const visible = queries.length > 0 || mutation !== null || retrying;

  const retry = async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      await Promise.allSettled([
        ...queries.map((query) =>
          query.fetch(undefined, { cancelRefetch: false }),
        ),
        ...(mutation
          ? [
              mutation.state.isPaused
                ? mutation.continue()
                : mutation.execute(mutation.state.variables),
            ]
          : []),
      ]);
    } finally {
      setRetrying(false);
    }
  };

  const goHome = () => {
    setDismissed(
      new Set([
        ...queries.map((query) => query.state),
        ...(mutation ? [mutation.state] : []),
      ]),
    );
    setCandidate(null);
    setRetrying(false);
    refresh();
    onHome();
  };

  if (!visible) return null;
  return createPortal(
    <ConnectionErrorDialog
      onRetry={() => void retry()}
      onHome={goHome}
      isRetrying={retrying}
    />,
    document.body,
  );
}

function ConnectionErrorDialog(props: {
  onRetry: () => void;
  onHome: () => void;
  isRetrying: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label="خطای ارتباط با سرور"
      onCancel={(event) => event.preventDefault()}
      className="fixed inset-0 m-auto h-dvh max-h-none w-full max-w-none border-0 p-0 tablet:w-3/5 desktop:w-1/3 backdrop:bg-black/40"
    >
      <ServerConnectionError {...props} />
    </dialog>
  );
}
