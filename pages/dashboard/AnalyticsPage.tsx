import React from 'react';
import StatsWidget from '../../components/StatsWidget';
import Card from '../../components/Card';
import { 
  BarChartHorizontalBig, LineChart as LineChartIcon, BarChart3 as BarChart3Icon, PieChart as PieChartIcon, 
  Zap, Package, Network, Ratio, HelpCircle, Fuel, CalendarDays, TrendingUp, Award, ChevronDown, Activity, Clock, ArrowUpRight
} from 'lucide-react';
import GlowButton from '../../components/GlowButton';
import { 
  ResponsiveContainer, LineChart, Line, Area, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import CustomTooltip from '../../components/CustomTooltip'; // Import the new CustomTooltip

// Mock data for demonstration (existing)
const MOCK_ANALYTICS_STATS = {
  totalGasUsed: '1.25 ETH',
  avgGasPerTx: '0.005 ETH',
  totalDeployments: 78,
  deploymentsThisMonth: 12,
  preferredNetwork: 'Polygon Mainnet',
  topTemplate: 'ERC-721A NFT',
  testnetVsMainnet: '65% Testnet / 35% Mainnet',
  activeContracts: 53,
  // New KPI data
  avgGasPerDeployment: '0.0042 ETH',
  mostActiveDay: 'Wednesday',
};

// Chart Data (existing)
const gasUsedData = [
  { month: "Jan", gasUsed: 32000 }, { month: "Feb", gasUsed: 28000 },
  { month: "Mar", gasUsed: 45000 }, { month: "Apr", gasUsed: 41000 },
  { month: "May", gasUsed: 52000 }, { month: "Jun", gasUsed: 68000 },
];

const deploymentsPerNetworkData = [
  { network: "Ethereum", ERC20: 12, NFT: 25, DAO: 5 },
  { network: "Polygon", ERC20: 30, NFT: 40, DAO: 15 },
  { network: "BNB Chain", ERC20: 22, NFT: 18, DAO: 8 },
  { network: "Arbitrum", ERC20: 15, NFT: 10, DAO: 3 },
  { network: "Optimism", ERC20: 10, NFT: 7, DAO: 2 },
];

const monthlyDeploymentVolumeData = [
  { month: "Jan", deployments: 50 }, { month: "Feb", deployments: 65 },
  { month: "Mar", deployments: 80 }, { month: "Apr", deployments: 72 },
  { month: "May", deployments: 95 }, { month: "Jun", deployments: 110 },
];

const contractTypeDistributionData = [
  { name: "ERC-20", value: 400 }, { name: "ERC-721", value: 300 },
  { name: "ERC-1155", value: 180 }, { name: "DAO", value: 120 },
];

// New Chart Data: Deployments by Time of Day
const deploymentsByTimeData = [
  { time: "00-03h", deployments: 15 },
  { time: "03-06h", deployments: 25 },
  { time: "06-09h", deployments: 40 },
  { time: "09-12h", deployments: 75 },
  { time: "12-15h", deployments: 90 },
  { time: "15-18h", deployments: 60 },
  { time: "18-21h", deployments: 45 },
  { time: "21-00h", deployments: 30 },
];


const GRADIENT_URLS = ['url(#gradientBlue)', 'url(#gradientPurple)', 'url(#gradientEmerald)', 'url(#gradientYellow)'];
const TIME_CHART_COLORS = ['#00A8FF', '#7B2CBF', '#2AAA8A', '#F59E0B', '#0077B6', '#A020F0', '#34D399', '#D48806'];


const tickStyle = { fill: '#94a3b8', fontSize: '12px' }; // slate-400
const axisLineStyle = { stroke: '#475569' }; // slate-600
const legendStyle = { color: '#cbd5e1', fontSize: '12px' }; // slate-300
const chartGridStroke = "rgba(71, 85, 105, 0.3)"; // slate-600 at 30% opacity for softer gridlines


const AnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-2 sm:px-0">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00A8FF" stopOpacity={0.5}/>
            <stop offset="95%" stopColor="#00A8FF" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00A8FF" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#00A8FF" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A020F0" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#A020F0" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="gradientEmerald" x1="0" y1="0" x2="0" y2="1"> {/* For #34D399 */}
            <stop offset="0%" stopColor="#34D399" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#34D399" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="gradientYellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.3}/>
          </linearGradient>
          {TIME_CHART_COLORS.map((color, index) => (
            <linearGradient key={`grad-time-${index}`} id={`gradientTimeColor${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 pb-6 border-b border-slate-700/80">
        <BarChartHorizontalBig size={40} className="text-brand-accent-blue mr-4 mb-3 sm:mb-0 shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Deployment Analytics</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Track performance metrics and gain insights into your contract activities.
          </p>
        </div>
      </div>

      {/* Filter UI (Static) */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="timeRangeFilter" className="text-xs text-slate-400 mb-1 block">Time Range</label>
          <div id="timeRangeFilter" className="bg-slate-700/60 border border-slate-600/80 rounded-lg p-2.5 text-sm text-slate-300 flex items-center justify-between cursor-pointer hover:border-slate-500 transition-colors">
            <span>Last 30 Days</span>
            <ChevronDown size={18} className="text-slate-400" />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="networkFilter" className="text-xs text-slate-400 mb-1 block">Network</label>
          <div id="networkFilter" className="bg-slate-700/60 border border-slate-600/80 rounded-lg p-2.5 text-sm text-slate-300 flex items-center justify-between cursor-pointer hover:border-slate-500 transition-colors">
            <span>All Networks</span>
            <ChevronDown size={18} className="text-slate-400" />
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 mb-10">
        <StatsWidget 
          label="Total Deployments" 
          value={MOCK_ANALYTICS_STATS.totalDeployments} 
          icon={<Zap size={22} />} 
          trend="up" 
          trendValue={`+${MOCK_ANALYTICS_STATS.deploymentsThisMonth} this month`}
          iconBgColorClass="bg-sky-500/15"
          iconColorClass="text-sky-300"
          className="rounded-xl border-slate-700/80 hover:border-sky-500/50 transition-colors duration-300"
        />
        <StatsWidget 
          label="Top Template Used" 
          value={MOCK_ANALYTICS_STATS.topTemplate} 
          icon={<Package size={22} />}
          iconBgColorClass="bg-purple-500/15"
          iconColorClass="text-purple-300"
          className="rounded-xl border-slate-700/80 hover:border-purple-500/50 transition-colors duration-300"
        />
        <StatsWidget 
          label="Preferred Network" 
          value={MOCK_ANALYTICS_STATS.preferredNetwork} 
          icon={<Network size={22} />}
          iconBgColorClass="bg-green-500/15"
          iconColorClass="text-green-300"
          className="rounded-xl border-slate-700/80 hover:border-green-500/50 transition-colors duration-300"
        />
        <StatsWidget 
          label="Testnet/Mainnet Ratio" 
          value={MOCK_ANALYTICS_STATS.testnetVsMainnet.split('/')[0].trim()}
          icon={<Ratio size={22} />}
          period={MOCK_ANALYTICS_STATS.testnetVsMainnet.split('/')[1].trim()}
          iconBgColorClass="bg-yellow-500/15"
          iconColorClass="text-yellow-300"
          className="rounded-xl border-slate-700/80 hover:border-yellow-500/50 transition-colors duration-300"
        />
        <StatsWidget 
          label="Avg. Gas per Deployment" 
          value={MOCK_ANALYTICS_STATS.avgGasPerDeployment} 
          icon={<Fuel size={22} />}
          iconBgColorClass="bg-red-500/15"
          iconColorClass="text-red-300"
          className="rounded-xl border-slate-700/80 hover:border-red-500/50 transition-colors duration-300"
        />
        <StatsWidget 
          label="Most Active Day" 
          value={MOCK_ANALYTICS_STATS.mostActiveDay} 
          icon={<CalendarDays size={22} />}
          iconBgColorClass="bg-teal-500/15"
          iconColorClass="text-teal-300"
          className="rounded-xl border-slate-700/80 hover:border-teal-500/50 transition-colors duration-300"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mb-10">
        <Card className="bg-brand-secondary border-slate-700/80 p-4 md:p-6 rounded-xl hover:shadow-brand-accent-blue/30 hover:border-brand-accent-blue/60 transition-all duration-300">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
            <LineChartIcon size={20} className="text-brand-accent-blue mr-2"/>
            Gas Used Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gasUsedData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={chartGridStroke} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={axisLineStyle} />
              <YAxis tick={tickStyle} axisLine={axisLineStyle} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 168, 255, 0.1)' }}/>
              <Legend wrapperStyle={legendStyle} />
              <Line isAnimationActive={true} animationDuration={800} type="monotone" dataKey="gasUsed" name="Gas Used" stroke="#00A8FF" strokeWidth={2.5} activeDot={{ r: 7, stroke: '#1A1C2D', strokeWidth: 2 }} dot={{r:4, strokeWidth:2, fill: '#1A1C2D', stroke: '#00A8FF'}}/>
              <Area isAnimationActive={true} animationDuration={800} type="monotone" dataKey="gasUsed" stroke={false} fillOpacity={1} fill="url(#gasGradient)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-brand-secondary border-slate-700/80 p-4 md:p-6 rounded-xl hover:shadow-brand-accent-purple/30 hover:border-brand-accent-purple/60 transition-all duration-300">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
            <BarChart3Icon size={20} className="text-brand-accent-purple mr-2"/>
            Deployments per Network
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deploymentsPerNetworkData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={chartGridStroke} />
              <XAxis dataKey="network" tick={tickStyle} axisLine={axisLineStyle} />
              <YAxis tick={tickStyle} axisLine={axisLineStyle}/>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(160, 32, 240, 0.1)' }}/>
              <Legend wrapperStyle={legendStyle} />
              <Bar isAnimationActive={true} animationDuration={800} dataKey="ERC20" stackId="a" fill="url(#gradientBlue)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar isAnimationActive={true} animationDuration={800} dataKey="NFT" stackId="a" fill="url(#gradientPurple)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar isAnimationActive={true} animationDuration={800} dataKey="DAO" stackId="a" fill="url(#gradientEmerald)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-brand-secondary border-slate-700/80 p-4 md:p-6 rounded-xl hover:shadow-green-500/30 hover:border-green-500/60 transition-all duration-300">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
            <LineChartIcon size={20} className="text-green-400 mr-2"/>
            Monthly Deployment Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyDeploymentVolumeData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={chartGridStroke} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={axisLineStyle} />
              <YAxis tick={tickStyle} axisLine={axisLineStyle} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }} />
              <Legend wrapperStyle={legendStyle} />
              <Bar isAnimationActive={true} animationDuration={800} dataKey="deployments" name="Deployments" fill="url(#gradientEmerald)" radius={[4, 4, 0, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-brand-secondary border-slate-700/80 p-4 md:p-6 rounded-xl hover:shadow-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
            <PieChartIcon size={20} className="text-yellow-400 mr-2"/>
            Contract Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
              <Pie
                isAnimationActive={true} 
                animationDuration={800}
                data={contractTypeDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={(entry: any) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
              >
                {contractTypeDistributionData.map((entry, index) => {
                    const fillUrl = GRADIENT_URLS[index % GRADIENT_URLS.length];
                    return <Cell key={`cell-${index}`} fill={fillUrl} stroke="#1A1C2D" strokeWidth={2} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-brand-secondary border-slate-700/80 p-4 md:p-6 rounded-xl hover:shadow-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
            <Clock size={20} className="text-cyan-400 mr-2"/>
            Deployments by Time of Day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deploymentsByTimeData} layout="horizontal" margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={chartGridStroke} />
              <XAxis dataKey="time" angle={-30} textAnchor="end" height={50} tick={tickStyle} interval={0} axisLine={axisLineStyle} />
              <YAxis tick={tickStyle} axisLine={axisLineStyle} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}/>
              <Legend wrapperStyle={legendStyle} />
              <Bar isAnimationActive={true} animationDuration={800} dataKey="deployments" name="Deployments" radius={[4, 4, 0, 0]} barSize={20}>
                {deploymentsByTimeData.map((entry, index) => (
                  <Cell key={`cell-time-${index}`} fill={`url(#gradientTimeColor${index % TIME_CHART_COLORS.length})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="bg-brand-secondary border-slate-700/80 p-6 rounded-xl mb-10 hover:shadow-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300">
        <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
          <Activity size={22} className="text-indigo-400 mr-3" />
          Quick Insights
        </h3>
        <div className="space-y-3 text-sm">
          <p className="flex items-center text-slate-300">
            <TrendingUp size={18} className="text-green-400 mr-2 shrink-0" />
            Deployments saw a <span className="font-semibold text-green-300 mx-1">25% increase</span> this month compared to the last.
          </p>
          <p className="flex items-center text-slate-300">
            <Award size={18} className="text-yellow-400 mr-2 shrink-0" />
            Your most frequently used contract type is <span className="font-semibold text-yellow-300 mx-1">ERC-721A NFT</span>.
          </p>
          <p className="flex items-center text-slate-300">
            <Network size={18} className="text-sky-400 mr-2 shrink-0" />
            <span className="font-semibold text-sky-300 mx-1">Polygon Mainnet</span> currently dominates your deployment activity.
          </p>
        </div>
      </Card>
      
      <Card className="bg-brand-secondary border-slate-700/80 p-6 rounded-xl mb-10 text-center hover:shadow-lime-500/30 hover:border-lime-500/60 transition-all duration-300">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Comparison: Previous Period</h3>
        <div className="flex items-center justify-center text-2xl text-lime-300">
          <ArrowUpRight size={28} className="mr-2"/>
          <span>+12</span>
          <span className="text-base text-slate-400 ml-1.5">deployments vs last month</span>
        </div>
      </Card>
      
      <Card className="group bg-gradient-to-br from-brand-secondary via-slate-800/90 to-brand-secondary border-brand-accent-purple/50 hover:border-brand-accent-purple/70 p-6 md:p-10 text-center rounded-xl shadow-2xl hover:shadow-brand-accent-purple/40 transition-all duration-300 ease-in-out">
         <HelpCircle size={30} className="mx-auto text-brand-accent-purple mb-4 group-hover:scale-110 transition-transform duration-300 ease-out" />
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Want More Detailed Analytics?</h3>
        <p className="text-slate-300 mb-7 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Our upcoming advanced analytics module will provide deeper insights, custom reporting, and real-time monitoring for your projects.
        </p>
        <GlowButton 
            glowColor="purple" 
            variant="secondary" 
            size="lg"
            className="transform group-hover:scale-105 transition-transform duration-300 ease-out"
            onClick={() => alert('Notify me about Advanced Analytics (Mock)')}
        >
            Notify Me When Available
        </GlowButton>
      </Card>

    </div>
  );
};

export default AnalyticsPage;