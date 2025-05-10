import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Customer pages
import BookingsPage from './pages/customer/BookingsPage';
import BookingConfirmationPage from './pages/customer/BookingConfirmationPage';

// Restaurant Manager pages
import RestaurantDashboardPage from './pages/restaurant/DashboardPage';
import ManageRestaurantPage from './pages/restaurant/ManageRestaurantPage';

// Admin pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import RestaurantApprovalPage from './pages/admin/RestaurantApprovalPage';

// Route guards
const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'restaurantManager') return <Navigate to="/login" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Customer routes */}
        <Route path="/customer" element={
          <CustomerRoute>
            <MainLayout />
          </CustomerRoute>
        }>
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="booking-confirmation/:id" element={<BookingConfirmationPage />} />
        </Route>
        
        {/* Restaurant Manager routes */}
        <Route path="/manager" element={
          <ManagerRoute>
            <DashboardLayout />
          </ManagerRoute>
        }>
          <Route index element={<RestaurantDashboardPage />} />
          <Route path="restaurant/:id" element={<ManageRestaurantPage />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="restaurant-approval" element={<RestaurantApprovalPage />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;