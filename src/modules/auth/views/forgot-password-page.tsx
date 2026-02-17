import React from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import ForgotPasswordForm from "@/modules/auth/components/forgot-password";

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
