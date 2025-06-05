import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, iconLeft, iconRight, ...props }, ref) => {
    // Basic styling - to be refined
    const baseInputStyle = "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    const errorStyle = error ? "border-destructive focus-visible:ring-destructive" : "";

    return (
      <div className={`w-full ${className}`}>
        {label && <label className="block text-sm font-medium text-foreground mb-1">{label}</label>}
        <div className="relative">
          {iconLeft && <span className="absolute left-3 top-1/2 -translate-y-1/2">{iconLeft}</span>}
          <input
            type={type}
            className={`${baseInputStyle} ${errorStyle} ${iconLeft ? "pl-10" : ""} ${iconRight ? "pr-10" : ""}`}
            ref={ref}
            {...props}
          />
          {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2">{iconRight}</span>}
        </div>
        {error && typeof error === 'string' && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
export default Input;
