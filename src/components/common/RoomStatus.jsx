import React from "react";

import Header from "./Header";
import RoomStatusTable from "./RoomStatusTable";

const RoomStatus = () => {


  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Booking Calendar" />

      <main className="max-w-7xl mx-auto py-6 px-2 lg:px-8 bg-white">
       <RoomStatusTable />
      </main>
    </div>
  );
};

export default RoomStatus;
