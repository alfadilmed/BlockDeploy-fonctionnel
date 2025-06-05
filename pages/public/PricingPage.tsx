
import React from 'react';
import Button from '../../components/Button';
import { CheckCircle } from 'lucide-react';
import { PricingPlan } from '../../types';

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '$0/month',
    features: [
      'Deploy up to 2 contracts',
      'Basic ERC-20 & NFT templates',
      'Community support',
      'Testnet deployments only',
    ],
    cta: 'Start for Free',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '$49/month',
    features: [
      'Deploy up to 20 contracts',
      'All standard templates (ERC-20, NFT, DAO)',
      'Mainnet deployments',
      'Priority email support',
      'Basic analytics',
      'Access to new features first',
    ],
    cta: 'Choose Pro',
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited contract deployments',
      'Custom template creation',
      'Dedicated support & SLA',
      'Advanced analytics & reporting',
      'Team collaboration features',
      'White-label solutions',
    ],
    cta: 'Contact Sales',
  },
];

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
  <div className={`bg-brand-secondary p-8 rounded-xl shadow-xl border ${plan.isPopular ? 'border-brand-accent-blue shadow-neon-blue/30' : 'border-slate-700'} flex flex-col`}>
    {plan.isPopular && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-accent-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
    <p className={`text-4xl font-extrabold mb-6 ${plan.isPopular ? 'text-brand-accent-blue' : 'text-slate-300'}`}>{plan.price}</p>
    <ul className="space-y-3 mb-8 flex-grow">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-start text-slate-400">
          <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <Button 
      variant={plan.isPopular ? 'primary' : 'outline'} 
      size="lg" 
      className="w-full mt-auto"
      onClick={() => window.location.hash = plan.id === 'enterprise' ? '/contact' : '/register'}
      glowEffect={plan.isPopular ? 'blue' : null}
    >
      {plan.cta}
    </Button>
  </div>
);

const PricingPage: React.FC = () => {
  return (
    <div className="py-16 md:py-24 bg-brand-primary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Flexible Plans for Every Need
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the BlockDeploy plan that's right for you and start deploying smart contracts today.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map(plan => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-brand-secondary rounded-lg border border-slate-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">Not Sure Which Plan to Choose?</h2>
          <p className="text-slate-400 mb-6">
            Our team can help you find the perfect solution. Start with our Free plan to explore basic features, or contact us for a personalized Enterprise demo.
          </p>
          <Button variant="secondary" size="lg" onClick={() => window.location.hash = '/contact'} glowEffect="purple">
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
