
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
  const { wizardData, selectedTemplate, updateWizardData } = useWizardContext(); // Added updateWizardData
  const [isLoading, setIsLoading] = useState(false); // Renamed from isDeploying
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Renamed from error, typed for null

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
    setIsLoading(true); // Set loading true
    setErrorMessage(null); // Clear previous errors

    // Ensure selectedTemplate and wizardData are available
    if (!selectedTemplate || !wizardData.config || !wizardData.network) {
      setErrorMessage('Critical data missing. Please go back and complete previous steps.');
      setIsLoading(false);
      // Optional: navigate to an earlier step if critical data is missing
      // navigate(WIZARD_STEPS_CONFIG[0].path);
      return;
    }

    // Specifically for DAO type, call the multisig API
    if (selectedTemplate.name === 'DAO') { // Assuming ContractType.DAO is 'DAO'
      const { owners, threshold, daoName, ...otherConfig } = wizardData.config; // Include daoName
      const network = wizardData.network;

      // Validate essential DAO fields
      if (!owners || typeof owners !== 'string' || !threshold || isNaN(Number(threshold))) {
        setErrorMessage('Owners and Threshold are required for DAO creation and must be correctly formatted.');
        setIsLoading(false);
        return;
      }

      const ownerAddresses = owners.split(',').map(addr => addr.trim()).filter(addr => addr !== '');
      const numericThreshold = Number(threshold);

      if (ownerAddresses.length === 0) {
        setErrorMessage('At least one owner address is required.');
        setIsLoading(false);
        return;
      }
      if (numericThreshold <= 0 || numericThreshold > ownerAddresses.length) {
        setErrorMessage('Threshold must be a positive number and not greater than the number of owners.');
        setIsLoading(false);
        return;
      }

      const requestBody = {
        owners: ownerAddresses,
        threshold: numericThreshold,
        network: network,
        daoName: daoName || `My DAO on ${network}`, // Include daoName, fallback if not present
        // Potentially other config items like votingPeriod if API supports them
      };

      console.log('Attempting to deploy DAO with data:', requestBody);

      try {
        const response = await fetch('/api/v1/dao/multisig', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        let responseData;
        try {
          responseData = await response.json();
        } catch (parseError) {
          // If response is not JSON, use status text or a generic error
          if (!response.ok) {
            setErrorMessage(`Deployment failed: ${response.statusText || 'Server returned an invalid response.'}`);
            setIsLoading(false);
            return;
          }
          // If response.ok but not JSON (unlikely for this API but good practice)
          responseData = { message: 'Deployment successful, but server response was not in expected format.' };
        }

        console.log('API Response:', responseData);

        if (response.ok) {
          const { safeAddress, txHash, daoId, ...otherData } = responseData;
          updateWizardData({
            deploymentResult: {
              safeAddress,
              txHash,
              daoId,
              contractType: selectedTemplate.name,
              network: wizardData.network,
              name: wizardData.config.daoName || selectedTemplate.name,
              ...otherData // include any other relevant data from response
            }
          });
          navigate(WIZARD_STEPS_CONFIG.find(s => s.id === 'success')?.path || '/dashboard');
        } else {
          // API returned an error (e.g., 4xx, 5xx)
          setErrorMessage(`Deployment failed: ${responseData?.message || response.statusText || 'Unknown server error'}`);
        }
      } catch (networkError: any) {
        // Network errors (fetch itself failed)
        console.error('Network error during DAO deployment:', networkError);
        setErrorMessage(`An unexpected network error occurred: ${networkError.message || 'Please check your connection.'}`);
      } finally {
        setIsLoading(false); // Set loading false in finally
      }
    } else {
      // Fallback for other template types (original mock deployment)
      console.log('Deploying non-DAO contract with data:', wizardData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isSuccess = Math.random() > 0.1; // Simulate success/failure
      if (isSuccess) {
        updateWizardData({
          deploymentResult: {
            contractType: selectedTemplate.name,
            network: wizardData.network,
            name: wizardData.config.customParam || selectedTemplate.name, // Example
            contractAddress: `0xMock${Date.now().toString(16)}` // Mock address
          }
        });
        navigate(WIZARD_STEPS_CONFIG.find(s => s.id === 'success')?.path || '/dashboard');
      } else {
        setErrorMessage('Deployment of this contract type failed (mock error).');
        setIsLoading(false); // Also set loading false here
      }
    }
  };

  const handleBack = () => {
    navigate(WIZARD_STEPS_CONFIG[currentStepIndex - 1]?.path || WIZARD_STEPS_CONFIG[0].path);
  };

  // Use AlertBox component if available, otherwise simple div.
  // Assuming an AlertBox might look like: <AlertBox type="error" message={errorMessage} />
  const ErrorDisplay = errorMessage ? (
    <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm flex items-start">
      <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
      {errorMessage}
    </div>
  ) : null;

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

      {ErrorDisplay /* Display error message here */}

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-yellow-500/30">
            <h4 className="font-semibold text-yellow-400 flex items-center"><AlertTriangle size={18} className="mr-2"/> Important Notice</h4>
            <p className="text-sm text-yellow-300/80 mt-1">
                Deploying to a mainnet will incur real gas fees. Ensure you have sufficient funds in your connected wallet. Smart contract deployments are irreversible. Double-check all details carefully.
            </p>
        </div>
      </Card>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleDeploy} 
          isLoading={isLoading} // Use isLoading for Button's state
          disabled={isLoading} // Disable button when loading
          glowEffect="blue"
          iconLeft={<Zap size={18} />}
        >
          {isLoading ? 'Deploying...' : 'Confirm & Deploy'}
        </Button>
      </div>
    </div>
  );
};

export default WizardReviewPage;
