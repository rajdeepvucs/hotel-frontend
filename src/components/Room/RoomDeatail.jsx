import { motion } from "framer-motion";
import { Edit, Search, Trash2, CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../config";

import * as React from "react";
import Header from "../common/Header";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const RoomDetail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [room, setRoom] = useState([]);

  const navigate = useNavigate();

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/room/getRoom`);

      setRoom(response.data);
    } catch (error) {
      console.error("Error fetching Room:", error);
    }
  };
  useEffect(() => {
    fetchRoom();
  }, []);

  const handleDelete = async (room) => {
    try {
      // Assuming your API endpoint for changing status looks like this
      const response = await axios.post(
        `${baseURL}/api/room/deleteRoom/${room}`
      );

      if (response.status === 200) {
        toast.success("Room status updated successfully!");
        fetchRoom();
        console.log(response.data);
      } else {
        toast.error("Failed to update Room status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating the booking status.");
    }
  };

  const handleEditClick = (roomNo) => {
    navigate("/roomedit", { state: { roomNo } });
  };

  const handleSearch = (e) => {};
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [roomPerPage] = useState(10);
  // Calculate pagination
  const indexOfLastProduct = currentPage * roomPerPage;
  const indexOfFirstProduct = indexOfLastProduct - roomPerPage;
  const currentRoom = room.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(room.length / roomPerPage);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Room Information" />
      <motion.div
        className="bg-gray-300 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Room </h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Search ..."
              className="bg-gray-100 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-900"
              size={18}
            />
          </div>
        </div>

        <div>
          <ToastContainer />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Tariff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Features
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {currentRoom?.map((booking) => (
                <motion.tr
                  key={booking.roomNumber}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">
                    {booking.roomType}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.roomCapacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.tariff}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.features.join("-")}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.status ? "Available" : "Unavailable"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    <button
                      className="text-indigo-400 hover:text-indigo-800 mr-2"
                      onClick={() => handleEditClick(booking.roomNumber)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(booking.roomNumber)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 text-gray-100 py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-gray-900">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-700 text-gray-100 py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default RoomDetail;
