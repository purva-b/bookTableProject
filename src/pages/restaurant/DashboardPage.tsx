import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, TrendingUp, Star, Users } from 'lucide-react';
import { useRestaurantStore } from '../../store/restaurantStore';
import { useAuthStore } from '../../store/authStore';
import { mockRestaurants } from '../../mocks/restaurants';

const RestaurantDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  
  // Get restaurants managed by the current user
  const userRestaurants = mockRestaurants.filter(r => r.managerId === user?.id);
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
          <p className="text-gray-600">Manage your restaurant and bookings</p>
        </div>
        
        {userRestaurants.length === 0 && (
          <Link
            to="/manager/restaurant/new"
            className="mt-4 md:mt-0 inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={18} className="mr-2" />
            <span>Add Restaurant</span>
          </Link>
        )}
      </div>
      
      {userRestaurants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Restaurants Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't added any restaurants to your account yet. Start by adding your first restaurant.
          </p>
          <Link
            to="/manager/restaurant/new"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            <Plus size={18} className="mr-2" />
            <span>Add Your Restaurant</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 text-sm">Total Bookings</h2>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold">28</span>
                <span className="ml-2 text-sm text-green-600">+12% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 text-sm">Revenue</h2>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold">€2,450</span>
                <span className="ml-2 text-sm text-green-600">+8% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 text-sm">Avg. Rating</h2>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold">4.8</span>
                <span className="ml-2 text-sm text-green-600">+0.2 from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 text-sm">Customers</h2>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-purple-600" />
                </div>
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold">124</span>
                <span className="ml-2 text-sm text-green-600">+18% from last month</span>
              </div>
            </div>
          </div>
          
          {/* Restaurant Cards */}
          <h2 className="text-xl font-semibold mb-4">Your Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${restaurant.images[0]})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4">{restaurant.cuisineType} • {restaurant.priceRange}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star size={18} className="text-yellow-500 mr-1" />
                      <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm ml-1">({restaurant.reviews.length} reviews)</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {restaurant.bookedToday} bookings today
                    </div>
                  </div>
                  
                  <Link
                    to={`/manager/restaurant/${restaurant.id}`}
                    className="w-full block text-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Manage Restaurant
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantDashboardPage;