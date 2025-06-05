import React from 'react';
import { motion } from 'framer-motion';
import Button from '../Button'; // Assuming your Button component
import { Eye } from 'lucide-react';

interface ModulePreviewProps {
  imageSrc: string; // URL or path to mock image
  title: string;
  buttonLabel: string;
  onClickModal: () => void;
  className?: string;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({ imageSrc, title, buttonLabel, onClickModal, className }) => {
  return (
    <motion.div
      className={`bg-brand-secondary rounded-2xl shadow-xl border border-slate-700/80 overflow-hidden flex flex-col items-center p-6 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-semibold text-white mb-4 text-center">{title}</h3>
      <div className="w-full aspect-video bg-slate-700 rounded-lg mb-6 overflow-hidden shadow-inner relative">
        <img 
          src={imageSrc} 
          alt={`${title} Preview`} 
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] hover:blur-none" 
        />
         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Eye size={48} className="text-slate-400 opacity-50" />
        </div>
      </div>
      <Button 
        variant="secondary" 
        size="lg" 
        onClick={onClickModal}
        glowEffect="purple"
      >
        {buttonLabel}
      </Button>
    </motion.div>
  );
};

export default ModulePreview;