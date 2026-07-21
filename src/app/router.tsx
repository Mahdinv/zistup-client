import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/auth-layout";
import { lazy } from "react";
import ChoosePlan from "../features/authentication/pages/choose-plan";

const Login = lazy(() => import("../features/authentication/pages/login"));
const DemographicInformation = lazy(
  () => import("../features/authentication/pages/demographic-information"),
);

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to={"/login"} replace /> },
      {
        path: "login",
        element: <Login />,
        handle: { firstLineTitle: "ورود", secondLineTitle: "زیـــــست‌آپ" },
      },
      {
        path: "demographic-information",
        element: <DemographicInformation />,
        handle: {
          firstLineTitle: "اطلاعــــــــــات",
          secondLineTitle: "پایه",
        },
      },
      {
        path: "choose-plan",
        element: <ChoosePlan />,
        handle: {
          firstLineTitle: "مسیر پیشرفتت",
          secondLineTitle: "رو انتخاب کن",
        },
      },
    ],
  },
]);

export default router;
