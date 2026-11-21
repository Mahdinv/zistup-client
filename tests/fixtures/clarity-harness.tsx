import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import AnalyticsConsent from "../../src/app/analytics/analytics-consent";
import ClarityCapture from "../../src/app/analytics/clarity-capture";
import {
  prepareClarityDocument,
  setupClarity,
  clarityDataStrategy,
} from "../../src/app/analytics/clarity";
import ChoosePlanForm from "../../src/features/onboarding/components/choose-plan-form";
import "../../src/index.css";

prepareClarityDocument();
const router = createBrowserRouter(
  [
    {
      path: "/onboarding/choose-plan",
      loader: () =>
        (window as Window & { testRedirectOnLoad?: boolean }).testRedirectOnLoad
          ? redirect("/app/profile?token=private-redirect")
          : null,
      element: (
        <ClarityCapture>
          <main style={{ height: "100dvh", overflowY: "auto" }}>
            <div style={{ minHeight: 1800, paddingTop: 160 }}>
              <ChoosePlanForm />
            </div>
          </main>
        </ClarityCapture>
      ),
    },
    {
      path: "/redirect-test",
      loader: () => redirect("/app/profile"),
      element: null,
    },
    {
      path: "*",
      loader: () => {
        Object.assign(window, { sensitiveLoaderRan: true });
        return null;
      },
      element: (
        <div
          data-health="private-health-777"
          aria-valuenow={83.7}
          style={{ width: "83.7%" }}
        >
          private-user-09123456789
          <input defaultValue="private-otp-1234" />
        </div>
      ),
    },
  ],
  { dataStrategy: clarityDataStrategy },
);
setupClarity(router);
setupClarity(router);
Object.assign(window, {
  testNavigate: router.navigate,
  testRevalidate: router.revalidate,
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnalyticsConsent />
    <RouterProvider router={router} />
  </StrictMode>,
);
