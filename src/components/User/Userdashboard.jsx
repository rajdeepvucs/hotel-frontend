import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import { Home, Search, IndianRupeeIcon, Users, Calendar, User } from "lucide-react";
import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { baseURL } from "../../../config";
import BookingDetailsTable from "../Home/BookingDetailsTable";
import CheckInBoaderList from "../Home/CheckInBoaderList";
import AdvanceBoaderList from "../Home/AdvanceBoaderList";
import VacentRoom from "../Home/VacantRoom";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {  useMotionValue, useTransform, animate } from "framer-motion";
import Counter from "../common/Counter";
const SlideDown = (delay) => {
  return {
    initial: {
      y: "100%",
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
function Userdashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const role = params.get('role');
  const user = params.get('user');
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (role && user) {
      localStorage.setItem("role", role);
      localStorage.setItem("user", user);
    }
  }, [role, user]);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [bookedRoom, setBookedRoom] = useState(0);
  const [totalRoom, setTotalRoom] = useState(0);
  const [totalAmount, setTotalAmount] = useState([]);
  const [totalAdvanceBooking, setTotalAdvanceBooking] = useState(0);

  // Get the current month (as a string, with leading zero if necessary)
  const currentMonth = new Date().getMonth() + 1;
  const monthLabel = monthNames[currentMonth - 1];
  const navigate=useNavigate();
  // Find the total amount for the current month
  const currentMonthAmount = totalAmount.find(
    (entry) => entry.month === String(currentMonth).padStart(2, "0")
  );

  // Function to fetch total rooms booked
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/getTotalRoomBooked`);
      setBookedRoom(response.data.totalRoomsBooked);
    } catch (error) {
      console.error("Error fetching total booked rooms:", error);
    }
  };

  // Function to fetch total rooms available
  const fetchTotalRooms = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/getTotalRoom`);
      setTotalRoom(response.data.rooms);
    } catch (error) {
      console.error("Error fetching total rooms:", error);
    }
  };


  const fetchTotaladvanceBooking = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/getTotalAdvanceBooking`
      );
      setTotalAdvanceBooking(response.data.rooms);
    } catch (error) {
      console.error("Error fetching total advance booking:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTotalRooms();
 
    fetchTotaladvanceBooking();
  }, []);
  const handleClick1 = () => {
    navigate('/roomstatus')
 
  };
  const handleClick2 = () => {
  
    navigate('/room')
  };
  const handleClick3 = () => {
    
    navigate('/advanceboaderlist')
 
  };
  const handleClick4 = () => {
    
    navigate('/vacantroom')

  };
  const [searchTerm, setSearchTerm] = useState("");
	const [filteredAccount, setFilteredAccount] = useState([]);
	
	const [account,setAccount]=React.useState([]);
 const[todayCollection,setTodayCollection]=React.useState()
 const[totalVisitor,setTotalVisitor]=React.useState()

	const fetchAccounts = async () => {
		try {
		  const response = await axios.get(`${baseURL}/api/account/getToday`);
		
		  setFilteredAccount(response.data.account)
		} catch (error) {
		  console.error('Error fetching Accounts:', error);
		}
	  };
  useEffect(() => {
    
	fetchAccounts()
  
  }, []);
  const fetchTotalVistor = async () => {
		try {
		  const response = await axios.get(`${baseURL}/api/getTotalPeople`);
		
      setTotalVisitor(response.data.totalPeople)
		} catch (error) {
		  console.error('Error fetching today Collection:', error);
		}
	  };
  
	const fetchTodayCollection = async () => {
		try {
		  const response = await axios.get(`${baseURL}/api/getTodayCollection`);
		
      setTodayCollection(response.data.todayTotalCollection)
		} catch (error) {
		  console.error('Error fetching today Collection:', error);
		}
	  };
  useEffect(() => {
    
    fetchTodayCollection()
    fetchTotalVistor()
  
  }, []);

  useEffect(() => {
    const animation = animate(count, totalVisitor, {
      duration: 1,
      delay:2
    });
    return animation.stop;
  }, [totalVisitor]);
  const selectedDate = new Date();
  const toDay = selectedDate.toISOString().split("T")[0];
	  
	 
	  const handleSearch = (e) => {
		const searchValue = e.target.value.toLowerCase();
		setSearchTerm(searchValue);
	
		// Filter the bookings based on the search term
		const filtered = filteredAccount.filter((booking) =>
			booking.bookingId.toString().includes(searchValue) || // Search by bookingId
			booking.name.toLowerCase().includes(searchValue) || // Search by customer name
			booking.roomno.toString().includes(searchValue) // Search by room number
		);
	
		// Set the filtered bookings to display
		setFilteredAccount(filtered);
	};
	
	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [bookingsPerPage] = useState(10); 
// Calculate pagination
const indexOfLastProduct = currentPage * bookingsPerPage;
const indexOfFirstProduct = indexOfLastProduct - bookingsPerPage;
const currentBooking = filteredAccount.slice(indexOfFirstProduct, indexOfLastProduct);
const totalPages = Math.ceil(filteredAccount.length / bookingsPerPage);
	
  return (
    <div className="flex-1 overflow-auto relative z-10 ">
      <Header title="User Dashboard" />
      <main className="max-w-7xl  mx-auto py-6 px-4 lg:px-8 " >
        <div className="flex flex-wrap">
          <motion.div
            variants={SlideDown(1 * 0.2)} // Add delay based on index
            initial="initial"
            animate="animate"
            className="basis-full sm:basis-[15%] m-[1.5%] bg-gradient-to-bl from-[#00ff87] to-[#60efff] py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 text-white"
            whileHover={{
              y: -5,
          
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => {
              handleClick1();
            }}
          >
            <div className="flex flex-col items-center gap-x-1">
              <Calendar size={30} color="black" />
              <span className="text-lg font-medium">
                Current Room Status
              </span>
            </div>
          </motion.div>

      

          <motion.div
            className="basis-full sm:basis-[15%] m-[1.5%] bg-gradient-to-bl from-[#0061ff] to-[#60efff] py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 text-white"
            variants={SlideDown(2 * 0.2)} // Add delay based on index
            initial="initial"
            animate="animate"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => {
              handleClick2();
            }}
          >
                <div className="flex  flex-col items-center gap-x-1">
  <Home size={30} color="black" />
  <span className="text-lg font-medium">
  Todays Room Status 

  </span>
  <span className="text-lg font-medium">
  Vacant  <Counter value={totalRoom - bookedRoom} duration={1} delay={2} />
  </span>
  <span className="text-lg font-medium">
  Occupied  <Counter value={bookedRoom} duration={1} delay={2} />
  </span>
</div>
       
          </motion.div>
          <motion.div
             className="basis-full sm:basis-[15%] m-[1.5%] bg-gradient-to-bl from-[#696eff] to-[#fbacff] py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 text-white"
            variants={SlideDown(3 * 0.2)} // Add delay based on index
            initial="initial"
            animate="animate"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
            
            }}
            onClick={() => {
              handleClick3();
            }}
          >
       <div className="flex flex-col items-center gap-x-1">
  <Home size={30} color="black" />
  <span className="text-lg font-medium">
   No. of Bookings  <Counter value={totalAdvanceBooking} duration={1} delay={2} />
  </span>
</div>

          </motion.div>
          <motion.div
            className="basis-full sm:basis-[15%] m-[1.5%] bg-gradient-to-bl from-[#ff5858] to-[#ffc8c8] py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 text-white"
            variants={SlideDown(4 * 0.2)} // Add delay based on index
            initial="initial"
            animate="animate"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
            
            }}
            onClick={() => {
              navigate('/getTodayAccountDetails')
             
            }}
          >
       <div className="flex  flex-col items-center gap-x-1">
  <IndianRupeeIcon size={30} color="black" />
  <span className="text-lg font-medium">
   Today's Collection : <Counter value={todayCollection }
   duration={1} delay={2} />
  </span>
</div>

          </motion.div>
          <motion.div
            className="basis-full sm:basis-[15%] m-[1.5%] bg-gradient-to-bl from-[#432371] to-[#faae7b] py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 text-white"
            variants={SlideDown(5 * 0.2)} // Add delay based on index
            initial="initial"
            animate="animate"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
            
            }}
            onClick={() => {
             navigate('/visitorchart')
            }}
          >
       <div className="flex  flex-col items-center gap-x-1">
  <User size={30} color="black" />
  <span className="text-lg font-medium">
   Total Visitors  <Counter value={totalVisitor} duration={1} delay={2} />
   </span>
</div>

          </motion.div>
        </div>
       
      </main>
    </div>
  );
}

export default Userdashboard;
