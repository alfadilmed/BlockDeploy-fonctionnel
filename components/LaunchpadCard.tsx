
import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import { Rocket, Coins, Timer, ExternalLink, AlertCircle, Flame, Network, Tag as TagIcon } from 'lucide-react'; // Added AlertCircle, Flame, Network, TagIcon
import { LaunchpadProject, LaunchpadProjectStatus, CollectionStatusType } from '../../types';
import SpecialTagBadge from './launchpad/SpecialTagBadge';
import Chip from './launchpad/Chip';
import AnimatedProgressBar from './launchpad/AnimatedProgressBar';

interface LaunchpadCardProps {
  project: LaunchpadProject;
  index: number; // For staggered animation
  onViewProject: (project: LaunchpadProject) => void; // Callback to open modal
}

const StatusBadge: React.FC<{ status: LaunchpadProjectStatus }> = ({ status }) => {
  let bgColor = 'bg-slate-500/20';
  let textColor = 'text-slate-300';
  let borderColor = 'border-slate-600';
  let pulseClass = '';

  if (status === 'Live') {
    bgColor = 'bg-green-500/20';
    textColor = 'text-green-400'; // Brighter green for better contrast
    borderColor = 'border-green-500/50';
    pulseClass = 'animate-pulse';
  } else if (status === 'Coming Soon') {
    bgColor = 'bg-yellow-500/20';
    textColor = 'text-yellow-300';
    borderColor = 'border-yellow-500/50';
  } else if (status === 'Ended') {
    bgColor = 'bg-slate-600/40'; // Darker for ended
    textColor = 'text-slate-500'; // Muted text for ended
    borderColor = 'border-slate-700';
  }

  return (
    <span 
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${bgColor} ${textColor} ${borderColor} ${pulseClass}`}
      title={`Status: ${status}`}
    >
      {status}
    </span>
  );
};

const CollectionStatusDisplay: React.FC<{text?: string, type?: CollectionStatusType}> = ({ text, type}) => {
    if (!text) return null;

    let IconComponent = AlertCircle;
    let textColor = 'text-slate-400';

    switch(type) {
        case 'warning': IconComponent = AlertCircle; textColor = 'text-yellow-400'; break;
        case 'success': IconComponent = Flame; textColor = 'text-orange-400'; break; // Using Flame for "Hard Cap Soon" for visibility
        case 'info': IconComponent = Timer; textColor = 'text-sky-400'; break;
        default: IconComponent = AlertCircle; textColor = 'text-slate-400'; break;
    }

    return (
        <div className={`flex items-center text-xs ${textColor} font-medium ml-2`} title={text}>
            <IconComponent size={14} className="mr-1" />
            {text}
        </div>
    );
}


const LaunchpadCard: React.FC<LaunchpadCardProps> = ({ project, index, onViewProject }) => {
  const progress = Math.min((project.raisedAmount / project.targetAmount) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, type: "spring", stiffness: 100 }}
      className="h-full" // Ensure motion div takes full height for card to stretch
    >
      <Card 
        className="flex flex-col h-full bg-brand-secondary border-slate-700 group relative" // Added group and relative for special tag
        hoverEffect={true} // Enables scale, shadow, border changes from Card component
        hoverGradient={true} // Enable gradient on hover
      >
        {project.specialTag && <SpecialTagBadge tag={project.specialTag} />}
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt={`${project.name} logo`} className="w-12 h-12 rounded-lg mr-3 object-cover bg-slate-700"/>
            ) : (
              <div className="w-12 h-12 rounded-lg mr-3 bg-brand-accent-purple/10 flex items-center justify-center group-hover:bg-brand-accent-purple/20 transition-colors">
                <Rocket size={24} className="text-brand-accent-purple" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-brand-accent-purple transition-colors">{project.name}</h3>
              <StatusBadge status={project.status} />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 flex-grow min-h-[40px] line-clamp-2 group-hover:line-clamp-none transition-all duration-200" title={project.description}>
          {project.description}
        </p>

        {/* Funding Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-300">Progress ({progress.toFixed(0)}%)</span>
            <div className="flex items-center">
                 <Coins size={12} className="text-yellow-400 mr-1"/> 
                <span>{project.raisedAmount.toLocaleString()} / {project.targetAmount.toLocaleString()} {project.currency}</span>
                <CollectionStatusDisplay text={project.collectionStatusText} type={project.collectionStatusType}/>
            </div>
          </div>
          <AnimatedProgressBar value={progress} />
        </div>

        {/* End Date Info */}
        <div className="text-xs text-slate-500 mb-4 flex items-center" title={`Sale ends: ${project.endDateInfo}`}>
          <Timer size={14} className="mr-1.5" /> {project.endDateInfo}
        </div>

        {/* Chips for Networks & Categories */}
        {(project.networkChips || project.categoryChips) && (
          <div className="mb-4 space-y-1.5">
            {project.networkChips && project.networkChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.networkChips.map(chip => <Chip key={chip} label={chip} type="network" icon={<Network size={12}/>} />)}
              </div>
            )}
            {project.categoryChips && project.categoryChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.categoryChips.map(chip => <Chip key={chip} label={chip} type="category" icon={<TagIcon size={12}/>}/>)}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="secondary" 
          className="w-full mt-auto group-hover:shadow-neon-purple/60 transition-shadow duration-300" 
          iconRight={<ExternalLink size={16} />}
          onClick={() => onViewProject(project)}
        >
          View Project
        </Button>
      </Card>
    </motion.div>
  );
};

export default LaunchpadCard;
