import React from "react";
import { useLocation ,useNavigate} from "react-router-dom";
import { baseURL } from '../../../config';
import { getLocalTime } from "../../utils/dateTime";
const HotelInvoice = () => {
  const location = useLocation();
  const booking = location.state?.booking;
 console.log(booking)
 const navigate=useNavigate();


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
        balenceAmount: (booking.balenceAmount - (booking?.amountPaid ?? 0))||0,
        amountPaid: booking.amountPaid ?? 0,
        paymentMode: booking.paymentMode,
        transactionId: booking.tnxId,
        createdBy: localStorage.getItem("user"),
        paymentTime: getLocalTime(),
        description: "Checkout Time Pay",
      };
  
      console.log("Data to save:", data);
  
      const response = await fetch(`${baseURL}/api/account/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

  const daysDifference = calculateDayDifference(booking.checkInDate, booking.checkOutDate);

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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{localStorage.getItem("property_name")}</h1>
          <p className="text-gray-600">{localStorage.getItem("property_address")}</p>
          <p className="text-gray-600">{localStorage.getItem("owner_contact_no")}</p>
        </div>

        {/* Guest Information */}
        <div className="border-b border-gray-300 mb-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">Guest Information</h2>
          <p className="text-gray-600">Booking Id: {booking.bookingId}</p>
          <p className="text-gray-600">Name:{booking.gender==="MALE"   ?"Mr." :"Mrs."      }{} {booking.name}</p>
          <p className="text-gray-600">Contact No: {booking.mobile}</p>
          <p className="text-gray-600">Address: {booking.address}</p>
          <p className="text-gray-600">Check-in Date: {booking.checkInDate}</p>
          <p className="text-gray-600">Check-out Date: {booking.checkOutDate}</p>
          <p className="text-gray-600">Total Room: {booking.no_of_room}</p>
        </div>

        {/* Room Charges */}
        <div className="border-b border-gray-300 mb-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">Room Charges</h2>
          <div className="flex justify-between">
            <span>Room ({daysDifference} night{daysDifference !== 1 ? 's' : ''}):</span>
            <span>(per night)</span>
            <span>Rs.{booking.tariff}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Charge:</span>
            <span>Rs.0</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes:</span>
            <span>Rs.{(booking.tariff * daysDifference * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Advance Payment:</span>
            <span>Rs.{booking.advamount||0}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mb-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">Total</h2>
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span>Rs.{booking.totalAmount}</span>
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
