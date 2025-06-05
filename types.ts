
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export enum ContractType {
  ERC20 = 'ERC-20 Token',
  NFT = 'NFT Collection (ERC-721)',
  DAO = 'DAO Contract',
  Custom = 'Custom Contract',
  ERC721A = 'ERC-721A NFT (Gas Efficient)',
  ERC1155 = 'ERC-1155 Multi-Token',
  CrowdfundingDAO = 'Crowdfunding DAO',
  Subscription = 'Subscription Contract',
  TokenVesting = 'Token Vesting',
  TokenAirdrop = 'Token Airdrop',
  Governance = 'Governance Suite (Governor + Timelock)',
}

export interface ContractTemplate {
  id: string;
  name: ContractType;
  description: string;
  icon: React.ElementType; // For Lucide icons
  tags: string[];
  category: string;
}

export interface DeployedContract {
  id: string;
  name: string;
  type: ContractType;
  address: string;
  network: string;
  deploymentDate: string;
  status: 'Deployed' | 'Pending' | 'Failed';
  projectId?: string; // Optional: to link to a project
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
}

export interface WizardField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[]; // For select type
  required?: boolean;
  validation?: (value: any) => string | null; // Returns error message or null
}

export interface WizardStep {
  id: string;
  name: string; // e.g., "Configure Token", "Select Network"
  fields: WizardField[];
}

export interface WizardData {
  template?: ContractTemplate;
  config?: Record<string, any>; // Configuration parameters like name, symbol
  network?: string; // e.g., "Ethereum Mainnet", "Polygon"
  // Add other wizard-specific data as needed
}

// For i18n (placeholder)
export type Locale = 'en' | 'fr';

// For Web3ServicesPage
export interface Web3Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  ctaText: string;
  action: () => void; // Placeholder for button action
}

// For ProjectOverviewPage
export interface Project {
    id: string;
    name: string;
    creationDate: string;
    ownerId: string; // User ID
    associatedWallet?: string;
    description?: string;
}

// For LaunchpadPage
export type LaunchpadProjectStatus = 'Coming Soon' | 'Live' | 'Ended';
export type LaunchpadSpecialTag = 'Trending' | 'New' | 'Featured';
export type CollectionStatusType = 'warning' | 'info' | 'success' | 'neutral';

export interface LaunchpadProject {
  id: string;
  logoUrl?: string | null;
  name: string;
  status: LaunchpadProjectStatus;
  specialTag?: LaunchpadSpecialTag | null;
  description: string;
  detailedDescription?: string;
  projectGoals?: string[];
  tokenomics?: { name: string; value: string }[];
  socialLinks?: { platform: 'twitter' | 'discord' | 'telegram' | 'website'; url: string; icon: React.ElementType }[];
  raisedAmount: number;
  targetAmount: number;
  currency: string;
  endDateInfo: string;
  networkChips?: string[];
  categoryChips?: string[];
  collectionStatusText?: string;
  collectionStatusType?: CollectionStatusType;
}

// For AIRecommendations component
export interface AIRecommendationTip {
  id: string;
  text: string;
  icon?: React.ElementType; // Optional icon for the tip
}

// For FilterPill component
export type FilterPillOption = 'All' | 'ERC-20' | 'NFT' | 'DAO' | 'Failed' | 'Pending' | 'Success' | 'Updated' | 'Token';
