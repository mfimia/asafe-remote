import * as d3 from "d3";
import { FC, useEffect, useRef, useState } from "react";
import { IPriceChartData } from "@/hooks/useCandleData";
import useDeepCompareEffect from "@/hooks/useDeepCompareEffect";

interface IPriceChartProps {
  data: IPriceChartData[]
}

const PriceChart: FC<IPriceChartProps> = ({
  data
}) => {
  const [containerWidth, setContainerWidth] = useState(960); // Default width
  const [containerHeight, setContainerHeight] = useState(500); // Default height
  const containerRef = useRef<HTMLDivElement>(null); // For the container
  const svgRef = useRef<SVGSVGElement>(null);

  const marginTop = 20
  const marginRight = 20
  const marginBottom = 50
  const marginLeft = 50

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    // Initial resize
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useDeepCompareEffect(() => {
    if (data.length > 0 && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
        .range([marginLeft, containerWidth - marginRight]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price) as number])
        .range([containerHeight - marginBottom, marginTop]);

      const line = d3.line<IPriceChartData>()
        .x(d => x(d.timestamp))
        .y(d => y(d.price))
        .curve(d3.curveMonotoneX);

      const yAxis = d3.axisLeft(y);
      svg.append("g").attr("transform", `translate(${marginLeft},0)`).call(yAxis);

      const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#bcc6f7")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("stroke-dasharray", function () {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        });

      path.transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      const tooltip = svg.append("text")
        .attr("opacity", 0)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px");

      const highlightCircle = svg.append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("stroke", "none")
        .attr("opacity", 0);

      svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(containerHeight / 40))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Price (USDT)"));

      svg.append("g")
        .attr("transform", `translate(0,${containerHeight - marginBottom})`)
        .call(d3.axisBottom(x).ticks(containerWidth / 80).tickSizeOuter(0).tickFormat(d3.timeFormat("%m/%y") as any))
        .call((g) => g.append("text")
          .attr("x", containerWidth)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("Time →"));

      svg.append("rect")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .on("mouseover", () => { tooltip.attr("opacity", 1); highlightCircle.attr("opacity", 1); })
        .on("mouseout", () => { tooltip.attr("opacity", 0); highlightCircle.attr("opacity", 0); })
        .on("mousemove", (event) => {
          const mouseDate = x.invert(d3.pointer(event, svg.node())[0]);
          const closestIndex = d3.bisector((d: IPriceChartData) => d.timestamp).left(data, mouseDate, 1);
          const closestDataPoint = data[closestIndex - 1];

          tooltip
            .attr("x", x(closestDataPoint.timestamp))
            .attr("y", y(closestDataPoint.price) - 15)
            .text(`$${closestDataPoint.price.toFixed(2)}`);

          highlightCircle
            .attr("cx", x(closestDataPoint.timestamp))
            .attr("cy", y(closestDataPoint.price));
        });
    }
  }, [data, containerHeight, containerWidth]);

  return (
    <div ref={containerRef} className='w-full h-full'>
      <svg ref={svgRef} width={containerWidth} height={containerHeight} />
    </div>
  );
};

export default PriceChart;
