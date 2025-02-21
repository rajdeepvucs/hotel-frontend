import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { getLocalTime } from "../../utils/dateTime";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../common/Header";
import { motion } from "framer-motion";
import apiClient from "../../api/apiClient";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state;
  const bookingId = book;

  const [formData, setFormData] = useState({
    amountPaid: "",
    transactionId: "",
    paymentMode: "cash",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  // Fetch payment types from an API
  useEffect(() => {
    const payPayment = async () => {
      setLoading(true); // Start loading
      try {
        const response = await apiClient.get(
          `${baseURL}/api/account/getParticularBookingDetails/${bookingId}`
        );
        setData(response.data); // Assuming API returns an array of payment types
      } catch (err) {
        setError("Failed to load payment types");
        console.error(err);
      } finally {
        setLoading(false); // End loading
      }
    };

    payPayment();
  }, []); // Empty dependency array ensures it runs only once
  console.log("data", data);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated form data
    const updatedFormData = {
      ...formData,
      bookingId,
      totalAmount: data?.totalAmount,
      balenceAmount: data?.balance - formData?.amountPaid,
      createdBy: localStorage.getItem("user"),
      paymentTime: getLocalTime(),
      description: "Pay After Checkin",
    };

    console.log("Updated Form Data:", updatedFormData);

    try {
      // Make the API call with the updated form data
      const response = await apiClient.post(
        `${baseURL}/api/account/addDatas`,
        updatedFormData
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Payment Recorded successfully");
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast.error("Payment Recorded unsuccessful");
      }
    } catch (error) {
      console.error("Error submitting payment:", error.message, error.response?.data);
      toast.error("An error occurred while recording the payment.");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
    <Header 
title= "Payment"
/>
<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
    <div
     
      style={{
        backgroundImage: "url('https://cdn.pixabay.com/photo/2021/03/19/13/15/bill-6107551_640.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
    justifyContent: "center",
    alignItems: "center",
      }}
    >
      {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"> */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded shadow-lg w-2/3 h-full">
          <h2 className="text-2xl font-bold mb-4 text-white">Payment Form</h2>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white">BookingId:</label>
              <input
                type="text"
                name="amount"
                defaultValue={data?.bookingId}
                readOnly
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Name:</label>
              <input
                type="text"
                name="amount"
                defaultValue={data?.name}
                readOnly
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Total Amount:</label>
              <input
                type="number"
                name="amount"
                defaultValue={(data?.totalAmount)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Balance Amount:</label>
              <input
                type="number"
                name="amount"
                defaultValue={(data?.balance)}
                readOnly
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block text-white">Amount:</label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Payment Mode:</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-white"
                >
                  <option value="">Select Payment Mode</option>
                  <option value="online" className="text-white">Online</option>
                  <option value="cash" className="text-neutral-950">Cash</option>
                  <option value="card" className="text-neutral-950">Card</option>
                </select>
              </div>
              {formData.paymentMode !== "cash" && (
                <div className="mb-4">
                  <label className="block text-white">Transaction Id:</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
  {/* Back Button */}
  <motion.button
    type="button"
    className="px-4 py-2 bg-gray-500 text-white rounded"
    whileTap={{ scale: 0.85 }}
    onClick={() => navigate(-1)}
  >
    Back
  </motion.button>

  {/* Submit Button */}
  <motion.button
    type="submit"
    className="px-4 py-2 bg-blue-500 text-white rounded"
    whileTap={{ scale: 0.85 }}
    onClick={handleSubmit}
  >
    Submit
  </motion.button>
</div>

          </form>
        </div>
      {/* </div> */}
    </div>
    </main>
    </div>
  );
};

export default PaymentForm;
