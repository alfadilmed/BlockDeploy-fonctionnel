
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  value: number; // Percentage 0-100
  height?: string; // e.g., 'h-2.5'
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ value, height = 'h-2.5' }) => {
  const normalizedValue = Math.max(0, Math.min(100, value));
  let barColor = 'bg-brand-accent-blue'; // Default blue < 50%

  if (normalizedValue >= 90) {
    barColor = 'bg-green-500'; // Green > 90%
  } else if (normalizedValue >= 50) {
    barColor = 'bg-brand-accent-purple'; // Purple 50-90%
  }
  
  // Gradient for a nicer look, might override single color if preferred
  const gradientColor = normalizedValue >= 90 ? 'from-green-500 to-emerald-500' :
                        normalizedValue >= 50 ? 'from-purple-500 to-brand-accent-purple' :
                        'from-sky-500 to-brand-accent-blue';


  return (
    <div className={`w-full bg-slate-700 rounded-full ${height} overflow-hidden`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${gradientColor}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${normalizedValue}%` }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ originX: 0 }}
      />
    </div>
  );
};

export default AnimatedProgressBar;
