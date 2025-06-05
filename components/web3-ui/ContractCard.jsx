import React from 'react';
import { FileJson, CalendarDays, Zap, Tag } from 'lucide-react';

const ContractCard = ({
  contractName = "My Awesome NFT",
  contractType = "ERC-721",
  deploymentDate = "2024-07-28",
  onUseClick,
  icon: Icon = FileJson,
  tags = ["Collectible", "Art"],
  description = "A brief description of this contract, its purpose, or key features. This can be customized."
}) => {
  return (
    <div 
      className="bg-brand-glass backdrop-blur-md border border-slate-700 rounded-xl shadow-lg p-5 hover:border-brand-accent-purple/70 hover:shadow-brand-accent-purple/20 transition-all duration-300 ease-in-out flex flex-col h-full group"
      role="article"
      aria-labelledby={`contract-name-${contractName.replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start mb-3">
        <div className="p-2 bg-brand-accent-purple/20 rounded-lg mr-3 group-hover:bg-brand-accent-purple/30 transition-colors">
          <Icon size={24} className="text-brand-accent-purple" />
        </div>
        <div>
          <h3 id={`contract-name-${contractName.replace(/\s+/g, '-')}`} className="text-lg font-semibold text-white leading-tight">{contractName}</h3>
          <p className="text-xs text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded-full inline-block">{contractType}</p>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 mb-2 space-y-1">
        <div className="flex items-center">
          <CalendarDays size={14} className="mr-1.5 text-slate-500" />
          Deployed: {deploymentDate}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full flex items-center">
               <Tag size={10} className="mr-1 opacity-70"/> {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-slate-300 mb-4 flex-grow min-h-[3rem]">
        {description}
      </p>

      <button
        type="button"
        onClick={onUseClick}
        className="w-full mt-auto bg-brand-accent-purple hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-brand-secondary flex items-center justify-center group-hover:shadow-neon-purple/50"
        aria-label={`Use ${contractName} template`}
      >
        <Zap size={16} className="mr-2" />
        Use Template
      </button>
    </div>
  );
};

export default ContractCard;