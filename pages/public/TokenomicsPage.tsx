import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import {
  ArrowRight, Zap, Layers, Users, Settings, ShoppingCart, BarChart2, Activity, ShieldCheck, Cpu, Code, MessageSquare, HelpCircle, Twitter, Send, CalendarDays, MapPin, ExternalLink, Briefcase, Target, TrendingUp, Coins, Puzzle,
  CheckCircle, PieChart as PieChartIcon, BarChart, GitCommit, UserCheck, Award, Newspaper, Rss, ChevronsRight, ChevronDown, Info, HardDrive, Share2, Users2, CircleDollarSign, Link2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Bar, XAxis, YAxis, CartesianGrid, Legend as RechartsLegend } from 'recharts';
import CustomTooltip from '../../components/CustomTooltip';


// Section Wrapper Component
const SectionWrapper: React.FC<{ title?: string; subtitle?: string; children: React.ReactNode; className?: string; titleClassName?: string; fullWidth?: boolean; id?: string }> = ({ title, subtitle, children, className = '', titleClassName = '', fullWidth = false, id }) => (
  <section id={id} className={`py-12 md:py-20 ${fullWidth ? '' : 'max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'} ${className}`}>
    {title && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 md:mb-14"
      >
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white ${titleClassName}`}>{title}</h2>
        {subtitle && <p className="mt-3 md:mt-4 text-base md:text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
      </motion.div>
    )}
    {children}
  </section>
);

// Hero Section
const HeroSection: React.FC = () => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative w-full py-24 md:py-40 bg-gradient-to-br from-brand-primary via-slate-900 to-brand-secondary overflow-hidden text-center"
  >
    <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="heroGridTokenomics" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0, 168, 255, 0.3)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#heroGridTokenomics)" /></svg>
    </div>
    <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
      >
        BlockDeploy Protocol <span className="text-brand-accent-blue">(BDP)</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10"
      >
        Propulsez vos dApps Web3 avec notre token natif ultra-performant.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
      >
        <Button variant="primary" size="lg" glowEffect="blue" onClick={() => {/* Scroll to sale section */ document.getElementById('token-sale')?.scrollIntoView({ behavior: 'smooth' })}}>
          Acheter BDP
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.location.hash = '/docs'}>
          Lire la documentation
        </Button>
      </motion.div>
    </div>
     {/* Mock 3D visual - simple animated SVG or placeholder */}
    <motion.div 
      className="absolute -bottom-20 -left-20 w-60 h-60 md:w-80 md:h-80 opacity-10"
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
       <Coins size="100%" className="text-brand-accent-purple" />
    </motion.div>
    <motion.div 
      className="absolute -top-20 -right-20 w-52 h-52 md:w-72 md:h-72 opacity-10"
      animate={{ rotate: -360 }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
    >
       <Puzzle size="100%" className="text-brand-accent-blue" />
    </motion.div>
  </motion.section>
);

// Platform Intro
const platformUseCases = [
  { icon: Zap, title: "Frais de plateforme", description: "Payez les services BlockDeploy avec BDP." },
  { icon: TrendingUp, title: "Staking & Rewards", description: "Gagnez des récompenses en stakant vos BDP." },
  { icon: Users, title: "Gouvernance DAO", description: "Participez aux décisions de la plateforme." },
  { icon: ShieldCheck, title: "Accès Premium", description: "Débloquez des fonctionnalités exclusives." },
  { icon: ShoppingCart, title: "Marketplace", description: "Achetez/vendez des templates et modules." },
  { icon: Award, title: "Incitation Communauté", description: "Récompenses pour contributions et audits." },
];

const PlatformIntroSection: React.FC = () => (
  <SectionWrapper title="La Plateforme BlockDeploy" subtitle="BlockDeploy est une plateforme no-code Web3 permettant à tous de créer, déployer et gérer des dApps en quelques clics. Le token BDP est au coeur de son écosystème.">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10">
      {platformUseCases.map((useCase, index) => (
        <motion.div
          key={useCase.title}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-brand-secondary p-6 rounded-xl border border-slate-700 hover:border-brand-accent-purple/50 transition-all duration-300 hover:shadow-neon-purple/20"
        >
          <useCase.icon size={32} className="text-brand-accent-purple mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">{useCase.title}</h3>
          <p className="text-sm text-slate-400">{useCase.description}</p>
        </motion.div>
      ))}
    </div>
  </SectionWrapper>
);

// Token Sale Section
const TokenSaleSection: React.FC = () => (
  <SectionWrapper id="token-sale" title="Vente de Tokens BDP" subtitle="Participez à notre vente de tokens et rejoignez l'aventure BlockDeploy dès aujourd'hui." className="bg-brand-secondary/50">
    <div className="max-w-3xl mx-auto bg-brand-glass backdrop-blur-lg border border-slate-700 rounded-2xl p-6 md:p-10 shadow-xl">
      <div className="text-center mb-8">
        <p className="text-slate-300 text-lg">La vente se termine dans :</p>
        <p className="text-4xl font-bold text-brand-accent-blue my-2">07 <span className="text-2xl">Jours</span> 12:34:56</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
        <div className="bg-slate-800 p-4 rounded-lg"><strong className="text-slate-200 block">Soft Cap:</strong> <span className="text-brand-accent-blue">500,000 USDT</span></div>
        <div className="bg-slate-800 p-4 rounded-lg"><strong className="text-slate-200 block">Hard Cap:</strong> <span className="text-brand-accent-blue">3,000,000 USDT</span></div>
        <div className="bg-slate-800 p-4 rounded-lg"><strong className="text-slate-200 block">Max Supply:</strong> <span className="text-slate-100">100,000,000 BDP</span></div>
        <div className="bg-slate-800 p-4 rounded-lg">
            <strong className="text-slate-200 block mb-1">Réseaux:</strong> 
            <div className="flex space-x-2 items-center">
                <Cpu size={16} className="text-sky-400" aria-label="Ethereum"/>
                <Share2 size={16} className="text-yellow-400" aria-label="BNB Chain"/>
                <HardDrive size={16} className="text-purple-400" aria-label="Polygon"/>
            </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg sm:col-span-2">
            <strong className="text-slate-200 block mb-1">Paiements Acceptés:</strong>
            <div className="flex space-x-2 items-center">
                <CircleDollarSign size={16} className="text-green-400" aria-label="USDT"/>
                <Coins size={16} className="text-slate-400" aria-label="ETH"/>
                <Activity size={16} className="text-yellow-400" aria-label="BNB"/>
                <BarChart size={16} className="text-purple-400" aria-label="MATIC"/>
            </div>
        </div>
      </div>
      <Button variant="primary" size="lg" className="w-full" glowEffect="blue">Participer à la Prévente</Button>
    </div>
  </SectionWrapper>
);

// Token Distribution Section
const tokenDistributionData = [
  { name: 'Écosystème & Croissance', value: 25, fill: '#00A8FF' },
  { name: 'Récompenses Staking', value: 20, fill: '#A020F0' },
  { name: 'Liquidité', value: 15, fill: '#34D399' },
  { name: 'Équipe (locked 18 mois)', value: 15, fill: '#F59E0B' },
  { name: 'Advisors', value: 10, fill: '#6366F1' },
  { name: 'Réserves', value: 10, fill: '#EC4899' },
  { name: 'Airdrop', value: 5, fill: '#10B981' },
];
const fundsAllocationData = [
  { name: 'Développement Produit', value: 40, fill: '#00A8FF' },
  { name: 'Marketing & Acquisition', value: 25, fill: '#A020F0' },
  { name: 'Infrastructure & Sécurité', value: 15, fill: '#34D399' },
  { name: 'Juridique & Compliance', value: 10, fill: '#F59E0B' },
  { name: 'Trésorerie Opérationnelle', value: 10, fill: '#6366F1' },
];
const TokenDistributionSection: React.FC = () => (
  <SectionWrapper title="Distribution des Tokens BDP" subtitle="Une répartition équilibrée pour assurer la croissance et la pérennité du protocole.">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
      <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Répartition Initiale</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={tokenDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {tokenDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <RechartsLegend wrapperStyle={{fontSize: '12px', bottom: -5}}/>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay:0.2 }}>
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Utilisation des Fonds Levés</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={fundsAllocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={2} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
              {fundsAllocationData.map((entry, index) => <Cell key={`cell-funds-${index}`} fill={entry.fill} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
             <RechartsLegend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{fontSize: '12px', right: -20}}/>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  </SectionWrapper>
);

// Roadmap Section
const roadmapSteps = [
  { quarter: "Q1 2025", title: "Lancement MVP BlockDeploy", description: "Plateforme no-code avec templates ERC-20 & NFT.", icon: Layers },
  { quarter: "Q2 2025", title: "Token BDP & Staking", description: "Lancement du token, mécanismes de staking live.", icon: Coins },
  { quarter: "Q3 2025", title: "Intégration Multi-chaînes", description: "Support Polygon, BNB Chain, Arbitrum.", icon: Cpu },
  { quarter: "Q4 2025", title: "Marketplace de Blocs", description: "Communauté partage et vend des modules.", icon: ShoppingCart },
  { quarter: "Q1 2026", title: "Mobile & IA Assistant", description: "App mobile et assistant Web3 IA.", icon: Code },
  { quarter: "Q2 2026", title: "DAO Builder & Academy", description: "Outil de création DAO, plateforme éducative.", icon: Users2 },
];

const RoadmapSection: React.FC = () => (
  <SectionWrapper title="Feuille de Route (Roadmap)" subtitle="Notre vision pour l'avenir de BlockDeploy et du token BDP." className="bg-brand-secondary/30">
    <div className="relative mt-12">
      {/* Horizontal line */}
      <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -translate-y-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {roadmapSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative p-6 bg-brand-secondary rounded-xl border border-slate-700 shadow-lg text-center md:text-left"
          >
            <div className="md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:transform hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent-blue ring-4 ring-brand-secondary"></div>
            <step.icon size={28} className="text-brand-accent-blue mb-3 mx-auto md:mx-0" />
            <p className="text-xs font-semibold text-brand-accent-blue mb-1">{step.quarter}</p>
            <h4 className="text-md font-semibold text-white mb-1">{step.title}</h4>
            <p className="text-xs text-slate-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

// Team Section
const teamMembers = [
  { name: "Reda M.", role: "CEO & Founder", avatar: "https://picsum.photos/seed/RedaM/100/100" },
  { name: "Lina B.", role: "CTO", avatar: "https://picsum.photos/seed/LinaB/100/100" },
  { name: "Ayman S.", role: "Head of Product", avatar: "https://picsum.photos/seed/AymanS/100/100" },
  { name: "Sami K.", role: "Lead Blockchain Dev", avatar: "https://picsum.photos/seed/SamiK/100/100" },
  { name: "Ines D.", role: "UX/UI Designer", avatar: "https://picsum.photos/seed/InesD/100/100" },
  { name: "Othman R.", role: "Growth & Partnerships", avatar: "https://picsum.photos/seed/OthmanR/100/100" },
];

const TeamSection: React.FC = () => (
  <SectionWrapper title="Notre Équipe" subtitle="Les esprits passionnés derrière BlockDeploy.">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
      {teamMembers.map((member, index) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="text-center p-4 bg-brand-secondary rounded-lg border border-slate-700 hover:shadow-neon-blue/20 transition-shadow"
        >
          <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-brand-accent-blue object-cover" />
          <h4 className="text-md font-semibold text-white">{member.name}</h4>
          <p className="text-xs text-brand-accent-purple">{member.role}</p>
        </motion.div>
      ))}
    </div>
  </SectionWrapper>
);

// Partners Section
const partners = [
  { name: "CoinMarketCap", icon: Briefcase }, { name: "CoinGecko", icon: Target }, { name: "Chainlink", icon: Link2 },
  { name: "The Graph", icon: GitCommit }, { name: "Moralis", icon: UserCheck }, { name: "BNB Chain", icon: Layers },
  { name: "Polygon SDK", icon: Puzzle }, { name: "Alchemy", icon: Settings }
];
const PartnersSection: React.FC = () => (
  <SectionWrapper title="Nos Partenaires Stratégiques" subtitle="Nous collaborons avec les leaders de l'industrie pour offrir la meilleure expérience Web3." className="bg-brand-secondary/30">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
      {partners.map((partner, index) => (
        <motion.div
          key={partner.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="p-4 bg-brand-secondary rounded-lg border border-slate-700 flex flex-col items-center justify-center h-28 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:border-slate-500 transition-all"
        >
          <partner.icon size={32} className="text-slate-400 mb-2" />
          <span className="text-xs text-slate-400">{partner.name}</span>
        </motion.div>
      ))}
    </div>
  </SectionWrapper>
);

// News Section
const newsItems = [
  { title: "BlockDeploy change le paysage du no-code Web3", date: "15 Juillet 2024", image: "https://picsum.photos/seed/news1/400/250", summary: "Découvrez comment notre plateforme révolutionne la création de dApps." },
  { title: "Le token BDP expliqué en 3 minutes", date: "10 Juillet 2024", image: "https://picsum.photos/seed/news2/400/250", summary: "Tout ce que vous devez savoir sur l'utilité et la valeur de BDP." },
  { title: "Partenariat stratégique avec Chainlink Labs", date: "05 Juillet 2024", image: "https://picsum.photos/seed/news3/400/250", summary: "Intégration des oracles Chainlink pour des dApps plus robustes." },
];

const NewsSection: React.FC = () => (
  <SectionWrapper title="Dernières Actualités" subtitle="Restez informé des dernières avancées de BlockDeploy et du protocole BDP.">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {newsItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-brand-secondary rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-neon-blue/25 transition-shadow"
        >
          <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
          <div className="p-5">
            <p className="text-xs text-brand-accent-blue mb-1">{item.date}</p>
            <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">{item.title}</h4>
            <p className="text-sm text-slate-400 mb-3 line-clamp-3">{item.summary}</p>
            <a href="#" className="text-sm text-brand-accent-purple hover:underline">Lire plus <ChevronsRight size={16} className="inline-block"/></a>
          </div>
        </motion.div>
      ))}
    </div>
  </SectionWrapper>
);

// FAQ Section
const FaqItem: React.FC<{ q: string; a: string; isOpen: boolean; onClick: () => void }> = ({ q, a, isOpen, onClick }) => (
  <div className="border-b border-slate-700">
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full py-4 text-left text-slate-200 hover:text-brand-accent-blue transition-colors"
      aria-expanded={isOpen}
    >
      <span className="font-medium">{q}</span>
      <ChevronDown size={20} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, marginTop: isOpen ? '0.75rem' : 0, marginBottom: isOpen ? '1rem' : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <p className="text-sm text-slate-400 pr-4 leading-relaxed">{a}</p>
    </motion.div>
  </div>
);

const faqs = [
  { q: "Qu’est-ce que le token BDP ?", a: "BDP (BlockDeploy Protocol) est le token utilitaire natif de la plateforme BlockDeploy. Il est utilisé pour les paiements, le staking, la gouvernance, et l'accès à des fonctionnalités premium." },
  { q: "Comment participer à la vente de tokens BDP ?", a: "Vous pouvez participer via notre portail de vente dédié pendant les périodes de vente annoncées. Les paiements sont acceptés en ETH, BNB, MATIC, et USDT." },
  { q: "Quels réseaux BlockDeploy supporte-t-il ?", a: "BlockDeploy supporte initialement Ethereum, puis s'étendra à BNB Smart Chain, Polygon, Arbitrum, et d'autres réseaux EVM compatibles." },
  { q: "Le token BDP sera-t-il listé sur des exchanges ?", a: "Oui, nous avons des plans pour lister BDP sur plusieurs exchanges centralisés (CEX) et décentralisés (DEX) après la vente publique. Les annonces seront faites en temps voulu." },
  { q: "Y a-t-il une période de vesting pour les tokens d'équipe ?", a: "Oui, les tokens alloués à l'équipe sont soumis à un locking de 18 mois avec un cliff de 6 mois, assurant un alignement à long terme avec le projet." },
];

const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  return (
    <SectionWrapper title="Questions Fréquemment Posées (FAQ)" subtitle="Trouvez rapidement les réponses à vos interrogations sur BlockDeploy et le token BDP." className="bg-brand-secondary/30">
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FaqItem key={index} q={faq.q} a={faq.a} isOpen={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)} />
        ))}
      </div>
    </SectionWrapper>
  );
};


// Main Tokenomics Page Component
const TokenomicsPage: React.FC = () => {
  return (
    <div className="bg-brand-primary text-slate-200">
      <HeroSection />
      <PlatformIntroSection />
      <TokenSaleSection />
      <TokenDistributionSection />
      <RoadmapSection />
      <TeamSection />
      <PartnersSection />
      <NewsSection />
      <FaqSection />
      {/* The PublicLayout already includes a Footer, so we don't need a specific one here unless it's very different.
          If contact form is needed, it would go in its own section similar to above.
          For now, social links are in the existing Footer.
      */}
    </div>
  );
};

export default TokenomicsPage;