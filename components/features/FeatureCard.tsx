import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react'; // Import LucideProps

interface FeatureCardProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; // Specific type for Lucide icons
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, className }) => {
  return (
    <motion.div
      className={`bg-brand-secondary p-6 rounded-2xl shadow-xl border border-slate-700/80 transform transition-all duration-300 hover:scale-105 hover:border-brand-accent-blue/70 hover:shadow-brand-accent-blue/20 flex flex-col items-center text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-3 bg-brand-accent-blue/10 rounded-full mb-4 group-hover:bg-brand-accent-blue/20 transition-colors">
        <Icon size={32} className="text-brand-accent-blue" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;