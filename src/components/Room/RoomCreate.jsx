import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { Home } from "lucide-react";
import { motion } from 'framer-motion';
import axios from "axios";
import { baseURL } from '../../../config';
import { useNavigate } from "react-router-dom";

const SlideDown = (delay) => {
  return {
    initial: {
      y: "-100%",
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: delay,
      },
    },
  };
};

function RoomCreate() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [roomCount, setRoomCount] = useState(0);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/room/getRooms`);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
    fetchRoom();
  }, []);
  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/property/getrooms`);
      const count = response.data.roomCount[0]?.number_of_rooms || 0;
      setRoomCount(count);
    } catch (error) {
      console.error("Error fetching room count:", error);
      toast.error('Failed to load room count');
    }
  };
  const handleClick = (room) => {
    if (room?.roomNumber) {
      navigate("/singleroomdetails", { state: {roomNo: room?.roomNumber } });
    } else {
      navigate("/roomcreation");
      
    }
  };

  const renderRooms = () => {
    const roomElements = [];
    
    for (let i = 0; i < roomCount; i++) {
      const room = rooms[i]; // Accessing room data or undefined for empty slots
      roomElements.push(
        <motion.div
          key={i} // Use index as key when room id is not available
          variants={SlideDown(i * 0.2)} // Add delay based on index
          initial="initial"
          animate="animate"
          className={"m-[1.5%] bg-teal-500 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"}
          onClick={() => handleClick(room)} // Conditional navigation based on room value
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="flex flex-col items-center justify-around">
            <Home size={30} color="black" />
            <span className="text-lg mt-2">{room?.roomNumber || 'Room Name'}</span>
            <span className="text-lg mt-2">Tariff: {room?.tariff || 'N/A'}</span>
          </div>
        </motion.div>
      );
    }

    return roomElements;
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Room" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className='grid grid-cols-1 sm:grid-cols-5 gap-2'>
          {renderRooms()} {/* Renders the room elements generated from the for loop */}
        </div>
      </main>
    </div>
  );
}

export default RoomCreate;
