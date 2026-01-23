import React from "react";
import { useVisualizationStore } from "@/store/visualisation-store";

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

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {visualizationData.problemTitle}
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Data Structure:{" "}
          <span className="text-accent-blue">
            {visualizationData.dataStructureType}
          </span>
        </p>
      </div>

      {/* Visualization area - we'll add D3 here later */}
      <div className="bg-background border border-border-secondary rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-2">Visualization Canvas</p>
          <p className="text-sm text-text-tertiary">
            Step {currentStepIndex + 1} of {visualizationData.steps.length}
          </p>
          <p className="text-sm text-text-secondary mt-4">
            {currentStep?.description}
          </p>
        </div>
      </div>
    </div>
  );
};
