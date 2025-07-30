"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DateFilter from './DateFilter';

type TimeRange = 'day' | 'month' | 'year';

export interface KpiCardProps {
  name: string;
  benchmark: number;
  achieved?: number;
  yieldPercent: number;
  minValue: number;
  maxValue: number;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
  showDateFilter?: boolean;
}

function getPerformanceColor(yieldPercent: number) {
  if (yieldPercent > 0) return 'text-green-600';
  if (yieldPercent === 0) return 'text-yellow-500';
  return 'text-red-500';
}

function getProgressColor(yieldPercent: number) {
  if (yieldPercent >= 90) return 'bg-green-400';
  if (yieldPercent >= 70) return 'bg-yellow-400';
  return 'bg-red-400';
}

const KpiCard: React.FC<KpiCardProps> = ({
  name,
  benchmark,
  achieved,
  yieldPercent,
  minValue,
  maxValue,

  onDelete,
  onEdit,
  onClick,
  showDateFilter = true,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  // Calculate scaled values based on time range
  const { scaledBenchmark, scaledAchieved, scaledMinValue, scaledMaxValue } = useMemo(() => {
    const multiplier = timeRange === 'month' ? 30 : timeRange === 'year' ? 360 : 1;
    const roundValue = (value: number) => Math.round(value * 100) / 100;

    return {
      scaledBenchmark: roundValue(benchmark * multiplier),
      scaledAchieved: achieved !== undefined ? roundValue(achieved * multiplier) : undefined,
      scaledMinValue: roundValue(minValue * multiplier),
      scaledMaxValue: roundValue(maxValue * multiplier),
    };
  }, [benchmark, achieved, minValue, maxValue, timeRange]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };
  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center w-full max-w-xs border border-gray-100 hover:shadow-2xl transition cursor-pointer group"
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring' }}
      onClick={onClick}
      tabIndex={0}
      aria-label={`View details for ${name}`}
      role="button"
    >
      <div className="absolute top-3 right-3 flex gap-1">
        {onEdit && (
          <button
            className="text-gray-400 hover:text-blue-600 z-[100] bg-white/80 rounded-full p-1 shadow hover:scale-110 transition-transform cursor-pointer"
            title="Edit Card"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            className="text-gray-400 hover:text-red-600 z-[100] bg-white/80 rounded-full p-1 shadow hover:scale-110 transition-transform cursor-pointer"
            title="Delete Card"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="w-full flex flex-col items-center gap-2 mb-3">
        <div className="font-bold text-lg text-gray-800 text-center w-full truncate" title={name}>{name}</div>
        {showDateFilter && (
          <DateFilter 
            onFilterChange={handleTimeRangeChange} 
            currentFilter={timeRange} 
          />
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Benchmark</span>
          <span className="font-semibold text-gray-700">
            {scaledBenchmark.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Achieved</span>
          <span className="font-semibold text-blue-700">
            {scaledAchieved !== undefined ? scaledAchieved.toLocaleString() : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Yield</span>
          <div className="flex items-center gap-1">
            <span className={`font-bold ${getPerformanceColor(yieldPercent)}`}>
              {yieldPercent.toFixed(2)}%
            </span>
            {yieldPercent > 0 ? (
              <svg className="w-5 h-5 text-green-600 -mt-0.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 4l-8 8h16z" />
              </svg>
            ) : yieldPercent < 0 ? (
              <svg className="w-5 h-5 text-red-500 -mt-0.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 20l8-8H4z" />
              </svg>
            ) : null}
          </div>
        </div>
        {/* Progress bar for yield */}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(yieldPercent)}`}
            style={{ width: `${Math.min(Math.max(yieldPercent, 0), 100)}%` }}
            aria-valuenow={yieldPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Range:</span>
          <span>
            {scaledMinValue.toLocaleString()} - {scaledMaxValue.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard; 