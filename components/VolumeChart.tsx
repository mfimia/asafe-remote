import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { IVolumeData } from '@/hooks/useCandleData';
import { TradingPairSymbol } from '@/types';

interface IVolumeChartProps {
  data: IVolumeData[];
  symbol: TradingPairSymbol
}

const VolumeChart: FC<IVolumeChartProps> = ({ data, symbol }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 960;
  const height = 500;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 50;
  const marginLeft = 60;

  useEffect(() => {
    const sortedData = data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    d3.select(svgRef.current).selectAll("*").remove();

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.volume) as number])
      .range([height - marginBottom, marginTop]);

    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3.select(svgRef.current);

    const yAxis = d3.axisLeft(y);
    svg.append("g").attr("transform", `translate(${marginLeft},0)`).call(yAxis);

    const tooltip = svg.append("text")
      .attr("opacity", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px");

    const highlightCircle = svg.append("circle")
      .attr("r", 5)
      .attr("fill", "black")
      .attr("stroke", "none")
      .attr("opacity", 0);

    svg.selectAll("rect")
      .data(sortedData)
      .enter().append("rect")
      .attr("fill", "steelblue")
      .attr("x", d => x(d.timestamp))
      .attr("y", d => y(d.volume))
      .attr("width", Math.max(0, (width - marginLeft - marginRight) / sortedData.length - 1))
      .attr("height", d => height - marginBottom - y(d.volume));

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(`↑ Volume (${symbol.split('USDT')[0]})`));

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.timeFormat("%m/%y") as any))
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
        const closestIndex = d3.bisector((d: IVolumeData) => d.timestamp).left(data, mouseDate, 1);
        const closestDataPoint = data[closestIndex - 1];

        tooltip
          .attr("x", x(closestDataPoint.timestamp))
          .attr("y", y(closestDataPoint.volume) - 15)
          .text(`${closestDataPoint.volume.toFixed(2)}\n${closestDataPoint.timestamp.toDateString()}`);

        highlightCircle
          .attr("cx", x(closestDataPoint.timestamp))
          .attr("cy", y(closestDataPoint.volume));
      });

  }, [data, symbol]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

export default VolumeChart;
