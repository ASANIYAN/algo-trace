import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface GraphNode {
  id: string;
  value: number | string;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, any> | null>(null);

  // 1. Setup the simulation ONCE
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 500;

    // Clear previous render to prevent duplicates in Strict Mode
    svg.selectAll("*").remove();

    // Prepare data references
    const nodes = data.nodes.map((d) => ({ ...d })) as SimNode[];
    const links = data.edges.map((d) => ({
      source: d.from,
      target: d.to,
      id: `${d.from}-${d.to}`,
    }));

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    simulationRef.current = simulation;

    // Draw Edges
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "graph-link")
      .attr("stroke", "#3a3a3a")
      .attr("stroke-width", 3);

    // Draw Nodes
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "graph-node")
      .call(
        d3
          .drag<any, any>()
          .on("start", (e, d) => {
            if (!e.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (e, d) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e, d) => {
            if (!e.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    node
      .append("circle")
      .attr("r", 30)
      .attr("fill", "#1a1a1a")
      .attr("stroke", "#3a3a3a")
      .attr("stroke-width", 2);
    node
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  // 2. Handle Highlights in a SEPARATE effect
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    // Update Nodes
    svg
      .selectAll(".graph-node circle")
      .transition()
      .duration(300)
      .attr("fill", (d: any) =>
        data.highlightedNodes?.includes(d.id) ? "#00d071" : "#1a1a1a",
      )
      .attr("stroke", (d: any) =>
        data.highlightedNodes?.includes(d.id) ? "#00d071" : "#3a3a3a",
      );

    // Update Edges
    svg
      .selectAll(".graph-link")
      .transition()
      .duration(300)
      .attr("stroke", (d: any) => {
        const edgeId = `${d.source.id}-${d.target.id}`;
        return data.highlightedEdges?.includes(edgeId) ? "#0070f3" : "#3a3a3a";
      })
      .attr("stroke-width", (d: any) => {
        const edgeId = `${d.source.id}-${d.target.id}`;
        return data.highlightedEdges?.includes(edgeId) ? 5 : 3;
      });
  }, [data.highlightedNodes, data.highlightedEdges]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] bg-black">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
