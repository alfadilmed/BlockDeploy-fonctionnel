
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string; // Added placeholder to the component's own props
}

const Select: React.FC<SelectProps> = ({ label, error, options, id, className, placeholder, ...restProps }) => {
  const baseSelectClasses = "w-full appearance-none px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue outline-none transition-colors duration-200 pr-10";
  const errorSelectClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const disabledSelectClasses = "bg-slate-700 cursor-not-allowed";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`
            ${baseSelectClasses}
            ${error ? errorSelectClasses : ''}
            ${restProps.disabled ? disabledSelectClasses : ''}
            ${className}
          `}
          {...restProps} // Spread the rest of the HTMLSelectAttributes
        >
          {/* Use the destructured placeholder prop. Ensure it's selected if the main value is not set. */}
          {placeholder && <option value="" disabled selected={restProps.value === undefined || restProps.value === ''}>{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown size={20} />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Select;
