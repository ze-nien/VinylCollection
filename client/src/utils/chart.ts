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
    layout: {
      padding: {
        bottom: 30, // 在底部增加空間，避免圖例貼死邊緣
      },
    },
    plugins: {
      legend: {
        display: true, // 是否顯示圖例
        position: "bottom", // 'top', 'bottom', 'left', 'right'
        align: "center", // 對齊方式: 'start', 'center', 'end'
        labels: {
          usePointStyle: true, // 將標記改為圓點
          pointStyle: "circle",
          padding: 20, // 圖例之間的間距
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.parsed}`;
          },
        },
      },
    },
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
    scales: {
      x: {
        grid: { color: "#00151499" },
        ticks: { stepSize: 4, maxRotation: 0, minRotation: 0 },
      },
    },
    layout: {
      padding: {
        bottom: 30, // 在底部增加空間，避免圖例貼死邊緣
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
      },
    },
  },
});
