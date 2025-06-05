import React from 'react';
import { Fuel, AlertCircle } from 'lucide-react';

const GasFeeEstimator = ({ 
  estimatedGas = "0.0025 ETH", 
  gasPrice = "~$4.50 USD",
  priority = "Standard",
  className = ''
}) => {
  return (
    <div className={`bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-300 dark:border-slate-700 shadow-md ${className}`}>
      <div className="flex items-center mb-2">
        <Fuel size={18} className="text-brand-accent-blue mr-2" />
        <h4 className="text-md font-semibold text-slate-700 dark:text-slate-200">Estimated Gas Fee</h4>
      </div>
      <p className="text-2xl font-bold text-brand-accent-blue mb-1">{estimatedGas}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{gasPrice} ({priority})</p>
      <div className="flex items-start text-xs text-slate-500 dark:text-slate-500 mt-3">
        <AlertCircle size={14} className="mr-1.5 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
        <span>This is an estimate. Actual network fees may vary based on congestion.</span>
      </div>
    </div>
  );
};

export default GasFeeEstimator;
