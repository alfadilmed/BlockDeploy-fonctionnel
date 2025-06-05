
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DASHBOARD_SIDEBAR_LINKS, APP_NAME, SECONDARY_NAV_LINKS } from '../constants';
import { Power } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface SidebarProps {
  isOpen?: boolean; // For mobile
  onClose?: () => void; // For mobile
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAppContext();
  const commonLinkClasses = "flex items-center px-4 py-3 rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-brand-accent-blue/20 text-brand-accent-blue shadow-inner";
  const inactiveLinkClasses = "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200";

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      <aside className={`fixed lg:sticky top-0 left-0 h-full w-64 bg-brand-secondary border-r border-slate-700 p-4 flex flex-col transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="text-2xl font-bold text-slate-100">
            {APP_NAME}
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
             {/* Close Icon for mobile */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <nav className="flex-grow space-y-1.5">
          {DASHBOARD_SIDEBAR_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={onClose} // Close sidebar on mobile nav
              className={({ isActive }) => 
                `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <link.icon size={20} className="mr-3" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Secondary Links (Academy, Marketplace, Support) */}
         <div className="mt-auto pt-4 border-t border-slate-700">
            <p className="px-4 text-xs text-slate-500 uppercase mb-2">Learn & Explore</p>
            <nav className="space-y-1.5">
                {SECONDARY_NAV_LINKS.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={onClose}
                    className={({ isActive }) => 
                    `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                    }
                >
                    <link.icon size={20} className="mr-3" />
                    {link.name}
                </NavLink>
                ))}
            </nav>
         </div>


        <div className="mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={() => {
              logout();
              if(onClose) onClose();
            }}
            className={`${commonLinkClasses} ${inactiveLinkClasses} w-full text-red-400 hover:bg-red-500/20 hover:text-red-300`}
          >
            <Power size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
