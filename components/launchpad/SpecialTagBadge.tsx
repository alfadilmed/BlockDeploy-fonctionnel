
import React from 'react';
import { Flame, Sparkles, Star } from 'lucide-react';
import { LaunchpadSpecialTag } from '../../types';

interface SpecialTagBadgeProps {
  tag: LaunchpadSpecialTag;
}

const SpecialTagBadge: React.FC<SpecialTagBadgeProps> = ({ tag }) => {
  let IconComponent;
  let bgColor;
  let textColor;
  let text;

  switch (tag) {
    case 'Trending':
      IconComponent = Flame;
      bgColor = 'bg-orange-500/20';
      textColor = 'text-orange-400';
      text = 'Trending';
      break;
    case 'New':
      IconComponent = Sparkles;
      bgColor = 'bg-sky-500/20';
      textColor = 'text-sky-400';
      text = 'New';
      break;
    case 'Featured':
      IconComponent = Star;
      bgColor = 'bg-yellow-500/20';
      textColor = 'text-yellow-400';
      text = 'Featured';
      break;
    default:
      return null;
  }

  return (
    <div className={`absolute top-2.5 right-2.5 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor} border border-current/50 shadow-md`}>
      <IconComponent size={14} className="mr-1" />
      {text}
    </div>
  );
};

export default SpecialTagBadge;
