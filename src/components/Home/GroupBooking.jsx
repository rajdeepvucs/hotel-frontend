import React, { useEffect, useState, useRef } from "react";
import Header from "../common/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpecificRange from "./SpecificRange";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { CameraIcon, CrossIcon } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { CircleX } from "lucide-react";
import Webcam from "react-webcam";
import axios from "axios";
import { baseURL } from "../../../config";
import { getLocalTime } from "../../utils/dateTime";
import { useNavigate,} from "react-router-dom";

const videoConstraints = {
  width: 440,
  facingMode: "environment",
};
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
function GroupBooking() {
  const today = new Date().toISOString().split("T")[0];
  const [country, setCountry] = useState("India");
  const [bookingId, setBookingId] = useState(null);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState();
  const [showFilteredData, setShowFilteredData] = useState(false);
  const [showPersonData, setShowPesonData] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [adults, setAdults] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [children, setChildren] = useState(0);
  const [no_of_room, setNoOfRoom] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [checkboxState, setCheckboxState] = useState([]);
  const [defaultNights, setDefaultNights] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disamount, setDisamount] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [selectedMode, setSelectedMode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [adv, setadv] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [showCheckDiv, setShowCheckDiv] = useState(true);
 const [gst,setGst]=useState(0);
const navigate=useNavigate()
  const handleInputChangeAdv = (e) => {
    setadv(e.target.value);
  };

  const handleInputChangeTrId = (e) => {
    setTransactionId(e.target.value);
  };

  const handlePaymentModeChange = (e) => {
    setSelectedMode(e.target.value);
  };
  const handleInputChange = (e) => {
    setDisamount(e.target.value);
  };
  // Modal close function
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const calculateDefaultDay = () => {
    const checkInDate = startDate;
    const checkOutDate = endDate;

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDifference = checkOut.getTime() - checkIn.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      console.log("Number of days:", daysDifference); // Additional functionality if needed
      setDefaultNights(daysDifference);
    } else {
      setDefaultNights(0);
    }
  };
  const calculateDay = (index) => {
    const currentValues = getValues("room");
    const checkInDate = currentValues[index].checkInDate;
    const checkOutDate = currentValues[index].checkOutDate;

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDifference = checkOut.getTime() - checkIn.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      console.log("Number of days:", daysDifference); // Additional functionality if needed
      setValue(`room[${index}].no_of_nights`, daysDifference);
    } else {
      setValue(`room[${index}].no_of_nights`, 0);
    }
  };
  const Day = (index) => {
    trigger("checkOutDate").then(() => {
      calculateDay(index);
    });
  };
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

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setValue("state", e.target.value); // Update react-hook-form state
  };
  const handleInputChangeAdults = (e) =>
    setAdults(parseInt(e.target.value) || 0);
  const handleInputChangeChildren = (e) =>
    setChildren(parseInt(e.target.value) || 0);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  // const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;

    if (new Date(selectedEndDate) <= new Date(today)) {
      alert("Check-out date must be a future date.");
      setEndDate(""); // Reset the check-out date field
    } else {
      setEndDate(selectedEndDate); // Update the end date if valid
    }
  };
  const handleInputChangeRoom = (e) =>
    setNoOfRoom(parseInt(e.target.value) || 0);
  useEffect(() => {
    setTotalRows(adults + children);
  }, [adults, children]);

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

  const predefinedRoomsCount = no_of_room;

  // Create an array with the predefined number of rooms
  const hotelrooms = new Array(predefinedRoomsCount)
    .fill(null)
    .map((_, index) => ({
      roomNo: "",
      checkInDate: "",
      checkOutDate: "",
      no_of_nights: "",
      roomTariff: "",
      no_of_adults: "",
      no_of_child: "",
    }));
  useEffect(() => {
    checkboxState.forEach((room, index) => {
      setValue(`room[${index}].roomNo`, room);
     
    });
  }, [checkboxState]);
  const handleShowData = () => {
    if (no_of_room && adults && startDate && endDate) {
      setShowFilteredData(true);
      setShowPesonData(true);
      showPerson();
      calculateDefaultDay();
    } else {
      alert("Please select no of room,adults ,children, start and end date.");
    }
  };

  function generateBookingId() {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now(); // Returns the number of milliseconds since January 1, 1970
    return timestamp;
  }
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      member: [
        {
          fname: "",
          lname: "",
          gender: "",
          age: "",
          photo: null,
          image: null,
          idtype: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "member" }); // Watch all fields
  const handleAddMember = () => {
    append({
      fname: "",
      lname: "",
      gender: "",
      age: "",
      photo: "",
      image: "",
      idtype: "",
    });
  };
  // Adjust the rows dynamically
  const showPerson = () => {
    const currentCount = fields.length;
    if (currentCount < totalRows) {
      for (let i = 0; i < totalRows - currentCount; i++) {
        append({
          fname: "",
          lname: "",
          gender: "",
          age: "",
          photo: "",
          image: "",
          idtype: "",
        });
      }
    } else if (currentCount > totalRows) {
      for (let i = 0; i < currentCount - totalRows; i++) {
        remove(currentCount - i - 1);
      }
    }
  };
  const calculateTotalTariff = () => {
    const currentValues = getValues("room");
console.log("currentValues",currentValues)

// Convert object to array and filter out undefined or invalid entries
const roomsArray = Array.isArray(currentValues)
? currentValues
: Object.values(currentValues).filter(
    (room) => room && typeof room === "object"
  );

if (!Array.isArray(roomsArray)) {
console.error("Invalid data structure for currentValues. Unable to process.");
return 0;
}

    // Initialize the total amount to 0
    let totalAmount = 0;
  
    // Iterate over each room data
    roomsArray.forEach((room) => {
      // Parse the values to numbers (roomTariff and no_of_nights are strings in the current data)
      const roomTariff = parseFloat(room.roomTariff);
      const noOfNights = parseInt(room.no_of_nights);

      // Calculate the total tariff for this room
      if (!isNaN(roomTariff) && !isNaN(noOfNights)) {
        totalAmount += roomTariff * noOfNights;
      }
    });

    // Log the total amount
    setTotalAmt(totalAmount);
    
setGst(totalAmount*0.18)
    return totalAmount * 1.18; 
  };

  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSrc1, setImageSrc1] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const capture = async () => {
    // Capture image from webcam and store it in state
    const image = webcamRef.current.getScreenshot();

    setImageSrc1(image);
    // Convert base64 to Blob
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();

    // Create a file from the blob
    const file = new File([blob], "captured-image.png", { type: "image/png" });

    // Now you can upload this file or use it as needed
    setImageSrc(file);
  };

  const onUserMedia = (e) => {
    console.log(e);
  };
  const processRoomData = (data) => {
    console.log("Raw room data:", data?.room);
  
    // Safely extract room data and filter out undefined or invalid entries
    const cleanedRooms = Object.values(data?.room || {}).filter(
      (room) => room && typeof room === "object"
    );
  
    console.log("Cleaned room data:", cleanedRooms);
  
    return cleanedRooms;
  };
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append simple form fields
    formData.append("bookingId", bookingId);

    formData.append(
      "address",
      `${data.address1} ${data.address2} ${data.pin} ${selectedState} ${country}`
    );

    formData.append("email", data.email);

    formData.append("mobile", data.mobile);
    formData.append("purpose", data.purpose);
    formData.append("comefrom", data.comefrom);
    formData.append("goingto", data.goingto);
    formData.append("status", "checkIn");
    formData.append("comments", data.comments);
    formData.append("gst", gst);
    // formData.append("paymentmode", data.paymentmode);
    formData.append("CheckInTime", getLocalTime());
    formData.append("no_of_room", no_of_room);
    // formData.append("no_of_adults", noOfAdults);
    // formData.append("no_of_minor", noOfChild);
    formData.append("totalAmount", calculateTotalTariff());
    formData.append("balence", calculateTotalTariff()-0);

    data.member.forEach((member, index) => {
      formData.append(
        `member[${index}].name`,
        member.fname.toUpperCase() + " " + member.lname.toUpperCase()
      );
      formData.append(`member[${index}].gender`, member.gender.toUpperCase());
      formData.append(`member[${index}].age`, member.age);
      formData.append(`member[${index}].idtype`, member.idtype.toUpperCase());
      const cleanedRooms = processRoomData(data);
      const assignedRoom = cleanedRooms.find(
        (room) => room.roomNo === member.roomNo
      );
      if (assignedRoom) {
        formData.append(
          `member[${index}].checkInDate`,
          assignedRoom.checkInDate
        );
        formData.append(
          `member[${index}].checkOutDate`,
          assignedRoom.checkOutDate
        );
        formData.append(`member[${index}].roomNo`, assignedRoom.roomNo);
        formData.append(
          `member[${index}].no_of_adults`,
          assignedRoom.no_of_adults
        );
        formData.append(
          `member[${index}].no_of_child`,
          assignedRoom.no_of_child
        );
        formData.append(`member[${index}].roomTariff`, assignedRoom.roomTariff);
        formData.append(`member[${index}]. no_of_nights`, assignedRoom. no_of_nights);
      }
      // Check for uploaded photo first
      if (member.photo && member.photo[0]) {
        const uploadedPhotoFile = new File(
          [member.photo[0]],
          `${member.fname}_${member.lname}_photo_uploaded.jpg`,
          { type: member.photo[0].type }
        );
        formData.append(`member[${index}].photo`, uploadedPhotoFile);
      } else if (imageSrc) {
        // If no uploaded photo, use webcam image
        const photoFile = new File(
          [imageSrc],
          `${member.fname}_${member.lname}_photo_webcam.jpg`,
          { type: imageSrc.type }
        );
        formData.append(`member[${index}].photo`, photoFile);
        setImageSrc(null); // Clear webcam image after use
      }

      // Always process the member image
      if (member.image && member.image[0]) {
        const imageFile = new File(
          [member.image[0]],
          `${member.fname}_${member.lname}_image.jpg`,
          { type: member.image[0].type }
        );
        formData.append(`member[${index}].image`, imageFile);
      }
    });

    // Debug: Print formData to the console
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Submit the formData to the server
    try {
      const response = await axios.post(
        `${baseURL}/api/booking/bulkboaderadd`,
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
         
          navigate("/bookingconfirmation",{state:{bookingId}});
          // setIsModalOpen(true);
        }, 1000);
        // reset();
        
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error(error.response?.data?.error);
    }
  };
  const handleSubmitModal = async () => {
    try {
      const payload = {
        bookingId,

        totalAmount: totalAmt * 1.18 - disamount,
        discount: disamount,
        advamount: adv,
        balance: totalAmt * 1.18 - disamount - adv,
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
        closeModal(); // Optionally close the modal
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit booking details."
      );
    }
  };

  const filteredRooms = rooms.filter((room) =>
    checkboxState.includes(room.value)
  );
  // console.log("filteredRooms",filteredRooms)
  // useEffect(() => {
  //   if (fields.length && filteredRooms.length) {
  //     fields.forEach((_, index) => {
  //       const roomNo = getValues(`room[${index}].roomNo`);
  //       const roomData = filteredRooms.find((room) => room.value === roomNo);
  
  //       const tariff = roomData?.label.split(" ").pop() || "";
  //       setValue(`room[${index}].roomTariff`, tariff);
  //     });
  //   }
  // }, [fields, filteredRooms, setValue, getValues,checkboxState]);
  
  const buildTariff=(index)=>{
    const roomNo = getValues(`room[${index}].roomNo`);
        const roomData = filteredRooms.find((room) => room.value === roomNo);
  
        const tariff = roomData?.label.split(" ").pop() || "";
        setValue(`room[${index}].roomTariff`, tariff);
  }
  useEffect(()=>{buildTariff()},[checkboxState])

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Guest Registration Form" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 bg-white">
      <ToastContainer />
      {showCheckDiv &&
        <div className="flex flex-col justify-center items-center   ">
        
          {/* Check Availibity */}

          <div className="border  border-gray-300 rounded-md p-6 shadow-md relative mt-4">
            <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
              Check Availibity
            </h2>

            <div className="grid grid-cols-6 gap-4">
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="name" className="text-base">
                  BookingID
                </label>
                <div className="text-lg"> {bookingId}</div>
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
                  id="fname"
                  type="number"
                  placeholder="Total Adults"
                  className="border p-2 rounded-md w-full"
                  value={adults}
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
                  value={children}
                  onChange={handleInputChangeChildren}
                  min="0"
                />
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="name" className="text-base">
                  CheckInDate:
                </label>
                <input
                  type="date"
                  value={startDate}
                  readOnly
                
                  onChange={handleStartDateChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="name" className="text-base">
                  CheckOutDate:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>
            {/* Button to Show Filtered Data */}
            <div className="flex justify-center items-center ">
              <button
                onClick={handleShowData}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Check Availibity
              </button>
            </div>
          </div>
          {/* Conditionally render RoomBookingTable */}
          <div>
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
            )
            
            }
          </div>
          
        </div>
}
{showForm &&
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-gray-300 p-6 rounded-md shadow-md bg-white min-w-[1024px]"
        >
          {/* Person data */}
          {showPersonData && (
            <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
              <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                Personal Info
              </h2>
              {fields.map((field, index) => (
                <div
                  className="grid grid-cols-4 sm:grid-cols-9 gap-2"
                  key={field.id}
                >
                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`member[${index}].fname`}
                      className="text-base"
                    >
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`member[${index}].fname`}
                      placeholder="Mrs. XYZ"
                      {...register(`member.${index}.fname`, {
                        required: "First Name is required",
                        onBlur: () => trigger(`member.${index}.fname`),
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Name can only contain letters and spaces",
                        },
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors?.member?.[index]?.fname && (
                      <p className="text-red-500 text-sm">
                        {errors.member[index].fname.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`member[${index}].lname`}
                      className="text-base"
                    >
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`member[${index}].lname`}
                      placeholder="Hembrom"
                      {...register(`member.${index}.lname`, {
                        required: "Last Name is required",
                        onBlur: () => trigger(`member.${index}.lname`),
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Name can only contain letters and spaces",
                        },
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors?.member?.[index]?.lname && (
                      <p className="text-red-500 text-sm">
                        {errors.member[index].lname.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`member[${index}].gender`}
                      className="text-base"
                    >
                      Gender<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      {...register(`member.${index}.gender`, {
                        required: "Gender is required",
                        onBlur: () => trigger(`member.${index}.gender`),
                      })}
                      className="border p-2 rounded-md w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors?.member?.[index]?.gender && (
                      <p className="text-red-500 text-sm">
                        {errors.member[index].gender.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`member[${index}].age`}
                      className="text-base"
                    >
                      Age<span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`member[${index}].name`}
                      placeholder="age 40"
                      {...register(`member.${index}.age`, {
                        required: "Age is required",
                        onBlur: () => trigger(`member.${index}.age`),
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors?.member?.[index]?.age && (
                      <p className="text-red-500 text-sm">
                        {errors.member[index].age.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-col space-y-1 mb-4">
                      <label
                        htmlFor={`member[${index}].photo`}
                        className="text-base"
                      >
                        Photo<span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-row">
                        <CameraIcon
                          size={50}
                          onClick={() => {
                            handleOpen();
                          }}
                        />
                       
                          <input
                            type="file"
                            id={`member[${index}].photo`}
                            {...register(`member.${index}.photo`, {
                              // required: "Photo is required",
                            })}
                            className="border p-2 rounded-md w-full"
                          />
                 
                      </div>
                      {/* {errors?.member?.[index]?.photo && (
                                                        <p className="text-red-500 text-sm">
                                                          {errors.member[index].photo.message}
                                                        </p>
                                                      )} */}
                    </div>
                  </div>

                  {/* <div className="flex flex-col space-y-1 mb-4">
                                                      <label
                                                        htmlFor={`member[${index}].photo`}
                                                        className="text-base"
                                                      >
                                                        Photo
                                                      </label>
                                                      <input
                                                        type="file"
                                                        id={`member[${index}].photo`}
                                                        {...register(`member.${index}.photo`, {
                                                          required: "Photo is required",
                                                        })}
                                                        className="border p-2 rounded-md w-full"
                                                      />
                                                      {errors?.member?.[index]?.photo && (
                                                        <p className="text-red-500 text-sm">
                                                          {errors.member[index].photo.message}
                                                        </p>
                                                      )}
                                                    </div> */}
                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`member[${index}].image`}
                      className="text-base"
                    >
                      ID Proof<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id={`member[${index}].image`}
                      {...register(`member.${index}.image`)}
                      onBlur={() => trigger(`member.${index}.image`)}
                      className="border p-2 rounded-md w-full"
                    />

                    {errors?.member?.[index]?.image && (
                      <p className="text-red-500 text-sm">
                        {errors.member[index].image.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`member[${index}].idtype`}
                      className="text-base"
                    >
                      Id Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      {...register(`member.${index}.idtype`, {
                        required: "Id Type is required",
                        onBlur: () => trigger(`member.${index}.idtype`),
                      })}
                      className="border p-2 rounded-md w-full"
                    >
                      <option value="">Id Type</option>
                      <option value="Voter Card">Voter Card</option>
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="Driving Licence">Driving Licence</option>
                      <option value="Passport">Passport</option>
                      <option value="other">Other</option>
                    </select>
                    {errors?.member?.[index]?.idtype && (
                      <p className="text-red-500 text-sm">
                        {errors.member[index].idtype.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`member[${index}].roomNo`}
                      className="text-base"
                    >
                      Room No
                    </label>
                    <select
                      {...register(`member[${index}].roomNo`, {
                        required: "Room no is required",

                        onBlur: () => {
                          trigger(`member[${index}].roomNo`);
                        },
                      })}
                      className="border p-2 rounded-md w-full"
                    >
                      <option value="">Select Room</option>
                      {checkboxState.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                    {errors.member &&
                      errors.member[index] &&
                      errors.member[index].roomNo && (
                        <p className="text-red-500 text-sm">
                          {errors.member[index].roomNo.message}
                        </p>
                      )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4 mt-8">
                    {/* Remove Member Button */}

                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                      className="bg-red-500 text-white py-0.5 px-1 text-xs rounded-md h-8"
                    >
                      Remove Member
                    </button>
                  </div>
                </div>
              ))}

              {/* Button to Add New Member */}

              {/* <div className="flex justify-center ">
              <button
                type="button"
                onClick={() => handleAddMember()}
                className="bg-green-500 text-white py-2 px-4 rounded-md mt-2"
              >
                Add Member
              </button>
            </div> */}
            </div>
          )}

          {/* Room row of form fields */}

          <div className="border  border-gray-300 rounded-md p-6 shadow-md relative mt-4">
            <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
              Room Info
            </h2>

            {checkboxState?.map((room, index) => (
              <div key={index} className="grid grid-cols-7 gap-4">
                <div className="flex flex-col space-y-1 mb-4">
                  <label
                    htmlFor={`room[${index}].checkInDate`}
                    className="text-base"
                  >
                    Check-In Date
                  </label>
                  <input
                    id={`room[${index}].checkInDate`}
                    type="date"
                    defaultValue={startDate}
                    {...register(`room[${index}].checkInDate`, {
                      required: "Check-In Date is required",

                      validate: (value) => {
                        const today = new Date().toISOString().split("T")[0];
                        return (
                          value >= today ||
                          "Check-In Date must be today or later"
                        );
                      },
                    })}
                    className="border p-2 rounded-md w-full"
                  />
                  {errors.room && errors.room[index]?.checkInDate && (
                    <p className="text-red-500 text-sm">
                      {errors.room[index].checkInDate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1 mb-4">
                  <label
                    htmlFor={`room[${index}].checkOutDate`}
                    className="text-base"
                  >
                    Check-Out Date
                  </label>
                  <input
                    id={`room[${index}].checkOutDate`}
                    type="date"
                    defaultValue={endDate}
                    {...register(`room[${index}].checkOutDate`, {
                      required: "Check-Out Date is required",
                      onBlur: () => Day(index),
                    })}
                    className="border p-2 rounded-md w-full"
                  />
                  {errors.room && errors.room[index]?.checkOutDate && (
                    <p className="text-red-500 text-sm">
                      {errors.room[index].checkOutDate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1 mb-4">
                  <label
                    htmlFor={`room[${index}].roomNo`}
                    className="text-base"
                  >
                    Room No
                  </label>
                  <input
                    id={`room[${index}].roomNo`}
                    type="text"
                    {...register(`room[${index}].roomNo`, {
                      required: "Room No is required",
                    })}
                    className="border p-2 rounded-md w-full"
                    defaultValue={room}
                  />
                  {errors.room?.[index]?.roomNo && (
                    <p className="text-red-500 text-sm">
                      {errors.room[index].roomNo.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label
                    htmlFor={`room[${index}].no_of_nights`}
                    className="text-base"
                  >
                    Nights
                  </label>
                  <input
                    id={`room[${index}].no_of_nights`}
                    type="text"
                    defaultValue={defaultNights}
                    {...register(`room[${index}].no_of_nights`, {
                      required: "Room of Night is required",
                    })}
                    className="border p-2 rounded-md w-full"
                  />
                  {errors.room && errors.room[index]?.no_of_nights && (
                    <p className="text-red-500 text-sm">
                      {errors.room[index].no_of_nights.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1 mb-4">
                  <label
                    htmlFor={`room[${index}].roomTariff`}
                    className="text-base"
                  >
                    Room Tariff
                  </label>
                  <input
                    id={`room[${index}].roomTariff`}
                    type="number"
                    defaultValuevalue={buildTariff(index)}
                    //  defaultValue={getValues(`room[${index}].roomTariff`)}
                    {...register(`room[${index}].roomTariff`, {
                      required: "Room Tariff is required",
                    })}
                    
                    className="border p-2 rounded-md w-full"
                  />
                  {errors.room && errors.room[index]?.roomTariff && (
                    <p className="text-red-500 text-sm">
                      {errors.room[index].roomTariff.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1 mb-4">
                  <label
                    htmlFor={`room[${index}].no_of_adults`}
                    className="text-base"
                  >
                    No of Adults
                  </label>
                  <input
                    id={`room[${index}].no_of_adults`}
                    type="number"
                    {...register(`room[${index}].no_of_adults`, {
                      required: "Number of adults is required",
                    })}
                    className="border p-2 rounded-md w-full"
                    min="0"
                  />
                  {errors.room && errors.room[index]?.no_of_adults && (
                    <p className="text-red-500 text-sm">
                      {errors.room[index].no_of_adults.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1 mb-4">
                  <label
                    htmlFor={`room[${index}].no_of_child`}
                    className="text-base"
                  >
                    No of Children
                  </label>
                  <input
                    id={`room[${index}].no_of_child`}
                    type="number"
                    {...register(`room[${index}].no_of_child`)}
                    className="border p-2 rounded-md w-full"
                     min="0"
                  />
                  {errors.room && errors.room[index]?.no_of_child && (
                    <p className="text-red-500 text-sm">
                      {errors.room[index].no_of_child.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="border  border-gray-300 rounded-md p-6 shadow-md relative mt-4">
            <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
              Contact Info
            </h2>

            <div className="grid grid-cols-3 gap-4 px-10 ">
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="mobile" className="text-base">
                  Mobile<span className="text-red-500">*</span>
                </label>
                <input
                  id="mobile"
                  type="text"
                  placeholder="(+91)09749123654"
                  {...register("mobile", {
                    required: "Mobile is required",
                    onBlur: () => trigger("mobile"),
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be exactly 10 digits",
                    },
                  })}
                  className="border p-2 rounded-md w-full"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="mobile" className="text-base">
                  Alternative Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  placeholder="(+91)09749123654"
                  {...register("alt_mobile", {
                    onBlur: () => trigger("mobile"),
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be exactly 10 digits",
                    },
                  })}
                  className="border p-2 rounded-md w-full"
                />
                {errors.alt_mobile && (
                  <p className="text-red-500 text-sm">
                    {errors.alt_mobile.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="email" className="text-base">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  {...register("email", {
                    onBlur: () => trigger("email"),
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="border p-2 rounded-md w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
<div className="flex flex-row gap-2">
   {/* Address Info */}
   <div className="border w-3/5 border-gray-300 rounded-md p-6 shadow-md relative mt-4">
            <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
              Address Info
            </h2>

            <div className="grid grid-cols-4 gap-4 px-10 ">
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="address" className="text-base">
                  Address Line1<span className="text-red-500">*</span>
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
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="address" className="text-base">
                  Address Line2
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
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address2.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="address" className="text-base">
                  Pin<span className="text-red-500">*</span>
                </label>
                <input
                  id="pin"
                  type="text"
                  placeholder="712400"
                  {...register("pin", {
                    required: "Pin is required",
                    onBlur: () => trigger("pin"),
                  })}
                  className="border p-2 rounded-md w-full"
                />
                {errors.pin && (
                  <p className="text-red-500 text-sm">{errors.pin.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1 mb-4">
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
                  <p className="text-red-500 text-sm">{errors.state.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="address" className="text-base">
                  Country<span className="text-red-500">*</span>
                </label>
                <input
                  id="country"
                  type="text"
                 defaultValue={country}
                 onChange={(e)=>{setCountry(e.target.value)}}
                  className="border p-2 rounded-md w-full"
                />
             
              </div>
            </div>
            
         
          </div>
          {/* Extra */}
          <div className="border w-2/5 border-gray-300 rounded-md p-6 shadow-md relative mt-4">
            <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
             Additional Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ">
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="amount" className="text-base">
                  Purpose
                </label>
                <input
                  id="amount"
                  placeholder="eg. Travelling"
                  {...register("purpose")}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="advamount" className="text-base">
                  Going To
                </label>
                <input
                  id="goingto"
                  placeholder="Kolkata"
                  {...register("goingto")}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="advamount" className="text-base">
                  Coming From
                </label>
                <input
                  id="comingfrom"
                  placeholder="Puri"
                  {...register("comefrom")}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col space-y-1 mb-4">
                <label htmlFor="advamount" className="text-base">
                 Comments
                </label>
                <input
                  id="comingfrom"
                  placeholder="Write Your Comments"
                  {...register("comments")}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>
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
}
        {/* // Modal capture photo */}
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex flex-row justify-between items-center ">
                <div className="basis-1/2">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Capture Photo
                  </Typography>
                </div>
                <div className="mr-2 basis-1/6">
                  <CircleX size={24} color="red" onClick={handleClose} />
                </div>
              </div>
              <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMedia={onUserMedia}
                  mirrored={true}
                />
                <button
                  onClick={capture}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-1"
                >
                  Capture Photo
                </button>
                <button
                  onClick={() => {
                    setImageSrc1(null);
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-md mt-1"
                >
                  Refresh
                </button>
                {imageSrc1 && (
                  <div>
                    <h3>Captured Image</h3>
                    <img src={imageSrc1} alt="Captured" />
                  </div>
                )}
              </div>
            </Box>
          </Modal>
        </div>
        {/* Confirmation Modal */}
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="border border-gray-300 rounded-md p-3 shadow-md relative bg-white w-96">
              <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                Booking Summary
              </h2>
              <div className="flex flex-col space-y-1">
                {/* Replace with dynamic data from your response */}
                <div className="flex flex-row justify-between items-center p-2 mt-2">
                  <span className="text-sm text-gray-700">Booking ID:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {bookingId || "N/A"}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">No of Rooms:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {no_of_room || "N/A"}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">No of Adult:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {adults || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">No of Children:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {children || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">
                    Total Room Tariff:
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    {totalAmt || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">Discount:</span>
                  <input
                    type="number"
                    value={disamount}
                    onChange={handleInputChange}
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
                    {totalAmt * 1.18 - disamount}
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">Advance Amount:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    <input
                      type="number"
                      value={adv}
                      onChange={handleInputChangeAdv}
                      className="border border-gray-300 rounded p-1 text-sm flex-grow w-full"
                      placeholder="Enter Advance Amount"
                    />
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center p-2">
                  <span className="text-sm text-gray-700">
                    Remaining Amount:
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    {totalAmt * 1.18 - disamount - adv}
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
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSubmitModal}
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded"
                >
                  Submit Data
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 p-2 text-gray-700 hover:text-gray-900"
              >
                <span className="font-bold text-xl">&times;</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GroupBooking;
