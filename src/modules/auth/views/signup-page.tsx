import { AuthLayout } from "@/components/layout/auth-layout";
import React from "react";
import { SignupForm } from "../components/signup-form";

export const SignupPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start visualizing algorithms with AI"
    >
      <SignupForm />
    </AuthLayout>
  );
};
