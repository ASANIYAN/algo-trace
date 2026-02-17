import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormPasswordInput from "@/components/common/form-password-input";
import { Link } from "react-router-dom";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";
import { BaseButton } from "@/components/common/base-button";

function getPasswordStrength(password: string) {
  if (typeof password !== "string" || password.length === 0)
    return { score: 0, label: "", color: "bg-muted" };
  if (password.length < 6)
    return { score: 1, label: "Too short", color: "bg-accent-red" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { score: 1, label: "Weak", color: "bg-accent-red" },
    { score: 2, label: "Fair", color: "bg-accent-yellow" },
    { score: 3, label: "Good", color: "bg-accent-blue" },
    { score: 4, label: "Strong", color: "bg-accent-green" },
  ];
  return (
    levels[Math.min(score - 1, 3)] || { score: 0, label: "", color: "bg-muted" }
  );
}

export const ResetPasswordForm: React.FC = () => {
  const { form, mutation, isLoading, pageState } = useResetPasswordForm();
  const { control, handleSubmit, watch } = form;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const strength = getPasswordStrength(password) || {
    score: 0,
    label: "",
    color: "bg-muted",
  };
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  if (pageState === "success") {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          You can now sign in with your new password.
        </p>
        <Button asChild className="w-full">
          <Link to="/login">Continue to Login</Link>
        </Button>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-5"
    >
      {/* New Password */}
      <div className="space-y-2">
        <FormPasswordInput
          control={control}
          name="password"
          label="New Password"
          placeholder={""}
          autoComplete="new-password"
          autoFocus
          required
          className="text-white"
        />
        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    strength.score >= level ? strength.color : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-xs font-medium ${
                strength.score <= 1
                  ? "text-destructive"
                  : strength.score === 2
                    ? "text-accent-yellow"
                    : strength.score === 3
                      ? "text-accent-blue"
                      : "text-accent-green"
              }`}
            >
              {strength.label}
            </p>
          </div>
        )}
      </div>
      {/* Confirm Password */}
      <div className="space-y-2">
        <FormPasswordInput
          control={control}
          name="confirmPassword"
          label="Confirm New Password"
          placeholder={""}
          autoComplete="new-password"
          required
          className="text-white"
        />
        {passwordsMismatch && (
          <p className="text-xs text-accent-red">Passwords do not match</p>
        )}
        {passwordsMatch && (
          <p className="text-xs text-accent-green">Passwords match</p>
        )}
      </div>
      <BaseButton
        type="submit"
        className="w-full"
        loading={isLoading}
        disabled={isLoading || passwordsMismatch || password.length < 6}
      >
        {isLoading ? " Updating password..." : "Update Password"}
      </BaseButton>
    </form>
  );
};
