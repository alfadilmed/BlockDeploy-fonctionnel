
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizardContext } from '../../contexts/WizardContext';
import { WIZARD_STEPS_CONFIG } from '../../constants';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import Card from '../../components/Card';
import { Zap, Edit3, AlertTriangle } from 'lucide-react';

const ReviewItem: React.FC<{ label: string; value: React.ReactNode; onEdit?: () => void }> = ({ label, value, onEdit }) => (
  <div className="py-3 border-b border-slate-700 last:border-b-0 flex justify-between items-start">
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-slate-100 font-medium">{typeof value === 'object' ? JSON.stringify(value) : value?.toString() || 'Not set'}</p>
    </div>
    {onEdit && (
      <Button variant="ghost" size="sm" onClick={onEdit} className="text-brand-accent-blue hover:text-sky-300">
        <Edit3 size={16} className="mr-1" /> Edit
      </Button>
    )}
  </div>
);

const WizardReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { wizardData, selectedTemplate } = useWizardContext();
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState('');

  const currentStepIndex = WIZARD_STEPS_CONFIG.findIndex(step => step.id === 'review');

  React.useEffect(() => {
    if (!selectedTemplate || !wizardData.config || !wizardData.network) {
      navigate(WIZARD_STEPS_CONFIG[0].path); // Redirect if essential data is missing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate, wizardData, navigate]);

  if (!selectedTemplate || !wizardData.config || !wizardData.network) {
    return <div className="text-center p-8">Loading review details or redirecting...</div>;
  }

  const handleDeploy = async () => {
    setIsDeploying(true);
    setError('');
    // Simulate deployment API call
    console.log('Deploying with data:', wizardData);
    await new Promise(resolve => setTimeout(resolve, 2500)); 

    // Mock success/failure
    const isSuccess = Math.random() > 0.2; // 80% success rate for demo
    if (isSuccess) {
      // On successful deployment, you might get a contract address back
      // For now, just navigate to success page
      navigate(WIZARD_STEPS_CONFIG[currentStepIndex + 1]?.path || '/dashboard');
    } else {
      setError('Deployment failed. Mock error: Insufficient funds or network congestion. Please try again.');
      setIsDeploying(false);
    }
  };

  const handleBack = () => {
    navigate(WIZARD_STEPS_CONFIG[currentStepIndex - 1]?.path || WIZARD_STEPS_CONFIG[0].path);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentStep={currentStepIndex} totalSteps={WIZARD_STEPS_CONFIG.length} stepNames={WIZARD_STEPS_CONFIG.map(s => s.name)} />
      <Card className="bg-brand-secondary border-slate-700">
        <div className="flex items-center mb-6">
          <Zap size={32} className="text-brand-accent-blue mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-white">Review & Deploy</h1>
            <p className="text-slate-400">Please confirm all details before deploying your smart contract.</p>
          </div>
        </div>

        <div className="space-y-1">
          <ReviewItem 
            label="Contract Template" 
            value={selectedTemplate.name} 
            onEdit={() => navigate(WIZARD_STEPS_CONFIG.find(s => s.id === 'template')?.path)} 
          />
          <ReviewItem 
            label="Deployment Network" 
            value={wizardData.network} 
            onEdit={() => navigate(WIZARD_STEPS_CONFIG.find(s => s.id === 'network')?.path)}
          />
          <h3 className="text-lg font-semibold text-slate-200 pt-4 pb-2">Configuration Details:</h3>
          {Object.entries(wizardData.config).map(([key, value]) => (
            <ReviewItem 
              key={key} 
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} // Format key for display
              value={value} 
              onEdit={() => navigate(WIZARD_STEPS_CONFIG.find(s => s.id === 'config')?.path)}
            />
          ))}
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm flex items-start">
            <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-yellow-500/30">
            <h4 className="font-semibold text-yellow-400 flex items-center"><AlertTriangle size={18} className="mr-2"/> Important Notice</h4>
            <p className="text-sm text-yellow-300/80 mt-1">
                Deploying to a mainnet will incur real gas fees. Ensure you have sufficient funds in your connected wallet. Smart contract deployments are irreversible. Double-check all details carefully.
            </p>
        </div>
      </Card>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isDeploying}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleDeploy} 
          isLoading={isDeploying} 
          disabled={isDeploying} 
          glowEffect="blue"
          iconLeft={<Zap size={18} />}
        >
          {isDeploying ? 'Deploying...' : 'Confirm & Deploy'}
        </Button>
      </div>
    </div>
  );
};

export default WizardReviewPage;
