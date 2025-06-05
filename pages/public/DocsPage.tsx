import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } // Assuming for potential future routing
from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Menu, X, ChevronRight, FileText } from 'lucide-react';
import Input from '../../components/Input';
import DocsSidebar from '../../components/docs/DocsSidebar';
import DocsArticleContent from '../../components/docs/DocsArticleContent';
import Button from '../../components/Button'; // Used by DocsArticleContent

// Enhanced Mock Documentation Structure
interface ArticleData {
  title: string;
  slug: string;
  difficulty?: string;
  readTime?: string;
  content?: string;
  isRead?: boolean;
  keywords?: string[]; // For better search
}

interface SectionData {
  title: string;
  slug: string;
  articles: ArticleData[];
  isOpen?: boolean;
}

const INITIAL_DOC_SECTIONS: SectionData[] = [
  {
    title: "Getting Started",
    slug: "getting-started",
    isOpen: true,
    articles: [
      { title: "Introduction to BlockDeploy", slug: "introduction", difficulty: "Beginner", readTime: "5 min", content: "BlockDeploy is a platform that simplifies Web3 development...", isRead: false, keywords: ["welcome", "overview", "basics"] },
      { title: "Creating Your Account", slug: "creating-account", difficulty: "Beginner", readTime: "3 min", content: "Learn how to sign up and set up your BlockDeploy account...", isRead: false, keywords: ["signup", "register", "login"] },
      { title: "Dashboard Overview", slug: "dashboard-overview", difficulty: "Beginner", readTime: "7 min", content: "A quick tour of the BlockDeploy dashboard features and layout...", isRead: false, keywords: ["ui", "navigation", "layout"] },
    ]
  },
  {
    title: "Deploying Contracts",
    slug: "deploying-contracts",
    isOpen: false,
    articles: [
      { title: "Choosing a Template", slug: "choosing-template", difficulty: "Intermediate", readTime: "5 min", content: "Explore the available smart contract templates and choose the right one...", isRead: false, keywords: ["erc20", "nft", "dao", "select"] },
      { title: "Configuring ERC-20 Tokens", slug: "config-erc20", difficulty: "Intermediate", readTime: "10 min", content: "Step-by-step guide to configure and deploy your ERC-20 token...", isRead: false, keywords: ["fungible", "token", "settings"] },
      { title: "Configuring NFTs (ERC-721)", slug: "config-nft", difficulty: "Intermediate", readTime: "12 min", content: "All you need to know about setting up your NFT collection...", isRead: false, keywords: ["non-fungible", "collectible", "art"] },
      { title: "Selecting a Network", slug: "selecting-network", difficulty: "Beginner", readTime: "4 min", content: "Understand the supported networks and how to choose one for deployment...", isRead: false, keywords: ["ethereum", "polygon", "bsc", "mainnet", "testnet"] },
      { title: "Review and Deploy", slug: "review-deploy", difficulty: "Beginner", readTime: "3 min", content: "Final checks before deploying your smart contract to the blockchain...", isRead: false, keywords: ["confirm", "launch", "gas fees"] },
    ]
  },
  {
    title: "Advanced Topics",
    slug: "advanced-topics",
    isOpen: false,
    articles: [
        { title: "Gas Optimization Tips", slug: "gas-optimization", difficulty: "Advanced", readTime: "15 min", content: "Techniques for reducing gas costs in your smart contracts...", isRead: false, keywords: ["fees", "efficiency", "solidity"] },
        { title: "Security Best Practices", slug: "security-practices", difficulty: "Advanced", readTime: "20 min", content: "Essential security considerations for your dApps and contracts...", isRead: false, keywords: ["audit", "vulnerabilities", "safe"] },
    ]
  }
];


const DocsPage: React.FC = () => {
  const [docSections, setDocSections] = useState<SectionData[]>(INITIAL_DOC_SECTIONS);
  const [selectedSectionSlug, setSelectedSectionSlug] = useState<string | null>(INITIAL_DOC_SECTIONS[0].slug);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(INITIAL_DOC_SECTIONS[0].articles[0].slug);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<ArticleData[]>([]);

  const selectedArticle = useMemo(() => {
    if (!selectedSectionSlug || !selectedArticleSlug) return null;
    const section = docSections.find(s => s.slug === selectedSectionSlug);
    return section?.articles.find(a => a.slug === selectedArticleSlug) || null;
  }, [selectedSectionSlug, selectedArticleSlug, docSections]);

  const selectedSectionInfo = useMemo(() => {
    if (!selectedSectionSlug) return null;
    const section = docSections.find(s => s.slug === selectedSectionSlug);
    return section ? { title: section.title, slug: section.slug } : null;
  }, [selectedSectionSlug, docSections]);


  const handleSelectArticle = (sectionSlug: string, articleSlug: string) => {
    setSelectedSectionSlug(sectionSlug);
    setSelectedArticleSlug(articleSlug);
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false); // Close mobile sidebar on selection
     // Auto-open the section if an article within it is selected
    setDocSections(prevSections => prevSections.map(s => 
      s.slug === sectionSlug ? { ...s, isOpen: true } : s
    ));
  };

  const toggleSectionOpen = (sectionSlug: string) => {
    setDocSections(prevSections =>
      prevSections.map(s =>
        s.slug === sectionSlug ? { ...s, isOpen: !s.isOpen } : s
      )
    );
  };
  
  const handleToggleReadStatus = () => {
    if (selectedSectionSlug && selectedArticleSlug) {
      setDocSections(prevSections => 
        prevSections.map(section => 
          section.slug === selectedSectionSlug ? {
            ...section,
            articles: section.articles.map(article => 
              article.slug === selectedArticleSlug ? { ...article, isRead: !article.isRead } : article
            )
          } : section
        )
      );
    }
  };

  const getArticleNavigation = () => {
    if (!selectedSectionSlug || !selectedArticleSlug) return { prev: null, next: null };
    const currentSection = docSections.find(s => s.slug === selectedSectionSlug);
    if (!currentSection) return { prev: null, next: null };
    
    const currentIndex = currentSection.articles.findIndex(a => a.slug === selectedArticleSlug);
    if (currentIndex === -1) return { prev: null, next: null };

    const prevArticle = currentIndex > 0 ? currentSection.articles[currentIndex - 1] : null;
    const nextArticle = currentIndex < currentSection.articles.length - 1 ? currentSection.articles[currentIndex + 1] : null;
    
    return { prev: prevArticle, next: nextArticle };
  };

  const { prev: prevArticle, next: nextArticleInfo } = getArticleNavigation();

  const navigateToPrev = () => {
    if (prevArticle && selectedSectionSlug) {
      handleSelectArticle(selectedSectionSlug, prevArticle.slug);
    }
  };
  const navigateToNext = () => {
    if (nextArticleInfo && selectedSectionSlug) {
      handleSelectArticle(selectedSectionSlug, nextArticleInfo.slug);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results: ArticleData[] = [];
      docSections.forEach(section => {
        section.articles.forEach(article => {
          if (
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
          ) {
            // Add section info to display in autocomplete results
            results.push({ ...article, content: section.title }); // Using content field to store section title for display
          }
        });
      });
      setAutocompleteResults(results.slice(0, 5)); // Limit to 5 results
    } else {
      setAutocompleteResults([]);
    }
  }, [searchTerm, docSections]);
  
  // Filter sections for sidebar based on search term
  const filteredSectionsForSidebar = useMemo(() => {
    if (!searchTerm.trim()) return docSections;

    return docSections.map(section => ({
      ...section,
      articles: section.articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.keywords && article.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())))
      ),
      // Keep section open if it has matching articles or if its title matches
      isOpen: section.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              section.articles.some(article => 
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.keywords && article.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())))
              ) || section.isOpen // Keep user-opened state if search is cleared
    })).filter(section => section.articles.length > 0 || section.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, docSections]);


  return (
    <div className="bg-brand-primary text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Docs Header */}
        <motion.div 
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen size={40} className="mx-auto text-brand-accent-blue mb-3" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            BlockDeploy Documentation
          </h1>
          <p className="text-md text-slate-400 max-w-lg mx-auto">
            Your comprehensive guide to mastering BlockDeploy.
          </p>
        </motion.div>

        {/* Search Bar & Mobile Sidebar Toggle */}
        <motion.div 
          className="mb-6 md:mb-8 sticky top-[calc(5rem+1px)] md:top-[calc(5rem+1px)] z-30 py-3 bg-brand-primary/90 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Button
                variant="outline"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="!p-2.5"
                aria-label={isMobileSidebarOpen ? "Close menu" : "Open menu"}
              >
                {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search documentation (e.g., ERC20, Gas Fees)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconLeft={<Search size={18} className="text-slate-500" />}
                className="bg-slate-800 border-slate-700 focus:border-brand-accent-blue !py-2.5"
              />
              <AnimatePresence>
                {autocompleteResults.length > 0 && searchTerm.length > 1 && (
                  <motion.ul 
                    className="absolute top-full left-0 right-0 mt-1 bg-brand-secondary border border-slate-700 rounded-md shadow-xl z-40 overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {autocompleteResults.map(article => (
                      <li key={`${article.slug}-${article.content}`} className="text-sm">
                        <button 
                          onClick={() => {
                            const section = docSections.find(s => s.title === article.content); // Assuming content stores section title here
                            if (section) handleSelectArticle(section.slug, article.slug);
                            setSearchTerm(''); // Clear search after selection
                            setAutocompleteResults([]);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700/50 transition-colors"
                        >
                          {article.title} <span className="text-xs text-slate-500">in {article.content}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content: Sidebar + Article */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:w-1/4 lg:w-1/5 sticky top-[calc(5rem+1px+3.5rem+1.5rem)] self-start"> {/* Adjust top based on header + search bar height */}
             <DocsSidebar 
                sections={filteredSectionsForSidebar} 
                activeArticleSlug={selectedArticleSlug} 
                onSelectArticle={handleSelectArticle}
                toggleSectionOpen={toggleSectionOpen}
                searchTerm={searchTerm}
              />
          </div>

          {/* Mobile Sidebar (Off-canvas) */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 z-40 flex md:hidden"
                style={{ top: '5rem' /* Height of the public header */ }}
              >
                <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)}></div>
                <div className="relative w-4/5 max-w-xs h-full">
                   <DocsSidebar 
                      sections={filteredSectionsForSidebar} 
                      activeArticleSlug={selectedArticleSlug} 
                      onSelectArticle={handleSelectArticle}
                      toggleSectionOpen={toggleSectionOpen}
                      searchTerm={searchTerm}
                      className="h-full !max-h-none" // Override max-height for mobile full screen
                    />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Article Content Area */}
          <main className="flex-grow md:w-3/4 lg:w-4/5 min-w-0">
            {selectedArticle && selectedSectionInfo ? (
              <DocsArticleContent 
                section={selectedSectionInfo}
                article={selectedArticle} 
                onNavigatePrev={prevArticle ? navigateToPrev : undefined}
                onNavigateNext={nextArticleInfo ? navigateToNext : undefined}
                onToggleReadStatus={handleToggleReadStatus}
              />
            ) : (
                 <div 
                    className="p-6 md:p-8 text-center text-slate-500 bg-brand-primary/50 rounded-lg shadow-lg min-h-[300px] flex flex-col justify-center items-center"
                >
                    <FileText size={48} className="mx-auto mb-4" />
                    <p className="text-lg text-slate-300">Welcome to the BlockDeploy Docs!</p>
                    <p className="text-sm">
                        {searchTerm ? "No articles match your search. Try different keywords." : "Select an article from the menu or use search to find what you need."}
                    </p>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
