import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import Header from "../common/Header";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../config";

const UpdateForm = () => {
    const location = useLocation();
    const {booking} = location.state;
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      member: [
        {
          name: "", gender: "", age: "", photo: null, image: null, idtype: "", address: "",
          email: "", mobile: "", checkInDate: "", checkOutDate: "", roomno: "", tariff: "",
          advamount: "", purpose: "", comefrom: "", goingto: "", status: "",idtype:""
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "member",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/booking/getParticularBooking/${booking.bookingId}`);
        const data = response.data;
        const formattedData = data.map(member => ({
          ...member,
          photo: member.photo || null,
          image: member.image || null,
        }));
        reset({ member: formattedData });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [reset]);

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission, e.g., send updated data to the API
  };

  const formValues = watch();

  return (
    <div className="flex-1 overflow-auto relative z-10">
    <Header title="Update Form" />

    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <div className="flex flex-col justify-center items-center">
        <ToastContainer />
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="mb-4 border p-4 rounded shadow flex">
        <div className="mb-2 ">
            <label className="block text-gray-700">BookingId:</label>
            <input
              type="text"
              {...register(`member.0.bookingId`, { required: "Address is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.bookingId && <p className="text-red-500">{errors.member[0].bookingId.message}</p>}
          </div>
   
          <div className="mb-2 ">
            <label className="block text-gray-700 ">Check-In Date:</label>
            <input
              type="date"
              {...register(`member.0.checkInDate`, { required: "Check-In Date is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.checkInDate && <p className="text-red-500">{errors.member[0].checkInDate.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Check-Out Date:</label>
            <input
              type="date"
              {...register(`member.0.checkOutDate`, { required: "Check-Out Date is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.checkOutDate && <p className="text-red-500">{errors.member[0].checkOutDate.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Room Number:</label>
            <input
              type="text"
              {...register(`member.0.roomno`, { required: "Room Number is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.roomno && <p className="text-red-500">{errors.member[0].roomno.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Tariff:</label>
            <input
              type="number"
              {...register(`member.0.tariff`, { required: "Tariff is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.tariff && <p className="text-red-500">{errors.member[0].tariff.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Advance Amount:</label>
            <input
              type="number"
              {...register(`member.0.advamount`, { required: "Advance Amount is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.advamount && <p className="text-red-500">{errors.member[0].advamount.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Status:</label>
            <input
              type="text"
              {...register(`member.0.status`, { required: "Advance Amount is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.status && <p className="text-red-500">{errors.member[0].status.message}</p>}
          </div>
          </div>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-4 border p-4 rounded shadow flex">
          <div className="mb-2">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              {...register(`member.${index}.name`, { required: "Name is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[index]?.name && <p className="text-red-500">{errors.member[index].name.message}</p>}
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Gender:</label>
            <select
              {...register(`member.${index}.gender`, { required: "Gender is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.member?.[index]?.gender && <p className="text-red-500">{errors.member[index].gender.message}</p>}
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Age:</label>
            <input
              type="number"
              {...register(`member.${index}.age`, { required: "Age is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[index]?.age && <p className="text-red-500">{errors.member[index].age.message}</p>}
          </div>
          <div className="mb-2">
      <label className="block text-gray-700">Photo:</label>
      {field.photo ? (
        <img
          src={`${baseURL}/${field.photo}`}
          alt={`Member ${index + 1}`}
          className="w-32 h-32 object-cover"
        />
      ) : (
        <p className="text-gray-500">No photo available</p>
      )}
      {errors.member?.[index]?.photo && <p className="text-red-500">{errors.member[index].photo.message}</p>}
    </div>
    <div className="mb-2">
      <label className="block text-gray-700">ID Proof:</label>
      {field.photo ? (
        <img
          src={`${baseURL}/${field.image}`}
          alt={`Member ${index + 1}`}
          className="w-32 h-32 object-cover"
        />
      ) : (
        <p className="text-gray-500">No photo available</p>
      )}
      {errors.member?.[index]?.photo && <p className="text-red-500">{errors.member[index].photo.message}</p>}
    </div>
    <div className="mb-2">
            <label className="block text-gray-700">Id Type:</label>
            <input
              type="text"
              {...register(`member.${index}.idtype`, { required: "Id Type is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[index]?.idtype && <p className="text-red-500">{errors.member[index].nameidtype.message}</p>}
          </div>

          <button type="button" onClick={() => remove(index)} className="text-red-500 mt-2">Remove Member</button>
        </div>
      ))}
      <div className="mb-4 flex justify-center">
      <button
        type="button"
        onClick={() => append({
          name: "", gender: "", age: "", photo: null, image: null, idtype: "", address: "",
          email: "", mobile: "", checkInDate: "", checkOutDate: "", roomno: "", tariff: "",
          advamount: "", purpose: "", comefrom: "", goingto: "", status: ""
        })}
        className="mb-4 p-2 bg-blue-500 text-white rounded "
      >
        Add Member
      </button>
      </div>
      <div className="mb-4 border p-4 rounded shadow flex">
      <div className="mb-2 ">
            <label className="block text-gray-700">Address:</label>
            <input
              type="text"
              {...register(`member.0.address`, { required: "Address is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.address && <p className="text-red-500">{errors.member[0].address.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              {...register(`member.0.email`, { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.email && <p className="text-red-500">{errors.member[0].email.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Mobile:</label>
            <input
              type="tel"
              {...register(`member.0.mobile`, { required: "Mobile is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.mobile && <p className="text-red-500">{errors.member[0].mobile.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">Purpose:</label>
            <input
              type="text"
              {...register(`member.0.purpose`, )}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.purpose && <p className="text-red-500">{errors.member[0].purpose.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">GoingTo:</label>
            <input
              type="text"
              {...register(`member.0.goingto`, )}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.goingto && <p className="text-red-500">{errors.member[0].goingto.message}</p>}
          </div>
          <div className="mb-2 ">
            <label className="block text-gray-700">ComeFrom:</label>
            <input
              type="text"
              {...register(`member.0.comefrom`, )}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.member?.[0]?.comefrom && <p className="text-red-500">{errors.member[0].comefrom.message}</p>}
          </div>
      </div>
      <div className="mb-4 flex justify-center">
      <button type="submit" className="p-2 bg-green-500 text-white rounded">Submit</button>
      </div>
    </form>
    </div>
      </main>
    </div>
  );
};

export default UpdateForm;
