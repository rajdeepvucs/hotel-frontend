import React, { useState,useEffect } from 'react';
import Header from '../common/Header';
import { useForm, Controller } from 'react-hook-form';
import {  useLocation, useNavigate } from 'react-router-dom';
import { baseURL } from '../../../config';
import axios from "axios"
function BookingDetails() {

const navigate=useNavigate()
  const location = useLocation();
  
  const [booking, setBooking] = useState(location.state?.booking || {});
console.log(booking)
  const [boarders, setBoarders] = useState([]);
 // Fetch boarders from the server
 const fetchBoarders = async () => {
  try {
    if (booking) {
      const response = await axios.get(`${baseURL}/api/booking/boaders`, {
        params: {
          bookingId: booking?.bookingId, // First parameter
          checkInDate: booking?.checkInDate, // Second parameter
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
}, [booking]);
  
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Booking Details' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* <div className='flex flex-col justify-center items-center'>
         
          <form  className="border border-gray-300 p-6 rounded-md shadow-md bg-white">
          <div className="grid grid-cols-5 gap-4">
          <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="roomNo" className='text-base'>Name</label>
               <input
                 id="roomNo"
                 type="text"
                
                 {...register('name', { required: 'Room no is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.roomNo && <p className="text-red-500 text-sm">{errors.roomNo.message}</p>}
             </div>
             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="roomNo" className='text-base'>Age</label>
               <input
                 id="roomNo"
                 type="text"
                
                 {...register('age', { required: 'Room no is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.roomNo && <p className="text-red-500 text-sm">{errors.roomNo.message}</p>}
             </div>
             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="roomNo" className='text-base'>Gender</label>
               <input
                 id="roomNo"
                 type="text"
                
                 {...register('gender', { required: 'Gender no is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.roomNo && <p className="text-red-500 text-sm">{errors.roomNo.message}</p>}
             </div>
             <div className='flex flex-col space-y-1 mb-4'>
             <label htmlFor="roomNo" className='text-base'>Photo</label>
             <img
                    src={`${baseURL}/${booking.photo}`}
                    alt={booking.name}
                    className="w-32 h-32 object-cover"
                  />
             </div>
             <div className='flex flex-col space-y-1 mb-4'>
             <label htmlFor="roomNo" className='text-base'>Id Proof</label>
             <img
                    src={`${baseURL}/${booking.image}`}
                    alt={booking.name}
                    className="w-32 h-32 object-cover"
                  />
             </div>
          </div>
           <div className="grid grid-cols-3 gap-4">
           <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="roomNo" className='text-base'>Room No</label>
               <input
                 id="roomNo"
                 type="text"
                 value={booking.roomno}
                 {...register('roomNo', { required: 'Room no is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.roomNo && <p className="text-red-500 text-sm">{errors.roomNo.message}</p>}
             </div>
           <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="checkInDate" className='text-base'>Check-In Date</label>
               <input
                 id="checkInDate"
                 type="date"
                 
                 {...register('checkInDate', { required: 'Check-In Date is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.checkInDate && <p className="text-red-500 text-sm">{errors.checkInDate.message}</p>}
             </div>

             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="checkOutDate" className='text-base'>Check-Out Date</label>
               <input
                 id="checkOutDate"
                 type="date"
                 {...register('checkOutDate', { required: 'Check-Out Date is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.checkOutDate && <p className="text-red-500 text-sm">{errors.checkOutDate.message}</p>}
             </div>
           </div>
        

           
           <div className='grid grid-cols-3 gap-4'>
           <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="mobile" className='text-base'>Mobile</label>
               <input 
                 id="mobile"
                 type="text"
                 placeholder='(+91)09749123654'
                 {...register('mobile', { required: 'Mobile is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
             </div>

             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="address" className='text-base'>Address</label>
               <input 
                 id="address"
                 type="text"
                 placeholder='R.N Road Siliguri Darjeeling'
                 {...register('address', { required: 'Address is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
             </div>
             
             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="email" className='text-base'>Email</label>
               <input 
                 id="email"
                 type="email"
                 placeholder='example@gmail.com'
                 {...register('email', { required: 'Email is required' })}
                 className='border p-2 rounded-md w-full'
               />
               {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
             </div>
           </div>
     <div className='grid grid-cols-2 gap-4'>
             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="amount" className='text-base'>Tariff</label>
               <input
                 id="amount"
                 placeholder='Rs/-800'
                 {...register('tariff', )}
                 className='border p-2 rounded-md w-full'
               />
              
             </div>

             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="advamount" className='text-base'>Advance Amount</label>
               <input
                 id="advamount"
                 placeholder='Rs/-800'
                 {...register('advamount')}
                 className='border p-2 rounded-md w-full'
               />
             </div>
           </div>
           <div className='grid grid-cols-3 gap-4'>
             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="amount" className='text-base'>Purpose</label>
               <input
                 id="amount"
                 placeholder='eg. Travelling'
                 {...register('purpose', )}
                 className='border p-2 rounded-md w-full'
               />
              
             </div>

             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="advamount" className='text-base'>Going To</label>
               <input
                 id="goingto"
                 placeholder='Kolkata'
                 {...register('goingto')}
                 className='border p-2 rounded-md w-full'
               />
             </div>
             <div className='flex flex-col space-y-1 mb-4'>
               <label htmlFor="advamount" className='text-base'>Coming From</label>
               <input
                 id="comingfrom"
                 placeholder='Puri'
                 {...register('comingfrom')}
                 className='border p-2 rounded-md w-full'
               />
             </div>
           </div>
           <div className='grid grid-cols-1 gap-4'>
         
           </div>
     
         
         </form>
        </div> */}
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
      </main>
    </div>
  );
}

export default BookingDetails;
 