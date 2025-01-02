import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

const paymentData = [
  { month: "Jan", advancePayment: 7500, payment: 2400 },
  { month: "Feb", advancePayment: 3000, payment: 1398 },
  { month: "Mar", advancePayment: 2000, payment: 9800 },
  { month: "Apr", advancePayment: 2780, payment: 3908 },
  { month: "May", advancePayment: 1890, payment: 4800 },
  { month: "Jun", advancePayment: 2390, payment: 3800 },
  { month: "Jul", advancePayment: 3490, payment: 4300 },
];

const RevenueChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

  // Function to format the Y-axis labels
  const formatYAxis = (value) => `${value / 1000}k`;

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-700">Revenue Collection</h2>

        <select
          className="bg-white text-neutral-700 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <BarChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => `${value / 1000}k`}
            />
            <Legend />
            <Bar dataKey="advancePayment" fill="#8884d8" barSize={20} />
            <Bar dataKey="payment" fill="#82ca9d" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueChart;
