import type { PlaybackState, VisualizationData } from "@/types";
import { create } from "zustand";

type VisualizationStore = {
  visualizationData: VisualizationData | null;
  setVisualizationData: (data: VisualizationData) => void;

  playback: PlaybackState;
  setCurrentStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
};

export const useVisualizationStore = create<VisualizationStore>((set, get) => ({
  visualizationData: null,
  setVisualizationData: (data) => set({ visualizationData: data }),

  playback: {
    currentStepIndex: 0,
    isPlaying: false,
    speed: 1000,
  },

  setCurrentStep: (index) =>
    set((state) => ({
      playback: { ...state.playback, currentStepIndex: index },
    })),

  nextStep: () =>
    set((state) => {
      const maxSteps = state.visualizationData?.steps.length ?? 0;
      const newIndex = Math.min(
        state.playback.currentStepIndex + 1,
        maxSteps - 1,
      );
      return { playback: { ...state.playback, currentStepIndex: newIndex } };
    }),

  prevStep: () =>
    set((state) => {
      const newIndex = Math.max(state.playback.currentStepIndex - 1, 0);
      return { playback: { ...state.playback, currentStepIndex: newIndex } };
    }),

  play: () =>
    set((state) => ({
      playback: { ...state.playback, isPlaying: true },
    })),

  pause: () =>
    set((state) => ({
      playback: { ...state.playback, isPlaying: false },
    })),

  setSpeed: (speed) =>
    set((state) => ({
      playback: { ...state.playback, speed },
    })),

  reset: () =>
    set((state) => ({
      playback: { ...state.playback, currentStepIndex: 0, isPlaying: false },
    })),
}));
