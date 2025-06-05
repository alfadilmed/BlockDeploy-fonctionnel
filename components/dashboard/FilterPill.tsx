
import React from 'react';
import { motion } from 'framer-motion';
import { FilterPillOption } from '../../types'; // Assuming FilterPillOption is defined in types

interface FilterPillProps {
  label: FilterPillOption;
  isActive: boolean;
  onClick: (label: FilterPillOption) => void;
  isCompactMode?: boolean;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, isActive, onClick, isCompactMode = false }) => {
  return (
    <motion.button
      onClick={() => onClick(label)}
      className={`
        rounded-full border transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary
        ${isCompactMode ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm'}
        ${isActive 
          ? 'bg-brand-accent-blue text-white border-brand-accent-blue shadow-md hover:bg-sky-500' 
          : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/70 hover:border-slate-500 hover:text-slate-100'
        }
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      aria-pressed={isActive}
    >
      {label}
    </motion.button>
  );
};

export default FilterPill;
