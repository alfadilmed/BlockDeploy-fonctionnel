import React from 'react';

const IconButton = ({ icon, onClick, 'aria-label': ariaLabel, className = '', disabled = false, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`p-2 rounded-full 
                  text-slate-600 dark:text-slate-300 
                  hover:bg-slate-200 dark:hover:bg-slate-700 
                  focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:ring-offset-2 dark:focus:ring-offset-slate-900
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
