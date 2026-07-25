import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/auth-layout";
import { lazy } from "react";
import ChoosePlan from "../features/authentication/pages/choose-plan";
import type { AuthRouteHandle } from "../features/authentication/types/auth-route-handle";
import ConventionalGlobalDiets from "../features/authentication/components/conventional-global-diets";
import ChoosePlanForm from "../features/authentication/components/choose-plan-form";

const Login = lazy(() => import("../features/authentication/pages/login"));
const DemographicInformation = lazy(
  () => import("../features/authentication/pages/demographic-information"),
);

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      {
        path: "login",
        element: <Login />,
        handle: {
          authHeader: {
            firstLineTitle: "ورود",
            secondLineTitle: "زیـــــست‌آپ",
          },
        } satisfies AuthRouteHandle,
      },
      {
        path: "demographic-information",
        element: <DemographicInformation />,
        handle: {
          authHeader: {
            firstLineTitle: "اطلاعــــــــــات",
            secondLineTitle: "پایه",
          },
        } satisfies AuthRouteHandle,
      },
      {
        path: "choose-plan",
        element: <ChoosePlan />,
        children: [
          {
            index: true,
            element: <ChoosePlanForm />,
            handle: {
              authHeader: {
                firstLineTitle: "مسیر پیشرفتت",
                secondLineTitle: "رو انتخاب کن",
              },
              step: 1,
            } satisfies AuthRouteHandle,
          },
          {
            path: "conventional-global-diets",
            element: <ConventionalGlobalDiets />,
            handle: {
              authHeader: {
                firstLineTitle: "رژیم های",
                secondLineTitle: "مرسوم جهانی",
                backTo: "/auth/choose-plan",
              },
              step: 2,
            } satisfies AuthRouteHandle,
          },
        ],
      },
    ],
  },
]);

export default router;
