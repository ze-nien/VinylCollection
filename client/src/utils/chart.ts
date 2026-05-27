// components/charts/chartConfigs.ts
import type { ChartConfiguration } from "chart.js/auto";

// 年代圖表配置生成器
export const getEraChartConfig = (
  eraData: { era: string; count: number }[],
): ChartConfiguration => ({
  type: "doughnut",
  data: {
    labels: eraData.map((d) => d.era),
    datasets: [
      {
        data: eraData.map((d) => Number(d.count)),
        backgroundColor: [
          "#001514ff",
          "#001514cc",
          "#00151499",
          "#00151466",
          "#00151433",
        ],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  },
});

// 曲風圖表配置生成器
export const getGenreChartConfig = (
  genreData: { genreName: string; count: number }[],
): ChartConfiguration => ({
  type: "bar",
  data: {
    labels: genreData.map((d) => d.genreName),
    datasets: [
      {
        data: genreData.map((d) => Number(d.count)),
        backgroundColor: "#001514",
        borderRadius: 2,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { grid: { color: "#001514" } } },
  },
});
