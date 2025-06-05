
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWizardContext } from '../../contexts/WizardContext';
import { WIZARD_STEPS_CONFIG } from '../../constants';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, Copy, ExternalLink, PartyPopper } from 'lucide-react';

const WizardSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { wizardData, selectedTemplate, resetWizard } = useWizardContext();

  const currentStepIndex = WIZARD_STEPS_CONFIG.findIndex(step => step.id === 'success');
  
  // Mock contract address and explorer link
  const mockContractAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const networkExplorerBaseUrl = wizardData.network?.toLowerCase().includes('ethereum') ? 'https://etherscan.io/address/' : 
                                 wizardData.network?.toLowerCase().includes('polygon') ? 'https://polygonscan.com/address/' :
                                 wizardData.network?.toLowerCase().includes('bnb') ? 'https://bscscan.com/address/' :
                                 '#'; // Fallback

  const explorerLink = `${networkExplorerBaseUrl}${mockContractAddress}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!'); // Replace with a proper toast notification
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
  
  React.useEffect(() => {
    // Typically, you wouldn't reset the wizard immediately here
    // but after the user navigates away or starts a new deployment.
    // For this example, we'll keep the data for display.
    // resetWizard(); // Uncomment if you want to clear data on viewing this page.
    
    // Redirect if crucial data is missing (e.g., user landed here directly)
    if (!selectedTemplate || !wizardData.config || !wizardData.network) {
      navigate(WIZARD_STEPS_CONFIG[0].path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!selectedTemplate || !wizardData.config || !wizardData.network) {
    return <div className="text-center p-8">Loading deployment details or redirecting...</div>;
  }


  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Minimal progress bar indicating completion */}
      <div className="w-full my-8">
        <div className="flex justify-center items-center mb-2">
            <PartyPopper size={64} className="text-green-400 animate-bounce"/>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" style={{ width: `100%` }}></div>
        </div>
      </div>

      <Card className="bg-brand-secondary border-slate-700">
        <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
        <h1 className="text-3xl font-bold text-white mb-3">Deployment Successful!</h1>
        <p className="text-slate-300 mb-6">
          Your <strong>{selectedTemplate.name}</strong> contract has been successfully deployed on the <strong>{wizardData.network}</strong> network.
        </p>

        <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Contract Address:</p>
          <div className="flex items-center justify-between">
            <code className="text-brand-accent-blue text-sm break-all">{mockContractAddress}</code>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(mockContractAddress)} className="ml-2">
              <Copy size={16} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
            <Button 
              variant="primary" 
              glowEffect="blue"
              onClick={() => window.open(explorerLink, '_blank')}
              iconRight={<ExternalLink size={16}/>}
            >
              View on Explorer
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                resetWizard();
                navigate('/dashboard/deployments');
              }}
            >
              View My Deployments
            </Button>
        </div>
      </Card>
      
      <div className="mt-10">
        <Button 
            variant="secondary" 
            glowEffect="purple"
            onClick={() => {
              resetWizard();
              navigate('/wizard/template');
            }}
        >
          Deploy Another Contract
        </Button>
      </div>
    </div>
  );
};

export default WizardSuccessPage;
