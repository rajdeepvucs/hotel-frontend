import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "../common/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { baseURL } from "../../../config";
import axios from 'axios';

const New = () => {
    const navigate = useNavigate();
    const [roomCount, setRoomCount] = useState(0);
    const [roomFeatures, setRoomFeatures] = useState([]);
     const property_name = localStorage.getItem("property_name");

    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
        defaultValues: {
            rooms: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rooms"
    });

    // Fetch room count
    const fetchRooms = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/api/property/getrooms`);
            const count = response.data.roomCount[0]?.rooms || 0;
            setRoomCount(count);
        }
        catch (error) {
            console.error("Error fetching room count:", error);
            toast.error('Failed to load room count');
        }
    };

    // Fetch room data to populate the form
    const fetchRoomData = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/api/room/getRooms`);
            const roomData = response.data;

            // Function to convert feature array to an object with boolean values
            const convertFeaturesArrayToObject = (featuresArray) => {
                const availableFeatures = roomFeatures.map(feature => feature.featureName);
                return availableFeatures.reduce((acc, feature) => {
                    acc[feature] = featuresArray.includes(feature);
                    return acc;
                }, {});
            };

            // Create an array with the appropriate number of room entries
            const populatedRooms = Array.from({ length: roomCount }, (_, i) => {
                // Default features object with all available features set to false
                const defaultFeatures = roomFeatures.reduce((acc, feature) => {
                    acc[feature.featureName] = false;
                    return acc;
                }, {});

                if (i < roomData.length) {
                    // If room data exists, map the features array to an object, merge with default features
                    return {
                        ...roomData[i],
                        features: { ...defaultFeatures, ...convertFeaturesArrayToObject(roomData[i].features) },
                    };
                }
                // Default empty room if no room data exists, using default features
                return {
                    _id: "",
                    roomNumber: "",
                    tariff: "",
                    roomCapacity: "",
                    roomType: "",
                    status: true,
                    features: defaultFeatures,
                };
            });
            // Set the rooms field with the populated data
            setValue("rooms", populatedRooms);
        }
        catch (error) {
            console.error("Error fetching room data:", error);
            toast.error('Failed to load room data');
        }
    };
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

    useEffect(() => {
        fetchRooms(); // Fetch room count to initialize the form
    }, []);


    useEffect(() => {
        if (roomCount > 0 && roomFeatures.length > 0) {
            fetchRoomData(); // Fetch actual room data if room count is set
        }
    }, [roomCount, roomFeatures]);


    const onSubmit = async (data) => {
        try {
        
            const response = await apiClient.post(`${baseURL}/api/room/addMultipleRooms`, { rooms: data.rooms });
            toast.success(response.data.message || 'Rooms created successfully');
            navigate('/roomshow');
        } catch (error) {
            console.error("Error creating rooms:", error);
            toast.error(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Room Creation" />
            <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
                <ToastContainer />
                <h2 className="text-2xl font-bold mb-4 text-center">Create Multiple Rooms</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field, index) => (
                        <div key={field.id} className="mb-4 border-b pb-4">
                            <div className="flex space-x-4 mb-4">
                                <div className="w-1/12">
                                    <label className="block text-gray-700">Serial:</label>
                                    {index + 1}
                                </div>

                                <div className="w-1/4">
                                    <label className="block text-gray-700 ">Room Number:</label>
                                    <input
                                        type="number"
                                        {...register(`rooms.${index}.roomNumber`, {})}
                                        defaultValue={field.roomNumber} // Populate value
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.rooms?.[index]?.roomNumber && <p className="text-red-500">{errors.rooms[index].roomNumber.message}</p>}
                                </div>

                                <div className="w-1/6">
                                    <label className="block text-gray-700">Room Tariff:</label>
                                    <input
                                        type="number"
                                        {...register(`rooms.${index}.tariff`, {})}
                                        defaultValue={field.tariff} // Populate value
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.rooms?.[index]?.tariff && <p className="text-red-500">{errors.rooms[index].tariff.message}</p>}
                                </div>

                                <div className="w-1/6">
                                    <label className="block text-gray-700">Capacity:</label>
                                    <input
                                        type="number"
                                        {...register(`rooms.${index}.roomCapacity`, {})}
                                        defaultValue={field.roomCapacity} // Populate value
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.rooms?.[index]?.roomCapacity && <p className="text-red-500">{errors.rooms[index].roomCapacity.message}</p>}
                                </div>

                                <div className="w-1/6">
                                    <label className="block text-gray-700">Type:</label>
                                    <select
                                        {...register(`rooms.${index}.roomType`, {})}
                                        defaultValue={field.roomType} // Populate value
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Dormitory">Dormitory</option>
                                    </select>
                                    {errors.rooms?.[index]?.roomType && <p className="text-red-500">{errors.rooms[index].roomType.message}</p>}
                                </div>

                                <div className="w-2/3">
                                    <label className="block text-gray-700">Features:</label>
                                    <div className="space-x-2">
                                    {roomFeatures.map(feature => (
                                        <label key={feature.id}>
                                            <input
                                                type="checkbox"
                                                {...register(`rooms.${index}.features.${feature.featureName}`)}
                                                defaultChecked={field.features[feature.featureName]}
                                            /> {feature.featureName}
                                        </label>
                                    ))}
                                    </div>
                                </div>

                                <div className="w-1/3">
                                    <label className="block text-gray-700">Status:</label>
                                    <select
                                        {...register(`rooms.${index}.status`, {})}
                                        defaultValue={field.status} // Populate value
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={true}>Available</option>
                                        <option value={false}>Unavailable</option>
                                    </select>
                                    {errors.rooms?.[index]?.status && <p className="text-red-500">{errors.rooms[index].status.message}</p>}
                                </div>
                            </div>

                            {/* Remove Room Button */}
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    className="text-red-500 mt-6 hidden"
                                    onClick={() => remove(index)}
                                >
                                    Remove Room
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add Room Button */}
                    <div className="flex justify-center mb-4">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hidden"
                            onClick={() => append({ roomNumber: "", tariff: "", roomCapacity: "", roomType: "", status: true, features: roomFeatures.reduce((acc, feature) => {
                                acc[feature.featureName] = false;
                            return acc;
                        }, {}) })}
                        >
                            Add Room
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default New;