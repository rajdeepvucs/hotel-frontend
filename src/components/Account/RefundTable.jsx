import { motion } from "framer-motion";
import { Edit, Search,  } from "lucide-react";
import { useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from "../../../config";
import AttachMoney from '@mui/icons-material/MonetizationOn'

import * as React from 'react';
import Header from "../common/Header";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const RefundTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooking, setFilteredBooking] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [allAdvanceBookings, setAllAdvanceBookings] = useState([]);
    

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
      bookingId:'',
      name: '',
      email: '',
      refund_amount: '',
      paymentMode:'Online',
      remarks:"",
	   transactionId:"",
	   trasactionMode:""
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
    const handleOpenModal = (booking) => {
        setFormData({
          name: booking.name,
          email: booking.email,
          refund_amount: "", // You can add additional fields as needed
          bookingId: booking.bookingId,
          mobile: booking.mobile,
          paymentMode:"Online"
        });
        setIsOpen(true);
      };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
      // Handle form submission logic
      setIsOpen(false); // Close the modal after submission
    };

  



const fetchBooking = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/booking/getAllCancelledBooking`);
      setFilteredBooking(response.data); // Set the filtered list
      setAllBookings(response.data); // Store the full list
    } catch (error) {
      console.error('Error fetching Booking:', error);
    }
  };
useEffect(() => {
  
  fetchBooking()

}, []);

 
	  
const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
  
    // If the search box is empty, show all bookings
    if (searchValue === "") {
      setFilteredBooking(allBookings);
    } else {
      // Filter the bookings based on the search term
      const filtered = allBookings.filter((booking) =>
        booking.bookingId.toString().includes(searchValue) || // Search by bookingId
        booking.name.toLowerCase().includes(searchValue) || // Search by customer name
        booking.roomno.toString().includes(searchValue) // Search by room number
      );
  
      // Set the filtered bookings to display
      setFilteredBooking(filtered);
    }
  };

// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const [bookingsPerPage] = useState(10); 
// Calculate pagination
const indexOfLastProduct = currentPage * bookingsPerPage;
const indexOfFirstProduct = indexOfLastProduct - bookingsPerPage;
const currentBooking = filteredBooking.slice(indexOfFirstProduct, indexOfLastProduct);
const totalPages = Math.ceil(filteredBooking.length / bookingsPerPage);
	return (
		<div className='flex-1 overflow-auto relative z-10'>
      <Header title='Refund Section' />
		<motion.div
			className='bg-gray-300 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 m-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
				
			<div className='flex justify-between items-center mb-6'>
			
				<h2 className='text-xl font-semibold text-gray-900'>Booking Cancelled List </h2>
				
				<div className='relative'>
					<input
						type='text'
						placeholder='Search ...'
						className='bg-gray-100 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-900' size={18} />
				</div>
			
			</div>
		
			<div>
			<ToastContainer />
	
    </div>
    
	
    <div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Booking Id
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								CheckIn Date
							</th>
							{/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Photo
							</th> */}
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Customer Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Mobile
							</th>
							
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
							Tariff
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
							Checkout Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Room No
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
							Advance Pay
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
							Total  Room Booked
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
							No of Cancelled Room
							</th>
						
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
					{currentBooking?.map((booking) => (
							<motion.tr
								key={booking.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
									
									{booking.bookingId}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 '>
									
									{booking.checkInDate}
								</td>


								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
								{booking.name}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
									{booking.mobile}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
									{booking.tariff}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.checkOutDate}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.roomno}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.advamount}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.no_of_room}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.roomCount}</td>
								
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
							
									<button className='text-indigo-400 hover:text-indigo-800 mr-2'   onClick={() => handleOpenModal(booking)}>
										<AttachMoney size={18} />
									</button>
								
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
            {/* Modal */}
<div>
    
 {/* Modal */}
 {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4">Refund Details</h2>
              <form onSubmit={handleSubmit}>
              <div className="mb-4">
                  <label className="block text-gray-700">BookingId:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.bookingId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Refund Amount:</label>
                  <input
                    type="text"
                    name="refund_amount"
                    value={formData.refund_amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Payment Mode:</label>
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="mb-4">
					 <label className="block text-gray-700">Transaction Id:</label>
					 <input
					   type="text"
					   name="transactionId"
					   value={formData.transactionId}
					   onChange={handleChange}
					   className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					 />
				   </div>
				   <div className="mb-4">
					 <label className="block text-gray-700">Transaction Medium:</label>
					 <input
					   type="text"
					   name="trasactionMode"
					   placeholder="eg.GPay "
					   value={formData.trasactionMode}
					   onChange={handleChange}
					   className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					 />
				   </div>
				   <div className="mb-4">
					 <label className="block text-gray-700">Remarks:</label>
					 <input
					   type="text"
					   name="remarks"
					  
					   value={formData.remarks}
					   onChange={handleChange}
					   className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					 />
				   </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
</div>

			<div className='flex justify-between mt-4'>
				<button
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className='bg-gray-700 text-gray-100 py-2 px-4 rounded-lg disabled:opacity-50'
				>
					Previous
				</button>
				<div className='text-gray-900'>
					Page {currentPage} of {totalPages}
				</div>
				<button
					onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
					disabled={currentPage === totalPages}
					className='bg-gray-700 text-gray-100 py-2 px-4 rounded-lg disabled:opacity-50'
				>
					Next
				</button>
			</div>
		</motion.div>
		</div>
	);
};
export default RefundTable;

