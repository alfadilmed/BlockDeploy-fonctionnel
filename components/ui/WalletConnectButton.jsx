import React from 'react';
import { Wallet, CheckCircle } from 'lucide-react';

const WalletConnectButton = ({ isConnected, onConnectToggle, walletAddress = "0x123...abc" }) => {
  const baseStyles = "px-4 py-2.5 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-300 ease-in-out inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105";
  
  const disconnectedStyles = "bg-gradient-to-r from-brand-accent-blue to-sky-500 text-white hover:from-sky-500 hover:to-brand-accent-blue focus:ring-sky-400";
  const connectedStyles = "bg-slate-200 dark:bg-brand-glass border border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 focus:ring-slate-500";

  return (
    <button
      type="button"
      onClick={onConnectToggle}
      className={`${baseStyles} ${isConnected ? connectedStyles : disconnectedStyles}`}
      aria-pressed={isConnected}
      aria-label={isConnected ? `Disconnect wallet ${walletAddress}` : "Connect wallet"}
    >
      {isConnected ? (
        <>
          <CheckCircle size={18} className="mr-2 text-green-500 dark:text-green-400" />
          Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
        </>
      ) : (
        <>
          <Wallet size={18} className="mr-2" />
          Connect Wallet
        </>
      )}
    </button>
  );
};

export default WalletConnectButton;
