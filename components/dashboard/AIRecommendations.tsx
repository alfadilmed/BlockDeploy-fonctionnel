
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, ShieldCheck, BarChartHorizontalBig, BookOpen } from 'lucide-react';
import Card from '../Card';
import { AIRecommendationTip } from '../../types';

const TIPS: AIRecommendationTip[] = [
  { id: 'tip1', text: 'ERC721A is ideal for batch NFT minting, significantly reducing gas costs for large collections.', icon: Zap },
  { id: 'tip2', text: 'Using proxy patterns (like UUPS) can help you upgrade your smart contracts after deployment.', icon: ShieldCheck },
  { id: 'tip3', text: 'Optimize for gas by using `uint256` specifically, as `uint` is an alias and might not always be the most efficient in older Solidity versions.', icon: BarChartHorizontalBig },
  { id: 'tip4', text: 'Consider using OpenZeppelin contracts for robust, community-audited building blocks for your dApp.', icon: BookOpen },
  { id: 'tip5', text: 'Always perform thorough testing on testnets before deploying to mainnet to catch potential issues early.', icon: Lightbulb },
];

const AIRecommendations: React.FC<{isCompactMode?: boolean}> = ({isCompactMode = false}) => {
  const [currentTip, setCurrentTip] = useState<AIRecommendationTip | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    setCurrentTip(TIPS[randomIndex]);
  }, []);

  if (!currentTip) return null;

  const TipIcon = currentTip.icon || Lightbulb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`bg-gradient-to-br from-brand-accent-purple/10 via-brand-secondary to-brand-secondary border-purple-500/30 hover:border-purple-500/60 flex flex-col h-full ${isCompactMode ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center mb-2">
          <div className={`p-1.5 rounded-lg bg-purple-500/20 mr-2 ${isCompactMode ? 'mr-1.5' : 'mr-2.5'}`}>
            <TipIcon size={isCompactMode ? 16: 20} className="text-purple-400" />
          </div>
          <h3 className={`font-semibold text-purple-300 ${isCompactMode ? 'text-sm' : 'text-md'}`}>AI Web3 Tip</h3>
        </div>
        <p className={`text-slate-300 flex-grow ${isCompactMode ? 'text-xs leading-snug' : 'text-sm leading-relaxed'}`}>
          {currentTip.text}
        </p>
      </Card>
    </motion.div>
  );
};

export default AIRecommendations;
