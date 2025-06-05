import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Tag, Clock, FileText, Edit2, CheckSquare, Square } from 'lucide-react';
import Button from '../Button';
import CodeSnippet from './CodeSnippet'; // Assuming CodeSnippet component exists

interface Article {
  title: string;
  slug: string;
  difficulty?: string;
  readTime?: string;
  content?: string; // HTML string or Markdown to be rendered
  isRead?: boolean;
}

interface SectionInfo {
  title: string;
  slug: string;
}

interface DocsArticleContentProps {
  section: SectionInfo;
  article: Article | null;
  onNavigatePrev?: () => void; // Optional: if it's the first article, this might be undefined
  onNavigateNext?: () => void; // Optional: if it's the last article
  onToggleReadStatus?: () => void;
}

const DocsArticleContent: React.FC<DocsArticleContentProps> = ({ 
    section, 
    article, 
    onNavigatePrev, 
    onNavigateNext,
    onToggleReadStatus
}) => {
  if (!article) {
    return (
      <motion.div 
        className="p-6 md:p-8 text-center text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FileText size={48} className="mx-auto mb-4" />
        <p className="text-lg">Select an article from the sidebar to get started.</p>
        <p className="text-sm">Or, use the search bar to find specific documentation.</p>
      </motion.div>
    );
  }

  // Mock code for demo
  const exampleCode = `
import { GoogleGenAI } from "@google/genai";

// Get API Key from environment variable
const API_KEY = process.env.API_KEY;

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function run() {
  // For text-only input, use the gemini-pro model
  const model = 'gemini-2.5-flash-preview-04-17';
  const prompt = "Write a story about a magic backpack.";

  const result = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: prompt }] }],
  });
  console.log(result.text);
}

run();
  `;

  return (
    <motion.article 
      key={article.slug} // Ensures re-animation on article change
      className="p-5 md:p-8 lg:p-10 bg-brand-primary/50 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Breadcrumbs */}
      <nav className="mb-4 text-xs text-slate-400 flex items-center flex-wrap">
        <a href="#/docs" className="hover:text-brand-accent-blue">Docs</a>
        <ChevronRight size={14} className="mx-1" />
        <a href={`#/docs/${section.slug}`} className="hover:text-brand-accent-blue">{section.title}</a>
        <ChevronRight size={14} className="mx-1" />
        <span className="text-slate-200 font-medium truncate">{article.title}</span>
      </nav>

      {/* Title and Meta */}
      <header className="mb-6 border-b border-slate-700 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{article.title}</h1>
        <div className="flex flex-wrap items-center text-xs text-slate-400 gap-x-3 gap-y-1">
          {article.difficulty && (
            <span className="flex items-center px-2 py-0.5 bg-slate-700 rounded-full" title="Difficulty">
              <Tag size={12} className="mr-1 text-brand-accent-purple" /> {article.difficulty}
            </span>
          )}
          {article.readTime && (
            <span className="flex items-center px-2 py-0.5 bg-slate-700 rounded-full" title="Estimated read time">
              <Clock size={12} className="mr-1 text-brand-accent-blue" /> {article.readTime}
            </span>
          )}
           {onToggleReadStatus && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleReadStatus} 
              className="!px-1.5 !py-0.5 !text-xs"
              iconLeft={article.isRead ? <CheckSquare size={14} className="text-green-400" /> : <Square size={14} />}
            >
              {article.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </Button>
           )}
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-sm sm:prose lg:prose-lg prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
        <p>{article.content || "No content available for this article yet. Please check back later."}</p>
        
        <h3 className="text-xl font-semibold text-slate-100 pt-4">Example Usage</h3>
        <p>Here's a quick example to get you started with a basic API call using the Gemini SDK:</p>
        <CodeSnippet codeString={exampleCode} language="javascript" />
        
        <h3 className="text-xl font-semibold text-slate-100 pt-4">Further Details</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <ul>
            <li>Make sure your API key is correctly configured in your environment variables.</li>
            <li>Choose the appropriate model for your task (e.g., <code>gemini-2.5-flash-preview-04-17</code> for general text, <code>imagen-3.0-generate-002</code> for image generation).</li>
            <li>Handle potential API errors gracefully in your application.</li>
        </ul>
        <p>
          For more advanced configurations, such as streaming responses or multimodal inputs, refer to the specific sections in our documentation.
        </p>
      </div>

      {/* Navigation Buttons */}
      <footer className="mt-10 pt-6 border-t border-slate-700 flex justify-between items-center">
        {onNavigatePrev ? (
          <Button variant="outline" onClick={onNavigatePrev} iconLeft={<ChevronRight className="transform rotate-180"/>}>
            Previous
          </Button>
        ) : <div /> /* Placeholder to keep Next button on the right */}
        {onNavigateNext && (
          <Button variant="primary" onClick={onNavigateNext} iconRight={<ChevronRight />} glowEffect="blue">
            Next
          </Button>
        )}
      </footer>
    </motion.article>
  );
};

export default DocsArticleContent;
