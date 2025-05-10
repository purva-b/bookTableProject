import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarCheck, MapPin, X, Check, User, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { Booking } from '../../types';

const BookingsPage: React.FC = () => {
  const { userBookings, fetchUserBookings, cancelBooking, isLoading } = useBookingStore();
  const { user } = useAuthStore();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchUserBookings(user.id);
    }
  }, [user, fetchUserBookings]);
  
  const handleCancelBooking = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelBooking(id);
    } finally {
      setCancellingId(null);
    }
  };
  
  const formatBookingTime = (date: Date, time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };
  
  const groupBookingsByStatus = () => {
    const upcoming = userBookings.filter(b => b.status === 'confirmed');
    const completed = userBookings.filter(b => b.status === 'completed');
    const cancelled = userBookings.filter(b => b.status === 'cancelled');
    
    return { upcoming, completed, cancelled };
  };
  
  const { upcoming, completed, cancelled } = groupBookingsByStatus();
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="mb-4 pb-4 border-b border-gray-200">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : userBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Coffee size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No Bookings Yet</h2>
              <p className="text-gray-600 mb-6">You haven't made any restaurant reservations yet.</p>
              <Link
                to="/search"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Find a Restaurant
              </Link>
            </div>
          ) : (
            <>
              {/* Upcoming Bookings */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Upcoming Reservations</h2>
                {upcoming.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">You don't have any upcoming reservations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcoming.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/4 bg-primary-50 p-6 flex flex-col justify-center items-center text-center">
                            <p className="text-primary-700 font-bold text-xl">
                              {format(new Date(booking.date), 'EEE')}
                            </p>
                            <p className="text-3xl font-bold text-gray-800">
                              {format(new Date(booking.date), 'd')}
                            </p>
                            <p className="text-gray-600 font-medium">
                              {format(new Date(booking.date), 'MMM yyyy')}
                            </p>
                            <p className="mt-2 text-gray-800 font-medium">
                              {formatBookingTime(new Date(booking.date), booking.time)}
                            </p>
                          </div>
                          
                          <div className="p-6 md:w-3/4 flex flex-col justify-between">
                            <div>
                              <Link to={`/restaurants/${booking.restaurantId}`}>
                                <h3 className="text-xl font-semibold mb-2 hover:text-primary-600 transition-colors">
                                  {booking.restaurantName}
                                </h3>
                              </Link>
                              
                              <div className="flex items-center text-gray-600 text-sm mb-4">
                                <User size={16} className="mr-1" />
                                <span>{booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}</span>
                              </div>
                              
                              <div className="flex items-start space-x-6">
                                <div className="flex items-center text-gray-600 text-sm">
                                  <CalendarCheck size={16} className="mr-1" />
                                  <span>Reservation #{booking.id.slice(-6)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
                              >
                                {cancellingId === booking.id ? (
                                  <span>Cancelling...</span>
                                ) : (
                                  <>
                                    <X size={16} className="mr-1" />
                                    <span>Cancel Reservation</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Past Bookings */}
              {completed.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Past Reservations</h2>
                  <div className="space-y-4">
                    {completed.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/4 bg-gray-100 p-6 flex flex-col justify-center items-center text-center">
                            <p className="text-gray-700 font-bold text-xl">
                              {format(new Date(booking.date), 'EEE')}
                            </p>
                            <p className="text-3xl font-bold text-gray-800">
                              {format(new Date(booking.date), 'd')}
                            </p>
                            <p className="text-gray-600 font-medium">
                              {format(new Date(booking.date), 'MMM yyyy')}
                            </p>
                            <p className="mt-2 text-gray-800 font-medium">
                              {formatBookingTime(new Date(booking.date), booking.time)}
                            </p>
                          </div>
                          
                          <div className="p-6 md:w-3/4">
                            <div className="flex items-center justify-between mb-3">
                              <Link to={`/restaurants/${booking.restaurantId}`}>
                                <h3 className="text-xl font-semibold hover:text-primary-600 transition-colors">
                                  {booking.restaurantName}
                                </h3>
                              </Link>
                              
                              <div className="flex items-center text-green-600">
                                <Check size={16} className="mr-1" />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-gray-600 text-sm mb-4">
                              <User size={16} className="mr-1" />
                              <span>{booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}</span>
                            </div>
                            
                            <div className="flex items-start space-x-6">
                              <div className="flex items-center text-gray-600 text-sm">
                                <CalendarCheck size={16} className="mr-1" />
                                <span>Reservation #{booking.id.slice(-6)}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Link
                                to={`/restaurants/${booking.restaurantId}`}
                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                              >
                                Book Again
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Cancelled Bookings */}
              {cancelled.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Cancelled Reservations</h2>
                  <div className="space-y-4">
                    {cancelled.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden opacity-75"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/4 bg-gray-100 p-6 flex flex-col justify-center items-center text-center">
                            <p className="text-gray-700 font-bold text-xl">
                              {format(new Date(booking.date), 'EEE')}
                            </p>
                            <p className="text-3xl font-bold text-gray-800">
                              {format(new Date(booking.date), 'd')}
                            </p>
                            <p className="text-gray-600 font-medium">
                              {format(new Date(booking.date), 'MMM yyyy')}
                            </p>
                            <p className="mt-2 text-gray-800 font-medium">
                              {formatBookingTime(new Date(booking.date), booking.time)}
                            </p>
                          </div>
                          
                          <div className="p-6 md:w-3/4">
                            <div className="flex items-center justify-between mb-3">
                              <Link to={`/restaurants/${booking.restaurantId}`}>
                                <h3 className="text-xl font-semibold hover:text-primary-600 transition-colors">
                                  {booking.restaurantName}
                                </h3>
                              </Link>
                              
                              <div className="flex items-center text-red-600">
                                <X size={16} className="mr-1" />
                                <span className="text-sm font-medium">Cancelled</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-gray-600 text-sm mb-4">
                              <User size={16} className="mr-1" />
                              <span>{booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}</span>
                            </div>
                            
                            <div className="flex items-start space-x-6">
                              <div className="flex items-center text-gray-600 text-sm">
                                <CalendarCheck size={16} className="mr-1" />
                                <span>Reservation #{booking.id.slice(-6)}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Link
                                to={`/restaurants/${booking.restaurantId}`}
                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                              >
                                Book Again
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingsPage;