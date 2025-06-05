import React from 'react';

const InputWithIcon = ({ id, label, placeholder, value, onChange, icon, type = 'text', disabled = false, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2.5 
                     bg-white dark:bg-slate-800 
                     border border-slate-300 dark:border-slate-700 
                     rounded-lg 
                     text-slate-900 dark:text-slate-200 
                     focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue 
                     outline-none transition-colors duration-200
                     disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default InputWithIcon;
