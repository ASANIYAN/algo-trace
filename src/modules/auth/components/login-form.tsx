import React from "react";
import { Link } from "react-router-dom";
import { SocialAuthButtons } from "./social-auth-buttons";
import FormInput from "@/components/common/form-input";
import FormPasswordInput from "@/components/common/form-password-input";
import { BaseButton } from "@/components/common/base-button";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm: React.FC = () => {
  const { form, mutation, isLoading } = useLoginForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          control={control}
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
        />

        <div className="space-y-2.5">
          <FormPasswordInput
            control={control}
            name="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
          />

          <Link
            to="/forgot-password"
            className="text-accent-blue hover:underline font-medium text-right block text-sm"
          >
            Forgot password?
          </Link>
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          className="w-full py-6 mt-5"
          loading={isLoading}
        >
          Sign In
        </BaseButton>
      </form>

      <p className="text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-accent-blue hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};
