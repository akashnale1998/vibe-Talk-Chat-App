import { lazy } from "react";
import Loadable from "components/Loadable";
import MinimalLayout from "layout/MinimalLayout";
import PublicRoute from "pages/dashboard/PublicRoute";
// import PublicRoute from "components/PublicRoute";

const AuthLogin = Loadable(lazy(() => import("pages/authentication/login")));
const AuthRegister = Loadable(lazy(() => import("pages/authentication/register")));

const LoginRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/login",
      element: (
        <PublicRoute>
          <AuthLogin />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <AuthRegister />
        </PublicRoute>
      ),
    },
  ],
};

export default LoginRoutes;
