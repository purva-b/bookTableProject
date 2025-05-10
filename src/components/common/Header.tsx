import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  isTransparent: boolean;
}

const Header: React.FC<HeaderProps> = ({ isTransparent }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getDashboardLink = () => {
    switch (user?.role) {
      case 'restaurantManager':
        return '/manager';
      case 'admin':
        return '/admin';
      default:
        return '/customer/bookings';
    }
  };
  
  const headerClasses = isTransparent
    ? 'fixed w-full top-0 left-0 z-50 transition-all duration-300 bg-transparent'
    : 'fixed w-full top-0 left-0 z-50 transition-all duration-300 bg-white shadow-md';
  
  const linkClasses = isTransparent
    ? 'text-white hover:text-primary-100 transition-colors px-4 py-2'
    : 'text-gray-700 hover:text-primary-600 transition-colors px-4 py-2';
  
  const logoClasses = isTransparent
    ? 'text-white font-bold text-xl'
    : 'text-primary-600 font-bold text-xl';
  
  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-10">
            <Link to="/" className={logoClasses}>
              BookTable
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              <Link to="/" className={linkClasses}>
                Home
              </Link>
              <Link to="/search" className={linkClasses}>
                Find a Table
              </Link>
            </nav>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className={`flex items-center space-x-2 ${
                    isTransparent ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  <span>{user?.firstName}</span>
                  <ChevronDown size={16} />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/customer/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${
                    isTransparent
                      ? 'text-white hover:text-primary-100'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`${
                    isTransparent
                      ? 'bg-white text-primary-600'
                      : 'bg-primary-600 text-white'
                  } px-4 py-2 rounded-md transition-colors hover:bg-opacity-90`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className={isTransparent ? 'text-white' : 'text-gray-700'} />
            ) : (
              <Menu className={isTransparent ? 'text-white' : 'text-gray-700'} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <nav className="flex flex-col py-4 px-4">
            <Link
              to="/"
              className="py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Table
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/customer/bookings"
                  className="py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-left text-gray-700 hover:text-primary-600 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;