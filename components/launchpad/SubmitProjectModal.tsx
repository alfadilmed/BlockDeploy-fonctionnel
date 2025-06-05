
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select'; // Assuming you have a Select component

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({ isOpen, onClose }) => {
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-50px", opacity: 0, scale: 0.95 },
    visible: { y: "0px", opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { y: "30px", opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const MOCK_NETWORKS = [
    { value: 'eth', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'bsc', label: 'BNB Smart Chain' },
    { value: 'solana', label: 'Solana' },
  ];

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
            className="bg-brand-secondary w-full max-w-lg rounded-xl shadow-2xl border border-slate-700 p-6 md:p-8 overflow-y-auto max-h-[90vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Submit Your Project</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input id="projectName" label="Project Name" placeholder="e.g., My Awesome dApp" />
              <Select id="projectNetwork" label="Primary Network" options={MOCK_NETWORKS} placeholder="Select network" />
              <Input id="projectToken" label="Token Symbol (Optional)" placeholder="e.g., MYT" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="saleStartDate" label="Sale Start Date (Optional)" type="date" />
                <Input id="saleEndDate" label="Sale End Date (Optional)" type="date" />
              </div>

              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  id="projectDescription"
                  rows={3}
                  placeholder="Briefly describe your project..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue outline-none transition-colors duration-200"
                />
              </div>
              
              <div>
                <label htmlFor="projectLogo" className="block text-sm font-medium text-slate-300 mb-1">Project Logo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-10 w-10 text-slate-500" />
                    <div className="flex text-sm text-slate-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-brand-accent-blue hover:text-sky-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-brand-accent-blue px-1"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" disabled />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 2MB (Mock)</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" glowEffect="blue" disabled title="Submission is disabled in this demo">
                  Submit Project
                </Button>
              </div>
              <p className="text-xs text-slate-500 text-center">This is a simulated form. Submissions are not active.</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitProjectModal;
