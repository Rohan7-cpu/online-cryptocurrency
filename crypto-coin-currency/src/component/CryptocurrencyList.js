import React, { useState, useEffect } from "react";
// Import chart components (same as before)
import { Line, Bar, Radar } from "react-chartjs-2";
import Select from "react-select";

// Import and Register ChartJS components (same as before)
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registering required ChartJS components
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

// Chart types available for selection 
const chartTypes = [
  { value: "line", label: "📈 Line" },
  { value: "bar", label: "📊 Bar" },
  { value: "radar", label: "🕸️ Radar" },
];

// Time range options for the chart 
const timeRanges = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
];

// --- STYLED COMPONENT ---
const CryptoChart = ({ data, selectedCurrencies }) => {
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);
  const [chartData, setChartData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[4].value);

  // Function to generate a random color, now with a transparent version for fill
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    // Generate a slightly brighter color to ensure visibility on dark background
    // By only picking from the top half of the spectrum (A-F for the first digit)
    const brightLetters = "9ABCDEF";
    color += brightLetters[Math.floor(Math.random() * brightLetters.length)];

    for (let i = 0; i < 5; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    
    // Return a base color and an RGBA version for background fill/hover
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return {
      base: color,
      fill: `rgba(${r}, ${g}, ${b}, 0.2)`, // Slightly increased opacity for visibility
    };
  };

  // Memoize random colors for stability across renders
  const [currencyColors, setCurrencyColors] = useState({});
useEffect(() => {
  const newColors = {};
  selectedCurrencies.forEach(currency => {
      if (!currencyColors[currency]) {
          newColors[currency] = getRandomColor();
      } else {
          newColors[currency] = currencyColors[currency];
      }
  });
  setCurrencyColors(prev => ({ ...prev, ...newColors }));
}, [selectedCurrencies]);

  
  // useEffect to update chart data (logic is identical)
  useEffect(() => {
    if (data && selectedCurrencies.length > 0) {
      const datasets = selectedCurrencies.map((currency, index) => {
        const currencyData = data[currency] || {};
        const colors = currencyColors[currency] || getRandomColor();

        return {
          label: currency,
          data: generateData(selectedTimeRange, currencyData),
          borderColor: colors.base, // BRIGHTER BORDER COLOR
          backgroundColor: selectedChartType.value === "bar" ? colors.base : colors.fill, // Bar background is solid base color
          pointBackgroundColor: colors.base,
          pointBorderColor: '#1f2937', // Darker point border for contrast
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.base,
          borderWidth: 3, // Thicker line for visibility
          fill: selectedChartType.value !== "bar" ? true : false,
          yAxisID: `y-axis-${index}`,
          tension: 0.4,
        };
      });

      setChartData({
        labels: generateLabels(selectedTimeRange),
        datasets,
      });
    } else {
        setChartData(null);
    }
  }, [data, selectedCurrencies, selectedTimeRange, selectedChartType, currencyColors]);

  // Handlers (logic is identical)
  const handleChartTypeChange = (selectedOption) => {
    setSelectedChartType(selectedOption || chartTypes[0]);
  };
  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };
  
  // Function to generate labels for the x-axis (logic is identical)
  const generateLabels = (timeRange) => {
    switch (timeRange) {
        case "1D": return ["00:00", "06:00", "12:00", "18:00"];
        case "1W": return ["1D", "2D", "3D", "4D", "5D", "6D", "7D"];
        case "1M": return Array.from({ length: 31 }, (_, i) => `${i + 1}D`);
        case "3M": return ["Jan", "Feb", "Mar"];
        case "6M": return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        case "1Y": return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        default: return [];
    }
  };

  // Function to extract data values (logic is identical)
  const generateData = (timeRange, data) => {
    const keys = {
      "1D": ["hour0", "hour6", "hour12", "hour18"],
      "1W": ["day1", "day2", "day3", "day4", "day5", "day6", "day7"],
      "1M": Array.from({ length: 31 }, (_, i) => `day${i + 1}`),
      "3M": ["Jan", "Feb", "Mar"],
      "6M": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "1Y": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    };
    const selectedKeys = keys[timeRange];
    return selectedKeys.map((key) => (data[key] !== undefined ? data[key] : 0));
  };
  
  // --- VISUAL IMPROVEMENTS: Chart Options (Dark Theme, Enhanced Visibility) ---
  const FONT_COLOR = '#e2e8f0'; // Light text for high contrast on dark background
  const GRID_COLOR = 'rgba(255, 255, 255, 0.08)'; // Very subtle grid lines
  const BORDER_COLOR = 'rgba(255, 255, 255, 0.3)'; // Slightly more visible border

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: 10,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { weight: "600", color: FONT_COLOR, size: 12 },
          color: FONT_COLOR, // Ensure legend text is bright
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)', // Very dark background for tooltip
        titleFont: { weight: 'bold', size: 14 },
        bodyFont: { size: 12 },
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        callbacks: {
          label: function (tooltipItem) {
            const datasetLabel = tooltipItem.dataset.label || "";
            return `${datasetLabel}: $${(tooltipItem.raw / 1000).toFixed(2)}K`;
          },
        },
      },
      title: {
        display: true,
        text: 'Cryptocurrency Price Trend Analysis',
        color: FONT_COLOR, // Ensure title is bright
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 20 }
      }
    },
    // Scales configuration
    scales: selectedChartType.value === 'radar' ? {
        r: { // Radar specific scale
            angleLines: { color: GRID_COLOR },
            grid: { color: GRID_COLOR },
            pointLabels: { color: FONT_COLOR, font: { size: 12, weight: 'bold' } }, // BRIGHT RADAR LABELS
            ticks: { display: false, color: FONT_COLOR, backdropColor: 'transparent' }, // Ensure ticks don't block visibility
        }
    } : {
      x: {
        grid: { color: GRID_COLOR, borderColor: BORDER_COLOR, drawTicks: false }, // Use subtle grid
        ticks: { color: FONT_COLOR, font: { weight: "600" } }, // BRIGHT X-AXIS LABELS
        title: {
          display: true,
          text: "Time Range",
          color: FONT_COLOR, // BRIGHT X-AXIS TITLE
          font: { weight: "bold", size: 14 },
        },
      },
      // Dynamically generated Y-axes
      ...Object.fromEntries(selectedCurrencies.map((currency, index) => [
          `y-axis-${index}`, {
              id: `y-axis-${index}`,
              position: index === 0 ? "left" : "right",
              grid: { 
                  drawOnChartArea: index === 0, // Only primary Y-axis shows grid lines
                  color: index === 0 ? GRID_COLOR : 'transparent',
                  borderColor: BORDER_COLOR
              },
              ticks: {
                  callback: (value) => `$${(value / 1000).toFixed(1)}K`,
                  color: currencyColors[currency]?.base || FONT_COLOR, // Keep this bright for distinction
                  font: { weight: "bold" },
              },
              title: {
                  display: true,
                  text: currency + ' Price',
                  color: currencyColors[currency]?.base || FONT_COLOR,
                  font: { weight: "bold", size: 12 },
                  padding: { bottom: 10, top: 10 }
              },
              ...(index !== 0 && { offset: true }),
          }
      ]))
    },
  };

  // Function to render the chart (logic is identical)
  const renderChart = () => {
    if (!chartData) return null;
    switch (selectedChartType.value) {
      case "bar":
        return <Bar data={chartData} options={options} />;
      case "radar":
        return <Radar data={chartData} options={options} />;
      case "line":
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  // --- VISUAL IMPROVEMENTS: Tailwind Classes (Unchanged from previous version) ---
  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-700"> 
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Time Range Buttons */}
        <div className="flex gap-2 p-1 bg-gray-700 rounded-lg shadow-inner flex-wrap justify-center sm:justify-start">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value)}
              className={`
                py-1 px-3 text-sm font-semibold rounded-md transition-all duration-200
                ${selectedTimeRange === range.value
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-600 hover:text-white"
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
        
        {/* Chart Type Dropdown */}
        <div className="w-full sm:w-48">
          <Select
            options={chartTypes}
            onChange={handleChartTypeChange}
            value={selectedChartType}
            classNamePrefix="chart-select"
            // Custom styling for react-select components
            styles={{
                control: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937', // Dark gray background
                    borderColor: '#374151', // Darker border
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#4f46e5' }, // Hover primary color
                }),
                singleValue: (base) => ({
                    ...base,
                    color: '#e2e8f0', // Light text
                    fontWeight: 'bold',
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937', // Dark background for menu
                    zIndex: 100,
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#374151' : '#1f2937',
                    color: state.isSelected ? '#a5b4fc' : '#e2e8f0',
                }),
            }}
          />
        </div>
      </div>

      {/* Render the Chart */}
      <div className="chart-container h-80 w-full p-4 bg-gray-900 rounded-lg shadow-inner">
        {chartData ? renderChart() : (
            <div className="flex items-center justify-center h-full text-gray-400 font-semibold">
                Select currencies to view chart data.
            </div>
        )}
      </div>
    </div>
  );
};

export default CryptoChart;