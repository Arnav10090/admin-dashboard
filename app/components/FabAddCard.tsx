"use client";
import React from "react";
import { motion } from "framer-motion";

interface FabAddCardProps {
  onClick: () => void;
}

const FabAddCard: React.FC<FabAddCardProps> = ({ onClick }) => (
  <motion.button
    className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 group"
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    aria-label="Add KPI Card"
    tabIndex={0}
  >
    <span className="sr-only">Add KPI Card</span>
    <span className="pointer-events-none">+</span>
    {/* Tooltip */}
    <span className="absolute bottom-20 right-1/2 translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
      Add KPI Card
    </span>
  </motion.button>
);

export default FabAddCard; 