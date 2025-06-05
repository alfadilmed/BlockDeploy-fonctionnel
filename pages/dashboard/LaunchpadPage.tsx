
import React, { useState } from 'react';
import { Rocket, Search, SlidersHorizontal, Twitter, MessageCircle, Globe, TrendingUp, CalendarDays, Percent, FileText, Flame, Sparkles, Star, AlertCircle, CheckCircle } from 'lucide-react';
import LaunchpadCard from '../../components/LaunchpadCard';
import { LaunchpadProject } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import QuickViewModal from '../../components/launchpad/QuickViewModal';
import SubmitProjectModal from '../../components/launchpad/SubmitProjectModal';

const MOCK_PROJECTS_DATA: LaunchpadProject[] = [
  {
    id: 'proj1',
    logoUrl: 'https://picsum.photos/seed/qai/64/64',
    name: 'QuantumLeap AI',
    status: 'Live',
    specialTag: 'Trending',
    description: 'Revolutionizing AI development with decentralized GPU sharing and quantum-resistant algorithms for next-gen applications.',
    detailedDescription: 'QuantumLeap AI is building a decentralized network for AI computation, allowing anyone to contribute GPU power and earn rewards. Our platform utilizes advanced quantum-resistant cryptographic methods to ensure the security and longevity of AI models and data. Join us in democratizing access to powerful AI tools.',
    projectGoals: ['Launch Testnet Q4 2024', 'Onboard 1000+ GPU providers', 'Develop 3 flagship AI models'],
    tokenomics: [{name: 'Ticker', value: 'QLAI'}, {name: 'Total Supply', value: '1,000,000,000'}, {name: 'Sale Allocation', value: '20%'}],
    socialLinks: [
        { platform: 'twitter', url: '#', icon: Twitter }, { platform: 'discord', url: '#', icon: MessageCircle }, { platform: 'website', url: '#', icon: Globe }
    ],
    raisedAmount: 1850,
    targetAmount: 2000,
    currency: 'ETH',
    endDateInfo: 'Ends in 7 days',
    networkChips: ['Ethereum', 'Arbitrum'],
    categoryChips: ['AI', 'DePIN'],
    collectionStatusText: 'Hard Cap Soon',
    collectionStatusType: 'success',
  },
  {
    id: 'proj2',
    logoUrl: 'https://picsum.photos/seed/galaxy/64/64',
    name: 'GalaxyDefi Aggregator',
    status: 'Coming Soon',
    specialTag: 'New',
    description: 'A next-gen DeFi yield aggregator with cross-chain capabilities, automated strategies, and enhanced security protocols.',
    detailedDescription: 'GalaxyDefi aims to simplify DeFi for everyone. Our platform aggregates yields from various protocols across multiple chains, offering users optimized returns with minimal effort. Features include auto-compounding, risk assessment tools, and one-click strategy deployment.',
    projectGoals: ['Mainnet Launch Q1 2025', 'Integrate 5 major EVM chains', 'Achieve $10M TVL'],
    socialLinks: [{ platform: 'telegram', url: '#', icon: MessageCircle }, { platform: 'website', url: '#', icon: Globe }],
    raisedAmount: 0,
    targetAmount: 1500,
    currency: 'USDC',
    endDateInfo: 'Starts Oct 15, 2024',
    networkChips: ['Polygon', 'BSC'],
    categoryChips: ['DeFi', 'Yield Farming'],
    collectionStatusText: 'Whitelist Open',
    collectionStatusType: 'info',
  },
  {
    id: 'proj3',
    logoUrl: null, // Fallback to Rocket
    name: 'PixelPunks Evolution',
    status: 'Ended',
    specialTag: null,
    description: 'The next chapter in generative pixel art NFTs, building a community-driven universe with evolving storylines.',
    detailedDescription: 'PixelPunks Evolution is more than just an NFT collection; it\'s an interactive story where token holders shape the narrative. Each PixelPunk evolves based on community decisions and on-chain events, creating a truly dynamic and engaging experience.',
    raisedAmount: 750,
    targetAmount: 500,
    currency: 'ETH',
    endDateInfo: 'Ended Sep 1, 2024',
    networkChips: ['Ethereum'],
    categoryChips: ['NFT', 'Gaming', 'Community'],
  },
  {
    id: 'proj4',
    logoUrl: 'https://picsum.photos/seed/eco/64/64',
    name: 'EcoVerse Chain',
    status: 'Live',
    specialTag: 'Featured',
    description: 'A layer-1 blockchain focused on sustainable and eco-friendly dApp development, promoting green Web3 solutions.',
    detailedDescription: 'EcoVerse Chain is built from the ground up with sustainability in mind. We use a novel consensus mechanism that minimizes energy consumption while maintaining high throughput and security. Our ecosystem supports projects focused on environmental impact and social good.',
    projectGoals: ['Launch Carbon Offset Marketplace', 'Partner with 10+ Green Tech companies'],
    tokenomics: [{name: 'Ticker', value: 'ECOV'}, {name: 'Max Supply', value: '500,000,000'}],
    socialLinks: [{ platform: 'twitter', url: '#', icon: Twitter }, { platform: 'website', url: '#', icon: Globe }],
    raisedAmount: 800,
    targetAmount: 3000,
    currency: 'MATIC',
    endDateInfo: 'Ends in 22 days',
    networkChips: ['Polygon-Powered'],
    categoryChips: ['Layer-1', 'Sustainability', 'ReFi'],
    collectionStatusText: 'Soft Cap Reached',
    collectionStatusType: 'warning',
  },
   {
    id: 'proj5',
    logoUrl: 'https://picsum.photos/seed/audio/64/64',
    name: 'AudioChain Streaming',
    status: 'Coming Soon',
    specialTag: 'New',
    description: 'Decentralized music streaming platform empowering artists with fair payouts and listeners with unique experiences.',
    detailedDescription: 'AudioChain is disrupting the music industry by leveraging blockchain for transparent royalty distribution and fan engagement. Artists can mint their music as NFTs, offer exclusive content, and connect directly with their audience. Listeners enjoy high-fidelity audio and can earn rewards for curating and discovering new music.',
    raisedAmount: 0,
    targetAmount: 1000,
    currency: 'ETH',
    endDateInfo: 'IDO Nov 5, 2024',
    networkChips: ['Ethereum', 'IPFS'],
    categoryChips: ['Music', 'NFT', 'Creator Economy'],
  },
  {
    id: 'proj6',
    logoUrl: null,
    name: 'MetaRealms Game',
    status: 'Live',
    specialTag: 'Trending',
    description: 'An immersive play-to-earn MMORPG with player-owned assets, a dynamic economy, and community governance.',
    detailedDescription: 'Enter MetaRealms, a vast open-world MMORPG where every item is an NFT and the economy is driven by players. Explore, quest, battle, and build your empire in a persistent, evolving universe. MetaRealms features deep crafting systems, player housing, and DAO-based decision-making for world events.',
    socialLinks: [{ platform: 'discord', url: '#', icon: MessageCircle }, { platform: 'twitter', url: '#', icon: Twitter }],
    raisedAmount: 4850,
    targetAmount: 5000,
    currency: 'BNB',
    endDateInfo: 'Closing in 48 hours',
    networkChips: ['BNB Chain'],
    categoryChips: ['GameFi', 'Metaverse', 'P2E'],
    collectionStatusText: '97% Funded!',
    collectionStatusType: 'success',
  },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity', icon: TrendingUp },
  { value: 'endDate', label: 'End Date', icon: CalendarDays },
  { value: 'progress', label: 'Progress %', icon: Percent },
  { value: 'alphabetical', label: 'Alphabetical', icon: FileText },
];


const LaunchpadPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LaunchpadProject['status'] | 'All'>('All');
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0].value);
  
  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<LaunchpadProject | null>(null);

  const handleViewProject = (project: LaunchpadProject) => {
    setSelectedProjectForModal(project);
    setIsQuickViewModalOpen(true);
  };

  // Mock sorting and filtering
  const filteredAndSortedProjects = MOCK_PROJECTS_DATA
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (project.categoryChips && project.categoryChips.join(' ').toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (project.networkChips && project.networkChips.join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // This is a mock sort, actual implementation would be more complex
      switch (sortOption) {
        case 'popularity': // Mock: projects with special tags or higher raised amount are more popular
          const scoreA = (a.specialTag ? 1000 : 0) + a.raisedAmount;
          const scoreB = (b.specialTag ? 1000 : 0) + b.raisedAmount;
          return scoreB - scoreA;
        case 'endDate': // Mock: earlier end dates first (needs date parsing for real sort)
          return a.endDateInfo.localeCompare(b.endDateInfo); 
        case 'progress':
          return (b.raisedAmount / b.targetAmount) - (a.raisedAmount / a.targetAmount);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Rocket size={36} className="text-brand-accent-blue mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-white">Project Launchpad</h1>
            <p className="text-slate-400">
              Discover and participate in upcoming Web3 projects.
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setIsSubmitModalOpen(true)} glowEffect="blue">
          Submit Your Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 p-4 bg-brand-secondary rounded-xl border border-slate-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-grow w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search projects by name, keyword, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeft={<Search size={18} className="text-slate-400" />}
            className="bg-slate-700 border-slate-600 focus:bg-slate-800"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label htmlFor="statusFilter" className="text-sm text-slate-300 whitespace-nowrap">Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LaunchpadProject['status'] | 'All')}
            className="bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-brand-accent-blue outline-none w-full md:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Live">Live</option>
            <option value="Coming Soon">Coming Soon</option>
            <option value="Ended">Ended</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label htmlFor="sortOrderFilter" className="text-sm text-slate-300 whitespace-nowrap">Sort by:</label>
          <select
            id="sortOrderFilter"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-brand-accent-blue outline-none w-full md:w-auto"
          >
            {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-12 bg-brand-secondary rounded-xl border border-slate-700">
          <Search size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
          <p className="text-slate-400">Try adjusting your search or filters, or check back later for new listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project, index) => (
            <div key={project.id} className="mb-0 md:mb-4"> {/* Added mb-4 for mobile spacing, mb-0 for larger screens to rely on grid gap */}
              <LaunchpadCard project={project} index={index} onViewProject={handleViewProject} />
            </div>
          ))}
        </div>
      )}

      <QuickViewModal 
        isOpen={isQuickViewModalOpen} 
        onClose={() => setIsQuickViewModalOpen(false)} 
        project={selectedProjectForModal} 
      />
      <SubmitProjectModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
      />

    </div>
  );
};

export default LaunchpadPage;
