import React from "react";
import { useVisualizationStore } from "@/store/visualisation-store";

export const PlaybackControls: React.FC = () => {
  const visualizationData = useVisualizationStore(
    (state) => state.visualizationData,
  );
  const playback = useVisualizationStore((state) => state.playback);
  const nextStep = useVisualizationStore((state) => state.nextStep);
  const prevStep = useVisualizationStore((state) => state.prevStep);
  const play = useVisualizationStore((state) => state.play);
  const pause = useVisualizationStore((state) => state.pause);
  const reset = useVisualizationStore((state) => state.reset);

  if (!visualizationData) return null;

  const isAtStart = playback.currentStepIndex === 0;
  const isAtEnd =
    playback.currentStepIndex === visualizationData.steps.length - 1;

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={reset}
            disabled={isAtStart}
            className="px-3 py-2 bg-background-tertiary border border-border-secondary rounded hover:border-border-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏮ Reset
          </button>

          <button
            onClick={prevStep}
            disabled={isAtStart}
            className="px-3 py-2 bg-background-tertiary border border-border-secondary rounded hover:border-border-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ◀ Prev
          </button>

          <button
            onClick={playback.isPlaying ? pause : play}
            disabled={isAtEnd}
            className="px-4 py-2 bg-accent-blue text-white rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {playback.isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button
            onClick={nextStep}
            disabled={isAtEnd}
            className="px-3 py-2 bg-background-tertiary border border-border-secondary rounded hover:border-border-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next ▶
          </button>
        </div>

        <div className="text-sm text-text-secondary">
          Step {playback.currentStepIndex + 1} /{" "}
          {visualizationData.steps.length}
        </div>
      </div>
    </div>
  );
};
