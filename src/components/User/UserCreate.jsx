import React from "react";
import apiClient from "../../api/apiClient";
import { useForm } from "react-hook-form";
import Header from "../common/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { baseURL } from "../../../config";

const UserCreate = () => {
  const navigate = useNavigate();
  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
  
      const response = await apiClient.post(`${baseURL}/api/user/addUser`, data);
      toast.success(response.data.message || 'User created successfully', {
        onClose: () => { navigate("/user") } // navigate on toast close
   });
      reset()
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error.response.data.error); 
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="User Creation" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
    <div
     
      style={{
        backgroundImage: "url('https://www.shutterstock.com/image-vector/modern-background-template-light-blue-600nw-2475293189.jpg')",
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
      {/* <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg"> */}
        <ToastContainer />
        
        <h2 className="text-2xl font-bold mb-4 text-center">Create a User</h2>
        <form onSubmit={handleSubmit(onSubmit)} >
          {/* User Name */}
          <div className="mb-4 ">
            <label className="block text-white">User Name:</label>
            <input
              type="text"
              {...register("userName", { required: "User Name is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-white">Email:</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="block text-white">Mobile:</label>
            <input
              type="text"
              {...register("mobile", { 
                required: "Mobile number is required", 
                minLength: {
                  value: 10,
                  message: "Mobile number must be 10 digits long"
                },
                maxLength: {
                  value: 10,
                  message: "Mobile number must be 10 digits long"
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Mobile number must contain only digits"
                }
              })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-white">Address:</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-white">Password:</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-white">Confirm Password:</label>
            <input
              type="password"
              {...register("confirmPassword", { 
                required: "Confirm Password is required", 
                validate: value => value === watch('password') || "Passwords do not match"
              })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <div className="mb-4">
                <label className="block text-white">Role</label>
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
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create User
          </button>
        </form>
      {/* </div> */}
      </div>
      </div>
      </main>
    </div>
  );
};

export default UserCreate;
