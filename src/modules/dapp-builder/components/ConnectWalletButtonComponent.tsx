// src/modules/dapp-builder/components/ConnectWalletButtonComponent.tsx
import React from 'react';

export interface ConnectWalletButtonComponentProps {
  buttonText?: string;
  // In a real app, would integrate with useAccount, useConnect from wagmi/viem etc.
}

const ConnectWalletButtonComponent: React.FC<{ properties: ConnectWalletButtonComponentProps }> = ({ properties }) => {
  const { buttonText = 'Connect Wallet' } = properties;

  const handleClick = () => {
    // Placeholder for actual wallet connection logic
    alert('Connect Wallet action triggered!');
    // Example: connect(); from useConnect()
  };

  return <button onClick={handleClick}>{buttonText}</button>;
};

export default ConnectWalletButtonComponent;
