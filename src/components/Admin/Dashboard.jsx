import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { Home, IndianRupeeIcon } from "lucide-react";
import { FaHotel, FaBed, FaCalendarAlt, FaCreditCard, FaUser } from "react-icons/fa";
import RevenueChart from "./RevenueChart";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MdSubscriptions } from "react-icons/md";
import { baseURL } from "../../../config";
import apiClient from "../../api/apiClient";
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
    const [todayCollection, setTodayCollection] = useState(0);
    const [gstCollection, setGstCollection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch data from an API and handle errors
    const fetchData = async (url, setter) => {
        try {
            const response = await apiClient.get(url);
            if (response && response.data) {
                setter(response.data);
            }
            else {
                throw new Error('Response data not found')
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred while fetching Data');
        } finally {
            setLoading(false);
        }
    };


    const fetchTotalTodayBooking = async () => {
        fetchData(`${baseURL}/api/countTodayCheckInBooking`, (data) => {
            setTotalToday(data.todayBookings || 0);
        });
    };

    const fetchRoomAvailability = async () => {
        fetchData(`${baseURL}/api/getTotalRoom`, (data) => {
            setTotalRooms(data.rooms);
        });
    };


    const fetchTotalAmount = async () => {
        fetchData(`${baseURL}/api/total_collection`, (data) => {
            if (data && data.result && data.result[0]) {
                setTotalRevenue(data.result[0].totalAmountReceived || 0);
            } else {
                setTotalRevenue(0);
            }

        });
    };

    const fetchMonthlyBooking = async () => {
        fetchData(`${baseURL}/api/total_monthlybooking`, (data) => {
            if (data && data.result && data.result[0]) {
                setTotalBooking(data.result[0].totalBookings || 0);
            }
            else {
                setTotalBooking(0);
            }
        });
    };

    const fetchTotalVistor = async () => {
        fetchData(`${baseURL}/api/getTotalPeople`, (data) => {
            setTotalVisitor(data.totalPeople || 0);
        });
    };

    const fetchTodayCollection = async () => {
        fetchData(`${baseURL}/api/getTodayCollection`, (data) => {
            setTodayCollection(data.todayTotalCollection || 0);
        });
    };

    const fetchGSTCollection = async () => {
        fetchData(`${baseURL}/api/total_gstcollection`, (data) => {
            if (data && data.result)
                setGstCollection(data.result.totalGSTAmountReceived || 0);
            else {
                setGstCollection(0);
            }
        });
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
        if (totalRooms === 0) {
           
             const overlay = document.createElement("div");
              overlay.classList.add(
                "fixed",
                "inset-0",
                "bg-black",
                "bg-opacity-50",
                "flex",
                "items-center",
                "justify-center",
                "z-50"
             );
           
            
            const card = document.createElement("div");
            card.classList.add(
                "bg-white",
                 "p-8",
                 "rounded-lg",
                 "shadow-xl",
                 "text-center"
           );


            const firstConfirmMessage=document.createElement('p')
            firstConfirmMessage.textContent = "It seems you haven't configured any rooms yet. Do you want to set them up now?"
           
            const firstButtonContainer= document.createElement('div');
            firstButtonContainer.classList.add('mt-4','space-x-4')

            const firstConfirmButton = document.createElement("button");
            firstConfirmButton.textContent = "Yes";
            firstConfirmButton.classList.add('px-4', 'py-2','bg-green-500','text-white','rounded','hover:bg-green-700','focus:outline-none')
           
             const firstCancelButton = document.createElement("button");
            firstCancelButton.textContent = "No";
              firstCancelButton.classList.add('px-4', 'py-2','bg-red-500','text-white','rounded','hover:bg-red-700','focus:outline-none')

            firstButtonContainer.appendChild(firstConfirmButton);
            firstButtonContainer.appendChild(firstCancelButton);
            card.appendChild(firstConfirmMessage);
            card.appendChild(firstButtonContainer);
            overlay.appendChild(card);
            document.body.appendChild(overlay);


             const handleFirstConfirmation = (confirm)=>{
                 
                if(confirm){
                  navigate("/new");
               }
               document.body.removeChild(overlay)
                
                if(!confirm){
                   const secondOverlay = document.createElement("div");
                     secondOverlay.classList.add(
                        "fixed",
                        "inset-0",
                        "bg-black",
                        "bg-opacity-50",
                        "flex",
                        "items-center",
                        "justify-center",
                        "z-50"
                    );
                   
            
                    const secondCard = document.createElement("div");
                    secondCard.classList.add(
                        "bg-white",
                        "p-8",
                        "rounded-lg",
                        "shadow-xl",
                        "text-center"
                    );

                  const secondConfirmMessage=document.createElement('p')
                  secondConfirmMessage.textContent = "Would you like to create a user?";
                     
                    const secondButtonContainer= document.createElement('div');
                    secondButtonContainer.classList.add('mt-4','space-x-4')

                    const secondConfirmButton = document.createElement("button");
                    secondConfirmButton.textContent = "Yes";
                     secondConfirmButton.classList.add('px-4', 'py-2','bg-green-500','text-white','rounded','hover:bg-green-700','focus:outline-none')

                     const secondCancelButton = document.createElement("button");
                     secondCancelButton.textContent = "No";
                     secondCancelButton.classList.add('px-4', 'py-2','bg-red-500','text-white','rounded','hover:bg-red-700','focus:outline-none')

                     secondButtonContainer.appendChild(secondConfirmButton);
                    secondButtonContainer.appendChild(secondCancelButton);
                    secondCard.appendChild(secondConfirmMessage);
                    secondCard.appendChild(secondButtonContainer)
                    secondOverlay.appendChild(secondCard)
                    document.body.appendChild(secondOverlay);

                    const handleSecondConfirmation = (confirm) =>{
                        if(confirm){
                          navigate("/adduser")
                        }
                         document.body.removeChild(secondOverlay)
                    }

                    secondConfirmButton.addEventListener('click',()=>{
                        handleSecondConfirmation(true)
                     })
                    secondCancelButton.addEventListener('click',()=>{
                        handleSecondConfirmation(false)
                    })


                 }

             }

             firstConfirmButton.addEventListener('click', ()=>{
                handleFirstConfirmation(true)
             })
              firstCancelButton.addEventListener('click', ()=>{
                handleFirstConfirmation(false)
            })

        }
    }, [totalRooms, navigate]);


    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const month = new Date();
    const mon = monthNames[month.getMonth()];


    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading dashboard data...</div>; // Display a loading message
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        totalRooms !== null && (
            <div className="flex flex-col min-h-screen overflow-auto relative z-10">
                <Header title="Admin Dashboard" />

                <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                    {/* Dashboard Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {/* Revenue Collections */}
                        <motion.div
                            className="bg-teal-500 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={() => { navigate("/totalrevenuecollection") }}
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
                            className="bg-green-300 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={() => { navigate("/getAllTodayCheckInBooking") }}
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
                            className="bg-red-500 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={() => { navigate("/totalBooking") }}
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
                            className="bg-green-500 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={() => { navigate("/getRevenueModeCollectionTable") }}
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
                             className="bg-amber-500 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
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
                             className="bg-cyan-600 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
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
                            className="bg-blue-600 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={() => { navigate("/totalgstcollection") }}
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
                            className="bg-violet-600 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
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
                            className="bg-rose-600 py-6 text-center overflow-hidden shadow-lg rounded-xl border border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
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
                    <div className="mt-6">
                        <RevenueChart />
                    </div>
                </main>
            </div>
        )
    );
}

export default Dashboard;