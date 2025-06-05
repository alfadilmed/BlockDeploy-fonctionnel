import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 24, className = '', colorClassName = 'text-brand-accent-blue' }) => {
  return (
    <Loader2
      size={size}
      className={`animate-spin ${colorClassName} ${className}`}
      aria-label="Loading"
    />
  );
};

export default Spinner;
