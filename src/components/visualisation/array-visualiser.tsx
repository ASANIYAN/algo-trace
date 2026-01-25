import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface ArrayVisualizerProps {
  data: {
    array: number[];
    pointers?: Record<string, number>;
    highlightedNodes?: string[];
  };
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Track dimensions in state to trigger re-renders on resize
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // ============================================================
  // STEP 1: Handle Resizing
  // ============================================================
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // ============================================================
  // STEP 2: The Drawing Logic (Runs on data OR dimension change)
  // ============================================================
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || !data?.array?.length)
      return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const isMobile = width < 640;
    const margin = isMobile
      ? { top: 60, right: 10, bottom: 40, left: 10 }
      : { top: 100, right: 40, bottom: 80, left: 40 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Dynamic sizing based on array length and current width
    const cellWidth = Math.min(
      isMobile ? 50 : 80,
      (innerWidth - data.array.length * 5) / data.array.length,
    );
    const cellHeight = isMobile ? 45 : 60;
    const spacing = Math.max(4, innerWidth * 0.01); // Responsive spacing

    const totalArrayWidth = data.array.length * (cellWidth + spacing) - spacing;
    const startX = (innerWidth - totalArrayWidth) / 2;
    const centerY = innerHeight / 2;

    const highlightedIndices = new Set(
      (data.highlightedNodes || []).map((nodeStr) => parseInt(nodeStr, 10)),
    );

    // ============================================================
    // STEP 3: Render Elements
    // ============================================================
    data.array.forEach((value, index) => {
      const isHighlighted = highlightedIndices.has(index);
      const x = startX + index * (cellWidth + spacing);
      const y = centerY - cellHeight / 2;

      const cellGroup = mainGroup
        .append("g")
        .attr("transform", `translate(${x}, ${y})`);

      cellGroup
        .append("rect")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("rx", 6)
        .attr("fill", isHighlighted ? "#00d071" : "#1a1a1a")
        .attr("stroke", isHighlighted ? "#00d071" : "#3a3a3a")
        .attr("stroke-width", isHighlighted ? 3 : 2);

      cellGroup
        .append("text")
        .attr("x", cellWidth / 2)
        .attr("y", cellHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#ededed")
        .attr("font-size", isMobile ? "14px" : "18px")
        .attr("font-family", "monospace")
        .text(value);

      cellGroup
        .append("text")
        .attr("x", cellWidth / 2)
        .attr("y", cellHeight + 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#707070")
        .attr("font-size", "11px")
        .text(index);
    });

    // Pointers Logic
    if (data.pointers) {
      const pointerGroup = mainGroup.append("g");

      Object.entries(data.pointers).forEach(([name, idx]) => {
        const x = startX + idx * (cellWidth + spacing) + cellWidth / 2;
        const pointerY = centerY - cellHeight / 2 - 10;

        pointerGroup
          .append("text")
          .attr("x", x)
          .attr("y", pointerY - 15)
          .attr("text-anchor", "middle")
          .attr("fill", "#0070f3")
          .attr("font-weight", "bold")
          .attr("font-size", isMobile ? "12px" : "14px")
          .text(name.toUpperCase());

        pointerGroup
          .append("path")
          .attr(
            "d",
            d3.line()([
              [x, pointerY - 10],
              [x, pointerY],
            ]),
          )
          .attr("stroke", "#0070f3")
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#arrow)");
      });
    }
  }, [data, dimensions]); // Re-draws on data OR window resize

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-75 flex items-center justify-center bg-black"
    >
      <svg ref={svgRef} width="100%" height="100%">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0070f3" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};
