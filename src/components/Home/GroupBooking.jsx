import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext
} from "react";
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
import apiClient from "../../api/apiClient";
import { baseURL } from "../../../config";
import { getLocalTime } from "../../utils/dateTime";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
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
function GroupBooking() {
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
  const [selectedMode, setSelectedMode] = useState("");
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
  const { gstRate } = useContext(GstContext);
  const mintoday = new Date().toISOString().split("T")[0];
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
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  // const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Reset time part of 'today' to midnight for proper comparison

    if (new Date(selectedEndDate) < today) {
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
        const roomDetailsResponse = await apiClient.get(
          `${baseURL}/api/room/getMealPlansByRoomId`
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
          const response = await apiClient.get(
              `${baseURL}/api/room/getRoomMaxAllocations`)
             

          setRoomMaxAllocations(response.data);
      } catch (error) {
          console.error("Error fetching room max allocations:", error);
      }
  };

    const fetchRooms = async () => {
      try {
        const response = await apiClient.get(`${baseURL}/api/room/allRooms`); // Update this URL based on your API route

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
      onlyroomTariff: "",
      onlyroomTariffOffer: "",
      offerMeal: "",
      
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
    } else {
      alert("Please select no of room,adults ,children, start and end date.");
    }
  };

  function generateBookingId() {
    // Get the current timestamp in milliseconds
    // const timestamp = Date.now(); // Returns the number of milliseconds since January 1, 1970
    // return timestamp;
    return uuid();
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
      return { totalAmount: 0, gstAmount: 0, finalTotal: 0 }; // Return an object with initial values
    }

    // Initialize total amount and gst
    let totalAmount = 0;
    let gstAmount = 0;

    // Iterate over each room data
    roomsArray.forEach((room) => {
        // Parse the values to numbers (roomTariff and no_of_nights are strings in the current data)
        const roomTariff = parseFloat(room.roomTariff);
        const noOfNights = parseInt(room.no_of_nights);
         let currentRoomTotal = 0;
        // Calculate the total tariff for this room
       if (!isNaN(roomTariff) && !isNaN(noOfNights)) {
             currentRoomTotal = roomTariff * noOfNights;
         totalAmount+= currentRoomTotal;
            // Apply conditional GST
            const gstRate = roomTariff > 7500 ? 0.18 : 0.12;
            gstAmount += currentRoomTotal * gstRate;
        }

    });

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
  // const handleFileChange = (e, index, fieldName) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       if (fieldName === "photo") {
  //         setPhotoPreviews((prev) => ({ ...prev, [index]: reader.result }));
  //       }
  //       if (fieldName === "image") {
  //         setImagePreviews((prev) => ({ ...prev, [index]: reader.result }));
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const onSubmit = async (data) => {
    const { totalAmount, gstAmount, finalTotal } = calculateTotalTariff();

    const formData = new FormData();

    // Append simple form fields
    formData.append("bookingId", bookingId);

    formData.append(
      "address",
      `${data.address1.toUpperCase()} ${data.address2.toUpperCase()} ${
        data.pin
      } ${selectedState} ${selectedCountry}`
    );

    formData.append("email", data.email);

    formData.append("mobile", data.mobile);
    formData.append("purpose", data.purpose);
    formData.append("comefrom", data.comefrom);
    formData.append("goingto", data.goingto);
    formData.append("status", "checkIn");
    formData.append("comments", data.comments);
    formData.append("gst",roomGst+foodGst);
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
          `member[${index}].checkInDate`,
          assignedRoom.checkInDate
        );
        formData.append(
          `member[${index}].checkOutDate`,
          assignedRoom.checkOutDate
        );
        formData.append(`member[${index}].roomType`, assignedRoom.roomType);
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
        formData.append(`member[${index}].mealPlan`, assignedRoom.mealPlan);
        formData.append(
          `member[${index}]. no_of_nights`,
          assignedRoom.no_of_nights
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

    // Debug: Print formData to the console
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Submit the formData to the server
    try {
      const response = await apiClient.post(
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

          navigate("/bookingconfirmation", { state: { bookingId } });
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

      const response = await apiClient.post(
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
  useEffect(() => {
    const fetchMealPlansForRooms = async () => {
      if (!roomData || !Array.isArray(roomData)) return;
      const mealPlanOptions = {};
      for (const [index, roomName] of checkboxState.entries()) {
        // Find the room data corresponding to the roomName
        const roomItem = roomData.find((room) => room.roomName === roomName);
        
        if (roomItem && roomItem.mealPlans && roomItem.mealPlans.length > 0) {
          // Set the initial meal plan
          setValue(`room[${index}].roomType`, roomItem.roomType);
          if (checkboxState.length === 1) {
            setValue(`member[${index}].roomNo`, checkboxState[0]);
          }
          setValue(`room[${index}].roomNo`, roomName);
          setValue(`room[${index}].mealPlan`, roomItem.mealPlans[0].mealPlan); // Default to the first meal plan
          setValue(`room[${index}].roomTariff`, roomItem.mealPlans[0].tariff); // Default tariff for first meal plan
          setValue(`room[${index}].onlyroomTariff`, roomItem.mealPlans[0].tariff);
          mealPlanOptions[roomName] = roomItem.mealPlans;
          setValue(`room[${index}].no_of_nights`, defaultNights);
        } else {
          // Handle case where the room data is not found, or mealplans are missing
          setValue(`room[${index}].roomNo`, roomName);
          setValue(`room[${index}].roomType`, roomItem.roomType);
          setValue(`room[${index}].mealPlan`, "Room Only");
          setValue(`room[${index}].roomTariff`, 0);
          setValue(`room[${index}].no_of_nights`, defaultNights);
          if (checkboxState.length === 1) {
            setValue(`member[${index}].roomNo`, checkboxState[0]);
          }
          mealPlanOptions[roomName] = [
            { id: 1, mealPlan: "Room Only", tariff: 0 },
          ];
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
        setValue(`room[${index}].onlyroomTariff`, roomItem.roomPrice);
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
const handleTariffChange = (event) => {
  const newValue = event.target.value;
  setValue(`room[${index}].roomTariff`, newValue, { shouldValidate: true });
 // You can also do other logic here like updating a local state
};
 const roomDetails=getValues("room")

  const [totalAmount,settotalAmount]=useState(0);
  const [roomGst,setRoomGst]=useState(0);
  const [foodGst,setFoodGst]=useState(0);
  const [onlyRoom,setOnlyRoom]=useState(0);
  const[bedcharge,setbedcharge]=useState(0);
  const [additionalDiscount,setAdditionalDiscount]=useState(0);
  const [selectedExtraBed, setSelectedExtraBed] = useState("1");
  const [finalAmount, setfinalAmount] = useState(0); // Initialize with a default value

  const handleExtraBedChange = (e) => {
    setSelectedExtraBed(e.target.value);
  };
  // const calculateTotalWithGST = (roomTariff, nights, mealCharge) => {
    
  //   let total = roomTariff * nights;
  //   let meal=mealCharge * nights;
  //   let roomgstRate;
  //   let foodgstRate=0.05;
  //   if (roomTariff > 7500) {
  //       roomgstRate = 0.18;
  //   } else {
  //       roomgstRate = 0.12;
  //   }
  //   const roomgstAmount = total * roomgstRate;
  //   const foodgstAmount = meal * foodgstRate;
   
  //   return {
  //       total: total  + meal ,
  //       roomGst:roomgstAmount,
  //       foodGst:foodgstAmount
  //    }
  //   };
  const calculateTotalWithGST = (roomTariff, nights, mealCharge) => {
console.log("roomTariff....",roomTariff)
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
                Number(watch(`room[${index}].offerTariff`)) || Number(watch(`room[${index}].onlyroomTariff`))||0,
                Number(watch(`room[${index}].no_of_nights`)),
               Number(watch(`room[${index}].offerMeal`)) || 0
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
 
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Guest Registration Form" />

      <main className="max-w-7xl mx-auto py-6 px-1 lg:px-4 bg-white">
        <ToastContainer />
        {showCheckDiv && (
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
                    onChange={handleStartDateChange}
                    min={mintoday}
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
                    min={mintoday}
                    onChange={handleEndDateChange}
                    className="border p-2 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="name" className="text-base">
                    Nights:
                  </label>
                  <input
                    type="text"
                    value={defaultNights}
                    onChange={(e) => handleNightsChange(e)}
                    className="border p-2 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
      <label className="block text-gray-700">Room Type:</label>
      <select
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={roomType}
        onChange={handleRoomTypeChange}
      >
        <option value="">Select Room Type</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Suite">Suite</option>
        <option value="Deluxe">Deluxe</option>
        <option value="Dormitory">Dormitory</option>
      </select>
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
                    roomType={roomType}
                  />
                  <div className="flex justify-center items-center  mt-2">
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded-md"
                      onClick={() => {
                        setShowCheckDiv(false);
                        if (no_of_room == checkboxState.length)
                          setShowForm(true);
                        else {
                          toast.error(`You have to select ${no_of_room} Rooms`);
                          setShowCheckDiv(true);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
       
        {showForm && (
          
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border border-gray-300 p-6 rounded-md shadow-md bg-white min-w-[1024px]"
          >
             <button
        type="button"
        onClick={() => {
          setShowForm(false);
          setShowCheckDiv(true);
        }}
        className="absolute  top-[140px] right-9  bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center transform translate-y-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-4">
            {/* Person data */}
            {showPersonData && (
              <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Personal Info
                </h2>
                {fields.map((field, index) => (
                  <div
                    className="grid grid-cols-4 sm:grid-cols-8 gap-2"
                    key={field.id}
                  >
                    <div className="flex flex-col space-y-1 mb-4">
                      <label
                        htmlFor={`member[${index}].fname`}
                        className="text-base"
                      >
                        <span style={{ whiteSpace: 'nowrap' }}>First Name</span><span className="text-red-500">*</span>
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
                        <span style={{ whiteSpace: 'nowrap' }}>Last Name</span><span className="text-red-500">*</span>
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
                        onChange={(e) => handleAgeChange(e, index)}
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
          onClick={handleCameraClick(index)}
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
                        <p className="mt-2  pl-2 text-gray-500  text-sm">{watch(`member.${index}.photo`)?.[0]?.name}</p>
                        {watch(`member.${index}.photo`)?.[0] && (
            <div className="relative mt-2 h-20 w-30">
           <img
              src={URL.createObjectURL(watch(`member.${index}.photo`)[0])}
              alt="Photo Preview"
              className="mt-2 h-20 w-30  "
           />
           <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    onClick={handleRemovePreview(index, "photo")}
                  >
                      <CrossIcon size={10} />
                   </button>
                   </div>
           )}
            {imageSrc[index] && (
              <div className="relative mt-2 h-20 w-30">
       <img src={URL.createObjectURL(imageSrc[index])} alt="Captured"  className="mt-2 h-20 w-30"/>
       <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    onClick={handleRemovePreview(index, "photo")}
                  >
                      <CrossIcon size={10} />
                   </button>
       </div>
       
           )}
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
                      <p className="mt-2  pl-2 text-gray-500  text-sm">{watch(`member.${index}.image`)?.[0]?.name}</p>
   {watch(`member[${index}].image`)?.[0] && (
    <div className="relative mt-2 h-20 w-30">
            <img
              src={URL.createObjectURL(watch(`member[${index}].image`)[0])}
              alt="Photo Preview"
              className="mt-2 h-20 w-30"
           />
           <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    onClick={handleRemovePreview(index, "image")}
                  >
                      <CrossIcon size={10} />
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
                          validate: (value) => {
                            return checkRoomAllocation(value, index) || "This room is full";
                           },
                          onBlur: () => {
                            trigger(`member[${index}].roomNo`);
                          },
                        })}
                        onChange={e => handleRoomChange(e, index)}
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

                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveMember(index);
                          }}
                          className="bg-red-500 text-white py-0.5 px-1 text-xs rounded-md h-8"
                        >
                          Remove Member
                        </button>
                      )}
                    </div>
                    <div>
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
        </div>
                  </div>
                  
                  
                  
                ))}

                {/* Button to Add New Member */}

                <div className="flex justify-center ">
                  <button
                    type="button"
                    onClick={() => handleAddMember()}
                    className="bg-green-500 text-white py-2 px-4 rounded-md mt-2"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            )}

            {/* Room row of form fields */}

            <div className="border  border-gray-300 rounded-md p-6 shadow-md relative mt-4">
              <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                Room Info
              </h2>
              {checkboxState?.map((room, index) => (
                   <div  key={index}className="border  border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                   <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Room- {room} Room Type-{watch(`room[${index}].roomType`)} Tariff-{watch(`room[${index}].roomTariff`)} Stay-{watch(`room[${index}].no_of_nights`)}night(s)
                   </h2>
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2"
                >
                
                    <div className="flex flex-col  space-y-1 mb-4">
                    <label
                      htmlFor={`room[${index}].checkInDate`}
                      className="text-base"
                    >
                      Ch:InDt
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
                      Ch:OutDt
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
                  <div className="hidden flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`room[${index}].roomNo`}
                      className="text-base"
                    >
                     Nights
                    </label>
                    <input
                      id={`room[${index}].roomNo`}
                      type="text"
                      readOnly
                      defaultValue={defaultNights}
                      {...register(`room[${index}].no_of_nights`, {
                        required: "Room of Night is required",
                      })}
                      className="border p-2 rounded-md w-full"
                     
                    />
                    {errors.room?.[index]?.roomNo && (
                      <p className="text-red-500 text-sm">
                        {errors.room[index].roomNo.message}
                      </p>
                    )}
                  </div>
                  <div className="hidden flex flex-col space-y-1 mb-4">
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
                  

                  <div className="hidden flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`room[${index}].roomTariff`}
                      className="text-base"
                    >
                      <span style={{ whiteSpace: 'nowrap' }}>Room Type</span>
                      
                    </label>
                    <input
                      id={`room[${index}].roomTariff`}
                      type="text"
                      value={watch(`room[${index}].roomType`)}
                      {...register(`room[${index}].roomType`, {
                        required: "Room Type is required",
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.room && errors.room[index]?.roomType && (
                      <p className="text-red-500 text-sm">
                        {errors.room[index].roomType.message}
                      </p>
                    )}
                  </div>
                  <div className=" hidden flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`room[${index}].roomTariff`}
                      className="text-base"
                    >
                      <span style={{ whiteSpace: 'nowrap' }}>Actual Tariff</span>
                   
                    </label>
                    <input
                      id={`room[${index}].roomTariff`}
                      type="number"
                      defaultValue={buildTariff(index)}
                      onChange={handleTariffChange}
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
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor={`room[${index}].mealPlan`}
                      className="text-neutral-900"
                    >
                      Meal Plan:
                    </label>
                    <select
                      id={`room[${index}].mealPlan`}
                      name={`room[${index}].mealPlan`}
                      {...register(`room[${index}].mealPlan`, {
                        required: true,
                      })}
                      onChange={(e) => {
                        SetMeal(index, e.target.value);
                      }}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-neutral-900"
                      required
                    >
                      <option value="">Select Meal Plan</option>
                      {filteredMealPlans[room] &&
                        filteredMealPlans[room].map((meal) => (
                          <option key={meal.id} value={meal.mealPlan}>
                            {meal.mealPlan}
                          </option>
                        ))}
                    </select>
                    {errors.mealPlan && (
                      <p className="text-red-500 text-sm">
                        {errors.mealPlan.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label
                      htmlFor={`room[${index}].no_of_adults`}
                      className="text-base"
                    >
                      <span style={{ whiteSpace: 'nowrap' }}> Adults</span>
                    
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
                      <span style={{ whiteSpace: 'nowrap' }}>Minor</span>
                    
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
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1 mb-2">
                          <label htmlFor="pin" className="text-base">
                           Referred By
                          </label>
                          <input
                            id="pin"
                            type="text"
                            placeholder="Mr. Tapas Pal"
                            onChange={(e)=>{setReferrPerson(e.target.value)}}
                            className="border p-2 rounded-md w-full"
                          />
                         
                        </div>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {/* Address Info */}
              <div className="border w-3/5 border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Address Info
                </h2>

                <div className="grid grid-cols-2 gap-4 px-10 ">
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
                      <p className="text-red-500 text-sm">
                        {errors.pin.message}
                      </p>
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
                      <p className="text-red-500 text-sm">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="address" className="text-base">
                      Country<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      value={selectedCountry}
                      onChange={handleCountryChange}
                    >
                      {" "}
                      <option value="">-- Select a country --</option>{" "}
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
              <div className="border w-2/5 border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Additional Info
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 ">
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
            </div>
            
          <div className="col-span-2 ">
          <div className="border border-gray-300 rounded-md p-1 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                 Billing Info
                </h2>
                 {/* <div>
                                          <h6 className=" mb-3 font-bold text-black">Booking Tariff</h6>
                                        </div> */}
                                        <div>
                                          <table className='divide-y divide-gray-700 mt-2'>
                                            <thead>
                                              <tr>
                                                <th className='px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                                                Ro.No
                                                </th>
                                                <th className='px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                                                Room Rent
                                                </th>
                                                <th className='px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                                                Nights
                                                </th>
                                                <th className='px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                                                Meal
                                                </th>
                                                <th className='px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                                                Total
                                                </th>
                                                <th className='px-1 py-1 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                                                </th>
                                              </tr>
                                            </thead>
                                            {/* Each room table */}
                                            {checkboxState?.length > 0 ? (
                            checkboxState.map((rm, index) => (
                                
                              <React.Fragment key={index}>
                                <tbody className="divide-y divide-gray-700">
                                  <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                                  {getValues(`room[${index}].roomNo`)}
                                  </td>
                                  <td className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-800 ">
                                    ₹{watch(`room[${index}].onlyroomTariff`)}
                                  </td>
                                  <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                                  {watch(`room[${index}].no_of_nights`)}
                                  </td>
                                  <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                                    ₹{watch(`room[${index}].roomTariff`)-watch(`room[${index}].onlyroomTariff`)}
                                  </td>
                                  <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                                    ₹{calculateTotalWithGST(
                                      watch(`room[${index}].onlyroomTariff`),
                                      watch(`room[${index}].no_of_nights`),
                                      watch(`room[${index}].roomTariff`)-watch(`room[${index}].onlyroomTariff`)
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
                  defaultValue={rm.roomTariff || ""}
                  {...register(`room[${index}].offerTariff`)}
                  onChange={(e) => {
                    setValue(`room[${index}].offerTariff`, e.target.value);
                  }}
                />
                
                                  </td>
                                  <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                                    {watch(`room[${index}].no_of_nights`)}
                                  </td>
                                  <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                                    <input
                                      className="border border-black rounded w-10 px-1"
                                      type="text"
                                      defaultValue={ "0"}
                                      {...register(`room[${index}].offerMeal`)}
                                      onChange={(e) => {
                                        setValue(`room[${index}].offerMeal`,e.target.value);
                                     
                                      }}
                                    />
                                  </td>
                                  <td className="px-1 py-1  whitespace-nowrap text-sm text-gray-800">
                                  ₹{calculateTotalWithGST(
                              Number(watch(`room[${index}].offerTariff`)) || 0,
                              watch(`room[${index}].no_of_nights`),
                              Number(watch(`room[${index}].offerMeal`)) || 0
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
                                <td colSpan="6" className="px-1 py-1 text-center text-sm text-gray-800">
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
                                            <table className='divide-y divide-gray-700'>
                                              <thead>
                                                <tr>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
                                                  Extra Bed Charges
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
                                                  No of beds
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
                                                  Actual Price
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
                                                  Offered Price
                                                  </th>
                                                </tr>
                                              </thead>
                                                <>
                                                <tbody className='divide-y divide-gray-700'>
                                                    <td className='px-1 py-1  whitespace-nowrap text-sm text-gray-800'>
                                                    
                                                    </td>
                                                    <td className='px-1 py-1  whitespace-nowrap text-sm text-gray-800'>
                                                    <select class=" border rounded text-sm focus:outline-none focus::ring-blue-500 focus:ring-blue-500"
                                                     value={selectedExtraBed}
                                                     onChange={handleExtraBedChange}>
                                                      <option selected value="1">1</option>
                                                      <option value="2">2</option>
                                                      <option value="3">3</option>
                                                    </select>
                                                    </td>
                                                    <td className='px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-800 '>
                                                    ₹825
                                                    </td>
                                                    <td className='px-1 py-1  whitespace-nowrap text-sm text-gray-800'>
                                                    <input className="border border-black rounded w-14 px-1" type="text" value={bedcharge} onChange={(e)=>{setbedcharge(e.target.value)}}/>
                                                    </td>
                                                    
                                                </tbody>
                                            
                                                </>
                                            </table>
                                          </div>
                                        </div>
                  
                  
                                        <div className="border-b mb-3">
                                          <div className="flex gap-3 mt-3">
                                            <table className='divide-y divide-gray-700'>
                                              <thead>
                                                <tr>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider text-nowrap'>
                                                  Room GST Amount
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs text-gray-900 uppercase tracking-wider font-bold'>
                                                  ₹{roomGst.toFixed(2)}
                                                  </th>
                                                </tr>
                                              </thead>
                                            </table>
                                            <table className='divide-y divide-gray-700'>
                                              <thead>
                                                <tr>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider text-nowrap'>
                                                  Food GST Amount
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs text-gray-900 uppercase tracking-wider font-bold'>
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
                                            <h6 className="text-1xl">₹{totalAmount?.toFixed(2)}</h6>
                                        </div>
                  
                                        
                  
                                        <table className='divide-y divide-gray-700'>
                                              <thead>
                                                <tr>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>                              
                                                    Additional Discount Amount
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
                                                  
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
                                                 
                                                  </th>
                                                  <th className='px-1 py-1 text-left text-xs font-medium text-gray-900 uppercase tracking-wider'>
                                                  <input className="border border-black rounded w-36 px-1" type="text"value={additionalDiscount} onChange={(e)=>(setAdditionalDiscount(e.target.value))} />
                                                  </th>
                                                </tr>
                                              </thead>
                                                <>
                                                <tbody className='divide-y divide-gray-700'>
                                                    <td className='px-1 py-1  whitespace-nowrap text-sm text-gray-800'>
                                                    
                                                    </td>
                                                    <td className='px-1 py-1  whitespace-nowrap text-sm text-gray-800'>
                                                    
                                                    </td>
                                                    <td className='px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-800 '>
                                                    
                                                    </td>
                                                    <td className='px-1 py-1  whitespace-nowrap text-md text-gray-800'>
                                                      <div className="flex justify-end gap-3 heading text-black">
                                                          <h5 className="text-1xl">Final Price</h5>
                                                          <h5 className="text-1xl font-body">{finalAmount}</h5>
                                                      </div>
                                                    </td>
                                                    
                                                </tbody>
                                            
                                                </>
                                            </table>
            </div>
            </div>
          </div>
          </form>
          
        )}
       
        
        
       
        {/* // Modal capture photo */}
       
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
