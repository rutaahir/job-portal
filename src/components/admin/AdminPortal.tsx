/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, Building2, Briefcase, CreditCard, 
  Cpu, Layout, BarChart3, ShieldAlert, Inbox, LogOut, 
  Menu, X, Bell, Search, Globe, ChevronRight
} from 'lucide-react';

import AdminOverview from './sections/AdminOverview';
import AdminUserMgmt from './sections/AdminUserMgmt';
import AdminCompanyMgmt from './sections/AdminCompanyMgmt';
import AdminJobMgmt from './sections/AdminJobMgmt';
import AdminSubscription from './sections/AdminSubscription';
import AdminAiEngine from './sections/AdminAiEngine';
import AdminCMS from './sections/AdminCMS';
import AdminAnalytics from './sections/AdminAnalytics';
import AdminSecurity from './sections/AdminSecurity';
import AdminSharedPages from './sections/AdminSharedPages';

interface AdminPortalProps {
  onLogout: () => void;
  onApproveRecruiter?: (companyName: string) => void;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info';
}

export default function AdminPortal({ onLogout }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'companies' | 'jobs' | 'subscription' | 'ai' | 'cms' | 'analytics' | 'security' | 'shared'
  >('overview');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Premium Toast engine
  const addToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const tabs = [
    { id: 'overview', label: '1. Platform Overview', icon: LayoutDashboard },
    { id: 'users', label: '2. User Directory', icon: Users },
    { id: 'companies', label: '3. Company Register', icon: Building2 },
    { id: 'jobs', label: '4. Sourcing Listings', icon: Briefcase },
    { id: 'subscription', label: '5. Subscription Plans', icon: CreditCard },
    { id: 'ai', label: '6. AI Match Parameters', icon: Cpu },
    { id: 'cms', label: '7. Content CMS', icon: Layout },
    { id: 'analytics', label: '8. Cohort Analytics', icon: BarChart3 },
    { id: 'security', label: '9. Platform Security', icon: ShieldAlert },
    { id: 'shared', label: '10. Shared Pages Hub', icon: Inbox },
  ] as const;

  const handleGlobalSearch = () => {
    addToast('Global search parameters matched: 14 candidates, 2 jobs.', 'info');
  };

  return (
    <div className="min-h-screen bg-bg-theme text-text-primary-theme flex flex-col md:flex-row relative font-sans">
      
      {/* Dynamic Animated Floating Toasts */}
      <div className="fixed top-5 right-5 z-55 space-y-2 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-3 pointer-events-auto ${
                toast.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                  : 'bg-primary-theme/10 border-primary-theme/20 text-primary-theme'
              }`}
            >
              <div className="text-xs font-black leading-snug">{toast.text}</div>
              <button 
                onClick={() => setToasts(toasts.filter(t => t.id !== toast.id))}
                className="text-xs font-bold uppercase hover:underline opacity-80 cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MOBILE HEADER BAR */}
      <header className="md:hidden bg-surface-theme border-b border-border-theme px-5 py-4 flex items-center justify-between z-45 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-theme text-white flex items-center justify-center font-black text-xs font-mono">
            SU
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-text-primary-theme">Super Admin</h1>
            <span className="text-[8px] text-primary-theme font-black tracking-wider block font-mono">ROOT ACCESS</span>
          </div>
        </div>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-text-primary-theme bg-border-theme/20 hover:bg-border-theme/40 rounded-lg cursor-pointer"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* DESKTOP SIDEBAR PANEL */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-surface-theme border-r border-border-theme p-6 z-40 transform transition-transform duration-300 md:translate-x-0 md:static flex flex-col justify-between ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="space-y-6">
          
          {/* Admin Identification block */}
          <div className="flex items-center gap-3 border-b border-border-theme/40 pb-5">
            <div className="w-10 h-10 rounded-full bg-primary-theme text-white flex items-center justify-center font-black text-sm font-mono">
              SU
            </div>
            <div>
              <h2 className="text-xs font-black text-text-primary-theme">Super Admin Suite</h2>
              <div className="text-[9px] text-primary-theme font-black font-mono mt-0.5 uppercase tracking-wider">Root Cluster Live</div>
            </div>
          </div>

          {/* Navigation link stacks */}
          <nav className="space-y-1 overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary-theme text-white shadow-sm font-black' 
                      : 'text-text-secondary-theme hover:bg-border-theme/30 hover:text-text-primary-theme'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom utility triggers */}
        <div className="space-y-3 pt-6 border-t border-border-theme/40">
          <button 
            onClick={() => addToast('Dynamic configuration options updated.', 'success')}
            className="w-full text-left p-2 hover:bg-border-theme/20 text-text-muted-theme hover:text-text-primary-theme text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Region: India (Central)</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full text-center py-2.5 bg-border-theme/40 hover:bg-rose-500/15 hover:text-rose-500 text-text-secondary-theme text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Logout Cluster Session
          </button>
        </div>

      </aside>

      {/* MAIN DYNAMIC CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto pb-24 md:pb-8 min-w-0">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-theme/40 pb-5">
          <div>
            <h1 className="text-sm font-black text-text-muted-theme uppercase tracking-wider">Super Administrator</h1>
            <p className="text-xl font-black text-text-primary-theme font-serif capitalize mt-0.5">
              {tabs.find((t) => t.id === activeTab)?.label.slice(3)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-muted-theme" />
              <input 
                type="text" 
                placeholder="Global cluster lookup..."
                onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch()}
                className="bg-surface-theme border border-border-theme rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium text-text-primary-theme focus:outline-none focus:border-primary-theme"
              />
            </div>

            <button 
              onClick={() => addToast('Security parameters optimal. No alerts found.', 'success')}
              className="p-1.5 bg-surface-theme border border-border-theme rounded-lg hover:bg-border-theme/40 cursor-pointer text-text-primary-theme"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic renders */}
        {activeTab === 'overview' && <AdminOverview addToast={addToast} />}
        {activeTab === 'users' && <AdminUserMgmt addToast={addToast} />}
        {activeTab === 'companies' && <AdminCompanyMgmt addToast={addToast} />}
        {activeTab === 'jobs' && <AdminJobMgmt addToast={addToast} />}
        {activeTab === 'subscription' && <AdminSubscription addToast={addToast} />}
        {activeTab === 'ai' && <AdminAiEngine addToast={addToast} />}
        {activeTab === 'cms' && <AdminCMS addToast={addToast} />}
        {activeTab === 'analytics' && <AdminAnalytics addToast={addToast} />}
        {activeTab === 'security' && <AdminSecurity addToast={addToast} />}
        {activeTab === 'shared' && <AdminSharedPages addToast={addToast} />}

      </main>

    </div>
  );
}
