import React, { useState, useEffect } from "react";
import GstContext from "./GstContext";
import axios from "axios"
import { baseURL } from "../../../../config";
const GstState = (props) => {
  const [fetchedGst, setFetchedGst] = useState([]); // Initialize with an empty array
 

  useEffect(() => {
    // Function to fetch the data. Use an async function
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/gst/getAllGstActive`); 
        if (response.status!=200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
     
        setFetchedGst(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching GST data:", error);
       
      }
    };

    fetchData(); // Call the async function
  }, []); // The empty dependency array means this effect runs only once, after the initial render

  const contextValue = {
   gstRate:fetchedGst
  };

  console.log("Gst Provider context value:", contextValue);

  return (
    <GstContext.Provider value={contextValue}>
      {props.children}
    </GstContext.Provider>
  );
};

export default GstState;