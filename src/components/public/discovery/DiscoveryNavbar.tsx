/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  Briefcase, 
  Layers, 
  Landmark, 
  Star, 
  DollarSign, 
  TrendingUp, 
  BookOpen 
} from 'lucide-react';

interface DiscoveryNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  jobSelected?: boolean;
}

export default function DiscoveryNavbar({ activeTab, setActiveTab, jobSelected = false }: DiscoveryNavbarProps) {
  const tabs = [
    { id: 'search', label: 'Job Search', icon: Search, desc: 'Find open roles', badge: '12k+' },
    { id: 'advanced', label: 'Advanced', icon: SlidersHorizontal, desc: 'Deep filters', badge: 'New' },
    { id: 'details', label: 'Job Details', icon: Briefcase, desc: 'Position specs', disabled: !jobSelected },
    { id: 'similar', label: 'Similar Jobs', icon: Layers, desc: 'Recommendations' },
    { id: 'company', label: 'Company Profile', icon: Landmark, desc: 'TechMahindra page' },
    { id: 'reviews', label: 'Company Reviews', icon: Star, desc: 'Employee ratings', badge: '4.2★' },
    { id: 'salary', label: 'Salary Explorer', icon: DollarSign, desc: 'Trends & bands' },
    { id: 'skills', label: 'Skills Explorer', icon: TrendingUp, desc: 'Hot capabilities' },
    { id: 'career', label: 'Career Insights', icon: BookOpen, desc: 'Articles & news' },
  ];

  return (
    <div className="w-full bg-surface-theme border border-border-theme rounded-3xl p-3 shadow-md mb-8">
      {/* Scrollable Container on Mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none justify-start lg:justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isButtonDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              disabled={isButtonDisabled}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer select-none whitespace-nowrap group ${
                isButtonDisabled 
                  ? 'opacity-40 cursor-not-allowed' 
                  : isActive
                  ? 'text-white font-bold'
                  : 'text-text-secondary-theme hover:text-text-primary-theme'
              }`}
            >
              {/* Sliding Background Highlight */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary-theme rounded-2xl shadow-lg shadow-primary-theme/20 z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Glowing hover ring */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary-theme/25 transition-colors z-0" />

              {/* Relative layout above background indicator */}
              <div className="relative z-10 flex items-center gap-2.5">
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                  isActive ? 'text-white scale-110' : 'text-text-muted-theme group-hover:text-primary-theme group-hover:scale-105'
                }`} />

                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[11px] font-bold tracking-tight">{tab.label}</span>
                  <span className={`text-[8px] font-medium hidden md:inline transition-colors ${
                    isActive ? 'text-white/80' : 'text-text-muted-theme'
                  }`}>
                    {tab.desc}
                  </span>
                </div>

                {/* Badges */}
                {tab.badge && (
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                    isActive 
                      ? 'bg-white text-primary-theme' 
                      : 'bg-primary-theme/10 text-primary-theme'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
