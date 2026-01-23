import { MainLayout } from "@/components/layout/main-layout";
import { useVisualizationStore } from "@/store/visualisation-store";
import { useState } from "react";
import { ProblemInput } from "../components/problem-input";
import { VisualizationCanvas } from "@/components/visualisation/visual-canvas";
import { PlaybackControls } from "@/components/controls/playback-controls";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const setVisualizationData = useVisualizationStore(
    (state) => state.setVisualizationData,
  );

  const handleProblemSubmit = async (problem: string) => {
    setIsLoading(true);

    // TODO: Call Claude API here
    // For now, let's use mock data
    setTimeout(() => {
      // Mock visualization data
      setVisualizationData({
        problemTitle: "Binary Search",
        dataStructureType: "array",
        initialState: [1, 3, 5, 7, 9, 11, 13],
        explanation: "Binary search algorithm demonstration",
        steps: [
          {
            id: "1",
            operation: "initialize",
            description: "Initialize search with target = 7",
            state: {
              array: [1, 3, 5, 7, 9, 11, 13],
              left: 0,
              right: 6,
              mid: null,
            },
          },
          {
            id: "2",
            operation: "calculate_mid",
            description: "Calculate mid = 3",
            state: {
              array: [1, 3, 5, 7, 9, 11, 13],
              left: 0,
              right: 6,
              mid: 3,
            },
          },
          {
            id: "3",
            operation: "found",
            description: "Found target at index 3!",
            state: {
              array: [1, 3, 5, 7, 9, 11, 13],
              left: 0,
              right: 6,
              mid: 3,
              found: true,
            },
          },
        ],
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <ProblemInput onSubmit={handleProblemSubmit} isLoading={isLoading} />
        <VisualizationCanvas />
        <PlaybackControls />
      </div>
    </MainLayout>
  );
}

export default Home;
