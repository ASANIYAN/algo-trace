import { AuthLayout } from "@/components/layout/auth-layout";
import React from "react";
import { LoginForm } from "../components/login-form";

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue visualizing algorithms"
    >
      <LoginForm />
    </AuthLayout>
  );
};
