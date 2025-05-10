import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search');
  };
  
  return (
    <div className="relative h-[600px] md:h-[700px] bg-cover bg-center" style={{ 
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg)' 
    }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Discover and Book the Best Restaurants
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Find your perfect dining experience from thousands of restaurants across the city
          </p>
          
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Location, Restaurant, or Cuisine"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="w-full md:w-auto">
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                >
                  <Search size={20} className="mr-2" />
                  <span>Find Tables</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="#F9FAFB"
            fillOpacity="1"
            d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,48C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;