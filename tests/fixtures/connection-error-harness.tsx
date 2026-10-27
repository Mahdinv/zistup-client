import { createRoot } from "react-dom/client";
import { useState } from "react";
import { Toaster } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import ConnectionErrorBoundary from "../../src/app/connection-error-boundary";
import { ApiError } from "../../src/shared/api/api-error";
import { isConnectionError } from "../../src/shared/api/error.helpers";
import "../../src/index.css";

const params = new URLSearchParams(location.search);
const scenario = params.get("scenario") ?? "network";
document.documentElement.dataset.dashboardTheme = params.get("theme") ?? "dark";
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
if (scenario === "offline") onlineManager.setOnline(false);
let attempts = 0;
let recover = false;
const request = async () => {
  attempts++;
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (!recover)
    throw new ApiError({
      type: scenario === "api" ? "api" : "network",
      status: scenario === "api" ? 500 : undefined,
      message: "Test failure",
    });
  return "recovered";
};

// Exercise the same normalized classification used by the production boundary.
for (const type of [
  "network",
  "timeout",
  "api",
  "cancelled",
  "unknown",
] as const) {
  if (
    isConnectionError(new ApiError({ type, message: "test" })) !==
    (type === "network" || type === "timeout")
  )
    throw new Error(`Wrong classification: ${type}`);
}

function Harness() {
  const [home, setHome] = useState(false);
  const [saved, setSaved] = useState(false);
  const query = useQuery({
    queryKey: ["connection-test"],
    initialData: scenario === "background" ? "cached content" : undefined,
    queryFn: request,
    enabled: !home && scenario !== "mutation",
  });
  const mutation = useMutation({
    mutationFn: request,
    onSuccess: () => setSaved(true),
  });
  return (
    <>
      <Toaster />
      <button onClick={() => mutation.mutate()}>submit</button>
      <output>
        {home ? "home" : saved ? "saved" : (query.data ?? query.status)}
      </output>
      <ConnectionErrorBoundary onHome={() => setHome(true)} />
    </>
  );
}

Object.assign(window, {
  recoverConnection: () => {
    recover = true;
    onlineManager.setOnline(true);
  },
  requestAttempts: () => attempts,
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <Harness />
  </QueryClientProvider>,
);
