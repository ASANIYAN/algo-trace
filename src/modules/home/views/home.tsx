import { MainLayout } from "@/components/layout/main-layout";
import { analyzeProblemAndGenerateVisualization } from "@/lib/ai-service";
import { useVisualizationStore } from "@/store/visualisation-store";
import { useState } from "react";
import { ProblemInput } from "../components/problem-input";
import { VisualizationCanvas } from "@/components/visualisation/visual-canvas";
import { PlaybackControls } from "@/components/controls/playback-controls";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setVisualizationData = useVisualizationStore(
    (state) => state.setVisualizationData,
  );

  const handleProblemSubmit = async (problem: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const visualizationData =
        await analyzeProblemAndGenerateVisualization(problem);
      setVisualizationData(visualizationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <ProblemInput onSubmit={handleProblemSubmit} isLoading={isLoading} />

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
            <p className="text-white">{error}</p>
          </div>
        )}

        <VisualizationCanvas />
        <PlaybackControls />
      </div>
    </MainLayout>
  );
}

export default Home;
