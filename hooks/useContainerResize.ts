import { useEffect, useRef, useState } from "react";

export const useContainerResize = (initWidth: number, initHeight: number) => {
  const [containerWidth, setContainerWidth] = useState(initWidth)
  const [containerHeight, setContainerHeight] = useState(initHeight)
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { containerWidth, containerHeight, containerRef }
}