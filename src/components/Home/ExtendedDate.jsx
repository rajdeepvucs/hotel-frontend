import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoomStatusTable from "../common/RoomStatusTable";
import { baseURL } from "../../../config";

function ExtendedDate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { boarders, room } = location.state || {};

  const [checkOutDate, setCheckOutDate] = useState("");
  const [error, setError] = useState("");
  const [tariff, setTariff] = useState(boarders[0]?.tariff || 0);
  const [gstCol, setGstCol] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateNights = () => {
    const previousDate = new Date(boarders[0]?.checkOutDate);
    const selectedDate = new Date(checkOutDate);
    const calculatedNights =
      previousDate && selectedDate
        ? Math.ceil((selectedDate - previousDate) / (1000 * 60 * 60 * 24))
        : 0;

    return calculatedNights > 0 ? calculatedNights : 1; // Ensure at least 1 night
  };

  const calculateTotals = () => {
    const nights = calculateNights();
    const roomTariff = parseFloat(tariff);
    const taxRate = 1.18; // 18% tax multiplier
    const gst = nights * 0.18 * roomTariff;
    const total = nights * taxRate * roomTariff + parseInt(boarders[0]?.totalAmount || 0, 10);

    setGstCol(gst.toFixed(2));
    setTotalAmount(total.toFixed(2));
  };

  const handleCheckOutDateChange = (e) => {
    const selectedDate = e.target.value;
    const previousCheckOutDate = new Date(boarders[0]?.checkOutDate);

    if (new Date(selectedDate) < previousCheckOutDate) {
      setError("Check-Out date cannot be in the past.");
    } else {
      setError("");
      setCheckOutDate(selectedDate);
      calculateTotals(); // Recalculate totals on date change
    }
  };

  const handleSubmit = async () => {
    const payload = {
      checkOutDate,
      bookingId: boarders[0]?.bookingId,
      roomNo: boarders[0]?.roomno,
      nights: Number(calculateNights()) + Number(boarders[0]?.nights),
      totalAmount: totalAmount,
      gst: gstCol,
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post(`${baseURL}/api/booking/extend_booking`, payload);
      console.log("Response:", response.data);

      if (response.status === 200) {
        toast.success(response.data.message || "Booking Extended successfully");
        navigate("/bookingconfirmation", { state: { bookingId: boarders[0]?.bookingId } });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to extend booking. Please try again.");
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Extend Reservation Date" />
        <main className="max-w-7xl mx-auto py-6 px-2 lg:px-8 bg-white">
          <ToastContainer />
          <div className="flex flex-col justify-center overflow-auto">
            <div className="text-black text-left font-bold">Room Status:</div>
            <RoomStatusTable />
            <div className="grid grid-cols-7 gap-2 space-y-1 mt-4">
              {/* Input fields */}
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="checkOutDate" className="text-base">
                  Check-Out-Date<span className="text-red-500">*</span>
                </label>
                <input
                  id="checkOutDate"
                  type="date"
                  defaultValue={boarders[0]?.checkOutDate}
                  onChange={handleCheckOutDateChange}
                  className="border p-2 rounded-md w-full"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="roomNo" className="text-base">
                  Total Amount<span className="text-red-500">*</span>
                </label>
                <input
                  id="roomNo"
                  type="text"
                  value={totalAmount}
                  readOnly
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Submit
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default ExtendedDate;
