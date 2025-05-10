import { create } from 'zustand';
import { User, UserRole } from '../types';
import { mockUsers } from '../mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<User>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string, role: UserRole) => {
    set({ isLoading: true });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data with matching email and role
    const user = mockUsers.find(u => u.email === email && u.role === role);
    
    if (!user) {
      set({ isLoading: false });
      throw new Error('Invalid email or password');
    }
    
    // In a real app, you would validate the password here
    set({ user, isAuthenticated: true, isLoading: false });
    return user;
  },
  
  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      set({ isLoading: false });
      throw new Error('Email already in use');
    }
    
    // Create new user (always as customer)
    const newUser: User = {
      id: `user${mockUsers.length + 1}`,
      email,
      firstName,
      lastName,
      role: 'customer',
      createdAt: new Date(),
    };
    
    // In a real app, you would store the new user in the database
    set({ user: newUser, isAuthenticated: true, isLoading: false });
    return newUser;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));