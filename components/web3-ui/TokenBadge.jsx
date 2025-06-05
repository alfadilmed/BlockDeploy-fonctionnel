import React from 'react';
import { CircleDollarSign } from 'lucide-react'; // Default icon

const TokenBadge = ({ 
  tokenSymbol = "USDC", 
  tokenName = "USD Coin",
  balance = "1,234.56", 
  iconUrl, 
  IconComponent = CircleDollarSign 
}) => {
  return (
    <div 
      className="inline-flex items-center bg-slate-700/50 border border-slate-600 rounded-full p-1.5 pr-3 shadow-sm text-sm text-slate-200"
      title={`${balance} ${tokenName} (${tokenSymbol})`}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={`${tokenSymbol} logo`} className="w-6 h-6 rounded-full mr-2 object-contain" />
      ) : (
        <IconComponent size={20} className="w-6 h-6 rounded-full mr-2 p-0.5 text-brand-accent-blue bg-brand-accent-blue/10" />
      )}
      <span className="font-medium">{balance}</span>
      <span className="text-slate-400 ml-1.5">{tokenSymbol}</span>
    </div>
  );
};

export default TokenBadge;