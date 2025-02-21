import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { useForm } from "react-hook-form";
import Header from "../common/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { baseURL } from "../../../config";

const UserUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user} = location.state; // get userId from location.state

  const [loading, setLoading] = useState(true);

  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get(`${baseURL}/api/user/getSingleUser/${user.id}`);
        const userData = response.data.user;
      
        // Populate form fields with existing user data
        setValue("userName", userData[0]?.userName);
        setValue("email", userData[0]?.email);
        setValue("mobile", userData[0]?.mobile);
        setValue("address", userData[0]?.address);
        setValue("role", userData[0]?.role);
        setValue("status", userData[0]?.status);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [user, setValue]);

  // Handle form submission for updating user
  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post(`${baseURL}/api/user/updateUser/${user?.id}`, data);
      toast.success(response.data.message || 'User updated successfully');
      setTimeout(() => {
        navigate('/user'); // Navigate back to user list or another page after update
      }, 1000); // 1-second delay
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.error || "Failed to update user.");
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Update User" />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-4 text-center">Update User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* User Name */}
          <div className="mb-4">
            <label className="block text-gray-700">User Name:</label>
            <input
              type="text"
              {...register("userName", { required: "User Name is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="block text-gray-700">Mobile:</label>
            <input
              type="text"
              {...register("mobile", { 
                required: "Mobile number is required", 
                minLength: { value: 10, message: "Mobile number must be 10 digits long" },
                maxLength: { value: 10, message: "Mobile number must be 10 digits long" },
                pattern: { value: /^[0-9]+$/, message: "Mobile number must contain only digits" }
              })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700">Address:</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700">Role:</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {errors.role && <span className="text-red-500">{errors.role.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status:</label>
            <select
              {...register('status', { required: 'status is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Status</option>
              <option value="true">Active</option>
              <option value="false">InActive</option>
            </select>
            {errors.status && <span className="text-red-500">{errors.status.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdate;
