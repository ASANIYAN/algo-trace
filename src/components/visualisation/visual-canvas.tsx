import { useVisualizationStore } from "@/store/visualisation-store";
import React from "react";
import { DataStructureVisualizer } from "./data-structure-visualiser";

export const VisualizationCanvas: React.FC = () => {
  const visualizationData = useVisualizationStore(
    (state) => state.visualizationData,
  );
  const currentStepIndex = useVisualizationStore(
    (state) => state.playback.currentStepIndex,
  );

  if (!visualizationData) {
    return (
      <div className="bg-background-secondary border border-border-primary rounded-lg p-12 text-center">
        <p className="text-text-secondary">
          Enter a problem above to see the visualization
        </p>
      </div>
    );
  }

  const currentStep = visualizationData.steps[currentStepIndex];

  const visualizationState = {
    ...currentStep?.state,
    highlightedNodes: currentStep?.highlightedNodes || [],
    highlightedEdges: currentStep?.highlightedEdges || [],
  };

  return (
    <section className="bg-background-secondary border border-border-primary rounded-lg p-6">
      {/* Header - Responsive */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
          {visualizationData.problemTitle}
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Data Structure:{" "}
          <span className="text-accent-blue capitalize">
            {visualizationData.dataStructureType}
          </span>
        </p>
      </div>

      {/* Step description */}
      <div className="bg-background border border-border-secondary rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 max-h-24 sm:max-h-none overflow-y-auto">
        <p className="text-xs sm:text-sm text-text-primary">
          <span className="text-accent-blue font-semibold">
            Step {currentStepIndex + 1}:
          </span>{" "}
          {currentStep?.description}
        </p>
      </div>

      {/* Visualization */}
      <div
        className="bg-background border border-border-secondary rounded-lg"
        style={{ height: window.innerWidth < 640 ? "450px" : "500px" }}
      >
        <DataStructureVisualizer
          type={visualizationData.dataStructureType}
          data={visualizationState}
        />
      </div>

      {/* Explanation */}
      <details className="mt-3 sm:mt-4 group">
        <summary className="p-3 sm:p-4 bg-background-tertiary border border-border-primary rounded-lg cursor-pointer list-none">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Algorithm Explanation</span>
            <span className="text-text-tertiary group-open:rotate-180 transition-transform">
              ▼
            </span>
          </div>
        </summary>
        <div className="mt-2 p-3 sm:p-4 bg-background-tertiary border border-border-primary rounded-lg">
          <p className="text-xs sm:text-sm text-text-secondary">
            {visualizationData.explanation}
          </p>
        </div>
      </details>
    </section>
  );
};
