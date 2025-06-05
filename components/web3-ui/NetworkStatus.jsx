import React from 'react';
import { Network as NetworkIcon } from 'lucide-react'; // Using a generic network icon

const NetworkStatus = ({ networkName = "Ethereum" }) => {
  let bgColor, textColor, ringColor, iconColor;

  switch (networkName.toLowerCase()) {
    case 'polygon':
      bgColor = 'bg-brand-accent-purple/20';
      textColor = 'text-purple-300';
      ringColor = 'ring-purple-500/50';
      iconColor = 'text-brand-accent-purple';
      break;
    case 'bsc': // Binance Smart Chain
      bgColor = 'bg-yellow-500/20'; // Using amber for yellow
      textColor = 'text-yellow-300';
      ringColor = 'ring-yellow-500/50';
      iconColor = 'text-yellow-400';
      break;
    case 'ethereum':
    default:
      bgColor = 'bg-brand-accent-blue/20';
      textColor = 'text-sky-300';
      ringColor = 'ring-sky-500/50';
      iconColor = 'text-brand-accent-blue';
      break;
  }

  return (
    <div 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} ring-1 ring-inset ${ringColor} shadow-md`}
      role="status"
      aria-label={`Current network: ${networkName}`}
    >
      <NetworkIcon size={14} className={`mr-1.5 ${iconColor}`} />
      {networkName}
    </div>
  );
};

export default NetworkStatus;