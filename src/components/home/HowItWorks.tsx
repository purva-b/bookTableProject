import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, ThumbsUp } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search size={28} className="text-primary-500" />,
      title: 'Search',
      description: 'Find restaurants by location, cuisine, date, time, and party size',
    },
    {
      icon: <MapPin size={28} className="text-primary-500" />,
      title: 'Discover',
      description: 'Browse restaurant menus, photos, and reviews from diners',
    },
    {
      icon: <Calendar size={28} className="text-primary-500" />,
      title: 'Book',
      description: 'Reserve a table in seconds with instant confirmation',
    },
    {
      icon: <ThumbsUp size={28} className="text-primary-500" />,
      title: 'Enjoy',
      description: 'Experience great dining and share your feedback',
    },
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            BookTable makes it easy to discover and book the perfect restaurant in just a few steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;