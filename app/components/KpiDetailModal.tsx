"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KpiCardData {
  id: string;
  name: string;
  benchmark: number;
  minValue: number;
  maxValue: number;
  order: number;
  achieved?: number;
  date?: string;
}

interface KpiDetailModalProps {
  open: boolean;
  onClose: () => void;
  card: KpiCardData | null;
}

const modalVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

const KpiDetailModal: React.FC<KpiDetailModalProps> = ({ open, onClose, card }) => {
  if (!open || !card) return null;
  const yieldPercent = card.benchmark ? (((card.achieved ?? 0) - card.benchmark) / card.benchmark) * 100 : 0;
  const isPositive = yieldPercent > 0;
  const isNegative = yieldPercent < 0;
  const yieldColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-yellow-500';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative flex flex-col gap-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-2xl font-extrabold text-black mb-4">{card.name}</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Benchmark</div>
              <div className="text-xl font-bold text-gray-800">{card.benchmark}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Min/Max</div>
              <div className="text-xl font-bold text-gray-800">{card.minValue} - {card.maxValue}</div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Achieved</div>
              <div className="text-2xl font-bold text-blue-700">{card.achieved ?? 'N/A'}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Yield</div>
              <div className="flex items-center">
                <span className={`text-2xl font-bold ${yieldColor}`}>
                  {yieldPercent.toFixed(2)}%
                </span>
                {isPositive && (
                  <svg className="w-6 h-6 text-green-600 ml-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4l-8 8h16z" />
                  </svg>
                )}
                {isNegative && (
                  <svg className="w-6 h-6 text-red-500 ml-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 20l8-8H4z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KpiDetailModal; 