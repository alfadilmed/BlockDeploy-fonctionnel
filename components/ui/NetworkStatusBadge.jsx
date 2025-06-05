import React from 'react';
import { Network as NetworkIcon } from 'lucide-react';

const NetworkStatusBadge = ({ networkName = "Ethereum" }) => {
  let badgeClasses, iconClasses;

  switch (networkName.toLowerCase()) {
    case 'polygon':
      badgeClasses = 'bg-purple-100 dark:bg-brand-accent-purple/20 text-purple-700 dark:text-purple-300 ring-purple-600/20 dark:ring-purple-500/50';
      iconClasses = 'text-purple-500 dark:text-brand-accent-purple';
      break;
    case 'bsc':
      badgeClasses = 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 ring-yellow-600/20 dark:ring-yellow-500/50';
      iconClasses = 'text-yellow-500 dark:text-yellow-400';
      break;
    case 'ethereum':
    default:
      badgeClasses = 'bg-sky-100 dark:bg-brand-accent-blue/20 text-sky-700 dark:text-sky-300 ring-sky-600/20 dark:ring-sky-500/50';
      iconClasses = 'text-sky-500 dark:text-brand-accent-blue';
      break;
  }

  return (
    <div 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset shadow-sm ${badgeClasses}`}
      role="status"
      aria-label={`Current network: ${networkName}`}
    >
      <NetworkIcon size={14} className={`mr-1.5 ${iconClasses}`} />
      {networkName}
    </div>
  );
};

export default NetworkStatusBadge;
