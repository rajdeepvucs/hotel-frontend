import React from 'react'
import { motion } from "framer-motion";

import Header from '../common/Header'
import BookingDetailsTable from './BookingDetailsTable';
function Home() {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
    <Header title='CheckIn Details' />

    <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
      
<BookingDetailsTable/>

       
    </main>
</div>
  )
}

export default Home