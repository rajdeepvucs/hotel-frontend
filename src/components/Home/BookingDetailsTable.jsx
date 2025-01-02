import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  CirclePlus,
  BookUser,
  RefreshCw,
} from "lucide-react";
import { Tooltip } from '@mui/material';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../config";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as React from "react";
import { format } from "date-fns";
import { FaMale, FaChild } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {getLocalTime}  from '../../utils/dateTime';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const BookingDetailsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [book, setBook] = React.useState([]);
  const handleOpen = (booking) => {
    setBook(booking);
    setOpen(true);
  };
  

  const handleClose = () => setOpen(false);
  const handleOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => setOpen1(false);
  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: "",
    name: "",
    email: "",
    refund_amount: "",
    paymentMode: "Online",
    remarks: "",
    transactionId: "",
    trasactionMode: "",
    no_of_rooms: "",
    advamount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleOpenModal = (booking) => {
    setFormData({
      name: booking.name,
      email: booking.email,
      refund_amount: "",
      bookingId: booking.bookingId,
      mobile: booking.mobile,
      paymentMode: "Online",
      no_of_room: booking.no_of_room,

      advamount: booking.advamount,
    });
    setIsOpen(true);
  };
  // refund submit
  const handleSubmit1 = (e) => {
    e.preventDefault();
    const currentDateTime = new Date().toISOString();
    setFormData((prevState) => ({
      ...prevState,
      paymentDate: currentDateTime,
    }));
    const formattedDate = format(new Date(currentDateTime), "hh:mm a");

    // Handle form submission logic
    setIsOpen(false); // Close the modal after submission
  };
  const handleDelete = (booking) => {
    setSelectedBooking(booking); // Store the selected booking
    setOpenModal(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (!selectedBooking) return; // Exit if no booking selected

    try {
      const response = await axios.post(
        `${baseURL}/api/booking/changeStatusBooking/${selectedBooking.id}`,
        {
          status: "Cancelled",
        }
      );

      if (response.status === 200) {
        toast.success("Booking status updated successfully!");
        fetchBooking();
        handleOpenModal(selectedBooking);
        setIsOpen(true);
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating the booking status.");
    } finally {
      setOpenModal(false); // Close the modal after operation
      setSelectedBooking(null); // Clear selected booking
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    setSelectedBooking(null); // Clear selected booking
  };

  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = React.useState("cash"); // Default to 'cash'
  const [tnxId, setTnxId] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);
  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Here you can process the form data
    const now = new Date();
    const checkOutTime =
      now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    const formData = {
      id: book.bookingId,

      balance: (book.balance||0) - amountPaid,
    
      checkOutTime: getLocalTime(),
      status: "CheckOut",
    };

    handleClose1();
    handleClose();
    try {
      // Assuming your API endpoint for changing status looks like this
      const response = await axios.post(
        `${baseURL}/api/booking/checkout/${book.bookingId}`,
        {
          formData,
        }
      );

      if (response.status === 200) {
        toast.success("Booking status updated successfully!");
        fetchBooking();
        navigate("/bill", {
          state: { booking: { ...book, paymentMode,checkOutTime,amountPaid,tnxId } },
        });
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating the booking status.");
    }
  };
  const [allBookings, setAllBookings] = useState([]); // Store all bookings

  // Update fetchBooking to also set allBookings
  const fetchBooking = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/booking/getAllCheckInBooking`);
      setFilteredBooking(response.data); // Set the filtered list
      setAllBookings(response.data); // Store the full list
    } catch (error) {
      console.error("Error fetching Booking:", error);
    }
  };
  useEffect(() => {
    fetchBooking();
  }, []);
  const handleDetail = (booking) => {
    navigate("/bookingdetails", { state: { booking } });
  };
  const handleEdit = (booking) => {
    navigate("/bookingedit", { state: { booking } });
  };
  const handleClick = () => {
    navigate("/booking");
  };

  const handleCheckIn = async () => {
    try {
      // Assuming your API endpoint for changing status looks like this
      const response = await axios.post(
        `${baseURL}/api/booking/changeStatusBooking/${book.id}`,
        {
          status: "CheckIn", // or any other status you want to set
        }
      );

      if (response.status === 200) {
        toast.success("Booking status updated successfully!");
        setOpen(false);
        fetchBooking();

      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating the booking status.");
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // If the search box is empty, show all bookings
    if (searchValue === "") {
      setFilteredBooking(allBookings);
    } else {
      // Filter the bookings based on the search term
      const filtered = allBookings.filter(
        (booking) =>
          booking.bookingId.toString().includes(searchValue) || // Search by bookingId
          booking.name.toLowerCase().includes(searchValue) || // Search by customer name
          booking.roomno.toString().includes(searchValue)|| // Search by room number
          booking.checkInDate.toString().includes(searchValue) ||
          booking.mobile.toString().includes(searchValue) 
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
  const currentBooking = filteredBooking.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredBooking.length / bookingsPerPage);
  return (
    <motion.div
      className="bg-gray-300 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Booking </h2>

        <div className="relative">
          <input
            type="text"
            placeholder="Search ..."
            className="bg-gray-100 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-900" size={18} />
        </div>
      </div>
      <ToastContainer />
      <div className="flex  justify-between items-center mb-6">
        
        <div className="flex flex-row">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Advance Booking
          </h2>
          <button
            onClick={handleClick}
            className="inline-flex items-center p-1 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <CirclePlus className="w-8 h-8" />
          </button>
        </div>
        <div className="flex flex-row">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Registration
          </h2>
          <button
            onClick={()=>{navigate("/groupbooking")}}
            className="inline-flex items-center p-1 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <CirclePlus className="w-8 h-8" />
          </button>
        </div>
      </div>

    


<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-700">
    <thead>
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">RoomNo</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Customer Name</th>
        <th className='px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>Mobile</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">CheckInDate</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">CheckOutDate</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Nights</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">No of Occupants</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Total Amount</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Advance Paid</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Due</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-700">
      {currentBooking?.map((booking) => (
        <motion.tr
          key={booking.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.roomno}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{booking.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.mobile}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.checkInDate} {booking.CheckInTime}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.checkOutDate}{booking.checkOutTime}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking?.nights}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            <FaMale className="inline mr-2" /> {booking.no_of_adults || 0}
            <FaChild className="inline ml-4 mr-2" /> {booking.no_of_minor || 0}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.totalAmount}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.advamount || 0}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.balance || 0}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.status}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
            <Tooltip title="View Details" arrow>
              <button
                className="text-indigo-400 hover:text-indigo-800 mr-2"
                onClick={() => handleDetail(booking)}
              >
                <BookUser size={18} />
              </button>
            </Tooltip>
            <Tooltip title="Edit" arrow>
              <button
                className="text-indigo-400 hover:text-indigo-800 mr-2"
                onClick={() => handleEdit(booking)}
              >
                <Edit size={18} />
              </button>
            </Tooltip>
            {/* <Tooltip title="Delete" arrow>
              <button
                className="text-red-400 hover:text-red-300 "
                onClick={() => handleDelete(booking)}
              >
                <Trash2 size={18} />
              </button>
            </Tooltip> */}
            <Tooltip title="CheckOut" arrow>
              <button
                className="text-indigo-400 hover:text-red-300"
                onClick={() => handleOpen(booking)}
              >
                <RefreshCw size={18} />
              </button>
            </Tooltip>
          </td>
        </motion.tr>
      ))}
    </tbody>
  </table>
</div>

      {/* First Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              color: "gray",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Modal Content */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="secondary" onClick={handleOpen1}>
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
            <div className="grid grid-cols-2 gap-4">
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
              fullWidth
              required
              type="text"
            />
            
            </div>
       
            <div className="grid grid-cols-3 gap-4">
            <TextField
              label="Total Amount"
              name="tariff"
              value={book.totalAmount}
              fullWidth
              margin="normal"
              required
            />
             <TextField
          label="Advance Payment"
          name="advance"
          value={book?.advamount||0}
          fullWidth
          margin="normal"
          required
        />
            <TextField
          label="Balance Payment"
          name="balance"
          value={book?.balance}
          fullWidth
          margin="normal"
          required
          type="number"
        />
        </div>
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
                <MenuItem value="card">Card</MenuItem>
              </Select>
            </FormControl>
            {paymentMode!="cash"?(
                  <TextField
                  label="Transaction Id"
                  name="balance"
                 onChange={(e)=>{setTnxId(e.target.value)}}
                  fullWidth
                  margin="normal"
                 
                  type="text"
                />
            ):null}
        
         <TextField
          label="Amount Paid"
          name="balance"
         onChange={(e)=>{setAmountPaid(e.target.value)}}
          fullWidth
          margin="normal"
          required
          type="number"
        />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose1}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      {/* Confirmation Cancel Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Confirm Cancellation
          </Typography>
          <Typography variant="body1">
            Are you sure you want to cancel this booking?
          </Typography>
          <div className="flex space-x-2 mt-4">
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="secondary"
            >
              Confirm
            </Button>
            <Button onClick={handleCloseModal} variant="outlined">
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
      {/* Refund Modal */}

      <div>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2">
              <div className="bg-red-100 p-4 rounded shadow-lg ">
                <h2 className="text-2xl font-bold mb-4 text-center ">
                  Cancellation Details
                </h2>
              </div>
              <form onSubmit={handleSubmit1}>
                {/* Row for BookingId and Name */}
                <div className="flex mb-4">
                  <div className="w-1/2 pr-2">
                    <label className="block text-gray-700">BookingId:</label>
                    <input
                      type="text"
                      name="bookingId"
                      value={formData.bookingId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className=" flex mb-4">
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">Mobile:</label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {/* Advance Amount  */}
                <div className=" flex mb-4">
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">
                      No of Room Booked:
                    </label>
                    <input
                      type="text"
                      name="no_of_room"
                      value={formData.no_of_room}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">Advance Pay:</label>
                    <input
                      type="text"
                      name="advamount"
                      value={formData.advamount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {/* Payment Mode */} {/* Transaction Id */}
                <div className=" flex mb-4">
                  <div className="w-1/2 pl-2">
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
                  {/* Remarks */}
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">Remarks:</label>
                    <input
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div
                  className={`${
                    formData.paymentMode === "Online" ? "flex mb-4" : "hidden"
                  }`}
                >
                  {/* Transaction Medium */}
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">
                      Transaction Medium:
                    </label>
                    <input
                      type="text"
                      name="trasactionMode"
                      placeholder="eg. GPay"
                      value={formData.trasactionMode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">
                      Transaction Id:
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-between">
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
      {/* Pagination Button */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-700 text-gray-100 py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-gray-900">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-700 text-gray-100 py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};
export default BookingDetailsTable;
