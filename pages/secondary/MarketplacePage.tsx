
import React from 'react';
import { ShoppingBag, UploadCloud, Filter, Search } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

const MOCK_MARKETPLACE_ITEMS = [
  { id: '1', name: 'Advanced Staking Contract', author: 'DeFi Pros', price: '0.5 ETH', type: 'Template', category: 'DeFi' },
  { id: '2', name: 'Generative Art NFT Minter', author: 'ArtBlocks Inc.', price: '$199', type: 'Template', category: 'NFT' },
  { id: '3', name: 'Customizable DAO Voting Module', author: 'GovSecure', price: 'Free', type: 'Component', category: 'DAO' },
  { id: '4', name: 'Multi-Sig Wallet Contract', author: 'SecureChain', price: '1 ETH', type: 'Template', category: 'Security' },
];

const MarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  // Filter logic would go here

  return (
    <div className="py-12 md:py-16 bg-brand-primary text-slate-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div>
                <ShoppingBag size={48} className="text-brand-accent-blue mb-2" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-1">
                    BlockDeploy Marketplace
                </h1>
                <p className="text-lg text-slate-400 max-w-xl">
                    Discover community-built smart contract templates, components, and tools.
                </p>
            </div>
            <Button variant="primary" glowEffect="blue" iconLeft={<UploadCloud size={18}/>} onClick={() => alert('Submit your template/component (Feature Coming Soon!)')}>
                Submit Item
            </Button>
        </div>

        <div className="mb-10 p-4 bg-brand-secondary rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full md:w-auto">
            <Input
                type="search"
                placeholder="Search marketplace items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconLeft={<Search size={18} className="text-slate-400" />}
                className="bg-slate-700 border-slate-600 focus:bg-slate-800"
            />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter size={18} className="text-slate-400 flex-shrink-0" />
            <select
                // value={filterCategory}
                // onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-brand-accent-blue outline-none w-full md:w-auto"
            >
                <option value="all">All Categories</option>
                <option value="defi">DeFi</option>
                <option value="nft">NFT</option>
                <option value="dao">DAO</option>
                <option value="tools">Tools</option>
            </select>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_MARKETPLACE_ITEMS.map(item => (
            <Card key={item.id} className="bg-slate-800/70 border-slate-700 hover:border-brand-accent-blue/50 transition-colors flex flex-col">
              {/* Placeholder for item image/icon */}
              <div className="h-32 bg-slate-700 rounded-t-md mb-4 flex items-center justify-center text-slate-500">
                <ShoppingBag size={40}/>
              </div>
              <h2 className="text-lg font-semibold text-white mb-1 px-4">{item.name}</h2>
              <p className="text-xs text-slate-400 mb-1 px-4">by {item.author}</p>
              <p className="text-sm text-brand-accent-blue font-bold mb-3 px-4">{item.price}</p>
              <div className="mt-auto p-4 border-t border-slate-700/50">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => alert(`Viewing ${item.name}`)}>
                    View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
            <p className="text-slate-400">The marketplace is growing! More items added regularly.</p>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
