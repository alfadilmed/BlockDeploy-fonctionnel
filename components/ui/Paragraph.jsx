import React from 'react';

const Paragraph = ({ variant = 'normal', children, className = '' }) => {
  let styleClasses = '';
  switch (variant) {
    case 'muted':
      styleClasses = 'text-slate-500 dark:text-slate-400';
      break;
    case 'small':
      styleClasses = 'text-sm text-slate-600 dark:text-slate-300';
      break;
    case 'lead':
      styleClasses = 'text-lg text-slate-700 dark:text-slate-300';
      break;
    case 'normal':
    default:
      styleClasses = 'text-base text-slate-700 dark:text-slate-200 leading-relaxed';
      break;
  }
  return <p className={`${styleClasses} ${className}`}>{children}</p>;
};

export default Paragraph;
