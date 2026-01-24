import { create } from "zustand";
import type { PlaybackState, VisualizationData } from "@/types";

interface VisualizationStore {
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

  // Auto-play interval ID
  playbackInterval: NodeJS.Timeout | null;
  setPlaybackInterval: (interval: NodeJS.Timeout | null) => void;
}

export const useVisualizationStore = create<VisualizationStore>((set, get) => ({
  visualizationData: null,
  setVisualizationData: (data) =>
    set({
      visualizationData: data,
      playback: {
        currentStepIndex: 0,
        isPlaying: false,
        speed: 1000,
      },
    }),

  playback: {
    currentStepIndex: 0,
    isPlaying: false,
    speed: 1000,
  },

  playbackInterval: null,
  setPlaybackInterval: (interval) => set({ playbackInterval: interval }),

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

      // Stop playing if we reached the end
      if (newIndex === maxSteps - 1 && state.playback.isPlaying) {
        if (state.playbackInterval) clearInterval(state.playbackInterval);
        return {
          playback: {
            ...state.playback,
            currentStepIndex: newIndex,
            isPlaying: false,
          },
          playbackInterval: null,
        };
      }

      return { playback: { ...state.playback, currentStepIndex: newIndex } };
    }),

  prevStep: () =>
    set((state) => {
      const newIndex = Math.max(state.playback.currentStepIndex - 1, 0);
      return { playback: { ...state.playback, currentStepIndex: newIndex } };
    }),

  play: () =>
    set((state) => {
      // Clear any existing interval
      if (state.playbackInterval) clearInterval(state.playbackInterval);

      // Create new interval for auto-advance
      const interval = setInterval(() => {
        get().nextStep();
      }, state.playback.speed);

      return {
        playback: { ...state.playback, isPlaying: true },
        playbackInterval: interval,
      };
    }),

  pause: () =>
    set((state) => {
      if (state.playbackInterval) clearInterval(state.playbackInterval);
      return {
        playback: { ...state.playback, isPlaying: false },
        playbackInterval: null,
      };
    }),

  setSpeed: (speed) =>
    set((state) => {
      // If currently playing, restart with new speed
      if (state.playback.isPlaying) {
        if (state.playbackInterval) clearInterval(state.playbackInterval);

        const interval = setInterval(() => {
          get().nextStep();
        }, speed);

        return {
          playback: { ...state.playback, speed },
          playbackInterval: interval,
        };
      }

      return { playback: { ...state.playback, speed } };
    }),

  reset: () =>
    set((state) => {
      if (state.playbackInterval) clearInterval(state.playbackInterval);
      return {
        playback: { ...state.playback, currentStepIndex: 0, isPlaying: false },
        playbackInterval: null,
      };
    }),
}));
