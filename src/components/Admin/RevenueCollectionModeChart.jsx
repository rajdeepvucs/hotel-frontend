import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import apiClient from "../../api/apiClient";
import { baseURL } from "../../../config";

const RevenueCollectionModeChart = () => {
  const [chartData, setChartData] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const data= {
  //   "success": true,
  //   "data": [
  //     {
  //       "month": "2024-12",
  //       "paymentModes": [
  //         { "paymentMode": "cash", "totalCollected": 33535 },
  //         { "paymentMode": "credit card", "totalCollected": 20000 },
  //         { "paymentMode": "upi", "totalCollected": 15000 }
  //       ]
  //     },
  //     {
  //       "month": "2024-11",
  //       "paymentModes": [
  //         { "paymentMode": "cash", "totalCollected": 15000 },
  //         { "paymentMode": "upi", "totalCollected": 10000 },
  //         { "paymentMode": "credit card", "totalCollected": 18000 }
  //       ]
  //     }
  //   ]
  // }
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${baseURL}/api/monthly_collections_mode`); // Replace with your actual API endpoint

        const transformedData = [];
        const uniquePaymentModes = new Set();

        response.data.data.forEach((item) => {
          const monthData = { month: item.month };
          item.paymentModes.forEach((mode) => {
            monthData[mode.paymentMode] = mode.totalCollected;
            uniquePaymentModes.add(mode.paymentMode);
          });
          transformedData.push(monthData);
        });

        setChartData(transformedData);
        setPaymentModes(Array.from(uniquePaymentModes)); // Get unique payment modes
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format the Y-axis labels
  const formatYAxis = (value) => `${value / 1000}k`;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-neutral-700 mb-6">Monthly Collection by Payment Modes</h2>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => `${value / 1000}k`}
            />
            <Legend />
            {paymentModes.map((mode, index) => (
              <Bar
                key={mode}
                dataKey={mode}
                fill={["#8884d8", "#82ca9d", "#ffc658", "#d45087"][index % 4]} // Cycle through colors
                barSize={20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueCollectionModeChart;
