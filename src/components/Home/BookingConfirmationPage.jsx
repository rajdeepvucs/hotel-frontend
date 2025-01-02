import React,{useEffect,useState} from 'react';
import Header from '../common/Header';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { baseURL } from '../../../config';
import { getLocalTime } from "../../utils/dateTime";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate} from "react-router-dom";
function BookingConfirmationPage() {
    const [data,setData]=useState([]);
    const [disamount, setDisamount] = useState(0);
    const [totalAmt, setTotalAmt] = useState(0);
  const [selectedMode, setSelectedMode] = useState("cash");
  const [transactionId, setTransactionId] = useState("");
  const [adv, setadv] = useState(0);
    const location=useLocation()
    const navigate=useNavigate()
    const {bookingId}=location?.state
   
    useEffect(() => {
         if (bookingId) 
            { const fetchBookingDetails = async () => { 
                try { 
                    const response = await axios.get(`${baseURL}/api/booking/getParticularBooking/${bookingId}`); 
                console.log("Booking Details:", response.data); 
            setData(response.data)}
     catch (error)
      { console.error("Error fetching booking details:", error); } }; 
      fetchBookingDetails(); } 
      else { console.log("No bookingId found in state"); }
     }, [bookingId]);
     const handleInputChange = (e) => {
        setDisamount(e.target.value);
      };
      const handleInputChangeAdv = (e) => {
        setadv(e.target.value);
      };
    
      const handleInputChangeTrId = (e) => {
        setTransactionId(e.target.value);
      };
    
      const handlePaymentModeChange = (e) => {
        setSelectedMode(e.target.value);
      };
      const handleSubmit = async () => {
        try {
          const payload = {
            bookingId,
    
            totalAmount: data[0]?.totalAmount-disamount,
            discount: disamount,
            advamount: parseFloat(adv) + Number(data[0]?.advamount || 0),
            amountPaid:adv, 
            balance: data[0]?.balance-disamount-adv,
            paymentMode: selectedMode,
            transactionId,
            createdBy: localStorage.getItem("user"),
            paymentTime: getLocalTime(),
            description: "Advance paid",
          };
    
          const response = await axios.post(
            `${baseURL}/api/booking/submitBooking`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.status === 200) {
            toast.success("Booking details submitted successfully!");
            
            // Delay navigation by 2 seconds (2000 ms)
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            toast.error("Failed to submit booking details. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting data:", error);
          toast.error(
            error.response?.data?.message || "Failed to submit booking details."
          );
        }
      };
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Booking Summary" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <ToastContainer />
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 rounded-lg">
          <div className="text-center text-white text-4xl font-semibold">
            Review Your Booking
          </div>
        </nav>

        {/* Absolute Positioning for Two Columns */}
        <div className="relative mt-0">
          <div className="absolute -top-2 left-0 w-full flex gap-4">
            {/* Column 1 */}
            <div className="border w-3/5 border-gray-300 rounded-md p-3 shadow-md relative bg-white ml-2">
  <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
    Booking Summary
  </h2>
  
  <div className="grid grid-cols-2 gap-y-1 mt-2 gap-2">
  <p className="text-sm text-gray-700">Booking Id:</p>
  <p className="text-sm text-gray-900 font-medium">{data[0]?.bookingId}</p>
    <p className="text-sm text-gray-700">Booking Person Name:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.name}</p>
    <p className="text-sm text-gray-700">CheckInDate:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.checkInDate} {data[0]?.CheckInTime}</p>
    <p className="text-sm text-gray-700">CheckOutDate:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.checkOutDate}</p>
    <p className="text-sm text-gray-700">Number of Rooms:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.no_of_room || 1}</p>
    <p className="text-sm text-gray-700">Number of Adults:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.no_of_adults}</p>
    <p className="text-sm text-gray-700">Number of Children:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.no_of_minor || 0}</p>
    <p className="text-sm text-gray-700">Room Number:</p>
    <ul className="text-sm text-gray-900 font-medium">
  {[...new Set(data.map((item) => item.roomno))].map((roomno, index) => (
    <li key={index}>{roomno}</li>
  ))}
</ul>

    <p className="text-sm text-gray-700">Mobile:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.mobile}</p>
    <p className="text-sm text-gray-700">Email:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.email}</p>
    <p className="text-sm text-gray-700">Address:</p>
    <p className="text-sm text-gray-900 font-medium">{data[0]?.address}</p>
  </div>
</div>



            {/* Column 2 */}
           
            <div className="border w-2/5 border-gray-300 rounded-md p-3 shadow-md relative bg-white mr-2">
              <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
              Payment Summary
              </h2>
              <div className="flex flex-col space-y-1">
                
                <div className="flex flex-row justify-between items-center p-2 mt-2">
                  <span className="text-sm text-gray-700">Booking ID:</span>
                  <span className="text-sm text-gray-900 font-medium">
                   {data[0]?.bookingId}
                  </span>
                </div>
               
               
             
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">
                    Total Room Tariff:
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                 {(data[0]?.totalAmount/1.18).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">Discount:</span>
                  <input
                    type="number"
                    value={disamount}
                    onChange={handleInputChange}
                    min="0"
                    className="text-sm text-gray-900 font-medium border p-1 rounded-md w-24"
                  />
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">GST:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {18}%
                  </span>
                </div>
                <hr className="border-t border-gray-300 my-1" />
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">Total Amount:</span>
                  <span className="text-sm text-gray-900 font-bold">
                   {(data[0]?.totalAmount-disamount).toFixed(2)}
                  </span>
                </div>
                {data[0]?.advamount &&
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">Paid Amount:</span>
                  <span className="text-sm text-gray-900 font-bold">
                   {data[0]?.advamount}
                  </span>
                </div>
                 }
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700"> Amount Paid:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    <input
                      type="number"
                      value={adv}
                      onChange={handleInputChangeAdv}
                      className="border border-gray-300 rounded p-1 text-sm flex-grow w-full"
                      placeholder="Enter  Amount"
                      min="0"
                    />
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">
                    Remaining Amount:
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                  {(data[0]?.balance-disamount-adv).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center gap-2 p-2">
                  <span className="text-sm text-gray-700">Promo Code:</span>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="border border-gray-300 rounded p-1 text-sm flex-grow"
                      placeholder="Enter code"
                    />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded">
                      {" "}
                      Apply{" "}
                    </button>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center gap-2 p-2">
                  <span className="text-sm text-gray-700">Payment Mode:</span>

                  <span className="text-sm text-gray-900 font-medium">
                    <select
                        value={selectedMode}
                        required
                        onChange={handlePaymentModeChange}
                      className="border border-gray-300 rounded p-1 text-sm w-full"
                    >
                      <option value="" disabled>
                        Select Payment Mode
                      </option>
                      <option value="cash">Cash</option>
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="net-banking">Net Banking</option>
                    </select>
                  </span>
                </div>
                {selectedMode!=='cash'?(
   <div className="flex flex-row justify-between items-center p-2">
   <span className="text-sm text-gray-700">Transaction Id:</span>
   <span className="text-sm text-gray-900 font-medium">
     <input
       type="text"
       value={transactionId}
       onChange={handleInputChangeTrId}
       className="border border-gray-300 rounded p-1 text-sm flex-grow w-full"
       placeholder="Enter transaction ID"
     />
   </span>
 </div>
                )
                :null}
             <div className="flex flex-row justify-between items-center mt-4 p-2">
  <button
    onClick={handleSubmit}
    className="flex-grow bg-green-500 text-white py-2 rounded-lg text-lg font-medium shadow-md hover:bg-green-600 mr-2"
  >
    Submit Payment Details
  </button>
  <button
    onClick={() => navigate("/")}
    className="flex-grow bg-red-500 text-white py-2 rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 ml-2"
  >
    Skip
  </button>
</div>

          

            </div>
 
          </div>
        </div>

 </div>
      </main>

    </div>
  );
}

export default BookingConfirmationPage;
