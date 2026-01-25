import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface TreeNode {
  id: string;
  value: number | string;
  left?: string;
  right?: string;
}

interface TreeVisualizerProps {
  data: {
    nodes: TreeNode[];
    highlightedNodes?: string[];
  };
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. Monitor Container Size
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Main Render Logic
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || !data?.nodes?.length)
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const isMobile = width < 640;

    // Responsive Margins & Radii
    const margin = isMobile
      ? { top: 40, right: 20, bottom: 40, left: 20 }
      : { top: 60, right: 60, bottom: 60, left: 60 };
    const nodeRadius = isMobile ? 20 : 28;
    const fontSize = isMobile ? "12px" : "16px";

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- Data Transformation (Flat to Hierarchy) ---
    const nodeMap = new Map<string, any>();
    data.nodes.forEach((node) =>
      nodeMap.set(node.id, { ...node, children: [] }),
    );

    const childIds = new Set<string>();
    data.nodes.forEach((node) => {
      if (node.left) childIds.add(node.left);
      if (node.right) childIds.add(node.right);
    });

    const rootNode =
      data.nodes.find((n) => !childIds.has(n.id)) || data.nodes[0];
    const root = nodeMap.get(rootNode.id);

    nodeMap.forEach((node, id) => {
      const original = data.nodes.find((n) => n.id === id);
      if (original?.left && nodeMap.has(original.left))
        node.children.push(nodeMap.get(original.left));
      if (original?.right && nodeMap.has(original.right))
        node.children.push(nodeMap.get(original.right));
    });

    // --- D3 Tree Layout ---
    const hierarchy = d3.hierarchy(root);
    const treeLayout = d3.tree().size([innerWidth, innerHeight]);
    const treeData = treeLayout(hierarchy);

    const highlightedIds = new Set(data.highlightedNodes || []);

    // --- Draw Links ---
    mainGroup
      .append("g")
      .selectAll("path")
      .data(treeData.links())
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "#333")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d: any) => d.x)
          .y((d: any) => d.y) as any,
      );

    // --- Draw Nodes ---
    const nodeEnter = mainGroup
      .append("g")
      .selectAll("g")
      .data(treeData.descendants())
      .join("g")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    nodeEnter
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d: any) =>
        highlightedIds.has(d.data.id) ? "#00d071" : "#1a1a1a",
      )
      .attr("stroke", (d: any) =>
        highlightedIds.has(d.data.id) ? "#00d071" : "#3a3a3a",
      )
      .attr("stroke-width", 2);

    nodeEnter
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", fontSize)
      .attr("font-family", "monospace")
      .text((d: any) => d.data.value);
  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] bg-black">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// interface TreeNode {
//   id: string;
//   value: number | string;
//   left?: string;
//   right?: string;
// }

// interface TreeVisualizerProps {
//   data: {
//     nodes: TreeNode[];
//     highlightedNodes?: string[];
//   };
// }

// export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ data }) => {
//   const svgRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     // Guard: Don't render if no SVG element or no data
//     if (!svgRef.current || !data?.nodes || data.nodes.length === 0) {
//       console.log("TreeVisualizer: No data to render");
//       return;
//     }

//     console.log("TreeVisualizer rendering with data:", data);
//     console.log("Highlighted nodes:", data.highlightedNodes);

//     // ============================================================
//     // STEP 1: Setup - Clear everything and start fresh each time
//     // ============================================================
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove(); // Complete clean slate every render

//     const width = svgRef.current.clientWidth || 800;
//     const height = svgRef.current.clientHeight || 600;

//     // Margins for the visualization
//     const margin = { top: 60, right: 60, bottom: 60, left: 60 };
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     // Create main group for all elements
//     const mainGroup = svg
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     // ============================================================
//     // STEP 2: Build Tree Structure from Flat Node List
//     // ============================================================

//     // Create a map for quick node lookup by ID
//     const nodeMap = new Map<string, any>();
//     data.nodes.forEach((node) => {
//       nodeMap.set(node.id, {
//         id: node.id,
//         value: node.value,
//         left: node.left,
//         right: node.right,
//         children: [], // Will be populated below
//       });
//     });

//     console.log("Node map:", nodeMap);

//     // Build parent-child relationships
//     // Find which nodes are children (referenced by left/right properties)
//     const childNodeIds = new Set<string>();
//     data.nodes.forEach((node) => {
//       if (node.left) childNodeIds.add(node.left);
//       if (node.right) childNodeIds.add(node.right);
//     });

//     console.log("Child node IDs:", Array.from(childNodeIds));

//     // Find the root node (not referenced as anyone's child)
//     let rootNode: any = null;
//     for (const node of data.nodes) {
//       if (!childNodeIds.has(node.id)) {
//         rootNode = nodeMap.get(node.id);
//         console.log("Found root node:", node.id);
//         break;
//       }
//     }

//     // Fallback: if no root found, use first node
//     if (!rootNode) {
//       rootNode = nodeMap.get(data.nodes[0].id);
//       console.log("Using first node as root:", data.nodes[0].id);
//     }

//     // Build the children arrays for each node
//     nodeMap.forEach((node, nodeId) => {
//       const originalNode = data.nodes.find((n) => n.id === nodeId);

//       if (originalNode?.left) {
//         const leftChild = nodeMap.get(originalNode.left);
//         if (leftChild) {
//           node.children.push(leftChild);
//           console.log(`Added left child ${leftChild.id} to ${node.id}`);
//         }
//       }

//       if (originalNode?.right) {
//         const rightChild = nodeMap.get(originalNode.right);
//         if (rightChild) {
//           node.children.push(rightChild);
//           console.log(`Added right child ${rightChild.id} to ${node.id}`);
//         }
//       }
//     });

//     // ============================================================
//     // STEP 3: Create D3 Hierarchy and Tree Layout
//     // ============================================================

//     // Convert our tree structure to D3 hierarchy
//     const hierarchyRoot = d3.hierarchy(rootNode);
//     console.log(
//       "Hierarchy created with",
//       hierarchyRoot.descendants().length,
//       "nodes",
//     );

//     // Create tree layout generator
//     const treeLayout = d3
//       .tree<any>()
//       .size([innerWidth, innerHeight])
//       .separation((a, b) => {
//         // More space between nodes that aren't siblings
//         return a.parent === b.parent ? 1 : 1.5;
//       });

//     // Apply layout to get coordinates
//     const treeData = treeLayout(hierarchyRoot);
//     console.log("Tree layout calculated");

//     // ============================================================
//     // STEP 4: Process Highlight Data
//     // ============================================================
//     const highlightedNodeIds = new Set(data.highlightedNodes || []);
//     console.log("Highlighted node IDs:", Array.from(highlightedNodeIds));

//     // ============================================================
//     // STEP 5: Draw Links (Edges between nodes)
//     // ============================================================

//     // Get all links (connections between parent and child)
//     const links = treeData.links();
//     console.log("Drawing", links.length, "links");

//     // Create a group for links (drawn first so they appear behind nodes)
//     const linkGroup = mainGroup.append("g").attr("class", "links");

//     // Draw each link
//     links.forEach((link, index) => {
//       const sourceNode = link.source.data;
//       const targetNode = link.target.data;

//       console.log(`Link ${index}: ${sourceNode.id} -> ${targetNode.id}`);

//       // Create curved path between parent and child
//       linkGroup
//         .append("path")
//         .attr("class", `link link-${sourceNode.id}-${targetNode.id}`)
//         .attr("d", () => {
//           // Use D3's linkVertical for smooth curves
//           const pathGenerator = d3
//             .linkVertical<any, any>()
//             .x((d) => d.x)
//             .y((d) => d.y);

//           return pathGenerator({
//             source: { x: link.source.x, y: link.source.y },
//             target: { x: link.target.x, y: link.target.y },
//           });
//         })
//         .attr("fill", "none")
//         .attr("stroke", "#3a3a3a")
//         .attr("stroke-width", 2)
//         .style("opacity", 0)
//         .transition()
//         .duration(600)
//         .style("opacity", 1);
//     });

//     // ============================================================
//     // STEP 6: Draw Nodes (Circles with values)
//     // ============================================================

//     // Get all nodes in the tree
//     const nodes = treeData.descendants();
//     console.log("Drawing", nodes.length, "nodes");

//     // Create a group for nodes
//     const nodeGroup = mainGroup.append("g").attr("class", "nodes");

//     // Draw each node
//     nodes.forEach((d, index) => {
//       const nodeData = d.data;
//       const isHighlighted = highlightedNodeIds.has(nodeData.id);

//       console.log(
//         `Node ${index}: id=${nodeData.id}, value=${nodeData.value}, highlighted=${isHighlighted}, x=${d.x}, y=${d.y}`,
//       );

//       // Create a group for this node (circle + text)
//       const node = nodeGroup
//         .append("g")
//         .attr("class", `node node-${nodeData.id}`)
//         .attr("transform", `translate(${d.x},${d.y})`);

//       // Draw the node circle
//       node
//         .append("circle")
//         .attr("class", "node-circle")
//         .attr("r", 0) // Start from radius 0
//         .attr("fill", "#1a1a1a")
//         .attr("stroke", "#3a3a3a")
//         .attr("stroke-width", 2)
//         .transition()
//         .duration(600)
//         .attr("r", 30) // Grow to radius 30
//         .attr("fill", isHighlighted ? "#00d071" : "#1a1a1a")
//         .attr("stroke", isHighlighted ? "#00d071" : "#3a3a3a")
//         .attr("stroke-width", isHighlighted ? 3 : 2);

//       // Draw the value text inside the circle
//       node
//         .append("text")
//         .attr("class", "node-text")
//         .attr("text-anchor", "middle")
//         .attr("dominant-baseline", "middle")
//         .attr("fill", "#ededed")
//         .attr("font-size", "18px")
//         .attr("font-weight", "600")
//         .attr("font-family", "monospace")
//         .style("pointer-events", "none")
//         .style("opacity", 0)
//         .text(nodeData.value)
//         .transition()
//         .delay(400) // Wait for circle to grow first
//         .duration(300)
//         .style("opacity", 1);

//       // Optional: Add node ID label below for debugging (comment out in production)
//       /*
//       node
//         .append('text')
//         .attr('class', 'node-id')
//         .attr('text-anchor', 'middle')
//         .attr('y', 45)
//         .attr('fill', '#707070')
//         .attr('font-size', '11px')
//         .text(nodeData.id)
//         .style('opacity', 0)
//         .transition()
//         .delay(400)
//         .duration(300)
//         .style('opacity', 1);
//       */
//     });

//     // ============================================================
//     // STEP 7: Add Hover Effects for Interactivity
//     // ============================================================
//     nodeGroup
//       .selectAll(".node")
//       .on("mouseenter", function (event, d) {
//         const nodeId = d3.select(this).attr("class").split("node-")[1];
//         const isHighlighted = highlightedNodeIds.has(nodeId);

//         d3.select(this)
//           .select(".node-circle")
//           .transition()
//           .duration(200)
//           .attr("r", 35) // Slightly bigger
//           .attr("stroke-width", isHighlighted ? 4 : 3);
//       })
//       .on("mouseleave", function (event, d) {
//         const nodeId = d3.select(this).attr("class").split("node-")[1];
//         const isHighlighted = highlightedNodeIds.has(nodeId);

//         d3.select(this)
//           .select(".node-circle")
//           .transition()
//           .duration(200)
//           .attr("r", 30) // Back to normal
//           .attr("stroke-width", isHighlighted ? 3 : 2);
//       });

//     // Cleanup function
//     return () => {
//       svg.selectAll("*").interrupt(); // Stop any ongoing transitions
//     };
//   }, [data]); // Re-run whenever data changes

//   // ============================================================
//   // RENDER: Just the SVG container
//   // ============================================================
//   return (
//     <svg
//       ref={svgRef}
//       className="w-full h-full"
//       style={{
//         minHeight: "400px",
//         backgroundColor: "#000000", // Match Vercel dark background
//       }}
//     />
//   );
// };
