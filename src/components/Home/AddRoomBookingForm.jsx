import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { v4 as uuidv4 } from "uuid";
import SpecificRange from "./SpecificRange";
import { format } from "date-fns";
function AddRoomBookingForm() {
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
  ];
  const today = new Date().toISOString().split("T")[0];
  const [selectedState, setSelectedState] = useState("");
  const [pincode, setPincode] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [nights,setNights]=useState(0);
  const [showFilteredData, setShowFilteredData] = useState(false);
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setValue("state", e.target.value); // Update react-hook-form state
  };
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    trigger,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      member: [
        {
          checkInDate: "",
          checkInTime: "09.00",
          checkOutDate: "",
          checkOutTime: "10.00",
          night: "",
          roomNo: "",
          no_of_adults: "",
          no_of_child: "",
          roomTariff: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "member",
  });
  // const calculateDayStartEndDay = (startDate,endDate) => {
    
  //   const checkInDate = startDate;
  //   const checkOutDate = endDate;
  //   if (checkInDate && checkOutDate) {
  //     const checkIn = new Date(checkInDate);
  //     const checkOut = new Date(checkOutDate);
  //     const timeDifference = checkOut.getTime() - checkIn.getTime();
  //     const daysDifference = timeDifference / (1000 * 3600 * 24);
  //    console.log("no of nights",daysDifference)
  //     setNights(daysDifference);
  //   } else {
  //     setNights(0);
  //   }
  // };

  const fetchStateName = async () => {
  

    try {
      console.log("pin",pincode)
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;

      if (data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        const fetchedState = postOffice.State;
console.log("state",fetchedState)
        setSelectedState(fetchedState);
       
      } 
    } catch (error) {
     
    }

    
  };
  useEffect(()=>{fetchStateName()},[pincode])




  const handleShowData = () => {
    if (startDate && endDate && noOfAdults && no_of_room) {
      setShowFilteredData(true);
      // calculateDayStartEndDay(startDate,endDate);
    } else {
      alert("Please select  start and end date. No of Room No of Adults");
    }
  };
  const [bookingId, setBookingId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [disamount, setDisAmount] = useState(0);
  const uniqueId = uuidv4();
  const [rooms, setRooms] = useState([]);
  const [no_of_room, setNoOfRoom] = useState(0);
  const [noOfAdults, setNoOfAdults] = useState(0);
  const [noOfChild, setNoOfChild] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [advamount, setAdvAmount] = useState(0);
  const [tnx_id, setTnx_id] = useState(null);
  const [gstColl, setGstColl] = useState(0);
  const [paymentMode, setPaymentMode] = useState("");
  const gst = 18;
  const [checkboxState, setCheckboxState] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showCheckDiv, setShowCheckDiv] = useState(true);
  const [showCountry, setShowCountry] = useState("India");
  const handleInputChangeAdults = (e) =>
    setNoOfAdults(parseInt(e.target.value) || 0);
  const handleInputChangeChildren = (e) =>
    setNoOfChild(parseInt(e.target.value) || 0);
  const handleStartDateChange = (e) => { 
    const selectedDate = e.target.value; 
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format 
    if (selectedDate >= today) { setStartDate(selectedDate); } 
    else {
       alert("The start date cannot be earlier than today's date."); 
      } 
  };
  // const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    const today = new Date().setHours(0, 0, 0, 0); // Set time to 00:00:00 for accurate comparison
  
    if (new Date(selectedEndDate).setHours(0, 0, 0, 0) < today) {
      alert("Check-out date must be today or a future date.");
      setEndDate(""); // Reset the check-out date field
    } else {
      setEndDate(selectedEndDate); // Update the end date if valid
    }
  };
  
  const handleInputChangeRoom = (e) =>
    setNoOfRoom(parseInt(e.target.value) || 0);
  const calculateDay = (index) => {
    const currentValues = getValues("member");
    const checkInDate = currentValues[index].checkInDate;
    const checkOutDate = currentValues[index].checkOutDate;
    
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDifference = checkOut - checkIn;
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Use Math.ceil to handle partial days
      
      console.log("Number of days:", daysDifference);
  
      // Set nights to at least 1 if check-in and check-out are the same day
      setValue(`member[${index}].night`, daysDifference || 1);
    } else {
      setValue(`member[${index}].night`, 0);
    }
  };
  
  const Day = (index) => {
    trigger("checkOutDate").then(() => {
      calculateDay(index);
    });
  };
  const handleTotalTariff = (index, event) => {
    const value = parseInt(event.target.value, 10) || 0;
    const currentValues = getValues(`member`);

    // Update the roomTariff for the specific member
    currentValues[index].roomTariff = value;

    // Calculate the total amount based on roomTariff * night
    const totalTariff = currentValues.reduce((sum, member) => {
      const roomTariff = parseInt(member.roomTariff, 10) || 0;
      const nights = parseInt(member.night, 10) || 0;
      return sum + roomTariff * nights;
    }, 0);

    // Set the total amount
    setTotalAmount(totalTariff);

    // Update the form field to ensure React Hook Form state stays in sync
    setValue(`member[${index}].roomTariff`, event.target.value);
  };
  const handleCheckOutDateChange = (index, event) => {
    const newCheckOutDate = event.target.value; // New checkout date
    const currentValues = getValues(`member`);

    // Update the checkout date for the specific member
    setValue(`member[${index}].checkOutDate`, newCheckOutDate, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const checkInDate = currentValues[index].checkInDate;

    if (checkInDate) {
      // Calculate the number of nights
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(newCheckOutDate);
      const nights = Math.max(
        Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)),
        0 // Ensure nights is non-negative
      );

      // Update the nights for the specific member
      setValue(`member[${index}].night`, nights, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Recalculate the total tariff
      const currentValuesAfterUpdate = getValues(`member`);
      const totalTariff = currentValuesAfterUpdate.reduce((sum, member) => {
        const roomTariff = parseInt(member.roomTariff, 10) || 0;
        const memberNights = parseInt(member.night, 10) || 0;
        return sum + roomTariff * memberNights;
      }, 0);

      // Update the total amount
      setTotalAmount(totalTariff);
    }
  };

  useEffect(() => {
    if (totalAmount !== undefined && disamount !== undefined) {
      const gst=(totalAmount - disamount) * 0.18
      const totalRoomTariff = (totalAmount - disamount) + gst;
      setTotalAmt(totalRoomTariff.toFixed(2));
      setGstColl(gst.toFixed(2))
    }
  }, [totalAmount, disamount, setTotalAmt]);

  const handlePaymentModeChange = (e) => {
    const value = e.target.value;
    setPaymentMode(value);
    setValue("paymentmode", value);
  };
  const handleDisAmountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setDisAmount(value);
    setValue("disamount", value);
  };
  const handleTnxId = (e) => {
    const value = e.target.value;
    setTnx_id(value);
    setValue("tnx_id", value);
  };

  const handleAdvAmountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setAdvAmount(value);
    setValue("advamount", value);
  };

  // const handleChildChange = (index, event) => {
  //   const value = parseInt(event.target.value, 10) || 0;
  //   const currentValues = getValues(`member`);
  //   currentValues[index].no_of_child = value;

  //   // Calculate total number of adults
  //   const totalAdults = currentValues.reduce(
  //     (sum, member) => sum + (parseInt(member.no_of_child, 10) || 0),
  //     0
  //   );
  //   setNoOfChild(totalAdults);

  //   // Update the form field
  //   setValue(`member[${index}].no_of_child`, event.target.value);
  // };
  // const handleAdultChange = (index, event) => {
  //   const value = parseInt(event.target.value, 10) || 0;
  //   const currentValues = getValues(`member`);
  //   currentValues[index].no_of_adults = value;

  //   // Calculate total number of adults
  //   const totalAdults = currentValues.reduce(
  //     (sum, member) => sum + (parseInt(member.no_of_adults, 10) || 0),
  //     0
  //   );
  //   setNoOfAdults(totalAdults);

  //   // Update the form field
  //   setValue(`member[${index}].no_of_adults`, event.target.value);
  // };

  const handleRemove = (index) => {
    const currentValues = getValues("member");

    // Get the values for roomTariff, night, number of children, and number of adults
    const roomTariff = parseInt(currentValues[index].roomTariff, 10) || 0;
    const nights = parseInt(currentValues[index].night, 10) || 0;
    const totalValue = roomTariff * nights; // Calculate the total value for the member

    const no_of_child = parseInt(currentValues[index].no_of_child, 10) || 0;
    setNoOfChild((prev) => prev - no_of_child);

    const no_of_adults = parseInt(currentValues[index].no_of_adults, 10) || 0;
    setNoOfAdults((prev) => prev - no_of_adults);

    // Subtract the total value of the item being removed from the total amount
    setTotalAmount((prevTotal) => prevTotal - totalValue);

    // Update the selected index and remove the item from the form
    setSelectedIndex((prevIndex) => prevIndex - 1);
    remove(index);
  };
 // Function to initialize predefined rooms
 React.useEffect(() => {
  const predefinedRooms = Array.from({ length: no_of_room }, (_, index) => ({
    checkInDate: startDate,
    checkInTime: "10:00",
    checkOutDate: endDate,
    checkOutTime: "09:00",
    night: calculateDefaultNights(),
    roomNo: "",
    no_of_adults: "",
    no_of_child: "",
    roomTariff: "",
  }));

  setValue("member", predefinedRooms);
}, [no_of_room, setValue]);

  const checkOutDate = watch("checkOutDate");
  //  const validateCheckOutDate = (value) => {
  //   if (checkInDate && new Date(value) <= new Date(checkInDate))
  //     { return "Check-Out Date must be later than Check-In Date"; }
  //    return true;
  //  }
  const validateCheckOutDate = (value) => {
    const today = new Date().toISOString().split("T")[0];
    return value >= today || "Check-Out Date must be today or a future date";
  };
  function generateBookingId() {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now(); // Returns the number of milliseconds since January 1, 1970
    return timestamp;
  }
  useEffect(() => {
    const id = generateBookingId();
    setBookingId(id);
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/room/allRooms`); // Update this URL based on your API route

        const formattedRooms = response.data.rooms.map((room) => ({
          value: room.value,
          label: room.label,
        }));
        setRooms(formattedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);
  const navigate = useNavigate();

  const filteredRooms = rooms.filter((room) =>
    checkboxState.includes(room.value)
  );
  const calculateDefaultNights=()=>{
    const calculatedNights =
        startDate && endDate
          ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
          : 0;
      
      // Ensure nights is at least 1
      const nights = calculatedNights === 0 ? 1 : calculatedNights;
      return nights
  }
  useEffect(() => {
    fields.forEach((_, index) => {
      // Calculate the number of nights
      // const calculatedNights =
      //   startDate && endDate
      //     ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      //     : 0;
      
      // // Ensure nights is at least 1
      // const nights = calculatedNights === 0 ? 1 : calculatedNights;
      
      // Set the check-in and check-out dates
      // setValue(`member[${index}].checkInDate`, startDate);
      // setValue(`member[${index}].checkOutDate`, endDate);
  
      // Set the number of nights
      // setValue(`member[${index}].night`, nights);
  
      // Set the room number
      setValue(`member[${index}].roomNo`, filteredRooms[index]?.value);
  
      // Extract and set the tariff
      const tariff = filteredRooms[index]?.label.split(" ").pop();
      setValue(`member[${index}].acroomTariff`, tariff || "");
    });
  }, [fields, setValue, filteredRooms]);
  

  const onSubmit = async (data) => {
    const formData = new FormData();
    const currentDateTime = new Date().toISOString();
    const formattedDate = format(new Date(currentDateTime), "hh:mm a");
    // Append simple form fields
    formData.append("bookingId", bookingId);
    formData.append("fname", `${data.fname} ${data.mname}`);
    formData.append("lname", data.lname);
    formData.append(
      "address",
      `${data.address1} ${data.address2} ${pincode} ${selectedState}  ${showCountry}`
    );
    formData.append("age", data.age);
    formData.append("email", data.email);
    formData.append("gender", data.gender);
    formData.append("mobile", data.mobile);
    formData.append("disamount", data.disamount);
    formData.append("advamount", data.advamount);
    formData.append("paymentmode", data.paymentmode);
    formData.append("tnx_id", data.tnx_id);
    formData.append("gst", gstColl);
    formData.append("no_of_room", selectedIndex);
    formData.append("no_of_adults", noOfAdults);
    formData.append("no_of_minor", noOfChild);
    formData.append("totalAmt", totalAmt);
    formData.append("bookingTime", formattedDate);
    formData.append("createdBy", localStorage.getItem("user"));

    // Append member data fields
    data.member.forEach((member, index) => {
      formData.append(`member[${index}].checkInDate`, member.checkInDate);
      formData.append(`member[${index}].checkOutDate`, member.checkOutDate);
      formData.append(`member[${index}].checkOutTime`, member.checkOutTime);
      formData.append(`member[${index}].checkInTime`, member.checkInTime);
      formData.append(`member[${index}].roomNo`, member.roomNo);
      formData.append(`member[${index}].no_of_adults`, member.no_of_adults);
      formData.append(`member[${index}].no_of_child`, member.no_of_child);
      formData.append(`member[${index}].roomTariff`, member.roomTariff);
      formData.append(`member[${index}].night`, member.night);
    });

    // Debug: Print formData to the console
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Submit the formData to the server
    try {
      const response = await axios.post(
        `${baseURL}/api/booking/createbooking`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setTimeout(() => {
          toast.success(
            response.data.message || "Booking created successfully"
          );
        }, 1000);
        reset();
        navigate("/advanceboaderlist");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    
      // Check if the error response contains the required fields
      if (error.response && error.response.data) {
        const { error: errorMessage, unavailableRooms } = error.response.data;
    
        // Format the message with unavailable rooms
        const formattedMessage = `${errorMessage} Unavailable Rooms: ${unavailableRooms.join(", ")}`;
    
        // Display the message in the toast
        toast.error(formattedMessage);
      } else {
        // Fallback for unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
    
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Advance Booking Form" />

      <main className="max-w-7xl mx-auto py-6 px-2 lg:px-8 bg-white">
        <ToastContainer />
        {showCheckDiv && (
          <>
            <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4 ">
              <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                Check Availibity
              </h2>

              <div className="grid  grid-cols-5 gap-2">
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="name" className="text-base">
                    CheckInDate:
                    <input
                      type="date"
                     
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </label>
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="name" className="text-base">
                    CheckOutDate:
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                    />
                  </label>
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="name" className="text-base">
                    No of rooms
                  </label>
                  <input
                    id="fname"
                    type="number"
                    placeholder="Total Rooms"
                    className="border p-2 rounded-md w-full"
                    value={no_of_room}
                    onChange={handleInputChangeRoom}
                    min="0"
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="name" className="text-base">
                    No of Adults
                  </label>
                  <input
                    id="adults"
                    type="number"
                    placeholder="Total Adults"
                    className="border p-2 rounded-md w-full"
                    value={noOfAdults}
                    onChange={handleInputChangeAdults}
                    min="0"
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="name" className="text-base">
                    No of Children
                  </label>
                  <input
                    id="fname"
                    type="number"
                    placeholder="Total Children"
                    className="border p-2 rounded-md w-full"
                    value={noOfChild}
                    onChange={handleInputChangeChildren}
                    min="0"
                  />
                </div>
          
              </div>
                    {/* Button to Show Filtered Data */}
                    <div className="flex justify-center items-center">
                    <button
                  onClick={handleShowData}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Check Availibity
                </button>
                    </div>
               
            </div>
            {/* Conditionally render RoomBookingTable */}
            {showFilteredData && (
              <>
                <SpecificRange
                  startDate={startDate}
                  endDate={endDate}
                  checkboxState={checkboxState}
                  setCheckboxState={setCheckboxState}
             
                />
                <div className="flex justify-center items-center  mt-2">
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                    onClick={() => {
                      setShowCheckDiv(false);
                      if(no_of_room==checkboxState.length)
                      setShowForm(true);
                    else{ toast.error(`You have to select ${no_of_room} Rooms`)
                      setShowCheckDiv(true);}
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {showForm && (
          <div className="flex flex-col justify-center items-center ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border border-gray-300 p-6 rounded-md shadow-md bg-white min-w-[1024px]"
            >
              <div className="flex flex-row justify-between">
                <div className="text-lg">BookingID: {bookingId}</div>
                <div>
            
                </div>
              </div>
              <div className="flex flex-row gap-1 mt-4 ">
                <div className="flex w-3/5 flex-col gap-1  ">
                  {/* Customer info */}
                  <div className=" flex-grow h-full">
                    <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-1">
                      <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                        Customer's Info
                      </h2>
                      <div className="grid grid-cols-3 gap-2 p-2">
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="name" className="text-base">
                            First Name<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="fname"
                            placeholder=" First Name"
                            {...register("fname", {
                              required: "First Name is required",
                              onBlur: () => trigger("fname"),
                              pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message:
                                  "First Name can only contain letters and spaces",
                              },
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.fname && (
                            <p className="text-red-500 text-sm">
                              {errors.fname.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="name" className="text-base">
                            Middle Name
                          </label>
                          <input
                            id="mname"
                            placeholder=" Middle Name"
                            {...register("mname", {
                              pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message:
                                  "Name can only contain letters and spaces",
                              },
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.mname && (
                            <p className="text-red-500 text-sm">
                              {errors.mname.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="name" className="text-base">
                            Last Name<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="lname"
                            placeholder=" Last Name"
                            {...register("lname", {
                              required: "Last Name is required",
                              onBlur: () => trigger("lname"),
                              pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message:
                                  "Last Name can only contain letters and spaces",
                              },
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.lname && (
                            <p className="text-red-500 text-sm">
                              {errors.lname.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 p-2">
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="age" className="text-base">
                            Age
                          </label>
                          <input
                            id="mobile"
                            type="number"
                            placeholder="Age 40"
                            {...register("age", {
                              onBlur: () => trigger("age"),
                            })}
                            className="border p-2 rounded-md w-full"
                          />

                          {errors.age && (
                            <p className="text-red-500 text-sm">
                              {errors.age.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-2 mt-1">
                          <label htmlFor="gender" className="text-base">
                            Gender<span className="text-red-500">*</span>
                          </label>
                          <select
                            id="gender"
                            {...register("gender", {
                              required: "Gender is required",
                              onBlur: () => trigger("gender"),
                            })}
                            className="border p-2 rounded-md w-full"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.gender && (
                            <p className="text-red-500 text-sm">
                              {errors.gender.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="email" className="text-base">
                            Email<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Enter a valid email address",
                              },
                              onBlur: () => trigger("email"),
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="mobile" className="text-base">
                            Mobile<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="mobile"
                            type="number"
                            placeholder="(+91)09749123654"
                            {...register("mobile", {
                              required: "Mobile is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message:
                                  "Mobile number must be exactly 10 digits",
                              },
                              onBlur: () => trigger("mobile"),
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.mobile && (
                            <p className="text-red-500 text-sm">
                              {errors.mobile.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-4">
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="address" className="text-base">
                            AddressLine1<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="address1"
                            type="text"
                            placeholder="R.N Road Siliguri Darjeeling"
                            {...register("address1", {
                              required: "Address is required",
                              onBlur: () => trigger("address1"),
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.address1 && (
                            <p className="text-red-500 text-sm">
                              {errors.address1.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="address" className="text-base">
                            AddressLine2
                          </label>
                          <input
                            id="address"
                            type="text"
                            placeholder="R.N Road Siliguri Darjeeling"
                            {...register("address2", {
                              onBlur: () => trigger("address2"),
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.address2 && (
                            <p className="text-red-500 text-sm">
                              {errors.address2.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="pin" className="text-base">
                            PinCode<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="pin"
                            type="number"
                            placeholder="712404"
                            required
                            onChange={(e)=>{setPincode(e.target.value)}}
                            // {...register("pin", {
                            //   required: "Pin is required",
                            //   pattern: {
                            //     value: /^[0-9]{6}$/, // Ensures exactly 6 digits
                            //     message: "PinCode must be 6 digits",
                            //   },
                            //   onBlur: () => trigger("pin"),
                            // })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.pin && (
                            <p className="text-red-500 text-sm">
                              {errors.pin.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="pin" className="text-base">
                            State<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="pin"
                            type="text"
                            
                            required
                           value={selectedState}
                           onChange={(e) => setSelectedState(e.target.value)} 
                            // {...register("pin", {
                            //   required: "Pin is required",
                            //   pattern: {
                            //     value: /^[0-9]{6}$/, // Ensures exactly 6 digits
                            //     message: "PinCode must be 6 digits",
                            //   },
                            //   onBlur: () => trigger("pin"),
                            // })}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.pin && (
                            <p className="text-red-500 text-sm">
                              {errors.pin.message}
                            </p>
                          )}
                        </div>
                        {/* <div className="flex flex-col space-y-1 mb-4">
                          <label htmlFor="state" className="text-base mb-1">
                            Select State<span className="text-red-500">*</span>
                          </label>
                          <select
                            id="state"
                            value={selectedState}
                            onChange={(e) => {
                              handleStateChange(e); // Update your local state
                            }}
                            className="border p-2 rounded-md w-full"
                          >
                            <option value="">Select State</option>
                            {states.map((state, index) => (
                              <option key={index} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          {errors.state && (
                            <p className="text-red-500 text-sm">
                              {errors.state.message}
                            </p>
                          )}
                        </div> */}
                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="pin" className="text-base">
                            Country<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="pin"
                            type="text"
                            placeholder="eg India"
                         onChange={(e)=>{setShowCountry(e.target.value)}}
                         defaultValue={"India"}
                            className="border p-2 rounded-md w-full"
                          />
                          {errors.pin && (
                            <p className="text-red-500 text-sm">
                              {errors.pin.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Payment Info */}
                  <div className=" border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                    <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                      Payment Info
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex flex-col space-y-1 mb-2">
                        <label htmlFor="advamount" className="text-base">
                          Advance Amount
                        </label>
                        <input
                          id="advamount"
                          type="number"
                          placeholder="Rs/-800"
                          {...register("advamount")}
                          value={watch("advamount") || advamount}
                          onChange={handleAdvAmountChange}
                          className="border p-2 rounded-md w-full"
                        />
                      </div>
                      <div className="flex flex-col space-y-1 mb-2">
                        <label htmlFor="paymentmode" className="text-base">
                          Payment Mode
                        </label>
                        <select
                          id="paymentmode"
                          {...register("paymentmode", {
                            onBlur: () => trigger("paymentmode"),
                          })}
                          value={paymentMode}
                          onChange={handlePaymentModeChange}
                          className="border p-2 rounded-md w-full"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="Online">Online</option>
                          <option value="Card">Card</option>
                          <option value="Cash">Cash</option>
                        </select>
                        {errors.paymentmode && (
                          <p className="text-red-500 text-sm">
                            {errors.paymentmode.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1 mb-2">
                        <label htmlFor="tnx_id" className="text-base">
                          Transaction ID
                        </label>
                        <input
                          id="tnx_id"
                          placeholder="tnx12334"
                          {...register("tnx_id")}
                          value={watch("tnx_id") || tnx_id}
                          onChange={handleTnxId}
                          className="border p-2 rounded-md w-full"
                        />
                      </div>
                      <div className="flex flex-col space-y-1 mb-2">
                        <label htmlFor="disamount" className="text-base">
                          Discount Amount
                        </label>
                        <input
                          id="disamount"
                          type="number"
                          placeholder="Rs/-800"
                          {...register("disamount")}
                          value={watch("disamount") || disamount}
                          onChange={handleDisAmountChange}
                          className="border p-2 rounded-md w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Billing Info */}
                <div className="w-2/5 flex-grow h-full">
                  <div className="border border-gray-300 rounded-md p-3 shadow-md relative mt-1 bg-white">
                    <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                      Booking Summary
                    </h2>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        No of Rooms:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {no_of_room}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        No of Adults:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {noOfAdults}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        No of Children:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {noOfChild}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        Total Room Tariff:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {totalAmount}
                      </span>
                    </div>

                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">Discount:</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {disamount}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">GST:</span>
                      <span className="text-sm text-gray-700"> {18}%</span>
                      <span className="text-sm text-gray-900 font-medium">
                       {gstColl}
                      </span>
                    </div>
                    <hr className="border-t border-gray-300 my-1" />
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        Total Amount:
                      </span>
                      <span className="text-sm text-gray-900 font-bold">
                        {totalAmt}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        Advance Amount:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {advamount}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        Remaining Amount:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {(totalAmt - advamount).toFixed(2)}
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
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-sm text-gray-700">
                        PaymentMode:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {paymentMode}
                      </span>
                      <span className="text-sm text-gray-700">TnxId:</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {tnx_id}
                      </span>
                    </div>
                  </div>
                  {/* <RoomBookingTable /> */}
                </div>
              </div>

              {/* Room row of form fields */}

              <div className="  border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Room Info
                </h2>
                {fields.map((field, index) => (
                  <div className="grid grid-cols-9  gap-3" key={field.id}>
                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].checkInDate`}
                        className="text-xs font-bold"
                      >
                        Check-In Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`member[${index}].checkInDate`}
                        type="date"
                        
                        {...register(`member[${index}].checkInDate`, {
                          required: "Check-In Date is required",
                          onBlur: () => {
                            trigger(`member[${index}].checkInDate`);
                          },
                          validate: (value) => {
                            const today = new Date()
                              .toISOString()
                              .split("T")[0];
                            return (
                              value >= today ||
                              "Check-In Date must be today or a future date"
                            );
                          },
                      
                        })}
                        defaultValue={
                          watch(`member[${index}].checkIndate`) || startDate
                        }
                        onChange={(e) => {
                          setValue(`member[${index}].checkInDate`, e.target.value); // Update form state explicitly
                          trigger(`member[${index}].checkInDate`); // Trigger re-validation
                        }}
                        className="border p-2 rounded-md w-full"
                       
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].checkInDate && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].checkInDate.message}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].checkInTime`}
                        className="text-xs font-bold"
                      >
                        Check-In Time
                      </label>
                      <input
                        id={`member[${index}].checkInTime`}
                        type="time"
                        defaultValue={
                          watch(`member[${index}].checkInTime`) || "12:00"
                        }
                        {...register(`member[${index}].checkInTime`, {
                          onBlur: () => {
                            trigger(`member[${index}].checkInTime`);
                          },
                        })}
                        
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].checkInTime && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].checkInTime.message}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].checkOutDate`}
                        className="text-xs font-bold"
                      >
                        Check-Out Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`member[${index}].checkOutDate`}
                        type="date"
                        {...register(`member[${index}].checkOutDate`, {
                          required: "Check-Out Date is required",
                          onBlur: () => Day(index),
                          validate: validateCheckOutDate,
                        })}
                        onChange={(event) =>
                          handleCheckOutDateChange(index, event)
                        }
                       
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].checkOutDate && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].checkOutDate.message}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].checkOutTime`}
                        className="text-xs font-bold"
                      >
                        Check-Out Time
                      </label>
                      <input
                        id={`member[${index}].checkOutTime`}
                        type="time"
                        {...register(`member[${index}].checkOutTime`, {
                          onBlur: () => {
                            trigger(`member[${index}].checkOutTime`);
                          },
                        })}
                        className="border p-2 rounded-md w-full"
                        defaultValue={
                          getValues(`member[${index}].checkInTime`) || "10:00"
                        }
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].checkOutTime && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].checkOutTime.message}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].night`}
                        className="text-xs font-bold"
                      >
                        Total Night<span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`member[${index}].night`}
                        type="text"
                        readOnly
                        {...register(`member[${index}].night`)}
                        defaultValue={getValues(`member[${index}].night`) || ""} // Bind the value to form state
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].night && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].night.message}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].roomNo`}
                        className="text-xs font-bold"
                      >
                        Room No<span className="text-red-500">*</span>
                      </label>
                      <input
                    id={`room[${index}].roomNo`}
                    type="text"
                    {...register(`member[${index}].roomNo`, {
                      required: "Room No is required",
                    })}
                    className="border p-2 rounded-md w-full"
                    defaultValue={getValues(`room[${index}].roomNo`)}
                  />
                      {/* <select
                        {...register(`member[${index}].roomNo`, {
                          required: "Room no is required",
                          onChange: (e) => {
                            // Find the selected room
                            const selectedRoom = filteredRooms.find(
                              (room) => room.value === e.target.value
                            );
                    
                            // Extract the tariff from the label (last part after split by space)
                            const tariff = selectedRoom ? selectedRoom.label.split(" ").pop() : "";
                    
                            // Set the extracted tariff value
                            setValue(`member[${index}].acroomTariff`, tariff || "");
                          },
                          onBlur: () => {
                            setSelectedIndex(index + 1);
                            trigger(`member[${index}].roomNo`);
                          },
                        })}
                       
                        className="border p-2 rounded-md w-full"
                        
                      >
                        <option value="">Select Room</option>
                        {filteredRooms.map((room) => (
                          <option key={room.value} value={room.value}>
                            {room.label}
                          </option>
                        ))}
                      </select> */}
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].roomNo && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].roomNo.message}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].roomTariff`}
                        className="text-xs font-bold"
                      >
                        Actual  Tariff<span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`member[${index}].roomTariff`}
                        type="text"
                        {...register(`member[${index}].acroomTariff`, {
                          
                        })}
                        value={getValues(`member[${index}].acroomTariff`)} // Bind the value to form state
                       readOnly
                        className="border p-2 rounded-md w-full"
                      />
                 
                    </div>
                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].roomTariff`}
                        className="text-xs font-bold"
                      >
                        Room Tariff<span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`member[${index}].roomTariff`}
                        type="text"
                        {...register(`member[${index}].roomTariff`, {
                          required: "Room Tariff is required",
                          onBlur: () => trigger(`member[${index}].roomTariff`),
                        })}
                        value={getValues(`member[${index}].roomTariff`)} // Bind the value to form state
                        onChange={(e) => handleTotalTariff(index, e)}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].roomTariff && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].roomTariff.message}
                          </p>
                        )}
                    </div>
                    {/* <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].no_of_adults`}
                        className="text-xs font-bold"
                      >
                        No_of_Adults<span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`member[${index}].no_of_adults`}
                        type="number"
                        min="0"
                        {...register(`member[${index}].no_of_adults`, {
                          required: "No of Adults is required",
                          onBlur: () =>
                            trigger(`member[${index}].no_of_adults`),
                        })}
                        value={getValues(`member[${index}].no_of_adults`)} // Bind the value to form state
                        onChange={(e) => handleAdultChange(index, e)}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].no_of_adults && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].no_of_adults.message}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1 mb-2">
                      <label
                        htmlFor={`member[${index}].no_of_child`}
                        className="text-xs font-bold"
                      >
                        No_of_Child
                      </label>
                      <input
                        id={`member[${index}].no_of_child`}
                        type="number"
                        min="0"
                        {...register(`member[${index}].no_of_child`, {
                          // required: "No of Children is required",
                          onBlur: () => trigger(`member[${index}].no_of_child`),
                        })}
                        value={getValues(`member[${index}].no_of_child`)} // Bind the value to form state
                        onChange={(e) => handleChildChange(index, e)}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.member &&
                        errors.member[index] &&
                        errors.member[index].no_of_child && (
                          <p className="text-red-500 text-sm">
                            {errors.member[index].no_of_child.message}
                          </p>
                        )}
                    </div> */}
                    <div className="flex flex-col space-y-1 mb-2 mt-8">
                      {/* Remove Member Button */}
                      {index === 0 ? null : (
                        <button
                          type="button"
                          onClick={() => {
                            setNoOfRoom(no_of_room-1);
                            handleRemove(index);
                          }}
                          className="bg-red-500 text-white py-0.5 px-1 text-xs rounded-md h-8 hidden"
                        >
                          Remove Room
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-start">
                  <button
                    type="button"
                    className="bg-green-500 text-white py-2 px-4 rounded-md mt-2 hidden"
                    onClick={() => {
                      append({
                        checkInDate: "",
                        checkInTime: "10.00",
                        checkOutDate: "",
                        checkOutTime: "9.00",
                        night: "",
                        roomNo: "",
                        no_of_adults: "",
                        no_of_child: "",
                        roomTariff: "",
                      });
                    }}
                  >
                    Add Room
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AddRoomBookingForm;
