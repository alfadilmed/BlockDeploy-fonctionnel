
import React from 'react';
import { CreditCard, DollarSign, FileText, ShieldCheck, RefreshCw } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PricingPlan } from '../../types'; // Assuming you might reuse this or a similar type

// Mock data for current plan and invoices
const MOCK_CURRENT_PLAN: PricingPlan = {
  id: 'pro',
  name: 'Pro Plan',
  price: '$49/month',
  features: [
    'Deploy up to 20 contracts',
    'All standard templates',
    'Mainnet deployments',
    'Priority email support',
  ],
  cta: 'Manage Subscription', // This will likely link to an external billing portal
};

const MOCK_INVOICES = [
  { id: 'inv_123', date: '2024-07-01', amount: '$49.00', status: 'Paid', pdfLink: '#' },
  { id: 'inv_122', date: '2024-06-01', amount: '$49.00', status: 'Paid', pdfLink: '#' },
  { id: 'inv_121', date: '2024-05-01', amount: '$29.00', status: 'Paid (Old Plan)', pdfLink: '#' },
];

const BillingPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Billing & Subscription</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Section */}
        <Card className="lg:col-span-1 bg-brand-secondary border-slate-700">
          <div className="flex items-center mb-4">
            <CreditCard size={24} className="text-brand-accent-blue mr-3" />
            <h2 className="text-xl font-semibold text-white">Current Plan</h2>
          </div>
          <h3 className="text-2xl font-bold text-brand-accent-blue mb-1">{MOCK_CURRENT_PLAN.name}</h3>
          <p className="text-4xl font-extrabold text-slate-200 mb-3">{MOCK_CURRENT_PLAN.price}</p>
          <p className="text-sm text-slate-400 mb-4">Next billing date: August 1, 2024</p>
          <ul className="space-y-1.5 text-sm text-slate-300 mb-6">
            {MOCK_CURRENT_PLAN.features.slice(0, 3).map((feature, index) => ( // Show a few features
              <li key={index} className="flex items-start">
                <ShieldCheck size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Button 
            variant="primary" 
            className="w-full" 
            onClick={() => alert('Redirecting to billing portal (Stripe/Paddle - Mock)')}
            glowEffect="blue"
          >
            {MOCK_CURRENT_PLAN.cta}
          </Button>
          <Button 
            variant="outline" 
            className="w-full mt-3" 
            onClick={() => window.location.hash = '/pricing'}
          >
            Compare Plans
          </Button>
        </Card>

        {/* Payment Method & Invoices Section */}
        <Card className="lg:col-span-2 bg-brand-secondary border-slate-700">
          <div className="flex items-center mb-6">
            <DollarSign size={24} className="text-brand-accent-purple mr-3" />
            <h2 className="text-xl font-semibold text-white">Payment Details</h2>
          </div>
          
          <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-md font-semibold text-slate-200 mb-2">Payment Method</h3>
            <div className="flex items-center justify-between">
                <p className="text-slate-300">Visa ending in **** 4242</p>
                <Button variant="ghost" size="sm" onClick={() => alert('Update payment method (Mock)')} iconLeft={<RefreshCw size={14}/>}>Update</Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Expires 12/2025</p>
          </div>

          <div>
            <h3 className="text-md font-semibold text-slate-200 mb-3">Billing History</h3>
            {MOCK_INVOICES.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-400">
                    <tr>
                      <th className="pb-2 font-normal">Date</th>
                      <th className="pb-2 font-normal">Description</th>
                      <th className="pb-2 font-normal">Amount</th>
                      <th className="pb-2 font-normal">Status</th>
                      <th className="pb-2 font-normal">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_INVOICES.map(invoice => (
                      <tr key={invoice.id} className="border-b border-slate-700 last:border-0">
                        <td className="py-2.5 text-slate-300">{invoice.date}</td>
                        <td className="py-2.5 text-slate-300">{MOCK_CURRENT_PLAN.name} Subscription</td>
                        <td className="py-2.5 text-slate-300">{invoice.amount}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${invoice.status.includes('Paid') ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <a href={invoice.pdfLink} target="_blank" rel="noopener noreferrer" className="text-brand-accent-blue hover:underline" onClick={(e)=>{e.preventDefault(); alert('Download PDF (Mock)')}}>
                            <FileText size={16} className="inline-block"/>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No billing history found.</p>
            )}
          </div>
        </Card>
      </div>
       <div className="mt-10 text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-2">Questions about your bill?</h3>
          <p className="text-slate-400 mb-4 text-sm">
              If you have any questions regarding your subscription, invoices, or payment methods, please don't hesitate to contact our support team.
          </p>
          <Button variant="secondary" onClick={() => window.location.hash = '/support'}>
              Contact Support
          </Button>
      </div>
    </div>
  );
};

export default BillingPage;
