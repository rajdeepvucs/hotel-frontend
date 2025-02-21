// import React, { useState, useEffect } from 'react';
// import apiClient from '../../api/apiClient';
// import { baseURL } from "../../../config";
// import { useNavigate } from 'react-router-dom';
// import Header from "../common/Header";

// const RoomBookingTable = () => {
//     const [days, setDays] = useState([]);
//     const [month, setMonth] = useState(new Date().getMonth());
//     const [year, setYear] = useState(new Date().getFullYear());
//     const [rooms, setRooms] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [bookings, setBookings] = useState([]);
//     const [bookingCounts, setBookingCounts] = useState({});
//     const [selectedDay, setSelectedDay] = useState('');
//     const navigate = useNavigate();
//     const [allAvailableData, setAllAvailableData] = useState([]); // State to store all available data
//     const [toggledCells, setToggledCells] = useState({}); // State to track toggled cells

//     const getMonthName = (i) => {
//         const monthNames = [
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//         ];
//         return monthNames[i];
//     };

//     const fetchBookings = async () => {
//         try {
//             const response = await apiClient.get(`${baseURL}/api/booking/check`);
//             setBookings(response.data);
//         } catch (error) {
//             setError('Failed to fetch booking data');
//         }
//     };
//       const fetchBookingCounts = async () => {
//          try {
//            const response = await apiClient.get(
//              `${baseURL}/api/booking/getBookingCountsByRoom`,
//               {
//                 params: {
//                    year: year,
//                   month: month + 1,

//                 },
//               }
//           );

//           // Convert the array to an object with roomNo as the key
//            const countsObject = response.data.reduce((acc, curr) => {
//               acc[curr.roomno] = curr.bookingCount;
//              return acc;
//           }, {});

//             setBookingCounts(countsObject);
//         } catch (error) {
//           setError('Failed to fetch booking counts');
//           console.error("Error fetching booking counts:", error);
//         }
//     };

//     useEffect(() => {
//         const fetchRooms = async () => {
//             try {
//                 const response = await apiClient.get(`${baseURL}/api/room/getRooms`);
//                 setRooms(response.data);
//             } catch (error) {
//                 setError('Failed to fetch room data');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRooms();
//         fetchBookings();
//         fetchBookingCounts();
//     }, [month, year]);

//     useEffect(() => {
//         const daysInMonth = new Date(year, month + 1, 0).getDate();
//         const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//         setDays(daysArray);
//     }, [month, year]);


//     const getBookingStatus = (day, roomNumber) => {
//         const formattedRoomNumber = roomNumber.toString().padStart(3, '0');
//         const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//         const bookingList = bookings[formattedRoomNumber];

//         if (!bookingList) return ['available'];

//         const currentDate = new Date(dateStr);
//         const statuses = [];
//         for (let booking of bookingList) {
//             const checkInDate = new Date(booking.checkInDate);
//             const checkOutDate = new Date(booking.checkOutDate);
//             if (currentDate.getTime() === checkInDate.getTime()) statuses.push({status: 'checkIn', bookingId: booking.bookingId} );
//             if (currentDate.getTime() === checkOutDate.getTime()) statuses.push({status:'checkOut',bookingId: booking.bookingId});

//             if (currentDate > checkInDate && currentDate < checkOutDate) statuses.push({status:'booked',bookingId: booking.bookingId});
//         }
//         return statuses.length > 0 ? statuses : [{status:'available'}];
//     };

//     const handleCellClick = (status, bookingId, room, day) => {
//         console.log("statuses....", status);
//         const cellKey = `${year}-${month}-${day}-${room.roomNumber}`;

//         if (status === 'checkIn' || status === 'checkOut') {
//             if (bookingId) {
//                 navigate('/boadersdetails', {state: {bookingId}});
//                 return;
//             }
//         }

//         if (status === 'available' || toggledCells[cellKey] === 'selected') {
//             const newStatus = toggledCells[cellKey] === 'selected' ? 'available' : 'selected'; // Toggle status

//             setToggledCells(prevToggledCells => ({
//                 ...prevToggledCells,
//                 [cellKey]: newStatus
//             }));

//             // Update allAvailableData
//             const date = new Date(year, month, day);
//             const bookingData = {
//                 roomNumber: room.roomNumber,
//                 roomType: room.roomType,
//                 tariff: room.tariff,
//                 date: date.toISOString(),
//                 status: newStatus // Include the new status in the bookingData
//             };

//             setAllAvailableData(prevData => {
//                 if (newStatus === 'selected') {
//                     // Add to array
//                     return [...prevData, bookingData];
//                 } else {
//                     // Remove from array
//                     return prevData.filter(
//                         item =>
//                             !(
//                                 item.roomNumber === room.roomNumber &&
//                                 item.date === bookingData.date
//                             )
//                     );
//                 }
//             });
//             console.log("All Available Data:", allAvailableData);
//         }
//     };


//     useEffect(() => {
//         // Log allAvailableData whenever it changes
//         console.log("Updated All Available Data:", allAvailableData);
//     }, [allAvailableData]);

//     const handleMonthChange = (e) => setMonth(parseInt(e.target.value));
//     const handleYearChange = (e) => setYear(parseInt(e.target.value));

//     const handleDaySelect = (e) => {
//         setSelectedDay(e.target.value);
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     const filteredDays = selectedDay ? [parseInt(selectedDay)] : days;

//     return (
//         <div className="flex-1 overflow-auto relative z-10">
//            <Header title="Monthly Booking Calender" />
//            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
//                 {rooms && rooms.length > 0 ? (
//                     <>
//                         <div className="flex justify-between mb-4">
//                             <label>
//                                 Year:
//                                 <select value={year} onChange={handleYearChange} className="ml-2 border border-gray-300 p-2">
//                                     {[2024, 2025, 2026].map((yr) => (
//                                         <option key={yr} value={yr}>{yr}</option>
//                                     ))}
//                                 </select>
//                             </label>
//                             <label>
//                                 Month:
//                                 <select value={month} onChange={handleMonthChange} className="ml-2 border border-gray-300 p-2">
//                                     {Array.from({ length: 12 }, (_, i) => (
//                                         <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
//                                     ))}
//                                 </select>
//                             </label>
//                              <label>
//                             Date:
//                             <select value={selectedDay} onChange={handleDaySelect} className="ml-2 border border-gray-300 p-2">
//                                 <option value="">All Days</option>
//                                 {days.map((day) => (
//                                     <option key={day} value={day}>{day}</option>
//                                 ))}
//                             </select>
//                         </label>
//                         </div>

//                         <div
//                            className="overflow-x-auto"
//                            style={{ maxHeight: "500px", overflowY: "auto" }}
//                            >
//                             <table className="min-w-full bg-white border border-gray-200">
//                                 <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 2 }}>
//                                     <tr>
//                                         <th className="px-4 py-2 border">Date</th>
//                                         {rooms.map((room) => (
//                                             <th key={room.roomNumber} className="px-4 py-2 border">
//                                                 <div>Room {room.roomNumber}</div>
//                                                 <div className="text-sm text-gray-500">{room.roomType} - Tariff - {room.tariff}</div>
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredDays.map((day) => {
//                                         const displayDate = new Date(year, month, day);
//                                         const formattedDate = displayDate.toLocaleDateString('en-US', {
//                                             weekday: 'short',
//                                             day: '2-digit',
//                                             month: 'short',
//                                             year: 'numeric'
//                                         });

//                                         return (
//                                             <tr key={day}>
//                                                 <td className="px-1 py-1 border">
//                                                     <span className="text-xs text-green-500">{formattedDate}</span>
//                                                 </td>
//                                                 {rooms.map((room) => {
//                                                     const statuses = getBookingStatus(day, room.roomNumber);
//                                                     const isCheckOut = statuses.some(status => status.status === 'checkOut');

//                                                     // Add 'available' status if it's a checkout and not already present
//                                                     if (isCheckOut && !statuses.includes('available')) {
//                                                         statuses.push({status:'available'});
//                                                     }
//                                                     const cellKey = `${year}-${month}-${day}-${room.roomNumber}`;
//                                                     const isBooked = toggledCells[cellKey] === 'selected';
//                                                     const displayStatus = isBooked ? 'Selected' : 'Available';
//                                                    const actualStatus = isBooked ? {status: 'selected'} : statuses[0];

//                                                     return (
//                                                         <td key={room.roomNumber} className={`px-4 py-2 border cursor-pointer`} >
//                                                             {statuses.map((status, index) => {
//                                                                 const bgColor =
//                                                                     status.status === 'checkIn'
//                                                                         ? 'bg-blue-200'
//                                                                         : status.status === 'checkOut'
//                                                                             ? 'bg-yellow-200'
//                                                                             : status.status === 'reserved'
//                                                                                 ? 'bg-red-600'
//                                                                                 : status.status === 'booked'
//                                                                                     ? 'bg-red-200'
//                                                                                     : 'bg-green-200';

//                                                                 return (
//                                                                     <div key={index} className={`${bgColor} text-center block whitespace-nowrap w-full p-1`}onClick={() => handleCellClick(status.status,status?.bookingId, room, day)}>
//                                                                         {status.status === 'checkIn'
//                                                                             ? 'Check-In'
//                                                                             : status.status === 'checkOut'
//                                                                                 ? 'Check-Out'
//                                                                                 : status.status === 'reserved'
//                                                                                     ? 'Reserved'
                                                                                    
//                                                                                     : displayStatus}
//                                                                     </div>
//                                                                 );
//                                                             })}

//                                                         </td>
//                                                     );
//                                                 })}
//                                             </tr>
//                                         );
//                                     })}
//                                      {/* Total booking count row */}
//                                     <tr className="font-bold">
//                                         <td className="px-4 py-2 border">Total</td>
//                                         {rooms.map((room) => (
//                                              <td
//                                                   key={room.roomNumber}
//                                                    className="px-4 py-2 border text-center"
//                                                >
//                                                  {bookingCounts[room.roomNumber] || 0}
//                                                </td>
//                                          ))}
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>

//                     </>
//                 ) : (
//                     <div className="text-center mt-12 text-xl text-gray-700">
//                         No Data.
//                     </div>
//                 )
//                 }
//             </main>
//         </div>
//     );
// };

// export default RoomBookingTable;
import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/apiClient';
import { baseURL } from "../../../config";
import { useNavigate } from 'react-router-dom';
import Header from "../common/Header";

const RoomBookingTable = () => {
    const [days, setDays] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState({});
    const [bookingCounts, setBookingCounts] = useState({});
    const [selectedDay, setSelectedDay] = useState('');
    const navigate = useNavigate();
    const [allAvailableData, setAllAvailableData] = useState([]);
    const [toggledCells, setToggledCells] = useState({});
    const roomColumnRef = useRef(null);

    const getMonthName = (i) => {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return monthNames[i];
    };

    const fetchBookings = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/api/booking/check`);
            setBookings(response.data);
        } catch (error) {
            setError('Failed to fetch booking data');
        }
    };

    const fetchBookingCounts = async () => {
        try {
            const response = await apiClient.get(
                `${baseURL}/api/booking/getBookingCountsByRoom`,
                {
                    params: {
                        year: year,
                        month: month + 1,
                    },
                }
            );

            const countsObject = response.data.reduce((acc, curr) => {
                acc[curr.roomno] = curr.bookingCount;
                return acc;
            }, {});

            setBookingCounts(countsObject);
        } catch (error) {
            setError('Failed to fetch booking counts');
            console.error("Error fetching booking counts:", error);
        }
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await apiClient.get(`${baseURL}/api/room/getRooms`);
                setRooms(response.data);
            } catch (error) {
                setError('Failed to fetch room data');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
        fetchBookings();
        fetchBookingCounts();
    }, [month, year]);

    useEffect(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        setDays(daysArray);
    }, [month, year]);

    const getBookingStatus = (day, roomNumber) => {
        const formattedRoomNumber = roomNumber.toString().padStart(3, '0');
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const bookingList = bookings[formattedRoomNumber] || [];

        if (!bookingList || bookingList.length === 0) return [{ status: 'available' }];

        const currentDate = new Date(dateStr);
        const statuses = [];

        for (let booking of bookingList) {
            const checkInDate = new Date(booking.checkInDate);
            const checkOutDate = new Date(booking.checkOutDate);

            if (currentDate.getTime() === checkInDate.getTime()) statuses.push({ status: 'checkIn', bookingId: booking.bookingId });
            if (currentDate.getTime() === checkOutDate.getTime()) statuses.push({ status: 'checkOut', bookingId: booking.bookingId });

            if (currentDate > checkInDate && currentDate < checkOutDate) statuses.push({ status: 'booked', bookingId: booking.bookingId });
        }

        return statuses.length > 0 ? statuses : [{ status: 'available' }];
    };

     const handleCellClick = (room, day, cellContent) => {
        const formattedRoomNumber = room.roomNumber.toString().padStart(3, '0');
         const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
         const cellKey = `${year}-${month}-${day}-${room.roomNumber}`;

         if (cellContent === 'Booked') {
             // If it's booked, navigate to the details page
             const bookingList = bookings[formattedRoomNumber] || []; // Use the formatted room number here
             const currentDate = new Date(dateStr);

             for (let booking of bookingList) {
                 const checkInDate = new Date(booking.checkInDate);
                 const checkOutDate = new Date(booking.checkOutDate);

                 if (checkInDate <= currentDate && currentDate <= checkOutDate) {
                     // Navigate to details page if it matches
                     navigate('/boadersdetails', { state: { bookingId: booking.bookingId } });
                     return; // Stop after finding the first matching booking
                 }
             }
         } else {
             // If it's available, toggle it
             setToggledCells(prevToggledCells => ({
                 ...prevToggledCells,
                 [cellKey]: !prevToggledCells[cellKey]
             }));
         }
     };

    useEffect(() => {
        console.log("Updated All Available Data:", allAvailableData);
    }, [allAvailableData]);

    const handleMonthChange = (e) => setMonth(parseInt(e.target.value));
    const handleYearChange = (e) => setYear(parseInt(e.target.value));

    const handleDaySelect = (e) => {
        setSelectedDay(e.target.value);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (roomColumnRef.current) {
                roomColumnRef.current.style.left = `${window.scrollX}px`;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const filteredDays = selectedDay ? [parseInt(selectedDay)] : days;

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Monthly Booking Calender" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {rooms && rooms.length > 0 ? (
                    <>
                        <div className="flex justify-between mb-4">
                            <label>
                                Year:
                                <select value={year} onChange={handleYearChange} className="ml-2 border border-gray-300 p-2">
                                    {[2024, 2025, 2026].map((yr) => (
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

                        <div
                            className="overflow-x-auto"
                            style={{ maxHeight: "500px", overflowY: "auto" }}
                        >
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 2 }}>
                                    <tr>
                                        <th className="px-4 py-2 border" style={{ position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'white' }}>Room</th>
                                        {filteredDays.map((day) => {
                                            const displayDate = new Date(year, month, day);
                                            const formattedDate = displayDate.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            });
                                            return (
                                                <th key={day} className="px-4 py-2 border">
                                                    <div>{formattedDate}</div>
                                                </th>
                                            );
                                        })}
                                        <th className="px-4 py-2 border">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => {
                                        let skipCells = 0; // Track how many cells to skip due to colSpan
                                        return (
                                            <tr key={room.roomNumber}>
                                                <td className="px-4 py-2 border" style={{ position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'white' }} ref={roomColumnRef}>

                                                    <div className="text-nowrap text-gray-900">Room {room.roomNumber}-{room.roomType} - Tariff - {room.tariff}</div>
                                                </td>
                                                {filteredDays.map((day, dayIndex) => {
                                                    if (skipCells > 0) {
                                                        skipCells--;
                                                        return null; // Skip rendering this cell
                                                    }

                                                    const formattedRoomNumber = room.roomNumber.toString().padStart(3, '0');
                                                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                    let bookingSpan = 1;
                                                    let cellContent = 'Available';
                                                    let cellBgColor = 'bg-green-200';

                                                    if (bookings[formattedRoomNumber]) {
                                                        const bookingList = bookings[formattedRoomNumber];
                                                        for (let booking of bookingList) {
                                                            const checkInDate = new Date(booking.checkInDate);
                                                            const checkOutDate = new Date(booking.checkOutDate);
                                                            const currentDate = new Date(dateStr);

                                                            if (checkInDate <= currentDate && currentDate <= checkOutDate) {
                                                                // Calculate booking span
                                                                const endDate = new Date(checkOutDate);
                                                                let span = 1;
                                                                while (dayIndex + span < filteredDays.length) {
                                                                    const nextDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(filteredDays[dayIndex + span]).padStart(2, '0')}`;
                                                                    const nextDate = new Date(nextDateStr);
                                                                    if (nextDate <= checkOutDate) {
                                                                        span++;
                                                                    } else {
                                                                        break;
                                                                    }
                                                                }
                                                                bookingSpan = span;
                                                                skipCells = span - 1; // Update skipCells

                                                                cellContent = 'Booked';
                                                                cellBgColor = 'bg-red-200';

                                                                return (
                                                                    <td key={day} className={`px-4 py-2 border cursor-pointer`} colSpan={bookingSpan}>
                                                                        <div
                                                                            className={`${cellBgColor} text-center block whitespace-nowrap w-full p-1`}
                                                                            onClick={() => handleCellClick(room, day, cellContent)}
                                                                        >
                                                                            {cellContent}
                                                                        </div>
                                                                    </td>
                                                                );
                                                            }
                                                        }
                                                    }

                                                    // If the loop completes without finding a booking, render available cell
                                                    const isToggled = toggledCells[`${year}-${month}-${day}-${room.roomNumber}`];
                                                    cellContent = isToggled ? 'Selected' : 'Available';
                                                    cellBgColor = isToggled ? 'bg-blue-200' : 'bg-green-200';

                                                    return (
                                                        <td key={day} className={`px-4 py-2 border cursor-pointer`}>
                                                            <div
                                                                className={`${cellBgColor} text-center block whitespace-nowrap w-full p-1`}
                                                                onClick={() => handleCellClick(room, day, cellContent)}
                                                            >
                                                                {cellContent}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-4 py-2 border text-center">
                                                    {bookingCounts[room.roomNumber] || 0}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="text-center mt-12 text-xl text-gray-700">
                        No Data.
                    </div>
                )
                }
            </main>
        </div>
    );
};

export default RoomBookingTable;
