import type { DataStructureType } from "@/types";
import React from "react";
import { ArrayVisualizer } from "./array-visualiser";
import { TreeVisualizer } from "./tree-visualiser";
import { GraphVisualizer } from "./graph-visualiser";

interface DataStructureVisualizerProps {
  type: DataStructureType;
  data: any;
}

export const DataStructureVisualizer: React.FC<
  DataStructureVisualizerProps
> = ({ type, data }) => {
  switch (type) {
    case "array":
      return <ArrayVisualizer data={data} />;
    case "tree":
      return <TreeVisualizer data={data} />;
    case "graph":
      return <GraphVisualizer data={data} />;
    case "stack":
    case "queue":
      // Render as vertical array for now
      return <ArrayVisualizer data={data} />;
    case "linkedlist":
      // Render as horizontal connected nodes
      return <ArrayVisualizer data={data} />;
    case "heap":
      // Render as tree
      return <TreeVisualizer data={data} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-text-secondary">
          Visualization for {type} coming soon...
        </div>
      );
  }
};
