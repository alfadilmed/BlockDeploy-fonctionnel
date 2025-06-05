
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, UserCircle, Settings, Zap } from 'lucide-react'; 
import Button from './Button';
import { useAppContext } from '../contexts/AppContext';
import { APP_NAME, AVAILABLE_NETWORKS } from '../constants';

interface HeaderProps {
  onToggleSidebar?: () => void; // For mobile
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(AVAILABLE_NETWORKS[0]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-brand-secondary/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: App Name / Hamburger for mobile */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="text-slate-400 hover:text-white lg:hidden mr-3"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <Link to="/dashboard" className="text-2xl font-bold text-slate-100 hidden sm:block">
              {APP_NAME}
            </Link>
          </div>

          {/* Right side: Actions and User */}
          <div className="flex items-center space-x-4">
            {/* Network Selector */}
            <div className="relative">
              <button
                onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                className="flex items-center text-sm text-slate-300 hover:text-white p-2 rounded-md bg-slate-700/50 hover:bg-slate-600/70 transition-colors"
              >
                <Zap size={16} className="w-5 h-5 mr-2 text-brand-accent-blue"/>
                {selectedNetwork}
                <ChevronDown size={16} className={`ml-1 transform transition-transform ${networkDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {networkDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50">
                  {AVAILABLE_NETWORKS.map(network => (
                    <button
                      key={network}
                      onClick={() => {
                        setSelectedNetwork(network);
                        setNetworkDropdownOpen(false);
                        // Add logic to handle network change
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                    >
                      {network}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="primary" size="sm" onClick={() => navigate('/wizard/template')} glowEffect="blue" iconLeft={<Zap size={16} />}>
              Deploy Now
            </Button>
            
            <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700/50 transition-colors">
              <Bell size={20} />
            </button>

            {/* User Dropdown */}
            {user && (
              <div className="relative">
                <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <UserCircle size={28} className="text-slate-400" />
                  )}
                  <ChevronDown size={16} className={`ml-1 text-slate-400 transform transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-slate-400 border-b border-slate-700">
                      <p className="font-semibold text-slate-200">{user.name}</p>
                      <p className="truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard/account" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                      <UserCircle size={16} className="mr-2" /> Account
                    </Link>
                    <Link to="/dashboard/settings" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                      <Settings size={16} className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
