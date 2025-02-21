import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import apiClient from "../../api/apiClient";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { baseURL } from "../../../config";
import Header from "../common/Header";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalVisitorChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${baseURL}/api/getYearMonthWiseTotals`); // Replace with your API URL
        setChartData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Prepare chart data
  const data = {
    labels: chartData.map((item) => `${item.year}-${String(item.month).padStart(2, '0')}`),
    datasets: [
      {
        label: "Total Adults",
        data: chartData.map((item) => item.totalAdults || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 30, // Increase bar thickness
      },
      {
        label: "Total Minors",
        data: chartData.map((item) => item.totalMinors || 0),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        barThickness: 30, // Increase bar thickness
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Year and Month-wise Totals Visitor" },
    },
    scales: {
      x: { title: { display: true, text: "Month" } },
      y: { title: { display: true, text: "Number of People" }, beginAtZero: true },
    },
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
    <Header title="Total Visitor" />
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <Bar data={data} options={options} />
      </main>
    </div>
  );
};

export default TotalVisitorChart;
