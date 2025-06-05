import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react'; // Added CheckCircle and Circle for read status
import { Link } from 'react-router-dom'; // Though not used for actual routing here, good for structure

interface Article {
  title: string;
  slug: string;
  difficulty?: string;
  readTime?: string;
  content?: string;
  isRead?: boolean;
}

interface Section {
  title: string;
  slug: string;
  articles: Article[];
  isOpen?: boolean; // For collapsible sections in sidebar
}

interface DocsSidebarProps {
  sections: Section[];
  activeArticleSlug: string | null;
  onSelectArticle: (sectionSlug: string, articleSlug: string) => void;
  toggleSectionOpen: (sectionSlug: string) => void;
  searchTerm: string; // Used to filter/highlight
  className?: string;
}

const DocsSidebar: React.FC<DocsSidebarProps> = ({ 
  sections, 
  activeArticleSlug, 
  onSelectArticle, 
  toggleSectionOpen,
  searchTerm,
  className 
}) => {

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-yellow-500/30 text-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };


  return (
    <aside className={`bg-brand-secondary/80 backdrop-blur-sm border-r border-slate-700 p-4 md:p-5 flex flex-col space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800 ${className}`} style={{maxHeight: 'calc(100vh - 10rem)' /* Adjust based on header/footer height */}}>
      <h3 className="text-lg font-semibold text-slate-100 mb-3 px-1">Documentation Menu</h3>
      {sections.map(section => (
        <div key={section.slug} className="mb-1">
          <button
            onClick={() => toggleSectionOpen(section.slug)}
            className="w-full flex items-center justify-between px-2 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-md transition-colors duration-150"
            aria-expanded={section.isOpen}
          >
            <span>{highlightText(section.title, searchTerm)}</span>
            {section.isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {section.isOpen && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-3 mt-1 space-y-0.5 border-l border-slate-700 pl-3"
            >
              {section.articles.map(article => (
                <li key={article.slug}>
                  <motion.button
                    onClick={() => onSelectArticle(section.slug, article.slug)}
                    className={`w-full text-left px-2.5 py-2 text-xs rounded-md transition-all duration-150 flex items-center justify-between
                      ${activeArticleSlug === article.slug 
                        ? 'bg-brand-accent-blue/20 text-brand-accent-blue font-semibold shadow-inner' 
                        : 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                      }
                    `}
                    whileHover={{ x: activeArticleSlug !== article.slug ? 2 : 0 }}
                    whileTap={{ scale: 0.98 }}
                    title={article.isRead ? 'Marked as read' : 'Mark as read'} // Apply title to the button for tooltip
                  >
                    <span className="flex-grow">{highlightText(article.title, searchTerm)}</span>
                    {article.isRead ? 
                        <CheckCircle size={14} className="text-green-500 ml-2 flex-shrink-0" /> :
                        <Circle size={14} className="text-slate-600 ml-2 flex-shrink-0" />
                    }
                  </motion.button>
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      ))}
    </aside>
  );
};

export default DocsSidebar;