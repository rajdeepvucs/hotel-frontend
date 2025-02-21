import { useState, useEffect } from "react";
import { baseURL } from "../../../config";
import apiClient from "../../api/apiClient";

const Header = ({ title }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state


  const fetchBoarders = async () => {
    setLoading(true); // Set loading to true when starting the request

    try {
      const response = await apiClient.get(`${baseURL}/api/property/getproperty`);
      setData(response.data.property);
     
    } catch (error) {
      console.error("Failed to fetch boarders:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes or errors
    }
  };



  useEffect(() => {
    fetchBoarders();
  }, []);

  // Use another useEffect to update localStorage AFTER data is updated
    useEffect(() => {
        if (data && data.length > 0) {
           
          localStorage.setItem('property_address', `${data[0]?.propertyaddress1 || ""} ${data[0]?.propertyaddress2 || ""}`.trim());
            localStorage.setItem('owner_contact_no', data[0]?.propertycontactno || "");
        }
    }, [data]); // Depend on 'data' to trigger only after data changes
    
  const editProfile = () => { alert("Edit profile clicked!"); }


  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!data || data.length === 0) {
     return <div>No data available</div>
  }

  return (
    <header className='bg-[#e0ddga]  backdrop-blur-md shadow-lg border-b border-gray-700'>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between'>
        <div className="flex flex-col items-center">
          <img src={`${baseURL}/${data[0]?.propertylogo}`} alt='Logo' className='h-14 w-14 mr-4 rounded-full' />
          <h1 className="text-sm font-semibold text-gray-900 mt-1 uppercase">
            {data[0]?.propertyname}
          </h1>
        </div>
        <h1 className='text-4xl font-semibold text-gray-900 mt-2'>{title}</h1>
        <div className="flex flex-col items-center">
          <img
            src={`${baseURL}/${data[0]?.ownerimage}`}
            alt="Logo"
            className="h-12 w-12 rounded-full mr-2"
            onClick={editProfile}
          />
          <h1 className="text-sm font-semibold text-gray-900 mt-1 capitalize ">
            WelCome,{localStorage.getItem('user')}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;