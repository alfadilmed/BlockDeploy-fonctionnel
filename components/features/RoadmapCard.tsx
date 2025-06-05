import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps, CalendarClock } from 'lucide-react';

interface RoadmapCardProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  title: string;
  description: string;
  status: string; // e.g., "Coming Soon"
  launchDate: string; // e.g., "Q3 2025"
  className?: string;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ icon: Icon, title, description, status, launchDate, className }) => {
  return (
    <motion.div
      className={`bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700/70 opacity-70 hover:opacity-100 transition-opacity duration-300 relative group ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 0.7, scale: 1 }} // Initial opacity to 0.7 for "grisé" effect
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      title={`Estimated Launch: ${launchDate}`}
    >
      <div className="flex items-center mb-3">
        <div className="p-2 bg-slate-700/60 rounded-full mr-3">
            <Icon size={24} className="text-slate-500 group-hover:text-brand-accent-purple transition-colors" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300 group-hover:text-white transition-colors">{title}</h3>
      </div>
      
      <p className="text-slate-400 text-sm mb-3 leading-relaxed">{description}</p>
      
      <div className="absolute top-3 right-3">
        <span className="px-2 py-0.5 text-xs font-medium text-yellow-300 bg-yellow-600/30 rounded-full border border-yellow-500/50">
          {status}
        </span>
      </div>
      <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors flex items-center mt-auto pt-2 border-t border-slate-700/50">
        <CalendarClock size={14} className="mr-1.5"/>
        Launching: {launchDate}
      </div>
    </motion.div>
  );
};

export default RoadmapCard;