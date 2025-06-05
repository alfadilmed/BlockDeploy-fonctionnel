
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WizardData, ContractTemplate } from '../types';

interface WizardContextType {
  wizardData: WizardData;
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
  updateWizardData: (data: Partial<WizardData>) => void;
  resetWizard: () => void;
  selectedTemplate: ContractTemplate | null;
  setSelectedTemplate: (template: ContractTemplate | null) => void;
  // You can add specific setters for each part of WizardData if preferred
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialWizardData: WizardData = {
  template: undefined,
  config: {},
  network: undefined,
};

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [selectedTemplate, setSelectedTemplateState] = useState<ContractTemplate | null>(null);


  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const resetWizard = () => {
    setWizardData(initialWizardData);
    setSelectedTemplateState(null);
  };

  const setSelectedTemplate = (template: ContractTemplate | null) => {
    setSelectedTemplateState(template);
    updateWizardData({ template: template || undefined });
  }

  return (
    <WizardContext.Provider value={{ wizardData, setWizardData, updateWizardData, resetWizard, selectedTemplate, setSelectedTemplate }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a WizardProvider');
  }
  return context;
};
