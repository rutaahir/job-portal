/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Search, Bot, FileText, Award, Calendar, CheckSquare, Coins, Info, ArrowRight } from 'lucide-react';

interface FeaturesOverviewProps {
  onNavigateToPage: (page: string) => void;
}

export default function FeaturesOverview({ onNavigateToPage }: FeaturesOverviewProps) {
  const features = [
    {
      title: 'Smart Job Search',
      desc: 'Find the right jobs with advanced filters and AI recommendations matching your background.',
      icon: Search,
    },
    {
      title: 'AI Career Assistant',
      desc: 'Get personalized career advice, resume tips and growth guidance from our copilot.',
      icon: Bot,
    },
    {
      title: 'Resume Builder',
      desc: 'Create a professional resume that stands out to employers and beats ATS filters.',
      icon: FileText,
    },
    {
      title: 'Skill Assessments',
      desc: 'Test your skills and get certificates to boost your profile strength score.',
      icon: Award,
    },
    {
      title: 'Application Tracker',
      desc: 'Track your applications and stay updated on every step of the hiring pipeline.',
      icon: CheckSquare,
    },
    {
      title: 'Interview Preparation',
      desc: 'Practice with mock interviews and expert questions built from real tech rounds.',
      icon: Calendar,
    },
    {
      title: 'Salary Insights',
      desc: 'Explore salary trends and negotiate with confidence using authentic market data.',
      icon: Coins,
    },
    {
      title: 'Company Insights',
      desc: 'Discover company culture, reviews and verified ratings before you apply.',
      icon: Info,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
          Features Overview
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-text-primary-theme tracking-tight">
          Everything You Need <br />to <span className="text-primary-theme">Get Hired</span>
        </h1>
        <p className="text-text-secondary-theme font-normal text-sm sm:text-base leading-relaxed">
          Powerful tools and intelligent features designed to accelerate your career, optimize resume structures, and connect directly with verified recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-surface-theme border border-border-theme p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-theme/30 transition-all group flex flex-col justify-between min-h-[200px]"
            >
              <div className="space-y-3">
                <div className="p-3 bg-primary-theme/5 text-primary-theme rounded-xl w-fit group-hover:bg-primary-theme group-hover:text-white transition-colors duration-200">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-text-primary-theme group-hover:text-primary-theme transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-text-secondary-theme leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-secondary-theme text-white rounded-3xl p-8 md:p-12 border border-border-theme flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(232,112,42,0.1),transparent_55%)]" />
        <div className="space-y-2 z-10 text-center md:text-left">
          <h2 className="text-2xl font-bold font-serif">All the tools you need. One platform.</h2>
          <p className="text-sm text-white/80 max-w-lg font-normal">
            Sign up now to explore all our premium matching tools, resume score audit systems, and recruiter DM services for free.
          </p>
        </div>
        <div className="flex gap-4 z-10 w-full md:w-auto justify-center">
          <button
            onClick={() => onNavigateToPage('Candidate Registration')}
            className="px-6 py-3 bg-primary-theme hover:bg-primary-hover-theme text-white font-bold rounded-full text-xs transition-colors shadow-lg"
          >
            Sign Up For Free
          </button>
          <button
            onClick={() => onNavigateToPage('Why TechnoAdviser')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-xs border border-white/20 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}
