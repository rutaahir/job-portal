/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, User, CheckSquare, Bot, 
  HelpCircle, Calendar, Users, BarChart3, CreditCard, 
  Settings, LogOut, Sparkles, BellRing, Compass, Sun, Moon
} from 'lucide-react';

// Sections
import DashboardSection from './sections/DashboardSection';
import ProfileSection from './sections/ProfileSection';
import ApplicationsSection from './sections/ApplicationsSection';
import AICareerSection from './sections/AICareerSection';
import AssessmentsSection from './sections/AssessmentsSection';
import InterviewCalendarSection from './sections/InterviewCalendarSection';
import NetworkSection from './sections/NetworkSection';
import AnalyticsSection from './sections/AnalyticsSection';
import BillingSection from './sections/BillingSection';
import SettingsSection from './sections/SettingsSection';

interface CandidatePortalProps {
  username: string;
  onLogout: () => void;
  onNavigateToPublic: (page: string) => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function CandidatePortal({ 
  username, 
  onLogout, 
  onNavigateToPublic,
  theme = 'light',
  toggleTheme
}: CandidatePortalProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'success' | 'info' }[]>([]);

  const addToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'applications', label: 'Applications', icon: CheckSquare },
    { id: 'copilot', label: 'AI Career Assistant', icon: Bot },
    { id: 'assessments', label: 'Skill Assessments', icon: HelpCircle },
    { id: 'interviews', label: 'Interview Calendar', icon: Calendar },
    { id: 'network', label: 'Network & Mentors', icon: Users },
    { id: 'analytics', label: 'Career Analytics', icon: BarChart3 },
    { id: 'billing', label: 'Subscription & Invoices', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  const handleNavigateToJobDetail = (jobId: string) => {
    onNavigateToPublic('Find Jobs');
  };

  return (
    <div className="min-h-screen bg-bg-theme text-text-primary-theme flex flex-col md:flex-row font-sans">
      
      {/* Toast Notification Layer */}
      <div className="fixed top-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2 pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-success-theme/10 border-success-theme/20 text-success-theme'
                  : 'bg-primary-theme/10 border-primary-theme/20 text-primary-theme'
              }`}
            >
              <BellRing className="w-4 h-4 flex-shrink-0" />
              <span>{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-theme border-r border-border-theme p-6 justify-between flex-shrink-0">
        <div className="space-y-8">
          
          {/* Candidate Bio Segment */}
          <div className="flex items-center gap-3 border-b border-border-theme pb-5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-theme to-indigo-600 text-white flex items-center justify-center font-black text-sm border-2 border-primary-theme/15 shadow-sm">
              {username.charAt(0)}
            </div>
            <div>
              <h3 className="text-xs font-black text-text-primary-theme truncate max-w-[150px]">{username}</h3>
              <div className="text-[9px] text-text-muted-theme font-bold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> ACTIVE MATCH MATRIX
              </div>
            </div>
          </div>

          {/* Links list */}
          <nav className="space-y-1 overflow-y-auto max-h-[60vh] scrollbar-none pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-3 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-primary-theme text-white shadow-sm'
                      : 'text-text-secondary-theme hover:bg-border-theme/30 hover:text-text-primary-theme'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="w-full text-center py-2.5 bg-border-theme/40 hover:bg-error-theme/10 hover:text-error-theme text-text-secondary-theme text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout Session
        </button>
      </aside>

      {/* Right side container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Modern Sticky Workspace Header */}
        <header className="sticky top-0 z-30 bg-surface-theme/80 backdrop-blur-md border-b border-border-theme/60 px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-theme bg-primary-theme/10 px-2.5 py-1 rounded-md">Candidate Workspace</span>
            <span className="text-text-muted-theme text-xs">/</span>
            <span className="text-xs font-bold text-text-secondary-theme capitalize">
              {navItems.find(item => item.id === activeTab)?.label || activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Public Job Board navigation */}
            <button
              onClick={() => onNavigateToPublic('Find Jobs')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-border-theme/60 text-text-secondary-theme hover:text-primary-theme hover:border-primary-theme/30 text-xs font-bold rounded-lg transition-all cursor-pointer bg-surface-theme"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Jobs</span>
            </button>

            {/* Premium Theme Toggle inside workspace */}
            {toggleTheme && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="relative p-2 bg-surface-theme border border-border-theme/60 text-text-primary-theme rounded-xl hover:border-[#E8702A]/50 hover:shadow-[0_0_15px_rgba(232,112,42,0.15)] transition-all cursor-pointer overflow-hidden group"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4 text-text-secondary-theme group-hover:text-[#E8702A] transition-colors" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
                  )}
                </div>
                <span className="absolute inset-0 bg-gradient-to-tr from-[#E8702A]/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            )}

            {/* Profile segment */}
            <div className="flex items-center gap-2.5 border-l border-border-theme/60 pl-4">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-primary-theme/20 bg-surface-theme shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:block min-w-0 text-left">
                <p className="text-xs font-extrabold text-text-primary-theme truncate leading-tight">{username}</p>
                <p className="text-[9px] text-text-muted-theme font-bold uppercase tracking-wider leading-none mt-0.5">Verified Candidate</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Arena */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto pb-24 md:pb-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardSection 
                  onNavigateToTab={(tabId) => {
                    if (tabId === 'search') {
                      onNavigateToPublic('Find Jobs');
                    } else {
                      setActiveTab(tabId);
                    }
                  }} 
                  onViewJobDetail={handleNavigateToJobDetail} 
                />
              )}

              {activeTab === 'profile' && (
                <ProfileSection 
                  username={username}
                  addToast={addToast} 
                />
              )}

              {activeTab === 'applications' && (
                <ApplicationsSection 
                  addToast={addToast} 
                  onNavigateToTab={setActiveTab} 
                />
              )}

              {activeTab === 'copilot' && (
                <AICareerSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'assessments' && (
                <AssessmentsSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'interviews' && (
                <InterviewCalendarSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'network' && (
                <NetworkSection 
                  onNavigateToTab={setActiveTab} 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsSection />
              )}

              {activeTab === 'billing' && (
                <BillingSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'settings' && (
                <SettingsSection 
                  onLogout={onLogout} 
                  addToast={addToast} 
                />
              )}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* Mobile Sticky Footer Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-theme border-t border-border-theme flex justify-around py-2.5 z-40 shadow-xl">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'copilot', label: 'AI', icon: Bot }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                isActive ? 'text-primary-theme' : 'text-text-muted-theme'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-extrabold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
