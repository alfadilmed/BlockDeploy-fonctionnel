
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../../components/TemplateCard'; // Updated import
import { CONTRACT_TEMPLATES_DATA } from '../../constants';
import { ContractTemplate } from '../../types';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useWizardContext } from '../../contexts/WizardContext';

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedTemplate } = useWizardContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', ...new Set(CONTRACT_TEMPLATES_DATA.map(t => t.category))];

  const filteredTemplates = CONTRACT_TEMPLATES_DATA.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    navigate('/wizard/config');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white">Smart Contract Templates</h1>
            <p className="text-slate-400">Choose a battle-tested template to start your Web3 project.</p>
        </div>
        <div className="flex items-center space-x-2">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'outline'} 
              onClick={() => setViewMode('grid')} 
              size="sm" 
              iconLeft={<LayoutGrid size={16} />} 
              aria-label="Grid view"
            />
            <Button 
              variant={viewMode === 'list' ? 'primary' : 'outline'} 
              onClick={() => setViewMode('list')} 
              size="sm" 
              iconLeft={<List size={16} />}
              aria-label="List view"
            />
        </div>
      </div>

      <div className="mb-8 p-4 bg-brand-secondary rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-grow w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search templates (e.g., ERC20, NFT, DAO)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeft={<Search size={18} className="text-slate-400" />}
            className="bg-slate-700 border-slate-600 focus:bg-slate-800"
            aria-label="Search templates"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400 flex-shrink-0" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-brand-accent-blue outline-none w-full md:w-auto"
            aria-label="Filter by category"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Templates Found</h3>
          <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            onUse={() => handleSelectTemplate(template)}
            // For list view, we might want a slightly different layout within TemplateCard or pass a prop
            className={viewMode === 'list' ? '!flex-row !items-center !text-left' : ''} 
          />
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
