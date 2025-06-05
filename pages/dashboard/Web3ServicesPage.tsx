
import React from 'react';
import ServiceCard from '../../components/ServiceCard';
import { WEB3_SERVICES_DATA } from '../../constants';
import { BrainCircuit } from 'lucide-react'; // Or another suitable icon

const Web3ServicesPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center mb-8">
        <BrainCircuit size={36} className="text-brand-accent-purple mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-white">Web3 Services</h1>
          <p className="text-slate-400">
            Explore powerful Web3 tools and services to enhance your dApps and streamline development.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WEB3_SERVICES_DATA.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-brand-secondary rounded-lg border border-slate-700 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">More Services Coming Soon!</h3>
        <p className="text-slate-400">
          We are constantly expanding our suite of Web3 services. Stay tuned for updates on new tools and integrations.
        </p>
      </div>
    </div>
  );
};

export default Web3ServicesPage;
