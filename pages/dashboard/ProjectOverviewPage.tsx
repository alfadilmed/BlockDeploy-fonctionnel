import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { DeployedContract, ContractType, Project } from '../../types';
import { FolderDot, Layers, PlusCircle, Search, Filter, ExternalLink, Trash2, Edit3, Eye, Settings2 } from 'lucide-react';
import Input from '../../components/Input';
import GlowButton from '../../components/GlowButton';

// Mock project data (static for UI display)
const MOCK_PROJECT: Project = {
    id: 'proj_001',
    name: 'My DeFi Protocol X',
    creationDate: '2024-05-15',
    ownerId: 'user_123',
    associatedWallet: '0xAbC123DeF456GhI789JkL012MnOpQrStUvWxYz',
    description: 'A suite of decentralized finance tools including a token, staking, and governance.'
};

const MOCK_PROJECT_DEPLOYMENTS: DeployedContract[] = [
  { projectId: 'proj_001', id: 'dep_001', name: 'ProjectX Token (PXT)', type: ContractType.ERC20, address: '0x1A2b3C...', network: 'Polygon Mainnet', deploymentDate: '2024-05-20', status: 'Deployed' },
  { projectId: 'proj_001', id: 'dep_002', name: 'PXT Staking Pool', type: ContractType.Custom, address: '0x4D5e6F...', network: 'Polygon Mainnet', deploymentDate: '2024-06-01', status: 'Deployed' },
  { projectId: 'proj_001', id: 'dep_003', name: 'ProjectX Governance', type: ContractType.Governance, address: '0x7G8h9I...', network: 'Sepolia Testnet', deploymentDate: '2024-07-10', status: 'Pending' },
];

const ProjectOverviewPage: React.FC = () => {
  const [deployments, setDeployments] = useState<DeployedContract[]>(MOCK_PROJECT_DEPLOYMENTS);
  // Add search/filter states if needed for deployments list

  const getStatusColor = (status: DeployedContract['status']) => {
    if (status === 'Deployed') return 'bg-green-500/20 text-green-400';
    if (status === 'Pending') return 'bg-yellow-500/20 text-yellow-400';
    if (status === 'Failed') return 'bg-red-500/20 text-red-400';
    return 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
            <FolderDot size={38} className="text-brand-accent-blue mr-4" />
            <div>
                <h1 className="text-3xl font-bold text-white">{MOCK_PROJECT.name}</h1>
                <p className="text-slate-400">Manage your dApp project and associated smart contracts.</p>
            </div>
        </div>
        <div className="flex space-x-3">
            <Button variant="outline" onClick={() => alert('Project Settings (Mock)')} iconLeft={<Settings2 size={16}/>}>
                Project Settings
            </Button>
             <GlowButton glowColor="blue" onClick={() => window.location.hash = '/wizard/template'} iconLeft={<PlusCircle size={18}/>}>
                Add New Contract
            </GlowButton>
        </div>
      </div>

      {/* Project Details Card */}
      <Card className="mb-8 bg-brand-secondary border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-3">Project Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><strong className="text-slate-300">Project ID:</strong> <span className="text-slate-400">{MOCK_PROJECT.id}</span></div>
            <div><strong className="text-slate-300">Creation Date:</strong> <span className="text-slate-400">{MOCK_PROJECT.creationDate}</span></div>
            <div>
                <strong className="text-slate-300">Associated Wallet:</strong>
                <span className="text-slate-400 ml-1 font-mono text-xs" title={MOCK_PROJECT.associatedWallet}>
                    {`${MOCK_PROJECT.associatedWallet?.substring(0,10)}...${MOCK_PROJECT.associatedWallet?.substring(MOCK_PROJECT.associatedWallet.length - 8)}`}
                </span>
            </div>
            <div className="col-span-1 md:col-span-2"><strong className="text-slate-300">Description:</strong> <span className="text-slate-400">{MOCK_PROJECT.description}</span></div>
        </div>
      </Card>

      {/* Associated Deployments */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Associated Deployments ({deployments.length})</h2>
            {/* Add filter/search for deployments if list becomes long */}
        </div>
        {deployments.length === 0 ? (
            <Card className="text-center py-12 bg-brand-secondary border-slate-700">
            <Layers size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Contracts Deployed for this Project Yet</h3>
            <p className="text-slate-400 mb-4">Start by adding a new contract to your project.</p>
            <Button variant="primary" onClick={() => window.location.hash = '/wizard/template'} iconLeft={<PlusCircle size={18}/>}>
                Deploy First Contract
            </Button>
            </Card>
        ) : (
            <div className="bg-brand-secondary shadow-xl rounded-lg border border-slate-700 overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Address</th>
                    <th scope="col" className="px-6 py-3">Network</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {deployments.map((contract) => (
                    <tr key={contract.id} className="border-b border-slate-700 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{contract.name}</td>
                    <td className="px-6 py-4">{contract.type}</td>
                    <td className="px-6 py-4 font-mono text-brand-accent-blue hover:underline cursor-pointer" title={contract.address}>
                        {`${contract.address.substring(0, 6)}...${contract.address.substring(contract.address.length - 4)}`}
                    </td>
                    <td className="px-6 py-4">{contract.network}</td>
                    <td className="px-6 py-4">{contract.deploymentDate}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                        <button title="View Details" className="p-1.5 text-slate-400 hover:text-brand-accent-blue hover:bg-slate-700 rounded-md transition-colors" onClick={() => alert(`View details for ${contract.name}`)}>
                            <Eye size={16} />
                        </button>
                        <a href={`#`} title="View on Explorer" target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-brand-accent-blue hover:bg-slate-700 rounded-md transition-colors" onClick={(e) => {e.preventDefault(); alert('Open explorer link (mocked)');}}>
                            <ExternalLink size={16} />
                        </a>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    </div>
  );
};

export default ProjectOverviewPage;