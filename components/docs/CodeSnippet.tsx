import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '../Button'; // Assuming Button component path

interface CodeSnippetProps {
  codeString: string;
  language?: string; // For syntax highlighting later, e.g., 'javascript', 'python'
  className?: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ codeString, language = 'plaintext', className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    }).catch(err => {
      console.error('Failed to copy code: ', err);
      // Optionally, show an error message to the user
    });
  };

  return (
    <div className={`relative bg-slate-800 rounded-lg shadow-md group ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity !p-1.5"
        aria-label={copied ? 'Copied!' : 'Copy code'}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
      </Button>
      <pre 
        className="p-4 text-xs md:text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
        // Add language class for syntax highlighting if a library is used
        // e.g., className={`language-${language}`}
      >
        <code className={`language-${language}`}>{codeString.trim()}</code>
      </pre>
    </div>
  );
};

export default CodeSnippet;
