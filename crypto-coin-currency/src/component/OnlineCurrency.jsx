import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Coin({ coin }) {
  const [chartData, setChartData] = useState(null);
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    if (coin && coin.length > 0) {
      
      const topCoins = ["Bitcoin", "Ethereum", "Tether", "Ripple", "BNB"];

      // Filter top coins
      const filtered = coin.filter((c) => topCoins.includes(c.name));

      const labels = filtered.map((c) => c.name);
      const data = filtered.map((c) => c.total_volume);
      const colors = filtered.map(() => getRandomColor());
      const total = data.reduce((acc, val) => acc + val, 0);

      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
          },
        ],
      });

      setTotalVolume(total);
    } else {
      setChartData(null);
      setTotalVolume(0);
    }
  }, [coin]);

  // Generate random colors for slices
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
  <div className="flex flex-col items-center w-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 shadow-lg">
    {chartData ? (
      <>
        {/* ======== Header Row (Portfolio + Total) ======== */}
        <div className="flex justify-between w-full max-w-md px-6 mb-2">
          <span className="font-semibold text-gray-800 text-sm">Portfolio</span>
          <span className="font-bold text-gray-800 text-sm">
            Total: ${totalVolume.toLocaleString()}
          </span>
        </div>

        {/* ======== Doughnut Chart ======== */}
        <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-56">
          <Doughnut
            data={chartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const val = tooltipItem.raw || 0;
                      return `${tooltipItem.label}: $${val.toLocaleString()}`;
                    },
                  },
                },
              },
            }}
          />
        </div>

        {/* ======== Custom Legend ======== */}
        <div className="flex flex-wrap justify-center mt-6 gap-3">
          {chartData.labels.map((label, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer"
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: chartData.datasets[0].backgroundColor[i],
                }}
              />
              <span className="text-gray-700 font-medium text-sm">{label}</span>
            </div>
          ))}
        </div>
      </>
    ) : (
      <div className="text-gray-400 font-medium text-center mt-10">
        No coin data available
      </div>
    )}
  </div>
);
}