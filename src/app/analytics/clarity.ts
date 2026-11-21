import {
  redirectDocument,
  type createBrowserRouter,
  type DataStrategyFunction,
} from "react-router-dom";

type Router = ReturnType<typeof createBrowserRouter>;
export type AnalyticsConsent = "granted" | "denied" | null;
type Clarity = typeof import("@microsoft/clarity").default;
const storageKey = "zistup.analytics-consent.v2";
const denialKey = "zistup.analytics-denied";
const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim();
export const clarityEnabled =
  import.meta.env.PROD && /^[a-z0-9]+$/i.test(projectId ?? "");

// Reviewed static screen only. In particular Zistyar's shared meal drawer is NOT safe.
export function isClarityLocationSafe(location: {
  pathname: string;
  search: string;
  hash: string;
}) {
  return (
    location.pathname === "/onboarding/choose-plan" &&
    !location.search &&
    !location.hash
  );
}

const entry =
  typeof window === "undefined" ? undefined : new URL(window.location.href);
const boundaryParameter = "__zistup_privacy_boundary";
const boundaryEntry = entry?.searchParams.has(boundaryParameter) ?? false;
if (boundaryEntry) entry!.searchParams.delete(boundaryParameter);
const captureDocument = Boolean(
  clarityEnabled && !boundaryEntry && entry && isClarityLocationSafe(entry),
);
let router: Router | undefined;
let sdk: Clarity | undefined;
let pending: Promise<void> | undefined;
let attempted = false;
let ready = false;
let leaving = false;
let prepared = false;
let guardsReady = false;
let consent = readAnalyticsConsent();

export function readAnalyticsConsent(): AnalyticsConsent {
  try {
    if (sessionStorage.getItem(denialKey) === "true") return "denied";
  } catch {
    /* Storage can be blocked independently. */
  }
  try {
    const value =
      localStorage.getItem(storageKey) ??
      (localStorage.getItem("zistup.analytics-consent.v1") === "denied"
        ? "denied"
        : null);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function denyAndStop() {
  try {
    sdk?.consentV2({ analytics_Storage: "denied", ad_Storage: "denied" });
  } catch {
    /* Best effort. */
  }
  try {
    (window as Window & { clarity?: (command: "stop") => void }).clarity?.(
      "stop",
    );
  } catch {
    /* A document boundary, not stop(), provides isolation. */
  }
}

function leaveDocument(url: string, replace = false) {
  if (leaving) return;
  leaving = true;
  // Keep the outgoing document inert while the browser loads its replacement.
  if (attempted) document.documentElement.inert = true;
  const destination = new URL(url, window.location.href);
  const current = new URL(window.location.href);
  // A fragment-only location.assign stays in this document. Force a real request
  // using a non-sensitive transport flag, removed before the next router starts.
  if (
    destination.origin === current.origin &&
    destination.pathname === current.pathname &&
    destination.search === current.search &&
    destination.hash !== current.hash
  ) {
    destination.searchParams.set(boundaryParameter, "1");
  }
  url = destination.href;
  if (replace) window.location.replace(url);
  else window.location.assign(url);
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  consent = value;
  let persisted = false;
  try {
    localStorage.setItem(storageKey, value);
    persisted = true;
  } catch {
    /* Session fallback below. */
  }
  try {
    if (value === "denied" && !persisted)
      sessionStorage.setItem(denialKey, "true");
    else sessionStorage.removeItem(denialKey);
    if (value === "denied") persisted = true;
  } catch {
    /* Unknown consent never starts capture. */
  }
  if (value === "denied" && attempted) {
    denyAndStop();
    // Consent V2 denial may restart cookieless tracking. Destroy this document.
    leaveDocument(
      persisted ? window.location.href : `${entry!.pathname}#analytics-off`,
      true,
    );
  } else if (value === "granted") {
    start();
  }
}

function canStart() {
  return (
    captureDocument &&
    guardsReady &&
    ready &&
    !leaving &&
    consent === "granted" &&
    router?.state.initialized &&
    !router.state.errors &&
    router.state.navigation.state === "idle" &&
    router.state.location.state == null &&
    isClarityLocationSafe(window.location) &&
    (!document.referrer || document.referrer === entry!.href)
  );
}

function start() {
  if (!canStart() || attempted || pending) return;
  pending = import("@microsoft/clarity")
    .then(({ default: clarity }) => {
      if (!canStart()) return;
      attempted = true;
      sdk = clarity;
      clarity.init(projectId!);
      clarity.consentV2({ analytics_Storage: "granted", ad_Storage: "denied" });
    })
    .catch(() => {
      ready = false;
    })
    .finally(() => {
      pending = undefined;
    });
}

// Called only after the audited route actually commits (including lazy/Suspense).
export function markClarityPageReady() {
  ready = true;
  start();
}

// Must run BEFORE creating the router and BEFORE importing the SDK.
export function prepareClarityDocument() {
  try {
    if (!clarityEnabled || prepared || !entry) return;
    prepared = true;
    if (boundaryEntry) history.replaceState(history.state, "", entry.href);
    const replaceState = history.replaceState.bind(history);
    // POP changes the address before Router/Clarity callbacks. Restore the safe
    // outgoing URL synchronously, then load the destination as a fresh document.
    window.addEventListener(
      "popstate",
      (event) => {
        const next = new URL(window.location.href);
        if (captureDocument || isClarityLocationSafe(next)) {
          event.stopImmediatePropagation();
          replaceState(null, "", entry.href);
          leaveDocument(next.href, true);
        }
      },
      true,
    );
    if (captureDocument) {
      // Defense for direct history calls/hash-only navigation (no loader execution).
      for (const method of ["pushState", "replaceState"] as const) {
        const original = history[method].bind(history);
        history[method] = (data, unused, url) => {
          const next = new URL(
            url == null ? window.location.href : String(url),
            window.location.href,
          );
          if (next.href !== entry.href) {
            leaveDocument(next.href, method === "replaceState");
            return;
          }
          original(data, unused, url);
        };
      }
      window.addEventListener(
        "pageshow",
        (event) => {
          if (event.persisted) {
            leaving = false;
            denyAndStop();
            leaveDocument(window.location.href, true);
          }
        },
        true,
      );
    }
    guardsReady = true;
  } catch {
    guardsReady = false; // Unsupported guards disable analytics, not the app.
  }
}

// Redirect before ANY target loader runs, including redirects that bypass blockers.
// Excluded documents retain the router's normal parallel-loader behavior.
export const clarityDataStrategy: DataStrategyFunction = async ({
  matches,
  request,
}) => {
  const next = new URL(request.url);
  if (
    clarityEnabled &&
    entry &&
    // Router Request URLs omit fragments; do not redirect a hash-bearing entry.
    next.href !== entry.href.split("#")[0] &&
    (captureDocument || isClarityLocationSafe(next))
  ) {
    return {
      [matches[0].route.id]: {
        type: "data",
        result: redirectDocument(next.href),
      },
    };
  }
  const results = await Promise.all(
    matches
      .filter((match) => match.shouldLoad)
      .map(async (match) => [match.route.id, await match.resolve()] as const),
  );
  return Object.fromEntries(results);
};

export function setupClarity(appRouter: Router) {
  try {
    if (!clarityEnabled || router) return;
    router = appRouter;
    // Block BEFORE commit; never render a sensitive route under a loaded recorder.
    router.getBlocker(
      "clarity-document-boundary",
      ({ nextLocation, historyAction }) => {
        if (captureDocument || isClarityLocationSafe(nextLocation)) {
          const next =
            nextLocation.pathname + nextLocation.search + nextLocation.hash;
          if (
            next !== entry!.pathname + entry!.search + entry!.hash ||
            nextLocation.state != null
          ) {
            leaveDocument(next, historyAction === "REPLACE");
            return true;
          }
        }
        return false;
      },
    );
    router.subscribe(start);
    window.addEventListener("storage", (event) => {
      if (event.key !== storageKey && event.key !== null) return;
      consent = readAnalyticsConsent();
      if (consent !== "granted" && attempted) {
        denyAndStop();
        leaveDocument(window.location.href, true);
      } else start();
    });
  } catch {
    guardsReady = false;
  }
}
