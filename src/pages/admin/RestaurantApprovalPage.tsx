import React, { useEffect, useState } from 'react';
import { useRestaurantStore } from '../../store/restaurantStore';
import { Restaurant } from '../../types';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';

const RestaurantApprovalPage: React.FC = () => {
  const { restaurants, fetchRestaurants, approveRestaurant, removeRestaurant, isLoading } = useRestaurantStore();
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadRestaurants = async () => {
      if (restaurants.length === 0) {
        await fetchRestaurants();
      }
      
      // Filter pending restaurants (not approved)
      const pending = restaurants.filter(r => !r.approved);
      setPendingRestaurants(pending);
    };
    
    loadRestaurants();
  }, [restaurants, fetchRestaurants]);
  
  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveRestaurant(id);
      setPendingRestaurants(pendingRestaurants.filter(r => r.id !== id));
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await removeRestaurant(id);
      setPendingRestaurants(pendingRestaurants.filter(r => r.id !== id));
    } finally {
      setProcessingId(null);
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Restaurant Approval</h1>
          <p className="text-gray-600">Review and approve new restaurant listings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md animate-pulse">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          <div className="p-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-40"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Restaurant Approval</h1>
        <p className="text-gray-600">Review and approve new restaurant listings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Pending Approval ({pendingRestaurants.length})</h2>
        </div>
        
        {pendingRestaurants.length === 0 ? (
          <div className="p-6 text-center">
            <Clock size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No pending restaurants</h3>
            <p className="text-gray-600">All restaurant submissions have been reviewed</p>
          </div>
        ) : (
          <div className="p-6">
            {pendingRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                    <p className="text-gray-600">{restaurant.cuisineType} • {restaurant.priceRange}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {restaurant.address.city}, {restaurant.address.state} • Submitted on {new Date(restaurant.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => window.open(`/restaurants/${restaurant.id}`, '_blank')}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <Eye size={16} className="mr-2" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={() => handleApprove(restaurant.id)}
                      disabled={processingId === restaurant.id}
                      className="flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      <span>{processingId === restaurant.id ? 'Processing...' : 'Approve'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleReject(restaurant.id)}
                      disabled={processingId === restaurant.id}
                      className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <XCircle size={16} className="mr-2" />
                      <span>{processingId === restaurant.id ? 'Processing...' : 'Reject'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantApprovalPage;