import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    // Guard: Don't render if no SVG element or no data
    if (!svgRef.current || !data?.array || data.array.length === 0) {
      console.log("ArrayVisualizer: No data to render");
      return;
    }

    console.log("ArrayVisualizer rendering with data:", data);

    // ============================================================
    // STEP 1: Setup - Clear everything and start fresh each time
    // ============================================================
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Complete clean slate every render

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Margins for the visualization
    const margin = { top: 100, right: 40, bottom: 80, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group for all elements
    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ============================================================
    // STEP 2: Calculate Layout - Where to place each cell
    // ============================================================
    const cellWidth = Math.min(80, innerWidth / data.array.length); // Max 80px per cell
    const cellHeight = 60;
    const spacing = 10; // Gap between cells

    // Calculate total width needed and center it
    const totalArrayWidth = data.array.length * (cellWidth + spacing) - spacing;
    const startX = (innerWidth - totalArrayWidth) / 2;
    const centerY = innerHeight / 2;

    // ============================================================
    // STEP 3: Process Highlight Data
    // ============================================================
    // Convert string indices to numbers for easy comparison
    const highlightedIndices = new Set(
      (data.highlightedNodes || []).map((nodeStr) => parseInt(nodeStr, 10)),
    );

    console.log("Highlighted indices:", Array.from(highlightedIndices));

    // ============================================================
    // STEP 4: Draw Array Cells
    // ============================================================
    data.array.forEach((value, index) => {
      const isHighlighted = highlightedIndices.has(index);
      const x = startX + index * (cellWidth + spacing);
      const y = centerY - cellHeight / 2;

      // Create a group for this cell (rectangle + text + index)
      const cellGroup = mainGroup
        .append("g")
        .attr("class", `cell cell-${index}`)
        .attr("transform", `translate(${x}, ${y})`);

      // Draw the cell rectangle
      cellGroup
        .append("rect")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("rx", 8) // Rounded corners
        .attr("ry", 8)
        .attr("fill", "#1a1a1a") // Start dark
        .attr("stroke", "#3a3a3a")
        .attr("stroke-width", 2)
        // Animate to highlighted state if needed
        .transition()
        .duration(500)
        .attr("fill", isHighlighted ? "#00d071" : "#1a1a1a")
        .attr("stroke", isHighlighted ? "#00d071" : "#3a3a3a")
        .attr("stroke-width", isHighlighted ? 3 : 2);

      // Draw the value text inside the cell
      cellGroup
        .append("text")
        .attr("class", "cell-value")
        .attr("x", cellWidth / 2)
        .attr("y", cellHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#ededed")
        .attr("font-size", "20px")
        .attr("font-weight", "600")
        .attr("font-family", "monospace")
        .text(value)
        .style("pointer-events", "none"); // Don't block mouse events

      // Draw the index label below the cell
      cellGroup
        .append("text")
        .attr("class", "cell-index")
        .attr("x", cellWidth / 2)
        .attr("y", cellHeight + 25)
        .attr("text-anchor", "middle")
        .attr("fill", "#707070")
        .attr("font-size", "13px")
        .attr("font-family", "monospace")
        .text(index)
        .style("pointer-events", "none");
    });

    // ============================================================
    // STEP 5: Draw Pointers (if any)
    // ============================================================
    if (data.pointers && Object.keys(data.pointers).length > 0) {
      console.log("Drawing pointers:", data.pointers);

      // Define arrow marker for pointer tips
      const defs = svg.append("defs");

      defs
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 5)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "#0070f3");

      // Create a group for all pointers
      const pointerGroup = mainGroup.append("g").attr("class", "pointers");

      // Draw each pointer
      Object.entries(data.pointers).forEach(([pointerName, pointerIndex]) => {
        const x = startX + pointerIndex * (cellWidth + spacing) + cellWidth / 2;
        const arrowTop = centerY - cellHeight / 2 - 15; // 15px above cell
        const arrowBottom = centerY - cellHeight / 2 - 5; // 5px above cell
        const labelY = centerY - cellHeight / 2 - 25; // 25px above cell

        const pointerColor = "#0070f3"; // Vercel blue

        // Draw the pointer arrow (vertical line with arrow tip)
        pointerGroup
          .append("line")
          .attr("class", `pointer-arrow pointer-${pointerName}`)
          .attr("x1", x)
          .attr("y1", arrowTop)
          .attr("x2", x)
          .attr("y2", arrowBottom)
          .attr("stroke", pointerColor)
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrow)")
          .style("opacity", 0)
          .transition()
          .duration(500)
          .style("opacity", 1);

        // Draw the pointer label (L, R, M, etc.)
        pointerGroup
          .append("text")
          .attr("class", `pointer-label pointer-${pointerName}`)
          .attr("x", x)
          .attr("y", labelY)
          .attr("text-anchor", "middle")
          .attr("fill", pointerColor)
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .attr("font-family", "monospace")
          .text(pointerName.toUpperCase())
          .style("opacity", 0)
          .style("pointer-events", "none")
          .transition()
          .duration(500)
          .style("opacity", 1);
      });
    } else {
      console.log("No pointers to draw");
    }

    // ============================================================
    // STEP 6: Add subtle hover effects for interactivity
    // ============================================================
    svg
      .selectAll(".cell")
      .on("mouseenter", function () {
        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .attr("stroke-width", 3);
      })
      .on("mouseleave", function (event, d) {
        const index = parseInt(d3.select(this).attr("class").split("cell-")[1]);
        const isHighlighted = highlightedIndices.has(index);

        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .attr("stroke-width", isHighlighted ? 3 : 2);
      });

    // Cleanup function (optional, but good practice)
    return () => {
      svg.selectAll("*").interrupt(); // Stop any ongoing transitions
    };
  }, [data]); // Re-run whenever data changes

  // ============================================================
  // RENDER: Just the SVG container
  // ============================================================
  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{
        minHeight: "400px",
        backgroundColor: "#000000", // Match Vercel dark background
      }}
    />
  );
};
