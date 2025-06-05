import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info as InfoIcon, X } from 'lucide-react'; // Renamed Info to InfoIcon to avoid conflict

const ToastMock = ({
  isVisible,
  onClose,
  type = "success", // success, error, warning, info
  title = "Notification Title",
  message = "This is a sample notification message.",
  position = "top-right", // e.g., top-right, bottom-center
}) => {
  let IconComponent;
  let iconColorClass;
  let baseBgColorClass = "bg-white dark:bg-slate-800";
  let borderColorClass = "border-slate-300 dark:border-slate-700";


  switch (type) {
    case 'error':
      IconComponent = XCircle;
      iconColorClass = 'text-red-500 dark:text-red-400';
      borderColorClass = 'border-red-500/50 dark:border-red-700/50';
      break;
    case 'warning':
      IconComponent = AlertTriangle;
      iconColorClass = 'text-yellow-500 dark:text-yellow-400';
      borderColorClass = 'border-yellow-500/50 dark:border-yellow-700/50';
      break;
    case 'info':
      IconComponent = InfoIcon;
      iconColorClass = 'text-sky-500 dark:text-sky-400';
      borderColorClass = 'border-sky-500/50 dark:border-sky-700/50';
      break;
    case 'success':
    default:
      IconComponent = CheckCircle;
      iconColorClass = 'text-green-500 dark:text-green-400';
      borderColorClass = 'border-green-500/50 dark:border-green-700/50';
      break;
  }
  
  let positionClasses = 'fixed top-5 right-5';
  if (position === 'bottom-center') positionClasses = 'fixed bottom-5 left-1/2 transform -translate-x-1/2';
  // Add more positions as needed

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position.includes('top') ? -50 : 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`${positionClasses} w-full max-w-sm ${baseBgColorClass} shadow-2xl rounded-xl border ${borderColorClass} p-4 z-[100] overflow-hidden`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${iconColorClass} mt-0.5`}>
              <IconComponent size={22} />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
            </div>
            {onClose && (
                 <div className="ml-4 flex-shrink-0 flex">
                    <button
                        type="button"
                        className="inline-flex rounded-md bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-brand-accent-blue"
                        onClick={onClose}
                        aria-label="Close notification"
                    >
                        <span className="sr-only">Close</span>
                        <X size={20} />
                    </button>
                 </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastMock;
