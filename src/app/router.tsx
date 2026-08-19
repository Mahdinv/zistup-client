import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import AccountFlowLayout from "./layouts/account-flow/account-flow-layout";
import type { AccountFlowRouteHandle } from "./layouts/account-flow/account-flow.types";
import type { PlaygroundFlowRouteHandle } from "./layouts/playground-flow/playground-flow-types";
import PlaygroundFlowLayout from "./layouts/playground-flow/playground-flow-layout";
import ChoosePlan from "@/features/onboarding/pages/choose-plan-page";
import { requireAuth } from "@/features/auth/loaders/require-auth";
import { redirectIfAuthenticated } from "@/features/auth/loaders/redirect-if-authenticated";

/* Auth */
const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));

/* Onboarding */
const BasicInformationPage = lazy(
  () => import("@/features/onboarding/pages/basic-information-page"),
);

const ChoosePlanForm = lazy(
  () => import("@/features/onboarding/components/choose-plan-form"),
);

const ConventionalGlobalDiets = lazy(
  () => import("@/features/onboarding/components/conventional-global-diets"),
);

const ConventionalGlobalDietDetails = lazy(
  () =>
    import("@/features/onboarding/components/conventional-global-diet-details"),
);

/* Game workflow */
const GameWorkflowPage = lazy(
  () => import("@/features/game-workflow/pages/game-workflow-page"),
);

const DemographicInformationPage = lazy(
  () => import("@/features/game-workflow/pages/demographic-information-page"),
);

const TablematesPage = lazy(
  () => import("@/features/game-workflow/pages/tablemates-page"),
);

const PastWeekIntakePage = lazy(
  () => import("@/features/game-workflow/pages/past-week-intake-page"),
);

const router = createBrowserRouter([
  {
    element: <AccountFlowLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      {
        path: "/auth/login",
        loader: redirectIfAuthenticated,
        element: <LoginPage />,
        handle: {
          accountFlowHeader: {
            firstLineTitle: "ورود",
            secondLineTitle: "زیـــــست‌آپ",
          },
        } satisfies AccountFlowRouteHandle,
      },
      {
        loader: requireAuth,
        children: [
          {
            path: "/onboarding/basic-information",
            element: <BasicInformationPage />,
            handle: {
              accountFlowHeader: {
                firstLineTitle: "اطلاعــــــــــات",
                secondLineTitle: "پایه",
              },
            } satisfies AccountFlowRouteHandle,
          },
          {
            path: "/onboarding/choose-plan",
            element: <ChoosePlan />,
            children: [
              {
                index: true,
                element: <ChoosePlanForm />,
                handle: {
                  accountFlowHeader: {
                    firstLineTitle: "دو مسیر انتخابی",
                    secondLineTitle: "پیشرفت شما",
                  },
                  step: 1,
                } satisfies AccountFlowRouteHandle,
              },
              {
                path: "conventional-global-diets",
                element: <ConventionalGlobalDiets />,
                handle: {
                  accountFlowHeader: {
                    firstLineTitle: "رژیم های",
                    secondLineTitle: "مرسوم جهانی",
                    backTo: "/onboarding/choose-plan",
                  },
                  step: 2,
                } satisfies AccountFlowRouteHandle,
              },
              {
                path: "conventional-global-diets/:dietId",
                element: <ConventionalGlobalDietDetails />,
                handle: {
                  // accountFlowHeader is not write here. Because we have routeState in this path
                  step: 3,
                } satisfies AccountFlowRouteHandle,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    loader: requireAuth,
    children: [
      {
        path: "/game-workflow",
        element: <PlaygroundFlowLayout />,
        handle: {
          header: {
            title: "سفر تو از همین‌جا شروع می‌شه",
            backTo: "/onboarding/choose-plan",
          },
        } satisfies PlaygroundFlowRouteHandle,
        children: [
          { index: true, element: <GameWorkflowPage /> },
          {
            path: "demographic-information",
            element: <DemographicInformationPage />,
            handle: {
              header: {
                title: "چند سؤال کوتاه برای شروع",
                subTitle:
                  "جوابشون رو بدی،یه رژیم بهتر و دقیق‌تربرای تو می‌چینیم",
                backTo: "/game-workflow",
              },
            } satisfies PlaygroundFlowRouteHandle,
          },
          {
            path: "tablemates",
            element: <TablematesPage />,
            handle: {
              header: {
                title: "یک یا چند همسفره مشخص کن",
                subTitle:
                  "افرادی که با  آنها غذا میخورید رو مشخص کنید. اختیاری",
                backTo: "/game-workflow",
              },
            } satisfies PlaygroundFlowRouteHandle,
          },
          {
            path: "past-week-intake",
            element: <PastWeekIntakePage />,
            handle: {
              header: {
                title: "مصرف هفته گذشته",
                subTitle: "میزان مصرفت از هر گروه غذایی رو مشخص کن",
                backTo: "/game-workflow",
              },
            } satisfies PlaygroundFlowRouteHandle,
          },
        ],
      },
    ],
  },
]);

export default router;
