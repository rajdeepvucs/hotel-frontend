import { motion } from "framer-motion";
import { Edit, Search, Trash2 ,CirclePlus, BookUser,RefreshCw } from "lucide-react";
import { useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from "../../../config";


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
const TodayPayment = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredAccount, setFilteredAccount] = useState([]);
	
	const [account,setAccount]=React.useState([]);
 
	const navigate=useNavigate()
;

	const fetchAccounts = async () => {
		try {
		  const response = await axios.get(`${baseURL}/api/account/getTodayAccountDetails`);
		
		  setFilteredAccount(response.data.account)
		} catch (error) {
		  console.error('Error fetching Accounts:', error);
		}
	  };
  useEffect(() => {
    
	fetchAccounts()
  
  }, []);

 
	  
	 
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
		<div className='flex-1 overflow-auto relative z-10'>
      <Header title='Accounts Detail' />
		<motion.div
			className='bg-gray-300 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 m-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
				
			<div className='flex justify-between items-center mb-6'>
			
				<h2 className='text-xl font-semibold text-gray-900'>Accounts </h2>
				
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
						<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Booking Id
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Moblie
							</th>
						
							
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Room No
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Total Amount
							</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Amount Received
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Due
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
							Previous Due
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								paymentMode
							</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Transaction Id
							</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Received Time
							</th>
                           
                            <th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Description
							</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
								Collected By
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
									<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>
									
									{booking.bookingId}
								</td>
								<td className='px-3 py-4 whitespace-nowrap text-sm  text-gray-800 '>
									
									{booking.name}
								</td>
								<td className="px-3 py-4 whitespace-nowrap text-sm text-gray-800">
                                {booking.mobile}
                            </td>

                            <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>
									{booking.roomno}
								</td>
                                <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.totalAmount}</td>
								<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>
									{booking.amountPaid}
								</td>
								<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.balenceAmount}</td>
								<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.previousBalance|| 0}</td>
								<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.paymentMode}</td>
								<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.transactionId}</td>
								<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.paymentTime}	</td>

								<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.description}	</td>
                                
                                <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.createdBy}	</td>
								
									
							
							</motion.tr>
						))}
					</tbody>
				</table>
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
export default TodayPayment;