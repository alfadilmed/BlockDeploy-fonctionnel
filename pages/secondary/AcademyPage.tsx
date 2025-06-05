
import React from 'react';
import { BookOpen, Youtube, Award, Search } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';

const MOCK_COURSES = [
  { id: '1', title: 'Introduction to Smart Contracts', category: 'Beginner', duration: '2 hours', icon: BookOpen, type: 'Course' },
  { id: '2', title: 'Deploying Your First ERC-20 Token with BlockDeploy', category: 'Tutorial', duration: '45 mins', icon: Youtube, type: 'Video' },
  { id: '3', title: 'Understanding NFTs and ERC-721 Standards', category: 'Intermediate', duration: '3 hours', icon: BookOpen, type: 'Course' },
  { id: '4', title: 'Building a DAO: Step-by-Step Guide', category: 'Advanced', duration: '1.5 hours', icon: Youtube, type: 'Video' },
  { id: '5', title: 'Web3 Security Best Practices', category: 'Expert', duration: 'N/A', icon: Award, type: 'Article Series' },
];

const AcademyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  // Filter logic would go here

  return (
    <div className="py-12 md:py-16 bg-brand-primary text-slate-200">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <BookOpen size={48} className="mx-auto text-brand-accent-purple mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            BlockDeploy Academy
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Learn Web3 development, master smart contract deployment, and earn NFT certificates.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Input
            type="search"
            placeholder="Search courses, tutorials, articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeft={<Search size={20} className="text-slate-500" />}
            className="bg-slate-800 border-slate-700 focus:bg-slate-800"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.map(course => (
            <Card key={course.id} className="bg-brand-secondary border-slate-700 hover:border-brand-accent-purple/50 transition-colors flex flex-col">
              <div className="flex items-center mb-3">
                <course.icon size={24} className="text-brand-accent-purple mr-3" />
                <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">{course.type}</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 flex-grow">{course.title}</h2>
              <div className="text-sm text-slate-400 flex justify-between items-center mt-auto pt-3 border-t border-slate-700/50">
                <span>{course.category}</span>
                <span>{course.duration}</span>
              </div>
              {/* Add a button to "Start Learning" or "View Details" */}
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
            <p className="text-slate-400">More courses and content coming soon. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};

export default AcademyPage;
