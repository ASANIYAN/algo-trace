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

  // ============================================================
  // FIX: Merge state with highlightedNodes and highlightedEdges
  // ============================================================
  const visualizationState = {
    ...currentStep?.state,
    highlightedNodes: currentStep?.highlightedNodes || [],
    highlightedEdges: currentStep?.highlightedEdges || [],
  };

  console.log(
    "VisualizationCanvas rendering step",
    currentStepIndex,
    "with state:",
    visualizationState,
  );

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {visualizationData.problemTitle}
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Data Structure:{" "}
          <span className="text-accent-blue capitalize">
            {visualizationData.dataStructureType}
          </span>
        </p>
      </div>

      {/* Step description */}
      <div className="bg-background border border-border-secondary rounded-lg p-4 mb-4">
        <p className="text-sm text-text-primary">
          <span className="text-accent-blue font-semibold">
            Step {currentStepIndex + 1}:
          </span>{" "}
          {currentStep?.description}
        </p>
      </div>

      {/* Visualization */}
      <div
        className="bg-background border border-border-secondary rounded-lg"
        style={{ height: "450px" }}
      >
        <DataStructureVisualizer
          type={visualizationData.dataStructureType}
          data={visualizationState}
        />
      </div>

      {/* Explanation */}
      <div className="mt-4 p-4 bg-background-tertiary border border-border-primary rounded-lg">
        <p className="text-sm text-text-secondary">
          {visualizationData.explanation}
        </p>
      </div>
    </div>
  );
};
