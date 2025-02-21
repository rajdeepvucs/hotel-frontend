import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { baseURL } from "../../../config";
import { getLocalTime } from "../../utils/dateTime";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BookingConfirmationPage() {
  const [data, setData] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { bookingId } = location?.state;
  const [smsLoading, setSmsLoading] = useState(false); // Added loading state for SMS sending

  const [data1, setData1] = useState([]);

  const fetchBoarders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${baseURL}/api/property/getproperty`
      );
      setData1(response.data.property);
      console.log("...", response.data.property);
    } catch (error) {
      console.error("Failed to fetch boarders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoarders();
  }, []);

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get(
            `${baseURL}/api/booking/getParticularBooking/${bookingId}`
          );

          setData(response.data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookingDetails();
    } else {
      console.log("No bookingId found in state");
      setLoading(false);
    }
  }, [bookingId]);

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
          },
          (error) => {
            setUserLocation({
              latitude: null,
              longitude: null,
              error: error.message,
            });
            console.error("Error getting location:", error);
            toast.error(
              `Location access denied or unavailable: ${error.message}`
            ); // Notify user
          }
        );
      } else {
        setUserLocation({
          latitude: null,
          longitude: null,
          error: "Geolocation is not supported by this browser.",
        });
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []); // Empty dependency array means this runs only once on mount

  const handleSendSMS = async () => {
    setSmsLoading(true);

    try {
      // Construct the SMS data. Adjust the keys as needed by your API.
      const smsData = {
        to: data[0]?.mobile,
        message: `Thank you for choosing ${data1[0]?.propertyname}! 
        Booking ID: ${data[0]?.bookingId}, Name: ${data[0]?.name}, 
        CheckIn: ${data[0]?.checkInDate}, 
        CheckOut: ${data[0]?.checkOutDate},
        Room Type: ${data[0]?.roomType},
         No of Guest: ${
           Number(data[0]?.no_of_adults) + Number(data[0]?.no_of_minor)
         }
        Reception Contact:${data1[0]?.propertycontactno} 
        Address: ${data1[0]?.propertyaddress1} ${
          data1[0]?.propertyaddress2 ? data1[0]?.propertyaddress2 : ""
        }`,
        latitude: userLocation.latitude, // Use the user's location
        longitude: userLocation.longitude, // Use the user's location
        label: data1[0]?.propertyname || "Current Location", // Or default
      };

      const response = await axios.post(
        `${baseURL}/api/send-message`,
        smsData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("SMS sent successfully!");
        navigate("/");
      } else {
        toast.error("Failed to send SMS. Please try again.");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error(error.response?.data?.message || "Failed to send SMS.");
    } finally {
      setSmsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      const smsData = {
        email: data[0]?.email,
        message: `Thank you for choosing ${data1[0]?.propertyname}! 
        Booking ID: ${data[0]?.bookingId}, Name: ${data[0]?.name}, 
        CheckIn: ${data[0]?.checkInDate}, 
        CheckOut: ${data[0]?.checkOutDate},
        Room Type: ${data[0]?.roomType},
         No of Guest: ${
           Number(data[0]?.no_of_adults) + Number(data[0]?.no_of_minor)
         }
        Reception Contact:${data1[0]?.propertycontactno} 
        Address: ${data1[0]?.propertyaddress1} ${
          data1[0]?.propertyaddress2 ? data1[0]?.propertyaddress2 : ""
        }`, //Customize the message as needed
        latitude: userLocation.latitude, // Use the user's location
        longitude: userLocation.longitude, // Use the user's location
        label: data1[0]?.propertyname || "Current Location", // Or default
      };

      const response = await axios.post(`${baseURL}/api/sendemail`, smsData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("SMS sent successfully!");
        navigate("/");
      } else {
        toast.error("Failed to send SMS. Please try again.");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error(error.response?.data?.message || "Failed to send SMS.");
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* <Header title="Booking Summary" /> */}

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ToastContainer />

        <nav className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <img
              src={`${baseURL}/${data1[0]?.propertylogo}`}
              alt="Logo"
              className="h-14 w-14 mr-4 rounded-full"
            />

            <div className="text-center text-white text-4xl font-semibold">
              Review Your Booking
            </div>
            <div className=" font-semibold text-xl text-gray-100 mt-1 uppercase">
              {data1[0]?.propertyname}
            </div>
          </div>
        </nav>

        {loading && (
          <div className="flex justify-center items-center h-60">
            <p className="text-gray-600 text-lg">Loading booking details...</p>
          </div>
        )}

        {data.length > 0 && (
          <div className="relative mt-0">
            <div className="absolute -top-2 left-0 w-full flex gap-4">
              {/* Column 1 */}
              <div className="border w-3/5 border-gray-300 rounded-md p-3 shadow-md relative bg-white ml-2">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Booking Summary
                </h2>

                <div className="grid grid-cols-2 gap-y-1 mt-2 gap-2">
                  <p className="text-sm text-gray-700">Booking Id:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.bookingId}
                  </p>
                  <p className="text-sm text-gray-700">Booking Person Name:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.name}
                  </p>
                  <p className="text-sm text-gray-700">CheckInDate:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.checkInDate} {data[0]?.CheckInTime}
                  </p>
                  <p className="text-sm text-gray-700">CheckOutDate:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.checkOutDate}
                  </p>
                  <p className="text-sm text-gray-700">Number of Rooms:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.no_of_room || 1}
                  </p>
                  <p className="text-sm text-gray-700">Number of Adults:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.no_of_adults}
                  </p>
                  <p className="text-sm text-gray-700">Number of Children:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.no_of_minor || 0}
                  </p>
                  <p className="text-sm text-gray-700">Room Type:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.roomType || 0}
                  </p>
                  <p className="text-sm text-gray-700">Room Number:</p>
                  <ul className="text-sm text-gray-900 font-medium">
                    {[...new Set(data.map((item) => item.roomno))].map(
                      (roomno, index) => (
                        <li key={index}>{roomno}</li>
                      )
                    )}
                  </ul>

                  <p className="text-sm text-gray-700">Mobile:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.mobile}
                  </p>
                  <p className="text-sm text-gray-700">Email:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.email}
                  </p>
                  <p className="text-sm text-gray-700">Address:</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {data[0]?.address}
                  </p>
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
                    <span className="text-sm text-gray-700">Total Amount:</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {(data[0]?.totalAmount).toFixed(2) - data[0]?.gst}
                    </span>
                  </div>

                  <div className="flex flex-row justify-between items-center p-2">
                    <span className="text-sm text-gray-700">GST:</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {data[0]?.gst}
                    </span>
                  </div>
                  <hr className="border-t border-gray-300 my-1" />
                  <div className="flex flex-row justify-between items-center p-2">
                    <span className="text-sm text-gray-700">Total Amount:</span>
                    <span className="text-sm text-gray-900 font-bold">
                      {(data[0]?.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  {data[0]?.advamount && (
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        Paid Amount:
                      </span>
                      <span className="text-sm text-gray-900 font-bold">
                        {parseInt(data[0]?.advamount, 10).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-row justify-between items-center p-2">
                    <span className="text-sm text-gray-700">
                      Remaining Amount:
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {(data[0]?.balance).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-row justify-between items-center mt-4 p-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="flex-grow bg-green-500 text-white py-2 rounded-lg text-lg font-medium shadow-md hover:bg-green-600 mr-2"
                    >
                      Print
                    </button>

                    <button
                      onClick={handleSendSMS}
                      disabled={smsLoading}
                      className="flex-grow bg-blue-500 text-white py-2 rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 ml-2"
                    >
                      {smsLoading ? "Sending SMS..." : "Send SMS"}
                    </button>
                    <button
                      onClick={handleSendEmail}
                      className="flex-grow bg-blue-500 text-white py-2 rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 ml-2"
                    >
                      Send Email
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
        )}
      </main>
    </div>
  );
}

export default BookingConfirmationPage;
