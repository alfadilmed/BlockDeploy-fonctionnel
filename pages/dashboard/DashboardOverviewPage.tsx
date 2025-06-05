
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input'; // For search
import { 
    Layers, PackagePlus, Zap, DollarSign, BarChart3, AlertTriangle, SearchCode, 
    Rocket, Edit3 as PencilIcon, TrendingUp, CheckCircle, XCircle, Network as NetworkIcon, Star as StarIcon, Activity,
    Lightbulb, Archive, FileText as FileTextIcon, Search, Maximize2, Minimize2, LucideProps // Added new icons & LucideProps
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CustomTooltip from '../../components/CustomTooltip';
import { FilterPillOption } from '../../types';

// New component imports
import AIRecommendations from '../../components/dashboard/AIRecommendations';
import WeeklyActivityChart from '../../components/dashboard/WeeklyActivityChart';
import NetworkStatusWidget from '../../components/dashboard/NetworkStatusWidget';
import DeploymentSuccessRateChart from '../../components/dashboard/DeploymentSuccessRateChart';
import FilterPill from '../../components/dashboard/FilterPill';


// Mock data for demonstration
const MOCK_STATS = {
  totalDeployments: 5,
  activeContracts: 3,
  monthlySpend: 25.50,
  availableTemplates: 12,
  deploymentSuccessRateData: { success: 75, failed: 15, pending: 10 }, // New structure
  topUsedTemplate: { name: 'ERC-721A NFT', icon: StarIcon },
  favoriteNetwork: { name: 'Polygon Mainnet', icon: NetworkIcon },
  mockCreditsLeft: 3,
};

interface RecentActivityItem {
    id: string;
    type: 'Deployed' | 'Updated' | 'Failed' | 'Token' | 'NFT' | 'DAO'; // Extended types
    name: string;
    date: string;
    status: 'Success' | 'Config Change' | 'Deployment Failed' | 'Pending'; // Added Pending
    icon: React.ElementType;
    tags?: string[]; // e.g. ['ERC-20', 'Testnet']
}

const MOCK_RECENT_ACTIVITY: RecentActivityItem[] = [
  { id: '1', type: 'Token', name: 'MyToken (ERC20)', date: '2024-07-20', status: 'Success', icon: Rocket, tags: ['ERC-20', 'Polygon'] },
  { id: '2', type: 'NFT', name: 'Cool NFT Collection', date: '2024-07-18', status: 'Config Change', icon: PencilIcon, tags: ['NFT', 'Ethereum'] },
  { id: '3', type: 'DAO', name: 'DAO Governance', date: '2024-07-15', status: 'Deployment Failed', icon: AlertTriangle, tags: ['DAO', 'Arbitrum'] },
  { id: '4', type: 'Token', name: 'Utility Token X', date: '2024-07-22', status: 'Success', icon: Rocket, tags: ['ERC-20', 'Sepolia'] },
  { id: '5', type: 'NFT', name: 'ArtBlock NFT Series', date: '2024-07-23', status: 'Pending', icon: Rocket, tags: ['NFT', 'Goerli'] },
];

const MOCK_DEPLOYMENT_TREND_DATA = [
  { day: 'Mon', deployments: 2 }, { day: 'Tue', deployments: 3 }, { day: 'Wed', deployments: 1 },
  { day: 'Thu', deployments: 4 }, { day: 'Fri', deployments: 2 }, { day: 'Sat', deployments: 5 },
  { day: 'Sun', deployments: 3 },
];

const MOCK_WEEKLY_CHART_DATA = [3, 5, 2, 6, 1, 4, 7];

const ALL_FILTER_PILLS: FilterPillOption[] = ['All', 'ERC-20', 'NFT', 'DAO', 'Success', 'Failed', 'Pending'];


const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08, // Adjusted delay
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const listItemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
   exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } }
};

const StatCard: React.FC<{ title: string; value: string | number | React.ReactNode; icon: React.ReactElement<Partial<LucideProps>>; linkTo?: string; customClassName?: string; isNewStat?: boolean, isCompactMode?: boolean }> = 
({ title, value, icon, linkTo, customClassName = '', isNewStat = false, isCompactMode = false }) => (
  <Card className={`bg-brand-secondary border-slate-700/70 ${customClassName} ${isCompactMode ? 'p-3' : 'p-4'}`} hoverEffect>
    <div className={`flex items-center ${isNewStat ? 'justify-start' : 'justify-between'}`}>
      {isNewStat && <div className={`p-2 rounded-lg text-brand-accent-blue mr-2 ${isCompactMode ? 'mr-1.5 p-1.5' : 'mr-3 p-2.5'} bg-brand-accent-blue/15`}>{React.cloneElement(icon, { size: isCompactMode ? 16 : 20 })}</div>}
      <div>
        <p className={`text-slate-400 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>{title}</p>
        {typeof value === 'string' || typeof value === 'number' ? (
           <p className={`font-bold text-white ${isCompactMode ? 'text-xl mt-0.5' : 'text-2xl mt-1'}`}>{value}</p>
        ) : (
          <div className={`text-white ${isCompactMode ? 'mt-0.5 text-lg' : 'text-2xl mt-1'}`}>{value}</div>
        )}
      </div>
      {!isNewStat && <div className={`p-2 rounded-lg bg-brand-accent-blue/20 text-brand-accent-blue ${isCompactMode ? 'p-1.5' : 'p-3'}`}>{React.cloneElement(icon, { size: isCompactMode ? 18 : 24 })}</div>}
    </div>
    {linkTo && (
      <Link to={linkTo} className={`text-brand-accent-blue hover:underline mt-1.5 block ${isCompactMode ? 'text-xs' : 'text-sm'}`}>View details</Link>
    )}
  </Card>
);

const tickStyle = { fill: '#94a3b8', fontSize: 10 };
const axisLineStyle = { stroke: '#475569' };
const chartGridStroke = "rgba(71, 85, 105, 0.2)"; 


const DashboardOverviewPage: React.FC = () => {
  const { user } = useAppContext();
  const [selectedFilters, setSelectedFilters] = useState<FilterPillOption[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompactMode, setIsCompactMode] = useState(false);

  const handleFilterChange = (filter: FilterPillOption) => {
    setSelectedFilters(prev => {
      if (filter === 'All') return ['All'];
      const newFilters = prev.filter(f => f !== 'All');
      if (newFilters.includes(filter)) {
        const updated = newFilters.filter(f => f !== filter);
        return updated.length === 0 ? ['All'] : updated;
      } else {
        return [...newFilters, filter];
      }
    });
  };
  
  const filteredActivity = useMemo(() => {
    let activities = MOCK_RECENT_ACTIVITY;

    if (!selectedFilters.includes('All') && selectedFilters.length > 0) {
      activities = activities.filter(activity => {
        return selectedFilters.some(filter => {
          const typeLower = activity.type.toLowerCase();
          const statusLower = activity.status.toLowerCase();
          const tagsLower = activity.tags?.map(t => t.toLowerCase()) || [];

          switch (filter) {
            case 'ERC-20': return typeLower === 'token' || tagsLower.includes('erc-20');
            case 'NFT': return typeLower === 'nft' || tagsLower.includes('nft');
            case 'DAO': return typeLower === 'dao' || tagsLower.includes('dao');
            case 'Success': return statusLower === 'success';
            case 'Failed': return statusLower.includes('fail');
            case 'Pending': return statusLower === 'pending';
            default: return false;
          }
        });
      });
    }

    if (searchTerm.trim() !== '') {
      const termLower = searchTerm.toLowerCase();
      activities = activities.filter(activity =>
        activity.name.toLowerCase().includes(termLower) ||
        activity.date.toLowerCase().includes(termLower) 
      );
    }
    return activities;
  }, [selectedFilters, searchTerm]);


  const getStatusColor = (status: string) => {
    const sLower = status.toLowerCase();
    if (sLower === 'success' || sLower === 'config change') return 'bg-green-500/20 text-green-400';
    if (sLower.includes('fail')) return 'bg-red-500/20 text-red-400';
    if (sLower === 'pending') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-slate-500/20 text-slate-400';
  };
  
  const TopUsedTemplateIcon = MOCK_STATS.topUsedTemplate.icon;
  const FavoriteNetworkIcon = MOCK_STATS.favoriteNetwork.icon;

  return (
    <div className={isCompactMode ? 'p-3 md:p-4' : 'p-4 md:p-6'}>
      {/* Header Row: Welcome, Credits, Compact Toggle */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className={`font-bold text-white ${isCompactMode ? 'text-2xl' : 'text-3xl'}`}>
            👋 Welcome back, {user?.name?.split(' ')[0] || 'Builder'}!
          </h1>
          <p className={`text-slate-400 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>
            Here's what's happening with your smart contracts.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${isCompactMode ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1'} bg-brand-accent-purple/20 text-purple-300 border border-purple-500/30`}>
                {MOCK_STATS.mockCreditsLeft} deployments left this month
            </span>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCompactMode(!isCompactMode)}
                className={`!p-1.5 ${isCompactMode ? '!text-xs' : ''}`}
                iconLeft={isCompactMode ? <Maximize2 size={14}/> : <Minimize2 size={14}/>}
                title={isCompactMode ? "Switch to Normal View" : "Switch to Compact View"}
            >
              {isCompactMode ? "" : ""}
            </Button>
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div 
        className={`flex flex-wrap gap-2 mb-4 bg-brand-secondary/50 rounded-lg border border-slate-700/50 ${isCompactMode ? 'p-2' : 'p-3'}`}
        variants={cardVariants} initial="hidden" animate="visible" custom={0.1}
      >
        {ALL_FILTER_PILLS.map((pill) => (
          <FilterPill 
            key={pill} 
            label={pill} 
            isActive={selectedFilters.includes(pill)} 
            onClick={handleFilterChange}
            isCompactMode={isCompactMode}
          />
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${isCompactMode ? 'gap-3' : 'gap-5 md:gap-6'}`}>
        {[
          { title: "Total Deployments", value: MOCK_STATS.totalDeployments, icon: <Layers />, linkTo: "/dashboard/deployments" },
          { title: "Active Contracts", value: MOCK_STATS.activeContracts, icon: <Zap /> },
          { title: "Monthly Spend", value: `$${MOCK_STATS.monthlySpend.toFixed(2)}`, icon: <DollarSign />, linkTo: "/dashboard/billing" },
          { title: "Available Templates", value: MOCK_STATS.availableTemplates, icon: <PackagePlus />, linkTo: "/dashboard/templates" },
        ].map((stat, index) => (
          <motion.div key={stat.title} custom={index} variants={cardVariants} initial="hidden" animate="visible" className="h-full">
            <StatCard title={stat.title} value={stat.value} icon={stat.icon as React.ReactElement<Partial<LucideProps>>} linkTo={stat.linkTo} isCompactMode={isCompactMode} />
          </motion.div>
        ))}
        
        {/* New Widgets */}
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="h-full">
            <NetworkStatusWidget isCompactMode={isCompactMode} gasFee="32 Gwei" />
        </motion.div>
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" className="h-full">
            <DeploymentSuccessRateChart data={MOCK_STATS.deploymentSuccessRateData} isCompactMode={isCompactMode} />
        </motion.div>
        <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2 h-full">
             <AIRecommendations isCompactMode={isCompactMode}/>
        </motion.div>
      </div>
      
      {/* Second Row Grid: Quick Actions, Recent Activity, Trend Chart, Weekly Chart */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 ${isCompactMode ? 'gap-3 mt-3' : 'gap-5 md:gap-6 mt-5 md:mt-6'}`}>
        <motion.div custom={0.5} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-1 h-full">
          <Card className={`bg-brand-secondary border-slate-700/70 h-full ${isCompactMode ? 'p-3' : 'p-4'}`} hoverEffect>
            <h2 className={`font-semibold text-white ${isCompactMode ? 'text-base mb-2' : 'text-xl mb-3'}`}>Quick Actions</h2>
            <div className={`space-y-2 ${isCompactMode ? 'space-y-1.5' : 'space-y-3'}`}>
              <Button variant="primary" className="w-full" onClick={() => window.location.hash = '/wizard/template'} iconLeft={<Zap size={isCompactMode ? 14 : 18}/>} glowEffect="blue" size={isCompactMode ? 'sm' : 'md'}>
                New Deployment
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.hash = '/dashboard/templates'} iconLeft={<PackagePlus size={isCompactMode ? 14 : 18}/>} size={isCompactMode ? 'sm' : 'md'}>
                Browse Templates
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2 h-full">
          <Card className={`bg-brand-secondary border-slate-700/70 h-full flex flex-col ${isCompactMode ? 'p-3' : 'p-4'}`} hoverEffect>
            <h2 className={`font-semibold text-white ${isCompactMode ? 'text-base mb-2' : 'text-xl mb-3'}`}>Recent Activity</h2>
            <Input
                type="search"
                placeholder="Search activity by name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconLeft={<Search size={isCompactMode ? 14 : 16} className="text-slate-400" />}
                className={`bg-slate-800 border-slate-600 focus:bg-slate-700 w-full ${isCompactMode ? 'text-xs !py-1.5 mb-2' : 'text-sm !py-2 mb-3'}`}
            />
            <div className={`flex-grow overflow-y-auto space-y-2 ${isCompactMode ? 'max-h-48 space-y-1.5' : 'max-h-64 space-y-2.5'}`}>
              <AnimatePresence>
                {filteredActivity.length > 0 ? (
                  filteredActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <motion.div 
                        key={activity.id} 
                        custom={index}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`flex items-center justify-between bg-slate-800 rounded-lg hover:bg-slate-700/70 transition-colors ${isCompactMode ? 'p-2' : 'p-2.5'}`}
                      >
                        <div className="flex items-center overflow-hidden">
                          <IconComponent size={isCompactMode ? 14 : 18} className="mr-2 text-slate-400 flex-shrink-0" />
                          <div className="truncate">
                            <p className={`font-medium text-slate-200 truncate ${isCompactMode ? 'text-xs' : 'text-sm'}`}>{activity.name}</p>
                            <p className={`text-slate-500 ${isCompactMode ? 'text-[10px]' : 'text-xs'}`}>{activity.type} - {activity.date}</p>
                          </div>
                        </div>
                        <motion.span 
                            className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${getStatusColor(activity.status)} ${isCompactMode ? 'text-[10px] px-1.5' : ''}`}
                            initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay:0.1 + index * 0.05}}
                        >
                          {activity.status}
                        </motion.span>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div 
                     variants={listItemVariants} initial="hidden" animate="visible" exit="exit"
                     className={`text-center py-6 text-slate-500 ${isCompactMode ? 'py-4' : 'py-8'}`}
                  >
                    <AlertTriangle size={isCompactMode ? 24 : 32} className="mx-auto mb-1" />
                    <p className={isCompactMode ? 'text-xs' : 'text-sm'}>No activity matches your filters.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ${isCompactMode ? 'gap-3 mt-3' : 'gap-5 md:gap-6 mt-5 md:mt-6'}`}>
        <motion.div custom={1.5} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2 h-full">
           <Card className={`bg-brand-secondary border-slate-700/70 h-full ${isCompactMode ? 'p-3' : 'p-4'}`} hoverEffect>
            <h2 className={`font-semibold text-white flex items-center ${isCompactMode ? 'text-base mb-2' : 'text-xl mb-3'}`}>
              <TrendingUp size={isCompactMode ? 16 : 20} className="mr-2 text-brand-accent-purple" />
              Deployment Trend (7 Days)
            </h2>
            <div style={{ width: '100%', height: isCompactMode ? 150 : 200 }}>
              <ResponsiveContainer>
                <LineChart data={MOCK_DEPLOYMENT_TREND_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                  <XAxis dataKey="day" tick={tickStyle} axisLine={axisLineStyle} dy={5} />
                  <YAxis tick={tickStyle} axisLine={axisLineStyle} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(160, 32, 240, 0.1)' }}/>
                  <Line type="monotone" dataKey="deployments" stroke="#A020F0" strokeWidth={2} activeDot={{ r: 5 }} dot={{r:3}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="h-full">
             <WeeklyActivityChart data={MOCK_WEEKLY_CHART_DATA} isCompactMode={isCompactMode} />
        </motion.div>
      </div>

    </div>
  );
};

export default DashboardOverviewPage;
