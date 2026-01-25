import { useVisualizationStore } from "@/store/visualisation-store";
import React from "react";

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
    <div className="bg-background-secondary border border-border-primary rounded-lg p-3 sm:p-4">
      {/* Mobile: Stack controls vertically */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={reset}
            disabled={isAtStart}
            className="flex-1 sm:flex-none px-3 py-2 text-sm bg-background-tertiary border border-border-secondary rounded hover:border-border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Reset to start"
          >
            <span className="hidden sm:inline">⏮ Reset</span>
            <span className="sm:hidden">⏮</span>
          </button>

          <button
            onClick={prevStep}
            disabled={isAtStart}
            className="flex-1 sm:flex-none px-3 py-2 text-sm bg-background-tertiary border border-border-secondary rounded hover:border-border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous step"
          >
            <span className="hidden sm:inline">◀ Prev</span>
            <span className="sm:hidden">◀</span>
          </button>

          <button
            onClick={playback.isPlaying ? pause : play}
            disabled={isAtEnd}
            className="flex-1 sm:flex-none px-4 py-2 text-sm bg-accent-blue text-white rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            title={playback.isPlaying ? "Pause" : "Play"}
          >
            {playback.isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button
            onClick={nextStep}
            disabled={isAtEnd}
            className="flex-1 sm:flex-none px-3 py-2 text-sm bg-background-tertiary border border-border-secondary rounded hover:border-border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next step"
          >
            <span className="hidden sm:inline">Next ▶</span>
            <span className="sm:hidden">▶</span>
          </button>
        </div>

        {/* Step Counter */}
        <div className="text-sm text-text-secondary text-center sm:text-right">
          Step{" "}
          <span className="font-semibold text-accent-blue">
            {playback.currentStepIndex + 1}
          </span>{" "}
          / {visualizationData.steps.length}
        </div>
      </div>
    </div>
  );
};
