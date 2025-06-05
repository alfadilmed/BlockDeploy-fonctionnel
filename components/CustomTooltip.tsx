
import React from 'react';
import { motion } from 'framer-motion';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: string | number;
    color?: string; // Color from the chart series (fill or stroke)
    payload?: any; // Original data point for more complex tooltips
    fill?: string; // Sometimes fill is passed directly for pie charts
    stroke?: string; // Sometimes stroke is passed directly
  }>;
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-brand-secondary/90 p-3 rounded-lg border border-slate-600 shadow-xl backdrop-blur-sm text-xs" // Adjusted border for dark theme
      >
        <p className="label text-sm text-brand-accent-blue font-semibold mb-1.5">{`${label}`}</p>
        {payload.map((pld, index) => {
          // Determine color: use pld.color, then pld.fill, then pld.stroke, fallback to slate-200
          const itemColor = pld.color || pld.fill || pld.stroke || '#E2E8F0'; // Default to slate-200
          return (
            <p key={index} style={{ color: itemColor }} className="intro">
              {`${pld.name}: ${typeof pld.value === 'number' ? pld.value.toLocaleString() : pld.value}`}
            </p>
          );
        })}
      </motion.div>
    );
  }
  return null;
};

export default CustomTooltip;
