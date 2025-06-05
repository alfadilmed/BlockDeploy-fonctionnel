import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input'; // For CTA email input
import { 
  ArrowRight, CheckCircle, Layers, ShieldCheck, Wallet, Package as PackageIcon, Settings2, Zap,
  Globe, Code, Clock, AppWindow, Users, Quote, BrainCircuit, ShieldAlert, BookOpen, Smartphone, Landmark,
  GitCommit, ChevronsRight, Mail as MailIcon, Github, Twitter, Linkedin, Users as UsersIcon, Coins
} from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

// 1. HERO SECTION
const HeroSection: React.FC = () => (
  <motion.section 
    className="relative py-24 md:py-40 bg-gradient-to-br from-brand-primary via-slate-900 to-brand-secondary overflow-hidden"
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="heroGridHome" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 168, 255, 0.2)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#heroGridHome)" /></svg>
    </div>
    <div className="w-full px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      >
        Deploy <span className="text-brand-accent-blue">Smart Contracts</span>
        <br />
        Without Writing Code.
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
      >
        BlockDeploy empowers you to launch ERC-20 tokens, NFTs, DAOs, and more on major blockchains with an intuitive, no-code interface.
      </motion.p>
      <motion.div 
        className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          variant="primary"
          size="lg"
          glowEffect="blue"
          onClick={() => window.location.hash = '/dashboard/templates'}
          iconRight={<ArrowRight size={20} />}
          className="hover:scale-105"
        >
          Get Started Free
        </Button>
        <Button
          variant="ghost" 
          size="lg"
          onClick={() => window.location.hash = '/features'}
          className="text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-105"
        >
          Learn More
        </Button>
      </motion.div>
    </div>
  </motion.section>
);

// 2. WHY CHOOSE BLOCKDEPLOY
const WhyChooseSection: React.FC = () => {
  const features = [
    { title: 'No-Code Simplicity', description: 'Deploy complex smart contracts with a few clicks. No programming knowledge required.', icon: CheckCircle },
    { title: 'Pre-Audited Templates', description: 'Choose from a library of secure and optimized smart contract templates.', icon: ShieldCheck },
    { title: 'Multi-Chain Support', description: 'Launch on Ethereum, Polygon, BNB Chain, and more networks seamlessly.', icon: Layers },
  ];
  return (
    <motion.section 
      className="py-16 md:py-24 bg-brand-secondary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Why Choose BlockDeploy?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={feature.title} custom={index} variants={itemVariants}>
              <Card className="text-center bg-brand-primary border-slate-700/50 hover:shadow-neon-blue/20 hover:border-brand-accent-blue/50">
                <div className="flex justify-center mb-4 text-brand-accent-blue">{React.createElement(feature.icon, { size: 32 })}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// 3. HOW IT WORKS
const HowItWorksSection: React.FC = () => {
  const steps = [
    { number: "1️⃣", title: 'Connect Wallet', description: 'Securely connect your preferred Web3 wallet.', icon: Wallet },
    { number: "2️⃣", title: 'Choose Template', description: 'Select from our library of audited contracts.', icon: PackageIcon },
    { number: "3️⃣", title: 'Customize & Deploy', description: 'Set parameters and launch your contract with ease.', icon: Settings2 },
  ];
  return (
    <motion.section 
      className="py-16 md:py-24 bg-brand-primary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">How It Works in 3 Simple Steps</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div key={step.title} custom={index} variants={itemVariants}>
              <Card className="text-center bg-brand-secondary border-slate-700/50 hover:scale-105 transition-transform">
                <div className="text-3xl mb-4">{step.number}</div>
                <div className="flex justify-center mb-3 text-brand-accent-purple">{React.createElement(step.icon, {size: 28})}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// 4. POPULAR SMART CONTRACT TEMPLATES
const PopularTemplatesSection: React.FC = () => {
  const templates = [
    { name: 'ERC-20 Token', description: 'Launch your own fungible token for utility or governance.', icon: Coins, id: 'erc20' },
    { name: 'NFT Collection (ERC-721)', description: 'Create unique digital collectibles or art (standard ERC-721).', icon: Layers, id: 'nft' },
    { name: 'DAO Contract', description: 'Establish a decentralized autonomous organization.', icon: UsersIcon, id: 'dao' },
  ];
  return (
    <motion.section 
      className="py-16 md:py-24 bg-brand-secondary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Popular Smart Contract Templates</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div key={template.name} custom={index} variants={itemVariants}>
              <Card hoverEffect={true} className="flex flex-col items-center text-center bg-brand-primary border-slate-700/50">
                {React.createElement(template.icon, { size: 48, className: "mb-4 text-brand-accent-purple" })}
                <h3 className="text-2xl font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-slate-400 text-sm mb-4 flex-grow">{template.description}</p>
                <Button variant="secondary" size="sm" onClick={() => window.location.hash = `/wizard/template?type=${template.id}`} className="hover:scale-105">
                  Deploy {template.name}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={() => window.location.hash = '/dashboard/templates'} iconRight={<ArrowRight size={18}/>} className="hover:scale-105">
            Explore All Templates
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

// 5. PLATFORM STATS
const PlatformStatsSection: React.FC = () => {
  const stats = [
    { value: '1200+', label: 'Contracts Deployed', icon: Layers },
    { value: '35+', label: 'Countries Reached', icon: Globe },
    { value: '100%', label: 'Open Source Tools', icon: Code },
    { value: '2 min', label: 'Avg. Deploy Time', icon: Clock },
  ];
  return (
    <motion.section 
      className="py-16 md:py-24 bg-brand-primary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} custom={index} variants={itemVariants}>
              <div className="mb-2 text-brand-accent-blue">{React.createElement(stat.icon, {size: 36})}</div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// 6. DRAG & DROP BUILDER PREVIEW
const BuilderPreviewSection: React.FC = () => (
  <motion.section 
    className="py-16 md:py-24 bg-brand-secondary"
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Intuitive Drag & Drop Builder</h2>
      <p className="text-slate-400 max-w-xl mx-auto mb-8">Visually construct dApp frontends for your smart contracts. (Coming Soon)</p>
      <motion.div 
        className="max-w-3xl mx-auto bg-brand-primary p-4 rounded-2xl shadow-2xl border border-slate-700"
        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        <img src="https://via.placeholder.com/800x450/0D0F1E/1A1C2D?text=Builder+UI+Mockup" alt="Drag & Drop Builder Preview" className="rounded-lg w-full" />
      </motion.div>
      <Button variant="primary" size="lg" onClick={() => alert('Builder coming soon!')} className="mt-10 hover:scale-105" glowEffect="blue">
        Try the Builder (Preview)
      </Button>
    </div>
  </motion.section>
);

// 7. TESTIMONIALS CAROUSEL
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    { name: 'Alice CryptoDev', role: 'Founder, DeFi Startup', quote: 'BlockDeploy cut our deployment time by 90%! A game-changer for rapid prototyping.', avatar: 'https://picsum.photos/seed/alice/100/100' },
    { name: 'Bob NFTArtist', role: 'Digital Artist', quote: 'Launching my NFT collection was incredibly easy with BlockDeploy. Highly recommended!', avatar: 'https://picsum.photos/seed/bob/100/100' },
    { name: 'Carol DAOLead', role: 'Community Manager, EcoDAO', quote: 'Setting up our DAO governance was straightforward. The templates are fantastic.', avatar: 'https://picsum.photos/seed/carol/100/100' },
  ];
  return (
    <motion.section 
      className="py-16 md:py-24 bg-brand-primary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Loved by Innovators</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.name} custom={index} variants={itemVariants}>
              <Card className="bg-brand-secondary border-slate-700/50 p-6 h-full flex flex-col">
                <Quote size={32} className="text-brand-accent-purple mb-4 opacity-50" />
                <p className="text-slate-300 italic mb-4 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center mt-auto">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-3 border-2 border-brand-accent-blue" />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// 8. ADVANCED FEATURES
const AdvancedFeaturesSection: React.FC = () => {
  const features = [
    { name: 'Web3 AI Assistant', icon: BrainCircuit, color: 'text-sky-400', bgColor: 'bg-sky-500/10' },
    { name: 'Integrated Auditing', icon: ShieldAlert, color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { name: 'BlockDeploy Academy', icon: BookOpen, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { name: 'Mobile App Access', icon: Smartphone, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
    { name: 'Full DAO Builder Suite', icon: Landmark, color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
  ];
  return (
    <motion.section 
      className="py-16 md:py-24 bg-brand-secondary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Unlock Advanced Capabilities</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {features.map((feature, index) => (
            <motion.div key={feature.name} custom={index} variants={itemVariants}>
              <div className={`flex items-center p-3 rounded-lg border border-slate-700 ${feature.bgColor} hover:shadow-lg transition-shadow`}>
                {React.createElement(feature.icon, {size: 20, className: `mr-2 ${feature.color}`})}
                <span className={`text-sm font-medium ${feature.color}`}>{feature.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// 9. ROADMAP PREVIEW
const RoadmapPreviewSection: React.FC = () => {
  const roadmapSteps = [
    { name: 'MVP Testnet Launch', date: 'Q1 2025', icon: Layers },
    { name: 'NFT Minting Engine', date: 'Q2 2025', icon: Settings2 },
    { name: 'Drag & Drop Builder', date: 'Q3 2025', icon: AppWindow },
    { name: 'DAO Suite & Mobile App', date: 'Q4 2025', icon: UsersIcon },
  ];
  return (
    <motion.section 
      className="py-16 md:py-24 bg-brand-primary"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Our Journey Ahead: Roadmap Preview</h2>
        <div className="relative">
          {/* Horizontal line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 transform -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {roadmapSteps.map((step, index) => (
              <motion.div 
                key={step.name} 
                custom={index} 
                variants={itemVariants}
                className="relative p-6 bg-brand-secondary rounded-2xl border border-slate-700 shadow-lg text-center md:text-left"
              >
                <div className="md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:transform hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent-blue ring-4 ring-brand-secondary"></div>
                {React.createElement(step.icon, {size: 28, className: "text-brand-accent-blue mb-3 mx-auto md:mx-0"})}
                <p className="text-xs font-semibold text-brand-accent-blue mb-1">{step.date}</p>
                <h4 className="text-md font-semibold text-white mb-1">{step.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <Link to="/tokenomics#roadmap" className="text-brand-accent-purple hover:underline text-sm">
            View Full Roadmap <ChevronsRight size={16} className="inline-block"/>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

// 10. FINAL CTA
const FinalCTASection: React.FC = () => (
  <motion.section 
    className="py-20 md:py-28 bg-gradient-to-r from-brand-accent-blue to-brand-accent-purple"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7 }}
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build the Future of Web3?</h2>
      <p className="text-lg text-slate-100/90 mb-8 max-w-xl mx-auto">
        Join our newsletter for the latest updates, feature releases, and Web3 insights from BlockDeploy.
      </p>
      <form onSubmit={(e) => e.preventDefault()} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email address"
          className="flex-grow !bg-white/10 !border-white/20 placeholder-slate-300/70 text-white focus:!ring-white"
          iconLeft={<MailIcon size={18} className="text-slate-300/70" />}
        />
        <Button 
          type="submit" 
          variant="primary" 
          className="!bg-white !text-brand-accent-blue hover:!bg-slate-200 focus:!ring-slate-300 shadow-lg hover:scale-105"
          size="md"
        >
          Subscribe
        </Button>
      </form>
    </div>
  </motion.section>
);

// 11. FOOTER (Simplified for HomePage context, distinct from PublicLayout's Footer)
const PageFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const APP_NAME = "BlockDeploy"; 

  return (
    <footer className="bg-brand-primary border-t border-slate-700 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">{APP_NAME}</h3>
            <p className="text-sm">Simplifying Web3 smart contract deployment for everyone.</p>
            <div className="flex mt-4 space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent-blue transition-colors"><Github size={20} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent-blue transition-colors"><Twitter size={20} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent-blue transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="hover:text-brand-accent-blue">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-accent-blue">Pricing</Link></li>
              <li><Link to="/docs" className="hover:text-brand-accent-blue">Docs</Link></li>
              <li><Link to="/tokenomics" className="hover:text-brand-accent-blue">Tokenomics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-brand-accent-blue">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent-blue">Contact</Link></li>
              <li><Link to="/support" className="hover:text-brand-accent-blue">Support</Link></li>
              <li><Link to="/academy" className="hover:text-brand-accent-blue">Academy</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="text-slate-200 font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-brand-accent-blue">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-accent-blue">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm border-t border-slate-700 pt-8">
          &copy; {currentYear} {APP_NAME}. All rights reserved. Built with futuristic tech.
        </div>
      </div>
    </footer>
  );
};


const HomePage: React.FC = () => {
  return (
    <div className="bg-brand-primary text-slate-200">
      <HeroSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <PopularTemplatesSection />
      <PlatformStatsSection />
      <BuilderPreviewSection />
      <TestimonialsSection />
      <AdvancedFeaturesSection />
      <RoadmapPreviewSection />
      <FinalCTASection />
      <PageFooter /> {/* Using the page-specific footer */}
    </div>
  );
};

export default HomePage;