import * as d3 from "d3";
import { FC, useEffect, useRef } from "react";
import { IPriceChartData } from "@/hooks/useCandleData";

interface IPriceChartProps {
  data?: IPriceChartData[]
  symbol?: string;
  timeframe?: string;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

const PriceChart: FC<IPriceChartProps> = ({
  data = [],
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 50,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (data.length > 0 && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
        .range([marginLeft, width - marginRight]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price) as number])
        .range([height - marginBottom, marginTop])

      const line = d3.line<IPriceChartData>()
        .x(d => x(d.timestamp))
        .y(d => y(d.price))
        .curve(d3.curveMonotoneX);

      const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%m/%y") as any);
      svg.append("g").attr("transform", `translate(0,${height - marginBottom})`).call(xAxis);

      const yAxis = d3.axisLeft(y);
      svg.append("g").attr("transform", `translate(${marginLeft},0)`).call(yAxis);

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

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
        .call(d3.axisLeft(y).ticks(height / 40))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Price (USDT)"));

      svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .call((g) => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("Time →"));

      svg.append("rect")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
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
  }, [data, height, marginBottom, marginLeft, marginRight, marginTop, width]);

  if (!data.length) {
    return <div>Loading data...</div>;
  }

  return <svg ref={svgRef} width={width} height={height} />;
};

export default PriceChart;
