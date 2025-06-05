
import React from 'react';

interface ChipProps {
  label: string;
  type: 'network' | 'category';
  icon?: React.ReactNode;
}

const Chip: React.FC<ChipProps> = ({ label, type, icon }) => {
  let chipClasses = '';

  if (type === 'network') {
    chipClasses = 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20';
  } else if (type === 'category') {
    chipClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20';
  } else {
    chipClasses = 'bg-slate-600/50 text-slate-300 border-slate-500/30 hover:bg-slate-600';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${chipClasses}`}
      title={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${label}`}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </span>
  );
};

export default Chip;
