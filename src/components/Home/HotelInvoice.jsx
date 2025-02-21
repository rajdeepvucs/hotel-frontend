import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { getLocalTime } from "../../utils/dateTime";
import apiClient from "../../api/apiClient";

const HotelInvoice = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  console.log(booking);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  const fetchBoarders = async () => {
    setLoading(true); // Set loading to true when starting the request

    try {
      const response = await apiClient.get(`${baseURL}/api/property/getproperty`);
      setData(response.data.property);
    } catch (error) {
      console.error("Failed to fetch boarders:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes or errors
    }
  };

  useEffect(() => {
    fetchBoarders();
  }, []);

  if (!booking) {
    return <div>No booking information available.</div>;
  }

  const handlePrint = () => {
    saveBookingToDatabase(); // Save to DB before printing
    window.print(); // Triggers the browser's print functionality
    navigate("/");
  };

  const saveBookingToDatabase = async () => {
    try {
      const data = {
        bookingId: booking.bookingId,
        totalAmount: booking.totalAmount,
        balenceAmount: (booking.balenceAmount - (booking?.amountPaid ?? 0)) || 0,
        amountPaid: booking.amountPaid ?? 0,
        paymentMode: booking.paymentMode,
        transactionId: booking.tnxId,
        createdBy: localStorage.getItem("user"),
        paymentTime: getLocalTime(),
        description: "Checkout Time Pay",
      };

      console.log("Data to save:", data);

      const response = await apiClient.post(`${baseURL}/api/account/create`, {
        data,
      });

      if (!response.ok) {
        console.error(`Error ${response.status}: Failed to save booking`);
        throw new Error("Failed to save booking");
      }

      const result = await response.json();
      console.log("Booking saved successfully:", result);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const calculateDayDifference = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate - checkInDate; // Difference in milliseconds
    const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    return dayDifference;
  };

  const daysDifference = calculateDayDifference(
    booking.checkInDate,
    booking.checkOutDate
  );

  const calculateTotal = () => {
    const roomTariff = booking.tariff;
    const subtotal = roomTariff * daysDifference;
    const taxAmount = subtotal * 0.18; // 18% tax
    const advancePayment = booking.advamount || 0; // Default to 0 if no advance
    const totalAmount = subtotal + taxAmount;
    return totalAmount - advancePayment; // Final amount after advance
  };

  const totalAmount = calculateTotal();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-md border rounded-md">
        {/* Bill Header */}
        <div className="text-center mb-6 flex flex-col items-center">
            {data[0]?.propertylogo &&  <img src={`${baseURL}/${data[0]?.propertylogo}`} alt='Logo' className='h-14 w-14 mr-4 rounded-full' />}
          
          <h1 className="text-2xl font-bold">{localStorage.getItem("propertyId")}</h1>
          <p className="text-gray-600">{localStorage.getItem("property_address")}</p>
          <p className="text-gray-600">{localStorage.getItem("owner_contact_no")}</p>
        </div>

        {/* Guest Information */}
        <div className="border-b border-gray-300 mb-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">Guest Information</h2>
          <div className="grid grid-cols-2 gap-y-1">
            <p className="text-gray-600">Booking Id:</p>
            <p className="text-gray-600 font-medium">{booking.bookingId}</p>
            <p className="text-gray-600">Name:</p>
            <p className="text-gray-600 font-medium">
              {booking.gender === "MALE" ? "Mr." : "Mrs."} {booking.name}
            </p>
            <p className="text-gray-600">Contact No:</p>
            <p className="text-gray-600 font-medium">{booking.mobile}</p>
            <p className="text-gray-600">Address:</p>
            <p className="text-gray-600 font-medium">{booking.address}</p>
            <p className="text-gray-600">Check-in Date:</p>
            <p className="text-gray-600 font-medium">
              {booking.checkInDate}:{booking.CheckInTime}
            </p>
            <p className="text-gray-600">Check-out Date:</p>
            <p className="text-gray-600 font-medium">
              {booking.checkOutDate}:{booking.checkOutTime}
            </p>
             <p className="text-gray-600">Total Room:</p>
            <p className="text-gray-600 font-medium">{booking.no_of_room||1}</p>
          </div>
        </div>

        {/* Room Charges */}
         <div className="border-b border-gray-300 mb-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">Room Charges</h2>
          <div className="flex justify-between">
            <span >Room ({booking?.nights} night{Number(booking?.nights) !== 1 ? 's' : ''}):</span>
            <span  className="text-gray-600">(per night)</span>
            <span className="text-gray-600">Rs.{booking.tariff}</span>
          </div>
         
           <div className="flex justify-between">
            <span>Service Charge:</span>
              <span className="text-gray-600">Rs.0</span>
          </div>
            <div className="flex justify-between">
               <span>SGST:</span>
               <span className="text-gray-600">
                 Rs.
                 {parseFloat((booking?.gst / 2).toFixed(2))}
               </span>
             </div>
             <div className="flex justify-between">
               <span>CGST:</span>
               <span className="text-gray-600">
                 Rs.
                 {parseFloat((booking?.gst / 2).toFixed(2))}
               </span>
             </div>
             <div className="flex flex-row justify-between items-center p-2">
               <span className="text-sm text-gray-900">GST:</span>
                <span className="text-sm text-gray-900 font-medium">
               {booking.tariff > 7500 ? "18%" : "12%"}
@
{booking?.gst}
               </span>
             </div>
          <div className="flex justify-between">
            <span>Advance Payment:</span>
             <span className="text-gray-600">Rs.{booking.advamount || 0}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mb-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">Total</h2>
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span className="text-gray-900">Rs.{booking.totalAmount}</span>
          </div>
        </div>

        {/* Print Button */}
        <div className="text-center">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelInvoice;