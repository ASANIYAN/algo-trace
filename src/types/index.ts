// Core data structure types
export type DataStructureType =
  | "array"
  | "linkedlist"
  | "tree"
  | "graph"
  | "stack"
  | "queue"
  | "heap";

// Visualization step
export type VisualizationStep = {
  id: string;
  operation: string;
  description: string;
  state: any; // The state of the data structure at this step
  highlightedNodes?: string[];
  highlightedEdges?: string[];
};

// The complete visualization data from AI
export type VisualizationData = {
  problemTitle: string;
  dataStructureType: DataStructureType;
  initialState: any;
  steps: VisualizationStep[];
  explanation: string;
};

// Playback state
export type PlaybackState = {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // milliseconds per step
};
