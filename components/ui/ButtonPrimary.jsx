import React from 'react';

const ButtonPrimary = ({ children, onClick, iconLeft, iconRight, className = '', disabled = false, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-5 py-2.5 font-semibold rounded-lg
                  bg-brand-accent-blue text-white 
                  hover:bg-sky-500 
                  focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900
                  transition-all duration-200 ease-in-out
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg transform hover:scale-105
                  ${className}`}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default ButtonPrimary;
