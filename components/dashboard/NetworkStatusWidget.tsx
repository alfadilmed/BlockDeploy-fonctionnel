
import React from 'react';
import { motion } from 'framer-motion';
import Card from '../Card';
import { Network, Fuel } from 'lucide-react'; // Using Network icon as main, Fuel for gas

interface NetworkStatusWidgetProps {
  networkName?: string;
  gasFee?: string; // e.g., "35 Gwei"
  networkIcon?: React.ElementType; // Optional custom icon
  isCompactMode?: boolean;
}

const NetworkStatusWidget: React.FC<NetworkStatusWidgetProps> = ({
  networkName = 'Ethereum Mainnet',
  gasFee = '35 Gwei',
  networkIcon: Icon = Network,
  isCompactMode = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`bg-brand-secondary border-slate-700/70 flex flex-col justify-between h-full ${isCompactMode ? 'p-3' : 'p-4'}`}>
        <div>
          <div className="flex items-center mb-1">
            <div className={`p-1.5 rounded-lg bg-green-500/15 mr-2 ${isCompactMode ? 'mr-1.5' : 'mr-2.5'}`}>
              <Icon size={isCompactMode ? 16 : 20} className="text-green-400" />
            </div>
            <h3 className={`font-semibold text-slate-100 ${isCompactMode ? 'text-sm' : 'text-md'}`}>Network Status</h3>
          </div>
          <p className={`text-slate-300 ${isCompactMode ? 'text-xs ml-[30px]' : 'text-sm ml-[38px]'}`}>{networkName}</p>
        </div>
        <div className="mt-2 flex items-center">
           <Fuel size={isCompactMode ? 12 : 14} className="text-yellow-400 mr-1.5" />
           <p className={`text-slate-400 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>
             Avg Gas: <span className="font-medium text-yellow-300">{gasFee}</span>
           </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default NetworkStatusWidget;
