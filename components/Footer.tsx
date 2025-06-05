
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, PUBLIC_NAV_LINKS } from '../constants';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-secondary border-t border-slate-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white">{APP_NAME}</Link>
            <p className="mt-2 text-slate-400 text-sm">
              Simplifying Web3 smart contract deployment for everyone.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent-blue transition-colors"><Github size={20} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent-blue transition-colors"><Twitter size={20} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent-blue transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {PUBLIC_NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-400 hover:text-brand-accent-blue text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
               <li>
                  <Link to="/docs" className="text-slate-400 hover:text-brand-accent-blue text-sm transition-colors">
                    Documentation
                  </Link>
                </li>
            </ul>
          </div>
          
          {/* Legal / Resources */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-slate-400 hover:text-brand-accent-blue text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-brand-accent-blue text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/support" className="text-slate-400 hover:text-brand-accent-blue text-sm transition-colors">Support Center</Link></li>
            </ul>
          </div>

          {/* Newsletter/Contact (Optional) */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-2">Get the latest news and updates from BlockDeploy.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-md text-sm focus:ring-1 focus:ring-brand-accent-blue outline-none" />
                <button type="submit" className="bg-brand-accent-blue text-white px-4 py-2 rounded-r-md text-sm font-semibold hover:bg-sky-500 transition-colors">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
          &copy; {currentYear} {APP_NAME}. All rights reserved. Built with futuristic tech.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
