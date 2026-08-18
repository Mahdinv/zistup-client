import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import AccountFlowLayout from "./layouts/account-flow/account-flow-layout";
import type { AccountFlowRouteHandle } from "./layouts/account-flow/account-flow.types";
import type { PlaygroundFlowRouteHandle } from "./layouts/playground-flow/playground-flow-types";
import PlaygroundFlowLayout from "./layouts/playground-flow/playground-flow-layout";
import ChoosePlan from "@/features/onboarding/pages/choose-plan-page";

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

const TablematePage = lazy(
  () => import("@/features/game-workflow/pages/tablemate-page"),
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
        element: <LoginPage />,
        handle: {
          accountFlowHeader: {
            firstLineTitle: "ورود",
            secondLineTitle: "زیـــــست‌آپ",
          },
        } satisfies AccountFlowRouteHandle,
      },
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
                firstLineTitle: "مسیر پیشرفتت",
                secondLineTitle: "رو انتخاب کن",
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
        path: "demographic-informations",
        element: <DemographicInformationPage />,
        handle: {
          header: {
            title: "چند سؤال کوتاه برای شروع",
            subTitle: "جوابشون رو بدی،یه رژیم بهتر و دقیق‌تربرای تو می‌چینیم",
            backTo: "/game-workflow",
          },
        } satisfies PlaygroundFlowRouteHandle,
      },
      {
        path: "tablemates",
        element: <TablematePage />,
        handle: {
          header: {
            title: "یک یا چند همسفره مشخص کن",
            subTitle: "افرادی که با  آنها غذا میخورید رو مشخص کنید. اختیاری",
            backTo: "/game-workflow",
          },
        } satisfies PlaygroundFlowRouteHandle,
      },
      {
        path: "past-week-intake",
        element: <PastWeekIntakePage />,
        handle: {
          header: {
            title: "در هفته گذشته از هر گروه غذایی چند وعده استفاده کردی؟",
            backTo: "/game-workflow",
          },
        } satisfies PlaygroundFlowRouteHandle,
      },
    ],
  },
]);

export default router;
