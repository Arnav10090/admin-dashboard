"use client";

import React from 'react';

type TimeRange = 'day' | 'month' | 'year';

interface DateFilterProps {
  onFilterChange: (filter: TimeRange) => void;
  currentFilter: TimeRange;
}
const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange, currentFilter = 'day' }) => {
  const handleFilterClick = (e: React.MouseEvent, filter: TimeRange) => {
    e.stopPropagation(); // Prevent click from reaching parent elements
    onFilterChange(filter);
  };

  return (
    <div 
      className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg"
      onClick={(e) => e.stopPropagation()} // Prevent click from reaching parent
    >
      {(['day', 'month', 'year'] as const).map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={(e) => handleFilterClick(e, filter)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            currentFilter === filter
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default DateFilter;
