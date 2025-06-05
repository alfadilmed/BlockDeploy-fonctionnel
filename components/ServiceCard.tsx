
import React from 'react';
import Card from './Card';
import Button from './Button'; // Or GlowButton if preferred for CTAs
import { Web3Service } from '../types';

interface ServiceCardProps {
  service: Web3Service;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, className = '' }) => {
  const IconComponent = service.icon;

  return (
    <Card 
      className={`flex flex-col bg-brand-secondary border-slate-700 hover:border-brand-accent-purple/70 transition-all duration-300 group ${className}`}
      hoverEffect
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-lg bg-brand-accent-purple/10 group-hover:bg-brand-accent-purple/20 transition-colors mr-4">
          <IconComponent size={28} className="text-brand-accent-purple transition-transform group-hover:scale-110" />
        </div>
        <h3 className="text-xl font-semibold text-white leading-tight">{service.title}</h3>
      </div>
      <p className="text-sm text-slate-400 mb-5 flex-grow min-h-[4.5rem]">{service.description}</p>
      <Button 
        variant="secondary" 
        onClick={service.action} 
        className="mt-auto w-full group-hover:shadow-neon-purple/50 transition-shadow"
        // glowEffect="purple" // If using Button and want static glow
      >
        {service.ctaText}
      </Button>
    </Card>
  );
};

export default ServiceCard;
