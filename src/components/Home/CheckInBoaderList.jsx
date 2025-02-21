import { motion } from "framer-motion";
import { Edit, Search, Trash2 ,CirclePlus, BookUser,RefreshCw } from "lucide-react";
import { useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import apiClient from "../../api/apiClient";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from "../../../config";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField,FormControl,InputLabel,Select ,MenuItem} from "@mui/material";
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
const CheckInBoaderList = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredBooking, setFilteredBooking] = useState([]);
	const [open, setOpen] = React.useState(false);
	const [open1, setOpen1] = React.useState(false);
	const [book,setBook]=React.useState([]);
  const handleOpen = (booking) =>{setBook(booking);setOpen(true)};
  const handleClose = () => setOpen(false);
  const handleOpen1 = () =>{setOpen1(true)};
  const handleClose1 = () => setOpen1(false);
//   const handlePrint = () => {
//     window.print();
//   };
	const navigate=useNavigate()
	const [paymentMode, setPaymentMode] = React.useState('cash'); // Default to 'cash'

	const handlePaymentModeChange = (event) => {
	  setPaymentMode(event.target.value);
	};
  
	const handleSubmit = async(event) => {
	  event.preventDefault();
	  // Here you can process the form data
	  const now=new Date();
	  const checkOutTime=now.getHours()+':' +now.getMinutes()+ ':'+now.getSeconds()
	  const formData = {
		id: book.bookingId,
	
		balance: book.tariff - book.advamount,
		paymentMode: paymentMode,
		checkOutTime:checkOutTime,
		status: 'CheckOut'
	  };
  
	  
	  
	  handleClose1();
	  handleClose();
	  try {
		// Assuming your API endpoint for changing status looks like this
		const response = await apiClient.post(`${baseURL}/api/booking/checkout/${book.bookingId}`, {
		formData
		});
	
		if (response.status === 200) {
		  toast.success('Booking status updated successfully!');
		  fetchBooking();
		  navigate("/bill", { state: { booking:{...book,paymentMode,checkOutTime }} })
		  
		} else {
		  toast.error('Failed to update booking status.');
		}
	  } catch (error) {
		console.error("Error updating booking status:", error);
		toast.error('An error occurred while updating the booking status.');
	  }
	};
	const [allBookings, setAllBookings] = useState([]); // Store all bookings

	// Update fetchBooking to also set allBookings
	const fetchBooking = async () => {
	  try {
		const response = await apiClient.get(`${baseURL}/api/getTotalRoomBookedDetails`);
		setFilteredBooking(response.data.totalRoomsBooked); // Set the filtered list
		setAllBookings(response.data); // Store the full list
	  } catch (error) {
		console.error('Error fetching Booking:', error);
	  }
	};
  useEffect(() => {
    
	fetchBooking()
  
  }, []);
const handleDetail=(booking)=>{
	navigate('/bookingdetails', { state: { booking } });
}
  const handleEdit = (product) => {
	
  };
	const handleClick = () => {
		navigate('/booking')
	
	  };
	  const handleDelete = async (booking) => {
		// Show a confirmation dialog before proceeding with deletion
		const confirmDelete = window.confirm("Are you sure you want to cancel this booking?");
		
		if (!confirmDelete) {
		  
		  return;
		}
	  
		try {
		  const response = await apiClient.post(`${baseURL}/api/booking/changeStatusBooking/${booking.id}`, {
		
			status: 'Cancelled', 
		  });
	  
		  if (response.status === 200) {
			toast.success('Booking status updated successfully!');
			fetchBooking();
			console.log(response.data);
		  } else {
			toast.error('Failed to update booking status.');
		  }
		} catch (error) {
		  console.error("Error updating booking status:", error);
		  toast.error('An error occurred while updating the booking status.');
		}
	  };
	  
	  const handleCheckIn = async () => {
		try {
		  // Assuming your API endpoint for changing status looks like this
		  const response = await apiClient.post(`${baseURL}/api/booking/changeStatusBooking/${book.id}`, {
			status: 'CheckIn', // or any other status you want to set
		  });
	  
		  if (response.status === 200) {
			toast.success('Booking status updated successfully!');
			setOpen(false);
			fetchBooking();
			console.log(response.data);
			// You can update your UI here, like removing the item from a list or refreshing the data
		  } else {
			toast.error('Failed to update booking status.');
		  }
		} catch (error) {
		  console.error("Error updating booking status:", error);
		  toast.error('An error occurred while updating the booking status.');
		}
	  }
	  
	 
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
		<div className="flex-1 overflow-auto relative z-10">
    <Header title="Present Guest" />
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
		<motion.div
			className='bg-gray-300 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
				
			<div className='flex justify-between items-center mb-6'>
			
				<h2 className='text-xl font-semibold text-gray-900'>Present Guest List </h2>
				
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
			<div className='flex justify-start items-center mb-6'>
      <h2 className="text-xl font-semibold text-gray-900">Add Advance Booking</h2>
      <button onClick={handleClick} className="inline-flex items-center p-2 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        <CirclePlus className="w-6 h-6" />
      </button>
	  </div>
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
							Status
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
								{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
  <img
    src={`${baseURL}/${booking.photo}`}  // Replace this with the actual image source
    alt={booking.name}
    className="w-10 h-10 rounded-full object-cover"
  />
</td> */}

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
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>{booking.status}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
								<button className='text-indigo-400 hover:text-indigo-800 mr-2' onClick={()=>{handleDetail(booking)}}>
										<BookUser size={18} />
									</button>
									<button className='text-indigo-400 hover:text-indigo-800 mr-2' onClick={()=>{handleEdit(booking)}}>
										<Edit size={18} />
									</button>
									<button className='text-red-400 hover:text-red-300' onClick={()=>{handleDelete(booking)}}>
										<Trash2 size={18} />
									</button>
									<button className='text-indigo-400 hover:text-red-300' onClick={()=>{handleOpen(booking)}}>
										<RefreshCw size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
			<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Box display="flex" justifyContent="center" mt={2}>
      {/* <Button variant="contained" color="primary" onClick={handleCheckIn}>
        CheckIn
      </Button> */}
      <Button variant="contained" color="secondary"onClick={handleOpen1} >
        CheckOut
      </Button>
    </Box>
  </Box>
</Modal>
{/* Modal Check out */}
<Modal
        open={open1}
        onClose={handleClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            CheckOut Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Booking Id"
              name="id"
              value={book.bookingId}
             
              fullWidth
              margin="normal"
              required
            />
          <TextField
  label="Name"
  name="name"
  value={book.name} 
  margin="normal"
  required
  type="text"
/>
<TextField
              label="Tariff"
              name="tariff"
              value={book.tariff}
             
              fullWidth
              margin="normal"
              required
            />
			<TextField
              label="Advance Payment"
              name="advance"
              value={book.advamount}
             
              fullWidth
              margin="normal"
              required
            />
				<TextField
              label="Balance Payment"
              name="balance"
              value={book.tariff- book.advamount}
             
              fullWidth
              margin="normal"
              required
			   type="number"
            />
			{/* Payment Mode Selection */}
			<FormControl fullWidth margin="normal" required>
            <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
            <Select
              labelId="payment-mode-label"
              value={paymentMode}
              onChange={handlePaymentModeChange}
              label="Payment Mode"
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="online">Online</MenuItem>
            </Select>
          </FormControl>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button type='submit' variant="contained" color="primary">
                Submit
              </Button>
              <Button variant="contained" color="secondary" onClick={handleClose1}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
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
		</main>
		</div>
	);
};
export default CheckInBoaderList;