
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizardContext } from '../../contexts/WizardContext';
import { WIZARD_STEPS_CONFIG, AVAILABLE_NETWORKS } from '../../constants';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import Card from '../../components/Card';
import { Cpu, CheckCircle } from 'lucide-react';

const WizardNetworkPage: React.FC = () => {
  const navigate = useNavigate();
  const { wizardData, updateWizardData, selectedTemplate } = useWizardContext();
  const [selectedNetwork, setSelectedNetworkState] = useState<string>(wizardData.network || AVAILABLE_NETWORKS[0]);

  const currentStepIndex = WIZARD_STEPS_CONFIG.findIndex(step => step.id === 'network');
  
  useEffect(() => {
    if (!selectedTemplate || !wizardData.config || Object.keys(wizardData.config).length === 0) {
       // If template or config is missing, redirect to an earlier step
      navigate(WIZARD_STEPS_CONFIG[1].path); // Go to config step
      return;
    }
    if (wizardData.network) {
        setSelectedNetworkState(wizardData.network);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate, wizardData.config, navigate]);


  if (!selectedTemplate || !wizardData.config) {
    return <div className="text-center p-8">Loading configuration or redirecting...</div>;
  }

  const handleNext = () => {
    updateWizardData({ network: selectedNetwork });
    navigate(WIZARD_STEPS_CONFIG[currentStepIndex + 1]?.path || '/dashboard');
  };
  
  const handleBack = () => {
    updateWizardData({ network: selectedNetwork }); // Save current selection
    navigate(WIZARD_STEPS_CONFIG[currentStepIndex - 1]?.path || WIZARD_STEPS_CONFIG[0].path);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar currentStep={currentStepIndex} totalSteps={WIZARD_STEPS_CONFIG.length} stepNames={WIZARD_STEPS_CONFIG.map(s => s.name)} />
      <div className="bg-brand-secondary p-8 rounded-xl shadow-xl border border-slate-700">
        <div className="flex items-center mb-6">
          <Cpu size={32} className="text-brand-accent-blue mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-white">Choose Deployment Network</h1>
            <p className="text-slate-400">Select the blockchain where your contract will live.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {AVAILABLE_NETWORKS.map(network => (
            <Card 
              key={network} 
              onClick={() => setSelectedNetworkState(network)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between
                ${selectedNetwork === network ? 'border-brand-accent-blue bg-brand-accent-blue/10 shadow-neon-blue/20' : 'border-slate-700 hover:border-slate-500 bg-slate-800'}`}
            >
              <span className={`font-medium ${selectedNetwork === network ? 'text-brand-accent-blue' : 'text-slate-300'}`}>{network}</span>
              {selectedNetwork === network && <CheckCircle size={20} className="text-brand-accent-blue" />}
            </Card>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-6 text-center">
            Note: Testnets are for development and testing purposes only. Mainnet deployments involve real assets.
        </p>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext} glowEffect="blue">
          Next: Review & Deploy
        </Button>
      </div>
    </div>
  );
};

export default WizardNetworkPage;
