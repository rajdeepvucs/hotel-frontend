import React from "react"
import permissionContext from "./PermissionContext"
const PermissionState=(props)=>{
    const fetchedPermissions = {
        "user1": ["/userhome"],
        "user2": ["/userhome", "/payment"],
        "admin1": ["/roomcreation", "/singleroomdetails", "/user","/new", "/bookingedit", "/checkout", "/bookingconfirmation", "/groupbooking", "/totalrevenuecollection","/getAllTodayCheckInBooking","/getRevenueModeCollectionTable","/totalgstcollection", "/userhome"],
        "admin2": ["/roomdetails", "/roomedit", "/roomshow", "/singleroomdetails", "/admindashboard", "/user","/accounts","/useredit","/bookingedit","/checkout","/bookingconfirmation","/check","/totalBooking","/getAllTodayCheckInBooking","/getRevenueModeCollectionTable","/totalgstcollection",  "/userhome"],
        "sysadmin1": ["/usermanagement"],
    };
    const product = "K Tea"; // String
    
  // Corrected to provide an object as context value:
    const contextValue = {
        permissions: fetchedPermissions,
        product: product
    };
    console.log("Permission Provider context value:", contextValue)
    return(
        <permissionContext.Provider value={contextValue}>
            {props.children}
        </permissionContext.Provider>
    )
}
export default PermissionState;