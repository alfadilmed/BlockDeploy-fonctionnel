import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const AlertBox = ({ type = 'info', title, message, className = '' }) => {
  let IconComponent;
  let iconColorClass, bgColorClass, borderColorClass, titleColorClass, messageColorClass;

  switch (type) {
    case 'success':
      IconComponent = CheckCircle;
      iconColorClass = 'text-green-500 dark:text-green-400';
      bgColorClass = 'bg-green-50 dark:bg-green-900/20';
      borderColorClass = 'border-green-500/50';
      titleColorClass = 'text-green-800 dark:text-green-300';
      messageColorClass = 'text-green-700 dark:text-green-400';
      break;
    case 'error':
      IconComponent = XCircle;
      iconColorClass = 'text-red-500 dark:text-red-400';
      bgColorClass = 'bg-red-50 dark:bg-red-900/20';
      borderColorClass = 'border-red-500/50';
      titleColorClass = 'text-red-800 dark:text-red-300';
      messageColorClass = 'text-red-700 dark:text-red-400';
      break;
    case 'warning':
      IconComponent = AlertTriangle;
      iconColorClass = 'text-yellow-500 dark:text-yellow-400';
      bgColorClass = 'bg-yellow-50 dark:bg-yellow-900/20';
      borderColorClass = 'border-yellow-500/50';
      titleColorClass = 'text-yellow-800 dark:text-yellow-300';
      messageColorClass = 'text-yellow-700 dark:text-yellow-400';
      break;
    case 'info':
    default:
      IconComponent = Info;
      iconColorClass = 'text-sky-500 dark:text-sky-400';
      bgColorClass = 'bg-sky-50 dark:bg-sky-900/20';
      borderColorClass = 'border-sky-500/50';
      titleColorClass = 'text-sky-800 dark:text-sky-300';
      messageColorClass = 'text-sky-700 dark:text-sky-400';
      break;
  }

  return (
    <div className={`p-4 rounded-lg border ${bgColorClass} ${borderColorClass} ${className}`} role="alert">
      <div className="flex">
        <div className={`flex-shrink-0 ${iconColorClass}`}>
          <IconComponent size={20} aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${titleColorClass}`}>{title}</h3>}
          {message && <div className={`text-sm ${messageColorClass} ${title ? 'mt-1' : ''}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
