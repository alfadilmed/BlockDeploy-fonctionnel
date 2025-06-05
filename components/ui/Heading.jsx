import React from 'react';

const Heading = ({ level = 1, children, className = '' }) => {
  const Tag = `h${level}`;
  let sizeClasses = '';
  switch (level) {
    case 1:
      sizeClasses = 'text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white';
      break;
    case 2:
      sizeClasses = 'text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100';
      break;
    case 3:
      sizeClasses = 'text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-200';
      break;
    case 4:
      sizeClasses = 'text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-300';
      break;
    case 5:
      sizeClasses = 'text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400';
      break;
    case 6:
      sizeClasses = 'text-base md:text-lg font-medium text-slate-600 dark:text-slate-400';
      break;
    default:
      sizeClasses = 'text-2xl font-semibold text-slate-700 dark:text-slate-200';
  }
  return <Tag className={`${sizeClasses} ${className}`}>{children}</Tag>;
};

export default Heading;
