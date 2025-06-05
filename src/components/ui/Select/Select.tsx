import React from 'react';

// This is a VERY basic select structure.
// For a production-ready select, consider using Radix UI Select or Headless UI Listbox
// for accessibility (keyboard navigation, ARIA attributes) and feature completeness.

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string | boolean;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, placeholder, ...props }, ref) => {
    const baseSelectStyle = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    const errorStyle = error ? "border-destructive focus-visible:ring-destructive" : "";

    return (
      <div className={`w-full ${className}`}>
        {label && <label htmlFor={props.id || props.name} className="block text-sm font-medium text-foreground mb-1">{label}</label>}
        <select
          ref={ref}
          className={`${baseSelectStyle} ${errorStyle}`}
          {...props}
        >
          {placeholder && <option value="" disabled={props.value !== undefined && props.value !== ""}>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && typeof error === 'string' && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
export default Select;
