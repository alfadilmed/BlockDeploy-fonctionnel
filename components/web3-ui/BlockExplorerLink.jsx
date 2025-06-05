import React from 'react';
import { ExternalLink, SearchCode } from 'lucide-react';

const BlockExplorerLink = ({ 
  hash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234", 
  type = "tx", // 'tx' or 'address'
  network = "ethereum", // 'ethereum', 'polygon', etc.
  displayText, 
  shorten = true
}) => {
  const getBaseUrl = () => {
    switch (network.toLowerCase()) {
      case 'polygon': return 'https://polygonscan.com';
      case 'bsc': return 'https://bscscan.com';
      case 'arbitrum': return 'https://arbiscan.io';
      case 'optimism': return 'https://optimistic.etherscan.io';
      case 'sepolia': return 'https://sepolia.etherscan.io';
      case 'ethereum':
      default: return 'https://etherscan.io';
    }
  };

  const url = `${getBaseUrl()}/${type === 'tx' ? 'tx' : 'address'}/${hash}`;
  
  let displayHash = hash;
  if (shorten && hash && hash.length > 12) {
    displayHash = `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  }
  
  const textToShow = displayText || displayHash;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`View ${type} ${hash} on ${network} explorer`}
      className="inline-flex items-center text-sm font-medium text-brand-accent-blue hover:text-sky-400 hover:underline transition-colors group"
    >
      <SearchCode size={16} className="mr-1.5 opacity-80 group-hover:opacity-100" />
      {textToShow}
      <ExternalLink size={14} className="ml-1 opacity-70 group-hover:opacity-100" />
    </a>
  );
};

export default BlockExplorerLink;