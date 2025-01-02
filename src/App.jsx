import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useEffect } from "react";
import Home from "./components/Home/Home";
import Sidebar from "./components/common/Sidebar";
import AddRoomBookingForm from "./components/Home/AddRoomBookingForm";
import Room from "./components/Home/Room";
import BookingDetails from "./components/Home/BookingDetails";
import Login from "./components/common/Login";
import Logout from "./components/common/Logout";
import BoderDetailsForm from "./components/Home/BoderDetailsForm";
import WebcamComponent from "./components/Home/WebcamComponent";
import HotelInvoice from "./components/Home/HotelInvoice";
// import Card from "./components/Home/Card";
import RoomCreationForm from "./components/Room/RoomCreationForm";
import Dashboard from "./components/Admin/Dashboard";
import RoomDetail from "./components/Room/RoomDeatail";
import RoomUpdateForm from "./components/Room/RoomUpdateForm";
import RoomCreate from "./components/Room/RoomCreate";
import SingleRoomDetails from "./components/Room/SingleRoomDetails";
import UserCreate from "./components/User/UserCreate";
import New from "./components/Room/New";
import AccountTable from "./components/Account/AccountTable";
import UserTable from "./components/User/Usertable";
import Userdashboard from "./components/User/Userdashboard";
import UserUpdate from "./components/User/UserUpdate";
import RefundTable from "./components/Account/RefundTable";
import UpdateBoaderForm from "./components/Home/UpdateBoaderForm";
import RevenuDetailsTable from "./components/Home/RevenuDetailsTable";
import CheckInBoaderList from "./components/Home/CheckInBoaderList";
import AdvanceBoaderList from "./components/Home/AdvanceBoaderList";
import VacentRoom from "./components/Home/VacantRoom";
import CheckOutForm from "./components/Account/CheckOutform";
import RoomBookingTable from "./components/Home/RoomBookingTable";
import GroupBooking from "./components/Home/GroupBooking";
import BookingConfirmationPage from "./components/Home/BookingConfirmationPage";
import TotalVisitorChart from "./components/User/TotalVisitorChart";
import PaymentForm from "./components/Account/PaymentForm";
import TodayPayment from "./components/Account/TodayPayment";
import RoomStatus from "./components/common/RoomStatus";
import ExtendedDate from "./components/Home/ExtendedDate";
import TotalRenenueCollection from "./components/Admin/TotalRenenueCollection";
import BookingInfo from "./components/Admin/BookingInfo";
import TodayCheckIn from "./components/Admin/TodayCheckIn";
import RevenueCollectionModeChart from "./components/Admin/RevenueCollectionModeChart";
import RevenueModeCollectionTable from "./components/Admin/RevenueModeCollectionTable";
import TotalGstCollection from "./components/Admin/TotalGstCollection";
import Search from "./components/common/Search";
export default function App() {
  const location = useLocation();
  const noSidebarPaths = ["/login", "/bill"];
  const params = new URLSearchParams(location.search);

  const role1 = params.get("role");
  const user = params.get("user");

  useEffect(() => {
    if (role1 && user) {
      localStorage.setItem("role", role1);
      localStorage.setItem("user", user);
    }
  }, [role1, user]);
  const role = localStorage.getItem("role");

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden">
      <div className="fixed inset-0 z-0">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" /> */}
      </div>
      {!noSidebarPaths.includes(location.pathname) && <Sidebar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {role != "admin" ? (
          <>
            <Route path="/userhome" element={<Userdashboard />} />
          </>
        ) : (
          <>
            <Route path="/roomdetails" element={<RoomDetail />} />
            <Route path="/roomcreation" element={<RoomCreationForm />} />
            <Route path="/roomedit" element={<RoomUpdateForm />} />
            <Route path="/roomshow" element={<RoomCreate />} />
            <Route path="/singleroomdetails" element={<SingleRoomDetails />} />
            <Route path="/admindashboard" element={<Dashboard />} />
            <Route path="/user" element={<UserTable />} />
            <Route path="/adduser" element={<UserCreate />} />
            <Route path="/new" element={<New />} />
            <Route path="/accounts" element={<AccountTable />} />
            <Route path="/useredit" element={<UserUpdate />} />
            <Route path="/bookingedit" element={<UpdateBoaderForm />} />
            <Route path="/checkout" element={<CheckOutForm />} />
            <Route path="/bookingconfirmation" element={<BookingConfirmationPage />} />
            <Route path="/groupbooking" element={<GroupBooking />} />
            <Route path="/check" element={<RoomBookingTable />} />
            <Route path="/totalrevenuecollection" element={<TotalRenenueCollection />} />
            <Route path="/totalBooking" element={<BookingInfo />} />
            <Route path="/getAllTodayCheckInBooking" element={<TodayCheckIn />} />
            <Route path="/getRevenueModeCollectionTable" element={<RevenueModeCollectionTable />} />
            <Route path="/totalgstcollection" element={<TotalGstCollection />} />
          </>
        )}
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<AddRoomBookingForm />} />
        <Route path="/room" element={<Room />} />
        <Route path="/bookingdetails" element={<BookingDetails />} />
        <Route path="/refund" element={<RefundTable />} />
        <Route path="/bookingedit" element={<UpdateBoaderForm />} />
        <Route path="/boderdetails" element={<BoderDetailsForm />} />
        {/* <Route path='/webcam' element={<WebcamComponent />} /> */}
        <Route path="/bill" element={<HotelInvoice />} />
        <Route path="/revenuedetails" element={<RevenuDetailsTable />} />
        <Route path="/checkinboaderlist" element={<CheckInBoaderList />} />
        <Route path="/advanceboaderlist" element={<AdvanceBoaderList />} />
        <Route path="/vacantroom" element={<VacentRoom />} />
        <Route path="/checkout" element={<CheckOutForm />} />
        <Route path="/check" element={<RoomBookingTable />} />
        <Route path="/groupbooking" element={<GroupBooking />} />
        <Route path="/bookingconfirmation" element={<BookingConfirmationPage />} />
        <Route path="/visitorchart" element={<TotalVisitorChart />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/getTodayAccountDetails" element={<TodayPayment />} />
        <Route path="/RoomStatus" element={<RoomStatus/>} /> 
        <Route path="/extenddate" element={<ExtendedDate/>} />
        <Route path="/search" element={<Search/>} />
     


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
