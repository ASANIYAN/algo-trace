import React from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

export const ResetPasswordPage: React.FC = () => {
  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Make it strong and don't reuse old passwords"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};
