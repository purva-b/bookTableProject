import React, { useEffect, useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { CalendarCheck, Users, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { getBookingAnalytics, isLoading } = useBookingStore();
  const [analytics, setAnalytics] = useState<{
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    bookingsByDay: Record<string, number>;
    bookingsByRestaurant: Record<string, number>;
  } | null>(null);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getBookingAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    
    fetchAnalytics();
  }, [getBookingAnalytics]);
  
  if (isLoading || !analytics) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const {
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    bookingsByDay,
    bookingsByRestaurant,
  } = analytics;
  
  // Get top 5 restaurants by booking volume
  const topRestaurants = Object.entries(bookingsByRestaurant)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Get booking dates for the chart (last 14 days)
  const dates = Object.keys(bookingsByDay).sort();
  const recentDates = dates.slice(-14);
  const bookingCounts = recentDates.map(date => bookingsByDay[date] || 0);
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Overview of booking metrics for the last month</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 text-sm">Total Bookings</h2>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CalendarCheck size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{totalBookings}</span>
            <span className="ml-2 text-sm text-gray-500">past month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 text-sm">Completed</h2>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{completedBookings}</span>
            <span className="ml-2 text-sm text-green-600">
              {Math.round((completedBookings / totalBookings) * 100)}%
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 text-sm">Upcoming</h2>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{confirmedBookings}</span>
            <span className="ml-2 text-sm text-purple-600">
              {Math.round((confirmedBookings / totalBookings) * 100)}%
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 text-sm">Cancellations</h2>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{cancelledBookings}</span>
            <span className="ml-2 text-sm text-red-600">
              {Math.round((cancelledBookings / totalBookings) * 100)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">Booking Trends (Last 14 Days)</h2>
          <div className="h-64 flex items-end space-x-2">
            {bookingCounts.map((count, index) => {
              const date = new Date(recentDates[index]);
              const height = (count / Math.max(...bookingCounts)) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  ></div>
                  <p className="text-xs mt-1 truncate w-full text-center">
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">Top Restaurants</h2>
          <div className="space-y-4">
            {topRestaurants.map(([name, count], index) => {
              const percentage = Math.round((count / totalBookings) * 100);
              
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{name}</span>
                    <span className="text-gray-600">{count} bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;