import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  asChild?: boolean; // For Radix Slot compatibility
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, iconLeft, iconRight, children, asChild = false, ...props }, ref) => {
    // Basic styling based on Tailwind - to be refined
    const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };
    const sizeStyles = {
      sm: "h-9 px-3 rounded-md",
      md: "h-10 py-2 px-4",
      lg: "h-11 px-8 rounded-md",
    };

    const Comp = asChild ? 'div' : 'button'; // Simplified, Radix Slot would handle this better

    return (
      <Comp
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <span className="mr-2">🌀</span> /* Replace with actual Spinner component */}
        {iconLeft && !isLoading && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && !isLoading && <span className="ml-2">{iconRight}</span>}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
export default Button;
