
import React from 'react';
import Button from './Button'; // Import the base Button component

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  glowColor?: 'blue' | 'purple'; // Specify which color glow to animate
  // Any other props that Button might accept
}

const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  glowColor = 'blue', // Default to blue glow
  className = '',
  ...props
}) => {
  
  const animationClass = glowColor === 'blue' ? 'animate-glow-blue' : 'animate-glow-purple';

  // We pass the animation class along with any other classes to the base Button component
  // The base Button's own glowEffect prop might be redundant if this animation is applied,
  // or this component could choose to override/enhance it.
  // For simplicity, we're adding an animation class.
  // The base Button's static glow (shadow-neon-blue/purple) will be overridden by the animation's box-shadow.
  
  return (
    <Button
      className={`${animationClass} ${className}`}
      {...props} // Pass all other props to the base Button
      glowEffect={null} // Disable static glow from base Button if animation overrides it
    >
      {children}
    </Button>
  );
};

export default GlowButton;
