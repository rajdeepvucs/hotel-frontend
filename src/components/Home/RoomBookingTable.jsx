import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from "../../../config";

const RoomBookingTable = () => {
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  
    const getMonthName = (i) => {
      const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
    return monthNames[i];
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/booking/check`);
      setBookings(response.data);
    } catch (error) {
      setError('Failed to fetch booking data');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchRooms = async () => {
        try {
        const response = await axios.get(`${baseURL}/api/room/getRooms`);
        setRooms(response.data);
        } catch (error) {
        setError('Failed to fetch room data');
        } finally {
        setLoading(false);
        }
    };
    fetchRooms();
    fetchBookings();
  }, []);

  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    setDays(daysArray);
  }, [month, year]);


  const getBookingStatus = (day, roomNumber) => {
      const formattedRoomNumber = roomNumber.toString().padStart(3, '0');
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const bookingList = bookings[formattedRoomNumber];

    if (!bookingList) return ['available'];

    const currentDate = new Date(dateStr);
    const statuses = [];
      for (let booking of bookingList) {
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      if (currentDate.getTime() === checkInDate.getTime()) statuses.push('checkIn');
        if (currentDate.getTime() === checkOutDate.getTime()) statuses.push('checkOut');
       
      if (currentDate > checkInDate && currentDate < checkOutDate) statuses.push('booked');
   }
      return statuses.length > 0 ? statuses : ['available'];
  };


  const handleMonthChange = (e) => setMonth(parseInt(e.target.value));
    const handleYearChange = (e) => setYear(parseInt(e.target.value));

    const handleDaySelect = (e) => {
    setSelectedDay(e.target.value);
    };

  if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

  const filteredDays = selectedDay ? [parseInt(selectedDay)] : days;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between mb-4">
          <label>
            Year:
            <select value={year} onChange={handleYearChange} className="ml-2 border border-gray-300 p-2">
              {[ 2024,2025,2026].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </label>
          <label>
            Month:
            <select value={month} onChange={handleMonthChange} className="ml-2 border border-gray-300 p-2">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </label>
           <label>
            Date:
            <select value={selectedDay} onChange={handleDaySelect} className="ml-2 border border-gray-300 p-2">
                <option value="">All Days</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border" style={{position:"sticky",top:0,backgroundColor:"#fff",zIndex:1}}>Day</th>
                {rooms.map((room) => (
                  <th key={room.roomNumber} className="px-4 py-2 border">
                    <div>Room {room.roomNumber}</div>
                     <div className="text-sm text-gray-500">{room.roomType} - Tariff - {room.tariff}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
               {filteredDays.map((day) => {
    const displayDate = new Date(year, month, day);
    const formattedDate = displayDate.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });

    return (
      <tr key={day}>
        <td className="px-1 py-1 border">
          <span className="text-xs text-green-500">{formattedDate}</span>
        </td>
          {rooms.map((room) => {
              const statuses = getBookingStatus(day, room.roomNumber);
              return (
                  <td key={room.roomNumber} className="px-4 py-2 border">
                      {statuses.map((status, index) => {
                           const bgColor =
                              status === 'checkIn'
                                  ? 'bg-blue-200'
                                  : status === 'checkOut'
                                  ? 'bg-yellow-200'
                                  : status === 'reserved'
                                  ? 'bg-red-900'
                                  : status === 'booked'
                                  ? 'bg-red-200'
                                  : 'bg-green-200';

                        return (
                            <div key={index} className={`${bgColor} text-center`}>
                               {status === 'checkIn'
                                  ? 'Check-In'
                                  : status === 'checkOut'
                                  ? 'Check-Out'
                                  : status === 'reserved'
                                  ? 'Reserved'
                                  : status === 'booked'
                                  ? 'Occupied'
                                  : 'Available'}
                            </div>
                        );
                      })}
                      
                  </td>
              );
          })}
        </tr>
    );
})}

            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RoomBookingTable;