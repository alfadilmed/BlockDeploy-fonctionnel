
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  glowEffect?: 'blue' | 'purple' | null;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeft,
  iconRight,
  glowEffect = null,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary transition-all duration-200 ease-in-out inline-flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-brand-accent-blue text-white hover:bg-sky-500 focus:ring-sky-400',
    secondary: 'bg-brand-accent-purple text-white hover:bg-purple-600 focus:ring-purple-500',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-700 focus:ring-slate-500',
    ghost: 'text-slate-300 hover:bg-slate-700/50 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const glowStyles = {
    blue: 'shadow-neon-blue hover:shadow-neon-blue/80',
    purple: 'shadow-neon-purple hover:shadow-neon-purple/80',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type="button"
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${props.disabled || isLoading ? disabledStyles : ''}
        ${glowEffect && glowStyles[glowEffect] ? glowStyles[glowEffect] : ''}
        ${className}
      `}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {iconLeft && !isLoading && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && !isLoading && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default Button;
