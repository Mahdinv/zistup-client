import { useEffect, type ReactNode } from "react";
import { markClarityPageReady } from "./clarity";

/** Mount only around audited, non-sensitive content in the route configuration. */
export default function ClarityCapture({ children }: { children: ReactNode }) {
  useEffect(() => {
    markClarityPageReady();
  }, []);
  return (
    <div data-clarity-mask="true" className="contents">
      {children}
    </div>
  );
}
