import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, CalendarCheck, MapPin, User, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookingStore } from '../../store/bookingStore';
import { Booking } from '../../types';

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userBookings } = useBookingStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  
  useEffect(() => {
    if (id && userBookings.length > 0) {
      const foundBooking = userBookings.find(b => b.id === id);
      if (foundBooking) {
        setBooking(foundBooking);
      }
    }
  }, [id, userBookings]);
  
  if (!booking) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/2 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded mb-6 w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  const formatBookingTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your reservation has been successfully booked. A confirmation email has been sent to your email address.
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{booking.restaurantName}</h2>
            <span className="text-sm bg-green-100 text-green-700 py-1 px-2 rounded-full font-medium">
              Confirmed
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <CalendarCheck size={20} className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-gray-700 font-medium">
                  {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-gray-600">{formatBookingTime(booking.time)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <User size={20} className="text-gray-500 mr-3 flex-shrink-0" />
              <p className="text-gray-700">
                {booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}
              </p>
            </div>
            
            <div className="flex items-center">
              <MapPin size={20} className="text-gray-500 mr-3 flex-shrink-0" />
              <p className="text-gray-700">
                Table #{booking.tableId.replace('t', '')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <p>Reservation #{booking.id.slice(-6)}</p>
          <p>Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}</p>
        </div>
        
        <div className="flex space-x-4">
          <Link
            to="/customer/bookings"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
          >
            View My Bookings
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>Home</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmationPage;