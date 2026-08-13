import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import ChoosePlan from "../features/onboarding/pages/choose-plan-page";
import ConventionalGlobalDiets from "../features/onboarding/components/conventional-global-diets";
import ChoosePlanForm from "../features/onboarding/components/choose-plan-form";
import ConventionalGlobalDietDetails from "../features/onboarding/components/conventional-global-diet-details";
import AccountFlowLayout from "./layouts/account-flow/account-flow-layout";
import type { AccountFlowRouteHandle } from "./layouts/account-flow/account-flow.types";

const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
const BasicInformationPage = lazy(
  () => import("../features/onboarding/pages/basic-information-page"),
);

const router = createBrowserRouter([
  {
    element: <AccountFlowLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
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
                backTo: "/auth/choose-plan",
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
]);

export default router;
