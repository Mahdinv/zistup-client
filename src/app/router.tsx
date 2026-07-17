import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/auth-layout";
import { lazy } from "react";

const Login = lazy(() => import("../features/authentication/pages/login"));

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to={"/login"} replace /> },
      {
        path: "login",
        element: <Login />,
        handle: { firstLineTitle: "ورود", secondLineTitle: "به زیست‌آپ" },
      },
    ],
  },
]);

export default router;
