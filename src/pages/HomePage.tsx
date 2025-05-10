import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedRestaurants from '../components/home/FeaturedRestaurants';
import HowItWorks from '../components/home/HowItWorks';
import { useRestaurantStore } from '../store/restaurantStore';

const HomePage: React.FC = () => {
  const { fetchRestaurants } = useRestaurantStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Pre-fetch restaurants data
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedRestaurants />
      <HowItWorks />
      
      {/* Additional section: Join BookTable */}
      <div className="py-16 px-4 bg-primary-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Are you a restaurant owner?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join BookTable and start accepting online reservations from thousands of diners
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
          >
            Partner with us
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;