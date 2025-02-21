import React, { useState, useEffect,useContext } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 ,CirclePlus, BookUser, RefreshCw, Info, Edit2  } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from "../../../config";
import * as Tabs from "@radix-ui/react-tabs";
import * as Popover from "@radix-ui/react-popover";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Header from "../common/Header";
import { toUpper } from "lodash";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Tariff = () => {
 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const [account, setAccount] = useState([]);
  const navigate = useNavigate();

  const property_name = localStorage.getItem("propertyId");
   // State for Room Features Tab
  
   const [newFeature, setNewFeature] = useState("");
   const [order, setOrder] = useState("");
   const [roomFeatures, setRoomFeatures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const fetchRoomFeatures = async () => {
       try {
           const response = await axios.get(`${baseURL}/api/room/roomfeaturesFetch/?propertyId=${property_name}`);
           setRoomFeatures(response.data.roomfeatures);
          
         } catch (error) {
           console.error('Error fetching room features:', error);
         }
   }

 React.useEffect(()=>{
     fetchRoomFeatures();
 }, []);

 const handleAddFeature = async () => {
       if (newFeature.trim() !== "") {
           try {
            const capitalizedFeature = newFeature.trim().charAt(0).toLowerCase() + newFeature.trim().slice(1).toLowerCase();
               const response = await axios.post(`${baseURL}/api/room/roomfeaturesAdd/?propertyId=${property_name}`, {
                   name: capitalizedFeature,
                   order
                   });
                   if (response.status === 201) {
                        fetchRoomFeatures();
                       toast.success('Room feature added successfully!');
                       setNewFeature(""); // Clear the input
                       setOrder("");
                   } else {
                     toast.error('Failed to add room feature.');
                   }
                } catch (error) {
                   console.error('Error adding room feature:', error);
                   toast.error('An error occurred while adding the room feature.');
               }
       }
   };

 const handleDeleteFeature = async (id) => {
       try {
         const response = await axios.delete(`${baseURL}/api/room/roomfeaturesDelete/${id}/?propertyId=${property_name}`);
         if (response.status === 200) {
           fetchRoomFeatures();
           toast.success('Room feature deleted successfully!');
         } else {
           toast.error('Failed to delete room feature.');
         }
       } catch (error) {
         console.error('Error deleting room feature:', error);
         toast.error('An error occurred while deleting the room feature.');
       }
 };
 
 

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/user/userdetails/?propertyId=${property_name}`);
      setFilteredUser(response.data.user);
    } catch (error) {
      console.error('Error fetching User:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (booking) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this user?");
    if (!confirmDelete) return;

    try {
      const response = await axios.post(`${baseURL}/api/user/deleteUser/${booking.id}/?propertyId=${property_name}`,
        );

      if (response.status === 200) {
        toast.success('User status updated successfully!');
        fetchAccounts();
      } else {
        toast.error('Failed to update User status.');
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error('An error occurred while updating the user status.');
    }
  };
  const handleEditClick = (user) => {

    navigate("/useredit", { state: { user } });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = filteredUser.filter((booking) =>
      booking.mobile.toString().includes(searchValue) ||
      booking.userName.toLowerCase().includes(searchValue) ||
      booking.role.toString().includes(searchValue)
    );

    setFilteredUser(filtered);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const indexOfLastProduct = currentPage * bookingsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - bookingsPerPage;
  const currentBooking = filteredUser.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredUser.length / bookingsPerPage);

  const handleClick = () => {
    navigate('/adduser');
  };
  //gst
  const [status, setStatus] = useState('');
  const [gstType, setGstType] = useState('');
  const [lowerRange, setLowerRange] = useState('');
  const [higherRange, setHigherRange] = useState('');
  const [gstPercentage, setGstPercentage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
   // Add state to hold the selected GST record for editing
   const [selectedGstRecord, setSelectedGstRecord] = useState(null);

   const resetForm = () => {
          setStatus('');
          setGstType('');
          setLowerRange('');
          setHigherRange('');
          setGstPercentage('');
          setStartDate('');
          setEndDate('');
          setSelectedGstRecord(null); // Clear selected record on reset
  
      }
      const handleEditGst = (id) => {
          // Find the selected GST record and populate the state
          const recordToEdit = gstRecords.find((record) => record.id === id);
          setSelectedGstRecord(recordToEdit);
  
          // Populate the form fields with the selected record's data
          setStatus(recordToEdit?.Status || '');
          setGstType(recordToEdit?.GST_TYPE || '');
          setLowerRange(recordToEdit?.GST_LOWER_RANGE || '');
          setHigherRange(recordToEdit?.GST_HIGHER_RANGE || '');
          setGstPercentage(recordToEdit?.GST_PCT || '');
          setStartDate(recordToEdit?.startDate ? new Date(recordToEdit.startDate).toISOString().split('T')[0] : ''); // Format date for input
          setEndDate(recordToEdit?.endDate ? new Date(recordToEdit.endDate).toISOString().split('T')[0] : '');     // Format date for input
  
          setIsModalOpen(true);
      };
  const handleAddGstRecord =async () => {
    const newRecord = {
      status:status,
      gstType: gstType.toUpperCase(),
      lowerRange: lowerRange,
      higherRange: higherRange,
      gstPercentage: gstPercentage,
      startDate: startDate,
      endDate: endDate
    };
  
    try {
     
         const response = await axios.post(`${baseURL}/api/gst/addGst`, {
            newRecord
             });
             if (response.status === 201) {
                 // fetchRoomFeatures();
                 toast.success('GST added successfully!');
                
             } else {
               toast.error('Failed to add GST.');
             }
          } catch (error) {
             console.error('Error adding GST:', error);
             toast.error('An error occurred while adding the GST.');
         }
    resetForm();

};




  
      const [gstRecords, setGstRecords] = useState([]);
      const handlegetGstRecord =async () => {


        try {
         
             const response = await axios.get(`${baseURL}/api/gst/getAllGst`);
                 if (response.status === 200) {
                     // fetchRoomFeatures();
                     setGstRecords(response.data)
                    
                    
                 } else {
                   toast.error('Failed to add GST.');
                 }
              } catch (error) {
                 console.error('Error adding GST:', error);
                 toast.error('An error occurred while adding the GST.');
             }
        resetForm();
      
      };
      useEffect(()=>{handlegetGstRecord();},[])
      const handleDeleteGst = async (id) => {
        try {
          const response = await axios.post(
            `${baseURL}/api/gst/deleteGst/${id}`
          ); // Replace with your actual API endpoint

          await handlegetGstRecord();
        } catch (err) {
          console.error("Error deleting GST:", err);
        }
      };
   
      const handleUpdateGST = async () => {
        // Create an object with the updated GST record data
        const updatedRecord = {
            id: selectedGstRecord.id, // Include the ID of the record being updated
            status: status,
            gstType: gstType.toUpperCase(),
            lowerRange: lowerRange,
            higherRange: higherRange,
            gstPercentage: gstPercentage,
            startDate: startDate,
            endDate: endDate
        };

        try {
            // Make an API request to update the GST record
            const response = await axios.post(`${baseURL}/api/gst/updateGst/${selectedGstRecord.id}`, {
                updatedRecord
            });

            if (response.status === 200) {
                toast.success('GST record updated successfully!');
                handlegetGstRecord(); // Refresh the GST records
            } else {
                toast.error('Failed to update GST record.');
            }
        } catch (error) {
            console.error('Error updating GST record:', error);
            toast.error('An error occurred while updating the GST record.');
        } finally {
            setIsModalOpen(false); // Close the modal
            resetForm();         // Reset the form fields
        }
    };
    //subcriptionplans
 
  const [statusPlan, setStatusPlan] = useState('');
  const [planName, setPlanName] = useState('');
  const [ planPrice, setPlanPrice] = useState('');
 const [startDatePlan, setStartDatePlan] = useState('');
  const [endDatePlan, setEndDatePlan] = useState('');
 
   const [selectedPlanRecord, setSelectedPlanRecord] = useState(null);
   const[planRecords,setPlanRecords]=useState([])
   const [isModalOpenPlan, setIsModalOpenPlan] = useState(false);
   const handlegetPlanRecord =async () => {


    try {
     
         const response = await axios.get(`${baseURL}/api/subcriptionplan/getAllSubscriptionPlans`);
             if (response.status === 200) {
                 
                 setPlanRecords(response.data)
          
                
                
             } else {
               toast.error('Failed to add Plan.');
             }
          } catch (error) {
             console.error('Error adding Plan:', error);
             toast.error('An error occurred while adding the Plan.');
         }
    resetForm1();
  
  };
  useEffect(()=>{handlegetPlanRecord();},[])
  const handleDeletePlan = async (id) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/subcriptionplan/deleteSubscriptionPlan/${id}`
      ); 
      toast.success("Plan deleted Successfully")

      await handlegetPlanRecord();
    } catch (err) {
      console.error("Error deleting Plan:", err);
    }
  };

  const handleUpdatePlan = async () => {
    // Create an object with the updated GST record data
    const updatedRecord = {
        id: selectedPlanRecord.id, // Include the ID of the record being updated
        status: statusPlan,
        planName: planName.toUpperCase(),
        planPrice:planPrice,
        startDate: startDatePlan,
        endDate: endDatePlan
    };

    try {
        // Make an API request to update the GST record
        const response = await axios.post(`${baseURL}/api/subcriptionplan/updateSubscriptionPlan/${selectedPlanRecord.id}`, {
            updatedRecord
        });

        if (response.status === 200) {
            toast.success('Subcription Plan record updated successfully!');
            handlegetPlanRecord(); 
        } else {
            toast.error('Failed to update Subcription Plan record.');
        }
    } catch (error) {
        console.error('Error updating Plan record:', error);
        toast.error('An error occurred while updating the Plan record.');
    } finally {
        setIsModalOpenPlan(false); // Close the modal
        resetForm1();         // Reset the form fields
    }
};
const resetForm1 = () => {
  setStatusPlan('');
  setPlanName('');
  setPlanPrice('');
  setStartDatePlan('');
  setEndDatePlan('');
  setSelectedPlanRecord(null); // Clear selected record on reset

}
const handleAddPlanRecord =async () => {
  const newRecord = {
    status:statusPlan,
    planName: planName.toUpperCase(),
    planPrice: planPrice,
    startDate: startDatePlan,
    endDate: endDatePlan
  };

  try {
   
       const response = await axios.post(`${baseURL}/api/subcriptionplan/addSubscriptionPlan`, {
          newRecord
           });
           if (response.status === 201) {
            
               toast.success('Plan added successfully!');
               handlegetPlanRecord();
              
           } else {
             toast.error('Failed to add Plan.');
           }
        } catch (error) {
           console.error('Error adding Plan:', error);
           toast.error('An error occurred while adding the Plan.');
       }
  resetForm();

};
const handleEditPlan = (id) => {
  // Find the selected GST record and populate the state
  const recordToEdit = planRecords.find((record) => record.id === id);
  setSelectedPlanRecord(recordToEdit);

  // Populate the form fields with the selected record's data
  setStatusPlan(recordToEdit?.status || '');
  setPlanName(recordToEdit?.planName || '');
  setPlanPrice(recordToEdit?.planPrice || '');
 
  setStartDatePlan(recordToEdit?.startDate ? new Date(recordToEdit.startDate).toISOString().split('T')[0] : ''); // Format date for input
  setEndDatePlan(recordToEdit?.endDate ? new Date(recordToEdit.endDate).toISOString().split('T')[0] : '');     // Format date for input

  setIsModalOpenPlan(true);
};

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100">
      <Header title="Tariff Details" />
      
      <motion.div
        className="rounded-xl p-8 border border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
          {/* <ToastContainer /> */}
          <Tabs.Root
              className="flex w-full flex-col"
              defaultValue="tab1"
            >
              <Tabs.List
                className="flex shrink-0 border-b border-mauve6"
                aria-label="Manage your account"
              >
                <Tabs.Trigger
                  className="flex h-[45px] cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_1px]"
                  value="tab1"
                >
                  Room Rates
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="flex h-[45px] cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_1px]"
                  value="tab2"
                >
                  Meals
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="flex h-[45px] cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_1px]"
                  value="tab3"
                >
                  Room Feature
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="flex h-[45px] cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_1px]"
                  value="tab4"
                >
                 GST
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="flex h-[45px] cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_1px]"
                  value="tab5"
                >
                 SubcriptionPlans
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                className="grow rounded-b-md bg-white p-5 outline-none"
                value="tab1"
              >
                {/* ROOM TERIFF SESCTION */}
                <div className="text-left w-full flex">
                  <p className="mb-1 text-[15px] leading-normal text-black font-medium">
                  Room Rates
                  </p>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        className="relative inline-flex size-[32px] ml-1 -inset-y-3  my-2 cursor-pointer items-center justify-center rounded-full text-violet11 outline-none"
                        aria-label="Room Info"
                      >
                        <Info />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className="z-10 w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
                        sideOffset={5}
                      >
                        <div className="flex flex-col gap-2.5">
                          <fieldset className="flex items-center gap-5">
                            <label
                              className="w-3/5 text-sm text-black font-medium"
                              htmlFor="width"
                            >
                              Hotel Room Tariff per Night
                            </label>
                            <label
                              className="w-2/5 text-[13px] text-black text-right font-medium"
                              htmlFor="width"
                            >
                              GST Rate
                            </label>
                          </fieldset>
                          <fieldset className="flex items-center gap-5">
                            <label
                              className="w-4/5 text-sm text-violet11"
                              htmlFor="width"
                            >
                              Below Rs. 1,000
                            </label>
                            <label
                              className="w-1/5 text-[13px] text-violet11 text-right"
                              htmlFor="width"
                            >
                              12%
                            </label>
                          </fieldset>
                          <fieldset className="flex items-center gap-5">
                            <label
                              className="w-4/5 text-sm text-violet11"
                              htmlFor="width"
                            >
                              Rs. 1,000 to Rs. 7,500
                            </label>
                            <label
                              className="w-1/5 text-[13px] text-violet11 text-right"
                              htmlFor="width"
                            >
                              12%
                            </label>
                          </fieldset>
                          <fieldset className="flex items-center gap-5">
                            <label
                              className="w-4/5 text-sm text-violet11"
                              htmlFor="width"
                            >
                              Rs. 7,501 and Above
                            </label>
                            <label
                              className="w-1/5 text-[13px] text-violet11 text-right"
                              htmlFor="width"
                            >
                              18%
                            </label>
                          </fieldset>
                        </div>
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>

                <p className="mb-5 text-[15px] leading-normal text-mauve11">
                  Add Room Type
                </p>

                <div className="flex flex-row gap-4">
                  <fieldset className="mb-[15px] flex w-1/2 flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="name"
                    >
                      Room Type
                    </label>
                    <input
                      type="text"
                      min="0"
                      className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      placeholder="Insert Room Type"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </fieldset>
                  <fieldset className="mb-[15px] flex w-1/2 flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="username"
                    >
                      Room Tariff
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      placeholder="0.00"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </fieldset>
                  <fieldset className="mb-[15px] flex w-1/2 flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="username"
                    >
                      Room Tariff GST Rate
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      placeholder="%"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </fieldset>
                  <fieldset className="mb-[15px] flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="username"
                    >
                      Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-[60px] h-[35px] rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      placeholder="0"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </fieldset>
                  <div className="mt-5 flex justify-end">
                    <button className="inline-flex h-[40px] cursor-pointer items-center justify-center rounded bg-blue-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-blue-700 focus:shadow-[0_0_0_2px] focus:shadow-green7">
                      Add
                    </button>
                  </div>
                </div>


{/* TABLE LISTING */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {['SL', 'Room Type', 'Room Tariff', 'Room Tariff GST Rate', 'Status', 'Order', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {currentBooking.map((booking) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">1</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.mobile}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.email}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.email}</td> */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">1</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">Deluxe</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">1250.00</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">12%</td>
                  <td
                    className={`px-3 py-4 whitespace-nowrap text-sm ${
                      booking.status ? "text-green-700" : "text-red-500"
                    }`}
                  >
                    {booking.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">0</td>

				  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>

									<button className='text-indigo-400 hover:text-indigo-800 mr-2' onClick={()=>{handleEditClick(booking)}}>
										<Edit size={18} />
									</button>
									<button className='text-red-400 hover:text-red-300' onClick={()=>{handleDelete(booking)}}>
										<Trash2 size={18} />
									</button>

								</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          
            
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
{/* TABLE LISTING END */}

                
              </Tabs.Content>

              <Tabs.Content
                className="grow rounded-b-md bg-white p-5 outline-none"
                value="tab2"
              >

              {/* MEALS TERIFF SESCTION */}
              <div className="text-left w-full flex">
                  <p className="mb-1 text-[15px] leading-normal text-black font-medium">
                    Meal GST Rates
                  </p>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        className="relative inline-flex size-[32px] ml-1 -inset-y-3  my-2 cursor-pointer items-center justify-center rounded-full text-violet11 outline-none"
                        aria-label="GST Info"
                      >
                        <Info />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className="z-10 w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
                        sideOffset={5}
                      >
                        <div className="flex flex-col gap-2.5">
                          <fieldset className="flex items-center gap-5">
                            <label
                              className="w-3/5 text-sm text-black font-medium"
                              htmlFor="width"
                            >
                              GST on meals/food services
                            </label>
                            <label
                              className="w-2/5 text-[13px] text-black text-right font-medium"
                              htmlFor="width"
                            >
                              GST Rate
                            </label>
                          </fieldset>
                          <fieldset className="flex items-center gap-5">
                            <label
                              className="w-4/5 text-sm text-violet11"
                              htmlFor="width"
                            >
                              Meals
                            </label>
                            <label
                              className="w-1/5 text-[13px] text-violet11 text-right"
                              htmlFor="width"
                            >
                              5%
                            </label>
                          </fieldset>
                        </div>
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>

                <p className="mb-5 text-[15px] leading-normal text-mauve11">
                  Add Meals  that are saved in hotel
                </p>

                <div className="flex flex-row gap-4">
                  <fieldset className="mb-[15px] flex w-1/2 flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="name"
                    >
                      Board
                    </label>

                    <select
                      className="w-full px-4 py-2 shrink-0 grow rounded  text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_1px] focus:shadow-violet8"
                    >
                      <option disabled value="">Select</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="breakfast">Half Board</option>
                      <option value="breakfast">Full Board</option>
                      <option value="breakfast">All Inclusive</option>
                    </select>
                  </fieldset>
                  <fieldset className="mb-[15px] flex w-1/2 flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="username"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      placeholder="0.00"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </fieldset>
                  <fieldset className="mb-[15px] flex w-1/2 flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="username"
                    >
                      GST%
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      placeholder="%"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </fieldset>
                  <fieldset className="mb-[15px] flex-col justify-start">
                    <label
                      className="mb-2.5 block text-[13px] leading-none text-violet12"
                      htmlFor="username"
                    >
                      Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-[60px] h-[35px] rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      placeholder="0"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </fieldset>
                  <div className="mt-5 flex justify-end">
                    <button className="inline-flex h-[40px] cursor-pointer items-center justify-center rounded bg-blue-500 px-[15px] text-[15px] font-medium leading-none text-white outline-none hover:bg-blue-700 focus:shadow-[0_0_0_2px] focus:shadow-green7">
                      Add
                    </button>
                  </div>
                </div>  


                {/* TABLE LISTING MEAL */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {['SL', 'Board', 'Price', 'GST%', 'Status', 'Order', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {currentBooking.map((booking) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">1</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.mobile}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.email}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{booking.email}</td> */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">1</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">Breakfast</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">350.00</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">5%</td>

                  <td
                    className={`px-3 py-4 whitespace-nowrap text-sm ${
                      booking.status ? "text-green-700" : "text-red-500"
                    }`}
                  >
                    {booking.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">0</td>

				  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>

									<button className='text-indigo-400 hover:text-indigo-800 mr-2' onClick={()=>{handleEditClick(booking)}}>
										<Edit size={18} />
									</button>
									<button className='text-red-400 hover:text-red-300' onClick={()=>{handleDelete(booking)}}>
										<Trash2 size={18} />
									</button>

								</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
{/* TABLE LISTING END */}      

              </Tabs.Content>
         
                 <Tabs.Content
                className="grow rounded-b-md bg-white p-5 outline-none"
                value="tab3"
              >
                {/* Room Feature Tab Content  */}
                <div className="mb-5">
                      <p className="mb-5 text-[15px] leading-normal text-mauve11">
                        Add Room Features
                      </p>
                  <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Enter order to show feature"
                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter room feature"
                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <button
                    className="inline-flex h-[35px] cursor-pointer items-center justify-center rounded bg-blue-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-blue-700 focus:shadow-[0_0_0_2px] focus:shadow-green7"
                    onClick={handleAddFeature}
                  >
                    Add Feature
                  </button>
                </div>
            </div>
      {/* TABLE LISTING ROOM FEATURE */}
      <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {['SL', 'Feature', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {roomFeatures.map((feature, index) => (
                <motion.tr
                  key={feature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                   <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{feature.featureName}</td>


				  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>

									<button className='text-red-400 hover:text-red-300' onClick={()=>{handleDeleteFeature(feature.id)}}>
										<Trash2 size={18} />
									</button>

								</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
{/* TABLE LISTING END */}
              </Tabs.Content>
              <Tabs.Content
            className="grow rounded-b-md bg-white p-5 outline-none"
            value="tab4"
        >
            {/* GST Tab Content  */}
            <div className="mb-5">
                <p className="mb-5 text-[15px] leading-normal text-mauve11">
                    Add GST Record
                </p>
                <div className="flex flex-col gap-3">
                   {/* Grid Container */}
                    <div className="grid grid-cols-7 gap-3">
                    <div className='flex flex-col'>
    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
    <select
        className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
       <option value="" disabled >Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
  </div>
                       {/* GST Type */}
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST Type</label>
                                <input
                                    type="text"
                                    placeholder="eg Room,Food or Subscription"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={gstType}
                                    onChange={(e) => setGstType(e.target.value)}
                                    required
                                />
                            </div>
                        {/* Lower GST Range */}
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lower GST Range</label>
                                <input
                                    type="number"
                                    placeholder="Enter Lower GST Range"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={lowerRange}
                                    onChange={(e) => setLowerRange(e.target.value)}
                                    required
                                />
                            </div>
                        {/* Higher GST Range */}
                         <div className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Higher GST Range</label>
                                <input
                                    type="number"
                                    placeholder="Enter Higher GST Range"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={higherRange}
                                    onChange={(e) => setHigherRange(e.target.value)}
                                    required
                                />
                            </div>
                            {/* GST Percentage */}
                               <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST </label>
                                    <input
                                        type="number"
                                        placeholder="Enter GST eg(12)"
                                        className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                        value={gstPercentage}
                                        onChange={(e) => setGstPercentage(e.target.value)}
                                    />
                            </div>
                             {/* Effective Date */}
                           <div className='flex flex-col'>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter Effective date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                             </div>
                           {/* End Date */}
                           <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter End Date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                           {/* Add Button */}
                           <div className='flex flex-col'>
                           <label className="block text-sm font-medium text-gray-700 mb-1  invisible ">label</label>
                            <button
                                className="inline-flex h-[35px] cursor-pointer items-center justify-center rounded bg-blue-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-blue-700 focus:shadow-[0_0_0_2px] focus:shadow-green7"
                                onClick={handleAddGstRecord}
                            >
                            Add
                           </button>
                           </div>
                    </div>
                </div>
            </div>
            {/* TABLE LISTING Gst */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            {['SL', 'GST Type', 'Lower Range', 'Higher Range', 'GST ','Status', 'Effective Date', 'End Date', 'Actions'].map((heading) => (
                                <th
                                    key={heading}
                                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {gstRecords.map((record, index) => (
                            <motion.tr
                                key={record.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{record?.GST_TYPE}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{record?.GST_LOWER_RANGE}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{record?.GST_HIGHER_RANGE}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{record?.GST_PCT}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm">
  {record?.Status.toLowerCase()=='active' ? (
    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
     {record?.Status}
    </span>
  ) : (
    <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full">
    { record?.Status}
    </span>
  )}
</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
  {record?.startDate ? new Date(record.startDate).toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : ''}
</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{record?.endDate ? new Date(record.endDate).toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : ''}</td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                                <button className='text-blue-400 hover:text-blue-300' onClick={() => { handleEditGst(record.id) }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button className='text-red-400 hover:text-red-300' onClick={() => { handleDeleteGst(record.id) }}>
                                        <Trash2 size={18} />
                                    </button>

                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* TABLE LISTING END */}
        </Tabs.Content>
        <Tabs.Content
            className="grow rounded-b-md bg-white p-5 outline-none"
            value="tab5"
        >
            {/* Subcription Tab Content  */}
            <div className="mb-5">
                <p className="mb-5 text-[15px] leading-normal text-mauve11">
                    Add Subcription Record
                </p>
                <div className="flex flex-col gap-3">
                   {/* Grid Container */}
                    <div className="grid grid-cols-7 gap-3">
                    <div className='flex flex-col'>
    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
    <select
        className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
        value={statusPlan}
        onChange={(e) => setStatusPlan(e.target.value)}
      >
       <option value="" disabled >Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
  </div>
                     
                        {/* Plan Name */}
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    placeholder="eg Silver Gold"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                    required
                                />
                            </div>
                        {/*Plan Price */}
                         <div className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Price</label>
                                <input
                                    type="number"
                                    placeholder="Enter 5/- or 7/- per day"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={planPrice}
                                    onChange={(e) => setPlanPrice(e.target.value)}
                                    required
                                />
                            </div>
                            
                             {/* Effective Date */}
                           <div className='flex flex-col'>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter Effective date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={startDatePlan}
                                    onChange={(e) => setStartDatePlan(e.target.value)}
                                />
                             </div>
                           {/* End Date */}
                           <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter End Date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={endDatePlan}
                                    onChange={(e) => setEndDatePlan(e.target.value)}
                                />
                            </div>
                           {/* Add Button */}
                           <div className='flex flex-col'>
                           <label className="block text-sm font-medium text-gray-700 mb-1  invisible ">label</label>
                            <button
                                className="inline-flex h-[35px] cursor-pointer items-center justify-center rounded bg-blue-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-blue-700 focus:shadow-[0_0_0_2px] focus:shadow-green7"
                                onClick={handleAddPlanRecord}
                            >
                            Add
                           </button>
                           </div>
                    </div>
                </div>
            </div>
            {/* TABLE LISTING Plan */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            {['SL', 'Plan Name', 'Plan Price', 'Status', 'Effective Date', 'End Date', 'Actions'].map((heading) => (
                                <th
                                    key={heading}
                                    className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {planRecords?.map((record, index) => (
                            <motion.tr
                                key={record.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{record?.planName}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{record?.planPrice}</td>

                                <td className="px-3 py-4 whitespace-nowrap text-sm">
  {record?.status=='Active' ? (
    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
      Active
    </span>
  ) : (
    <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full">
      InActive
    </span>
  )}
</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
  {record?.startDate ? new Date(record.startDate).toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : ''}
</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">  {record?.endDate ? new Date(record.endDate).toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : ''}</td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                                <button className='text-blue-400 hover:text-blue-300' onClick={() => { handleEditPlan(record.id) }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button className='text-red-400 hover:text-red-300' onClick={() => { handleDeletePlan(record.id) }}>
                                        <Trash2 size={18} />
                                    </button>

                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* TABLE LISTING END */}
        </Tabs.Content>
                
          </Tabs.Root>
              {/* Modal Gst */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="border border-gray-300 rounded-md p-3 shadow-md relative bg-white w-96">
                    <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                      Edit GST
                    </h2>
                    <div className="flex flex-col gap-3">
                   {/* Grid Container */}
                    <div className="grid grid-cols-2 gap-3">
                    <div className='flex flex-col'>
    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
    <select
        className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
       <option value="" disabled >Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
  </div>
                       {/* GST Type */}
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST Type</label>
                                <input
                                    type="text"
                                    placeholder="Enter GST Type eg Room or Subscription"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={gstType}
                                    onChange={(e) => setGstType(e.target.value)}
                                />
                            </div>
                        {/* Lower GST Range */}
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lower GST Range</label>
                                <input
                                    type="number"
                                    placeholder="Enter Lower GST Range"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={lowerRange}
                                    onChange={(e) => setLowerRange(e.target.value)}
                                />
                            </div>
                        {/* Higher GST Range */}
                         <div className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Higher GST Range</label>
                                <input
                                    type="number"
                                    placeholder="Enter Higher GST Range"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={higherRange}
                                    onChange={(e) => setHigherRange(e.target.value)}
                                />
                            </div>
                            {/* GST Percentage */}
                               <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST </label>
                                    <input
                                        type="number"
                                        placeholder="Enter GST eg(12)"
                                        className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                        value={gstPercentage}
                                        onChange={(e) => setGstPercentage(e.target.value)}
                                    />
                            </div>
                             {/* Effective Date */}
                           <div className='flex flex-col'>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter Effective date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                             </div>
                           {/* End Date */}
                           <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter End Date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                          
                    </div>
                     {/* Close Button */}
                     <button
                      onClick={()=>{setIsModalOpen(false)}}
                      className="absolute top-0 right-0 p-2 text-gray-700 hover:text-gray-900"
                    >
                      <span className="font-bold text-xl">&times;</span>
                    </button>
                       {/* Buttons */}
                  <div className="flex justify-end gap-4 mt-4">
                  <button
                      className="inline-flex h-[35px] cursor-pointer items-center justify-center rounded bg-gray-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-gray-700 focus:shadow-[0_0_0_2px] focus:shadow-gray-700"
                      onClick={() => setIsModalOpen(false)}
                  >
                      Cancel
                  </button>
                  <button
                      className="inline-flex h-[35px] cursor-pointer items-center justify-center rounded bg-blue-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-blue-700 focus:shadow-[0_0_0_2px] focus:shadow-blue-700"
                      onClick={handleUpdateGST}
                  >
                      Update
                  </button>
              </div>
                </div>
                </div>
                </div>
              )}
               {/* Modal Plan */}
               {isModalOpenPlan && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="border border-gray-300 rounded-md p-3 shadow-md relative bg-white w-96">
                    <h2 className="absolute -top-3 left-5 bg-white px-2 text-lg font-semibold text-gray-700">
                      Edit Subcription Plan
                    </h2>
                    <div className="flex flex-col gap-3">
                   {/* Grid Container */}
                    <div className="grid grid-cols-2 gap-3">
                    <div className='flex flex-col'>
    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
    <select
        className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
        value={statusPlan}
        onChange={(e) => setStatusPlan(e.target.value)}
      >
       <option value="" disabled >Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
  </div>
                    
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter GST Type eg Room or Subscription"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                />
                            </div>
                    
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Price</label>
                                <input
                                    type="number"
                                    placeholder="Enter Lower GST Range"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={planPrice}
                                    onChange={(e) => setPlanPrice(e.target.value)}
                                />
                            </div>
                       
                             {/* Effective Date */}
                           <div className='flex flex-col'>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter Effective date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={startDatePlan}
                                    onChange={(e) => setStartDatePlan(e.target.value)}
                                />
                             </div>
                           {/* End Date */}
                           <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter End Date"
                                    className="h-[35px] shrink-0 grow rounded px-2.5 text-sm leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                                    value={endDatePlan}
                                    onChange={(e) => setEndDatePlan(e.target.value)}
                                />
                            </div>
                          
                    </div>
                     {/* Close Button */}
                     <button
                      onClick={()=>{setIsModalOpenPlan(false)}}
                      className="absolute top-0 right-0 p-2 text-gray-700 hover:text-gray-900"
                    >
                      <span className="font-bold text-xl">&times;</span>
                    </button>
                       {/* Buttons */}
                  <div className="flex justify-end gap-4 mt-4">
                  <button
                      className="inline-flex h-[35px] cursor-pointer items-center justify-center rounded bg-gray-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-gray-700 focus:shadow-[0_0_0_2px] focus:shadow-gray-700"
                      onClick={() => setIsModalOpenPlan(false)}
                  >
                      Cancel
                  </button>
                  <button
                      className="inline-flex h-[35px] cursor-pointer items-center justify-center rounded bg-blue-500 text-white px-[15px] text-[15px] font-medium leading-none outline-none hover:bg-blue-700 focus:shadow-[0_0_0_2px] focus:shadow-blue-700"
                      onClick={handleUpdatePlan}
                  >
                      Update
                  </button>
              </div>
                </div>
                </div>
                </div>
              )}
      </motion.div>






      <motion.div
        className="bg-white shadow-md rounded-xl p-8 border border-gray-300 mb-8 mt-6 mx-8 hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Rooms Tariff</h2>
          <div className="relative">
          <button
            onClick={handleClick}
            className="inline-flex items-center p-2 rounded-full text-blue-600 hover:text-blue-800  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ring-2 ring-offset-2"
          >
            <CirclePlus className="w-6 h-6 mr-1" />
            Add Room Tariff
          </button>
            {/* <input
              type="text"
              placeholder="Search..."
              className="bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} /> */}
          </div>
        </div>

        <ToastContainer />

        <div className="flex justify-start items-center mb-6">
          
        </div>




      </motion.div>
    </div>
  );
};

export default Tariff;
