import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search as SearchIcon, Calendar, Users, Clock, MapPin } from 'lucide-react';
import { SearchParams } from '../../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialParams = {} }) => {
  const [date, setDate] = useState<string>(
    initialParams.date 
      ? format(initialParams.date, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd')
  );
  
  const [time, setTime] = useState<string>(initialParams.time || '19:00');
  const [partySize, setPartySize] = useState<number>(initialParams.partySize || 2);
  const [location, setLocation] = useState<string>(initialParams.location || '');
  const [cuisine, setCuisine] = useState<string>(initialParams.cuisine || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSearch({
      date: new Date(date),
      time,
      partySize,
      location: location || undefined,
      cuisine: cuisine || undefined,
    });
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar size={18} className="text-gray-500" />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock size={18} className="text-gray-500" />
          </div>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            required
          >
            {Array.from({ length: 14 }, (_, i) => {
              const hour = i + 11; // Start at 11 AM
              return (
                <option key={hour} value={`${hour}:00`}>
                  {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users size={18} className="text-gray-500" />
          </div>
          <select
            value={partySize}
            onChange={(e) => setPartySize(parseInt(e.target.value))}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            required
          >
            {Array.from({ length: 12 }, (_, i) => {
              const size = i + 1;
              return (
                <option key={size} value={size}>
                  {size} {size === 1 ? 'person' : 'people'}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State or Zip"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <SearchIcon size={18} className="mr-2" />
            <span>Find a Table</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;