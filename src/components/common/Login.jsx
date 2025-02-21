import React from 'react';
import { useForm } from 'react-hook-form';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../../config';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // console.log(data);
      // localStorage.setItem('user', JSON.stringify(data.user));
   
      const response = await axios.post(`${baseURL}/api/user/login`, data,{
        withCredentials: true
    });
      console.log('Login successful:', response.data);
      Cookies.set('token', response.data.token, { expires: 7 }); 
      // Store user and role in local storage
      
      const decoded = jwtDecode(response.data.token);
      
   
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('user', decoded.name);
      localStorage.setItem('propertyId', decoded.propertyId);
      if(decoded.role==='admin')
      {navigate('/admindashboard');}
      
    else{navigate('/userhome');}
    } catch (error) {
      toast.error("User not Authorized")
      navigate('/login');
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message)
    }
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/abstract-shadowy-textures-subtle-highlights-luminescence-seep-through-dark-background_764067-9315.jpg')" }}
      >
        <ToastContainer />
        {/* Welcome Text */}
        <div className='text-center text-white mb-8 text-4xl font-bold'>
          Welcome
          
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-md rounded-lg flex">
          <div className="w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700">User Id</label>
                <input
                  type="text"
                  {...register('mobile', { required: 'User is required' })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
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
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Login</button>
            </form>
          </div>
          <div className="w-1/2 bg-blue-500 text-white p-8 rounded-r-lg flex items-center justify-center">
            <img src="data:image/jpeg;base64,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" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
