import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const BaseButton: React.FC<ButtonProps> = ({
  leftIcon,
  rightIcon,
  loading = false,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  children,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed gap-2 cursor-pointer";

  const variants = {
    primary: "bg-accent-blue text-white hover:bg-opacity-90",
    secondary:
      "bg-background-tertiary text-text-primary border border-border-secondary hover:border-border-accent",
    outline:
      "bg-transparent text-text-primary border border-border-primary hover:border-accent-blue hover:text-accent-blue",
    ghost:
      "bg-transparent text-text-secondary hover:bg-background-tertiary hover:text-text-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <Button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin" size={16} aria-hidden="true" />
      )}
      {leftIcon && !loading && <span className="inline-flex">{leftIcon}</span>}
      <span className="leading-none">{children}</span>
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </Button>
  );
};
