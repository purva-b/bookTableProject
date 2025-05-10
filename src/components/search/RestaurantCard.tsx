import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Star, MapPin } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  date: Date;
  time: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, date, time }) => {
  // Generate some available booking times around the requested time
  const generateAvailableTimes = (baseTime: string) => {
    const [baseHour, baseMinute] = baseTime.split(':').map(Number);
    const times = [];
    
    // Add times 30 minutes before and 30 minutes after in 15-minute increments
    for (let minuteOffset = -30; minuteOffset <= 30; minuteOffset += 15) {
      if (minuteOffset === 0) {
        times.push(baseTime);
        continue;
      }
      
      let hour = baseHour;
      let minute = baseMinute + minuteOffset;
      
      // Adjust hour and minute for overflow
      if (minute < 0) {
        hour -= 1;
        minute += 60;
      } else if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
      
      // Ensure we're within operating hours (assumed to be 11 AM to 10 PM)
      if (hour >= 11 && hour < 22) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    
    return times;
  };
  
  const availableTimes = generateAvailableTimes(time);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto">
          <Link to={`/restaurants/${restaurant.id}`}>
            <img
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        
        <div className="md:w-2/3 p-4">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <Link to={`/restaurants/${restaurant.id}`}>
                <h3 className="text-xl font-semibold mb-1 hover:text-primary-600 transition-colors">
                  {restaurant.name}
                </h3>
              </Link>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center text-yellow-500 mr-2">
                  <Star size={16} className="fill-current" />
                  <span className="ml-1 text-sm text-gray-700">{restaurant.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">({restaurant.reviews.length} reviews)</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-600">{restaurant.cuisineType}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
              </div>
              
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin size={16} className="mr-1" />
                <span>
                  {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {restaurant.description}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-sm mb-2 text-center">
                {restaurant.bookedToday} booked today
              </p>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">
              Available times for {format(date, 'EEEE, MMMM d')}:
            </p>
            
            <div className="flex flex-wrap gap-2">
              {availableTimes.map((t) => {
                const [hour, minute] = t.split(':').map(Number);
                const displayHour = hour > 12 ? hour - 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                
                return (
                  <Link
                    key={t}
                    to={`/restaurants/${restaurant.id}?date=${format(date, 'yyyy-MM-dd')}&time=${t}&party=2`}
                    className="bg-primary-100 hover:bg-primary-200 text-primary-700 font-medium text-sm py-1 px-3 rounded-md transition-colors"
                  >
                    {`${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;