import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../../../config";


function RoomStatusTable() {
    const [roomStatusData, setRoomStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dates, setDates] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRoomStatus = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/booking/roomstatus`);
      const { data } = response.data;

      const uniqueDates = [...new Set(data.map((item) => item.day))];
      const uniqueRooms = [...new Set(data.map((item) => item.roomno))];

      setDates(uniqueDates);
      setRooms(uniqueRooms);

      const structuredData = uniqueDates.map((date) => ({
        date,
        rooms: uniqueRooms.map((room) => {
          const roomData = data.find(
            (item) => item.day === date && item.roomno === room
          );
          return roomData ? roomData.booking_status : "Available";
        }),
      }));

      setRoomStatusData(structuredData);
    } catch (error) {
      setError("Failed to fetch room status data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomStatus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-gray-100">
    <div
      className="overflow-x-auto"
      style={{ maxHeight: "500px", overflowY: "auto" }}
    >
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead
          className="bg-gray-200"
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 2,
          }}
        >
          <tr>
            <th className="px-4 py-2 border">Date</th>
            {rooms.map((room) => (
              <th key={room} className="px-4 py-2 border">
                Room {room}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roomStatusData.map((row) => (
            <tr key={row.date} className="bg-white hover:bg-gray-100">
              <td className="px-4 py-2 border">
                {new Date(row.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              {row.rooms.map((status, index) => (
                <td
                  key={index}
                  className={`px-4 py-2 border ${
                    status === "Occupied"
                      ? "bg-red-200"
                      : status === "Reserved"
                      ? "bg-yellow-200"
                      : "bg-green-200"
                  }`}
                >
                  {status}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default RoomStatusTable