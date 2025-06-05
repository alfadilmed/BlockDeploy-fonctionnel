import React from 'react';

// Heading Component
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  variant?: 'default' | 'display' | 'subtle'; // Example variants
  // size prop could map to Tailwind text sizes, e.g., 'text-4xl', 'text-3xl'
}

const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h1',
  className,
  children,
  variant = 'default',
  ...props
}) => {
  // Simplified styling - Tailwind would handle this better
  const baseStyle = "font-bold tracking-tight";
  const variantStyles = {
    default: "text-foreground",
    display: "text-4xl md:text-5xl lg:text-6xl text-primary", // Example display style
    subtle: "text-muted-foreground font-medium",
  };
  // Could add size specific classes here too

  return (
    <Component className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
Heading.displayName = 'Heading';


// Text Component
type TextElement = 'p' | 'span' | 'div' | 'label';
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextElement;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'destructive'; // Example color palette
  italic?: boolean;
}

const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  className,
  children,
  size = 'md',
  weight = 'normal',
  color = 'default',
  italic = false,
  ...props
}) => {
  // Simplified styling - Tailwind would handle this
  const sizeStyles = { xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' };
  const weightStyles = { light: 'font-light', normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold', bold: 'font-bold' };
  const colorStyles = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    destructive: 'text-destructive',
  };
  const italicStyle = italic ? 'italic' : '';

  return (
    <Component className={`${sizeStyles[size]} ${weightStyles[weight]} ${colorStyles[color]} ${italicStyle} ${className}`} {...props}>
      {children}
    </Component>
  );
};
Text.displayName = 'Text';

export { Heading, Text };
