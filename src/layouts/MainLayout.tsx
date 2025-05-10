import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);
  
  useEffect(() => {
    // Only make header transparent on homepage
    setIsHeaderTransparent(location.pathname === '/');
    
    const handleScroll = () => {
      if (location.pathname === '/') {
        if (window.scrollY > 80) {
          setIsHeaderTransparent(false);
        } else {
          setIsHeaderTransparent(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header isTransparent={isHeaderTransparent} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;