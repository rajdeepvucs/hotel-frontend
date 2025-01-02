import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import Header from "../common/Header";
import axios from "axios"; 
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { baseURL } from "../../../config";
import { useNavigate } from "react-router-dom";

const Room = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState([]);
    const navigate=useNavigate()
    const [boaders,setBoarders]=useState([]);
    
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
        const fetchRoom = async () => {
            try {
                
                const response = await axios.get(`${baseURL}/api/room/getRooms`); 
                setRoom(response.data); // Set the rooms data
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setRoom([]); // Handle error case by resetting rooms
            }
        };

        fetchRoom();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const formattedDate = selectedDate.toISOString().split("T")[0]; 
               
                const response = await axios.get(`${baseURL}/api/booking/checkavaildate/${formattedDate}`); 
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
              bookedRoom ,
              selectedDate ,
                
            }
          });
        
      };
  	const fetchBooking = async () => {
		try {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            
        
		  const response = await axios.get(`${baseURL}/api/booking/getParticularDayBooking/${formattedDate}`);
		
		  setBoarders(response.data)
		} catch (error) {
		  console.error('Error fetching Booking:', error);
		}
	  };
  useEffect(() => {
    
	fetchBooking()
  
  }, [selectedDate]);
console.log("boaders",boaders)
let i=0;
    return (
        <div className='flex-1 overflow-auto relative z-10'>
        <Header title='Rooms Availability' />
    
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
            {/* Date picker container */}
            <div className="absolute top-28 right-8 flex flex-row">
                <div className="text-xl mr-1">Date:</div>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Date"
                    className="text-black p-2 rounded"
                />
            </div>
    
            {/* Flex container for room cards */}
            <div className='flex flex-wrap justify-center gap-4 mt-12'>
                {room.map((room, index) => {
                    // Find the matching booked room
                    const bookedRoom = rooms.find(booked => booked.roomno === room.roomNumber);
                 
             
                    return (
                        <motion.div
                            key={index}
                            className={`w-full sm:w-[30%] backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer ${
                                bookedRoom ? (new Date(bookedRoom.checkOutDate).toDateString() == selectedDate.toDateString() ? 'bg-amber-600' :bookedRoom.status==='Advance Booking'?'bg-red-800': 'bg-red-500') : 'bg-green-500'

                            }`}
                            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
                            onClick={() => handleCardClick(room, bookedRoom)} // Card click event
                        >
 {/* <HtmlTooltip
    title={
        !bookedRoom ? (
            <React.Fragment>
              
                <Typography color="inherit" sx={{ textAlign: 'center' }}>
                Amenities</Typography>
                <ul>
                    {room?.features?.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                
            </React.Fragment>
        ) : (
        //     <div className="grid grid-cols-2 gap-4 items-center">
        //     <div className="w-24 h-24 rounded-full overflow-hidden">
        //       <img
        //         src={`${baseURL}/${boaders[i]?.photo}`}
        //         alt={boaders[index]?.name}
        //         className="w-full h-full object-cover"
        //       />
        //     </div>
          
        //     <div className="text-center">
        //       <div className="text-lg font-semibold">{boaders[i]?.name}</div>
        //     </div>
        //     <div className="text-center">
        //       <div className="text-lg font-semibold">{boaders[i++]?.status}</div>
        //     </div>
          
          
        //   </div>
          <div></div>
          
        )
    }
                   
>                                 */}

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
                    <Typography style={{color: 'white'}}>
                        Amenities: {room?.features?.join(', ')}
                    </Typography>
                </div>
            ):( 
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
                    <Typography style={{color: 'white'}}>
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

                                
                            {/* </HtmlTooltip> */}
                        </motion.div>
                    );
                })}
            </div>
        </main>
    </div>
    
    );
};

export default Room;
