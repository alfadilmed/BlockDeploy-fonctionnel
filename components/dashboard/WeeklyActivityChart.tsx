
import React from 'react';
import { motion } from 'framer-motion';
import Card from '../Card';
import { BarChart3 } from 'lucide-react';

interface WeeklyActivityChartProps {
  data?: number[]; // Array of 7 numbers representing activity for Mon-Sun
  isCompactMode?: boolean;
}

const DEFAULT_DATA = [3, 5, 2, 6, 1, 4, 7]; // Default if no data prop provided
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']; // French days

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data = DEFAULT_DATA, isCompactMode = false }) => {
  const maxValue = Math.max(...data, 1); // Ensure maxValue is at least 1 to prevent division by zero

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`bg-brand-secondary border-slate-700/70 flex flex-col h-full ${isCompactMode ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center mb-2">
          <BarChart3 size={isCompactMode ? 16 : 20} className="text-brand-accent-blue mr-2" />
          <h3 className={`font-semibold text-slate-100 ${isCompactMode ? 'text-sm' : 'text-md'}`}>Weekly Activity</h3>
        </div>
        <div className={`flex justify-around items-end flex-grow ${isCompactMode ? 'space-x-1 h-16' : 'space-x-1.5 h-24'}`}>
          {data.map((value, index) => (
            <div key={index} className="flex flex-col items-center h-full justify-end">
              <motion.div
                className="bg-gradient-to-t from-brand-accent-blue to-sky-400 w-3 sm:w-4 rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                title={`Activity: ${value}`}
              />
              <span className={`text-slate-500 ${isCompactMode ? 'text-[10px] mt-0.5' : 'text-xs mt-1'}`}>{DAYS[index]}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default WeeklyActivityChart;
