import { motion } from "framer-motion";
import { Edit, Search, Trash2, CirclePlus, BookUser, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import apiClient from "../../api/apiClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from "../../../config";
import Header from "../common/Header";
import { Tooltip } from '@mui/material';
const UserTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]); // Store API data here
    const [filteredUser, setFilteredUser] = useState([]); // Store filtered data here

    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get(`/api/user/userdetails`);
            setUsers(response.data.user);  // set data in `users`
            setFilteredUser(response.data.user); // and filtered data
        } catch (error) {
            console.error('Error fetching User:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        console.log("first",users)
    }, []);

    const handleDelete = async (booking) => {
        const confirmDelete = window.confirm("Are you sure you want to cancel this user?");
        if (!confirmDelete) return;

        try {
            const response = await apiClient.post(`/api/user/deleteUser/${booking.id}`);

            if (response.status === 200) {
                toast.success('User status updated successfully!');
                fetchUsers(); // Refetch data to refresh the table WITHOUT filtering
                setSearchTerm(''); // Clear search
            } else {
                toast.error('Failed to update User status.');
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            toast.error('An error occurred while updating the user status.');
        }
    };

    const handleEditClick = (user) => {
        navigate("/useredit", { state: { user } });
    };

     const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        if (!searchValue) {
          setFilteredUser(users);
          return;
        }
        const filtered = users.filter((booking) =>
          booking.mobile.toString().includes(searchValue) ||
          booking.userName.toLowerCase().includes(searchValue) ||
          booking.role.toString().includes(searchValue)
        );
    
        setFilteredUser(filtered);
      };

    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 10;
    const indexOfLastProduct = currentPage * bookingsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - bookingsPerPage;
    const currentBooking = filteredUser.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredUser.length / bookingsPerPage);

    const handleClick = () => {
        navigate('/adduser');
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title="User Detail" />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
            <motion.div
                className="bg-white shadow-md rounded-xl p-8 border border-gray-300 mb-8 mt-6 mx-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">User Details</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={handleSearch}
                            value={searchTerm}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    </div>
                </div>

                <ToastContainer />

                <div className="flex justify-start items-center mb-6">
                    <button
                        onClick={handleClick}
                        className="inline-flex items-center p-2 rounded-full text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <CirclePlus className="w-6 h-6 mr-1" />
                        Add User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {['Name', 'Mobile', 'Email', 'Address', 'Role', 'Status', 'Actions'].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {currentBooking.map((booking) => (
                                <motion.tr
                                    key={booking.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.userName}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.mobile}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.email}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.address}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.role}</td>
                                    <td
                                        className={`px-3 py-4 whitespace-nowrap text-sm ${booking.status ? "text-green-700" : "text-red-500"
                                            }`}
                                    >
                                        {booking.status ? "Active" : "Inactive"}
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                                      <Tooltip title="Edit" arrow>
                                        <button className='text-indigo-400 hover:text-indigo-800 mr-2' onClick={() => { handleEditClick(booking) }}>
                                            <Edit size={18} />
                                        </button>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                        <button className='text-red-400 hover:text-red-300' onClick={() => { handleDelete(booking) }}>
                                            <Trash2 size={18} />
                                        </button>
                                        </Tooltip>

                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <div className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </motion.div>
            </main>
        </div>
    );
};

export default UserTable;