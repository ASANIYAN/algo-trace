import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface GraphNode {
  id: string;
  value: number | string;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface GraphVisualizerProps {
  data: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    highlightedNodes?: string[];
    highlightedEdges?: string[];
  };
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !data?.nodes || data.nodes.length === 0) return;

    console.log("Graph data:", data); // Debug

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Only clear on first render
    if (!initializedRef.current) {
      svg.selectAll("*").remove();
      initializedRef.current = true;
    }

    // Ensure edges exist
    const edges = data.edges || [];

    if (edges.length === 0) {
      console.warn("No edges provided to graph visualizer");
    }

    // Create simulation nodes (mutable copies)
    const simNodes = data.nodes.map((n) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
    }));

    // Create simulation links
    const simLinks = edges.map((e) => ({
      source: e.from,
      target: e.to,
      edgeId: `${e.from}-${e.to}`,
    }));

    // Stop old simulation if exists
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Create force simulation
    const simulation = d3
      .forceSimulation(simNodes as any)
      .force(
        "link",
        d3
          .forceLink(simLinks)
          .id((d: any) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    simulationRef.current = simulation;

    // Draw edges
    let linkGroup = svg.select<SVGGElement>("g.links");
    if (linkGroup.empty()) {
      linkGroup = svg.append("g").attr("class", "links");
    }

    const link = linkGroup
      .selectAll<SVGLineElement, any>(".link")
      .data(simLinks, (d: any) => d.edgeId);

    const linkEnter = link
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", 3)
      .attr("stroke", "#3a3a3a")
      .style("opacity", 0);

    linkEnter.transition().duration(500).style("opacity", 1);

    const linkMerge = linkEnter.merge(link);

    // Update edge colors based on highlights
    linkMerge
      .transition()
      .duration(400)
      .attr("stroke", (d: any) =>
        data.highlightedEdges?.includes(d.edgeId) ? "#0070f3" : "#3a3a3a",
      )
      .attr("stroke-width", (d: any) =>
        data.highlightedEdges?.includes(d.edgeId) ? 4 : 3,
      );

    link.exit().remove();

    // Draw nodes
    let nodeGroup = svg.select<SVGGElement>("g.nodes");
    if (nodeGroup.empty()) {
      nodeGroup = svg.append("g").attr("class", "nodes");
    }

    const node = nodeGroup
      .selectAll<SVGGElement, any>(".node")
      .data(simNodes, (d: any) => d.id);

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag<any, any>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    nodeEnter
      .append("circle")
      .attr("class", "node-circle")
      .attr("r", 0)
      .attr("fill", "#1a1a1a")
      .attr("stroke", "#3a3a3a")
      .attr("stroke-width", 3)
      .transition()
      .duration(500)
      .attr("r", 35);

    nodeEnter
      .append("text")
      .attr("class", "node-text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#ededed")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .style("opacity", 0)
      .text((d: any) => d.id)
      .transition()
      .delay(300)
      .duration(300)
      .style("opacity", 1);

    const nodeMerge = nodeEnter.merge(node);

    // Update node colors based on highlights
    nodeMerge
      .select(".node-circle")
      .transition()
      .duration(400)
      .attr("fill", (d: any) =>
        data.highlightedNodes?.includes(d.id) ? "#00d071" : "#1a1a1a",
      )
      .attr("stroke", (d: any) =>
        data.highlightedNodes?.includes(d.id) ? "#00d071" : "#3a3a3a",
      );

    node.exit().remove();

    // Update positions on simulation tick
    simulation.on("tick", () => {
      linkMerge
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeMerge.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
};
