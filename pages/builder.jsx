
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImagePlus, GalleryThumbnails, CircleDollarSign, Info as InfoIconLucide, PiggyBank, RefreshCcw, Wallet, Landmark, ScrollText, Vote, LayoutDashboard, Eye, UploadCloud, Settings, Columns, Brush, Type, Link2, PlusCircle, Undo2, Redo2, ZoomIn, ZoomOut, Grid, Moon, Sun, AlignJustify, HelpCircle, Palette as PaletteIconLucide, SlidersHorizontal, Move, Hand
} from 'lucide-react';
import { APP_NAME } from '../constants'; 
import Button from '../components/Button'; 
import Input from '../components/Input'

// Mock data for components
const componentCategories = {
  NFT: [
    { id: 'nft-mint', name: 'Mint NFT Button', icon: ImagePlus, description: 'Button to trigger NFT minting.', props: { label: 'Mint Now', contractAddress: '0xNFTContract...', primaryColor: '#3B82F6', functionName: 'safeMint', successMessage: 'NFT Minted!', loadingText: 'Minting...'} },
    { id: 'nft-viewer', name: 'NFT Viewer', icon: GalleryThumbnails, description: 'Displays an NFT image and metadata.', props: { defaultNFTId: '1', showOwner: true, metadataSource: 'ipfs://cid...', borderColor: '#E5E7EB', autoRefresh: false, style: 'rounded' } },
  ],
  Token: [
    { id: 'token-info', name: 'Token Info', icon: CircleDollarSign, description: 'Display token symbol, supply.', props: { tokenAddress: '0xToken...', showTotalSupply: true, tokenName: 'MyCoin', accentColor: '#A020F0', fetchDecimals: true } },
    { id: 'token-balance', name: 'User Token Balance', icon: InfoIconLucide, description: 'Shows a user\'s balance for a token.', props: { tokenAddress: '0xToken...', displayUnit: 'symbol', userAddress: 'connected_wallet', prefixText: 'Balance: ', formatThousands: true} },
  ],
  DeFi: [
    { id: 'defi-stake', name: 'Staking Interface', icon: PiggyBank, description: 'Interface for staking tokens.', props: { poolName: 'ETH Staking', expectedApy: '5.5%', acceptsToken: 'WETH', backgroundColor: '#1A1C2D', minStakeAmount: '0.1'} },
    { id: 'defi-swap', name: 'Token Swap UI', icon: RefreshCcw, description: 'Basic UI for token exchange.', props: { defaultInputToken: 'USDC', defaultOutputToken: 'ETH', slippageTolerance: '0.5%', buttonColor: '#00A8FF', feeTier: '0.3%'} },
  ],
  Wallet: [
    { id: 'wallet-connect-btn', name: 'Connect Wallet Button', icon: Wallet, description: 'Standard wallet connection button.', props: { buttonText: 'Connect Wallet', style: 'primary', buttonTextColor: '#FFFFFF', chainIdFilter: '1' } },
    { id: 'wallet-network-display', name: 'Network Display', icon: Landmark, description: 'Shows current connected network.', props: { showLogo: true, defaultNetwork: 'Ethereum', displayMode: 'full', supportedChains: ['1', '137']} },
  ],
  Governance: [
    { id: 'gov-proposal-card', name: 'Proposal Card', icon: ScrollText, description: 'Card to display a DAO proposal.', props: { title: 'New Treasury Allocation', status: 'Active', voteCount: '1200', cardStyle: 'detailed', showProgressBar: true} },
    { id: 'gov-vote-button', name: 'Vote Buttons', icon: Vote, description: 'Allows users to vote (For/Against/Abstain).', props: { proposalId: '123', options: ['For', 'Against', 'Abstain'], compactMode: false, highlightActiveVote: true, disabled: false } },
  ],
  Layout: [
    { id: 'layout-container', name: 'Container', icon: Columns, description: 'A wrapping div for layout.', props: { padding: '4', backgroundColor: '#FFFFFF', roundedCorners: 'md', maxWidth: 'container.xl', shadow: 'none' } },
    { id: 'layout-text', name: 'Text Block', icon: Type, description: 'Basic text element.', props: { content: 'Hello World', fontSize: '16px', textColor: '#000000', fontWeight: 'normal', alignment: 'left' } },
  ],
  Element: [
     { id: 'element-button', name: 'Generic Button', icon: Brush, description: 'A customizable button.', props: { text: 'Click Me', variant: 'solid', colorScheme: 'blue', size: 'md', isLoading: false } },
     { id: 'element-link', name: 'Hyperlink', icon: Link2, description: 'A clickable link.', props: { url: 'https://example.com', linkText: 'Visit Example', openInNewTab: true, linkColor: '#3182CE', underline: true } },
  ]
};

// Header component for the builder
const BuilderHeader = ({ onToggleLeftSidebar, onToggleRightSidebar, selectedComponentId, contextualStatusMessage }) => {
  const [currentTheme, setCurrentTheme] = useState('moon'); // 'moon' or 'sun'
  const [saveStatus, setSaveStatus] = useState('Sauvegardé (simulation)');

  useEffect(() => {
    if (selectedComponentId) { 
      setSaveStatus(''); 
      setTimeout(() => {
        setSaveStatus('Saving...');
        setTimeout(() => setSaveStatus('Sauvegardé (simulation)'), 700);
      }, 100);
    }
  }, [selectedComponentId]);


  const toggleTheme = () => {
    setCurrentTheme(prev => (prev === 'moon' ? 'sun' : 'moon'));
    alert("Theme switch clicked (static demo - no actual theme change)");
  };

  const headerButtonProps = {
    whileHover: { scale: 1.1, color: "#00A8FF" },
    whileTap: { scale: 0.9, rotate: 5 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  };

  return (
    <div className="p-3 border-b border-slate-700 bg-brand-secondary flex justify-between items-center sticky top-0 z-30 h-16 shrink-0">
      <div className="flex items-center">
        <motion.button {...headerButtonProps} onClick={onToggleLeftSidebar} className="p-1.5 text-slate-400 hover:text-white mr-2 lg:hidden" aria-label="Toggle Components Panel">
          <AlignJustify size={20} />
        </motion.button>
        <LayoutDashboard size={24} className="text-brand-accent-blue mr-2 hidden sm:block" />
        <h1 className="text-lg sm:text-xl font-semibold text-white">{APP_NAME} Builder</h1>
        <span className="text-sm text-slate-400 ml-2 hidden md:inline">| Projet: Alpha dApp</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={contextualStatusMessage}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5}}
          transition={{ duration: 0.2 }}
          className="text-xs text-slate-400 hidden lg:block absolute left-1/2 -translate-x-1/2"
        >
          {contextualStatusMessage}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center space-x-1 sm:space-x-1.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={saveStatus}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-slate-500 mr-2 hidden md:inline"
          >
            {saveStatus}
          </motion.span>
        </AnimatePresence>
        
        <motion.button {...headerButtonProps} variant="ghost" size="sm" className="p-1.5 sm:p-2 text-slate-400 hover:text-white" title="Undo (mock)"><Undo2 size={18}/></motion.button>
        <motion.button {...headerButtonProps} variant="ghost" size="sm" className="p-1.5 sm:p-2 text-slate-400 hover:text-white" title="Redo (mock)"><Redo2 size={18}/></motion.button>
        <motion.button {...headerButtonProps} variant="ghost" size="sm" className="p-1.5 sm:p-2 text-slate-400 hover:text-white hidden sm:inline-flex" title="Zoom In (mock)"><ZoomIn size={18}/></motion.button>
        <motion.button {...headerButtonProps} variant="ghost" size="sm" className="p-1.5 sm:p-2 text-slate-400 hover:text-white hidden sm:inline-flex" title="Zoom Out (mock)"><ZoomOut size={18}/></motion.button>
        <motion.button {...headerButtonProps} variant="ghost" size="sm" className="p-1.5 sm:p-2 text-slate-400 hover:text-white hidden sm:inline-flex" title="Toggle Grid (mock)"><Grid size={18}/></motion.button>
        
        <motion.button {...headerButtonProps} variant="ghost" size="sm" className="p-1.5 sm:p-2 text-slate-400 hover:text-white" title="Toggle Theme (mock)" onClick={toggleTheme}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentTheme} 
              initial={{ y: -10, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 10, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {currentTheme === 'moon' ? <Moon size={18}/> : <Sun size={18}/>}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <span className="h-5 w-px bg-slate-600 mx-1 hidden sm:block"></span>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" iconLeft={<Eye size={16}/>}>Preview</Button>
        <Button variant="primary" size="sm" iconLeft={<UploadCloud size={16}/>} glowEffect="blue">Save</Button>
        
        <motion.button {...headerButtonProps} onClick={onToggleRightSidebar} className="p-1.5 text-slate-400 hover:text-white ml-1 lg:hidden" aria-label="Toggle Properties Panel">
          <SlidersHorizontal size={20} />
        </motion.button>
      </div>
    </div>
  );
};

// Left Sidebar for component palette
const LeftSidebarPanel = ({ activeTab, setActiveTab, selectedComponent, setSelectedComponent, pickedComponentId, setPickedComponentId, isOpen }) => {
  const tabs = Object.keys(componentCategories);

  const handleComponentInteraction = (comp) => {
    if (pickedComponentId === comp.id) {
      setPickedComponentId(null); 
    } else {
      setPickedComponentId(comp.id);
      setSelectedComponent(comp); 
    }
  };
  
  const componentItemVariants = {
    normal: { scale: 1, rotate: 0, boxShadow: "0px 1px 3px rgba(0,0,0,0.1)", zIndex: 1 },
    hover: { y: -3, boxShadow: "0 5px 15px rgba(160, 32, 240, 0.25)", scale: 1.03 },
    picked: { scale: 1.08, rotate: 1.5, boxShadow: "0px 10px 25px rgba(0, 168, 255, 0.4)", zIndex: 10 },
    tap: { scale: 0.97 }
  };

  return (
    <motion.aside 
      className={`fixed lg:relative inset-y-0 left-0 z-20 lg:z-auto 
                 w-72 bg-brand-secondary border-r border-slate-700 flex flex-col shrink-0 
                 lg:h-full`}
      initial="closed"
      animate={isOpen || (typeof window !== "undefined" && window.innerWidth >= 1024) ? "open" : "closed"}
      variants={{
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
      }}
      style={{ height: 'calc(100vh - 4rem)' }} 
    >
      <div className="p-3 border-b border-slate-700">
        <h2 className="text-md font-semibold text-slate-200">Components</h2>
      </div>
      <div className="flex lg:flex-col border-b lg:border-b-0 lg:border-r border-slate-700 overflow-x-auto lg:overflow-x-hidden whitespace-nowrap lg:whitespace-normal">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-3 text-sm text-left min-w-max lg:w-full transition-colors duration-150
              ${activeTab === tab 
                ? 'bg-brand-accent-blue/20 text-brand-accent-blue border-b-2 lg:border-b-0 lg:border-l-2 border-brand-accent-blue font-medium' 
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-grow p-1 space-y-1.5 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-800/30 dark:bg-brand-secondary/50 p-2 rounded-md"
          >
            <h3 className="text-xs font-semibold uppercase text-brand-accent-purple mb-2 px-1 pt-1 tracking-wider">{activeTab} Components</h3>
            {(componentCategories[activeTab] || []).map(comp => {
              const Icon = comp.icon;
              const isCurrentlySelected = selectedComponent?.id === comp.id;
              const isCurrentlyPicked = pickedComponentId === comp.id;
              
              return (
                <motion.div
                  key={comp.id}
                  onClick={() => handleComponentInteraction(comp)}
                  variants={componentItemVariants}
                  initial="normal"
                  animate={isCurrentlyPicked ? "picked" : "normal"}
                  whileHover={!isCurrentlyPicked ? "hover" : "picked"}
                  whileTap={!isCurrentlyPicked ? "tap" : { scale: 1.07 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`p-2.5 rounded-lg border-2 group relative
                              ${isCurrentlySelected && !isCurrentlyPicked ? 'border-brand-accent-blue/50 bg-brand-accent-blue/10' : 'border-transparent'}
                              ${isCurrentlyPicked ? 'border-brand-accent-blue shadow-lg cursor-grabbing' : 'hover:bg-slate-700/60 dark:hover:bg-slate-600/40 hover:border-slate-600 dark:hover:border-slate-500 cursor-grab'}
                            `}
                  title={isCurrentlyPicked ? `Release ${comp.name}` : `Pick up ${comp.name}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleComponentInteraction(comp)}
                >
                  <div className="flex items-center mb-1">
                    <motion.div className="transition-colors">
                      <Icon size={18} className={`${isCurrentlyPicked || isCurrentlySelected ? 'text-brand-accent-blue' : 'text-brand-accent-purple'} mr-2 group-hover:text-brand-accent-blue transition-colors duration-150`} />
                    </motion.div>
                    <span className={`text-sm font-medium ${isCurrentlyPicked || isCurrentlySelected ? 'text-brand-accent-blue' : 'text-slate-100 group-hover:text-slate-50 transition-colors duration-150'}`}>{comp.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-snug pl-[26px] transition-colors duration-150">{comp.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

// Central canvas area
const CanvasArea = ({ pickedComponentId, setPickedComponentId, setLastActionMessage, isHoveringDropTarget, setIsHoveringDropTarget, setDroppedItemVisual }) => {
  const gridSVGDark = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 0 L 12 24 M 0 12 L 24 12" fill="none" stroke="rgba(71, 85, 105, 0.2)" stroke-width="0.5"/></svg>`;
  
  const pickedCompDetails = useMemo(() => {
    if (!pickedComponentId) return null;
    for (const category in componentCategories) {
      const found = componentCategories[category].find(c => c.id === pickedComponentId);
      if (found) return found;
    }
    return null;
  }, [pickedComponentId]);

  const basePulseAnimation = {
    scale: [1, 1.02, 1],
    boxShadow: ["0px 0px 8px rgba(0, 168, 255, 0.2)", "0px 0px 18px rgba(0, 168, 255, 0.35)", "0px 0px 8px rgba(0, 168, 255, 0.2)"],
    transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity }
  };
  
  const dropTargetHoverAnimation = {
    scale: 1.05, 
    translateY: -2,
    boxShadow: "0px 0px 25px rgba(0, 168, 255, 0.6)",
    borderColor: "rgba(0, 168, 255, 0.8)"
  };

  const dropTargetActivePulseAnimation = {
    scale: [1.05, 1.1, 1.05],
    boxShadow: ["0px 0px 15px rgba(0, 168, 255, 0.4)", "0px 0px 30px rgba(0, 168, 255, 0.7)", "0px 0px 15px rgba(0, 168, 255, 0.4)"],
    transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity }
  };
  
  const handleCanvasClick = () => {
    if (pickedCompDetails) {
      setLastActionMessage(`Component "${pickedCompDetails.name}" dropped (simulated).`);
      setDroppedItemVisual({ ...pickedCompDetails, timestamp: Date.now() }); // Trigger fake insertion
      setPickedComponentId(null); // Reset picked component
      setIsHoveringDropTarget(false);
    } else {
      setLastActionMessage("Canvas clicked - Add Component (simulation).");
    }
  };

  const dropZoneText = pickedCompDetails 
    ? (isHoveringDropTarget ? `Release to drop "${pickedCompDetails.name}"` : `Drop "${pickedCompDetails.name}" Here`)
    : "Add Component";

  const DropZoneIcon = pickedCompDetails ? (isHoveringDropTarget ? Hand : Move) : PlusCircle;

  return (
    <main 
      className="relative flex-1 p-4 md:p-6 bg-slate-200 dark:bg-slate-800 min-h-[300px] lg:min-h-0 overflow-y-auto"
      onMouseEnter={() => pickedComponentId && setIsHoveringDropTarget(true)}
      onMouseLeave={() => setIsHoveringDropTarget(false)}
    >
      <div 
        className="w-full h-full border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-lg flex items-center justify-center 
                   bg-white dark:bg-brand-primary/40 p-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(gridSVGDark)}")`,
          backgroundSize: '24px 24px',
        }}
      >
        <motion.button 
          className={`p-4 rounded-lg border flex flex-col items-center transition-all duration-200 group
            ${pickedComponentId && isHoveringDropTarget ? 'bg-brand-accent-blue/20 border-brand-accent-blue cursor-copy' : 'bg-brand-accent-blue/10 hover:bg-brand-accent-blue/20 dark:bg-brand-accent-blue/20 dark:hover:bg-brand-accent-blue/30 border-brand-accent-blue/30 dark:border-brand-accent-blue/50 cursor-pointer'}
          `}
          onClick={handleCanvasClick}
          animate={pickedComponentId && isHoveringDropTarget ? dropTargetActivePulseAnimation : basePulseAnimation}
          whileHover={pickedComponentId && isHoveringDropTarget ? dropTargetHoverAnimation : { scale: 1.03, boxShadow: "0px 0px 20px rgba(0, 168, 255, 0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={dropZoneText} 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center"
            >
              <DropZoneIcon size={pickedCompDetails ? 36 : 40} className="text-brand-accent-blue group-hover:scale-110 transition-transform" />
              <p className="mt-2 text-sm font-medium text-brand-accent-blue">{dropZoneText}</p>
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
      <p className="absolute bottom-2 right-3 text-xs text-slate-500 dark:text-slate-500 pointer-events-none">
        Static UI - Drag &amp; Drop Simulated
      </p>
    </main>
  );
};

const PropertyGroup = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="text-sm font-semibold uppercase text-slate-400 dark:text-slate-500 mb-2 tracking-wider border-b border-slate-700 pb-1">{title}</h4>
    <div className="space-y-3 p-3 bg-slate-800/40 dark:bg-brand-primary/30 rounded-md border border-slate-700/60">
        {children}
    </div>
  </div>
);

const RightSidebarPanel = ({ selectedComponent, isOpen }) => {
  
  const getPropertyTooltip = useCallback((propKey) => {
    const tooltips = {
      label: 'The visible text for the button or label.',
      contractAddress: 'The blockchain address of the smart contract.',
      primaryColor: 'Main accent color for the component.',
      functionName: 'The smart contract function to call.',
      successMessage: 'Message displayed on successful interaction.',
      loadingText: 'Message displayed during loading/pending state.',
      defaultNFTId: 'The default NFT ID to display if none is specified.',
      showOwner: 'Whether to display the owner of the NFT.',
      metadataSource: 'URL or IPFS CID for NFT metadata.',
      borderColor: 'Color of the component\'s border.',
      autoRefresh: 'Enable or disable automatic refreshing of data.',
      style: 'Visual style variant (e.g., "rounded", "pill").',
      tokenAddress: 'Address of the ERC20 token contract.',
      showTotalSupply: 'Display the total supply of the token.',
      tokenName: 'The name of the token (e.g., "MyCoin").',
      accentColor: 'Secondary accent color.',
      fetchDecimals: 'Whether to fetch token decimals from the contract.',
      displayUnit: 'Unit for displaying token balance (e.g., "symbol", "name").',
      userAddress: 'User\'s wallet address, or "connected_wallet" for dynamic.',
      prefixText: 'Text to display before the balance.',
      formatThousands: 'Use commas or other separators for large numbers.',
      poolName: 'Display name for the staking pool.',
      expectedApy: 'Estimated Annual Percentage Yield for staking.',
      acceptsToken: 'Symbol or address of the token accepted for staking.',
      backgroundColor: 'Background color of the component.',
      minStakeAmount: 'Minimum amount required for staking.',
      defaultInputToken: 'Default token for the input field in a swap UI.',
      defaultOutputToken: 'Default token for the output field in a swap UI.',
      slippageTolerance: 'Allowed slippage percentage for token swaps.',
      buttonColor: 'Color for primary action buttons.',
      feeTier: 'Fee tier for liquidity pool in swaps (e.g., "0.3%").',
      buttonText: 'Text displayed on the connect wallet button.',
      buttonTextColor: 'Color of the text on the button.',
      chainIdFilter: 'Network chain ID to filter for (e.g., "1" for Ethereum).',
      showLogo: 'Display the network logo.',
      defaultNetwork: 'Default network name to display.',
      displayMode: 'How to display network info ("full", "compact", "icon_only").',
      supportedChains: 'Array of supported chain IDs.',
      status: 'Current status of the proposal (e.g., "Active", "Passed").',
      voteCount: 'Number of votes cast on the proposal.',
      cardStyle: 'Visual style of the proposal card ("detailed", "summary").',
      showProgressBar: 'Display a progress bar for vote distribution.',
      proposalId: 'Unique identifier for the governance proposal.',
      options: 'Array of voting options (e.g., ["For", "Against"]).',
      compactMode: 'Render vote buttons in a more compact layout.',
      highlightActiveVote: 'Visually highlight the user\'s active vote.',
      disabled: 'Disable interaction with the component.',
      padding: 'Internal spacing of the container (e.g., "4" for 1rem).',
      roundedCorners: 'Radius for rounded corners (e.g., "md", "lg", "full").',
      maxWidth: 'Maximum width of the container (e.g., "container.xl").',
      shadow: 'Box shadow effect (e.g., "sm", "md", "lg", "xl", "none").',
      content: 'Text content for the element.',
      fontSize: 'Font size in pixels or other units (e.g., "16px", "lg").',
      textColor: 'Color of the text.',
      fontWeight: 'Font weight (e.g., "normal", "semibold", "bold").',
      alignment: 'Text alignment ("left", "center", "right").',
      text: 'Display text for the button or element.',
      variant: 'Style variant of the button (e.g., "solid", "outline").',
      colorScheme: 'Predefined color scheme (e.g., "blue", "purple").',
      size: 'Size of the button or element ("sm", "md", "lg").',
      isLoading: 'Display a loading state on the button.',
      url: 'URL for the hyperlink.',
      linkText: 'Visible text for the hyperlink.',
      openInNewTab: 'Whether the link should open in a new browser tab.',
      linkColor: 'Color of the hyperlink text.',
      underline: 'Whether the hyperlink text should be underlined.',
    };
    return tooltips[propKey] || "No description available for this property.";
  }, []);

  const categorizeProperties = useCallback((props) => {
    if (!props || typeof props !== 'object') return {};
    
    const groups = {
      Content: {}, Styling: {}, Configuration: {}, Behavior: {}, Other: {},
    };
    const contentKeys = ['label', 'text', 'content', 'defaultNFTId', 'tokenName', 'poolName', 'buttonText', 'title', 'linkText', 'defaultInputToken', 'defaultOutputToken', 'prefixText', 'successMessage', 'loadingText'];
    const stylingKeys = ['primaryColor', 'borderColor', 'accentColor', 'backgroundColor', 'style', 'buttonTextColor', 'textColor', 'fontSize', 'fontWeight', 'alignment', 'padding', 'roundedCorners', 'shadow', 'variant', 'colorScheme', 'size', 'buttonColor', 'cardStyle', 'linkColor', 'underline'];
    const configKeys = ['contractAddress', 'metadataSource', 'tokenAddress', 'userAddress', 'chainIdFilter', 'defaultNetwork', 'proposalId', 'options', 'url', 'expectedApy', 'acceptsToken', 'slippageTolerance', 'feeTier', 'minStakeAmount', 'supportedChains'];
    const behaviorKeys = ['functionName', 'showOwner', 'autoRefresh', 'showTotalSupply', 'fetchDecimals', 'displayUnit', 'formatThousands', 'showLogo', 'displayMode', 'showProgressBar', 'compactMode', 'highlightActiveVote', 'openInNewTab', 'isLoading', 'disabled'];

    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        if (contentKeys.includes(key)) groups.Content[key] = props[key];
        else if (stylingKeys.includes(key)) groups.Styling[key] = props[key];
        else if (configKeys.includes(key)) groups.Configuration[key] = props[key];
        else if (behaviorKeys.includes(key)) groups.Behavior[key] = props[key];
        else groups.Other[key] = props[key];
      }
    }
    for (const groupKey in groups) {
      if (Object.keys(groups[groupKey]).length === 0) delete groups[groupKey];
    }
    return groups;
  }, []);
  
  const categorizedProps = useMemo(() => selectedComponent ? categorizeProperties(selectedComponent.props || {}) : {}, [selectedComponent, categorizeProperties]);

  return (
    <motion.aside 
      className={`fixed lg:relative inset-y-0 right-0 z-20 lg:z-auto 
                 w-80 bg-brand-secondary border-l border-slate-700 flex flex-col shrink-0 
                 lg:h-full`}
      initial="closed"
      animate={isOpen || (typeof window !== "undefined" && window.innerWidth >= 1024) ? "open" : "closed"}
      variants={{
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
      }}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div className="p-3 border-b border-slate-700">
        <h2 className="text-md font-semibold text-slate-200">Properties</h2>
      </div>
      <div className="flex-grow p-3 space-y-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {!selectedComponent ? (
          <div className="text-center py-10">
            <SlidersHorizontal size={32} className="text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Select a component to edit its properties.</p>
          </div>
        ) : (
          <motion.div
            key={selectedComponent.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="flex items-center mb-4 p-2.5 bg-brand-accent-blue/10 dark:bg-brand-accent-blue/15 rounded-lg border border-brand-accent-blue/30 dark:border-brand-accent-blue/40">
              {React.createElement(selectedComponent.icon, { size: 22, className: "text-brand-accent-blue mr-2.5 shrink-0" })}
              <h3 className="text-md font-semibold text-brand-accent-blue">{selectedComponent.name}</h3>
            </div>

            {Object.entries(categorizedProps).map(([groupTitle, groupProps]) => (
              <PropertyGroup key={groupTitle} title={groupTitle}>
                {Object.entries(groupProps).map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  let inputType = 'text';
                  if (typeof value === 'boolean') inputType = 'checkbox';
                  else if (key.toLowerCase().includes('color') && typeof value === 'string' && value.startsWith('#')) inputType = 'color';

                  if (inputType === 'checkbox') {
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <label htmlFor={key} className="text-xs font-medium text-slate-300 flex items-center">
                          {label}
                          <HelpCircle size={11} className="text-slate-500 ml-1 cursor-help" title={getPropertyTooltip(key)} />
                        </label>
                        <input type="checkbox" id={key} name={key} checked={!!value} disabled className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-700 text-brand-accent-blue focus:ring-brand-accent-blue cursor-not-allowed" readOnly/>
                      </div>
                    );
                  }
                  if (inputType === 'color') {
                    return (
                         <div key={key} className="flex items-center justify-between">
                            <label htmlFor={key} className="text-xs font-medium text-slate-300 flex items-center">
                                {label}
                                <HelpCircle size={11} className="text-slate-500 ml-1 cursor-help" title={getPropertyTooltip(key)} />
                            </label>
                            <div className="flex items-center">
                                <span className="text-xs text-slate-400 mr-1.5">{String(value ?? '')}</span>
                                <input type="color" id={key} name={key} value={String(value ?? '#000000')} disabled className="h-5 w-5 rounded border border-slate-600 cursor-not-allowed p-0" readOnly/>
                            </div>
                        </div>
                    );
                  }
                  return (
                    <div key={key}>
                      <label htmlFor={key} className="block text-xs font-medium text-slate-400 mb-0.5 flex items-center">
                        {label}
                        <HelpCircle size={11} className="text-slate-500 ml-1 cursor-help" title={getPropertyTooltip(key)} />
                      </label>
                      <Input
                        id={key} name={key} type="text" value={String(value ?? '')} disabled
                        className="w-full !py-1 !text-xs cursor-not-allowed" readOnly
                      />
                    </div>
                  );
                })}
              </PropertyGroup>
            ))}
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

const GhostBox = ({ component, mousePosition }) => {
  if (!component) return null;
  const Icon = component.icon;
  return (
    <motion.div
      className="fixed bg-brand-secondary/80 backdrop-blur-sm text-white p-2.5 rounded-lg shadow-2xl flex items-center border border-brand-accent-blue/50 pointer-events-none z-50"
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ 
        opacity: 0.85, 
        scale: 0.9, 
        rotate: 1,
        x: mousePosition.x + 15, 
        y: mousePosition.y + 10 
      }}
      exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.1 }}
    >
      <Icon size={18} className="text-brand-accent-blue mr-2" />
      <span className="text-sm font-medium">{component.name}</span>
    </motion.div>
  );
};

const FakePlacedComponent = ({ componentDetails, onAnimationComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onAnimationComplete, 1200); 
        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    if (!componentDetails) return null;
    const Icon = componentDetails.icon;

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 bg-brand-accent-blue/20 p-4 rounded-lg shadow-xl border border-brand-accent-blue text-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.4, ease: "easeIn" } }}
        >
            <Icon size={32} className="text-brand-accent-blue mx-auto mb-2" />
            <p className="text-sm font-semibold text-brand-accent-blue">{componentDetails.name} Placed</p>
        </motion.div>
    );
};

const ActionHistoryLog = ({ message }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    className="fixed bottom-4 left-4 bg-slate-900/80 dark:bg-black/70 text-white text-xs px-3 py-1.5 rounded-md shadow-lg border border-slate-700 z-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const BuilderPage = () => {
  const [activeTab, setActiveTab] = useState(Object.keys(componentCategories)[0]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [pickedComponentId, setPickedComponentId] = useState(null);
  
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true 
  );
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringDropTarget, setIsHoveringDropTarget] = useState(false);
  const [droppedItemVisual, setDroppedItemVisual] = useState(null); 
  const [lastActionMessage, setLastActionMessage] = useState('');
  const [contextualStatusMessage, setContextualStatusMessage] = useState("Ready. Select a component from the left panel.");

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    if (pickedComponentId) { 
        window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pickedComponentId]);

  useEffect(() => {
    const currentTabComponents = componentCategories[activeTab] || [];
    const isSelectedComponentInCurrentTab = selectedComponent ? currentTabComponents.some(c => c.id === selectedComponent.id) : false;
    if (!selectedComponent || !isSelectedComponentInCurrentTab) {
      setSelectedComponent(currentTabComponents[0] || null);
    }
  }, [activeTab, selectedComponent]); 

  useEffect(() => {
    if (selectedComponent && pickedComponentId && selectedComponent.id !== pickedComponentId) {
        setPickedComponentId(null); 
    }
  }, [selectedComponent, pickedComponentId]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") { 
        if (window.innerWidth < 1024) {
            // No automatic changes on resize to respect user interaction
        } else {
           // No automatic changes on resize for larger screens either
        }
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial call to set states based on initial window size
    // This is removed to prevent overriding user preference on load if screen is small then resized
    // handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const pickedCompDetails = pickedComponentId ? 
      Object.values(componentCategories).flat().find(c => c.id === pickedComponentId) : null;

    if (pickedCompDetails) {
      if (isHoveringDropTarget) {
        setContextualStatusMessage(`Release to drop "${pickedCompDetails.name}" on the canvas.`);
      } else {
        setContextualStatusMessage(`Dragging "${pickedCompDetails.name}"... Click canvas to drop or component again to cancel.`);
      }
    } else {
      setContextualStatusMessage("Ready. Select a component from the left panel.");
    }
  }, [pickedComponentId, isHoveringDropTarget]);
  
  useEffect(() => {
    if (lastActionMessage) {
      const timer = setTimeout(() => setLastActionMessage(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [lastActionMessage]);

  const pickedComponentDetailsForGhost = useMemo(() => {
    if (!pickedComponentId) return null;
    return Object.values(componentCategories).flat().find(c => c.id === pickedComponentId);
  }, [pickedComponentId]);

  return (
    <div className="flex flex-col h-screen bg-brand-primary text-slate-200 overflow-hidden"> 
      <BuilderHeader 
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(prev => !prev)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(prev => !prev)}
        selectedComponentId={selectedComponent?.id}
        contextualStatusMessage={contextualStatusMessage}
      />
      <div className="flex flex-1 min-h-0 relative"> 
        <LeftSidebarPanel 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          pickedComponentId={pickedComponentId}
          setPickedComponentId={setPickedComponentId}
          isOpen={isLeftSidebarOpen}
        />
        <div className="flex-1 flex flex-col min-w-0 relative"> 
            <CanvasArea 
            pickedComponentId={pickedComponentId} 
            setPickedComponentId={setPickedComponentId}
            setLastActionMessage={setLastActionMessage}
            isHoveringDropTarget={isHoveringDropTarget}
            setIsHoveringDropTarget={setIsHoveringDropTarget}
            setDroppedItemVisual={setDroppedItemVisual}
            />
            <AnimatePresence>
                {droppedItemVisual && (
                    <FakePlacedComponent
                        key={droppedItemVisual.timestamp} 
                        componentDetails={droppedItemVisual}
                        onAnimationComplete={() => setDroppedItemVisual(null)}
                    />
                )}
            </AnimatePresence>
        </div>
        <RightSidebarPanel 
            selectedComponent={selectedComponent} 
            isOpen={isRightSidebarOpen}
        />
        
        <AnimatePresence>
          {pickedComponentId && pickedComponentDetailsForGhost && (
            <GhostBox component={pickedComponentDetailsForGhost} mousePosition={mousePosition} />
          )}
        </AnimatePresence>
        
        <ActionHistoryLog message={lastActionMessage} />

      </div>
    </div>
  );
};

export default BuilderPage;
