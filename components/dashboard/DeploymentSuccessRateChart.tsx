
import React from 'react';
import { motion } from 'framer-motion';
import Card from '../Card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface RateData {
  success: number; // percentage
  failed: number;  // percentage
  pending: number; // percentage
}

interface DeploymentSuccessRateChartProps {
  data?: RateData;
  isCompactMode?: boolean;
}

const DEFAULT_DATA: RateData = { success: 75, failed: 15, pending: 10 };

const ProgressBar: React.FC<{ label: string; value: number; color: string; icon: React.ElementType, isCompactMode?: boolean }> = ({ label, value, color, icon: Icon, isCompactMode=false }) => (
  <div className="mb-1.5">
    <div className={`flex items-center justify-between ${isCompactMode ? 'text-xs mb-0.5' : 'text-sm mb-1'}`}>
      <span className="flex items-center text-slate-300">
        <Icon size={isCompactMode ? 12 : 14} className={`mr-1.5 ${color === 'text-green-400' ? 'text-green-400' : color === 'text-red-400' ? 'text-red-400' : 'text-yellow-400' }`} />
        {label}
      </span>
      <span className={`font-medium ${color}`}>{value}%</span>
    </div>
    <div className={`w-full bg-slate-700 rounded-full ${isCompactMode ? 'h-1.5' : 'h-2'}`}>
      <motion.div
        className={`rounded-full ${isCompactMode ? 'h-1.5' : 'h-2'} ${
            color === 'text-green-400' ? 'bg-green-500' : 
            color === 'text-red-400' ? 'bg-red-500' : 
            'bg-yellow-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  </div>
);

const DeploymentSuccessRateChart: React.FC<DeploymentSuccessRateChartProps> = ({ data = DEFAULT_DATA, isCompactMode = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`bg-brand-secondary border-slate-700/70 flex flex-col h-full ${isCompactMode ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-semibold text-slate-100 ${isCompactMode ? 'text-sm mb-1.5' : 'text-md mb-2'}`}>Deployment Success Rate</h3>
        <div className="flex-grow">
          <ProgressBar label="Successful" value={data.success} color="text-green-400" icon={CheckCircle} isCompactMode={isCompactMode} />
          <ProgressBar label="Failed" value={data.failed} color="text-red-400" icon={XCircle} isCompactMode={isCompactMode}/>
          <ProgressBar label="Pending" value={data.pending} color="text-yellow-400" icon={AlertTriangle} isCompactMode={isCompactMode}/>
        </div>
      </Card>
    </motion.div>
  );
};

export default DeploymentSuccessRateChart;
