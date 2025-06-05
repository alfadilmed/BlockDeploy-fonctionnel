import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectDropdown = ({ id, label, options = [], value, onChange, placeholder, disabled = false, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full appearance-none px-4 py-2.5 pr-10
                     bg-white dark:bg-slate-800 
                     border border-slate-300 dark:border-slate-700 
                     rounded-lg 
                     text-slate-900 dark:text-slate-200 
                     focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue 
                     outline-none transition-colors duration-200
                     disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          {placeholder && <option value="" disabled={value !== undefined}>{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default SelectDropdown;
