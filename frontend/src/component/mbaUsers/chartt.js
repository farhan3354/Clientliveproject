import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";

const ChartComponent = ({ labels, data }) => {
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
          datasets: [
            {
              label: "Hits",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              borderCapStyle: "round",
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.4, // Adjust the tension value to control the curvature
            },
          ],
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
  }, [labels, data, visibleTicks]);

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
        <button className="button-cln" onClick={saveChartAsPNG}>
          Save as PNG
        </button>
        <button
          className="button-cln"
          style={{ background: "#6c757d", border: "1px solid #6c757d" }}
          onClick={zoomIn}
        >
          <FaSearchPlus />
        </button>
        <button
          className="button-cln"
          style={{ background: "#6c757d", border: "1px solid #6c757d" }}
          onClick={zoomOut}
        >
          <FaSearchMinus />
        </button>
      </div>
      <div>
        <canvas ref={chartRef} style={{ height: "380px", width: "600px" }} />
      </div>
    </div>
  );
};

export default ChartComponent;
