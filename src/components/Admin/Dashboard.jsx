import React, { useEffect,useState } from "react";
import Header from "../common/Header";
import { Home, IndianRupeeIcon } from "lucide-react";
import { FaHotel,FaBed,FaCalendarAlt, FaCreditCard, FaUser } from "react-icons/fa";
import RevenueChart from "./RevenueChart";
import { motion } from "framer-motion";
import BookingDetailsTable from "../Home/BookingDetailsTable";
import { useLocation,useNavigate } from "react-router-dom";
import { MdSubscriptions } from "react-icons/md";
import { baseURL } from "../../../config";
import axios from 'axios'

import Counter from "../common/Counter";
function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const role = params.get("role");
  const user = params.get("user");
  const [totalRooms, setTotalRooms] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [totalVisitor, setTotalVisitor] = useState(0);
  const[todayCollection,setTodayCollection]=useState(0);
  const[gstCollection,setGstCollection]=useState(0)
    // Fetch room availability from API
    const fetchTotalTodayBooking = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/countTodayCheckInBooking`); // Adjust the endpoint URL as needed
      
        setTotalToday(response.data.todayBookings); // Set the fetched value
      } catch (error) {
        console.error('Error fetching room availability:', error);
      }
    };
   // Fetch room availability from API
   const fetchRoomAvailability = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/getTotalRoom`); // Adjust the endpoint URL as needed
    
      setTotalRooms(response.data.rooms); // Set the fetched value
    } catch (error) {
      console.error('Error fetching room availability:', error);
    }
  };
     // Fetch total Revenue from API
     const fetchTotalAmount = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/total_collection`); 
      console.log("response",response)
        setTotalRevenue(response.data.result[0].totalAmountReceived); // Set the fetched value
      } catch (error) {
        console.error('Error fetching room availability:', error);
      }
    };
        // Fetch room availability from API
        const fetchMonthlyBooking = async () => {
          try {
            const response = await axios.get(`${baseURL}/api/total_monthlybooking`); 
          console.log("response",response)
            setTotalBooking(response.data.result[0].totalBookings); // Set the fetched value
          } catch (error) {
            console.error('Error fetching room availability:', error);
          }
        };
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
            const fetchGSTCollection = async () => {
              try {
                const response = await axios.get(`${baseURL}/api/total_gstcollection`);
              
                setGstCollection(response.data.result.totalGSTAmountReceived)
              } catch (error) {
                console.error('Error fetching today Collection:', error);
              }
              };
  useEffect(() => {
    if (role && user) {
      localStorage.setItem("role", role);
      localStorage.setItem("user", user);
    }

 

    fetchRoomAvailability();
    fetchTotalAmount();
    fetchMonthlyBooking();
    fetchTotalTodayBooking();
    fetchTotalVistor();
    fetchTodayCollection();
    fetchGSTCollection();
  }, [role, user]);

  useEffect(() => {
    // Check room availability and navigate if condition is not met
    if (totalRooms == 0 && totalRooms) {
      navigate("/roomshow"); // Navigate to "No Rooms Available" page
    }
  }, [totalRooms, navigate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"
  ];

  const month = new Date();
  const mon = monthNames[month.getMonth()]; // Get the month name



  return (
    totalRooms != 0 && (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Admin Dashboard" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <div className="flex flex-wrap">
            {/* Revenue Collections */}
            <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-teal-500 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={()=>{navigate("/totalrevenuecollection")}}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <IndianRupeeIcon size={30} color="black" />
                  <span className="text-lg"> {totalRevenue.toLocaleString()}</span>
                </div>
                <span className="text-lg">Total Revenue Collections</span>
              </div>
            </motion.div>
            
        
            <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-green-300 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={()=>{navigate("/getAllTodayCheckInBooking")}}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <FaBed size={30} color="black" />
                  <span className="text-lg"> {totalToday}</span>
                </div>
                <span className="text-lg">Today's Booking</span>
              </div>
            </motion.div>

         
            <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-red-500 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={()=>{navigate("/totalBooking")}}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <FaCalendarAlt size={30} color="black" />
                  <span className="text-lg">{totalBooking}</span>
                </div>
                <span className="text-lg">Monthly Booking</span>
              </div>
            </motion.div>

            {/* Payment Mode Contribution to Revenue */}
            <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-green-500 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={()=>{navigate("/getRevenueModeCollectionTable")}}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <FaCreditCard size={30} color="black" />
                  <span className="text-lg"> </span>
                </div>
                <span className="text-lg">Payment Mode Contribution to Revenue</span>
              </div>
            </motion.div>
            
            {/* Total Visitors */}
            <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-amber-500 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={() => {
                navigate('/visitorchart')
               }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <FaUser size={30} color="black" />
                  <span className="text-lg"><Counter value={totalVisitor} duration={1} delay={1} /></span>
                </div>
                <span className="text-lg">Total Visitors</span>
              </div>
            </motion.div>
                {/* Today's Collection*/}
                <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-cyan-600 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={() => {
                navigate('/getTodayAccountDetails')
               
              }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <IndianRupeeIcon size={30} color="black" />
                  <span className="text-lg"> {todayCollection.toLocaleString()}</span>
                </div>
                <span className="text-lg">Today's Collection</span>
              </div>
            </motion.div>
                {/* GST  */}
                <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-blue-600 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={()=>{navigate("/totalgstcollection")}}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <MdSubscriptions size={30} color="black" />
                  <span className="text-lg"> {gstCollection.toLocaleString()}</span>
                </div>
                <span className="text-lg">GST Collection</span>
              </div>
            </motion.div>
                {/* Room Rent vs Actual */}
                <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-violet-600 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <MdSubscriptions size={30} color="black" />
                  <span className="text-lg"> 12200 days</span>
                </div>
                <span className="text-lg">Room Rent vs Actual</span>
              </div>
            </motion.div>
        
            {/* Subscription Info */}
            <motion.div
              className="basis-full sm:basis-[15%] m-[1.5%] bg-rose-600 py-[40px] text-center overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <MdSubscriptions size={30} color="black" />
                  <span className="text-lg"> 12200 days</span>
                </div>
                <span className="text-lg">Subscription expires after</span>
              </div>
            </motion.div>
          </div>
          
          {/* Revenue Chart */}
          <div className="grid grid-cols-1 gap-2">
            <div>
              <RevenueChart />
            </div>
           
          </div>
        </main>
      </div>
    )
  );
}

export default Dashboard;



