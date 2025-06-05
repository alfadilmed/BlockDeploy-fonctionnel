import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, UserCircle, LogOut, Replace, Copy, ExternalLink } from 'lucide-react';

const WalletDropdown = ({ 
  walletAddress = "0x1234567890abcdef1234567890abcdef12345678", 
  balance = "10.5 ETH", 
  networkName = "Ethereum",
  onDisconnect,
  onSwitchNetwork 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const truncatedAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
        // In a real app, use a toast notification system
        // For this demo, an alert is fine.
        alert('Address copied to clipboard!'); 
    }).catch(err => console.error("Failed to copy address: ", err));
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-lg border border-slate-700 bg-brand-secondary px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:ring-offset-2 focus:ring-offset-brand-primary shadow-sm"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
        >
          <UserCircle size={20} className="mr-2 text-slate-400" /> 
          {truncatedAddress}
          <ChevronDown size={18} className={`ml-2 h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-brand-glass backdrop-blur-lg border border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1">
            <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-xs text-slate-400">Connected Wallet ({networkName})</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-medium text-slate-200 break-all" title={walletAddress}>{truncatedAddress}</p>
                    <button onClick={copyAddress} title="Copy address" className="text-slate-400 hover:text-brand-accent-blue p-1 rounded-md"><Copy size={14}/></button>
                </div>
                <p className="text-sm font-semibold text-brand-accent-blue mt-1">{balance}</p>
            </div>
            <button
              onClick={() => { onSwitchNetwork && onSwitchNetwork(); setIsOpen(false); }}
              className="w-full text-left flex items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              role="menuitem"
            >
              <Replace size={16} className="mr-2.5 text-slate-400" />
              Switch Network
            </button>
             <a
              href={`https://etherscan.io/address/${walletAddress}`} // Example, make dynamic based on networkName
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left flex items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              role="menuitem"
            >
              <ExternalLink size={16} className="mr-2.5 text-slate-400" />
              View on Explorer
            </a>
            <button
              onClick={() => { onDisconnect && onDisconnect(); setIsOpen(false); }}
              className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              role="menuitem"
            >
              <LogOut size={16} className="mr-2.5" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;