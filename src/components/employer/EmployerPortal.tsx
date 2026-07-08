/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Briefcase, Users, Sparkles, Search, Calendar, 
  ShieldAlert, Settings, LogOut, MessageSquare, Award, CreditCard, Building2, Bell, Sun, Moon
} from 'lucide-react';
import { Job } from '../../types';

// Importing our high-fidelity, interactive Phase 3 sections
import EmpDashboardSection from './sections/EmpDashboardSection';
import EmpJobsSection from './sections/EmpJobsSection';
import EmpAtsSection from './sections/EmpAtsSection';
import EmpAiSection from './sections/EmpAiSection';
import EmpSearchSection from './sections/EmpSearchSection';
import EmpInterviewsSection from './sections/EmpInterviewsSection';
import EmpTeamSection from './sections/EmpTeamSection';
import EmpCompanySection from './sections/EmpCompanySection';
import EmpBillingSection from './sections/EmpBillingSection';
import EmpSettingsSection from './sections/EmpSettingsSection';

interface EmployerPortalProps {
  username: string;
  onLogout: () => void;
  onPostJob: (newJob: Job) => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

interface ToastItem {
  id: string;
  text: string;
  type: 'success' | 'info';
}

export default function EmployerPortal({ 
  username, 
  onLogout, 
  onPostJob,
  theme = 'light',
  toggleTheme
}: EmployerPortalProps) {
  // Navigation State supporting all 10 Phase 3 sections
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Sourcing & ATS target state (e.g. if we choose to process a candidate from Sourcing search)
  const [targetApplicantId, setTargetApplicantId] = useState<string | null>(null);
  const [targetJobTitle, setTargetJobTitle] = useState<string | null>(null);

  // Dynamic feedback Toast state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const prevIdsRef = React.useRef<string[]>([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    if (!token) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
        
        const newIds = data.map((n: any) => n.id);
        if (prevIdsRef.current.length > 0) {
          const delta = data.filter((n: any) => !prevIdsRef.current.includes(n.id) && !n.read);
          delta.forEach((n: any) => {
            addToast(n.message, 'info');
          });
        }
        prevIdsRef.current = newIds;
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchNotifications();
        addToast('All notifications marked as read', 'success');
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const addToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleSelectApplicantForAts = (applicantId: string) => {
    setTargetApplicantId(applicantId);
    setActiveTab('ats');
    addToast('Applicant selected. Sourcing detail loaded in ATS pipeline panel.', 'info');
  };

  const handleNavigateToAtsFromDashboard = (applicantId: string) => {
    setTargetApplicantId(applicantId);
    setActiveTab('ats');
  };

  return (
    <div className="min-h-screen bg-bg-theme text-text-primary-theme flex flex-col md:flex-row font-sans">
      
      {/* Toast Notification Layer */}
      <div className="fixed top-5 right-5 z-50 space-y-2.5 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
                toast.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-500' 
                  : 'bg-primary-theme/10 border-primary-theme/15 text-primary-theme'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              <span>{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Recruiter Sidebar Panel */}
      <aside className="hidden md:flex flex-col w-72 bg-surface-theme border-r border-border-theme p-6 justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          
          {/* Logo Brand segment */}
          <div className="flex items-center gap-3 border-b border-border-theme/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-theme to-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-primary-theme/15">
              T
            </div>
            <div>
              <h3 className="text-xs font-serif font-black text-text-primary-theme leading-none">TechnoAdviser</h3>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block mt-1.5">Employer Console</span>
            </div>
          </div>

          {/* Sourcing Navigation Grid */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Metric Suite', icon: LayoutDashboard },
              { id: 'jobs', label: 'Job Openings Manager', icon: Briefcase },
              { id: 'ats', label: 'ATS Screening Pipeline', icon: Users },
              { id: 'ai', label: 'AI Sourcing Assist', icon: Sparkles },
              { id: 'search', label: 'Candidate Search Pool', icon: Search },
              { id: 'interviews', label: 'Meet Calendars', icon: Calendar },
              { id: 'team', label: 'Hiring Team Members', icon: ShieldAlert },
              { id: 'company', label: 'Company Brand Profile', icon: Building2 },
              { id: 'billing', label: 'Credits & Invoices', icon: Award },
              { id: 'settings', label: 'Console Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Clear search target applicant if we switch tabs manually
                    if (tab.id !== 'ats') setTargetApplicantId(null);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-theme text-white shadow-sm font-black'
                      : 'text-text-secondary-theme hover:bg-border-theme/30 hover:text-text-primary-theme'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Control block */}
        <div className="pt-6 border-t border-border-theme/60">
          <button
            onClick={onLogout}
            className="w-full text-center py-2.5 bg-border-theme/20 hover:bg-rose-500/10 hover:text-rose-500 text-text-secondary-theme text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-transparent hover:border-rose-500/15"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Right side container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Modern Sticky Workspace Header */}
        <header className="sticky top-0 z-30 bg-surface-theme/80 backdrop-blur-md border-b border-border-theme/60 px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-theme bg-primary-theme/10 px-2.5 py-1 rounded-md">Recruiter Workspace</span>
            <span className="text-text-muted-theme text-xs">/</span>
            <span className="text-xs font-bold text-text-secondary-theme capitalize">
              {[
                { id: 'dashboard', label: 'Dashboard Metric Suite' },
                { id: 'jobs', label: 'Job Openings Manager' },
                { id: 'ats', label: 'ATS Screening Pipeline' },
                { id: 'ai', label: 'AI Sourcing Assist' },
                { id: 'search', label: 'Candidate Search Pool' },
                { id: 'interviews', label: 'Meet Calendars' },
                { id: 'team', label: 'Hiring Team Members' },
                { id: 'company', label: 'Company Brand Profile' },
                { id: 'billing', label: 'Credits & Invoices' },
                { id: 'settings', label: 'Console Settings' },
              ].find(item => item.id === activeTab)?.label || activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 bg-surface-theme border border-border-theme/60 text-text-primary-theme rounded-xl hover:border-primary-theme/50 hover:shadow-[0_0_15px_rgba(232,112,42,0.15)] transition-all cursor-pointer group"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-text-secondary-theme group-hover:text-primary-theme transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifDropdown && (
                  <>
                    {/* Backdrop to close dropdown on click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-80 bg-surface-theme border border-border-theme rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="flex justify-between items-center px-4 py-3.5 border-b border-border-theme/60 bg-border-theme/10">
                        <span className="text-[10px] font-black uppercase tracking-wider text-text-primary-theme">Live Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => {
                              handleMarkAllRead();
                              setShowNotifDropdown(false);
                            }}
                            className="text-[9px] text-primary-theme hover:underline font-bold bg-transparent border-none cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-border-theme/40">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                handleMarkAsRead(notif.id);
                                setShowNotifDropdown(false);
                                
                                // Extract job title from message, e.g. "applied for 'Senior Frontend Architect'."
                                const match = notif.message.match(/'([^']+)'/);
                                if (match) {
                                  setTargetJobTitle(match[1]);
                                }
                                
                                setActiveTab('ats');
                              }}
                              className={`p-3.5 text-left cursor-pointer transition-all hover:bg-border-theme/20 ${
                                !notif.read ? 'bg-primary-theme/5 border-l-2 border-primary-theme' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-[11px] font-black text-text-primary-theme leading-tight">{notif.title}</p>
                                {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-theme mt-1 flex-shrink-0 animate-pulse"></span>}
                              </div>
                              <p className="text-[10px] text-text-secondary-theme font-medium mt-1 leading-normal">{notif.message}</p>
                              <span className="text-[8px] text-text-muted-theme font-mono font-bold block mt-2">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; {new Date(notif.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-text-muted-theme font-medium">
                            No notifications available
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Theme Toggle inside recruiter workspace */}
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
                <p className="text-[9px] text-text-muted-theme font-bold uppercase tracking-wider leading-none mt-0.5">Verified Recruiter</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Sourcing Content Stage Pane */}
        <main className="flex-1 p-5 md:p-8 space-y-8 overflow-y-auto pb-24 md:pb-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'dashboard' && (
                <EmpDashboardSection 
                  username={username} 
                  onNavigateToTab={setActiveTab} 
                  onNavigateToAts={handleNavigateToAtsFromDashboard} 
                />
              )}

              {activeTab === 'jobs' && (
                <EmpJobsSection 
                  onPostJob={onPostJob} 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'ats' && (
                <EmpAtsSection 
                  initialTargetApplicantId={targetApplicantId} 
                  onClearTargetApplicant={() => setTargetApplicantId(null)} 
                  initialTargetJobTitle={targetJobTitle}
                  onClearTargetJobTitle={() => setTargetJobTitle(null)}
                  addToast={addToast} 
                />
              )}

              {activeTab === 'ai' && (
                <EmpAiSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'search' && (
                <EmpSearchSection 
                  onSelectApplicantForAts={handleSelectApplicantForAts} 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'interviews' && (
                <EmpInterviewsSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'team' && (
                <EmpTeamSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'company' && (
                <EmpCompanySection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'billing' && (
                <EmpBillingSection 
                  addToast={addToast} 
                />
              )}

              {activeTab === 'settings' && (
                <EmpSettingsSection 
                  addToast={addToast} 
                />
              )}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* Mobile Bottom Navigation for Recruiter console */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-theme border-t border-border-theme flex justify-around py-3 z-40 shadow-xl">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'jobs', label: 'Jobs', icon: Briefcase },
          { id: 'ats', label: 'ATS', icon: Users },
          { id: 'ai', label: 'AI', icon: Sparkles },
          { id: 'search', label: 'Search', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'ats') setTargetApplicantId(null);
              }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                isActive ? 'text-primary-theme' : 'text-text-muted-theme'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-black">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
