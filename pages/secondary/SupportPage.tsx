
import React, { useState } from 'react';
import { LifeBuoy, HelpCircle, Search, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';

const MOCK_FAQS = [
  {
    id: 'faq1',
    question: "What blockchains does BlockDeploy support?",
    answer: "BlockDeploy currently supports Ethereum, BNB Smart Chain, Polygon, Arbitrum, and Optimism. We are continuously working to add support for more networks.",
  },
  {
    id: 'faq2',
    question: "Is it safe to deploy contracts using BlockDeploy?",
    answer: "Yes, security is our top priority. All our standard templates are professionally audited. However, for custom configurations or highly sensitive applications, we always recommend conducting your own independent audit.",
  },
  {
    id: 'faq3',
    question: "How are gas fees handled?",
    answer: "Gas fees are paid by you directly from your connected wallet when you deploy a contract to a mainnet. BlockDeploy does not charge extra for gas, but our templates are optimized for gas efficiency.",
  },
  {
    id: 'faq4',
    question: "Can I import an existing contract?",
    answer: "Currently, BlockDeploy focuses on deploying new contracts from templates. Importing existing contracts is a feature we are considering for the future.",
  },
];

const FaqItem: React.FC<{ faq: {id: string, question: string, answer: string} }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-700 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-slate-200 hover:text-brand-accent-blue transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{faq.question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="mt-3 text-slate-400 text-sm leading-relaxed pr-6">
          {faq.answer}
        </div>
      )}
    </div>
  );
};


const SupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Filter logic for FAQs would go here

  return (
    <div className="py-12 md:py-16 bg-brand-primary text-slate-200">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <LifeBuoy size={48} className="mx-auto text-brand-accent-blue mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            BlockDeploy Support Center
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Find answers to your questions or get in touch with our support team.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center"><HelpCircle size={24} className="mr-3 text-brand-accent-purple"/>Frequently Asked Questions</h2>
            <div className="mb-6">
                <Input
                    type="search"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    iconLeft={<Search size={18} className="text-slate-400" />}
                    className="bg-slate-800 border-slate-700 focus:bg-slate-800"
                />
            </div>
            <div className="bg-brand-secondary p-6 rounded-lg border border-slate-700">
                {MOCK_FAQS.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase())).map(faq => (
                    <FaqItem key={faq.id} faq={faq} />
                ))}
                {MOCK_FAQS.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && searchTerm && (
                    <p className="text-slate-400 text-center py-4">No FAQs match your search term.</p>
                )}
            </div>
        </div>

        {/* Contact Support / Ticket Section */}
        <div className="max-w-3xl mx-auto bg-brand-secondary p-8 rounded-xl shadow-xl border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center"><MessageSquare size={24} className="mr-3 text-brand-accent-blue"/>Still Need Help?</h2>
          <p className="text-slate-400 mb-6">
            If you couldn't find an answer in our FAQs, please submit a support ticket or contact us directly. Our team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" glowEffect="blue" className="flex-1" onClick={() => window.location.hash = '/contact?subject=Support_Ticket'}>
              Submit a Support Ticket
            </Button>
             <Button variant="outline" size="lg" className="flex-1" onClick={() => window.location.hash = '/docs'}>
              Read Documentation
            </Button>
          </div>
           <p className="text-xs text-slate-500 mt-6 text-center">
            Our typical response time for support tickets is within 24 business hours. For urgent issues related to Pro or Enterprise plans, please refer to your SLA.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SupportPage;
