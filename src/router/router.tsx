import App from "@/App";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { LoginPage } from "@/modules/auth/views/login-page";
import { SignupPage } from "@/modules/auth/views/signup-page";
import Home from "@/modules/home/views/home";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

const unprotectedRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
