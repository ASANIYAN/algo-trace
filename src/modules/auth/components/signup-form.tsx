import { BaseButton } from "@/components/common/base-button";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SocialAuthButtons } from "./social-auth-buttons";
import FormInput from "@/components/common/form-input";
import { useSignupForm } from "../hooks/useSignupForm";

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const { form, mutation, isLoading } = useSignupForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-accent-green bg-opacity-10 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-accent-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-text-primary">
          Check your email
        </h3>
        <p className="text-text-secondary">
          We've sent you a confirmation link to{" "}
          <strong className="text-text-primary">{watch("email")}</strong>
        </p>
        <BaseButton
          onClick={() => navigate("/login")}
          variant="outline"
          className="mt-4"
        >
          Back to Login
        </BaseButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SocialAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-primary" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background-secondary text-text-tertiary">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
        />

        <FormInput
          control={control}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="new-password"
          description="Must be at least 6 characters"
        />

        <FormInput
          control={control}
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        <BaseButton
          type="submit"
          variant="primary"
          className="w-full"
          loading={isLoading}
        >
          Create Account
        </BaseButton>
      </form>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-accent-blue hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
