
import React from 'react';
import { Target, Eye, Zap, Users } from 'lucide-react'; // Icons for Mission, Vision, Values

const AboutPage: React.FC = () => {
  return (
    <div className="py-16 md:py-24 bg-brand-primary text-slate-200">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            About BlockDeploy
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            We are passionate about democratizing Web3 technology, making smart contract deployment accessible, secure, and straightforward for everyone.
          </p>
        </div>

        {/* Mission and Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-brand-secondary p-8 rounded-lg shadow-xl border border-slate-700/50">
            <div className="flex items-center text-brand-accent-blue mb-4">
              <Target size={32} className="mr-3" />
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              To empower innovators, developers, and businesses to effortlessly launch and manage Web3 applications by providing a robust, no-code platform for smart contract deployment. We aim to remove technical barriers and foster widespread adoption of decentralized technologies.
            </p>
          </div>
          <div className="bg-brand-secondary p-8 rounded-lg shadow-xl border border-slate-700/50">
            <div className="flex items-center text-brand-accent-purple mb-4">
              <Eye size={32} className="mr-3" />
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              To be the leading platform for codeless Web3 development, enabling a future where anyone can build and participate in the decentralized web. We envision a world where blockchain technology is seamlessly integrated into everyday applications, driving innovation and new possibilities.
            </p>
          </div>
        </div>

        {/* Why BlockDeploy Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Why We Built BlockDeploy</h2>
          <div className="max-w-4xl mx-auto text-slate-300 leading-relaxed space-y-4">
            <p>
              The Web3 revolution is here, but creating and deploying smart contracts can be a daunting task, often requiring specialized coding skills and deep blockchain knowledge. We saw a gap between the potential of Web3 and its accessibility.
            </p>
            <p>
              BlockDeploy was born out of a desire to bridge this gap. We believe that the power of decentralized applications should be in the hands of many, not just a few. Our platform is designed to abstract away the complexities, offering intuitive tools, pre-audited templates, and a seamless user experience.
            </p>
            <p>
              Whether you're an entrepreneur launching a new token, an artist creating NFTs, or a community forming a DAO, BlockDeploy provides the foundation you need to bring your Web3 vision to life quickly and securely.
            </p>
          </div>
        </div>
        
        {/* Core Values Section (Optional) */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <Zap size={36} className="text-brand-accent-blue mb-3"/>
              <h3 className="text-xl font-semibold text-white mb-1">Innovation</h3>
              <p className="text-slate-400 text-sm">Constantly pushing boundaries to simplify Web3.</p>
            </div>
            <div className="flex flex-col items-center">
              <Users size={36} className="text-brand-accent-purple mb-3"/>
              <h3 className="text-xl font-semibold text-white mb-1">Accessibility</h3>
              <p className="text-slate-400 text-sm">Making blockchain technology usable for everyone.</p>
            </div>
             <div className="flex flex-col items-center">
              <Target size={36} className="text-green-400 mb-3"/> {/* Using Target icon again for Security/Trust */}
              <h3 className="text-xl font-semibold text-white mb-1">Security</h3>
              <p className="text-slate-400 text-sm">Prioritizing safety and reliability in all our offerings.</p>
            </div>
          </div>
        </div>

        {/* Team Section Placeholder (Optional) */}
        {/* 
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Meet the Team</h2>
          <p className="text-slate-400 text-center">Our team of dedicated professionals is committed to your success. (Team member cards would go here)</p>
        </div>
        */}

        <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Us on Our Journey</h2>
            <button 
                onClick={() => window.location.hash = '/register'}
                className="px-10 py-4 bg-gradient-to-r from-brand-accent-blue to-brand-accent-purple text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
                Get Started with BlockDeploy
            </button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
