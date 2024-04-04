import React, { FC, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { IVolumeData } from '@/hooks/useCandleData';
import { TradingPairSymbol } from '@/types';
import { useDeepCompareEffect } from '@/hooks/useDeepCompareEffect';

interface IVolumeChartProps {
  data: IVolumeData[];
  symbol: TradingPairSymbol
}

const VolumeChart: FC<IVolumeChartProps> = ({ data, symbol }) => {
  const [containerWidth, setContainerWidth] = useState(960); // Default width
  const [containerHeight, setContainerHeight] = useState(500); // Default height
  const containerRef = useRef<HTMLDivElement>(null); // For the container
  const svgRef = useRef<SVGSVGElement>(null);

  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 50;
  const marginLeft = 60;
  const transitionDuration = 1500

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
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const sortedData = data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const bars = svg.selectAll("rect")
      .data(sortedData, (d: any) => d.timestamp);

    const t = d3.transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
      .range([marginLeft, containerWidth - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.volume) as number])
      .range([containerHeight - marginBottom, marginTop]);

    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x)

    bars.enter().append("rect")
      .attr("fill", "#bcc6f7")
      .attr("x", d => x(d.timestamp))
      .attr("width", Math.max(1, (containerWidth - marginLeft - marginRight) / sortedData.length - 1))
      .attr("y", containerHeight - marginBottom)
      .attr("height", 0)
      .transition(t)
      .attr("y", d => y(d.volume))
      .attr("height", d => containerHeight - marginBottom - y(d.volume));

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
      .call(yAxis.ticks(containerHeight / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(`↑ Volume (${symbol.split('USDT')[0]})`));

    svg.append("g")
      .attr("transform", `translate(0,${containerHeight - marginBottom})`)
      .call(xAxis.ticks(containerWidth / 80).tickSizeOuter(0).tickFormat(d3.timeFormat("%m/%y") as any))
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
  }, [data, containerWidth, containerHeight]);

  return (
    <div ref={containerRef} className='w-full h-full'>
      <svg ref={svgRef} width={containerWidth} height={containerHeight} />
    </div>
  );
};

export default VolumeChart;
