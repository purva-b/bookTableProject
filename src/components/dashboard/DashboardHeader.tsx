import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ChevronDown } from 'lucide-react';
import { User as UserType } from '../../types';

interface DashboardHeaderProps {
  user: UserType;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-gray-500 text-xs capitalize">{user.role}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Website
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;