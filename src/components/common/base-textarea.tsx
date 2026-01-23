import React from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

type BaseProps = {
  tip?: string;
  containerClassName?: string;
};

export const BaseTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea> & BaseProps
>(({ className, tip, containerClassName, ...props }, ref) => {
  return (
    <div
      className={cn(
        "bg-background-secondary border border-border-primary rounded-lg p-6",
        containerClassName,
      )}
    >
      <Textarea
        ref={ref}
        className={cn(
          "w-full h-40 bg-background border-border-secondary p-4 resize-none focus-visible:ring-0 focus-visible:border-accent-blue",
          className,
        )}
        {...props}
      />
      {tip && <p className="mt-4 text-sm text-text-tertiary">Tip: {tip}</p>}
    </div>
  );
});
BaseTextarea.displayName = "BaseTextarea";
