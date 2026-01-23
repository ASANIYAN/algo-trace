import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useProblemForm } from "../hooks/useProblemForm";
import { BaseButton } from "@/components/common/base-button";
import FormTextarea from "@/components/common/form-textarea";

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  isLoading: boolean;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { control, handleFormSubmit } = useProblemForm({ onSubmit });

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Enter Your Problem</h2>

      <form onSubmit={handleFormSubmit}>
        <FormTextarea
          name="problem"
          control={control}
          placeholder="Paste a LeetCode problem, algorithm question, or describe what you want to visualize..."
          tip="Be specific about the algorithm or data structure you want to visualize"
        />

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-text-tertiary">
            Tip: Be specific about the algorithm or data structure you want to
            visualize
          </p>

          <BaseButton type="submit" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Visualize"}
          </BaseButton>
        </div>
      </form>
    </div>
  );
};
