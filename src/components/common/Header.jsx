import { useState,useEffect } from "react";
import axios from "axios";
import { baseURL } from "../../../config";

const Header = ({ title }) => {
  const [data,setData]=useState([])
  const fetchBoarders = async () => {
    try {
   
        
      

      // const response = await axios.get(`${baseURL}/api/property/getproperty`);

const response = await axios.get("http://192.168.1.8:8080/props/getAllRegs");
console.log("header",response)
      // setData(response.data.property); 
      // localStorage.setItem('property_name',response.data.property[0].property_name );
      // localStorage.setItem('property_address',response.data.property[0].property_address );
      // localStorage.setItem('owner_contact_no',response.data.property[0].owner_contact_no );
      setData(response.data); 
 
      localStorage.setItem('property_name',response.data[0].propertyname );
       localStorage.setItem('property_address',response.data[0].propertyaddress );
       localStorage.setItem('owner_contact_no',response.data[0].properycontactno );
  
  
    } catch (error) {
      console.error("Failed to fetch boarders:", error);
    }
  };

  useEffect(() => {
    // Fetch boarders when the component mounts
    fetchBoarders();
  }, []);


	const editProfile=()=>{alert}
	return (
		<header className='bg-blue-300  backdrop-blur-md shadow-lg border-b border-gray-700'>
		<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between'>
  <div className="flex flex-col items-center">

  <img src={`http://192.168.1.8:8080/${data[0]?.propertyimage}`} alt='Logo' className='h-14 w-14 mr-4 rounded-full' />
  <h1 className="text-sm font-semibold text-gray-100 mt-1 uppercase">
   {data[0]?.propertyname}
  </h1>
</div>
  <h1 className='text-4xl font-semibold text-gray-100 mt-2'>{title}</h1>
  <div className="flex flex-col items-center">
  <img
    src={`http://192.168.1.8:8080/${data[0]?.ownerimage}`}
    alt="Logo"
    className="h-12 w-12 rounded-full mr-2"
  onClick={editProfile}/>
  <h1 className="text-sm font-semibold text-gray-100 mt-1 capitalize ">
  WelCome,{localStorage.getItem('user')}
  </h1>
</div>

</div>

		</header>
	);
};
export default Header;