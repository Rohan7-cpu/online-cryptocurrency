import React from 'react';
import image from '../images/Gocoin-photo.png';

const Nav = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 shadow-md py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt="GoCoin Logo"
            className="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-lg"
          />
          <h1 className="text-3xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
            GO-COIN
          </h1>
        </div>

        {/* Tagline */}
        <div className="mt-2 md:mt-0">
          <p className="text-white font-semibold text-sm md:text-lg animate-marquee">
            Your daily coin investment platform
          </p>
        </div>
      </div>

      {/* Tailwind animation for marquee effect */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 15s linear infinite;
          }
        `}
      </style>
    </nav>
  );
};

export default Nav;
