import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const TxStatusBadge = ({ status = "Pending" }) => {
  let bgColor, textColor, IconComponent;

  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'success':
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-300';
      IconComponent = CheckCircle;
      break;
    case 'failed':
    case 'error':
      bgColor = 'bg-red-500/20';
      textColor = 'text-red-300';
      IconComponent = XCircle;
      break;
    case 'pending':
    default:
      bgColor = 'bg-yellow-500/20';
      textColor = 'text-yellow-300';
      IconComponent = Loader2;
      break;
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor} shadow`}
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