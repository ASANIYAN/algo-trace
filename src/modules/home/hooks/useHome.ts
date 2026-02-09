import { useState } from "react";
import { analyzeProblemAndGenerateVisualization } from "@/lib/ai-service";
import { useVisualizationStore } from "@/store/visualisation-store";
import { toast } from "sonner";

type UseHomeReturn = {
  isLoading: boolean;
  error: string | null;
  handleProblemSubmit: (problem: string) => Promise<void>;
};

export const useHome = (): UseHomeReturn => {
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
      toast.success("Visualization generated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleProblemSubmit,
  };
};
