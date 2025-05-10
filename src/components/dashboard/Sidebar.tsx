import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Settings, 
  Users, 
  ShieldCheck, 
  BarChart, 
  LogOut,
  Coffee
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navLinkClasses = (path: string) => 
    `flex items-center space-x-3 py-3 px-4 rounded-md ${
      isActive(path)
        ? 'bg-primary-500 text-white'
        : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
    }`;
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto hide-scrollbar h-screen">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <Coffee size={24} className="text-primary-600" />
          <span className="text-xl font-bold text-primary-600">BookTable</span>
        </Link>
      </div>
      
      <div className="p-4">
        <nav className="space-y-1">
          {userRole === 'restaurantManager' && (
            <>
              <Link to="/manager" className={navLinkClasses('/manager')}>
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/manager/restaurant/new" className={navLinkClasses('/manager/restaurant/new')}>
                <Coffee size={20} />
                <span>My Restaurant</span>
              </Link>
              <Link to="/manager/bookings" className={navLinkClasses('/manager/bookings')}>
                <Calendar size={20} />
                <span>Bookings</span>
              </Link>
              <Link to="/manager/settings" className={navLinkClasses('/manager/settings')}>
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </>
          )}
          
          {userRole === 'admin' && (
            <>
              <Link to="/admin" className={navLinkClasses('/admin')}>
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/admin/restaurant-approval" className={navLinkClasses('/admin/restaurant-approval')}>
                <ShieldCheck size={20} />
                <span>Restaurant Approval</span>
              </Link>
              <Link to="/admin/users" className={navLinkClasses('/admin/users')}>
                <Users size={20} />
                <span>Users</span>
              </Link>
              <Link to="/admin/analytics" className={navLinkClasses('/admin/analytics')}>
                <BarChart size={20} />
                <span>Analytics</span>
              </Link>
              <Link to="/admin/settings" className={navLinkClasses('/admin/settings')}>
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </>
          )}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button
          onClick={() => logout()}
          className="flex items-center space-x-3 py-2 px-4 w-full text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;