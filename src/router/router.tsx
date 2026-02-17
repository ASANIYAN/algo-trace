import App from "@/App";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { LoginPage } from "@/modules/auth/views/login-page";
import { SignupPage } from "@/modules/auth/views/signup-page";
import Home from "@/modules/home/views/home";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { ForgotPasswordPage } from "@/modules/auth/views/forgot-password-page";
import { ResetPasswordPage } from "@/modules/auth/views/reset-password-page";

const unprotectedRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
];

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />, // App as the base element
    errorElement: <></>, // Handle errors globally
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      ...unprotectedRoutes,
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
