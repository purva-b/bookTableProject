import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuthStore } from '../store/authStore';

const DashboardLayout: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) {
    return null; // This should be handled by the route guard, but just in case
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;