import React from 'react';
import { FileJson, CalendarDays, Zap, Tag as TagIcon } from 'lucide-react'; // Renamed Tag to TagIcon
import ButtonPrimary from './ButtonPrimary'; // Using the new UI Kit button

const ContractCard = ({
  contractName = "My Awesome NFT",
  contractType = "ERC-721",
  deploymentDate = "2024-07-28",
  onUseClick,
  icon: Icon = FileJson, // Allow passing a Lucide icon component
  tags = ["Collectible", "Art"],
  description = "A brief description of this contract, its purpose, or key features."
}) => {
  return (
    <div 
      className="bg-white dark:bg-brand-glass backdrop-blur-md border border-slate-300 dark:border-slate-700 rounded-xl shadow-lg p-5 hover:border-purple-400 dark:hover:border-brand-accent-purple/70 hover:shadow-purple-500/10 dark:hover:shadow-brand-accent-purple/20 transition-all duration-300 ease-in-out flex flex-col h-full group"
      role="article"
      aria-labelledby={`contract-name-${contractName.replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start mb-3">
        <div className="p-2 bg-purple-100 dark:bg-brand-accent-purple/20 rounded-lg mr-3 group-hover:bg-purple-200 dark:group-hover:bg-brand-accent-purple/30 transition-colors">
          <Icon size={24} className="text-purple-600 dark:text-brand-accent-purple" />
        </div>
        <div>
          <h3 id={`contract-name-${contractName.replace(/\s+/g, '-')}`} className="text-lg font-semibold text-slate-800 dark:text-white leading-tight">{contractName}</h3>
          <p className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-1.5 py-0.5 rounded-full inline-block">{contractType}</p>
        </div>
      </div>
      
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 space-y-1">
        <div className="flex items-center">
          <CalendarDays size={14} className="mr-1.5 text-slate-400 dark:text-slate-500" />
          Deployed: {deploymentDate}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full flex items-center">
               <TagIcon size={10} className="mr-1 opacity-70"/> {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-grow min-h-[3rem]">
        {description}
      </p>

      <ButtonPrimary
        onClick={onUseClick}
        className="w-full mt-auto !bg-purple-600 hover:!bg-purple-700 dark:!bg-brand-accent-purple dark:hover:!bg-purple-600 focus:!ring-purple-500"
        aria-label={`Use ${contractName} template`}
        iconLeft={<Zap size={16} />}
      >
        Use Template
      </ButtonPrimary>
    </div>
  );
};

export default ContractCard;
