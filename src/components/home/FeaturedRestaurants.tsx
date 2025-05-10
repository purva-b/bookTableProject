import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRestaurantStore } from '../../store/restaurantStore';
import { Restaurant } from '../../types';

const FeaturedRestaurants: React.FC = () => {
  const { restaurants, fetchRestaurants, isLoading } = useRestaurantStore();
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  
  useEffect(() => {
    const loadRestaurants = async () => {
      if (restaurants.length === 0) {
        await fetchRestaurants();
      }
      
      // For featured, we'll take the top 4 by rating
      const featured = [...restaurants]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      
      setFeaturedRestaurants(featured);
    };
    
    loadRestaurants();
  }, [restaurants, fetchRestaurants]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  if (isLoading) {
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Featured Restaurants</h2>
            <p className="text-gray-600">Loading featured restaurants...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Featured Restaurants</h2>
          <p className="text-gray-600">Discover our selection of the best restaurants in town</p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {featuredRestaurants.map((restaurant) => (
            <motion.div 
              key={restaurant.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              variants={item}
            >
              <Link to={`/restaurants/${restaurant.id}`}>
                <div className="h-48 overflow-hidden">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.cuisineType} • {restaurant.priceRange}</p>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-500 mr-2">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-sm text-gray-700">{restaurant.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">({restaurant.reviews.length} reviews)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span>{restaurant.address.city}, {restaurant.address.state}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <CalendarCheck size={16} className="mr-1" />
                    <span>{restaurant.bookedToday} booked today</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-8">
          <Link
            to="/search"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            View All Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedRestaurants;