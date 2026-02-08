import React, { useState } from "react";
import { useProblemForm } from "../hooks/useProblemForm";
import { BaseButton } from "@/components/common/base-button";
import FormTextarea from "@/components/common/form-textarea";
import { examples } from "@/lib/constants";

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  isLoading: boolean;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const { form, handleFormSubmit } = useProblemForm({ onSubmit });
  const { control, setValue } = form;

  const handleExampleClick = (example: string) => {
    setValue("problem", example);
    setShowExamples(false);
  };

  return (
    <section className="bg-background-secondary border border-border-primary rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Enter Your Problem</h2>
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-accent-blue hover:underline"
        >
          {showExamples ? "Hide Examples" : "Show Examples"}
        </button>
      </div>

      {showExamples && (
        <div className="mb-4 p-4 bg-background border border-border-secondary rounded-lg">
          <p className="text-sm text-text-secondary mb-3">
            Click an example to use it:
          </p>
          <div className="space-y-2">
            {examples.map((example, i) => (
              <BaseButton
                key={i}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left text-sm p-3 bg-background-tertiary border border-border-primary rounded hover:border-accent-blue transition-colors"
              >
                {example}
              </BaseButton>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <FormTextarea
          name="problem"
          control={control}
          placeholder="Paste a LeetCode problem, algorithm question, or describe what you want to visualize..."
          tip="Be specific about the algorithm or data structure you want to visualize"
        />

        <div className="mt-4 flex justify-end items-center">
          <BaseButton type="submit" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Visualize"}
          </BaseButton>
        </div>
      </form>
    </section>
  );
};
