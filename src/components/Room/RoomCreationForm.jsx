import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.css";
import Header from "../common/Header";
import { baseURL } from "../../../config";
import apiClient from '../../api/apiClient';

const RoomCreationForm = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const navigate = useNavigate();
    const [roomFeatures, setRoomFeatures] = useState([]);
    

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

    const fetchRoomFeatures = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/api/room/roomfeaturesFetch`);
            setRoomFeatures(response.data.roomfeatures);
           

        } catch (error) {
            console.error('Error fetching room features:', error);
        }
    }

    useEffect(() => {
        fetchRoomFeatures();
    }, []);

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Append form fields
            const formattedRoomName = data.roomName.padStart(3, "0");
            formData.append("roomName", formattedRoomName);
            formData.append("roomPrice", data.roomPrice);
            const roomPrices = {
                basic: data.roomPrice || null,
                withBreakfast: data.roomPriceWithBreakfast || null,
                withBreakfastAndLunch: data.roomPriceWithBreakFastLunch || null,
                withAllMeals: data.roomPriceWithAllMeals || null,
                withOnlyLunch: data.roomPriceWithOnlyLunch || null,
                withDinner: data.roomPriceWithDinner || null,
            };
            formData.append("roomPrices", JSON.stringify(roomPrices));
            formData.append("roomCapacity", data.roomCapacity);
            formData.append("roomType", data.roomType);


            // Append selected features
           const selectedFeatures = roomFeatures.reduce((acc, feature) => {
                 acc[feature.featureName] = data[feature.featureName] || false;
                 return acc;
             }, {});
        
             formData.append("features", JSON.stringify(selectedFeatures));

            // Append uploaded images
            uploadedImages.forEach((file) => {
                formData.append("images", file);
            });

            // Submit data
            const response = await apiClient.post(`${baseURL}/api/room/addRooms`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
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
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <ToastContainer />
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

                    {/* Room Prices */}
                    {[
                        { label: "Basic Room Price", name: "roomPrice", required: true },
                        { label: "Price with Breakfast", name: "roomPriceWithBreakfast" },
                        { label: "Price with BreakFast and Lunch", name: "roomPriceWithBreakFastLunch" },
                        { label: "Price with All Meals", name: "roomPriceWithAllMeals" },
                        { label: "Price with Only Lunch", name: "roomPriceWithOnlyLunch" },
                        { label: "Price with Dinner", name: "roomPriceWithDinner" },
                    ].map(({ label, name, required }) => (
                        <div key={name} className="mb-4">
                            <label className="block text-gray-700">{label}:</label>
                            <input
                                type="number"
                                {...register(name, required ? { required: `${label} is required` } : {})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
                        </div>
                    ))}

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

                    {/* Room Type */}
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
                        <h3 className="font-semibold">Features:</h3>
                        {roomFeatures.map((feature) => (
                            <label key={feature.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    {...register(feature.featureName)}
                                />
                                <span className="text-gray-700">{feature.featureName.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>

                    {/* Room Status */}
                    <div className="mb-6">
                        <h3 className="font-semibold">Room Status:</h3>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="true"
                                    {...register("status", { required: "Room status is required" })}
                                />
                                <span>Available</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="false"
                                    {...register("status", { required: "Room status is required" })}
                                />
                                <span>Unavailable</span>
                            </label>
                        </div>
                        {errors.status && <p className="text-red-500">{errors.status.message}</p>}
                    </div>

                    {/* Image Upload */}
                    <div className="mb-6">
                        <h3 className="font-semibold">Upload Images:</h3>
                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed p-4 text-center cursor-pointer"
                        >
                            <input {...getInputProps()} />
                            <p>Drag & drop or click to select images</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {uploadedImages.map((file, index) => (
                                <div key={file.name} className="relative">
                                    <img src={file.preview} alt="Preview" className="h-32 w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
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
            </main>
        </div>
    );
};

export default RoomCreationForm;