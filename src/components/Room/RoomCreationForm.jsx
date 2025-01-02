import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.css";
import Header from "../common/Header";
import { baseURL } from "../../../config";

const RoomCreationForm = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  // Dropzone setup
  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleRemoveImage = (index) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
  
      // Directly append form fields to formData
      formData.append("roomName", data.roomName);
      formData.append("roomPrice", data.roomPrice);
      formData.append("roomCapacity", data.roomCapacity);
      formData.append("roomType", data.roomType);
  
      // Directly append the feature values (boolean values)
      const features = {
        wifi: data.features?.wifi || false,
        ac: data.features?.ac || false,
        tv: data.features?.tv || false,
        breakfast: data.features?.breakfast || false,
        parking: data.features?.parking || false,
      };
  
      // Append the features object as a JSON string
      formData.append("features", JSON.stringify(features));
  
      // Append uploaded images
      uploadedImages.forEach((file) => {
        formData.append("images", file);
      });
  
      // Log the final FormData content for debugging
      console.log("Final FormData content:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      // Send the formData to the server
      const response = await axios.post(`${baseURL}/api/room/addRooms`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success(response.data.message || "Room created successfully");
      navigate("/roomshow");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };
  
  
  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Room Information" />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-4 text-center">Add Room Features</h2>
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

          {/* Features */}
          <div className="mb-6">
            <h3 className="block text-gray-700 font-semibold mb-2">Features:</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" {...register("features.wifi")} className="mr-2" />
                Free Wi-Fi
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register("features.ac")} className="mr-2" />
                Air Conditioning
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register("features.tv")} className="mr-2" />
                Television
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register("features.breakfast")} className="mr-2" />
                Complimentary Breakfast
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register("features.parking")} className="mr-2" />
                Free Parking
              </label>
            </div>
          </div>

          {/* Room Status */}
          <div className="mb-6">
            <h3 className="block text-gray-700 font-semibold mb-2">Room Status:</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="true"
                  {...register("status", { required: "Room status is required" })}
                  className="mr-2"
                />
                Available
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="false"
                  {...register("status", { required: "Room status is required" })}
                  className="mr-2"
                />
                Unavailable
              </label>
            </div>
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="container mx-auto mt-10">
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p>Drag & drop some images here, or click to select images</p>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((file, index) => (
                <div key={file.name} className="relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomCreationForm;
