import React from 'react';
import { CircleDollarSign } from 'lucide-react'; 

const TokenBadge = ({ 
  tokenSymbol = "USDC", 
  tokenName = "USD Coin",
  balance = "1,234.56", 
  iconUrl, // e.g., a URL to an SVG or PNG
  IconComponent = CircleDollarSign, // Fallback Lucide icon
  className = ''
}) => {
  return (
    <div 
      className={`inline-flex items-center bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-full p-1.5 pr-3 shadow-sm text-sm text-slate-700 dark:text-slate-200 ${className}`}
      title={`${balance} ${tokenName} (${tokenSymbol})`}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={`${tokenSymbol} logo`} className="w-6 h-6 rounded-full mr-2 object-contain bg-white dark:bg-slate-200" />
      ) : (
        <div className="w-6 h-6 rounded-full mr-2 flex items-center justify-center bg-sky-100 dark:bg-brand-accent-blue/10">
           <IconComponent size={16} className="text-sky-600 dark:text-brand-accent-blue" />
        </div>
      )}
      <span className="font-medium">{balance}</span>
      <span className="text-slate-500 dark:text-slate-400 ml-1.5">{tokenSymbol}</span>
    </div>
  );
};

export default TokenBadge;
