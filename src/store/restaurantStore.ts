import { create } from 'zustand';
import { Restaurant, SearchParams } from '../types';
import { mockRestaurants } from '../mocks/restaurants';

interface RestaurantState {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  
  fetchRestaurants: () => Promise<Restaurant[]>;
  fetchRestaurantById: (id: string) => Promise<Restaurant>;
  searchRestaurants: (params: SearchParams) => Promise<Restaurant[]>;
  
  // Restaurant Manager actions
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'approved' | 'bookedToday' | 'reviews'>) => Promise<Restaurant>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<Restaurant>;
  
  // Admin actions
  approveRestaurant: (id: string) => Promise<Restaurant>;
  removeRestaurant: (id: string) => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  filteredRestaurants: [],
  selectedRestaurant: null,
  isLoading: false,
  error: null,
  
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get restaurants from mock data
      const restaurants = mockRestaurants.filter(r => r.approved);
      
      set({ restaurants, filteredRestaurants: restaurants, isLoading: false });
      return restaurants;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch restaurants' });
      throw error;
    }
  },
  
  fetchRestaurantById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find restaurant in mock data
      const restaurant = mockRestaurants.find(r => r.id === id);
      
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      set({ selectedRestaurant: restaurant, isLoading: false });
      return restaurant;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch restaurant' });
      throw error;
    }
  },
  
  searchRestaurants: async (params: SearchParams) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter restaurants based on search parameters
      const { date, time, partySize, location, cuisine } = params;
      
      // Convert time to hours for comparison
      const searchHour = parseInt(time.split(':')[0], 10);
      
      // Get the day of the week
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayOfWeek = daysOfWeek[date.getDay()] as keyof Restaurant['hours'];
      
      // Filter restaurants
      let filtered = mockRestaurants.filter(restaurant => {
        // Check if restaurant is approved
        if (!restaurant.approved) return false;
        
        // Check if restaurant is open on the selected day
        const hours = restaurant.hours[dayOfWeek];
        if (!hours.open) return false;
        
        // Check if restaurant is open at the selected time (within 30 minutes)
        if (hours.openingTime && hours.closingTime) {
          const openHour = parseInt(hours.openingTime.split(':')[0], 10);
          const closeHour = parseInt(hours.closingTime.split(':')[0], 10);
          
          if (searchHour < openHour - 0.5 || searchHour > closeHour + 0.5) {
            return false;
          }
        }
        
        // Check if restaurant has a table that can accommodate the party size
        const hasTable = restaurant.tables.some(table => table.size >= partySize);
        if (!hasTable) return false;
        
        // Check location if provided
        if (location) {
          const locationLower = location.toLowerCase();
          const cityMatch = restaurant.address.city.toLowerCase().includes(locationLower);
          const stateMatch = restaurant.address.state.toLowerCase().includes(locationLower);
          const zipMatch = restaurant.address.zipCode.includes(location);
          
          if (!cityMatch && !stateMatch && !zipMatch) {
            return false;
          }
        }
        
        // Check cuisine if provided
        if (cuisine && restaurant.cuisineType.toLowerCase() !== cuisine.toLowerCase()) {
          return false;
        }
        
        return true;
      });
      
      set({ filteredRestaurants: filtered, isLoading: false });
      return filtered;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to search restaurants' });
      throw error;
    }
  },
  
  addRestaurant: async (restaurantData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Create new restaurant
      const newRestaurant: Restaurant = {
        ...restaurantData,
        id: `restaurant${mockRestaurants.length + 1}`,
        reviews: [],
        bookedToday: 0,
        approved: false,
        createdAt: new Date(),
      };
      
      // In a real app, you would store the new restaurant in the database
      set({ isLoading: false });
      return newRestaurant;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to add restaurant' });
      throw error;
    }
  },
  
  updateRestaurant: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find restaurant in mock data
      const restaurantIndex = mockRestaurants.findIndex(r => r.id === id);
      
      if (restaurantIndex === -1) {
        throw new Error('Restaurant not found');
      }
      
      // Update restaurant
      const updatedRestaurant = { ...mockRestaurants[restaurantIndex], ...updates };
      
      // In a real app, you would update the restaurant in the database
      set({ isLoading: false });
      
      // If this is the selected restaurant, update it
      if (get().selectedRestaurant?.id === id) {
        set({ selectedRestaurant: updatedRestaurant });
      }
      
      return updatedRestaurant;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update restaurant' });
      throw error;
    }
  },
  
  approveRestaurant: async (id) => {
    return get().updateRestaurant(id, { approved: true });
  },
  
  removeRestaurant: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would remove the restaurant from the database
      set({ isLoading: false });
      
      // If this is the selected restaurant, clear it
      if (get().selectedRestaurant?.id === id) {
        set({ selectedRestaurant: null });
      }
    } catch (error) {
      set({ isLoading: false, error: 'Failed to remove restaurant' });
      throw error;
    }
  }
}));