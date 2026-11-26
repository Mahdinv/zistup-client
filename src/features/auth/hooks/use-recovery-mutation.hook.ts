import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/shared/api";

export default function useRecoveryMutation<TInput, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>,
  onSuccess: (result: TResult, input: TInput) => void,
  onError?: (error: unknown) => void,
) {
  const inFlight = useRef(false);
  const mutation = useMutation({ mutationFn, gcTime: 0, retry: false });
  const submit = (input: TInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    // Per-call callbacks are discarded if Back navigation unmounts the form.
    mutation.mutate(input, {
      onSuccess,
      onError: (error) => {
        inFlight.current = false;
        toast.error(normalizeApiError(error).message);
        onError?.(error);
      },
    });
  };
  return { submit, isPending: mutation.isPending };
}
