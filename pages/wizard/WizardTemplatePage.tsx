
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizardContext } from '../../contexts/WizardContext';
import { CONTRACT_TEMPLATES_DATA, WIZARD_STEPS_CONFIG } from '../../constants';
import { ContractTemplate } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';

const WizardTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedTemplate, resetWizard } = useWizardContext();

  const currentStepIndex = WIZARD_STEPS_CONFIG.findIndex(step => step.id === 'template');

  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    navigate(WIZARD_STEPS_CONFIG[currentStepIndex + 1]?.path || '/dashboard'); // Navigate to config step
  };
  
  React.useEffect(() => {
    resetWizard(); // Reset wizard data when landing on the first step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="max-w-4xl mx-auto">
      <ProgressBar currentStep={currentStepIndex} totalSteps={WIZARD_STEPS_CONFIG.length} stepNames={WIZARD_STEPS_CONFIG.map(s => s.name)} />
      <h1 className="text-3xl font-bold text-white mb-4 text-center">Choose Your Smart Contract Template</h1>
      <p className="text-slate-400 mb-10 text-center">
        Select a pre-built, audited template to kickstart your Web3 project.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONTRACT_TEMPLATES_DATA.map(template => (
          <Card 
            key={template.id} 
            className="text-center bg-slate-800/70 border-slate-700 hover:border-brand-accent-blue transition-all duration-200 cursor-pointer flex flex-col"
            onClick={() => handleSelectTemplate(template)}
            hoverEffect
          >
            <template.icon size={48} className="mx-auto mb-4 text-brand-accent-purple" />
            <h2 className="text-xl font-semibold text-white mb-2">{template.name}</h2>
            <p className="text-sm text-slate-400 mb-4 flex-grow">{template.description}</p>
            <Button variant="secondary" size="sm" className="mt-auto w-full">
              Select {template.name}
            </Button>
          </Card>
        ))}
      </div>
       <div className="mt-12 text-center">
        <Button variant="outline" onClick={() => navigate('/dashboard/templates')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default WizardTemplatePage;
