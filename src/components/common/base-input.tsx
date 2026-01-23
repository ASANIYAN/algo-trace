import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface BaseProps {
  tip?: string;
  containerClassName?: string;
}

export const BaseInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & BaseProps
>(({ className, tip, containerClassName, ...props }, ref) => {
  return (
    <div
      className={cn(
        "bg-background-secondary border border-border-primary rounded-lg p-6",
        containerClassName,
      )}
    >
      <Input
        ref={ref}
        className={cn(
          "bg-background border-border-secondary h-12 focus-visible:ring-0 focus-visible:border-accent-blue",
          className,
        )}
        {...props}
      />
      {tip && <p className="mt-4 text-sm text-text-tertiary">Tip: {tip}</p>}
    </div>
  );
});
BaseInput.displayName = "BaseInput";
