import React, { useState } from 'react';

// This is a VERY basic tooltip.
// For production, consider Radix UI Tooltip or Headless UI Tooltip for accessibility.
// This example uses simple CSS hover; a JS solution would be more robust for positioning and events.

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string; // For the wrapper
  tooltipClassName?: string; // For the tooltip bubble itself
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  tooltipClassName = '',
}) => {
  // Simplified position classes - Tailwind CSS would be used here
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom': return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left': return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right': return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default: return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className={`relative inline-flex group ${className}`}>
      {children}
      <div
        className={`absolute z-10 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${getPositionClasses()} ${tooltipClassName}`}
        role="tooltip"
      >
        {content}
        {/* Arrow (optional, more complex to position correctly with all variants) */}
        {/* <div className={`absolute w-2 h-2 bg-gray-900 rotate-45 ${getArrowPositionClasses()}`}></div> */}
      </div>
    </div>
  );
};

export { Tooltip };
export default Tooltip;
