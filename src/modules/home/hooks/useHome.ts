import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-contexts";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { analyzeProblemAndGenerateVisualization } from "@/lib/ai-service";
import { useVisualizationStore } from "@/store/visualisation-store";
import type { PostgrestError } from "@supabase/supabase-js";

type UseHomeReturn = {
  isLoading: boolean;
  error: string | null;
  handleProblemSubmit: (problem: string) => void;
  mutation: UseMutationResult<void, Error, string, unknown>;
  isLimitReached: boolean;
  isCheckingLimit: boolean;
};

const getFriendlyErrorMessage = (error: PostgrestError): string => {
  const errorMap: Record<string, string> = {
    PGRST301: "Your session has expired. Please sign in again.",
    "42P01": "The service is temporarily unavailable.",
    P0001: "You have exceeded your request limit for this week.",
    "57014": "The request took too long. Please try a shorter problem.",
    "42501": "You don't have permission to perform this action.",
  };

  return (
    errorMap[error.code] || "Something went wrong. Please try again later."
  );
};

export const useHome = (): UseHomeReturn => {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const setVisualizationData = useVisualizationStore(
    (state) => state.setVisualizationData,
  );

  // Check AI usage limit
  const {
    data: isLimitReached = false,
    isLoading: isCheckingLimit,
    error: limitError,
  } = useQuery({
    queryKey: ["ai-limit", user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase.rpc("check_ai_limit");
      if (error) throw error;
      return data as boolean;
    },
    enabled: !!user,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: async (problem: string) => {
      if (!user) {
        throw new Error("Please sign in to use the visualizer.");
      }

      if (isLimitReached) {
        throw new Error(
          "You've reached your limit of 3 visualizations this week. Please try again later!",
        );
      }

      const visualizationData =
        await analyzeProblemAndGenerateVisualization(problem);
      setVisualizationData(visualizationData);
    },
    onSuccess: () => {
      setError(null);
      toast.success("Visualization generated successfully!");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Visualization error:", error);
    },
  });

  const handleProblemSubmit = (problem: string) => {
    if (!user) {
      toast.error("Please sign in to use the visualizer.");
      navigate("/login");
      return;
    }

    if (limitError) {
      const message =
        limitError instanceof Error && "code" in limitError
          ? getFriendlyErrorMessage(limitError as PostgrestError)
          : "Failed to check usage limit. Please try again.";
      toast.error(message);
      return;
    }

    mutation.mutate(problem);
  };

  return {
    isLoading: mutation.isPending || isCheckingLimit,
    error,
    handleProblemSubmit,
    mutation,
    isLimitReached,
    isCheckingLimit,
  };
};
