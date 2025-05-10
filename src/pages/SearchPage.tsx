import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import SearchForm from '../components/search/SearchForm';
import RestaurantCard from '../components/search/RestaurantCard';
import { SearchParams } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filteredRestaurants, searchRestaurants, isLoading } = useRestaurantStore();
  
  const [searchCriteria, setSearchCriteria] = useState<SearchParams>({
    date: new Date(),
    time: '19:00',
    partySize: 2,
    location: '',
  });
  
  // Initialize search parameters from URL query
  useEffect(() => {
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    const partySizeParam = searchParams.get('party');
    const locationParam = searchParams.get('location');
    const cuisineParam = searchParams.get('cuisine');
    
    const initialParams: SearchParams = {
      date: dateParam ? new Date(dateParam) : new Date(),
      time: timeParam || '19:00',
      partySize: partySizeParam ? parseInt(partySizeParam) : 2,
      location: locationParam || undefined,
      cuisine: cuisineParam || undefined,
    };
    
    setSearchCriteria(initialParams);
    
    // Perform initial search
    searchRestaurants(initialParams);
  }, [searchParams, searchRestaurants]);
  
  const handleSearch = (params: SearchParams) => {
    // Update URL query parameters
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('date', format(params.date, 'yyyy-MM-dd'));
    newSearchParams.set('time', params.time);
    newSearchParams.set('party', params.partySize.toString());
    if (params.location) newSearchParams.set('location', params.location);
    if (params.cuisine) newSearchParams.set('cuisine', params.cuisine);
    
    setSearchParams(newSearchParams);
    
    // Update search criteria state
    setSearchCriteria(params);
    
    // Perform search
    searchRestaurants(params);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find a Table</h1>
          <SearchForm onSearch={handleSearch} initialParams={searchCriteria} />
        </div>
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {isLoading
              ? 'Searching for available restaurants...'
              : filteredRestaurants.length === 0
              ? 'No restaurants found for your search criteria'
              : `${filteredRestaurants.length} Available Restaurants`}
          </h2>
          
          {!isLoading && filteredRestaurants.length > 0 && (
            <p className="text-gray-600">
              For {format(searchCriteria.date, 'EEEE, MMMM d')} at{' '}
              {(() => {
                const [hour, minute] = searchCriteria.time.split(':').map(Number);
                const displayHour = hour > 12 ? hour - 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
              })()}{' '}
              • {searchCriteria.partySize} {searchCriteria.partySize === 1 ? 'person' : 'people'}
            </p>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md p-4">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 rounded"></div>
                  <div className="md:w-2/3 p-4">
                    <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No restaurants available</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or selecting a different date/time.
            </p>
            <p className="text-gray-600">
              You can also browse our featured restaurants to find other options.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                date={searchCriteria.date}
                time={searchCriteria.time}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;