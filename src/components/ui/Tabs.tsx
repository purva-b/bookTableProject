import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex overflow-x-auto hide-scrollbar border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === value}
      aria-controls={`panel-${value}`}
      onClick={() => setActiveTab(value)}
      className={`relative px-6 py-3 text-sm font-medium transition-colors focus:outline-none
        ${activeTab === value
          ? 'text-primary-600'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`
      }
    >
      {children}
      {activeTab === value && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
        />
      )}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  const { activeTab } = useTabs();
  
  return activeTab === value ? (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  ) : null;
}