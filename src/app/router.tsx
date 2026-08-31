import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import AccountFlowLayout from "./layouts/account-flow/account-flow-layout";
import type { AccountFlowRouteHandle } from "./layouts/account-flow/account-flow.types";
import type { PlaygroundFlowRouteHandle } from "./layouts/playground-flow/playground-flow-types";
import PlaygroundFlowLayout from "./layouts/playground-flow/playground-flow-layout";
import ChoosePlan from "@/features/onboarding/pages/choose-plan-page";
import { requireAuth } from "@/features/auth/loaders/require-auth";
import { redirectIfAuthenticated } from "@/features/auth/loaders/redirect-if-authenticated";
import DashboardFlowLayout from "./layouts/dashboard-flow/dashboard-flow-layout";

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

const PreferredFoodPage = lazy(
  () => import("@/features/game-workflow/pages/preferred-food-page"),
);

const FreeShoppingPage = lazy(
  () => import("@/features/game-workflow/pages/free-shopping-page"),
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
            title: "مسیر تغییر تو",
            subTitle:
              "قدم به قدم جلو برو تا رژیمت دقیقاً بر اساس لایف‌استایلت شکل بگیره",
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
                title: "چند سؤال کوتاه",
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
                title: "همسفره",
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
                title: "مصرف هفته پیش تو",
                subTitle:
                  "توی هفته‌ای که گذشت، از هر گروه غذایی حدوداً چقدر خوردی؟",
                backTo: "/game-workflow",
              },
            } satisfies PlaygroundFlowRouteHandle,
          },
          {
            path: "preferred-food",
            element: <PreferredFoodPage />,
            handle: {
              header: {
                title: "چیدمان بشقاب‌ها",
                subTitle: "پنج بشقاب انتخاب کن تا سلیقه غذاییت دستمون بیاد",
                backTo: "/game-workflow",
              },
            } satisfies PlaygroundFlowRouteHandle,
          },
          {
            path: "free-shopping",
            element: <FreeShoppingPage />,
            handle: {
              header: {
                title: "فروشگاه بی‌‌نهایت",
                subTitle:
                  "فرض کن هیچ محدودیتی نداری؛ خوراکی‌های محبوبت رو برای یه هفته بدون نگرانی انتخاب کن",
                backTo: "/game-workflow",
              },
            } satisfies PlaygroundFlowRouteHandle,
          },
        ],
      },
    ],
  },
  {
    loader: requireAuth,
    children: [{ path: "/dashboard", element: <DashboardFlowLayout /> }],
  },
]);

export default router;
