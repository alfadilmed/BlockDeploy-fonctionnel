
import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { PUBLIC_NAV_LINKS, APP_NAME } from '../constants';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { Menu, X } from 'lucide-react';

const PublicHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-brand-primary/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-3xl font-bold text-white flex items-center">
             {/* Placeholder for a logo icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2 text-brand-accent-blue">
              <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.026A.75.75 0 003 6.632v10.736c0 .27.135.518.366.654l8.256 4.424a.75.75 0 00.756 0l8.256-4.424a.75.75 0 00.366-.654V6.632a.75.75 0 00-.366-.606L12.378 1.602zM12 15.93a.75.75 0 00.378-.102l7.122-3.82V7.77L12 11.502V15.93zm0-5.62L19.122 6.5 12 2.77 4.878 6.5 12 10.31zm-.378.102L4.5 6.59v4.232l7.122 3.82V10.412z" />
            </svg>
            {APP_NAME}
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-brand-accent-blue' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Button variant="primary" size="md" onClick={() => window.location.hash = '/login'}>
              Launch App
            </Button>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-secondary border-t border-slate-700 py-4">
          <nav className="flex flex-col space-y-3 px-4">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive ? 'bg-brand-accent-blue/20 text-brand-accent-blue' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Button variant="primary" size="md" className="w-full mt-3" onClick={() => {setIsMobileMenuOpen(false); window.location.hash = '/login';}}>
              Launch App
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};


const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-primary">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
