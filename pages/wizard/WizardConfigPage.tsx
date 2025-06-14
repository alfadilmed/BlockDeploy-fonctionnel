
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
        { id: 'owners', label: 'Owner Addresses (comma-separated)', placeholder: '0xaddress1,0xaddress2,...', required: true },
        { id: 'threshold', label: 'Signature Threshold', type: 'number', placeholder: 'e.g., 2', required: true },
        { id: 'network', label: 'Network (e.g., sepolia, polygon)', placeholder: 'sepolia', required: true },
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
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && (!formState[field.id] || formState[field.id].toString().trim() === '')) {
        newErrors[field.id] = `${field.label} is required.`;
      }
      // Specific validation for number fields that are not DAO threshold
      if (field.type === 'number' && field.id !== 'threshold' && formState[field.id] && (isNaN(Number(formState[field.id])) || Number(formState[field.id]) <= 0)) {
        newErrors[field.id] = `${field.label} must be a positive number.`;
      }
    });

    if (selectedTemplate?.name === ContractType.DAO) {
      // DAO specific validations
      const ownersValue = formState.owners || '';
      const owners = ownersValue.split(',').map((addr: string) => addr.trim()).filter((addr: string) => addr !== '');
      if (owners.length === 0) {
        newErrors.owners = 'At least one owner address is required.';
      } else {
        const invalidAddresses = owners.filter((addr: string) => !/^0x[a-fA-F0-9]{40}$/.test(addr));
        if (invalidAddresses.length > 0) {
          newErrors.owners = `Invalid Ethereum address format for: ${invalidAddresses.join(', ')}. Ensure addresses are comma-separated.`;
        }
      }

      const thresholdValue = formState.threshold;
      if (thresholdValue === undefined || thresholdValue === null || thresholdValue.toString().trim() === '') {
        newErrors.threshold = 'Signature Threshold is required.';
      } else {
        const thresholdNum = parseInt(thresholdValue, 10);
        if (isNaN(thresholdNum) || thresholdNum <= 0) {
          newErrors.threshold = 'Signature Threshold must be a positive integer.';
        } else if (owners.length > 0 && thresholdNum > owners.length) {
          newErrors.threshold = 'Signature Threshold cannot be greater than the number of owners.';
        }
      }

      if (!formState.network || formState.network.trim() === '') {
        newErrors.network = 'Network is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    if (selectedTemplate?.name === ContractType.DAO) {
      setLoading(true);
      setApiError(null);

      const ownersArray = formState.owners.split(',').map((owner: string) => owner.trim()).filter((owner: string) => owner);
      const thresholdInt = parseInt(formState.threshold, 10);

      // This check is also in validateForm, but good to have a specific guard here before API call
      if (isNaN(thresholdInt)) {
        setErrors(prev => ({...prev, threshold: 'Invalid threshold value. Must be a number.'}));
        setLoading(false);
        return;
      }

      const apiRequestBody = {
        owners: ownersArray,
        threshold: thresholdInt,
        network: formState.network,
        // daoName is not sent in the request body for this specific API
      };

      try {
        // TODO: Retrieve actual token if authentication is implemented
        const authToken = localStorage.getItem('jwtToken'); // Example: replace with actual token retrieval
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch('/api/v1/dao/multisig', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(apiRequestBody),
        });

        if (response.ok) {
          const result = await response.json();
          updateWizardData({
            config: formState, // Keep the current form config
            deploymentResult: {
              safeAddress: result.safeAddress, // from API
              txHash: result.txHash,      // from API
              daoId: result.daoId,       // from API
              name: formState.daoName, // from form
              network: formState.network, // from form
              contractType: selectedTemplate.name, // Should be ContractType.DAO
              // Any other fields needed by WizardSuccessPage can be added here
              // or handled by default in WizardSuccessPage if not present.
            }
          });
          navigate(WIZARD_STEPS_CONFIG[currentStepIndex + 1]?.path || '/dashboard');
        } else {
          const errorData = await response.json().catch(() => ({ message: 'DAO creation failed. Invalid JSON response.' }));
          setApiError(errorData.message || `DAO creation failed. Status: ${response.status}`);
        }
      } catch (error) {
        console.error('DAO Creation API call failed:', error);
        setApiError('DAO creation failed due to a network or unexpected error. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle other contract types
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
          {selectedTemplate.name === ContractType.DAO && (
            <div className="mt-4">
              {loading && <p className="text-brand-accent-blue">Creating DAO, please wait...</p>}
              {apiError && <p className="text-red-500">{apiError}</p>}
            </div>
          )}
        </form>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={loading}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext} disabled={loading} glowEffect={loading ? undefined : "blue"}>
          {loading ? 'Processing...' : 'Next: Choose Network'}
        </Button>
      </div>
    </div>
  );
};

export default WizardConfigPage;
