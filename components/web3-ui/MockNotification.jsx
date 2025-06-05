import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const MockNotification = ({
  isVisible,
  onClose,
  type = "success", // success, error, warning, info
  title = "Notification Title",
  message = "This is a sample notification message.",
}) => {
  let IconComponent;
  let iconColorClass;
  let borderColorClass;

  switch (type) {
    case 'error':
      IconComponent = XCircle;
      iconColorClass = 'text-red-400';
      borderColorClass = 'border-red-500/50';
      break;
    case 'warning':
      IconComponent = AlertTriangle;
      iconColorClass = 'text-yellow-400';
      borderColorClass = 'border-yellow-500/50';
      break;
    case 'info':
      IconComponent = Info;
      iconColorClass = 'text-sky-400';
      borderColorClass = 'border-sky-500/50';
      break;
    case 'success':
    default:
      IconComponent = CheckCircle;
      iconColorClass = 'text-green-400';
      borderColorClass = 'border-green-500/50';
      break;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-5 right-5 w-full max-w-sm bg-brand-secondary shadow-2xl rounded-xl border ${borderColorClass} p-4 z-50 overflow-hidden`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${iconColorClass} mt-0.5`}>
              <IconComponent size={22} />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-slate-100">{title}</p>
              <p className="mt-1 text-sm text-slate-300">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                className="inline-flex rounded-md bg-brand-secondary text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent-blue"
                onClick={onClose}
                aria-label="Close notification"
              >
                <span className="sr-only">Close</span>
                <XCircle size={20} /> {/* Using XCircle for close button as X from lucide might be too minimal */}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MockNotification;