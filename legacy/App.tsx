
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/public/HomePage';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import DocsPage from './pages/public/DocsPage';
import TokenomicsPage from './pages/public/TokenomicsPage'; // Added TokenomicsPage
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'; // Ensured relative path
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import DeploymentsPage from './pages/dashboard/DeploymentsPage';
import TemplatesPage from './pages/dashboard/TemplatesPage';
import AccountPage from './pages/dashboard/AccountPage';
import BillingPage from './pages/dashboard/BillingPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import WizardTemplatePage from './pages/wizard/WizardTemplatePage';
import WizardConfigPage from './pages/wizard/WizardConfigPage';
import WizardNetworkPage from './pages/wizard/WizardNetworkPage';
import WizardReviewPage from './pages/wizard/WizardReviewPage';
import WizardSuccessPage from './pages/wizard/WizardSuccessPage';
import AcademyPage from './pages/secondary/AcademyPage';
import MarketplacePage from './pages/secondary/MarketplacePage';
import SupportPage from './pages/secondary/SupportPage';
import { useAppContext } from './contexts/AppContext';

// New Dashboard Pages
import Web3ServicesPage from './pages/dashboard/Web3ServicesPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage'; // Ensured relative path
import ProjectOverviewPage from './pages/dashboard/ProjectOverviewPage';
import LaunchpadPage from './pages/dashboard/LaunchpadPage'; // Added Launchpad Page
import Web3UIDemoPage from './components/web3-ui/Web3Demo.jsx'; // Import the existing demo page

// New Style Guide Page
import UIGuidePage from './pages/ui-guide.jsx';

// New Builder Page
import BuilderPage from './pages/builder.jsx';


const App: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/tokenomics" element={<TokenomicsPage />} /> {/* Added Tokenomics route */}
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* UI Style Guide (Standalone Page) */}
      <Route path="/ui-guide" element={<UIGuidePage />} />

      {/* Dashboard & Wizard Pages (Protected) */}
      <Route
        element={
          isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/dashboard" element={<DashboardOverviewPage />} />
        <Route path="/dashboard/project-overview" element={<ProjectOverviewPage />} />
        <Route path="/dashboard/deployments" element={<DeploymentsPage />} />
        <Route path="/dashboard/templates" element={<TemplatesPage />} />
        <Route path="/dashboard/builder" element={<BuilderPage />} />
        <Route path="/dashboard/launchpad" element={<LaunchpadPage />} /> {/* Added Launchpad route */}
        <Route path="/dashboard/web3-services" element={<Web3ServicesPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/account" element={<AccountPage />} />
        <Route path="/dashboard/billing" element={<BillingPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        
        {/* Wizard Pages */}
        <Route path="/wizard/template" element={<WizardTemplatePage />} />
        <Route path="/wizard/config" element={<WizardConfigPage />} />
        <Route path="/wizard/network" element={<WizardNetworkPage />} />
        <Route path="/wizard/review" element={<WizardReviewPage />} />
        <Route path="/wizard/success" element={<WizardSuccessPage />} />

        {/* Web3 UI Demo Page (existing) */}
        <Route path="/dashboard/web3-demo" element={<Web3UIDemoPage />} />
      </Route>
      
      {/* Fallback for unmatched routes or redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
