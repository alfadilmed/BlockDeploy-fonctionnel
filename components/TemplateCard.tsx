
import React from 'react';
import { ContractTemplate } from '../types';
import Card from './Card';
import Button from './Button'; // Assuming Button component exists
import { Tag } from 'lucide-react';

interface TemplateCardProps {
  template: ContractTemplate;
  onUse: () => void;
  className?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse, className = '' }) => {
  return (
    <Card 
      onClick={onUse} 
      hoverEffect={true} 
      className={`flex flex-col bg-slate-800/70 border-slate-700 hover:border-brand-accent-blue transition-all duration-200 ${className}`}
      aria-label={`Use ${template.name} template`}
    >
      <div className="flex items-center mb-3">
        <template.icon size={32} className="mr-3 text-brand-accent-purple flex-shrink-0" />
        <h3 className="text-xl font-semibold text-white leading-tight">{template.name}</h3>
      </div>
      <p className="text-sm text-slate-400 mb-3 flex-grow min-h-[3rem]">{template.description}</p>
      
      {template.tags && template.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map(tag => ( // Show max 3 tags
            <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full flex items-center">
              <Tag size={12} className="mr-1 opacity-70" /> {tag}
            </span>
          ))}
        </div>
      )}
      
      <Button variant="secondary" size="sm" onClick={onUse} className="mt-auto w-full">
        Use Template
      </Button>
    </Card>
  );
};

export default TemplateCard;
