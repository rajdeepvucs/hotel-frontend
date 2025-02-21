// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { motion } from "framer-motion";
// import Header from "../common/Header";
// import apiClient from "../../api/apiClient";
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import { styled } from '@mui/material/styles';
// import { Typography } from '@mui/material';
// import { baseURL } from "../../../config";
// import { useNavigate } from "react-router-dom";

// const Room = () => {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [rooms, setRooms] = useState([]);
//     const [room, setRoom] = useState([]); //total room
//     const [groupedRooms, setGroupedRooms] = useState({});
//     const navigate = useNavigate();
//     const [boaders, setBoarders] = useState([]);
//     const legendItems = [
//         { color: "bg-green-500", label: "Available" },
//         { color: "bg-red-500", label: "Occupied" },
//         { color: "bg-red-800", label: "Advance Booking" },
//         { color: "bg-amber-600", label: "Check-Out Today" },
//     ];
//     const HtmlTooltip = styled(({ className, ...props }) => (
//         <Tooltip {...props} classes={{ popper: className }} />
//     ))(({ theme }) => ({
//         [`& .${tooltipClasses.tooltip}`]: {
//             backgroundColor: '#FEF2F2',
//             color: 'rgba(0, 0, 0, 0.87)',
//             maxWidth: 220,
//             fontSize: theme.typography.pxToRem(12),
//             border: '1px solid #dadde9',
//         },
//     }));

//     useEffect(() => {
//         const fetchRoom = async () => {
//             try {
//                 const response = await apiClient.get(`${baseURL}/api/room/getRooms`);
//                 setRoom(response.data); // Set the rooms data
                
            
//             } catch (error) {
//                 console.error("Error fetching rooms:", error);
//                 setRoom([]); // Handle error case by resetting rooms
//             }
//         };

//         fetchRoom();
//     }, []);

//     useEffect(() => {
//         const fetchRooms = async () => {
//             try {
//                 const formattedDate = selectedDate.toISOString().split("T")[0];
//                 const response = await apiClient.get(`${baseURL}/api/booking/checkavaildate/${formattedDate}`);
//                 setRooms(response.data); // Set the rooms data
              
//             } catch (error) {
//                 console.error("Error fetching rooms:", error);
//                 setRooms([]); // Handle error case by resetting rooms
//             }
//         };

//         fetchRooms();
//     }, [selectedDate]); // Trigger API call on date change

//     const handleCardClick = (room, bookedRoom) => {
//         navigate("/boderdetails", {
//             state: {
//                 room,
//                 bookedRoom,
//                 selectedDate,
//             }
//         });
//     };

//     const fetchBooking = async () => {
//         try {
//             const formattedDate = selectedDate.toISOString().split("T")[0];
//             const response = await apiClient.get(`${baseURL}/api/booking/getParticularDayBooking/${formattedDate}`);
//             setBoarders(response.data)
//         } catch (error) {
//             console.error('Error fetching Booking:', error);
//         }
//     };
//     useEffect(() => {
//         fetchBooking()
//     }, [selectedDate]);

//     // Function to get day of the week
//     const getDayOfWeek = (date) => {
//         const options = { weekday: 'short' };
//         return date.toLocaleDateString(undefined, options);
//     };

//     let i = 0;

//     return (
//         <div className='flex-1 overflow-auto relative z-10'>
//             <Header title='Rooms Availability' />
//             <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
//                 {/* Legend Section */}
//                 {room && room.length > 0 ? (
//                     <>
//                         <div className="flex items-center gap-4 mb-4">
//                             <h2 className="text-lg font-semibold">Color Meaning:</h2>
//                             <div className="flex gap-2">
//                                 {legendItems.map((item, index) => (
//                                     <div key={index} className="flex items-center gap-2">
//                                         <div
//                                             className={`w-6 h-6 rounded ${item.color}`}
//                                             title={item.label}
//                                         ></div>
//                                         <span className="text-sm">{item.label}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                         {/* Date picker container */}
//                         <div className="absolute top-28 right-8 flex flex-row items-center">
//                              <div className="text-xl mr-1">{getDayOfWeek(selectedDate)},</div>
//                             <div className="text-xl mr-1">Date:</div>
//                             <DatePicker
//                                 selected={selectedDate}
//                                 onChange={(date) => setSelectedDate(date)}
//                                 dateFormat="yyyy-MM-dd"
//                                 placeholderText="Select Date"
//                                 className="text-black p-2 rounded"
//                             />
//                         </div>
//                         {/* Flex container for room cards */}
//                         <div className='flex flex-wrap justify-center gap-4 mt-12'>
//                             {room.map((room, index) => {
//                                 // Find the matching booked room
//                                 const bookedRoom = rooms.find(booked => booked.roomno === room.roomNumber);

//                                 return (
//                                     <motion.div
//                                         key={index}
//                                         className={`w-full sm:w-[30%] backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer ${
//                                             bookedRoom ? (new Date(bookedRoom.checkOutDate).toDateString() === selectedDate.toDateString() ? 'bg-amber-600' : bookedRoom.status === 'Advance Booking' ? 'bg-red-800' : 'bg-red-500') : 'bg-green-500'
//                                         }`}
//                                         whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
//                                         onClick={() => handleCardClick(room, bookedRoom)} // Card click event
//                                     >
//                                         <div className="flex flex-row justify-between">
//                                             <div className='px-4 py-3 sm:p-4 text-gray-100'>
//                                                 <span className='flex items-center text-sm font-medium'>
//                                                     {room.roomType}
//                                                 </span>
//                                                 <p className='mt-1 text-2xl font-semibold'>
//                                                     {room.roomNumber}
//                                                 </p>
//                                                 <div className='mt-2 space-y-1 flex items-center gap-1'>
//                                                     <p>
//                                                         {bookedRoom ? bookedRoom?.status : "Available"}
//                                                     </p>

//                                                     {bookedRoom ? (
//                                                         <React.Fragment>
//                                                             <p className="whitespace-nowrap text-sm">Due:</p>
//                                                             <p className="whitespace-nowrap text-lg">{boaders[i]?.balance}</p>
//                                                         </React.Fragment>
//                                                     ) : null}
//                                                 </div>
//                                                 <div className="mt-2 ">
//                                                     {!bookedRoom ? (
//                                                         <div>
//                                                             <Typography style={{ color: 'white' }}>
//                                                                 Amenities: {room?.features?.join(', ')}
//                                                             </Typography>
//                                                         </div>
//                                                     ) : (
//                                                         <div className='mt-3 '>
//                                                             <div className='grid grid-cols-2 gap-1'>
//                                                                 <div>
//                                                                     <p className="whitespace-nowrap text-sm">CheckInDate:</p>
//                                                                     <p className="whitespace-nowrap text-sm">{bookedRoom?.checkInDate}</p>
//                                                                 </div>
//                                                                 <div>
//                                                                     <p className="whitespace-nowrap text-sm">CheckOutDate:</p>
//                                                                     <p className="whitespace-nowrap text-sm">{bookedRoom?.checkOutDate}</p>
//                                                                 </div>
//                                                                 <div className="whitespace-nowrap text-sm">
//                                                                     <Typography style={{ color: 'white' }}>
//                                                                         Amenities: {room?.features?.join(', ')}
//                                                                     </Typography>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             {bookedRoom && (
//                                                 <div >
//                                                     <div className="w-20 h-20 rounded-full overflow-hidden bg-white">
//                                                         <img
//                                                             src={`${baseURL}/${boaders[i]?.photo}`}
//                                                             alt={boaders[index]?.name}
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                     </div>
//                                                     <div className="text-left font-normal text-white whitespace-nowrap">
//                                                         {boaders[i++]?.name}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </motion.div>
//                                 );
//                             })}
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

// export default Room;
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import Header from "../common/Header";
import apiClient from "../../api/apiClient";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { baseURL } from "../../../config";
import { useNavigate } from "react-router-dom";

const Room = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rooms, setRooms] = useState([]); // Total room with particular date
    const [groupedRooms, setGroupedRooms] = useState({}); //Grouped by room
    const navigate = useNavigate();
    const [boaders, setBoarders] = useState([]);
    const legendItems = [
        { color: "bg-green-500", label: "Available" },
        { color: "bg-red-500", label: "Occupied" },
        { color: "bg-red-800", label: "Advance Booking" },
        { color: "bg-amber-600", label: "Check-Out Today" },
    ];
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#FEF2F2',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));


    useEffect(() => {
        const fetchGroupedRooms = async () => {
            try {
                 const formattedDate = selectedDate.toISOString().split("T")[0];
              const response = await apiClient.get(`${baseURL}/api/room/getRoomOrder`);
              setGroupedRooms(response.data);
            } catch (error) {
              console.error("Error fetching grouped rooms:", error);
              setGroupedRooms({}); // Handle error case
            }
          };

          fetchGroupedRooms();
    }, [selectedDate]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const formattedDate = selectedDate.toISOString().split("T")[0];
                const response = await apiClient.get(`${baseURL}/api/booking/checkavaildate/${formattedDate}`);
                setRooms(response.data); // Set the rooms data

            } catch (error) {
                console.error("Error fetching rooms:", error);
                setRooms([]); // Handle error case by resetting rooms
            }
        };

        fetchRooms();
    }, [selectedDate]); // Trigger API call on date change

    const handleCardClick = (room, bookedRoom) => {
        navigate("/boderdetails", {
            state: {
                room,
                bookedRoom,
                selectedDate,
            }
        });
    };

    const fetchBooking = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            const response = await apiClient.get(`${baseURL}/api/booking/getParticularDayBooking/${formattedDate}`);
            setBoarders(response.data)
        } catch (error) {
            console.error('Error fetching Booking:', error);
        }
    };
    useEffect(() => {
        fetchBooking()
    }, [selectedDate]);

    // Function to get day of the week
    const getDayOfWeek = (date) => {
        const options = { weekday: 'short' };
        return date.toLocaleDateString(undefined, options);
    };

    let i = 0;

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Rooms Availability' />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Legend Section */}
                {Object.keys(groupedRooms).length > 0 ? (
                    <>
                    <div className="flex flex-row justify-between">
                    <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-lg font-semibold">Color Meaning:</h2>
                            <div className="flex gap-2">
                                {legendItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className={`w-6 h-6 rounded ${item.color}`}
                                            title={item.label}
                                        ></div>
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Date picker container */}
                        <div className=" flex flex-row items-center">
                            <div className="text-xl mr-1">{getDayOfWeek(selectedDate)},</div>
                            <div className="text-xl mr-1">Date:</div>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                className="text-black p-2 rounded"
                            />
                        </div>
                    </div>
                      

                        {/* Grouped Rooms Display */}
                        <div className='flex flex-wrap justify-center gap-4 mt-12'>
                            {Object.entries(groupedRooms).map(([roomType, roomsOfType]) => (
                                <div key={roomType} className="w-full border rounded-md p-4 mb-4 relative">
                                    <h2 className="absolute -top-3 left-5 text-xl font-semibold mb-2">{roomType}</h2>
                                    <div className="flex flex-wrap justify-start gap-4">
                                        {roomsOfType.map((room, index) => {
                                            // Find the matching booked room
                                            const bookedRoom = rooms.find(booked => booked.roomno === room.roomNumber);
                                            return (
                                                <motion.div
                                                    key={index}
                                                    className={`w-full sm:w-[30%] backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer ${
                                                        bookedRoom ? (new Date(bookedRoom.checkOutDate).toDateString() === selectedDate.toDateString() ? 'bg-amber-600' : bookedRoom.status === 'Advance Booking' ? 'bg-red-800' : 'bg-red-500') : 'bg-green-500'
                                                    }`}
                                                    whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
                                                    onClick={() => handleCardClick(room, bookedRoom)} // Card click event
                                                >
                                                    <div className="flex flex-row justify-between">
                                                        <div className='px-4 py-3 sm:p-4 text-gray-100'>
                                                            <span className='flex items-center text-sm font-medium'>
                                                                {room.roomType}
                                                            </span>
                                                            <p className='mt-1 text-2xl font-semibold'>
                                                                {room.roomNumber}
                                                            </p>
                                                            <div className='mt-2 space-y-1 flex items-center gap-1'>
                                                                <p>
                                                                    {bookedRoom ? bookedRoom?.status : "Available"}
                                                                </p>

                                                                {bookedRoom ? (
                                                                    <React.Fragment>
                                                                        <p className="whitespace-nowrap text-sm">Due:</p>
                                                                        <p className="whitespace-nowrap text-lg">{boaders[i]?.balance}</p>
                                                                    </React.Fragment>
                                                                ) : null}
                                                            </div>
                                                            <div className="mt-2 ">
                                                                {!bookedRoom ? (
                                                                    <div>
                                                                        <Typography style={{ color: 'white' }}>
                                                                            Amenities: {room?.features?.join(', ')}
                                                                        </Typography>
                                                                    </div>
                                                                ) : (
                                                                    <div className='mt-3 '>
                                                                        <div className='grid grid-cols-2 gap-1'>
                                                                            <div>
                                                                                <p className="whitespace-nowrap text-sm">CheckInDate:</p>
                                                                                <p className="whitespace-nowrap text-sm">{bookedRoom?.checkInDate}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="whitespace-nowrap text-sm">CheckOutDate:</p>
                                                                                <p className="whitespace-nowrap text-sm">{bookedRoom?.checkOutDate}</p>
                                                                            </div>
                                                                            <div className="whitespace-nowrap text-sm">
                                                                                <Typography style={{ color: 'white' }}>
                                                                                    Amenities: {room?.features?.join(', ')}
                                                                                </Typography>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {bookedRoom && (
                                                            <div >
                                                                <div className="w-20 h-20 rounded-full overflow-hidden bg-white">
                                                                    <img
                                                                        src={`${baseURL}/${boaders[i]?.photo}`}
                                                                        alt={boaders[index]?.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="text-left font-normal text-white whitespace-nowrap">
                                                                    {boaders[i++]?.name}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
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

export default Room;