import type { VisualizationData } from "@/types";
import { GoogleGenAI, type GenerateContentConfig } from "@google/genai";
import {
  MAX_ARRAY_LENGTH,
  MAX_INPUT_LENGTH,
  MAX_NODES,
  MAX_STEPS,
} from "./constants";

const client = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

export async function analyzeProblemAndGenerateVisualization(
  problemDescription: string,
): Promise<VisualizationData> {
  if (problemDescription.length > MAX_INPUT_LENGTH) {
    throw new Error(
      `Problem description too long (${problemDescription.length} characters). Please limit to ${MAX_INPUT_LENGTH} characters for optimal visualization.`,
    );
  }

  const schema = {
    type: "OBJECT",
    properties: {
      problemTitle: { type: "STRING" },
      dataStructureType: {
        type: "STRING",
        enum: [
          "array",
          "linkedlist",
          "tree",
          "graph",
          "stack",
          "queue",
          "heap",
        ],
      },
      initialState: {
        type: "OBJECT",
        properties: {
          array: {
            type: "ARRAY",
            items: { type: "NUMBER" },
          },
          nodes: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                value: { type: "NUMBER" },
                left: { type: "STRING" },
                right: { type: "STRING" },
              },
              required: ["id", "value"],
            },
          },
          edges: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                from: { type: "STRING" },
                to: { type: "STRING" },
              },
              required: ["from", "to"],
            },
          },
        },
      },
      explanation: { type: "STRING" },
      steps: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING" },
            operation: { type: "STRING" },
            description: { type: "STRING" },
            state: {
              type: "OBJECT",
              properties: {
                array: {
                  type: "ARRAY",
                  items: { type: "NUMBER" },
                },
                nodes: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      id: { type: "STRING" },
                      value: { type: "NUMBER" },
                      left: { type: "STRING" },
                      right: { type: "STRING" },
                    },
                    required: ["id", "value"],
                  },
                },
                edges: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      from: { type: "STRING" },
                      to: { type: "STRING" },
                    },
                    required: ["from", "to"],
                  },
                },
              },
            },
            highlightedNodes: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            highlightedEdges: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
          },
          required: ["id", "operation", "description", "state"],
        },
      },
    },
    required: [
      "problemTitle",
      "dataStructureType",
      "steps",
      "explanation",
      "initialState",
    ],
  };

  // Detailed prompt with specific instructions
  const prompt = `You are an algorithm visualization expert. Analyze this problem and create a detailed step-by-step visualization.

Problem: ${problemDescription}

CRITICAL REQUIREMENTS BY DATA STRUCTURE TYPE:

FOR ARRAY PROBLEMS:
- In each step's "state", include: {"array": [numbers]}
- To show pointers (like left, right, mid), use "highlightedNodes" with string indices
- Example: If left pointer is at index 0 and right at index 8, use "highlightedNodes": ["0", "8"]
- The description should mention which pointer is which (e.g., "Left pointer at index 0, Right pointer at index 8")

FOR TREE PROBLEMS:
- In initialState, include ALL nodes with their relationships
- Each node needs: {"id": "unique_id", "value": number, "left": "child_id", "right": "child_id"}
- Nodes without children should omit "left"/"right" properties
- In EVERY step, include ALL nodes in "state.nodes" (copy from initialState)
- Use "highlightedNodes" with node IDs to show current focus: ["node_id_1", "node_id_2"]
- Example initialState:
{
  "nodes": [
    {"id": "5", "value": 5, "left": "3", "right": "8"},
    {"id": "3", "value": 3},
    {"id": "8", "value": 8}
  ]
}

FOR GRAPH PROBLEMS:
- In initialState, include "nodes" and "edges"
- Nodes: [{"id": "A", "value": 0}, {"id": "B", "value": 0}]
- Edges: [{"from": "A", "to": "B"}, {"from": "B", "to": "C"}]
- In EVERY step, include BOTH "nodes" and "edges" in state (copy from initialState)
- Use "highlightedNodes" for current nodes: ["A", "B"]
- Use "highlightedEdges" for traversed edges: ["A-B", "B-C"]

GENERAL RULES:
- Create 5-8 clear, educational steps
- Each description should explain what's happening in simple terms
- highlightedNodes and highlightedEdges should change each step to show progress
- All arrays in steps should have items, even if empty use []

Return ONLY valid JSON matching the schema. No markdown, no explanations outside JSON.`;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, // Lower temperature for more consistent structure
      } as GenerateContentConfig,
    });

    if (!response || !response.text) {
      throw new Error("No response received from AI service.");
    }

    const visualizationData = JSON.parse(response.text) as VisualizationData;

    // Post-process to fix common issues
    return validateAndSanitizeData(visualizationData);
  } catch (error: any) {
    console.error("GenAI API Error:", error);

    if (error.error?.message) {
      console.error("Detailed error:", error.error.message);
    }

    if (error.status === "INVALID_ARGUMENT") {
      throw new Error(
        `Schema validation failed. Please try rephrasing your problem.`,
      );
    }
    if (error.status === "NOT_FOUND") {
      throw new Error("The Gemini model is unavailable in your region.");
    }
    throw new Error("Failed to generate visualization. Please try again.");
  }
}

function validateAndSanitizeData(data: VisualizationData): VisualizationData {
  // Validate step count
  if (data.steps.length > MAX_STEPS) {
    console.warn(
      `Too many steps (${data.steps.length}). Truncating to ${MAX_STEPS}`,
    );
    data.steps = data.steps.slice(0, MAX_STEPS);
  }

  // Validate array length
  if (data.dataStructureType === "array") {
    data.steps.forEach((step) => {
      if (step.state.array && step.state.array.length > MAX_ARRAY_LENGTH) {
        console.warn(
          `Array too large (${step.state.array.length}). Truncating to ${MAX_ARRAY_LENGTH}`,
        );
        step.state.array = step.state.array.slice(0, MAX_ARRAY_LENGTH);
        step.description += " (Array truncated for visualization)";
      }
    });
  }

  // Validate node count for trees/graphs
  if (data.dataStructureType === "tree" || data.dataStructureType === "graph") {
    const nodeCount = data.initialState?.nodes?.length || 0;
    if (nodeCount > MAX_NODES) {
      throw new Error(
        `Too many nodes (${nodeCount}) for visualization. Please simplify to ${MAX_NODES} or fewer nodes.`,
      );
    }
  }

  return validateAndFixVisualizationData(data);
}

// Helper to validate and fix the visualization data
function validateAndFixVisualizationData(
  data: VisualizationData,
): VisualizationData {
  // For graph visualizations, ensure edges are in every step
  if (data.dataStructureType === "graph") {
    let edges = data.initialState?.edges || [];
    const nodes = data.initialState?.nodes || [];

    if (edges.length === 0 && nodes.length > 1) {
      console.warn("AI forgot edges. Generating fallback connections...");
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({ from: nodes[i].id, to: nodes[i + 1].id });
      }
      // loop back to make it look like a real graph
      edges.push({ from: nodes[nodes.length - 1].id, to: nodes[0].id });

      if (!data.initialState) data.initialState = { nodes: [] };
      data.initialState.edges = edges;
    }

    data.steps = data.steps.map((step) => {
      step.state.edges =
        step.state.edges && step.state.edges.length > 0
          ? step.state.edges
          : edges;
      step.state.nodes =
        step.state.nodes && step.state.nodes.length > 0
          ? step.state.nodes
          : nodes;
      return step;
    });
  }

  // For tree visualizations, ensure all nodes are in every step
  if (data.dataStructureType === "tree") {
    const allNodes = data.initialState?.nodes || [];

    data.steps = data.steps.map((step) => {
      if (!step.state.nodes || step.state.nodes.length === 0) {
        step.state.nodes = allNodes;
      }
      return step;
    });
  }

  // For array visualizations, parse pointer info from descriptions and highlightedNodes
  if (data.dataStructureType === "array") {
    data.steps = data.steps.map((step) => {
      if (step.highlightedNodes && step.highlightedNodes.length > 0) {
        const pointers: Record<string, number> = {};

        // Try to parse pointer names from description
        const desc = step.description.toLowerCase();
        step.highlightedNodes.forEach((indexStr, i) => {
          const index = parseInt(indexStr);

          if (desc.includes("left") && i === 0) {
            pointers["L"] = index;
          } else if (desc.includes("right") || desc.includes("end")) {
            pointers["R"] = index;
          } else if (desc.includes("mid")) {
            pointers["M"] = index;
          } else {
            pointers[`P${i}`] = index;
          }
        });

        // Add pointers to state
        if (Object.keys(pointers).length > 0) {
          step.state.pointers = pointers;
        }
      }
      return step;
    });
  }

  return data;
}
