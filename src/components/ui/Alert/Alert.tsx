import React from 'react';
// import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'; // Example icons

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default';
  title?: string;
  message?: React.ReactNode; // Allow ReactNode for more complex messages
  showIcon?: boolean;
  onClose?: () => void;
  // icon?: React.ReactNode; // Allow custom icon
}

const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'default',
  title,
  message,
  showIcon = true,
  onClose,
  // icon,
  ...props
}) => {
  const baseStyle = "p-4 rounded-md border";
  const variantStyles = {
    default: "bg-background text-foreground border-border",
    info: "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300",
    success: "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300",
    error: "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300",
  };

  // const IconComponent = icon ? <>{icon}</> :
  //   variant === 'info' ? <Info size={20} /> :
  //   variant === 'success' ? <CheckCircle size={20} /> :
  //   variant === 'warning' ? <AlertCircle size={20} /> :
  //   variant === 'error' ? <XCircle size={20} /> :
  //   null;
  const IconComponent = <span className="text-xl">{variant === 'info' ? 'ℹ️' : variant === 'success' ? '✅' : variant === 'warning' ? '⚠️' : variant === 'error' ? '❌' : '🔔'}</span>;


  return (
    <div
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex">
        {showIcon && IconComponent && <div className="flex-shrink-0 mr-3">{IconComponent}</div>}
        <div className="flex-grow">
          {title && <h5 className="font-semibold mb-1">{title}</h5>}
          {typeof message === 'string' ? <p className="text-sm">{message}</p> : message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Close alert"
          >
             {/* <XCircle size={18} /> Using text X for simplicity */}
             <span className="text-sm">✕</span>
          </button>
        )}
      </div>
    </div>
  );
};

export { Alert };
export default Alert;
