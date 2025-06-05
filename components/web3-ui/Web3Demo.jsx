import React, { useState } from 'react';
import WalletConnectButton from './WalletConnectButton';
import NetworkStatus from './NetworkStatus';
import TxStatusBadge from './TxStatusBadge';
import StepProgress from './StepProgress';
import ContractCard from './ContractCard';
import GasFeeEstimator from './GasFeeEstimator';
import WalletDropdown from './WalletDropdown';
import BlockExplorerLink from './BlockExplorerLink';
import TokenBadge from './TokenBadge';
import MockNotification from './MockNotification';
import { Package, Users, CircleDollarSign, Check, AlertTriangle, Info, X, Rss, BeakerIcon } from 'lucide-react';

// Main Card component from existing app structure (or a similar styled div for demo sections)
const DemoSectionCard = ({ title, children, className = '' }) => (
  <div className={`bg-brand-primary p-6 rounded-lg border border-slate-700 shadow-xl ${className}`}>
    <h2 className="text-xl font-semibold text-brand-accent-purple mb-4">{title}</h2>
    <div className="space-y-4 flex flex-col items-start">{children}</div>
  </div>
);


const Web3UIDemoPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProps, setNotificationProps] = useState({});
  const [currentDemoStep, setCurrentDemoStep] = useState(2);

  const handleConnectToggle = () => setIsConnected(!isConnected);

  const triggerNotification = (type, title, message) => {
    setNotificationProps({ type, title, message });
    setShowNotification(true);
  };
  
  const contractExamples = [
    { name: "ERC-20 Token", type: "Token", date: "2024-01-15", icon: Package, tags: ["Fungible", "Currency"] },
    { name: "NFT Collection", type: "ERC-721A", date: "2024-03-22", icon: Users, tags: ["Collectible", "Art", "Gas Efficient"] },
    { name: "Community DAO", type: "Governance", date: "2024-05-10", icon: Rss, tags: ["Voting", "Treasury"] },
  ];

  const stepProgressDemoSteps = ["Choose Template", "Configure Details", "Select Network", "Review & Deploy"];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 text-slate-200">
      <div className="flex items-center justify-center mb-8 text-center">
        <BeakerIcon size={40} className="text-brand-accent-blue mr-3"/>
        <h1 className="text-4xl font-bold text-white">Web3 UI Components Demo</h1>
      </div>
      
      <MockNotification 
        isVisible={showNotification} 
        onClose={() => setShowNotification(false)}
        {...notificationProps}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* WalletConnectButton */}
        <DemoSectionCard title="Wallet Connect Button">
          <WalletConnectButton isConnected={isConnected} onConnectToggle={handleConnectToggle} walletAddress={isConnected ? "0xAbC123DeF456GhI789JkL012MnOpQrStUvWxYz" : undefined} />
          <p className="text-xs text-slate-400">State: {isConnected ? "Connected" : "Disconnected"}</p>
        </DemoSectionCard>

        {/* NetworkStatus */}
        <DemoSectionCard title="Network Status Badges">
          <NetworkStatus networkName="Ethereum" />
          <NetworkStatus networkName="Polygon" />
          <NetworkStatus networkName="BSC" />
          <NetworkStatus networkName="Sepolia" />
        </DemoSectionCard>

        {/* TxStatusBadge */}
        <DemoSectionCard title="Transaction Status Badges">
          <TxStatusBadge status="Pending" />
          <TxStatusBadge status="Confirmed" />
          <TxStatusBadge status="Success" />
          <TxStatusBadge status="Failed" />
          <TxStatusBadge status="Error" />
        </DemoSectionCard>

        {/* StepProgress */}
        <DemoSectionCard title="Step Progress Indicator" className="md:col-span-2 lg:col-span-3">
          <StepProgress steps={stepProgressDemoSteps} currentStep={currentDemoStep} />
           <div className="flex space-x-2 mt-2">
            <button onClick={() => setCurrentDemoStep(s => Math.max(1, s - 1))} className="text-xs px-2 py-1 bg-slate-600 rounded">Prev</button>
            <button onClick={() => setCurrentDemoStep(s => Math.min(stepProgressDemoSteps.length + 1, s + 1))} className="text-xs px-2 py-1 bg-slate-600 rounded">Next</button>
          </div>
          <StepProgress steps={["Upload Art", "Set Price", "Mint NFT", "List on Market"]} currentStep={1} />
        </DemoSectionCard>

        {/* GasFeeEstimator */}
        <DemoSectionCard title="Gas Fee Estimator">
          <GasFeeEstimator />
          <GasFeeEstimator estimatedGas="0.015 ETH" gasPrice="~$28.50 USD" priority="Fast" />
        </DemoSectionCard>
        
        {/* WalletDropdown */}
        <DemoSectionCard title="Wallet Dropdown">
          <WalletDropdown 
            onDisconnect={() => { setIsConnected(false); triggerNotification("info", "Disconnected", "Wallet has been disconnected."); }}
            onSwitchNetwork={() => triggerNotification("info", "Switch Network", "Network switch initiated (mock).")}
            walletAddress={isConnected ? "0xAbCdEf1234567890fEdCbA0987654321AbCdEf12" : "0x0000000000000000000000000000000000000000"}
            balance={isConnected ? "12.345 ETH" : "0 ETH"}
            networkName="Sepolia"
          />
           {!isConnected && <p className="text-xs text-slate-500">Connect wallet to see full dropdown functionality.</p>}
        </DemoSectionCard>

        {/* BlockExplorerLink */}
        <DemoSectionCard title="Block Explorer Links">
          <BlockExplorerLink hash="0x123abcsef123sef123sef123sef123sef123sef123sef123sef123sefa" type="tx" network="ethereum" />
          <BlockExplorerLink hash="0x456def123sef123sef123sef123sef123sef123sef123sef123sef123b" type="address" network="polygon" displayText="My Cool Contract" />
          <BlockExplorerLink hash="0x789ghisef123sef123sef123sef123sef123sef123sef123sef123sefc" type="tx" network="bsc" shorten={false} />
          <BlockExplorerLink hash="0xabcdef123sef123sef123sef123sef123sef123sef123sef123sefd" type="address" network="sepolia" displayText="Testnet Address"/>
        </DemoSectionCard>

        {/* TokenBadge */}
        <DemoSectionCard title="Token Badges" className="md:col-span-2 lg:col-span-3">
         <div className="flex flex-wrap gap-3">
            <TokenBadge tokenSymbol="ETH" tokenName="Ethereum" balance="2.5000" IconComponent={CircleDollarSign}/>
            <TokenBadge tokenSymbol="MATIC" tokenName="Polygon Matic" balance="1,500.8043" IconComponent={CircleDollarSign} />
            <TokenBadge tokenSymbol="BLOK" tokenName="BlockDeploy Token" balance="10,000,000" iconUrl="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/solid/cube.svg" />
            <TokenBadge tokenSymbol="USDT" tokenName="Tether USD" balance="5,024.12" iconUrl="https://static.alchemyapi.io/images/assets/3408.png" />
          </div>
        </DemoSectionCard>
        
        {/* ContractCard */}
        <DemoSectionCard title="Contract Cards" className="md:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractExamples.map(ex => (
             <ContractCard 
                key={ex.name}
                contractName={ex.name}
                contractType={ex.type}
                deploymentDate={ex.date}
                icon={ex.icon}
                tags={ex.tags}
                onUseClick={() => triggerNotification("info", `${ex.name} Selected`, `You clicked 'Use Template' for ${ex.name}.`)}
              />
          ))}
        </DemoSectionCard>
        
        {/* MockNotification Triggers */}
        <DemoSectionCard title="Mock Notification Triggers" className="md:col-span-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => triggerNotification('success', 'Transaction Confirmed!', 'Your transaction has been successfully processed on the network.')} className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-500 rounded-md text-white">Success Notification</button>
            <button onClick={() => triggerNotification('error', 'Deployment Failed', 'Insufficient funds for gas. Please top up your wallet and try again.')} className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 rounded-md text-white">Error Notification</button>
            <button onClick={() => triggerNotification('warning', 'Network Congestion', 'The network is currently experiencing high congestion. Transactions may be delayed.')} className="px-3 py-1.5 text-xs bg-yellow-600 hover:bg-yellow-500 rounded-md text-white">Warning Notification</button>
            <button onClick={() => triggerNotification('info', 'Feature Update', 'A new contract template for ERC-1155 has been added to BlockDeploy!')} className="px-3 py-1.5 text-xs bg-sky-600 hover:bg-sky-500 rounded-md text-white">Info Notification</button>
          </div>
        </DemoSectionCard>
      </div>
    </div>
  );
};

export default Web3UIDemoPage;