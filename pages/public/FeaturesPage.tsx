import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import FeatureCard from '../../components/features/FeatureCard';
import RoadmapCard from '../../components/features/RoadmapCard';
import ModulePreview from '../../components/features/ModulePreview';
import BenefitListItem from '../../components/features/BenefitListItem';
import DemoOnlyModal from '../../components/shared/DemoOnlyModal'; // Reusable modal

import { 
  Code, ShieldCheck, Settings2, Layers, Zap, LayoutDashboard, ArrowRight, Video, Cpu, 
  PuzzleIcon, Link, Bot, ScanSearch, BadgePercent, BookOpen, CheckCircle, ShieldAlert, Telescope, Coffee // Updated Icons
} from 'lucide-react';

// Mock Data (as per instructions)
const CORE_FEATURES_DATA = [
  { icon: Code, title: "Zero-Code Deployment", description: "Launch complex smart contracts without writing a single line of code. Our intuitive UI guides you through every step." },
  { icon: ShieldCheck, title: "Audited Templates", description: "Choose from a library of professionally audited smart contract templates for tokens, NFTs, DAOs, and more." },
  { icon: Settings2, title: "Customizable Parameters", description: "Tailor contracts with parameters like token name, symbol, supply, royalty fees, and governance settings." },
  { icon: Layers, title: "Multi-Chain Support", description: "Deploy on Ethereum, BNB Chain, Polygon, Arbitrum, Optimism, and more with ease." },
  { icon: Zap, title: "Instant Deployment", description: "Go from configuration to live contract in minutes. Our streamlined process ensures rapid deployment." },
  { icon: LayoutDashboard, title: "User-Friendly Dashboard", description: "Manage deployed contracts, track performance, and access settings from a single, intuitive dashboard." },
];

const ROADMAP_FEATURES_DATA = [
  { icon: PuzzleIcon, title: "Seamless Integrations", description: "Easily connect with popular Web3 tools, wallets, and marketplaces.", status: "Coming Soon", launchDate: "Q4 2024" },
  { icon: Cpu, title: "Drag & Drop dApp Builder", description: "Visually construct simple dApp frontends connected to your deployed contracts.", status: "Coming Soon", launchDate: "Q1 2025" },
  { icon: Bot, title: "Web3 AI Assistant", description: "Get AI-powered guidance for contract configuration, security tips, and market insights.", status: "Coming Soon", launchDate: "Q2 2025" },
  { icon: ScanSearch, title: "Smart Contract Audit Scanner", description: "Basic automated security checks for custom contract snippets or imported code (beta).", status: "Coming Soon", launchDate: "Q2 2025" },
  { icon: BadgePercent, title: "NFT Badges & Academy", description: "Earn NFT certificates for completing Web3 courses directly on the platform.", status: "Coming Soon", launchDate: "Q3 2025" },
];

const ADVANTAGES_DATA = [
    { icon: CheckCircle, text: "No Technical Skills Required" },
    { icon: Layers, text: "Multi-chain by Default" },
    { icon: ShieldAlert, text: "Secure by Design" },
    { icon: Telescope, text: "Scalable for Projects & DAOs" },
    { icon: Coffee, text: "Focus on Your Vision, We Handle the Code" },
];

const FeaturesPage: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoModalContent, setDemoModalContent] = useState({ title: "Demo Only", message: "This feature is for demonstration purposes."});

  const openDemoModal = (title?: string, message?: string) => {
    if (title) setDemoModalContent(prev => ({ ...prev, title }));
    if (message) setDemoModalContent(prev => ({ ...prev, message }));
    setIsDemoModalOpen(true);
  };
  
  const AnimatedLucideIcon = ({ icon: IconComponent, className }: {icon: any, className?: string}) => (
    <motion.div
      animate={{
        scale: [1, 1.05, 1, 1.05, 1],
        rotate: [0, 2, -2, 2, 0],
        filter: [
            "drop-shadow(0 0 5px rgba(0, 168, 255, 0.3))",
            "drop-shadow(0 0 15px rgba(0, 168, 255, 0.5))",
            "drop-shadow(0 0 5px rgba(0, 168, 255, 0.3))",
            "drop-shadow(0 0 15px rgba(0, 168, 255, 0.5))",
            "drop-shadow(0 0 5px rgba(0, 168, 255, 0.3))",
        ]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <IconComponent size={160} className="text-brand-accent-blue opacity-80" />
    </motion.div>
  );


  return (
    <div className="bg-brand-primary text-slate-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-brand-primary to-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center text-center lg:text-left">
          <motion.div 
            className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Everything You Need to <span className="text-brand-accent-blue">Launch on Web3</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 mb-10">
              Explore the full suite of tools offered by BlockDeploy for no-code smart contract deployment, management, and growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                variant="primary"
                size="lg"
                glowEffect="blue"
                onClick={() => window.location.hash = '/dashboard/templates'}
                iconRight={<ArrowRight size={20} />}
              >
                Launch App
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => openDemoModal("Watch Demo", "The demo video is currently in production. Check back soon!")}
                iconLeft={<Video size={20} />}
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
          <motion.div 
            className="lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            {/* Placeholder for 3D icon or SVG animation */}
            <AnimatedLucideIcon icon={Layers} className="w-64 h-64 md:w-80 md:h-80" />
          </motion.div>
        </div>
      </section>

      {/* Section 1 – Core Features */}
      <section className="py-16 md:py-24 bg-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Core Platform Capabilities
          </motion.h2>
          <motion.p 
            className="text-slate-400 text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            BlockDeploy offers a comprehensive suite of features designed to simplify your Web3 journey from idea to launch and beyond.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_FEATURES_DATA.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 – Coming Soon & Roadmap */}
      <section className="py-16 md:py-24 bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            What's Next? <span className="text-brand-accent-purple">Innovations on the Horizon</span>
          </motion.h2>
          <motion.p 
            className="text-slate-400 text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We're constantly evolving. Here's a sneak peek at exciting new features planned for BlockDeploy.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROADMAP_FEATURES_DATA.map((feature, index) => (
              <RoadmapCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
                launchDate={feature.launchDate}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Section 3 – Interactive Modules Showcase */}
      <section className="py-16 md:py-24 bg-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Experience BlockDeploy <span className="text-brand-accent-blue">(Simulated)</span>
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ModulePreview 
              imageSrc="https://images.unsplash.com/photo-1620712943543-2858200e9486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" // Replace with actual mock image
              title="Intuitive dApp Builder"
              buttonLabel="Try Builder (Demo)"
              onClickModal={() => openDemoModal("dApp Builder Demo", "This simulated preview shows the dApp Builder interface. The live builder will allow drag & drop functionality to create simple UIs for your smart contracts.")}
            />
            <ModulePreview 
              imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" // Replace with actual mock image
              title="Comprehensive Dashboard"
              buttonLabel="Explore Dashboard (Demo)"
              onClickModal={() => openDemoModal("Dashboard Demo", "This mock-up represents your central hub for managing deployments, analytics, and project settings. The actual dashboard will provide real-time data and control over your Web3 assets.")}
            />
          </div>
        </div>
      </section>

      {/* Section 4 – Advantages BlockDeploy */}
      <section className="py-16 md:py-24 bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Why Choose <span className="text-brand-accent-purple">BlockDeploy</span>?
          </motion.h2>
          <ul className="max-w-2xl mx-auto space-y-6">
            {ADVANTAGES_DATA.map((advantage, index) => (
              <BenefitListItem 
                key={index}
                icon={advantage.icon}
                text={advantage.text}
                index={index}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-brand-accent-blue via-sky-500 to-brand-accent-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Build the Future of Web3?
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of creators and businesses launching their Web3 projects with BlockDeploy.
          </motion.p>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true, amount: 0.5 }}
             transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="primary"
              className="bg-white text-brand-accent-blue hover:bg-slate-200 focus:ring-slate-300 !shadow-xl hover:!shadow-2xl"
              size="lg"
              onClick={() => window.location.hash = '/register'}
              iconRight={<Zap size={20} />}
            >
              Sign Up and Start Deploying
            </Button>
          </motion.div>
        </div>
      </section>

      <DemoOnlyModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
        title={demoModalContent.title}
        message={demoModalContent.message}
      />
    </div>
  );
};

export default FeaturesPage;