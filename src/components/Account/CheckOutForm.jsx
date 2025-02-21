import React, { useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import apiClient from "../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CheckOutForm = () => {
  const [paymentMode, setPaymentMode] = useState("cash");
  const [tnxId, setTnxId] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const location = useLocation();
  const { book } = location.state || {};

  const navigate = useNavigate();
  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };
  const handleAmountPaidChange = (e) => {
    const value = Number(e.target.value);

    if (value > book?.balance) {
      toast.error("Paid amount cannot exceed the remaining balance.");
    }

    setAmountPaid(value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const now = new Date();
    const checkOutTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    const formData = {
      id: book.bookingId,
      balance: book.balance - amountPaid,
      checkOutTime: checkOutTime,
      status: "CheckOut",
    };

    try {
      const response = await apiClient.post(`${baseURL}/api/booking/checkout/${book.bookingId}`, { formData });
      if (response.status === 200) {
        toast.success("Booking status updated successfully!");
        navigate("/bill", {
          state: { booking: { ...book, paymentMode, checkOutTime, amountPaid, tnxId } },
        });
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating the booking status.");
    }
  };

  const textFieldStyles = {
    "& label": { color: "white" },
    "& label.Mui-focused": { color: "white" },
    "& .MuiInput-underline:before": { borderBottomColor: "white" },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "white" },
    "& .MuiInput-underline:after": { borderBottomColor: "white" },
    "& .MuiInputBase-input": { color: "white" },
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="CheckOut" />
      <main className="max-w-8xl mx-auto py-6 px-4 lg:px-8">
        <div
          style={{
            backgroundImage: "url('https://media.istockphoto.com/id/1192128830/photo/receptionist-giving-keys-to-hotel-guest.jpg?s=612x612&w=0&k=20&c=tEsOZpUefkgdGek7aildpx8_Elur6EvXZ-3jVs4l7gQ=')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded shadow-lg w-2/3 h-full text-white">
            <Typography variant="h6" component="h2" mb={2}>
              Details
            </Typography>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 ">
                <TextField
                  sx={textFieldStyles}
                  label="Booking Id"
                  name="id"
                  value={book?.bookingId}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  sx={textFieldStyles}
                  label="Name"
                  name="name"
                  value={book?.name}
                  fullWidth
                  margin="normal"
                  required
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  sx={textFieldStyles}
                  label="Room No"
                  name="advance"
                  value={book?.roomno || 0}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  sx={textFieldStyles}
                  label="No Of Room"
                  name="advance"
                  value={book?.no_of_room || 1}
                  fullWidth
                  margin="normal"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <TextField
                  sx={textFieldStyles}
                  label="Total Amount"
                  name="tariff"
                  value={book?.totalAmount}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  sx={textFieldStyles}
                  label="Advance Payment"
                  name="advance"
                  value={book?.advamount || 0}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  sx={textFieldStyles}
                  label="Balance Amount"
                  name="balance"
                  value={book?.balance || 0}
                  fullWidth
                  margin="normal"
                  required
                  type="number"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <TextField
                  sx={textFieldStyles}
                  label="Amount Paid"
                  name="balance"
                  onChange={handleAmountPaidChange}
                  fullWidth
                  margin="normal"
                  required
                  type="number"
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="payment-mode-label" sx={{ color: "white" }}>
                    Payment Mode
                  </InputLabel>
                  <Select
                    labelId="payment-mode-label"
                    value={paymentMode}
                    onChange={handlePaymentModeChange}
                    label="Payment Mode"
                    sx={{ color: "white", "& .MuiSelect-icon": { color: "white" } }}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                  </Select>
                </FormControl>
                {paymentMode!=="cash"?
                 (<TextField
                  sx={textFieldStyles}
                  label="Transaction Id"
                  name="balance"
                  onChange={(e) => setTnxId(e.target.value)}
                  fullWidth
                  margin="normal"
                  type="text"
                  required
                />):null}
              
              </div>
              <Box display="flex" justifyContent="center" gap={4} mt={2}>
  {/* Back Button */}
  <motion.div whileTap={{ scale: 0.85 }}>
    <Button 
      variant="contained" 
      color="secondary" 
      onClick={() => navigate(-1)} // Navigate to the previous page
    >
      Back
    </Button>
  </motion.div>

  {/* Submit Button */}
  <motion.div whileTap={{ scale: 0.85 }}>
    <Button 
      type="submit" 
      variant="contained" 
      color="primary" 
      onClick={handleSubmit} // Trigger submit logic
    >
      Submit
    </Button>
  </motion.div>
</Box>

            </form>
          </Box>
        </div>
      </main>
    </div>
  );
};

export default CheckOutForm;
