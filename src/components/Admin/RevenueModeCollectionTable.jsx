import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../common/Header";
import RevenueCollectionModeChart from "./RevenueCollectionModeChart";
import { baseURL } from "../../../config";
const RevenueModeCollectionTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/monthly_collections_mode`); // Replace with your API endpoint
        const enrichedData = response.data.data.map((monthData) => {
            const totalSum = monthData.paymentModes.reduce((sum, mode) => sum + mode.totalCollected, 0);
            return { ...monthData, totalSum };
          });
        setTableData(enrichedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
    <Header title="RevenueCollectionMode " />

    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-4">
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-neutral-700 mb-6">Monthly Revenue Details</h2>
      
      <motion.table
        className="w-full border-collapse border border-gray-200 text-neutral-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">Month</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Payment Mode</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((monthData, index) => (
            <motion.tr
              key={monthData.month}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-gray-50"
            >
              <td className="border border-gray-200 px-4 py-2" >
                {monthData.month}
              </td>
              {monthData.paymentModes.map((modeData, i) => (
                <motion.tr
                  key={`${monthData.month}-${modeData.paymentMode}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + i * 0.05 }}
                  className="hover:bg-gray-50"
                >
                
                  <td className="border border-gray-200 px-4 py-2">{modeData.paymentMode}</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                  ₹ {modeData.totalCollected.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
              <td className="border border-gray-200 px-4 py-2 text-right font-semibold">
              ₹ {monthData.totalSum.toLocaleString()} 
                </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
    <div><RevenueCollectionModeChart /></div>
    </div>
    </main>
    </div>
  );
};

export default RevenueModeCollectionTable;
