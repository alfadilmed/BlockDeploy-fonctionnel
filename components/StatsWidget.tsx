
import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'; // For trend indication

interface StatsWidgetProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | null;
  trendValue?: string; // e.g., "+5.2%"
  period?: string; // e.g., "vs last month"
  link?: string;
  linkText?: string;
  className?: string;
  iconBgColorClass?: string; // e.g., 'bg-green-500/20'
  iconColorClass?: string; // e.g., 'text-green-400'
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  label,
  value,
  icon,
  trend = null,
  trendValue,
  period,
  link,
  linkText = 'View details',
  className = '',
  iconBgColorClass = 'bg-brand-accent-blue/20',
  iconColorClass = 'text-brand-accent-blue'
}) => {
  return (
    <Card className={`bg-brand-secondary border-slate-700/70 ${className}`}>
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm text-slate-400">{label}</p>
        {icon && (
          <div className={`p-2.5 rounded-lg ${iconBgColorClass} ${iconColorClass}`}>
            {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      
      {trend && trendValue && (
        <div className="flex items-center text-xs">
          {trend === 'up' && <ArrowUpRight size={14} className="text-green-500 mr-1" />}
          {trend === 'down' && <ArrowDownRight size={14} className="text-red-500 mr-1" />}
          <span className={`${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'} font-medium`}>
            {trendValue}
          </span>
          {period && <span className="text-slate-500 ml-1">{period}</span>}
        </div>
      )}

      {link && (
        <a href={link} className="text-xs text-brand-accent-blue hover:underline mt-3 block">
          {linkText}
        </a>
      )}
    </Card>
  );
};

export default StatsWidget;