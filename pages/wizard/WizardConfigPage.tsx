
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizardContext } from '../../contexts/WizardContext';
import { WIZARD_STEPS_CONFIG } from '../../constants';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { ContractType } from '../../types';
import { Settings, Info } from 'lucide-react';

// Example: Define fields based on template type
const getFieldsForTemplate = (templateName?: ContractType) => {
  switch (templateName) {
    case ContractType.ERC20:
      return [
        { id: 'tokenName', label: 'Token Name', placeholder: 'e.g., My Awesome Token', required: true },
        { id: 'tokenSymbol', label: 'Token Symbol', placeholder: 'e.g., MAT', required: true },
        { id: 'initialSupply', label: 'Initial Supply', type: 'number', placeholder: 'e.g., 1000000', required: true },
        { id: 'decimals', label: 'Decimals', type: 'number', placeholder: 'e.g., 18', defaultValue: 18, required: true },
      ];
    case ContractType.NFT:
      return [
        { id: 'collectionName', label: 'Collection Name', placeholder: 'e.g., CryptoPunks V2', required: true },
        { id: 'collectionSymbol', label: 'Collection Symbol', placeholder: 'e.g., CPV2', required: true },
        { id: 'baseURI', label: 'Base URI (for metadata)', placeholder: 'ipfs://your_folder_cid/', required: false },
      ];
    case ContractType.DAO:
        return [
            { id: 'daoName', label: 'DAO Name', placeholder: 'e.g., My Community DAO', required: true },
            { id: 'votingTokenAddress', label: 'Voting Token Address (Optional)', placeholder: '0x...', required: false },
            { id: 'votingPeriod', label: 'Voting Period (days)', type: 'number', placeholder: 'e.g., 7', required: true },
            { id: 'quorumPercentage', label: 'Quorum (% required to pass)', type: 'number', placeholder: 'e.g., 51', required: true },
        ];
    default:
      return [{ id: 'customParam', label: 'Custom Parameter', placeholder: 'Enter value' }];
  }
};


const WizardConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { wizardData, updateWizardData, selectedTemplate } = useWizardContext();
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStepIndex = WIZARD_STEPS_CONFIG.findIndex(step => step.id === 'config');

  useEffect(() => {
    if (!selectedTemplate) {
      navigate(WIZARD_STEPS_CONFIG[0].path); // Redirect to template selection if no template
      return;
    }
    // Initialize formState with existing wizardData.config or defaults from template fields
    const initialConfig = {...wizardData.config};
    const fields = getFieldsForTemplate(selectedTemplate.name);
    fields.forEach(field => {
        if (initialConfig[field.id] === undefined && field.defaultValue !== undefined) {
            initialConfig[field.id] = field.defaultValue;
        }
    });
    setFormState(initialConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate, navigate]);
  

  if (!selectedTemplate) {
    return <div className="text-center p-8">Redirecting to template selection...</div>;
  }

  const fields = getFieldsForTemplate(selectedTemplate.name);

  const handleChange = (id: string, value: any) => {
    setFormState(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({...prev, [id]: ''}));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && (!formState[field.id] || formState[field.id].toString().trim() === '')) {
        newErrors[field.id] = `${field.label} is required.`;
      }
      // Add more specific validations here if needed
      if (field.type === 'number' && formState[field.id] && isNaN(Number(formState[field.id]))) {
        newErrors[field.id] = `${field.label} must be a number.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateWizardData({ config: formState });
      navigate(WIZARD_STEPS_CONFIG[currentStepIndex + 1]?.path || '/dashboard');
    }
  };

  const handleBack = () => {
    updateWizardData({ config: formState }); // Save current state before going back
    navigate(WIZARD_STEPS_CONFIG[currentStepIndex - 1]?.path || WIZARD_STEPS_CONFIG[0].path);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentStep={currentStepIndex} totalSteps={WIZARD_STEPS_CONFIG.length} stepNames={WIZARD_STEPS_CONFIG.map(s => s.name)} />
      <div className="bg-brand-secondary p-8 rounded-xl shadow-xl border border-slate-700">
        <div className="flex items-center mb-6">
          <Settings size={32} className="text-brand-accent-blue mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-white">Configure Your {selectedTemplate.name}</h1>
            <p className="text-slate-400">Fill in the details for your new smart contract.</p>
          </div>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {fields.map(field => (
            <Input
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={formState[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              error={errors[field.id]}
              required={field.required}
            />
          ))}
        </form>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext} glowEffect="blue">
          Next: Choose Network
        </Button>
      </div>
    </div>
  );
};

export default WizardConfigPage;
