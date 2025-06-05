import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface BenefitListItemProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  text: string;
  index: number; // For staggered animation
  className?: string;
}

const BenefitListItem: React.FC<BenefitListItemProps> = ({ icon: Icon, text, index, className }) => {
  return (
    <motion.li
      className={`flex items-center p-4 bg-brand-secondary/70 rounded-xl border border-slate-700/60 shadow-lg ${className}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="p-2.5 bg-brand-accent-purple/20 rounded-lg mr-4">
        <Icon size={24} className="text-brand-accent-purple" />
      </div>
      <span className="text-md font-medium text-slate-200">{text}</span>
    </motion.li>
  );
};

export default BenefitListItem;