
import React from 'react';
import { 
  Home, Compass, Package, Users, DollarSign, Info, Mail, BookOpen, LayoutDashboard, Layers, PackagePlus, UserCircle, CreditCard, Settings, Zap, Cpu, CheckCircle, FileText, ShoppingBag, LifeBuoy, HelpCircle,
  GalleryThumbnails, Blocks, PiggyBank, Repeat, LockKeyhole, Gift, Landmark, BarChartHorizontalBig, FolderKanban, BrainCircuit, ShieldAlert, SearchCode, UsersRound, ArrowRightLeftIcon, BadgeCheck, LineChart, BarChart3, PieChart, Network, Ratio, FolderDot, BeakerIcon, Puzzle, Rocket, Coins // Added Rocket, Replaced AppWindow with Puzzle, Added Coins
} from 'lucide-react';
import { ContractType, ContractTemplate, Web3Service } from './types';

export const APP_NAME = "BlockDeploy";

export const PUBLIC_NAV_LINKS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Features', href: '/features', icon: Compass },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
  { name: 'Tokenomics', href: '/tokenomics', icon: Coins }, // Added Tokenomics link
  // { name: 'Docs', href: '/docs', icon: BookOpen },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export const DASHBOARD_SIDEBAR_LINKS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Project Overview', href: '/dashboard/project-overview', icon: FolderDot },
  { name: 'Deployments', href: '/dashboard/deployments', icon: Layers },
  { name: 'Templates', href: '/dashboard/templates', icon: PackagePlus },
  { name: 'dApp Builder', href: '/dashboard/builder', icon: Puzzle }, 
  { name: 'Launchpad', href: '/dashboard/launchpad', icon: Rocket }, // Added Launchpad link
  { name: 'Web3 Services', href: '/dashboard/web3-services', icon: BrainCircuit },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChartHorizontalBig },
  { name: 'Account', href: '/dashboard/account', icon: UserCircle },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Web3 UI Demo', href: '/dashboard/web3-demo', icon: BeakerIcon }, 
];

export const SECONDARY_NAV_LINKS = [
  { name: 'Academy', href: '/academy', icon: BookOpen },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Support', href: '/support', icon: LifeBuoy },
];


export const CONTRACT_TEMPLATES_DATA: ContractTemplate[] = [
  {
    id: 'erc20',
    name: ContractType.ERC20,
    description: 'Launch your own cryptocurrency or utility token.',
    icon: Package,
    tags: ['Fungible', 'Token', 'Currency'],
    category: 'Tokens',
  },
  {
    id: 'nft',
    name: ContractType.NFT,
    description: 'Create unique digital collectibles or art pieces (standard ERC-721).',
    icon: Users, // Placeholder, could be Diamond or similar
    tags: ['Non-Fungible', 'Collectible', 'ERC721'],
    category: 'NFTs',
  },
  {
    id: 'dao',
    name: ContractType.DAO,
    description: 'Establish a decentralized autonomous organization with basic governance.',
    icon: Users,
    tags: ['Governance', 'Community', 'Voting'],
    category: 'Organization',
  },
  {
    id: 'erc721a',
    name: ContractType.ERC721A,
    description: 'Mint multiple NFTs efficiently with significant gas savings (ERC-721A standard).',
    icon: GalleryThumbnails,
    tags: ['NFT', 'Gas Efficient', 'ERC721A', 'Collectible'],
    category: 'NFTs',
  },
  {
    id: 'erc1155',
    name: ContractType.ERC1155,
    description: 'Create contracts that manage multiple token types (fungible and non-fungible) in one.',
    icon: Blocks,
    tags: ['Multi-Token', 'Semi-Fungible', 'ERC1155', 'Gaming'],
    category: 'Tokens',
  },
  {
    id: 'crowdfundingdao',
    name: ContractType.CrowdfundingDAO,
    description: 'Raise funds for a project and allow contributors to vote on proposals.',
    icon: PiggyBank,
    tags: ['DAO', 'Fundraising', 'Crowdsale', 'Community'],
    category: 'DeFi & DAOs',
  },
  {
    id: 'subscription',
    name: ContractType.Subscription,
    description: 'Set up recurring payment systems for services or content using crypto.',
    icon: Repeat,
    tags: ['Payments', 'Recurring', 'SaaS', 'Utility'],
    category: 'DeFi & Utility',
  },
  {
    id: 'tokenvesting',
    name: ContractType.TokenVesting,
    description: 'Lock tokens for a specified period, gradually releasing them over time (e.g., for teams, advisors).',
    icon: LockKeyhole,
    tags: ['Vesting', 'Tokenomics', 'Timelock', 'Team'],
    category: 'Tokenomics',
  },
  {
    id: 'tokenairdrop',
    name: ContractType.TokenAirdrop,
    description: 'Distribute tokens to multiple addresses in a single transaction efficiently.',
    icon: Gift,
    tags: ['Airdrop', 'Distribution', 'Marketing', 'Community'],
    category: 'Tokenomics',
  },
  {
    id: 'governance',
    name: ContractType.Governance,
    description: 'Deploy a comprehensive governance system with a Governor contract and Timelock controller.',
    icon: Landmark,
    tags: ['DAO', 'Governance', 'Voting', 'Timelock', 'Advanced'],
    category: 'Organization',
  },
];

export const WIZARD_STEPS_CONFIG = [
    { id: 'template', name: 'Select Template', path: '/wizard/template', icon: PackagePlus },
    { id: 'config', name: 'Configure Details', path: '/wizard/config', icon: Settings },
    { id: 'network', name: 'Choose Network', path: '/wizard/network', icon: Cpu },
    { id: 'review', name: 'Review & Deploy', path: '/wizard/review', icon: Zap },
    { id: 'success', name: 'Deployment Complete', path: '/wizard/success', icon: CheckCircle },
];

export const AVAILABLE_NETWORKS = [
    "Ethereum Mainnet",
    "BNB Smart Chain",
    "Polygon Mainnet",
    "Arbitrum One",
    "Optimism",
    "Sepolia Testnet",
    "Goerli Testnet",
];

export const WEB3_SERVICES_DATA: Web3Service[] = [
  {
    id: 'rpc-gateway',
    title: 'RPC & API Gateway',
    description: 'Generate a multi-chain RPC API key for reliable access to blockchain data and transaction submission.',
    icon: Network,
    ctaText: 'Generate Key',
    action: () => alert('RPC Key Generation (Mocked)'),
  },
  {
    id: 'contract-audit',
    title: 'Smart Contract Audit',
    description: 'Upload your smart contract source code for an automated security analysis and vulnerability scan.',
    icon: ShieldAlert,
    ctaText: 'Upload & Scan',
    action: () => alert('Smart Contract Audit (Mocked - File Upload Needed)'),
  },
  {
    id: 'tokenomics-designer',
    title: 'Tokenomics Designer',
    description: 'Visually design and model your token distribution, vesting schedules, and supply mechanics.',
    icon: PieChart,
    ctaText: 'Open Designer',
    action: () => alert('Tokenomics Designer (Mocked - Opens New Interface)'),
  },
  {
    id: 'dao-as-a-service',
    title: 'DAO-as-a-Service',
    description: 'Quickly launch a DAO with pre-configured governance tools, voting mechanisms, and treasury management.',
    icon: UsersRound,
    ctaText: 'Launch DAO',
    action: () => { window.location.hash = '/wizard/template?type=governance'; }, // Or a more specific DAO launch flow
  },
  {
    id: 'bridge-interface',
    title: 'Cross-Chain Bridge',
    description: 'Integrate a secure interface for bridging assets between different blockchain networks.',
    icon: ArrowRightLeftIcon,
    ctaText: 'Open Bridge UI',
    action: () => alert('Bridge Interface (Mocked - Opens Bridge UI)'),
  },
  {
    id: 'sbt-minting',
    title: 'Soulbound Tokens (SBTs)',
    description: 'Create and manage non-transferable Soulbound Tokens for identity, reputation, or attestations.',
    icon: BadgeCheck,
    ctaText: 'Mint SBT',
    action: () => alert('SBT Minting Service (Mocked)'),
  },
];
