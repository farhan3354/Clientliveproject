import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";

const colors = [
  "rgba(75, 192, 192, 0.8)",
  "rgba(192, 75, 192, 0.7)",
  "rgba(192, 192, 75, 0.8)",
];
const ChartComponentLong = React.memo(({ labels, data, sites }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  let visibleTicks = labels.length; // Number of visible x-axis ticks
  useEffect(() => {
    const buildChart = () => {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        // Destroy previous chart instance
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: data.map((rowData, index) => ({
            label: `${sites[index].link}`,
            data: rowData,
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
            borderWidth: 2,
            borderCapStyle: "round",
            pointBackgroundColor: colors[index % colors.length],
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
          })),
        },
        options: {
          maintainAspectRatio: false,
          aspectRatio: 3,
          scales: {
            x: {
              type: "category",
              beginAtZero: true,
              ticks: {
                font: {
                  family: "Arial",
                  size: 12,
                },
                maxTicksLimit: visibleTicks,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  family: "Arial",
                  size: 12,
                },
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  family: "Arial",
                  size: 14,
                },
              },
            },
          },
        },
      });
    };
    buildChart();
  }, [visibleTicks]);

  const saveChartAsPNG = () => {
    const canvas = chartRef.current;
    const downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.download = "chart.png";
    downloadLink.click();
  };

  const zoomIn = () => {
    if (visibleTicks > labels.length / 2) {
      visibleTicks -= 5;
      chartInstanceRef.current.options.scales.x.ticks.maxTicksLimit =
        visibleTicks - 1;

      chartInstanceRef.current.update();
    }
  };

  const zoomOut = () => {
    if (visibleTicks <= labels.length) {
      visibleTicks += 5;
      chartInstanceRef.current.options.scales.x.ticks.maxTicksLimit =
        visibleTicks - 1;
      chartInstanceRef.current.update();
    }
  };

  return (
    <div>
      <div className="chartbuttons">
        <button onClick={saveChartAsPNG}>Save as PNG</button>
        <button onClick={zoomIn}>
          <FaSearchPlus />
        </button>
        <button onClick={zoomOut}>
          <FaSearchMinus />
        </button>
      </div>
      <div>
        <canvas ref={chartRef} style={{ height: "380px", width: "600px" }} />
      </div>
    </div>
  );
});

export default ChartComponentLong;
