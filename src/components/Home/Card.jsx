import React from 'react';
import Header from '../common/Header';

const Card = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Bill Invoice' />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='flex flex-col justify-center items-center'>
          <div className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              {/* Placeholder for the card's content */}
              <h2 className="text-lg font-semibold">Card Title</h2>
            </div>
            <div className="absolute inset-0 bg-cover bg-center transform translate-y-0 hover:translate-y-0 transition-transform duration-300 ease-in-out"
              style={{ backgroundImage: 'url(https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600)' }}>
              <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center text-white translate-y-full hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <h3 className="text-lg font-bold">Additional Info</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Card;
