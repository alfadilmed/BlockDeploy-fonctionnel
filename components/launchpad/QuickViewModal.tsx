
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Users, MessageSquare, Link as LinkIcon, BarChart2, CheckCircle, ListChecks } from 'lucide-react';
import { LaunchpadProject } from '../../types';
import Button from '../Button';
import AnimatedProgressBar from './AnimatedProgressBar';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: LaunchpadProject | null;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, project }) => {
  if (!project) return null;

  const progress = Math.min((project.raisedAmount / project.targetAmount) * 100, 100);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-50px", opacity: 0, scale: 0.95 },
    visible: { y: "0px", opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { y: "30px", opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-brand-secondary w-full max-w-2xl rounded-xl shadow-2xl border border-slate-700 p-6 md:p-8 overflow-y-auto max-h-[90vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                {project.logoUrl ? (
                  <img src={project.logoUrl} alt={`${project.name} logo`} className="w-16 h-16 rounded-lg mr-4 object-cover bg-slate-700"/>
                ) : (
                  <div className="w-16 h-16 rounded-lg mr-4 bg-brand-accent-purple/10 flex items-center justify-center">
                    <Rocket size={32} className="text-brand-accent-purple" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                  <p className="text-sm text-slate-400">{project.status} - {project.endDateInfo}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center text-sm text-slate-300 mb-1">
                    <span>Raised: <strong className="text-white">{project.raisedAmount.toLocaleString()} {project.currency}</strong></span>
                    <span>Target: <strong className="text-white">{project.targetAmount.toLocaleString()} {project.currency}</strong></span>
                </div>
                <AnimatedProgressBar value={progress} />
                <p className="text-right text-xs text-slate-400 mt-1">{progress.toFixed(1)}% Funded</p>
            </div>
            
            <div className="space-y-4 text-slate-300">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700 pb-2 mb-2">Project Details</h3>
              <p className="text-sm leading-relaxed">{project.detailedDescription || project.description}</p>

              {project.projectGoals && project.projectGoals.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center"><ListChecks size={18} className="mr-2 text-brand-accent-blue"/>Key Objectives:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                    {project.projectGoals.map((goal, i) => <li key={i}>{goal}</li>)}
                  </ul>
                </div>
              )}

              {project.tokenomics && project.tokenomics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center"><BarChart2 size={18} className="mr-2 text-brand-accent-purple"/>Tokenomics Highlights:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {project.tokenomics.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-slate-400">{item.name}:</span>
                        <span className="font-medium text-slate-200">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.socialLinks && project.socialLinks.length > 0 && (
                <div className="pt-4 border-t border-slate-700 mt-6">
                  <h4 className="font-semibold text-slate-200 mb-2">Connect:</h4>
                  <div className="flex flex-wrap gap-3">
                    {project.socialLinks.map(link => (
                      <a 
                        key={link.platform} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title={`Visit ${project.name} on ${link.platform}`}
                        className="flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                      >
                        <link.icon size={16} className="mr-1.5"/> {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 text-right">
              <Button variant="primary" onClick={onClose} glowEffect="blue">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
