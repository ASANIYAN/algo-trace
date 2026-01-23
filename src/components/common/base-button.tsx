import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

export const BaseButton: React.FC<ButtonProps> = ({
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  className = "",
  children,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <Button
      type={type}
      className={cn(
        "px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2 font-medium",
        className,
      )}
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
