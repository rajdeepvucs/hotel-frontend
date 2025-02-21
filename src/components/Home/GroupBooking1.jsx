import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext
} from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
} from "@material-tailwind/react";
import Header from "../common/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpecificRange from "./SpecificRange";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { CameraIcon, CrossIcon, CircleX, CirclePlus, CircleMinus } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Webcam from "react-webcam";
// import apiClient from "../../api/apiClient";
import { baseURL } from "../../../config";
import { getLocalTime } from "../../utils/dateTime";
import { useNavigate } from "react-router-dom";
// import uuid from "react-uuid";
import axios from "axios";
import GstContext from "../Context/Gst/GstContext";

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
function GroupBooking1() {
  const today = new Date().toISOString().split("T")[0];
  const [mealPlans, setMealPlans] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
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
  const [selectedMode, setSelectedMode] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [adv, setadv] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showCheckDiv, setShowCheckDiv] = useState(true);
  const [gst, setGst] = useState(0);
  const [referrPerson,setReferrPerson]=useState("");
  const navigate = useNavigate();
  const [filteredMealPlans, setFilteredMealPlans] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [roomType, setRoomType] = useState();
  const [preview, setPreview] = useState(null); // Initialize preview as null
  const [roomMaxAllocations, setRoomMaxAllocations] = useState({});
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState({});
  const [isPhotoPreviewVisible, setIsPhotoPreviewVisible] = useState({});
  const [error,setError]=useState();
  const { gstRate } = useContext(GstContext);
 
  const today_date = new Date().toISOString().split("T")[0];

  const propName = localStorage.getItem('propertyId');

  const handleRemovePreview = (index, fieldName) => () => {
      if (fieldName === "photo") {
          setPhotoPreviews((prev) => {
              const updated = { ...prev };
              delete updated[index];
              return updated;
          });
          setImageSrc((prev)=>{
              const updated={...prev};
              delete updated[index];
              return updated;
          })
          setValue(`member[${index}].photo`,null)
           setIsPhotoPreviewVisible((prev)=>({
                ...prev,
                [index]:false,

            }))
      }
    if (fieldName === "image") {
      setImagePreviews((prev) => {
              const updated = { ...prev };
              delete updated[index];
              return updated;
          });
           setValue(`member[${index}].image`,null)
           setIsImagePreviewVisible((prev)=>({
                ...prev,
                [index]:false,
            }))
    }

  };
  const handleCameraClick = (index) => () => {
    console.log("index",index)
    handleOpen(index);
    setValue(`member[${index}].webcamCapture`, true);
 };
 const handleOpen = (index) => {
  setOpenModalIndex(index);
};
 const handleClose = () => {
      setOpenModalIndex(null);
  };
  const handleRoomTypeChange = (e) => {
    setRoomType(e.target.value);
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
      let daysDifference = timeDifference / (1000 * 3600 * 24);

      // Ensure at least 1 day if check-in and checkout are the same
      daysDifference = Math.max(daysDifference, 1);

      console.log("Number of days:", daysDifference);
      setDefaultNights(daysDifference);
    } else {
      setDefaultNights(1);
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
      let daysDifference = timeDifference / (1000 * 3600 * 24);

      // Ensure at least 1 day if check-in and checkout are the same
      daysDifference = Math.max(daysDifference, 1);

      console.log("Number of days:", daysDifference);
      setValue(`room[${index}].no_of_nights`, daysDifference);
    } else {
      setValue(`room[${index}].no_of_nights`, 1);
    }
  };
  const Day = (index) => {
    trigger("checkOutDate").then(() => {
      calculateDay(index);
    });
  };
  useEffect(() => {
    calculateDefaultDay();
  }, [startDate, endDate]);
  const calculateCheckoutDate = (checkInDate, noOfNights) => {
    if (!checkInDate || !noOfNights) {
      return null;
    }
    const checkIn = new Date(checkInDate);
    const checkout = new Date(checkIn); // Make a copy to avoid modifying original date object
    checkout.setDate(checkIn.getDate() + parseInt(noOfNights, 10));
    return checkout.toISOString().split("T")[0]; // format yyyy-mm-dd
  };
  const handleNightsChange = (e) => {
    const newNights = e.target.value;
    setDefaultNights(newNights);
    const checkInDate = startDate;
    const calculatedCheckOutDate = calculateCheckoutDate(
      checkInDate,
      newNights
    );
    setEndDate(calculatedCheckOutDate);
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
  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    if (selectedDate >= today) {
      if (endDate && selectedDate > endDate) {
        alert("Start date cannot be later than end date.");
        setStartDate(""); // Reset the start date
      } else {
        setStartDate(selectedDate);
      }
    } else {
      alert("The start date cannot be earlier than today's date.");
      setStartDate(""); //Reset the start date
    }
  };
  // const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    const today = new Date().setHours(0, 0, 0, 0); // Set time to 00:00:00 for accurate comparison

    if (new Date(selectedEndDate).setHours(0, 0, 0, 0) < today) {
      alert("Check-out date must be today or a future date.");
      setEndDate(""); // Reset the check-out date field
    } else if (startDate && selectedEndDate < startDate) {
      alert("Check-out date cannot be earlier than check-in date.");
      setEndDate(""); //Reset the check-out date field
    }
    else {
      setEndDate(selectedEndDate); // Update the end date if valid
    }
  };
  const handleInputChangeRoom = (e) =>
    setNoOfRoom(parseInt(e.target.value) || 0);
  useEffect(() => {
    setTotalRows(adults + children);
  }, [adults, children]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesResponse = await axios.get(
          "https://restcountries.com/v3.1/all"
        );
        const countryNames = countriesResponse.data.map(
          (country) => country.name.common
        );
        setCountries(countryNames);

        // Fetch room details
        const roomDetailsResponse = await axios.get(
          `${baseURL}/api/room/getMealPlansByRoomId/?propertyId=${propName}`
        );
        setRoomData(roomDetailsResponse.data);

        setError(null); // Clear any previous errors if both requests succeed
      } catch (error) {
        // Handle any errors from either fetch
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };
  useEffect(() => {
    const id = generateBookingId();
    setBookingId(id);
    const fetchMaxAllocations = async () => {
      try {
          const response = await axios.get(
              `${baseURL}/api/room/getRoomMaxAllocations/?propertyId=${propName}`)
             

          setRoomMaxAllocations(response.data);
      } catch (error) {
          console.error("Error fetching room max allocations:", error);
      }
  };

    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/room/allRooms/?propertyId=${propName}`); // Update this URL based on your API route

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
    fetchMaxAllocations();
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
      roomType: "",
      roomTariff: "",
      no_of_adults: "",
      no_of_child: "",
    }));
  

  // useEffect(() => {
  //   checkboxState.forEach((room, index) => {
  //     setValue(`room[${index}].roomNo`, room);
  //     setValue(`room[${index}].mealPlan`, "Room Only");
  //   const defaultMeal =  mealPlans?.find((meal)=> meal.mealPlan ==="Room Only");
  //    setValue(`room[${index}].roomTariff`,defaultMeal?.tariff );
  //   });

  // }, [checkboxState]);

  const handleShowData = () => {
    if (no_of_room && adults && startDate && endDate) {
      setShowFilteredData(true);
      setShowPesonData(true);
      showPerson();
      calculateDefaultDay();
      // console.log('----->>>>', no_of_room, adults);
    } else {
      alert("Please select no of room,adults ,children, start and end date.");
    }
  };

  function generateBookingId() {
    // Get the current timestamp in milliseconds
    // const timestamp = Date.now(); // Returns the number of milliseconds since January 1, 1970
    // return timestamp;
    //return uuid();

    // const propName = localStorage.getItem('property_name').replace(/\s+/g, '');
    // const user_name = localStorage.getItem("user").replace(/\s+/g, '');;
    // const date = new Date();
    // const timestamp = Date.now();
    // const year = date.getFullYear();
    // const bookingId = `${propName}-${user_name}-${year}-${timestamp}`;
    // return bookingId;


    const propName = localStorage.getItem('propertyId').replace(/\s+/g, '');
    const userName = localStorage.getItem("user").replace(/\s+/g, '');
    const propertyPrefix = propName.substring(0, 3).toUpperCase();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timeString = `${hours}${minutes}`; // Format as HHMM
    const milliseconds = date.getMilliseconds().toString().padStart(2, '0');
    const bookingId = `${propertyPrefix}${userName.substring(0, 3).toUpperCase()}${year}${timeString}${milliseconds}`;

    return bookingId;

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

    // Convert object to array and filter out undefined or invalid entries
    const roomsArray = Array.isArray(currentValues)
      ? currentValues
      : Object.values(currentValues).filter(
          (room) => room && typeof room === "object"
        );

    if (!Array.isArray(roomsArray)) {
      console.error(
        "Invalid data structure for currentValues. Unable to process."
      );
      return { totalAmount: 0, gstAmount: 0 }; // Return an object
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
    // Calculate GST and total amount together
    const gstAmount = totalAmount * 0.18;
    const finalTotal = totalAmount + gstAmount;
    return { totalAmount, gstAmount, finalTotal };
  };

  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState({});
  const [imageSrc1, setImageSrc1] = useState(null);
  const [open, setOpen] = React.useState(false);
  

  const capture = async (index) => {
    // Capture image from webcam and store it in state
    const image = webcamRef.current.getScreenshot();

    setImageSrc1(image);
    // Convert base64 to Blob
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();

    // Create a file from the blob
    const file = new File([blob], "captured-image.png", { type: "image/png" });
    setImageSrc((prevImageSrc)=>({
      ...prevImageSrc,
      [index]:file
    }));
    // Now you can upload this file or use it as needed
  //   setImageSrc(file);
  };
  const handleRemoveImageClick = (index) => () => {
    handleRemoveImage(index);
};
   const handleRemoveImage = (index) => {
      setImageSrc((prev) => {
          const updated = { ...prev };
          delete updated[index];
          return updated
      })
       setImageSrc1(null)
     };

  const onUserMedia = (e) => {
    console.log(e);
  };
  const processRoomData = (data) => {
    // console.log("Raw room data:", data?.room);

    // Safely extract room data and filter out undefined or invalid entries
    const cleanedRooms = Object.values(data?.room || {}).filter(
      (room) => room && typeof room === "object"
    );

    console.log("Cleaned room data:", cleanedRooms);

    return cleanedRooms;
  };



  const handleFileChange = (e, index, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === "photo") {
          setPhotoPreviews((prev) => ({ ...prev, [index]: reader.result }));
        }
        if (fieldName === "image") {
          setImagePreviews((prev) => ({ ...prev, [index]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processRowData = () => { // Function to prepare row data for API
    return rows.map(row => ({
        feature: row.feature,
        quantity: row.quantity,
        price: row.price,
        bedcharge: row.bedcharge
    }));
};
const options = [
  { value: 'room_only', label: 'Room Only', tariff: '0' },
  { value: 'room_with_breakfast', label: 'Room with Breakfast', tariff: '200' },
];
const selectedOption = watch('room_type', ''); // Watch the dynamically named field
const[meal,setMeal]=useState(0);//meal charge
const handleSelectChange = (value) => {
  const selected = options.find((option) => option.value === value);
  // Correctly update the dynamically named tariff field
  setMeal( selected ? selected.tariff : '');
};
  const onSubmit = async (data) => {
    // const { totalAmount, gstAmount, finalTotal } = calculateTotalTariff();
  
    const formData = new FormData();

    // Append simple form fields
    formData.append("bookingId", bookingId);

    formData.append(
      "address",
      `${data.address1.toUpperCase()} ${data.address2.toUpperCase()} ${
        data.pin
      } ${selectedState} ${selectedCountry}`
    );
    formData.append(
      "pin",
      ` ${data.pin}`
    );
    formData.append(
      "state",
      ` ${selectedState}`
    );
    formData.append(
      "country",
      `${selectedCountry}`
    );


    formData.append("email", data.email);

    formData.append("mobile", data.mobile);
    formData.append("purpose", data.purpose);
    formData.append("comefrom", data.comefrom);
    formData.append("goingto", data.goingto);
    formData.append("status", "checkIn");
    formData.append("comments", data.comments);
    formData.append("gst", roomGst+foodGst);
    formData.append("roomGst", roomGst);
    formData.append("foodGst", foodGst);
    formData.append("featureCharge", featureCharge);

    // formData.append("paymentmode", data.paymentmode);
    formData.append("CheckInTime", getLocalTime());
    formData.append("no_of_room", no_of_room);
    // formData.append("no_of_adults", noOfAdults);
    // formData.append("no_of_minor", noOfChild);
    formData.append("totalAmount", finalAmount);
    formData.append("balence", finalAmount - 0);
    formData.append("referredPerson", referrPerson);
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
          `member[${index}].checkInDate`, startDate
          // assignedRoom.checkInDate
        );
        formData.append(
          `member[${index}].checkOutDate`, endDate
          // assignedRoom.checkOutDate
        );
        formData.append(`member[${index}].roomType`,getValues(`room[${index}].roomType`));
        formData.append(`member[${index}].roomNo`,getValues(`room[${index}].roomNo`));
        formData.append(
          `member[${index}].no_of_adults`,
          // assignedRoom.no_of_adults
          adults
        );
        formData.append(
          `member[${index}].no_of_child`,
          // assignedRoom.no_of_child
          children

        );
        formData.append(`member[${index}].roomTariff`,getValues(`room[${index}].roomTariff`));
        formData.append(`member[${index}].mealPlan`, getValues(`room[${index}].mealPlan`));
        formData.append(
          `member[${index}]. no_of_nights`,
          //assignedRoom.no_of_nights
          defaultNights
        );
      }
      // Check for uploaded photo first
      if (member.photo && member.photo[0]) {
        const uploadedPhotoFile = new File(
          [member.photo[0]],
          `${member.fname}_${member.lname}_photo_uploaded.jpg`,
          { type: member.photo[0].type }
        );
        formData.append(`member[${index}].photo`, uploadedPhotoFile);
      } else if (imageSrc[index]) {
        // If no uploaded photo, use webcam image
        const photoFile = new File(
          [imageSrc[index]],
          `${member.fname}_${member.lname}_photo_webcam.jpg`,
          { type: imageSrc[index].type }
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
    const rowDataForApi = processRowData(); // Call the function

    formData.append("row_data", JSON.stringify(rowDataForApi)); // Append the row data as J

    // Debug: Print formData to the console
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Submit the formData to the server
    try {
      const response = await axios.post(
        `${baseURL}/api/booking/bulkboaderadd/?propertyId=${propName}`,
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

         // navigate("/bookingconfirmation", { state: { bookingId } });
            setIsModalOpen(true);
        }, 1000);
        // reset();
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error(error.response?.data?.error);
    }
  };






  const handleSubmitModal = async () => {
     const advanceAmount = parseFloat(adv);
      
        if (advanceAmount <= 0) {
          toast.error("Advance amount must be a positive number. Please enter a valid amount.");
          return; // Stop the submission
        }
    try {

      const payload = {
        bookingId,

        totalAmount: finalAmount,
    
        advamount: adv,
        balance: finalAmount - adv,
        paymentMode: selectedMode,
        transactionId,
        createdBy: localStorage.getItem("user"),
        paymentTime: getLocalTime(),
        description: "Advance paid",
      };

      const response = await axios.post(
        `${baseURL}/api/booking/submitBooking/?propertyId=${propName}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking details submitted successfully!");
        navigate("/bookingconfirmation", { state: { bookingId } })
        closeModal(); // Optionally close the modal
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit booking details."
      );
    }
  };
  useEffect(() => {
    const fetchMealPlansForRooms = async () => {
      if (!roomData || !Array.isArray(roomData)) return;
      const mealPlanOptions = {};
      for (const [index, roomName] of checkboxState.entries()) {
        // Find the room data corresponding to the roomName
        const roomItem = roomData.find((room) => room.roomName === roomName);
        console.log("roomItem.roomType", roomItem.roomType);
        if (roomItem && roomItem.mealPlans && roomItem.mealPlans.length > 0) {
          // Set the initial meal plan
          setValue(`room[${index}].roomType`, roomItem.roomType);
          setValue(`room[${index}].roomNo`, roomName);
          setValue(`room[${index}].mealPlan`, roomItem.mealPlans[0].mealPlan); // Default to the first meal plan
          setValue(`room[${index}].roomTariff`, roomItem.mealPlans[0].tariff); // Default tariff for first meal plan
          mealPlanOptions[roomName] = roomItem.mealPlans;
          if (checkboxState.length === 1) {
            setValue(`member[${index}].roomNo`, checkboxState[0]);
          }
        } else {
          // Handle case where the room data is not found, or mealplans are missing
          setValue(`room[${index}].roomNo`, roomName);
          setValue(`room[${index}].roomType`, roomItem.roomType);
          setValue(`room[${index}].mealPlan`, "Room Only");
          setValue(`room[${index}].roomTariff`, 0);
          mealPlanOptions[roomName] = [
            { id: 1, mealPlan: "Room Only", tariff: 0 },
          ];
          if (checkboxState.length === 1) {
            setValue(`member[${index}].roomNo`, checkboxState[0]);
          }
        }
      }
      setFilteredMealPlans(mealPlanOptions);
    };
    fetchMealPlansForRooms();
  }, [checkboxState, setValue, roomData, setFilteredMealPlans]);

  const filteredRooms = rooms.filter((room) =>
    checkboxState.includes(room.value)
  );
  const checkRoomAllocation = (roomNo, memberIndex = null) => {
    if (!roomNo) return true; // No room selected, allow
 
     const roomDetail = rooms.find((room) => room.value === roomNo);
 
     // if room is not found or room has no allocation, allow select
     if(!roomDetail || !roomMaxAllocations[roomNo]) return true;
 
     const maxAllocation = roomMaxAllocations[roomNo];
     let membersInRoom = fields.filter((member, index) => {
       // If memberIndex is provided, ignore the current member
        if (memberIndex !== null && index === memberIndex) return false;
         return getValues(`member[${index}].roomNo`) === roomNo
         });
     if (membersInRoom.length >= maxAllocation) {
             return false;
     }
 
 
     return true;
 };
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

  // const buildTariff = (index) => {
  //   const roomNo = getValues(`room[${index}].roomNo`);
  //   const roomData = filteredRooms.find((room) => room.value === roomNo);

  //   const tariff = roomData?.label.split(" ").pop() || "";
  //   setValue(`room[${index}].roomTariff`, tariff);
  // };
  const buildTariff = useCallback(
    (index) => {
      const selectedMeal = watch(`room[${index}].mealPlan`);
      // console.log(`buildTariff called for room ${index}, selected meal:`, selectedMeal);
      if (selectedMeal) {
        const roomName = checkboxState[index];
        const roomItem = roomData?.find((room) => room.roomName === roomName);

        const meal = roomItem?.mealPlans?.find(
          (meal) => meal.mealPlan === selectedMeal
        );
        console.log(`meal found for ${selectedMeal}`, meal);
        return meal?.tariff;
      }
      console.log(`no meal selected return tariff form getValues`);
      return getValues(`room[${index}].roomTariff`);
    },
    [watch, getValues, roomData, checkboxState]
  );
  const SetMeal = useCallback(
    (index, newMealPlan) => {
      if (newMealPlan) {
        const roomName = checkboxState[index];
        const roomItem = roomData?.find((room) => room.roomName === roomName);
        const meal = roomItem?.mealPlans?.find(
          (meal) => meal.mealPlan === newMealPlan
        );
        setValue(`room[${index}].roomTariff`, meal?.tariff);
      }
    },
    [roomData, checkboxState, setValue]
  );
  const updateRoomAllocation = (roomNo, index, prevRoomNo = null, prevAge = null) => {
    if (!roomNo) {
        return;
    }
    const age = parseInt(getValues(`member[${index}].age`), 10);
    let currentValues = getValues("room");
    const roomsArray = Array.isArray(currentValues)
        ? currentValues
        : Object.values(currentValues).filter(
            (room) => room && typeof room === "object"
        );

    //if the room is changed
     if (prevRoomNo && prevRoomNo !== roomNo) {
       roomsArray.forEach((room, roomIndex) => {
           if (room.roomNo === prevRoomNo) {
                const isPrevAdult = prevAge >= 18;
               setValue(`room[${roomIndex}].no_of_adults`, Math.max(0, parseInt(room.no_of_adults || 0) - (isPrevAdult ? 1 : 0)));
               setValue(`room[${roomIndex}].no_of_child`, Math.max(0, parseInt(room.no_of_child || 0) - (!isPrevAdult ? 1 : 0)));
               const handleRemoveMember = (index) => {
                const prevRoomNo = getValues(`member[${index}].roomNo`);
                const prevAge = getValues(`member[${index}].age`);
                 remove(index);
       
               if (prevRoomNo) {
                   updateRoomAllocation(prevRoomNo, index, prevRoomNo, prevAge);
               }
       
           };          }
       });
     }
    //if age is changed in same room
    else if(prevAge != null && prevRoomNo === roomNo )
    {
        roomsArray.forEach((room, roomIndex) => {
          if (room.roomNo === roomNo) {
             const isPrevAdult = prevAge >= 18;
              const isNewAdult = age >= 18;
                if(isNewAdult !== isPrevAdult)
                {
                  setValue(`room[${roomIndex}].no_of_adults`,  Math.max(0, parseInt(room.no_of_adults || 0)  + (isNewAdult ? 1 : -1) ));
                  setValue(`room[${roomIndex}].no_of_child`, Math.max(0,parseInt(room.no_of_child || 0) + (!isNewAdult ? 1 : -1)));
                }
            }
      });
    }
    // Then increment the count in the new room
    else {
     roomsArray.forEach((room, roomIndex) => {
         if (room.roomNo === roomNo) {
           const isNewAdult = age >= 18;
              setValue(`room[${roomIndex}].no_of_adults`,  parseInt(room.no_of_adults || 0)  + (isNewAdult ? 1 : 0) );
               setValue(`room[${roomIndex}].no_of_child`, parseInt(room.no_of_child || 0) + (!isNewAdult ? 1 : 0));
         }
     });

    }
};


const handleAgeChange = (e, index) => {
    const newAge = e.target.value;
    const roomNo = getValues(`member[${index}].roomNo`);
    const prevAge = getValues(`member[${index}].age`);
    const prevRoomNo = getValues(`member[${index}].roomNo`);

    setValue(`member[${index}].age`, newAge);
    if (roomNo) {
        updateRoomAllocation(roomNo, index, prevRoomNo, prevAge);
    }
};

const handleRoomChange = (e, index) => {
    const newRoomNo = e.target.value;
    const prevRoomNo = getValues(`member[${index}].roomNo`);
    const prevAge = getValues(`member[${index}].age`);
    setValue(`member[${index}].roomNo`, newRoomNo);
    updateRoomAllocation(newRoomNo, index, prevRoomNo, prevAge);
    trigger(`member[${index}].roomNo`);
};
const handleRemoveMember = (index) => {
  const prevRoomNo = getValues(`member[${index}].roomNo`);
  const prevAge = getValues(`member[${index}].age`);
   remove(index);

 if (prevRoomNo) {
     updateRoomAllocation(prevRoomNo, index, prevRoomNo, prevAge);
 }

};

 const roomDetails=getValues("room");
const [totalAmount,settotalAmount]=useState(0);
const [roomGst,setRoomGst]=useState(0);
const [foodGst,setFoodGst]=useState(0);
const [onlyRoom,setOnlyRoom]=useState(0);

const [additionalDiscount,setAdditionalDiscount]=useState(0);

const [finalAmount, setfinalAmount] = useState(0); // Initialize with a default value

// const handleExtraBedChange = (e) => {
//   setSelectedExtraBed(e.target.value);
// };
const calculateTotalWithGST = (roomTariff, nights, mealCharge) => {

  let total = roomTariff * nights;
  let meal=mealCharge * nights;
  let roomgstRate;
  let foodgstRate;
 const gstPct= gstRate.find(gst =>
    gst.GST_TYPE === 'ROOM' &&
    roomTariff >= gst.GST_LOWER_RANGE &&
    roomTariff <= gst.GST_HIGHER_RANGE
  );
  const gstFoodPct= gstRate.find(gst =>
    gst.GST_TYPE === 'FOOD' &&
    roomTariff >= gst.GST_LOWER_RANGE &&
    roomTariff <= gst.GST_HIGHER_RANGE
  )

  roomgstRate=gstPct?.GST_PCT/100
  foodgstRate=gstFoodPct?.GST_PCT/100
  // if (roomTariff > 7500) {
  //     roomgstRate = 0.18;
  // } else {
  //     roomgstRate = 0.12;
  // }
  const roomgstAmount = total * roomgstRate;
  const foodgstAmount = meal * foodgstRate;
  const onlyRoom=total;
      
 
  return {
      total: total+meal   ,
      roomGst:roomgstAmount,
      foodGst:foodgstAmount,
      onlyRoom:onlyRoom,
   }
  };
 


// Append Additional Features
const [rows, setRows] = useState([{ id: 1, feature: '', quantity: 1, price: 0, bedcharge: '' }]);
const [featurePrices, setFeaturePrices] = useState({ // Store prices for each feature
    "Extra Bed": 825,
    "Room Heater": 950,
    "Additional Food": 600,
    "":0
});

const [featureCharge,setFeatureCharge]=useState(0)
const handleAddRow = () => {
    const newRow = { id: rows.length + 1, feature: '', quantity: 1, price: 0, bedcharge: '' };
    setRows([...rows, newRow]);
};

const handleRemoveRow = (id) => {
    const updatedRows = rows.filter(row => row.id !== id);
    setRows(updatedRows);
};

const handleInputChangeFeatures = (index, field, value) => {
  const updatedRows = rows.map((row, i) => {
      if (i === index) {
          let newPrice = row.price; // Keep the existing price by default
          if (field === 'feature') {
              newPrice = featurePrices[value] || 0; // Lookup the price based on selected feature
          }
          return { ...row, [field]: value, price: newPrice };
      } else {
          return row;
      }
  });
  setRows(updatedRows);
};
const calculateTotalBedCharge = () => {
 
  return rows.reduce((total, row) => {
      const bedCharge = parseFloat(row.bedcharge) || 0; // Ensure it's a number
      const totalBedCharge= total + bedCharge* parseInt(row.quantity);
      setfinalAmount(totalBedCharge)
      return totalBedCharge
  }, 0);
};
useEffect(()=>{
  if (checkboxState?.length>0) {
      let totalRoomGst = 0;
      let totalFoodGst= 0;
      let totalAmountl= 0;
      let totalOnlyRoom= 0;
    checkboxState?.forEach((field,index)=>{
     
           const {total, roomGst,foodGst,onlyRoom } = calculateTotalWithGST(
                Number(watch(`member[${index}].roomTariff`)) || Number(watch(`room[${index}].roomTariff`))||0,
               defaultNights,
               Number(meal) || 0
             );
               totalAmountl += total
               totalRoomGst += roomGst
               totalFoodGst += foodGst
               totalOnlyRoom += onlyRoom
             })
      setRoomGst(totalRoomGst);
      setFoodGst(totalFoodGst)
      setFeatureCharge(calculateTotalBedCharge());
      settotalAmount(totalAmountl+roomGst+ foodGst+featureCharge );
      setfinalAmount(totalAmount-additionalDiscount);
      setOnlyRoom(totalOnlyRoom);
  }        

}, [fields, watch, defaultNights, calculateTotalWithGST,rows])
// / Append Additional Features


  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="" />

      <main className="w-full mx-auto  px-8 bg-white">
        <ToastContainer />

        <div className="flex flex-row  mt-2">
          <div className="flex-inline space-y-1 my-4 ">
            <label
              htmlFor="name"
              className="text-base rounded-md uppercase blueset-bg p-2"
            >
              Booking ID: <span className="rounded-md">{bookingId}</span>
            </label>
          </div>
        </div>
        <div className="flex flex-row  mt-2 justify-center">
          <div className="w-9/12 mr-5 set_scroll_lft" id="style-1">
            <>
              <div className="flex flex-col">
                {/* Check Availibity */}
                <div className="border  border-gray-300 rounded-md p-6 shadow-md relative">
                  <div className="flex justify-between">
                    <h2 className=" left-5 text-lg font-semibold text-gray-700 mb-3">
                      Check Availability
                    </h2>
                    <div className="flex gap-x-5">
                      <div className="flex mb-4 items-center border border-blue-300 rounded-md p-1 pl-2">
                        <label
                          htmlFor="name"
                          className="text-base text-nowrap pr-3"
                        >
                          Check-in:
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          min={today_date}
                          className="p-2 rounded-md w-[130px]"
                        />
                      </div>

                      <div className="flex mb-4 items-center border border-blue-300 rounded-md p-1 pl-2">
                        <label
                          htmlFor="name"
                          className="text-base text-nowrap pr-3"
                        >
                          Check-out:
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          min={today_date}
                          className="p-2 rounded-md w-[130px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex flex-row items-start gap-3">
                      <div className="basis-3 justify-start">
                        <div>
                          <label
                            htmlFor="name"
                            className="text-base text-nowrap"
                          >
                            No of Rooms
                          </label>
                          <input
                            id="fname"
                            type="number"
                            placeholder="Total Rooms"
                            className="border border-gray-600 p-1 rounded-sm  text-center placeholder:text-[12px] w-full"
                            value={no_of_room}
                            onChange={handleInputChangeRoom}
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="basis-3 justify-start">
                        <div>
                          <label
                            htmlFor="name"
                            className="text-base text-nowrap"
                          >
                            No of Adults
                          </label>
                          <input
                            id="fname"
                            type="number"
                            placeholder="Total Adults"
                            className="border border-gray-600 p-1 rounded-sm text-center placeholder:text-[12px] w-full"
                            value={adults}
                            onChange={handleInputChangeAdults}
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="basis-3 justify-start">
                        <div>
                          <label
                            htmlFor="name"
                            className="text-base text-nowrap"
                          >
                            No of Children
                          </label>
                          <input
                            id="fname"
                            type="number"
                            placeholder="Total Children"
                            className="border border-gray-600 p-1 rounded-sm text-center placeholder:text-[12px] w-full"
                            value={children}
                            onChange={handleInputChangeChildren}
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="basis-3 justify-start">
                        <div>
                          <label
                            htmlFor="name"
                            className="text-base text-nowrap"
                          >
                            Nights:
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={defaultNights}
                            onChange={(e) => handleNightsChange(e)}
                            className="border border-gray-600 p-1 rounded-sm  text-center placeholder:text-[12px] w-full"
                          />
                        </div>
                      </div>
                      <div className="basis-24 justify-start">
                        <div>
                          <label className="text-base text-nowrap">
                            Room Type:
                          </label>
                          <select
                            className="w-full px-3 py-1 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={roomType}
                            onChange={handleRoomTypeChange}
                          >
                            <option value="">Select</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Dormitory">Dormitory</option>
                          </select>
                        </div>
                      </div>

                      <div className="basis-24 justify-start">
                        <div>
                          <label className="text-base text-nowrap">
                            Room Plans:
                          </label>
                          {/* <select
                                    className="w-full px-3 py-1 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    // value={roomType}
                                    // onChange={handleRoomTypeChange}
                                  >
                                    <option value="">Select</option>
                                    <option value="Single">RO</option>
                                    <option value="Double">BB</option>
                                    <option value="Suite">HB</option>
                                    <option value="Deluxe">FB</option>
                                    <option value="Dormitory">AI</option>
                                  </select> */}
                          <select
                            className="w-full px-3 py-1 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register(`room_type`)}
                            onChange={(e) => {
                              handleSelectChange(e.target.value); // Call the handler with the selected value
                            }}
                          >
                            defaultValue="room_only"
                            <option value="">Select an option</option>
                            {options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Button to Show Filtered Data */}
                      <div className="flex justify-center items-center mt-5 text-nowrap">
                        <button
                          onClick={handleShowData}
                          className="bg-blue-500 text-white py-1 rounded px-3"
                        >
                          Check Availibity
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Conditionally render RoomBookingTable */}
                <div className="overflow-auto">
                  {showFilteredData && (
                    <SpecificRange
                      startDate={startDate}
                      endDate={endDate}
                      checkboxState={checkboxState}
                      setCheckboxState={setCheckboxState}
                      roomType={roomType}
                    />
                  )}
                </div>
              </div>
            </>
            <>
              {/* SHOW ROOM */}
              {showFilteredData && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  // onSubmit={()=>{setIsModalOpen(true)}}
                  className="rounded-md bg-white ml-2"
                >
                  {/* Person data */}
                  {showPersonData && (
                     <div className="rounded-md relative">
                     <h2 className=" bg-white text-lg font-semibold text-gray-700 mb-3 ml-3">
                       Personal Info
                     </h2>
                      {fields.map((field, index) => (
                        <div
                          className="grid grid-cols-4 sm:grid-cols-9 gap-2 gap-x-3 gap-y-3 ml-3"
                          key={field.id}
                        >
                          <div className="flex flex-col space-y-1 mb-4">
                            <label
                              htmlFor={`member[${index}].fname`}
                              className="text-sm text-nowrap"
                            >
                              First Name<span className="text-red-500">*</span>
                            </label>
                            <input
                              id={`member[${index}].fname`}
                              placeholder="First Name"
                              {...register(`member.${index}.fname`, {
                                required: "Required",
                                onBlur: () => trigger(`member.${index}.fname`),
                                pattern: {
                                  value: /^[A-Za-z\s]+$/,
                                  message:
                                    "Name can only contain letters and spaces",
                                },
                              })}
                              className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
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
                              className="text-sm text-nowrap"
                            >
                              Last Name<span className="text-red-500">*</span>
                            </label>
                            <input
                              id={`member[${index}].lname`}
                              placeholder="Last Name"
                              {...register(`member.${index}.lname`, {
                                required: "Required",
                                onBlur: () => trigger(`member.${index}.lname`),
                                pattern: {
                                  value: /^[A-Za-z\s]+$/,
                                  message:
                                    "Name can only contain letters and spaces",
                                },
                              })}
                              className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
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
                              className="text-sm text-nowrap"
                            >
                              Gender<span className="text-red-500">*</span>
                            </label>
                            <select
                              id="gender"
                              {...register(`member.${index}.gender`, {
                                required: "Required",
                                onBlur: () => trigger(`member.${index}.gender`),
                              })}
                              className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
                            >
                              <option value="">Select</option>
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
                              className="text-sm text-nowrap"
                            >
                              Age<span className="text-red-500">*</span>
                            </label>
                            <input
                              id={`member[${index}].name`}
                              placeholder="Age"
                              {...register(`member.${index}.age`, {
                                required: "Required",
                                onBlur: () => trigger(`member.${index}.age`),
                              })}
                              onChange={(e) => handleAgeChange(e, index)}
                              className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
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
                                className="text-sm text-nowrap"
                              >
                                Photo<span className="text-red-500">*</span>
                              </label>
                              <div className="flex flex-row">
                                {/* <CameraIcon
                            size={50}
                            onClick={handleCameraClick(index)}
                        /> */}
                                <input
                                  type="file"
                                  id={`member[${index}].photo`}
                                  {...register(`member.${index}.photo`, {
                                    // required: "Photo is required",
                                  })}
                                  className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] cus-input-file"
                                />
                              </div>
                              <p className="mt-2  pl-2 text-gray-500  text-sm">
                                {watch(`member.${index}.photo`)?.[0]?.name}
                              </p>
                              {watch(`member.${index}.photo`)?.[0] && (
                                <div className="relative mt-2 h-20 w-30">
                                  <img
                                    src={URL.createObjectURL(
                                      watch(`member.${index}.photo`)[0]
                                    )}
                                    alt="Photo Preview"
                                    className="mt-2 h-20 w-30  "
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-2 right-0  text-white p-0"
                                    onClick={handleRemovePreview(
                                      index,
                                      "photo"
                                    )}
                                  >
                                    <CircleX
                                      className="text-red-400"
                                      size={20}
                                    />
                                  </button>
                                </div>
                              )}
                              {imageSrc[index] && (
                                <div className="relative mt-2 h-20 w-30">
                                  <img
                                    src={URL.createObjectURL(imageSrc[index])}
                                    alt="Captured"
                                    className="mt-2 h-20 w-30"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-2 right-0  text-white p-0"
                                    onClick={handleRemovePreview(
                                      index,
                                      "photo"
                                    )}
                                  >
                                    <CircleX
                                      className="text-red-400"
                                      size={20}
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1 mb-4">
                            <label
                              htmlFor={`member[${index}].idtype`}
                              className="text-sm text-nowrap"
                            >
                              Id Type<span className="text-red-500">*</span>
                            </label>
                            <select
                              id="gender"
                              {...register(`member.${index}.idtype`, {
                                required: "Required",
                                onBlur: () => trigger(`member.${index}.idtype`),
                              })}
                              className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
                            >
                              <option value="">Id Type</option>
                              <option value="Voter Card">Voter Card</option>
                              <option value="Aadhaar">Aadhaar</option>
                              <option value="Driving Licence">
                                Driving Licence
                              </option>
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
                              htmlFor={`member[${index}].image`}
                              className="text-sm text-nowrap"
                            >
                              ID Proof<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="file"
                              id={`member[${index}].image`}
                              {...register(`member.${index}.image`)}
                              onBlur={() => trigger(`member.${index}.image`)}
                              className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                            />
                            <p className="mt-2  pl-2 text-gray-500  text-sm">
                              {watch(`member.${index}.image`)?.[0]?.name}
                            </p>
                            {watch(`member[${index}].image`)?.[0] && (
                              <div className="relative mt-2 h-20 w-30">
                                <img
                                  src={URL.createObjectURL(
                                    watch(`member[${index}].image`)[0]
                                  )}
                                  alt="Photo Preview"
                                  className="mt-2 h-20 w-30"
                                />
                                <button
                                  type="button"
                                  className="absolute top-2 right-0  text-white p-0"
                                  onClick={handleRemovePreview(index, "image")}
                                >
                                  <CircleX className="text-red-400" size={20} />
                                </button>
                              </div>
                            )}
                            {errors?.member?.[index]?.image && (
                              <p className="text-red-500 text-sm">
                                {errors.member[index].image.message}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col space-y-1 mb-4">
                            <label
                              htmlFor={`member[${index}].roomNo`}
                              className="text-sm text-nowrap"
                            >
                              Room No
                            </label>
                            <select
                              {...register(`member[${index}].roomNo`, {
                                required: "Select room",
                                validate: (value) => {
                                  return (
                                    checkRoomAllocation(value, index) ||
                                    "This room is full"
                                  );
                                },
                                onBlur: () => {
                                  trigger(`member[${index}].roomNo`);
                                },
                              })}
                              onChange={(e) => handleRoomChange(e, index)}
                              className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
                             
                            >
                              {checkboxState.length > 1 && (
                                <option value="">Select</option>
                              )}{" "}
                              {/*Conditionally render Select if there's more than one*/}
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
                          <div className="flex flex-col space-y-1 mb-4 mt-5 w-[40px]">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleRemoveMember(index);
                                }}
                                className=" text-white py-0.5 px-1 text-xs rounded-md h-8"
                              >
                                <CircleX className="text-red-500" />
                              </button>
                            )}
                          </div>

                          {/* <div>
                          <Modal
                          open={openModalIndex === index && watch(`member[${index}].webcamCapture`) }
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
                                  onClick={()=>capture(index)}
                                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-1"
                                >
                                      Capture Photo
                                </button>
                                <button
                    onClick={handleRemoveImageClick(index)}
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
                        </div> */}
                        </div>
                      ))}

                      {/* Button to Add New Member */}

                      <div className="flex justify-center ">
                        <button
                          type="button"
                          onClick={() => handleAddMember()}
                          className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
                        >
                          Add Member
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="border  border-gray-300 rounded-md p-6 shadow-md relative mt-4">
              <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                Contact Info
              </h2>

                    <div className="grid grid-cols-3 gap-5 px-2">
                      <div className="flex flex-col mb-1">
                        <label htmlFor="mobile" className="text-sm text-nowrap">
                          Mobile<span className="text-red-500">*</span>
                        </label>
                        <input
                          id="mobile"
                          type="text"
                          placeholder="(+91)09749123654"
                          {...register("mobile", {
                            required: "Required",
                            onBlur: () => trigger("mobile"),
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message:
                                "Mobile number must be exactly 10 digits",
                            },
                          })}
                          className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
                        />
                        {errors.mobile && (
                          <p className="text-red-500 text-sm">
                            {errors.mobile.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-1 mb-4">
                        <label htmlFor="mobile" className="text-sm text-nowrap">
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
                              message:
                                "Mobile number must be exactly 10 digits",
                            },
                          })}
                          className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
                        />
                        {errors.alt_mobile && (
                          <p className="text-red-500 text-sm">
                            {errors.alt_mobile.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-1 mb-4">
                        <label htmlFor="email" className="text-sm text-nowrap">
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
                          className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Info */}
                    <div className="mt-4">
                      <h2 className="left-5 bg-white px-2 text-lg font-semibold text-gray-700 mb-3">
                        Address Info
                      </h2>

                      <div className="grid grid-cols-5 gap-5 px-2">
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="address"
                            className="text-sm text-nowrap"
                          >
                            Address Line1<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="address1"
                            type="text"
                            placeholder="R.N Road Siliguri Darjeeling"
                            {...register("address1", {
                              required: "Required",
                              onBlur: () => trigger("address1"),
                            })}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                          {errors.address1 && (
                            <p className="text-red-500 text-sm">
                              {errors.address1.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="address"
                            className="text-sm text-nowrap"
                          >
                            Address Line2
                          </label>
                          <input
                            id="address"
                            type="text"
                            placeholder="R.N Road Siliguri Darjeeling"
                            {...register("address2", {
                              onBlur: () => trigger("address2"),
                            })}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm">
                              {errors.address2.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="address"
                            className="text-sm text-nowrap"
                          >
                            Pin<span className="text-red-500">*</span>
                          </label>
                          <input
                            id="pin"
                            type="text"
                            placeholder="712400"
                            {...register("pin", {
                              required: "Required",
                              onBlur: () => trigger("pin"),
                            })}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                          {errors.pin && (
                            <p className="text-red-500 text-sm">
                              {errors.pin.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="state"
                            className="text-sm text-nowrap"
                          >
                            Select State<span className="text-red-500">*</span>
                          </label>
                          <select
                            id="state"
                            value={selectedState}
                            onChange={(e) => {
                              handleStateChange(e); // Update your local state
                            }}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
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
                        </div>
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="address"
                            className="text-sm text-nowrap"
                          >
                            Country<span className="text-red-500">*</span>
                          </label>
                          <select
                            id="country"
                            value={selectedCountry}
                            onChange={handleCountryChange}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px] custom-select"
                          >
                            {" "}
                            <option value="">
                              -- Select a country --
                            </option>{" "}
                            {countries.map((country, index) => (
                              <option key={index} value={country}>
                                {" "}
                                {country}{" "}
                              </option>
                            ))}{" "}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Extra */}
                    <div className="p-2 relative mt-4">
                      {/* <h2 className="left-5 bg-white text-lg font-semibold text-gray-700 mb-3">
                  Additional Informations
                </h2> */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ">
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="amount"
                            className="text-sm text-nowrap"
                          >
                            Purpose
                          </label>
                          <input
                            id="amount"
                            placeholder="eg. Travelling"
                            {...register("purpose")}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="advamount"
                            className="text-sm text-nowrap"
                          >
                            Going To
                          </label>
                          <input
                            id="goingto"
                            placeholder="Kolkata"
                            {...register("goingto")}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="advamount"
                            className="text-sm text-nowrap"
                          >
                            Coming From
                          </label>
                          <input
                            id="comingfrom"
                            placeholder="Puri"
                            {...register("comefrom")}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-1 mb-4">
                          <label
                            htmlFor="advamount"
                            className="text-sm text-nowrap"
                          >
                            Comments
                          </label>
                          <input
                            id="comingfrom"
                            placeholder="Write Your Comments"
                            {...register("comments")}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                        </div>

                        <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="pin" className="text-sm text-nowrap">
                            Referred By
                          </label>
                          <input
                            id="pin"
                            type="text"
                            placeholder=""
                            onChange={(e) => {
                              setReferrPerson(e.target.value);
                            }}
                            className="border border-gray-600 p-1 rounded-sm w-full placeholder:text-[12px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2"></div>

                  <div className="flex justify-center mt-5">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
              {/* / SHOW ROOM */}
            </>
            <>
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
                        <span className="text-sm text-gray-700">
                          Booking ID:
                        </span>
                        <span className="text-sm text-gray-900 font-medium">
                          {bookingId || "N/A"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-row justify-between items-center p-2">
                          <span className="text-sm text-gray-700">
                            No of Rooms:
                          </span>
                          <span className="text-sm text-gray-900 font-medium">
                            {no_of_room || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between items-center p-2">
                          <span className="text-sm text-gray-700">
                            Total Nights:
                          </span>
                          <span className="text-sm text-gray-900 font-medium">
                            {defaultNights || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between items-center p-2">
                          <span className="text-sm text-gray-700">
                            No of Adult:
                          </span>
                          <span className="text-sm text-gray-900 font-medium">
                            {adults || 0}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between items-center p-2">
                          <span className="text-sm text-gray-700">
                            No of Children:
                          </span>
                          <span className="text-sm text-gray-900 font-medium">
                            {children || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between items-center p-2">
                        <span className="text-sm text-gray-700">
                          Total Room Tariff:
                        </span>
                        <span className="text-sm text-gray-900 font-medium">
                          ₹{onlyRoom || 0}
                        </span>
                      </div>
                      <div className="flex flex-row justify-between items-center p-2">
                        <span className="text-sm text-gray-700">
                          Total Meal:
                        </span>
                        <span className="text-sm text-gray-900 font-medium">
                          ₹
                          {totalAmount - onlyRoom - roomGst - featureCharge ||
                            0}
                        </span>
                      </div>
                      <div className="flex flex-row justify-between items-center p-2">
                        <span className="text-sm text-gray-700">
                          Extra charges:
                        </span>
                        ₹{featureCharge}
                      </div>
                      <div className="flex flex-row justify-between items-center p-2">
                        <span className="text-sm text-gray-700">Room GST:</span>
                        <span className="text-sm text-gray-900 font-medium">
                          ₹{roomGst.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-row justify-between items-center p-2">
                        <span className="text-sm text-gray-700">Food GST:</span>
                        <span className="text-sm text-gray-900 font-medium">
                          ₹{foodGst.toFixed(2)}
                        </span>
                      </div>
                      <hr className="border-t border-gray-300 my-1" />
                      <div className="flex flex-row justify-between items-center p-2">
                        <span className="text-sm text-gray-700">
                          Total Amount:
                        </span>
                        <span className="text-sm text-gray-900 font-bold">
                          ₹ {finalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-row justify-between items-center p-2">
                        <span className="text-sm text-gray-700">
                          Advance Amount:
                        </span>
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
                          ₹{finalAmount - adv}
                        </span>
                      </div>

                      <div className="flex flex-row justify-between items-center gap-2 p-2">
                        <span className="text-sm text-gray-700">
                          Payment Mode:
                        </span>

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
                        <span className="text-sm text-gray-700">
                          Transaction Id:
                        </span>
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
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <button
                        onClick={handleSubmitModal}
                        className="flex-grow bg-green-500 text-white py-2 rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 ml-2"
                      >
                        Submit Data
                      </button>
                      <button
                        onClick={() => navigate("/")}
                        className="flex-grow bg-red-500 text-white py-2 rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 ml-2"
                      >
                        Skip
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
            </>
          </div>
          <div>
            {/* Sidebar Teriff className="w-4/12-off" */}

            <Card className="w-96 p-3 billling_sidebar_right side_calcset bg-gray-100">
              <div>
                <h6 className=" mb-3 font-bold text-black">Booking Tariff</h6>
              </div>
              <div>
                <table className="divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Ro.No
                      </th>
                      <th className="px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Room Rent
                      </th>
                      <th className="px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Nights
                      </th>
                      <th className="px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Meal
                      </th>
                      <th className="px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  {/* Each room table */}
                  {checkboxState?.length > 0 ? (
                    checkboxState?.map((room, index) => (
                      <React.Fragment key={index}>
                        <tbody className="divide-y divide-gray-700">
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            {getValues(`room[${index}].roomNo`)}
                          </td>
                          <td className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-800 ">
                            ₹{getValues(`room[${index}].roomTariff`)}
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            {defaultNights}
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            {meal}
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            ₹
                            {calculateTotalWithGST(
                              watch(`room[${index}].roomTariff`),
                              defaultNights,
                              meal
                            ).total.toFixed(2)}
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            Actual
                          </td>
                        </tbody>
                        <tbody className="divide-y divide-gray-700">
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800"></td>
                          <td className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-800 ">
                            <input
                              className="border border-black rounded w-14 px-1"
                              type="text"
                              //value={watch(`room[${index}].roomTariff`) || 0} // Use value prop
                              defaultValue={0}
                              {...register(`member[${index}].roomTariff`)}
                              onChange={(e) => {
                                setValue(
                                  `member[${index}].roomTariff`,
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            {defaultNights}
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            <input
                              className="border border-black rounded w-10 px-1"
                              type="text"
                              defaultValue={"0"}
                              {...register(`member[${index}].offerMeal`)}
                              onChange={(e) => {
                                setMeal(e.target.value);
                              }}
                            />
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            ₹
                            {calculateTotalWithGST(
                              Number(watch(`member[${index}].roomTariff`)) || 0,
                              defaultNights,
                              Number(watch(`member[${index}].offerMeal`)) || 0
                            ).total.toFixed(2)}
                          </td>
                          <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                            Offered
                          </td>
                        </tbody>
                      </React.Fragment>
                    ))
                  ) : (
                    <tbody>
                      <tr>
                        <td
                          colSpan="6"
                          className="px-1 py-1 text-center text-sm text-gray-800"
                        >
                          No room details available.
                        </td>
                      </tr>
                    </tbody>
                  )}

                  {/* End Each room table */}
                </table>
              </div>

              <div className="border-b mb-3">
                <div className="flex gap-3 mt-3">
                  <table className="divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                          Add Extra Services
                        </th>
                        <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                          QTY
                        </th>
                        <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                          Actual Price
                        </th>
                        <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                          Offered Price
                        </th>
                        <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <>
                      

                      <tbody className="divide-y divide-gray-700">
                        {rows.map((row, index) => (
                          <tr key={row.id}>
                            <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-800">
                              <select
                                className="border rounded text-sm focus:outline-none focus:ring-blue-500"
                                value={row.feature}
                                onChange={(e) =>
                                  handleInputChangeFeatures(
                                    index,
                                    "feature",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select</option>
                                <option value="Extra Bed">Extra Bed</option>
                                <option value="Room Heater">Room Heater</option>
                                <option value="Additional Food">
                                  Additional Food
                                </option>
                              </select>
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-800">
                              <select
                                className="border rounded text-sm focus:outline-none focus:ring-blue-500"
                                value={row.quantity}
                                onChange={(e) =>
                                  handleInputChangeFeatures(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                              </select>
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-800">
                              ₹{row.price}
                            </td>
                            <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-800">
                              <input
                                className="border border-black rounded w-14 px-1"
                                type="text"
                                value={row.bedcharge}
                                onChange={(e) =>
                                  handleInputChangeFeatures(
                                    index,
                                    "bedcharge",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="flex px-1 py-2 gap-x-1 whitespace-nowrap text-sm text-gray-800">
                              <CirclePlus
                                className="text-light-blue-900 cursor-pointer"
                                size={22}
                                onClick={handleAddRow}
                              />
                              {index > 0 && (
                                <CircleMinus
                                  className="text-red-600 cursor-pointer"
                                  size={22}
                                  onClick={() => handleRemoveRow(row.id)}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  </table>
                </div>
              </div>

              <div className="border-b mb-3">
                <div className="flex flex-col mt-3">
                  <table className="divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider text-nowrap">
                          Room GST Amount
                        </th>
                        <th className="px-1 py-1 text-right text-xs text-gray-900 uppercase tracking-wider font-bold">
                          ₹{roomGst.toFixed(2)}
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <table className="divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider text-nowrap">
                          Food GST Amount
                        </th>
                        <th className="px-1 py-1 text-right text-xs text-gray-900 uppercase tracking-wider font-bold">
                          ₹{foodGst.toFixed(2)}
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 heading text-black ">
                <h6 className="text-1xl">Total Room Price</h6>
                <h6 className="text-1xl">₹{onlyRoom.toFixed(2)}</h6>
              </div>

              <div className="flex justify-end gap-3 heading text-black">
                <h6 className="text-1xl">Total Price</h6>
                <h6 className="text-1xl">₹{totalAmount.toFixed(2)}</h6>
              </div>

              {/* <table className="divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Additional Discount Amount
                    </th>
                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"></th>
                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"></th>
                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      <input
                        className="border border-black rounded w-36 px-1"
                        type="text"
                        value={additionalDiscount}
                        onChange={(e) => setAdditionalDiscount(e.target.value)}
                      />
                    </th>
                  </tr>
                </thead>
                <>
                  <tbody className="divide-y divide-gray-700">
                    <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800"></td>
                    <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800"></td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-800 "></td>
                    <td className="px-1 py-1  whitespace-nowrap text-md text-gray-800">
                      <div className="flex justify-between">
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                          className="bg-blue-500 text-white py-1 rounded px-3"
                        >
                          Check In
                        </button>

                        <div className="flex justify-end gap-3 heading mt-2 text-black">
                          <h5 className="text-1xl">Final Price</h5>
                          <h5 className="text-1xl font-body">{finalAmount}</h5>
                        </div>
                      </div>
                    </td>
                  </tbody>
                </>
              </table> */}
            </Card>

         
          </div>
        </div>
      </main>
    </div>
  );
}

export default GroupBooking1;
