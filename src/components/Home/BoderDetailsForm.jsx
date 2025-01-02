import React, { useState, useEffect, useRef } from "react";
import Header from "../common/Header";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import { CameraIcon, CrossIcon } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { CircleX } from "lucide-react";
import Webcam from "react-webcam";
import { getLocalTime } from "../../utils/dateTime";

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
function generateBookingId() {
  // Get the current timestamp in milliseconds
  const timestamp = Date.now(); // Returns the number of milliseconds since January 1, 1970
  return timestamp;
}
function BoderDetailsForm() {
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
  const [meal, setMeal] = useState("Room Only");
  const [selectedState, setSelectedState] = useState("");
  const [country, setCountry] = useState("India");
  const [gstCol, setGstCol] = useState(0);
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setValue("state", e.target.value); // Update react-hook-form state
  };
  const location = useLocation();
  const { room, bookedRoom, selectedDate } = location.state || {};

  // Initialize `days` with a default value
  const [days, setDays] = useState(bookedRoom?.nights||0);

  useEffect(() => {
    if (bookedRoom?.tariff) {
      setDays(Number(bookedRoom?.nights)); // Convert to number if it's a string
      setValue("totalAmount", bookedRoom?.totalAmount);
      setValue("no_of_nights", bookedRoom?.nights);
      // setTotalAmount(bookedRoom.totalAmount);
      setValue("amount", bookedRoom?.tariff);


    } else {
      setValue("amount", room.tariff);

      console.log("bookedRoom or nights is unavailable:", bookedRoom);
    }
  }, []);
  // const [totalAmount, setTotalAmount] = useState(bookedRoom?.totalAmount || 0);
  const [total, setTotal] = useState(0);
  let max = room?.roomCapacity;
  const [bookingId, setbookingId] = useState(
    bookedRoom?.bookingId ? bookedRoom?.bookingId : generateBookingId()
  );
  const [count, setCount] = useState(1);

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const navigate = useNavigate(); // Initialize useNavigate
  const [boarders, setBoarders] = useState([]); // State to store fetched boarders
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
      no_of_nights: bookedRoom?.nights,
      totalAmount: bookedRoom?.totalAmount,
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

  const [guestType, setGuestType] = useState("Indian");

  const handleGuestTypeChange = (e) => {
    setGuestType(e.target.value);
  };
  const { fields, append, remove } = useFieldArray({ control, name: "member" }); // Watch all fields
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const tariff = watch("amount");
  const extrabedcharge = watch("extrabedcharge");
  // Watch the no_of_nights field to keep it in sync with the state
  const noOfNights = watch("no_of_nights", days);
  useEffect(() => {
    setValue("no_of_nights", days);
  }, [days, setValue]);
  const calculateTotal = () => {
    const parsedCount = parseFloat(count) || 0; // Number of guests
    const parsedMax = parseFloat(max) || 0; // Max allowable guests without extra bed
    const parsedDays = parseFloat(days || 0); // Number of days of stay
    const parsedTariff = parseFloat(tariff) || 0; // Tariff per day
    const parsedExtrabedcharge = parseFloat(extrabedcharge) || 0; // Extra bed charge per day

    // Calculate extra beds needed
    const extrabed = parsedCount - parsedMax > 0 ? parsedCount - parsedMax : 0;

    // Calculate the total amount
    const value =
      parsedDays * parsedTariff + parsedDays * extrabed * parsedExtrabedcharge;
    const gst = value * 0.18;
    setGstCol(gst.toFixed(2));
    // Set the total amount with 18% tax
    const totalWithTax = 1.18 * value;
    setValue("totalAmount", totalWithTax);
    //setTotalAmount(totalWithTax)

    return totalWithTax;
  };

  const validateCheckOutDate = (value) => {
    if (checkInDate && new Date(value) < new Date(checkInDate)) {
      return "Check-Out Date must be the same or later than Check-In Date";
    }
    return true;
  };

  const validateTariff = (value) => {
    if (parseFloat(value) > room.tariff) {
      return `Tariff must be less than or equal to ${room.tariff}`;
    }
    return true;
  };

  const calculateDay = () => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDifference = checkOut.getTime() - checkIn.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      console.log("Number of days:", daysDifference); // Additional functionality if needed

      // Set days to at least 1
      const days = daysDifference === 0 ? 1 : daysDifference;

      setDays(days);
    } else {
      setDays(0);
    }
  };

  const Day = async () => {
    try {
      // Trigger the validation for 'checkOutDate'
      const result = await trigger("checkOutDate");

      if (result) {
        // Await calculateDay if it's an async function
        await calculateDay();

        // Now call calculateTotal after calculateDay completes
        calculateTotal();
      } else {
        console.error("Validation for 'checkOutDate' failed.");
      }
    } catch (error) {
      console.error("An error occurred in the Day function:", error);
    }
  };

  useEffect(() => {
    Day();
  }, [days]);
  const handleAddMember = () => {
    if (count < max) {
      append({ name: "", image: null });
      setCount(count + 1);
    }
  };
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSrc1, setImageSrc1] = useState(null);
  // Fetch boarders from the server
  const fetchBoarders = async () => {
    try {
      if (bookedRoom) {
        const response = await axios.get(`${baseURL}/api/booking/boaders`, {
          params: {
            bookingId: bookedRoom?.bookingId, // First parameter
            checkInDate: bookedRoom?.checkInDate, // Second parameter
          },
        });

        setBoarders(response.data); // Set the fetched boarders into state
      }
    } catch (error) {
      console.error("Failed to fetch boarders:", error);
    }
  };

  useEffect(() => {
    // Fetch boarders when the component mounts
    fetchBoarders();
  }, []);

  const onSubmit = async (data) => {
    let no_of_adults = 0;
    let no_of_minor = 0;
    const formData = new FormData();

    formData.append("bookingId", data.bookingId);
    formData.append(
      "address",
      data.address.toUpperCase() +
        "-" +
        data.pin +
        "-" +
        selectedState +
        "-" +
        country.toUpperCase()
    );
    formData.append("email", data.email);
    formData.append("roomno", data.roomNo);

    formData.append("mobile", data.mobile);
    formData.append("checkInDate", data.checkInDate);
    formData.append("checkOutDate", data.checkOutDate);
    formData.append("tariff", data.amount);
    formData.append("balance", calculateTotal() - (bookedRoom?.advamount || 0));
    formData.append("gst", gstCol);
    formData.append("advamount", bookedRoom?.advamount || 0);
    formData.append("mealPlan", meal);
    formData.append("purpose", data.purpose);
    formData.append("comefrom", data.comefrom);
    formData.append("goingto", data.goingto);
    formData.append("status", "checkIn");
    formData.append("extrabed", data.extrabed);
    formData.append("extrabedcharge", data.extrabedcharge);
    formData.append("CheckInTime", getLocalTime());
    formData.append("createdBy", localStorage.getItem("user"));

    formData.append("nights", days);

    data.member.forEach((member, index) => {
      formData.append(
        `member[${index}].name`,
        member.fname.toUpperCase() + " " + member.lname.toUpperCase()
      );
      formData.append(`member[${index}].gender`, member.gender.toUpperCase());
      formData.append(`member[${index}].age`, member.age);
      formData.append(`member[${index}].idtype`, member.idtype.toUpperCase());
      if (member.age > 17) {
        no_of_adults++;
      } else {
        no_of_minor++;
      }
      formData.append("no_of_adults", no_of_adults);
      formData.append("no_of_minor", no_of_minor);
      formData.append("totalAmount", calculateTotal());
      // Check for uploaded photo first
      if (member.photo && member.photo[0]) {
        const uploadedPhotoFile = new File(
          [member.photo[0]],
          `${member.fname}_${member.lname}}_photo_uploaded.jpg`,
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

    // Log formData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/booking/boaderdetails`,
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
      }
      reset();
      fetchBoarders(); // Fetch boarders after successful submission
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const today = new Date().toISOString().split("T")[0];
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
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header
        title={
          !bookedRoom || bookedRoom?.status === "Advance Booking"
            ? "Guest Registration Form"
            : "Occupant Details"
        }
      />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col justify-center items-center">
          <ToastContainer />
          {/* Form */}
          {(!bookedRoom || bookedRoom?.status === "Advance Booking") && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border border-gray-300 p-6 rounded-md shadow-md bg-white"
            >
              <div className="grid grid-cols-7 gap-2">
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="roomNo" className="text-base">
                    Booking Id<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="roomNo"
                    type="text"
                    value={bookingId}
                    {...register("bookingId", {
                      required: "Booking Id is required",
                    })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="roomNo" className="text-base">
                    Room No<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="roomNo"
                    type="text"
                    readOnly
                    value={room.roomNumber}
                    {...register("roomNo")}
                    className="border p-2 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="roomNo" className="text-base">
                    Room Tariff
                  </label>
                  <input
                    id="roomNo"
                    type="text"
                    value={room.tariff}
                    className="border p-2 rounded-md w-full"
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="roomNo" className="text-base">
                    Room Type
                  </label>
                  <input
                    id="roomNo"
                    type="text"
                    value={room.roomType}
                    className="border p-2 rounded-md w-full"
                    readOnly
                  />
                </div>
                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="roomNo" className="text-base">
                    Room Capacity
                  </label>
                  <input
                    id="roomNo"
                    type="text"
                    value={room.roomCapacity}
                    className="border p-2 rounded-md w-full"
                    readOnly
                  />
                </div>

                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="checkInDate" className="text-base">
                    Check-In-Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkInDate"
                    type="date"
                    readOnly
                    defaultValue={bookedRoom?.checkInDate || formattedDate}
                    {...register("checkInDate", {
                      required: "Check-In Date is required",
                    })}
                    className="border p-2 rounded-md w-full"
                  />
                  {errors.checkInDate && (
                    <p className="text-red-500 text-sm">
                      {errors.checkInDate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-1 mb-4">
                  <label htmlFor="checkOutDate" className="text-base">
                    Check-Out-Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkOutDate"
                    type="date"
                    defaultValue={bookedRoom?.checkOutDate}
                    {...register("checkOutDate", {
                      required: "Check-Out Date is required",
                      onBlur: Day,
                      validate: validateCheckOutDate,
                    })}
                    className="border p-2 rounded-md w-full"
                  />
                  {errors.checkOutDate && (
                    <p className="text-red-500 text-sm">
                      {errors.checkOutDate.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Personal Info */}
              <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-1">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Personal Info
                </h2>
                {fields.map((field, index) => (
                  <div
                    className="grid grid-cols-4 sm:grid-cols-8 gap-4"
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
                          onBlur: () => {
                            trigger(`member.${index}.fname`);
                          },
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
                    <div className="flex flex-col space-y-1 mb-4 mt-8">
                      {/* Remove Member Button */}
                      {index === 0 ? null : (
                        <button
                          type="button"
                          onClick={() => {
                            setCount(count - 1);
                            remove(index);
                          }}
                          className="bg-red-500 text-white py-0.5 px-1 text-xs rounded-md h-8"
                        >
                          Remove Member
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Button to Add New Member */}
                {count < max && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleAddMember()}
                      className="bg-green-500 text-white py-2 px-4 rounded-md mt-2"
                    >
                      Add Member
                    </button>
                  </div>
                )}

                {count >= max && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        ++max;
                        handleAddMember();
                      }}
                      className="bg-red-500 text-white py-2 px-4 rounded-md mt-2"
                    >
                      Need Extra Bed?
                    </button>
                  </div>
                )}
              </div>
              {/* Guest type */}
              <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Guest Type
                </h2>
                <div className="grid grid-cols-1 gap-4 px-10">
                  <div className="flex flex-col space-y-1 mb-4">
                    <label className="text-base mb-1">
                      Are you an Indian or a Foreigner?
                    </label>
                    <div className="flex items-center space-x-4">
                      <label>
                        <input
                          type="radio"
                          name="guestType"
                          value="Indian"
                          checked={guestType === "Indian"}
                          onChange={handleGuestTypeChange}
                          className="mr-2"
                        />
                        Indian
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="guestType"
                          value="Foreigner"
                          checked={guestType === "Foreigner"}
                          onChange={handleGuestTypeChange}
                          className="mr-2"
                        />
                        Foreigner
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Info  */}
              {guestType === "Indian" && (
                <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                  <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                    Address Info
                  </h2>

                  <div className="grid grid-cols-4 gap-4 px-10 ">
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
                      <label htmlFor="email" className="text-base">
                        Email<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        {...register("email", {
                          required: "Email is required",
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
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="address" className="text-base">
                        Address<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        placeholder="R.N Road Siliguri Darjeeling"
                        {...register("address", {
                          required: "Address is required",
                          onBlur: () => trigger("address"),
                        })}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
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
                      <input
                        id="address"
                        type="text"
                        placeholder="India"
                        defaultValue={"India"}
                        onChange={(e) => {
                          setCountry(e.target.value);
                        }}
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Foreign Guest Info */}
              {guestType === "Foreigner" && (
                <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                  <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                    Foreign Guest Info
                  </h2>

                  <div className="grid grid-cols-4 gap-4 px-10 ">
                    {/* Passport Number */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="passportNumber" className="text-base">
                        Passport Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="passportNumber"
                        type="text"
                        placeholder="A12345678"
                        {...register("passportNumber", {
                          required: "Passport number is required",
                        })}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.passportNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.passportNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Passport Country */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="passportCountry" className="text-base">
                        Passport Country<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="passportCountry"
                        type="text"
                        placeholder="Country"
                        {...register("passportCountry", {
                          required: "Passport country is required",
                        })}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.passportCountry && (
                        <p className="text-red-500 text-sm">
                          {errors.passportCountry.message}
                        </p>
                      )}
                    </div>

                    {/* Visa Number */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="visaNumber" className="text-base">
                        Visa Number
                      </label>
                      <input
                        id="visaNumber"
                        type="text"
                        placeholder="Visa Number"
                        {...register("visaNumber")}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.visaNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.visaNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Visa Type */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="visaType" className="text-base">
                        Visa Type
                      </label>
                      <input
                        id="visaType"
                        type="text"
                        placeholder="Tourist"
                        {...register("visaType")}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.visaType && (
                        <p className="text-red-500 text-sm">
                          {errors.visaType.message}
                        </p>
                      )}
                    </div>

                    {/* Visa Expiry Date */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="visaExpiryDate" className="text-base">
                        Visa Expiry Date
                      </label>
                      <input
                        id="visaExpiryDate"
                        type="date"
                        {...register("visaExpiryDate")}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.visaExpiryDate && (
                        <p className="text-red-500 text-sm">
                          {errors.visaExpiryDate.message}
                        </p>
                      )}
                    </div>

                    {/* Arrival Date */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="arrivalDate" className="text-base">
                        Arrival Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="arrivalDate"
                        type="date"
                        {...register("arrivalDate", {
                          required: "Arrival date is required",
                        })}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.arrivalDate && (
                        <p className="text-red-500 text-sm">
                          {errors.arrivalDate.message}
                        </p>
                      )}
                    </div>

                    {/* Departure Date */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="departureDate" className="text-base">
                        Departure Date
                      </label>
                      <input
                        id="departureDate"
                        type="date"
                        {...register("departureDate")}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.departureDate && (
                        <p className="text-red-500 text-sm">
                          {errors.departureDate.message}
                        </p>
                      )}
                    </div>

                    {/* Place of Issue */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="placeOfIssue" className="text-base">
                        Place of Issue
                      </label>
                      <input
                        id="placeOfIssue"
                        type="text"
                        placeholder="Place of Issue"
                        {...register("placeOfIssue")}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.placeOfIssue && (
                        <p className="text-red-500 text-sm">
                          {errors.placeOfIssue.message}
                        </p>
                      )}
                    </div>

                    {/* Nationality */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="nationality" className="text-base">
                        Nationality<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="nationality"
                        type="text"
                        placeholder="Nationality"
                        {...register("nationality", {
                          required: "Nationality is required",
                        })}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.nationality && (
                        <p className="text-red-500 text-sm">
                          {errors.nationality.message}
                        </p>
                      )}
                    </div>

                    {/* Home Address */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="homeAddress" className="text-base">
                        Home Address
                      </label>
                      <input
                        id="homeAddress"
                        type="text"
                        placeholder="Home Address"
                        {...register("homeAddress")}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.homeAddress && (
                        <p className="text-red-500 text-sm">
                          {errors.homeAddress.message}
                        </p>
                      )}
                    </div>

                    {/* Foreign Address */}
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="foreignAddress" className="text-base">
                        Foreign Address
                      </label>
                      <input
                        id="foreignAddress"
                        type="text"
                        placeholder="Foreign Address"
                        {...register("foreignAddress")}
                        className="border p-2 rounded-md w-full"
                      />
                      {errors.foreignAddress && (
                        <p className="text-red-500 text-sm">
                          {errors.foreignAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tariff Info */}
              <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Tariff Info
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 px-10">
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="amount" className="text-base">
                      Tariff<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="amount"
                      placeholder="Rs/-800"
                      defaultValue={getValues("amount")}
                      {...register("amount", {
                        required: "Tariff is required",
                        onBlur: () => {
                          calculateDay();
                          calculateTotal();
                        },
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Tariff must be a number",
                        },
                        validate: validateTariff,
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                  {bookedRoom?.advamount && (
                    <div className="flex flex-col space-y-1 mb-4">
                      <label htmlFor="advamount" className="text-base">
                        Adv Amt(Booking Time)
                      </label>
                      <input
                        id="advamount"
                        value={bookedRoom?.advamount}
                        placeholder="Rs/-800"
                        readOnly
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                  )}
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="amount" className="text-base">
                      No of Extra Bed
                    </label>
                    <input
                      id="extrabed"
                      placeholder="0"
                      value={count - max > 0 ? count - max : 0}
                      readOnly
                      {...register("extrabed", {})}
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="advamount" className="text-base">
                      Extra Bed Charge
                    </label>
                    <input
                      id="advamount"
                      placeholder="0"
                      {...register("extrabedcharge", {
                        onBlur: () => {
                          calculateTotal();
                        },
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Bed charge must be a number",
                        },
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.extrabedcharge && (
                      <p className="text-red-500 text-sm">
                        {errors.extrabedcharge.message}
                      </p>
                    )}
                  </div>

                  {/* <div className="flex flex-col space-y-1 mb-4 ">
                    <label htmlFor="advamount" className="text-base">
                      Adv Amt(Registration Time)
                    </label>
                    <input
                      id="advamount"
                      placeholder="Rs/-800"
                      {...register("advamount", {
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Advance Amount must be a number",
                        },
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.advamount && (
                      <p className="text-red-500 text-sm">
                        {errors.advamount.message}
                      </p>
                    )}
                  </div> */}
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="advamount" className="text-base">
                      Total Nights
                    </label>
                    <input
                      id="no_of_nights"
                     
                      value={days}
                      placeholder="2 nights"
                      {...register("no_of_nights", {})}
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="advamount" className="text-base">
                      GST
                    </label>
                    <input
                      id="no_of_nights"
                      value={"18%"}
                      placeholder="GST"
                      readonly
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 mb-4 hidden">
                    <label htmlFor="advamount" className="text-base">
                      Discount Amount
                    </label>
                    <input
                      id="disamt"
                      placeholder="Discount Amount Rs/-100"
                      {...register("disamount", {
                        onBlur: () => {
                          calculateDay();
                        },
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Discount Amount must be a number",
                        },
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.disamount && (
                      <p className="text-red-500 text-sm">
                        {errors.disamount.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="mealPlan" className="text-neutral-900">
                      Meal Plan:
                    </label>
                    <select
                      id="mealPlan"
                      name="mealPlan"
                      onChange={(e) => {
                        SetMeal(e.target.value);
                      }}
                      // {...register("mealPlan", { required: true })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-20 text-neutral-900"
                      required
                    >
                      <option value="Room Only">Room Only</option>{" "}
                      <option value="Breakfast Included">
                        Breakfast Included
                      </option>{" "}
                      <option value="Breakfast and Lunch Included">
                        Breakfast and Lunch Included
                      </option>{" "}
                      <option value="Full Board">Full Board</option>{" "}
                      <option value="All Inclusive">All Inclusive</option>{" "}
                    </select>
                    {errors.mealPlan && (
                      <p className="text-red-500 text-sm">
                        {errors.mealPlan.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="advamount" className="text-base">
                      Total Amount
                    </label>
                    <input
                      id="total"
                      value={getValues("totalAmount")}
                      readOnly
                      {...register("totalAmount", {})}
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                </div>
              </div>
              {/* Extra info */}
              <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                  Extra Info
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ">
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="amount" className="text-base">
                      Purpose<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="amount"
                      placeholder="eg. Travelling"
                      {...register("purpose", {
                        required: "Purpose is required",
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.purpose && (
                      <p className="text-red-500 text-sm">
                        {errors.purpose.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="advamount" className="text-base">
                      Going To<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="goingto"
                      placeholder="Kolkata"
                      {...register("goingto", {
                        required: "Going to is required",
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.goingto && (
                      <p className="text-red-500 text-sm">
                        {errors.goingto.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 mb-4">
                    <label htmlFor="advamount" className="text-base">
                      Coming From<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="comingfrom"
                      placeholder="Puri"
                      {...register("comefrom", {
                        required: "Coming From to is required",
                      })}
                      className="border p-2 rounded-md w-full"
                    />
                    {errors.comefrom && (
                      <p className="text-red-500 text-sm">
                        {errors.comefrom.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
                >
                  Submit
                </button>
              </div>
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
            </form>
          )}

          {/* Display Boarders */}
          <div className="mt-8">
            {boarders.length > 0 && bookedRoom?.status !== "Advance Booking" ? (
              <>
                <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                  <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                    Booking Details
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="bookingId" className="text-base">
                        Booking Id
                      </label>
                      <input
                        id="bookingId"
                        type="text"
                        value={boarders[0]?.bookingId || ""}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Room No
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.roomno || ""}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="checkInDate" className="text-base">
                        Check-In-Date
                      </label>
                      <input
                        id="checkInDate"
                        type="text"
                        value={`${boarders[0]?.checkInDate || ""} ${
                          boarders[0]?.CheckInTime || ""
                        }`}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="checkOutDate" className="text-base">
                        Check-Out-Date
                      </label>
                      <input
                        id="checkOutDate"
                        type="text"
                        value={`${boarders[0]?.checkOutDate || ""} ${
                          boarders[0]?.checkOutTime || ""
                        }`}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="totalNights" className="text-base">
                        Total Nights
                      </label>
                      <input
                        id="totalNights"
                        type="text"
                        value={boarders[0]?.nights || "1"}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        No of Adults
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.no_of_adults || 0}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Childern
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.no_of_minor || 0}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        {" "}
                        No Of Extra Bed
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.extrabed || 0}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <table className="table-auto mt-4 w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2">Photo</th>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Gender</th>
                      <th className="border px-4 py-2">Age</th>
                      <th className="border px-4 py-2">ID Proof</th>
                      <th className="border px-4 py-2">ID Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boarders.map((boarder) => (
                      <tr key={boarder.id} className="border-t">
                        <td className="border px-4 py-2">
                          {boarder?.photo ? (
                            <img
                              src={`${baseURL}/${boarder.photo}`}
                              alt={boarder.name}
                              className="w-32 h-32 object-cover"
                            />
                          ) : (
                            "No ID Proof Provided"
                          )}
                        </td>
                        <td className="border px-4 py-2">{boarder.name}</td>
                        <td className="border px-4 py-2">{boarder.gender}</td>
                        <td className="border px-4 py-2">{boarder.age}</td>
                        <td className="border px-4 py-2">
                          {boarder?.image ? (
                            <img
                              src={`${baseURL}/${boarder.image}`}
                              alt={boarder.name}
                              className="w-32 h-32 object-cover"
                            />
                          ) : (
                            "No ID Proof Provided"
                          )}
                        </td>
                        <td className="border px-4 py-2">{boarder.idtype}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                  <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                    Tariff Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="bookingId" className="text-base">
                        Total Tariff
                      </label>
                      <input
                        id="bookingId"
                        type="text"
                        value={boarders[0]?.totalAmount || ""}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Advance Paid
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.advamount || 0}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="checkInDate" className="text-base">
                        Due Amount
                      </label>
                      <input
                        id="checkInDate"
                        type="text"
                        value={boarders[0]?.balance || 0}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Discount Amount
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.disamount || 0}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Extra Bed Charge
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.extrabedcharge || 0}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Meal Plan
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.mealPlan}
                        className="border p-2 rounded-md w-full"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                  <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                    Contact Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="bookingId" className="text-base ">
                        Address
                      </label>
                      <input
                        id="bookingId"
                        type="text"
                        value={boarders[0]?.address || ""}
                        className="border p-2 rounded-md w-full uppercase"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Mobile
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.mobile || 0}
                        className="border p-2 rounded-md w-full uppercase"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="checkInDate" className="text-base">
                        Email
                      </label>
                      <input
                        id="checkInDate"
                        type="text"
                        value={boarders[0]?.email || ""}
                        className="border p-2 rounded-md w-full "
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-md p-6 shadow-md relative mt-4">
                  <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                    Extra Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="bookingId"
                        className="text-base uppercase"
                      >
                        purpose
                      </label>
                      <input
                        id="bookingId"
                        type="text"
                        value={boarders[0]?.purpose || ""}
                        className="border p-2 rounded-md w-full uppercase"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="roomNo" className="text-base">
                        Coming From
                      </label>
                      <input
                        id="roomNo"
                        type="text"
                        value={boarders[0]?.comefrom || 0}
                        className="border p-2 rounded-md w-full uppercase"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="checkInDate" className="text-base">
                        Going to
                      </label>
                      <input
                        id="checkInDate"
                        type="text"
                        value={boarders[0]?.goingto || ""}
                        className="border p-2 rounded-md w-full uppercase"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div class="flex  flex-row items-center justify-center w-full ">
                  <div class="bg-gray-200 p-4 rounded">
                    <button
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto block"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      Back
                    </button>
                  </div>
                  <div class="bg-gray-200 p-4 rounded">
                    <button
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto block"
                      onClick={() => {
                        navigate("/checkout", { state: { book: boarders[0] } });
                      }}
                    >
                      CheckOut
                    </button>
                  </div>
                  <div class="bg-gray-200 p-4 rounded">
                    <button
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto block"
                      onClick={() => {
                        navigate("/payment", {
                          state: { book: boarders[0]?.bookingId },
                        });
                      }}
                    >
                      Pay
                    </button>
                  </div>
                  <div class="bg-gray-200 p-4 rounded">
                    <button
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto block"
                      onClick={() => {
                        navigate("/extenddate", { state: { boarders, room } });
                      }}
                    >
                      Extend Date
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BoderDetailsForm;
