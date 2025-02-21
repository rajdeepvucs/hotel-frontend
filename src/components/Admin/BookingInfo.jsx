
import Header from '../common/Header'
import { baseURL } from '../../../config';
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import apiClient from '../../api/apiClient';

const BookingInfo = () => {

  const [data, setData] = useState([]);


  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${baseURL}/api/total_monthlybooking`); // Replace with actual API endpoint
        setData(response.data.result);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  
    console.log(data)

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title={"Monthly Booking"}/>
      <motion.div 
      className="container mx-auto mt-8 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-2xl font-bold text-center mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      Monthly Booking Info
      </motion.h1>
      <motion.div 
        className="overflow-x-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              
             
                <th  className="border border-gray-300 px-4 py-2 text-left">
                 BookingId
                </th>
                <th  className="border border-gray-300 px-4 py-2 text-left">
                No.of.Rooms
                </th>
           
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <motion.tr 
                  key={index} 
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="border border-gray-300 px-4 py-2">{row.bookingId}</td>
               
                    <td  className="border border-gray-300 px-4 py-2">
                      {row.totalRooms}
                    </td>
                
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default BookingInfo;
