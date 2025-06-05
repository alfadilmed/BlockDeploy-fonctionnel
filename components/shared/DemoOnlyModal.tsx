import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import Button from '../Button'; // Assuming Button component exists

interface DemoOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const DemoOnlyModal: React.FC<DemoOnlyModalProps> = ({ 
  isOpen, 
  onClose,
  title = "Demo Only",
  message = "This feature is for demonstration purposes only and is not currently active." 
}) => {
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-30px", opacity: 0, scale: 0.95 },
    visible: { y: "0px", opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { y: "30px", opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-brand-secondary w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 p-6 md:p-8 text-center"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-accent-blue/20 mb-4">
              <Info size={28} className="text-brand-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6">{message}</p>
            <Button variant="primary" onClick={onClose} className="w-full sm:w-auto" glowEffect="blue">
              Understood
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoOnlyModal;