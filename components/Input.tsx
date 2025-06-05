
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, iconLeft, id, className, ...props }) => {
  const baseInputClasses = "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue outline-none transition-colors duration-200";
  const errorInputClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const disabledInputClasses = "bg-slate-700 cursor-not-allowed";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {iconLeft}
            </div>
        )}
        <input
          id={id}
          className={`
            ${baseInputClasses}
            ${error ? errorInputClasses : ''}
            ${props.disabled ? disabledInputClasses : ''}
            ${iconLeft ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
