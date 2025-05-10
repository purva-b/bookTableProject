import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Star, MapPin, Clock, Phone, Mail, Globe, Calendar, Users, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRestaurantStore } from '../store/restaurantStore';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { Restaurant, Review, Booking } from '../types';

const RestaurantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { selectedRestaurant, fetchRestaurantById, isLoading: isLoadingRestaurant } = useRestaurantStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createBooking, isLoading: isLoadingBooking } = useBookingStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('19:00');
  const [selectedPartySize, setSelectedPartySize] = useState<number>(2);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  useEffect(() => {
    if (id) {
      fetchRestaurantById(id);
    }
    
    // Get search params
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    const partySizeParam = searchParams.get('party');
    
    if (dateParam) {
      setSelectedDate(new Date(dateParam));
    }
    
    if (timeParam) {
      setSelectedTime(timeParam);
    }
    
    if (partySizeParam) {
      setSelectedPartySize(parseInt(partySizeParam));
    }
  }, [id, fetchRestaurantById, searchParams]);
  
  // Generate available times
  useEffect(() => {
    if (!selectedRestaurant) return;
    
    // Get day of week
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = daysOfWeek[selectedDate.getDay()] as keyof Restaurant['hours'];
    
    // Get hours for the selected day
    const hours = selectedRestaurant.hours[dayOfWeek];
    
    if (!hours.open || !hours.openingTime || !hours.closingTime) {
      setAvailableTimes([]);
      return;
    }
    
    // Parse opening and closing times
    const [openHour, openMinute] = hours.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = hours.closingTime.split(':').map(Number);
    
    // Generate available times in 30-minute increments
    const times: string[] = [];
    for (let h = openHour; h < closeHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        // Skip if this is the opening hour and the minutes are before opening minutes
        if (h === openHour && m < openMinute) continue;
        
        // Skip if this is the closing hour and the minutes are after closing minutes
        if (h === closeHour - 1 && m > closeMinute) continue;
        
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    
    setAvailableTimes(times);
  }, [selectedRestaurant, selectedDate]);
  
  const handleBooking = async (time: string) => {
    if (!isAuthenticated || !user || !selectedRestaurant) {
      navigate('/login');
      return;
    }
    
    try {
      // Create a booking
      const booking: Omit<Booking, 'id' | 'createdAt'> = {
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        date: selectedDate,
        time,
        partySize: selectedPartySize,
        tableId: selectedRestaurant.tables[0].id, // In a real app, you'd select an appropriate table
        status: 'confirmed',
      };
      
      const newBooking = await createBooking(booking);
      
      // Navigate to confirmation page
      navigate(`/customer/booking-confirmation/${newBooking.id}`);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };
  
  if (isLoadingRestaurant || !selectedRestaurant) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Sort reviews by date (most recent first)
  const sortedReviews = [...selectedRestaurant.reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      {/* Restaurant header with main image */}
      <div
        className="h-64 md:h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${selectedRestaurant.images[0]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto h-full flex items-end">
          <div className="text-white p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedRestaurant.name}</h1>
            <div className="flex items-center mb-2">
              <div className="flex items-center text-yellow-400 mr-3">
                <Star size={20} className="fill-current" />
                <span className="ml-1 text-white font-medium">{selectedRestaurant.rating.toFixed(1)}</span>
              </div>
              <span className="text-white">({selectedRestaurant.reviews.length} reviews)</span>
              <span className="mx-3">•</span>
              <span>{selectedRestaurant.cuisineType}</span>
              <span className="mx-3">•</span>
              <span>{selectedRestaurant.priceRange}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl px-4">
        <div className="bg-white rounded-lg shadow-md -mt-8 relative z-10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column: Restaurant details */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 mb-6">{selectedRestaurant.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin size={20} className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-gray-600">
                        {selectedRestaurant.address.street}<br />
                        {selectedRestaurant.address.city}, {selectedRestaurant.address.state} {selectedRestaurant.address.zipCode}<br />
                        {selectedRestaurant.address.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={20} className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <ul className="text-gray-600 text-sm">
                        <li>Mon: {selectedRestaurant.hours.monday.open ? `${selectedRestaurant.hours.monday.openingTime} - ${selectedRestaurant.hours.monday.closingTime}` : 'Closed'}</li>
                        <li>Tue: {selectedRestaurant.hours.tuesday.open ? `${selectedRestaurant.hours.tuesday.openingTime} - ${selectedRestaurant.hours.tuesday.closingTime}` : 'Closed'}</li>
                        <li>Wed: {selectedRestaurant.hours.wednesday.open ? `${selectedRestaurant.hours.wednesday.openingTime} - ${selectedRestaurant.hours.wednesday.closingTime}` : 'Closed'}</li>
                        <li>Thu: {selectedRestaurant.hours.thursday.open ? `${selectedRestaurant.hours.thursday.openingTime} - ${selectedRestaurant.hours.thursday.closingTime}` : 'Closed'}</li>
                        <li>Fri: {selectedRestaurant.hours.friday.open ? `${selectedRestaurant.hours.friday.openingTime} - ${selectedRestaurant.hours.friday.closingTime}` : 'Closed'}</li>
                        <li>Sat: {selectedRestaurant.hours.saturday.open ? `${selectedRestaurant.hours.saturday.openingTime} - ${selectedRestaurant.hours.saturday.closingTime}` : 'Closed'}</li>
                        <li>Sun: {selectedRestaurant.hours.sunday.open ? `${selectedRestaurant.hours.sunday.openingTime} - ${selectedRestaurant.hours.sunday.closingTime}` : 'Closed'}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={20} className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">{selectedRestaurant.contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail size={20} className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">{selectedRestaurant.contact.email}</p>
                    </div>
                  </div>
                  
                  {selectedRestaurant.contact.website && (
                    <div className="flex items-start">
                      <Globe size={20} className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Website</h3>
                        <a
                          href={selectedRestaurant.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {selectedRestaurant.contact.website.replace(/^https?:\/\//i, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Photos */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedRestaurant.images.map((image, index) => (
                    <div key={index} className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                      <img src={image} alt={`${selectedRestaurant.name} - Photo ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                {sortedReviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet. Be the first to review this restaurant!</p>
                ) : (
                  <div className="space-y-6">
                    {sortedReviews.map((review: Review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">{review.userName}</h3>
                            <p className="text-gray-500 text-sm">{format(new Date(review.date), 'MMMM d, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column: Booking options */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Make a Reservation</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Party Size
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPartySize}
                      onChange={(e) => setSelectedPartySize(parseInt(e.target.value))}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users size={18} className="text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={format(selectedDate, 'yyyy-MM-dd')}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-gray-700 text-sm font-medium mb-2">
                    Available Times
                  </h3>
                  {availableTimes.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No available times for the selected date. Please try another date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => {
                        const [hour, minute] = time.split(':').map(Number);
                        const displayHour = hour > 12 ? hour - 12 : hour;
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        
                        return (
                          <button
                            key={time}
                            onClick={() => handleBooking(time)}
                            disabled={isLoadingBooking}
                            className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium text-sm py-2 px-3 rounded-md transition-colors"
                          >
                            {`${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600 text-sm">
                  <CalendarCheck size={16} className="mr-2" />
                  <span>Booked {selectedRestaurant.bookedToday} times today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;