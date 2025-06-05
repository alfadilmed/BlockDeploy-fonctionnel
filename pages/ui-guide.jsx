import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // If needed for internal links, but style guide is mostly static.
import { Home, Settings, User, Search as SearchIcon, Mail, Lock, ChevronDown, Bell, Check, Package, Users, CircleDollarSign, AlertTriangle as AlertTriangleIcon, Info as InfoIcon, X } from 'lucide-react'; // Renamed some imports

// Typography
import Heading from '../components/ui/Heading';
import Paragraph from '../components/ui/Paragraph';

// Buttons
import ButtonPrimary from '../components/ui/ButtonPrimary';
import ButtonSecondary from '../components/ui/ButtonSecondary';
import IconButton from '../components/ui/IconButton';

// Inputs
import InputText from '../components/ui/InputText';
import InputWithIcon from '../components/ui/InputWithIcon';
import SelectDropdown from '../components/ui/SelectDropdown';

// Feedback
import AlertBox from '../components/ui/AlertBox';
import ToastMock from '../components/ui/ToastMock';
import Spinner from '../components/ui/Spinner';

// Web3 UI
import WalletConnectButton from '../components/ui/WalletConnectButton';
import NetworkStatusBadge from '../components/ui/NetworkStatusBadge';
import TxStatusBadge from '../components/ui/TxStatusBadge';
import TokenBadge from '../components/ui/TokenBadge';

// Cards & Blocks
import ContractCard from '../components/ui/ContractCard';
import StepProgress from '../components/ui/StepProgress';
import GasFeeEstimator from '../components/ui/GasFeeEstimator';

const Section = ({ title, children, className = '' }) => (
  <section className={`mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 ${className}`}>
    <Heading level={2} className="mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 !text-slate-700 dark:!text-slate-200">{title}</Heading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {children}
    </div>
  </section>
);

const DemoArea = ({ children, className='' }) => (
    <div className={`space-y-4 p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-md ${className}`}>
        {children}
    </div>
);


const UIGuidePage = () => {
  const [textInputValue, setTextInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [currentStep, setCurrentStep] = useState(1);


  const triggerToast = (type, title, message) => {
    setToastProps({ type, title, message, isVisible: true, onClose: () => setShowToast(false) });
    setShowToast(true); // This will manage visibility prop for ToastMock
  };
  
  React.useEffect(() => {
    // Apply light theme specific for this page
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-brand-primary', 'text-slate-200');
    document.body.classList.add('bg-slate-50', 'text-slate-900'); // fond clair

    return () => {
      // Restore dark theme when leaving the page
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-brand-primary', 'text-slate-200');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    };
  }, []);


  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="mb-10 text-center">
        <Heading level={1} className="!text-brand-accent-blue dark:!text-brand-accent-blue">BlockDeploy UI Style Guide</Heading>
        <Paragraph variant="lead" className="!text-slate-600 dark:!text-slate-400">A showcase of static UI components for the BlockDeploy platform.</Paragraph>
      </header>
      
      <ToastMock {...toastProps} isVisible={showToast} onClose={() => setShowToast(false)} />

      <Section title="Typography">
        <DemoArea>
          <Heading level={1}>Heading 1 (Primary)</Heading>
          <Heading level={2}>Heading 2 (Section Title)</Heading>
          <Heading level={3}>Heading 3 (Sub-Section)</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </DemoArea>
        <DemoArea>
          <Paragraph variant="lead">Lead Paragraph: For introductory text or important summaries. Stands out slightly more.</Paragraph>
          <Paragraph>Normal Paragraph: This is the standard text style for most content. It should be clear, readable, and well-spaced. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Paragraph>
          <Paragraph variant="muted">Muted Paragraph: For less important text, hints, or secondary information. Often a lighter shade.</Paragraph>
          <Paragraph variant="small">Small Paragraph: For fine print, captions, or disclaimers. Use sparingly.</Paragraph>
        </DemoArea>
      </Section>

      <Section title="Buttons">
        <DemoArea>
            <Heading level={4} className="mb-2">Primary Buttons</Heading>
            <ButtonPrimary onClick={() => alert('Primary Clicked!')}>Primary Action</ButtonPrimary>
            <ButtonPrimary iconLeft={<Check size={18} />}>With Left Icon</ButtonPrimary>
            <ButtonPrimary iconRight={<Home size={18} />}>With Right Icon</ButtonPrimary>
            <ButtonPrimary disabled>Disabled Primary</ButtonPrimary>
        </DemoArea>
         <DemoArea>
            <Heading level={4} className="mb-2">Secondary Buttons</Heading>
            <ButtonSecondary onClick={() => alert('Secondary Clicked!')}>Secondary Action</ButtonSecondary>
            <ButtonSecondary iconLeft={<Settings size={18} />}>With Icon</ButtonSecondary>
            <ButtonSecondary disabled>Disabled Secondary</ButtonSecondary>
        </DemoArea>
        <DemoArea>
            <Heading level={4} className="mb-2">Icon Buttons</Heading>
            <div className="flex space-x-2">
                <IconButton icon={<Home size={20} />} aria-label="Home" onClick={() => alert('Home icon clicked')} />
                <IconButton icon={<Settings size={20} />} aria-label="Settings" />
                <IconButton icon={<User size={20} />} aria-label="User Profile" disabled />
            </div>
        </DemoArea>
      </Section>

      <Section title="Inputs">
        <DemoArea>
            <InputText 
                id="sampleText" 
                label="Text Input" 
                placeholder="Enter your name" 
                value={textInputValue} 
                onChange={e => setTextInputValue(e.target.value)} 
            />
            <InputText id="disabledText" label="Disabled Text Input" placeholder="Cannot edit" disabled />
        </DemoArea>
        <DemoArea>
            <InputWithIcon 
                id="emailInput" 
                label="Input with Icon" 
                placeholder="your@email.com" 
                icon={<Mail size={18} />} 
            />
            <InputWithIcon id="passwordInput" label="Password Input" type="password" placeholder="••••••••" icon={<Lock size={18} />} />
        </DemoArea>
        <DemoArea>
            <SelectDropdown 
                id="sampleSelect"
                label="Select Dropdown"
                placeholder="Choose an option"
                options={[
                    { value: 'opt1', label: 'Option 1' },
                    { value: 'opt2', label: 'Option 2' },
                    { value: 'opt3', label: 'Option 3 (Longer text)' },
                ]}
                value={selectValue}
                onChange={e => setSelectValue(e.target.value)}
            />
            <SelectDropdown id="disabledSelect" label="Disabled Select" options={[{value: '1', label: 'Cannot choose'}]} disabled />
        </DemoArea>
      </Section>

      <Section title="Feedback Elements">
        <DemoArea className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AlertBox type="success" title="Success!" message="Your operation was completed successfully." />
            <AlertBox type="error" title="Error Occurred" message="Something went wrong. Please try again." />
            <AlertBox type="warning" title="Warning" message="Please double-check your input before proceeding." />
            <AlertBox type="info" title="Information" message="This is an informational message for the user." />
        </DemoArea>
        <DemoArea>
            <Heading level={4} className="mb-2">Toast Notifications</Heading>
            <div className="flex flex-wrap gap-2">
                <ButtonPrimary onClick={() => triggerToast('success', 'Success Toast', 'Action completed!')} className="!py-1.5 !px-3 !text-sm">Success Toast</ButtonPrimary>
                <ButtonPrimary onClick={() => triggerToast('error', 'Error Toast', 'Failed to save.')} className="!py-1.5 !px-3 !text-sm !bg-red-600 hover:!bg-red-700 focus:!ring-red-500">Error Toast</ButtonPrimary>
                <ButtonPrimary onClick={() => triggerToast('info', 'Info Toast', 'New update available.')} className="!py-1.5 !px-3 !text-sm !bg-sky-600 hover:!bg-sky-700 focus:!ring-sky-500">Info Toast</ButtonPrimary>
                <ButtonPrimary onClick={() => triggerToast('warning', 'Warning Toast', 'Low disk space.')} className="!py-1.5 !px-3 !text-sm !bg-yellow-500 hover:!bg-yellow-600 focus:!ring-yellow-400 text-slate-800">Warning Toast</ButtonPrimary>
            </div>
        </DemoArea>
        <DemoArea>
          <Heading level={4} className="mb-2">Spinners</Heading>
          <div className="flex items-center space-x-4">
            <Spinner size={20} />
            <Spinner size={32} colorClassName="text-purple-500 dark:text-brand-accent-purple" />
            <Spinner size={48} colorClassName="text-red-500" />
          </div>
        </DemoArea>
      </Section>
      
      <Section title="Web3 UI Components">
        <DemoArea>
          <Heading level={4} className="mb-2">Wallet Connect</Heading>
          <WalletConnectButton isConnected={isWalletConnected} onConnectToggle={() => setIsWalletConnected(!isWalletConnected)} walletAddress="0xM0cK...3Dd2" />
          <Paragraph variant="small">State: {isWalletConnected ? 'Connected' : 'Disconnected'}</Paragraph>
        </DemoArea>
        <DemoArea>
          <Heading level={4} className="mb-2">Network Status</Heading>
          <NetworkStatusBadge networkName="Ethereum" />
          <NetworkStatusBadge networkName="Polygon" />
          <NetworkStatusBadge networkName="BSC" />
        </DemoArea>
         <DemoArea>
          <Heading level={4} className="mb-2">Transaction Status</Heading>
          <TxStatusBadge status="Pending" />
          <TxStatusBadge status="Confirmed" />
          <TxStatusBadge status="Failed" />
        </DemoArea>
        <DemoArea>
          <Heading level={4} className="mb-2">Token Badges</Heading>
          <TokenBadge tokenSymbol="ETH" balance="12.345" />
          <TokenBadge tokenSymbol="USDC" balance="10,500.75" iconUrl="https://static.alchemyapi.io/images/assets/3408.png"/>
          <TokenBadge tokenSymbol="MATIC" balance="5,023" IconComponent={Package} />
        </DemoArea>
      </Section>

      <Section title="Cards & Blocks" className="md:col-span-2 lg:col-span-1">
         <DemoArea className="md:col-span-2">
            <Heading level={4} className="mb-2">Step Progress</Heading>
             <StepProgress steps={["Select Type", "Configure Details", "Choose Network", "Review & Deploy"]} currentStep={currentStep} />
             <div className="flex space-x-2 mt-2">
                <ButtonPrimary onClick={() => setCurrentStep(s => Math.max(1, s - 1))} className="!text-xs !px-2 !py-1">Prev</ButtonPrimary>
                <ButtonPrimary onClick={() => setCurrentStep(s => Math.min(4 + 1, s + 1))} className="!text-xs !px-2 !py-1">Next</ButtonPrimary>
            </div>
        </DemoArea>
        <DemoArea>
            <Heading level={4} className="mb-2">Gas Fee Estimator</Heading>
            <GasFeeEstimator estimatedGas="0.012 ETH" gasPrice="~$20.00 USD" priority="High" />
        </DemoArea>
        <DemoArea className="md:col-span-2">
            <Heading level={4} className="mb-2">Contract Card</Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ContractCard 
                    contractName="My ERC20 Token"
                    contractType="ERC-20"
                    deploymentDate="2023-10-15"
                    icon={Package}
                    tags={["Fungible", "Utility"]}
                    description="A standard token for platform utility and rewards."
                    onUseClick={() => alert('Use ERC20 Template clicked')}
                />
                <ContractCard 
                    contractName="Awesome NFT Project"
                    contractType="ERC-721A"
                    deploymentDate="2023-11-01"
                    icon={Users}
                    tags={["Collectible", "Art", "Community"]}
                    description="Unique digital art pieces with community benefits."
                    onUseClick={() => alert('Use NFT Template clicked')}
                />
            </div>
        </DemoArea>
      </Section>
      
      <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
        <Paragraph variant="small" className="!text-slate-500 dark:!text-slate-400">&copy; {new Date().getFullYear()} BlockDeploy. UI Kit for demonstration purposes.</Paragraph>
      </footer>
    </div>
  );
};

export default UIGuidePage;
