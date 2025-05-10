import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Coffee, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const user = await login(email, password, selectedRole);
      
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'restaurantManager':
          navigate('/manager');
          break;
        default:
          navigate(from);
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  
  // Demo login data
  const demoCredentials: Record<UserRole, { email: string; name: string }> = {
    customer: { email: 'john@example.com', name: 'John Doe' },
    restaurantManager: { email: 'mario@bellaitalia.com', name: 'Mario Rossi' },
    admin: { email: 'admin@booktable.com', name: 'Admin User' },
  };
  
  const handleQuickLogin = async (role: UserRole) => {
    setEmail(demoCredentials[role].email);
    setPassword('password');
    setSelectedRole(role);
    
    try {
      const user = await login(demoCredentials[role].email, 'password', role);
      
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'restaurantManager':
          navigate('/manager');
          break;
        default:
          navigate(from);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sign In to BookTable</h1>
          <p className="text-gray-600">Welcome back! Please enter your details</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'customer'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <User className="mb-2" size={24} />
              <span className="text-sm font-medium">Customer</span>
            </button>
            
            <button
              onClick={() => setSelectedRole('restaurantManager')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'restaurantManager'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <Coffee className="mb-2" size={24} />
              <span className="text-sm font-medium">Restaurant</span>
            </button>
            
            <button
              onClick={() => setSelectedRole('admin')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'admin'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <ShieldCheck className="mb-2" size={24} />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="********"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-center text-gray-600 mb-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700">
              Sign Up
            </Link>
          </p>
          
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 mb-3">For demo purposes:</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(demoCredentials) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleQuickLogin(role)}
                  className="text-xs py-2 px-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {demoCredentials[role].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;