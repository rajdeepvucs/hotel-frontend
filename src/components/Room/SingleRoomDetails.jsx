import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Header from "../common/Header";
import { useLocation } from "react-router-dom";
import { baseURL } from "../../../config";
import Imagedetail from "./Imagedetail";



const SingleRoomDetails = () => {
  const [open, setOpen] = useState(false); 
  const [getImage, setGetImage] = useState(''); 
   const handleImageClick = (imageUrl) => {
     setTimeout(() => { setOpen(true); setGetImage(imageUrl); }, 200); 
   }
  const location = useLocation();
  const roomId = location.state?.roomNo;
  const [roomImages, setRoomImages] = React.useState([]);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Fetch room data when component loads
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/room/getRoom/${roomId}`);
        const roomData = response.data.room;
        console.log("roomData", roomData);
        
        // Correct the image parsing to handle empty array or invalid data
        let parsedImages = [];

try {
  if (roomData.images && roomData.images !== "[]") {
    // Parse the JSON string safely
    const rawImages = typeof roomData.images === "string" ? JSON.parse(roomData.images) : roomData.images;

    // If rawImages is a string (indicating it's still encoded), parse it again
    const decodedImages = typeof rawImages === "string" ? JSON.parse(rawImages) : rawImages;

    // Map to replace backslashes with forward slashes
    parsedImages = decodedImages.map((image) => image.replace(/\\/g, "/"));
  }
} catch (error) {
  console.error("Error parsing images:", error);
  parsedImages = [];
}



          
        setRoomImages(parsedImages);
        
        // Set the form fields with the fetched room data
        setValue("roomName", roomData.roomName);
        setValue("roomPrice", roomData.roomPrice);
        setValue("roomCapacity", roomData.roomCapacity);
        setValue("roomType", roomData.roomType);
        setValue("features.wifi", roomData.features.wifi);
        setValue("features.ac", roomData.features.ac);
        setValue("features.tv", roomData.features.tv);
        setValue("features.breakfast", roomData.features.breakfast);
        setValue("features.parking", roomData.features.parking);
        setValue("status", roomData.status); // Setting room status
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
  
    fetchRoomData();
  }, [roomId, setValue]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Room Details" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
    <div
     
      style={{
        backgroundImage: "url('https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/flyfish/raw/NH77053358362800/QS1042/QS1042-Q1/1260426258316776.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
    justifyContent: "center",
    alignItems: "center",
      }}
    >
      {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"> */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded shadow-lg w-1/3 h-full">
        <h2 className="text-2xl font-bold mb-4 text-center"> Room Information</h2>
        <form>
          {/* Room Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Number:</label>
            <input
              type="text"
              {...register("roomName")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled // Make input read-only
            />
          </div>

          {/* Room Price */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Price (per night):</label>
            <input
              type="number"
              {...register("roomPrice")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled // Make input read-only
            />
          </div>

          {/* Room Capacity */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Capacity:</label>
            <input
              type="number"
              {...register("roomCapacity")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled // Make input read-only
            />
          </div>

          {/* Room Type Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Type:</label>
            <input
              type="text"
              {...register("roomType")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled // Make input read-only
            />
         
          </div>

        {/* Features (Checkboxes) */}
{/* Features (Checkboxes) */}
<div className="mb-6">
  <h3 className="block text-gray-700 font-semibold mb-2">Features:</h3>
  <div className="space-y-2">
    <label className="flex items-center">
      <input
        type="checkbox"
        {...register("features.wifi")}
        disabled
        className="peer w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded focus:ring-0 disabled:cursor-not-allowed checked:bg-[#006699] checked:border-[#004466]"
      />
      <span className="ml-2 text-gray-700">Free Wi-Fi</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register("features.ac")}
        disabled
        className="peer w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded focus:ring-0 disabled:cursor-not-allowed checked:bg-[#006699] checked:border-[#004466]"
      />
      <span className="ml-2 text-gray-700">Air Conditioning</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register("features.tv")}
        disabled
        className="peer w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded focus:ring-0 disabled:cursor-not-allowed checked:bg-[#006699] checked:border-[#004466]"
      />
      <span className="ml-2 text-gray-700">Television</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register("features.breakfast")}
        disabled
        className="peer w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded focus:ring-0 disabled:cursor-not-allowed checked:bg-[#006699] checked:border-[#004466]"
      />
      <span className="ml-2 text-gray-700">Complimentary Breakfast</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register("features.parking")}
        disabled
        className="peer w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded focus:ring-0 disabled:cursor-not-allowed checked:bg-[#006699] checked:border-[#004466]"
      />
      <span className="ml-2 text-gray-700">Free Parking</span>
    </label>
  </div>
</div>



          {/* Room Status - Radio Buttons */}
          <div className="mb-6">
            <h3 className="block text-gray-700 font-semibold mb-2">Room Status:</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="true"
                  {...register("status")}
                  disabled // Make radio buttons read-only
                  checked={watch("status") === true}
                />
                Available
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="false"
                  {...register("status")}
                  disabled // Make radio buttons read-only
                  checked={watch("status") === false}
                />
                Unavailable
              </label>
            </div>
          </div>
          {/* Image */}
          <div className="mb-6 ">
          <h3 className="text-lg font-semibold mb-2">Room Images:</h3>
          <div className=" grid grid-cols-2 gap-4">
          {Array.isArray(roomImages) && roomImages.length > 0 ? (
            roomImages.map((image, index) => (
              <img
                key={index}
                src={`${baseURL}/${image}`}
                alt={`Room Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-md mb-4"
                onClick={() => handleImageClick(`${baseURL}/${image}`)}
                

              />
            ))
          ) : (
            <p className="text-gray-500">No images available for this room.</p>
          )}
          </div>
         
        </div>
        </form>
        </div>
      </div>
      {/* Modal */}
     {open && <Imagedetail getImage={getImage} handleClose={() => setOpen(false)} />
}
      </main>
    </div>
  );
};

export default SingleRoomDetails;
