
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { DeployedContract, ContractType } from '../../types';
import { Layers, PlusCircle, Search, Filter, ExternalLink, Trash2, Edit3, Eye } from 'lucide-react';
import Input from '../../components/Input';

const MOCK_DEPLOYMENTS: DeployedContract[] = [
  { id: '1', name: 'My Awesome Token', type: ContractType.ERC20, address: '0x123...abc', network: 'Ethereum Mainnet', deploymentDate: '2023-07-15', status: 'Deployed' },
  { id: '2', name: 'Cool Cats NFT', type: ContractType.NFT, address: '0x456...def', network: 'Polygon Mainnet', deploymentDate: '2023-06-20', status: 'Deployed' },
  { id: '3', name: 'Community DAO', type: ContractType.DAO, address: '0x789...ghi', network: 'BNB Smart Chain', deploymentDate: '2023-05-10', status: 'Pending' },
  { id: '4', name: 'Test Utility Token', type: ContractType.ERC20, address: '0xabc...123', network: 'Sepolia Testnet', deploymentDate: '2023-07-01', status: 'Failed' },
];

const DeploymentsPage: React.FC = () => {
  const [deployments, setDeployments] = useState<DeployedContract[]>(MOCK_DEPLOYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNetwork, setFilterNetwork] = useState('All');

  const networks = ['All', ...new Set(deployments.map(d => d.network))];

  const filteredDeployments = deployments.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNetwork = filterNetwork === 'All' || contract.network === filterNetwork;
    return matchesSearch && matchesNetwork;
  });
  
  const getStatusColor = (status: DeployedContract['status']) => {
    if (status === 'Deployed') return 'bg-green-500/20 text-green-400';
    if (status === 'Pending') return 'bg-yellow-500/20 text-yellow-400';
    if (status === 'Failed') return 'bg-red-500/20 text-red-400';
    return 'bg-slate-500/20 text-slate-400';
  };

  const handleDeleteContract = (id: string) => {
    if(window.confirm("Are you sure you want to delete this contract record? This action cannot be undone.")) {
        setDeployments(prev => prev.filter(d => d.id !== id));
        // Add API call to delete from backend
        alert(`Contract record ${id} deleted (mock).`);
    }
  };


  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white">My Deployments</h1>
            <p className="text-slate-400">Manage and track your deployed smart contracts.</p>
        </div>
        <Button variant="primary" onClick={() => window.location.hash = '/wizard/template'} iconLeft={<PlusCircle size={18}/>} glowEffect="blue">
          New Deployment
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 p-4 bg-brand-secondary rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-grow w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeft={<Search size={18} className="text-slate-400" />}
            className="bg-slate-700 border-slate-600 focus:bg-slate-800"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400 flex-shrink-0" />
          <select
            value={filterNetwork}
            onChange={(e) => setFilterNetwork(e.target.value)}
            className="bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-brand-accent-blue outline-none w-full md:w-auto"
          >
            {networks.map(network => (
              <option key={network} value={network}>{network}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Deployments Table/List */}
      {filteredDeployments.length === 0 ? (
        <div className="text-center py-12 bg-brand-secondary rounded-lg border border-slate-700">
          <Layers size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Deployments Found</h3>
          <p className="text-slate-400">Start by deploying a new contract or adjust your filters.</p>
        </div>
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
              {filteredDeployments.map((contract) => (
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
                      <button title="Edit (mock)" className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-slate-700 rounded-md transition-colors" onClick={() => alert(`Edit ${contract.name} (mock)`)}>
                        <Edit3 size={16} />
                      </button>
                       <button title="Delete Record" className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors" onClick={() => handleDeleteContract(contract.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeploymentsPage;
