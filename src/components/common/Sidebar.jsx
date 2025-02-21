import { UserRoundPlus, GalleryHorizontalEnd, Menu, Calendar, LogOut, Camera, Home, Bed, SquareUserRoundIcon, IndianRupeeIcon, HomeIcon } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { FaCalendarCheck } from 'react-icons/fa'
const SIDEBAR_ITEMS = {
  admin: [
    { name: "Home", icon: HomeIcon, color: "#6366f1", href: "/admindashboard" },
    { name: "Today's Availability", icon: Calendar, color: "#8B5CF6", href: "/room" },
    { name: "Monthly Availability", icon: FaCalendarCheck, color: "#6366f1", href: "/check" },
    { name: "CheckIn Details", icon: GalleryHorizontalEnd, color: "#8B5CF6", href: "/" },
    { name: "Bookings", icon: GalleryHorizontalEnd,
      children: [
          { name: "CheckIn Details", href: "/" },
          { name: "All Booking Details", href: "/allbookinginfo" },
      ]
    },
    
    // { name: "Open Webcam", icon: Camera, color: "#8B5CF6", href: "/webcam" },
    { name: " Room", icon: Bed, color: "#8B5CF6", href: "/roomshow" },
    { name: "Room Details", icon: Home, color: "#8B5CF6", href: "/roomdetails" },
    { name: "User", icon: SquareUserRoundIcon, color: "#8B5CF6", href: "/user" },
    { name: "Accounts", icon: IndianRupeeIcon, color: "#8B5CF6", href: "/accounts" },
    { name: "Logout", icon: LogOut, color: "#8B5CF6", href: "/logout" },
  ],
  user: [
    { name: "Home", icon: HomeIcon, color: "#6366f1", href: "/userhome" },
    { name: "Today's Availability", icon: Calendar, color: "#8B5CF6", href: "/room" },
    { name: "Monthly Availability", icon: FaCalendarCheck, color: "#6366f1", href: "/check" },
    { name: "CheckIn Details", icon: GalleryHorizontalEnd, color: "#8B5CF6", href: "/" },
    { name: "All Booking Details", icon: GalleryHorizontalEnd, color: "#8B5CF6", href: "/allbookinginfo" },
    
    { name: "Refund", icon: FaRegMoneyBillAlt, color: "#8B5CF6", href: "/refund" },
    { name: "Logout", icon: LogOut, color: "#8B5CF6", href: "/logout" },
  ],
};

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null); // Track open submenu

  const userRole = localStorage.getItem('role');
  const itemsToDisplay = SIDEBAR_ITEMS[userRole] || SIDEBAR_ITEMS.user;

  const toggleSubMenu = (index) => {
      setOpenSubMenu(openSubMenu === index ? null : index);
  };

  return (
    <motion.div
    className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-40" : "w-20"}`}
    animate={{ width: isSidebarOpen ? 256 : 80 }}
>
    <div className='h-full bg-white text-gray-900 backdrop-blur-md p-2 flex flex-col border-r border-gray-700'>
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
        >
            <Menu size={24} />
        </motion.button>

        <nav className='mt-8 flex-grow'>
            {itemsToDisplay.map((item, index) => (
                <div key={index}>
                    {item.children ? ( // Render submenu trigger
                        <div
                            onClick={() => toggleSubMenu(index)}
                            className={`flex items-center p-2 text-sm font-medium rounded-lg transition-colors mb-2 cursor-pointer ${openSubMenu === index ? 'bg-blue-500 text-white' : 'text-gray-900 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {item.icon && <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />}
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        className='ml-4 whitespace-nowrap'
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2, delay: 0.3 }}
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (  // Render regular link
                        <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center p-2 text-sm font-medium rounded-lg transition-colors mb-2 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-900 hover:bg-gray-700 hover:text-white'}`
                            }
                        >
                            {item.icon && <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />}
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        className='ml-4 whitespace-nowrap'
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2, delay: 0.3 }}
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    )}

                    {/* Render submenu items */}
                    <AnimatePresence>
                        {item.children && openSubMenu === index && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-4"
                            >
                                {item.children.map((child) => (
                                    <NavLink
                                        key={child.href}
                                        to={child.href}
                                        className={({ isActive }) =>
                                            `flex items-center p-2 text-sm font-medium rounded-lg transition-colors mb-2 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-900 hover:bg-gray-700 hover:text-white'}`
                                        }
                                    >
                                        <span className='ml-4 whitespace-nowrap'>{child.name}</span>
                                    </NavLink>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </nav>
    </div>
</motion.div>
  );
};

export default Sidebar;
