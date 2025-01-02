import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from "../../../config";

const SpecificRange = ({ startDate, endDate, checkboxState, setCheckboxState }) => {
    const [days, setDays] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookedRoom, setBookedRoom] = useState([])
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
    const fetchBookedRoom = async () => {
        try {
            const payload = {
                "checkInDate": startDate,
                "checkOutDate": endDate,
                "CheckInTime": "10:00",
                "checkOutTime": "09:00"
            }
            const response = await axios.post(`${baseURL}/api/booking/chavil`, payload);
            setBookedRoom(response.data);
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
        fetchBookedRoom();
    }, [startDate]);
    const getMonthName = (i) => {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return monthNames[i];
    };
  const getBookingStatus = (currentDate, roomNumber) => {
    const formattedRoomNumber = roomNumber.toString().padStart(3, '0');
    const bookingList = bookings[formattedRoomNumber];
    const today = new Date(); // Get the current date

    // Extract year, month, and day
    const year = today.getFullYear(); // Returns the year (e.g., 2024)
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Returns the month (1-12), padded to 2 digits
    const day = today.getDate().toString().padStart(2, '0'); // Returns the day of the month (1-31), padded to 2 digits
    
    // Combine to create a formatted date string
    const todate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD
    
    
    const statuses = []; // Array to store statuses
    if (!bookingList) {
       statuses.push('available');
        return statuses;
    };


    for (let booking of bookingList) {
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      const toDate = new Date(todate);

      if (currentDate.getTime() === checkInDate.getTime()) statuses.push('checkIn');
      if (currentDate.getTime() === checkOutDate.getTime()) statuses.push('checkOut');
      if (currentDate > checkInDate && currentDate < checkOutDate) statuses.push('occupied');
    }
    if(statuses.length === 0) statuses.push('available');
    return statuses;
  };


    const filterDaysInRange = (startDate, endDate) => {
        if (!startDate || !endDate) return [];

        const start = new Date(startDate);
        start.setDate(start.getDate());
        const end = new Date(endDate);

        const daysArray = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            daysArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return daysArray;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const filteredDays = filterDaysInRange(startDate, endDate);

    const handleCheckboxChange = (roomNumber) => {
        setCheckboxState((prevState) => {
            if (prevState.includes(roomNumber)) {
                return prevState.filter((room) => room !== roomNumber);
            } else {
                return [...prevState, roomNumber];
            }
        });

    };

    return (
        <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
            <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                Room Status
            </h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-2 py-2 border" style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>Date</th>
                        {rooms.map((room) => (
                            <th key={room.roomNumber} className="px-2 py-2 border " style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
                                <div>Room {room.roomNumber}</div>
                                <div className="text-sm text-gray-500">{room.roomType} - Tariff - {room.tariff}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredDays.map((date) => (
                        <tr key={date}>
                            <td className="px-1 py-1 border">
                                <div className='flex flex-col'><span className="text-xs text-green-500">{date.getDate()} {getMonthName(date.getMonth())}</span>
                                    <span> {date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                </div>
                            </td>
                            {rooms.map((room) => {
                                const statuses = getBookingStatus(date, room.roomNumber);

                                return (
                                    <td
                                        key={room.roomNumber}
                                        className={`px-2 py-2 border  three-d-effect`}
                                    >
                                        {statuses.map((status, index) => {
                                            const bgColor =
                                                status === 'checkIn' ? 'bg-blue-200' :
                                                    status === 'checkOut' ? 'bg-yellow-200' :
                                                        status === 'reserved' ? 'bg-red-600' :
                                                            status === 'occupied' ? 'bg-red-200' : 'bg-green-200';

                                            let statusText = '';
                                            if(status === 'checkIn')  statusText = 'Check-In';
                                            if(status === 'checkOut')  statusText = 'Check-Out';
                                            if(status === 'reserved')  statusText = 'Reserved';
                                            if(status === 'occupied')  statusText = 'Occupied';
                                            if(status === 'available')  statusText = 'Available';

                                            return (
                                                <span key={index} className={bgColor}>
                                                    {statusText}
                                                    {index < statuses.length - 1 && <br />} {/* Add line break if multiple statuses */}
                                                </span>
                                            );
                                        })}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    <tr>
                        <td className="px-2 py-2 border font-semibold">Select</td>
                        {rooms.map((room) => {
                            const isDisabled = bookedRoom.some((item) => item.roomName === room.roomNumber.toString());
                            return (
                                <td key={room.roomNumber} className="px-2 py-2 border">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState?.includes(room.roomNumber)}
                                        disabled={isDisabled}
                                        onChange={() => handleCheckboxChange(room.roomNumber)}
                                    />
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SpecificRange;