// components/charts/BaseChart.tsx
import { useEffect, useRef } from "react";
import { Chart, type ChartConfiguration } from "chart.js/auto";
Chart.defaults.font.family = "'Oswald', 'Noto Sans TC', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = "#001514";

export const BaseChart = ({ config }: { config: ChartConfiguration }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, [config]);

  return <canvas ref={canvasRef} />;
};
