// User types
export type UserRole = 'customer' | 'restaurantManager' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  address: Address;
  contact: Contact;
  hours: BusinessHours;
  images: string[];
  rating: number;
  reviews: Review[];
  tables: Table[];
  bookedToday: number;
  approved: boolean;
  managerId: string;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Contact {
  phone: string;
  email: string;
  website?: string;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: boolean;
  openingTime?: string;
  closingTime?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Table {
  id: string;
  size: number;
  name: string;
}

// Booking types
export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  userName: string;
  date: Date;
  time: string;
  partySize: number;
  tableId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

// Search types
export interface SearchParams {
  date: Date;
  time: string;
  partySize: number;
  location?: string;
  cuisine?: string;
}

// Analytics types
export interface BookingAnalytics {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  bookingsByDay: Record<string, number>;
  bookingsByRestaurant: Record<string, number>;
}