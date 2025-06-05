
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  hoverGradient?: boolean; // New prop for gradient on hover
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false, hoverGradient = false }) => {
  const baseClasses = "bg-brand-glass backdrop-blur-lg border border-slate-700 rounded-xl p-6";
  
  let hoverClasses = "";
  if (hoverEffect) {
    hoverClasses = "transition-all duration-300 ease-in-out hover:shadow-lg hover:border-sky-600 hover:scale-[1.02]";
    if (hoverGradient) {
      // This specific gradient is for dark backgrounds. It might need adjustment if Card is used on light bg.
      hoverClasses += " group-hover:bg-gradient-to-br from-brand-secondary via-brand-secondary to-slate-800/70";
    } else {
      hoverClasses += " hover:shadow-brand-accent-blue/30"; // Keep original shadow if no gradient
    }
  }
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className} group`} // Added group class for potential group-hover usage
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
