
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select'; // Assuming Select component is created
import { Globe, Bell, Palette, Trash2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { locale, setLocale } = useAppContext();
  // Mock states for other settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('dark'); // App is dark by default

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as 'en' | 'fr'); // Cast to Locale type
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    // Implement theme switching logic (e.g., adding/removing 'dark' class on html/body)
    // For now, this app is dark by default via Tailwind config in index.html
    alert(`Theme changed to ${theme} (UI update for light mode not fully implemented in this demo).`);
  };
  
  const handleDeleteAccount = () => {
    if(window.confirm("Are you absolutely sure you want to delete your account? This action is irreversible and will permanently remove all your data and deployed contract records.")) {
        if(window.confirm("Second confirmation: This will delete everything. There is no going back. Proceed?")) {
            alert("Account deletion initiated (mock). You will be logged out.");
            // Call API to delete account, then logout user.
            // logout(); navigate('/register');
        }
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Language Settings */}
        <Card className="bg-brand-secondary border-slate-700">
          <div className="flex items-center mb-4">
            <Globe size={22} className="text-brand-accent-blue mr-3" />
            <h2 className="text-xl font-semibold text-white">Language & Region</h2>
          </div>
          <p className="text-sm text-slate-400 mb-3">Choose your preferred language for the BlockDeploy interface.</p>
          <div className="max-w-xs">
            <Select
                id="language"
                label="Interface Language"
                value={locale}
                onChange={handleLanguageChange}
                options={[
                    { value: 'en', label: 'English (US)' },
                    { value: 'fr', label: 'Français (French) - Beta' },
                    // Add more languages as needed
                ]}
            />
          </div>
        </Card>

        {/* Theme Settings - Basic, as app is dark by default */}
        <Card className="bg-brand-secondary border-slate-700">
          <div className="flex items-center mb-4">
            <Palette size={22} className="text-brand-accent-purple mr-3" />
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
          </div>
          <p className="text-sm text-slate-400 mb-3">Customize the look and feel of BlockDeploy.</p>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Theme</label>
            <div className="flex space-x-3">
                <Button variant={currentTheme === 'dark' ? 'primary' : 'outline'} onClick={() => handleThemeChange('dark')}>
                    Dark (Default)
                </Button>
                <Button variant={currentTheme === 'light' ? 'primary' : 'outline'} onClick={() => handleThemeChange('light')} disabled>
                    Light (Coming Soon)
                </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">BlockDeploy is currently optimized for dark mode.</p>
          </div>
        </Card>
        
        {/* Notification Settings */}
        <Card className="bg-brand-secondary border-slate-700">
          <div className="flex items-center mb-4">
            <Bell size={22} className="text-green-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <p className="text-sm text-slate-400 mb-3">Manage how you receive notifications from BlockDeploy.</p>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md">
            <label htmlFor="emailNotifications" className="text-slate-300">
                Email Notifications for Deployments
            </label>
            <button
                id="emailNotifications"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`${
                    notificationsEnabled ? 'bg-brand-accent-blue' : 'bg-slate-600'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-brand-accent-blue`}
                >
                <span className="sr-only">Enable notifications</span>
                <span
                    className={`${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
            </button>
          </div>
          {/* Add more granular notification settings here */}
        </Card>

        {/* Account Deletion */}
        <Card className="bg-brand-secondary border border-red-500/50">
          <div className="flex items-center mb-4">
            <Trash2 size={22} className="text-red-400 mr-3" />
            <h2 className="text-xl font-semibold text-red-300">Danger Zone</h2>
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Deleting your account is a permanent action and cannot be undone. All your data, including deployed contract records (not the on-chain contracts themselves), will be removed from our platform.
          </p>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </Card>

      </div>
    </div>
  );
};

export default SettingsPage;
