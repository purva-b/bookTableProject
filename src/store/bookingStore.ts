import { create } from 'zustand';
import { Booking } from '../types';
import { mockBookings } from '../mocks/bookings';

interface BookingState {
  bookings: Booking[];
  userBookings: Booking[];
  restaurantBookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  
  fetchUserBookings: (userId: string) => Promise<Booking[]>;
  fetchRestaurantBookings: (restaurantId: string) => Promise<Booking[]>;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  getBookingAnalytics: () => Promise<{
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    bookingsByDay: Record<string, number>;
    bookingsByRestaurant: Record<string, number>;
  }>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  userBookings: [],
  restaurantBookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  
  fetchUserBookings: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter bookings by user ID
      const userBookings = mockBookings.filter(b => b.userId === userId);
      
      set({ userBookings, isLoading: false });
      return userBookings;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch user bookings' });
      throw error;
    }
  },
  
  fetchRestaurantBookings: async (restaurantId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter bookings by restaurant ID
      const restaurantBookings = mockBookings.filter(b => b.restaurantId === restaurantId);
      
      set({ restaurantBookings, isLoading: false });
      return restaurantBookings;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch restaurant bookings' });
      throw error;
    }
  },
  
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Create new booking
      const newBooking: Booking = {
        ...bookingData,
        id: `booking${mockBookings.length + 1}`,
        createdAt: new Date(),
      };
      
      // In a real app, you would store the new booking in the database
      // and send a confirmation email
      
      set({ isLoading: false });
      
      // Update user bookings if this is for the current user
      const userBookings = get().userBookings;
      if (userBookings.length > 0 && userBookings[0].userId === bookingData.userId) {
        set({ userBookings: [...userBookings, newBooking] });
      }
      
      return newBooking;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create booking' });
      throw error;
    }
  },
  
  cancelBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would update the booking status in the database
      
      // Update booking status in local state
      const userBookings = get().userBookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
      );
      
      set({ userBookings, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to cancel booking' });
      throw error;
    }
  },
  
  getBookingAnalytics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate analytics from mock data
      const totalBookings = mockBookings.length;
      const confirmedBookings = mockBookings.filter(b => b.status === 'confirmed').length;
      const cancelledBookings = mockBookings.filter(b => b.status === 'cancelled').length;
      const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
      
      // Bookings by day
      const bookingsByDay: Record<string, number> = {};
      mockBookings.forEach(booking => {
        const dateStr = booking.date.toISOString().split('T')[0];
        bookingsByDay[dateStr] = (bookingsByDay[dateStr] || 0) + 1;
      });
      
      // Bookings by restaurant
      const bookingsByRestaurant: Record<string, number> = {};
      mockBookings.forEach(booking => {
        bookingsByRestaurant[booking.restaurantName] = (bookingsByRestaurant[booking.restaurantName] || 0) + 1;
      });
      
      set({ isLoading: false });
      
      return {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        bookingsByDay,
        bookingsByRestaurant,
      };
    } catch (error) {
      set({ isLoading: false, error: 'Failed to get booking analytics' });
      throw error;
    }
  },
}));