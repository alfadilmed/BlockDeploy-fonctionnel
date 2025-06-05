import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', padding = 'md', ...props }, ref) => {
    // Basic styling - to be refined
    const baseStyle = "rounded-lg";
    const variantStyles = {
      default: "bg-card text-card-foreground border border-border", // Assuming card, card-foreground, border are defined in globals.css via Tailwind theme
      outlined: "border border-border bg-transparent",
      elevated: "shadow-lg bg-card text-card-foreground border border-border",
    };
    const paddingStyles = {
      none: "p-0",
      sm: "p-3",
      md: "p-5",
      lg: "p-8",
    };

    return (
      <div
        className={`${baseStyle} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export { Card };
export default Card;
