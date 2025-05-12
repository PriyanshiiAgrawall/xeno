'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-6 py-12 text-center">

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 animate-fadeIn">
        Power Your Growth with <span className="text-blue-800">ConnectCRM</span>
      </h1>

  
      <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl animate-fadeIn delay-200">
        Manage your customers, campaigns, and communication—all in one place.
      </p>

    
      <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fadeIn delay-300">
        <a
          href="/customer"
          className="px-8 py-4 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </a>
       
      </div>
    </div>
  );
}
