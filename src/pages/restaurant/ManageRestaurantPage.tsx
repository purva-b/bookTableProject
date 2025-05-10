import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Restaurant } from '../../types';
import { mockRestaurants } from '../../mocks/restaurants';

const ManageRestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading restaurant data
    setIsLoading(true);
    setTimeout(() => {
      if (id === 'new') {
        // Create a new restaurant template
        setRestaurant(null);
      } else {
        // Find restaurant in mock data
        const foundRestaurant = mockRestaurants.find(r => r.id === id);
        setRestaurant(foundRestaurant || null);
      }
      setIsLoading(false);
    }, 800);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Add New Restaurant' : `Manage ${restaurant?.name}`}
        </h1>
        <p className="text-gray-600">
          {id === 'new'
            ? 'Create your restaurant listing and start accepting bookings'
            : 'Update your restaurant information and manage bookings'}
        </p>
      </div>
      
      {id === 'new' ? (
        <NewRestaurantForm />
      ) : restaurant ? (
        <ExistingRestaurantManager restaurant={restaurant} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Restaurant Not Found</h2>
          <p className="text-gray-600">
            The restaurant you're looking for couldn't be found.
          </p>
        </div>
      )}
    </div>
  );
};

const NewRestaurantForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Restaurant Information</h2>
      
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Italian Bistro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine Type
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Italian, Japanese, Mexican"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="€">€ (Inexpensive)</option>
              <option value="€€">€€ (Moderate)</option>
              <option value="€€€">€€€ (Expensive)</option>
              <option value="€€€€">€€€€ (Very Expensive)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., (123) 456-7890"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Description
            </label>
            <textarea
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe your restaurant, cuisine, and unique features"
            ></textarea>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mt-8 mb-6">Address</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 123 Main St"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., San Francisco"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Province
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., CA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal/Zip Code
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 94105"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., USA"
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mt-8 mb-6">Business Hours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-24">
                <span className="text-gray-700">{day}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`open-${day}`}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <label htmlFor={`open-${day}`} className="text-gray-700">
                  Open
                </label>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="time"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-gray-700">to</span>
                <input
                  type="time"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold mt-8 mb-6">Restaurant Images</h2>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload restaurant photos (exterior, interior, food, etc.)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload files</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Save Restaurant
          </button>
        </div>
      </form>
    </div>
  );
};

interface ExistingRestaurantManagerProps {
  restaurant: Restaurant;
}

const ExistingRestaurantManager: React.FC<ExistingRestaurantManagerProps> = ({ restaurant }) => {
  return (
    <Tabs defaultValue="details">
      <TabsList className="mb-6">
        <TabsTrigger value="details">Restaurant Details</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="tables">Tables</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Restaurant Information</h2>
          
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={restaurant.name}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={restaurant.cuisineType}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={restaurant.priceRange}
                >
                  <option value="€">€ (Inexpensive)</option>
                  <option value="€€">€€ (Moderate)</option>
                  <option value="€€€">€€€ (Expensive)</option>
                  <option value="€€€€">€€€€ (Very Expensive)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={restaurant.contact.phone}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Description
                </label>
                <textarea
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={restaurant.description}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                type="button"
                className="mr-4 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 border border-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </TabsContent>
      
      <TabsContent value="bookings">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Bookings</h2>
          <p className="text-gray-600">Manage your restaurant's bookings and reservations</p>
          
          {/* Bookings table would go here */}
          <p className="text-center text-gray-500 py-8">No bookings found for this restaurant</p>
        </div>
      </TabsContent>
      
      <TabsContent value="tables">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Tables</h2>
          <p className="text-gray-600 mb-6">Manage your restaurant's tables and seating arrangements</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurant.tables.map((table) => (
                  <tr key={table.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {table.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {table.size} people
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-primary-600 hover:text-primary-700 mr-4">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Add New Table
            </button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="reviews">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Reviews</h2>
          <p className="text-gray-600 mb-6">View and respond to customer reviews</p>
          
          {restaurant.reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No reviews yet for this restaurant</p>
          ) : (
            <div className="space-y-6">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{review.userName}</h3>
                      <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;