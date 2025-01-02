import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { useDropzone } from "react-dropzone";
import Header from "../common/Header";

const RoomUpdateForm = () => {
  const location = useLocation();
  const roomId = location.state?.roomNo;
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  // Dropzone setup with image validation
  const onDrop = (acceptedFiles) => {
    // Image validation logic (size/type check)
    const validImages = acceptedFiles.filter((file) => file.size <= 5000000 && file.type.startsWith('image/'));
    if (validImages.length !== acceptedFiles.length) {
      alert("Some files are invalid (too large or incorrect format).");
    }
    const newImages = validImages.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  // Remove image from uploaded images
  const handleRemoveImage = (index) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
  };
  


  

  // Fetch room data when component loads
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/room/getRoom/${roomId}`);
        const roomData = response.data.room;

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
        setValue("status", roomData.status);

        // Parse and set existing images for the room
        if (roomData.images && roomData.images.length > 0) {
          const parsedImages = JSON.parse(roomData.images); // Parse the image string into an array
          const imagePaths = parsedImages.map((img) => ({
            name: img, 
            preview: `${baseURL}/${img.replace(/\\/g, "/")}`, // Correcting the path
          }));
          setUploadedImages(imagePaths);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId, setValue]);

  // Handle form submission
 const onSubmit = async (data) => {
  try {
    const formData = new FormData();

    // Append form fields
    formData.append("roomName", data.roomName);
    formData.append("roomPrice", data.roomPrice);
    formData.append("roomCapacity", data.roomCapacity);
    formData.append("roomType", data.roomType);

    const features = {
      wifi: data.features?.wifi || false,
      ac: data.features?.ac || false,
      tv: data.features?.tv || false,
      breakfast: data.features?.breakfast || false,
      parking: data.features?.parking || false,
    };

    formData.append("features", JSON.stringify(features));

    // Handle existing images
    const existingImages = uploadedImages
      .filter((image) => !(image instanceof File)) // Only include existing images
      .map((image) => image.name); // Use the name of existing images

    formData.append("existingImages", JSON.stringify(existingImages));

    // Append newly uploaded images
    uploadedImages.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file); // Append new image files
      }
    });

    formData.append("status", data.status !== undefined ? data.status : true);
// Log all key-value pairs in FormData
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
    // Update room data
    const response = await axios.put(`${baseURL}/api/room/updateRoom/${roomId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Room updated successfully!");
    navigate("/roomshow"); // Redirect after success
  } catch (error) {
    console.error("Error updating room:", error);
    alert("Failed to update room. Please try again.");
  }
};


  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Update Room" />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Room Information</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Room Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Name:</label>
            <input
              type="text"
              {...register("roomName", { required: "Room Name is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.roomName && <p className="text-red-500">{errors.roomName.message}</p>}
          </div>

          {/* Room Price */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Price (per night):</label>
            <input
              type="number"
              {...register("roomPrice", { required: "Room Price is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.roomPrice && <p className="text-red-500">{errors.roomPrice.message}</p>}
          </div>

          {/* Room Capacity */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Capacity:</label>
            <input
              type="number"
              {...register("roomCapacity", { required: "Room Capacity is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.roomCapacity && <p className="text-red-500">{errors.roomCapacity.message}</p>}
          </div>

          {/* Room Type Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Type:</label>
            <select
              {...register("roomType", { required: "Room Type is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Room Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Dormitory">Dormitory</option>
            </select>
            {errors.roomType && <p className="text-red-500">{errors.roomType.message}</p>}
          </div>

          {/* Features (Checkboxes) */}
          <div className="mb-6">
            <h3 className="block text-gray-700 font-semibold mb-2">Features:</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("features.wifi")}
                  className="mr-2"
                />
                Free Wi-Fi
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("features.ac")}
                  className="mr-2"
                />
                Air Conditioning
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("features.tv")}
                  className="mr-2"
                />
                Television
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("features.breakfast")}
                  className="mr-2"
                />
                Complimentary Breakfast
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("features.parking")}
                  className="mr-2"
                />
                Free Parking
              </label>
            </div>
          </div>

          {/* Room Status - Boolean Radio Buttons */}
          <div className="mb-6">
            <h3 className="block text-gray-700 font-semibold mb-2">Room Status:</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="true"
                  {...register("status", { required: "Room status is required" })}
                  checked={String(watch("status")) === "true"}
                  onChange={() => setValue("status", true)}
                  className="mr-2"
                />
                Available
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="false"
                  {...register("status", { required: "Room status is required" })}
                  checked={String(watch("status")) === "false"}
                  onChange={() => setValue("status", false)}
                  className="mr-2"
                />
                Unavailable
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Images:</label>
            <div {...getRootProps()} className="cursor-pointer border-2 border-dashed rounded-lg p-4 text-center">
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
            </div>

            <div className="mt-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative inline-block mr-4">
                  <img src={image.preview} alt="preview" className="w-24 h-24 object-cover rounded" />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 text-white bg-red-500 rounded-full p-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Update Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomUpdateForm;
