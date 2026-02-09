import { MainLayout } from "@/components/layout/main-layout";
import { ProblemInput } from "../components/problem-input";
import { VisualizationCanvas } from "@/components/visualisation/visual-canvas";
import { PlaybackControls } from "@/components/controls/playback-controls";
import { useHome } from "../hooks/useHome";

function Home() {
  const { isLoading, error, handleProblemSubmit } = useHome();

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
