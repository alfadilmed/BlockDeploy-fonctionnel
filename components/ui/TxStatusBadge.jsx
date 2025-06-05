import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const TxStatusBadge = ({ status = "Pending" }) => {
  let badgeClasses, IconComponent;

  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'success':
      badgeClasses = 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300';
      IconComponent = CheckCircle;
      break;
    case 'failed':
    case 'error':
      badgeClasses = 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
      IconComponent = XCircle;
      break;
    case 'pending':
    default:
      badgeClasses = 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      IconComponent = Loader2;
      break;
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${badgeClasses}`}
      role="status"
      aria-live="polite"
      aria-label={`Transaction status: ${status}`}
    >
      <IconComponent size={14} className={`mr-1.5 ${status.toLowerCase() === 'pending' ? 'animate-spin' : ''}`} />
      {status}
    </span>
  );
};

export default TxStatusBadge;
