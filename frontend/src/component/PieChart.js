import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChartComponent = ({ labels, values }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const buildChart = () => {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        // Destroy previous chart instance
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(22, 122, 132, 0.8)",
                "rgba(42, 152, 112, 0.8)",
                "rgba(152, 52, 12, 0.8)",
                "rgba(152, 52, 222, 0.8)",
                "rgba(212, 199, 222, 0.8)",
              ],
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
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
  }, [labels, values]);

  return (
    <div>
      <canvas ref={chartRef} style={{ height: "380px", width: "600px" }} />
    </div>
  );
};

export default PieChartComponent;
