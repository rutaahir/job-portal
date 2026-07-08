/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Bell, ArrowRight, Menu, X, Mail, Phone, MapPin, 
  ExternalLink, ChevronRight, CheckCircle, Info, Home, Briefcase, 
  Sparkles, Award, Layers, Tag, BookOpen, HelpCircle, LogIn, UserPlus 
} from 'lucide-react';
import Logo from './components/shared/Logo';
import { PremiumToastsContainer, Toast } from './components/shared/PremiumToasts';

// Public Views
import Landing from './components/public/Landing';
import AboutUs from './components/public/AboutUs';
import WhyTechnoAdviser from './components/public/WhyTechnoAdviser';
import FeaturesOverview from './components/public/FeaturesOverview';
import AIRecruitment from './components/public/AIRecruitment';
import Pricing from './components/public/Pricing';
import ContactUs from './components/public/ContactUs';
import BlogListing from './components/public/BlogListing';
import FAQ from './components/public/FAQ';
import Legal from './components/public/Legal';
import JobDiscovery from './components/public/JobDiscovery';

// Auth Views
import AuthFlow from './components/auth/AuthFlow';
import { AuthStep } from './components/auth/AuthTypes';

// Portal Views
import CandidatePortal from './components/candidate/CandidatePortal';
import EmployerPortal from './components/employer/EmployerPortal';
import AdminPortal from './components/admin/AdminPortal';

import { Role, Theme, Job } from './types';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [currentPage, setCurrentPage] = useState<string>('Home');
  const [userRole, setUserRole] = useState<Role>('GUEST');
  const [username, setUsername] = useState<string>('');
  const [authInitialStep, setAuthInitialStep] = useState<AuthStep>('LOGIN');
  
  // Sticky or dynamic state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cookieConsent, setCookieConsent] = useState<'pending' | 'accepted' | 'declined'>('pending');

  // Cinematic theme fade transitions
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const [themeTransitionColor, setThemeTransitionColor] = useState<string>('#FAF9F6');

  // Custom visual toast system
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (text: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Theme between light and dark modes with premium full-screen fade mask
  const toggleTheme = () => {
    if (isThemeTransitioning) return;
    setIsThemeTransitioning(true);
    
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeTransitionColor(nextTheme === 'dark' ? '#12171C' : '#FAF9F6');

    setTimeout(() => {
      setTheme(nextTheme);
    }, 250);

    setTimeout(() => {
      setIsThemeTransitioning(false);
    }, 700);
  };

  useEffect(() => {
    // Apply theme classes to container / body element
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Session restoration on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('technoadviser_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Expiry of 24h
        if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
          setUserRole(session.role);
          setUsername(session.name);
          
          // Auto-sync token if it does not match active session email
          const currentToken = localStorage.getItem('technoadviser_token');
          if (currentToken !== session.email) {
            localStorage.setItem('technoadviser_token', session.email);
          }

          addToast(`Restored session as ${session.name}!`, 'success');
          setCurrentPage('Portal');
        } else {
          localStorage.removeItem('technoadviser_session');
          localStorage.removeItem('technoadviser_token');
        }
      } catch (err) {
        localStorage.removeItem('technoadviser_session');
        localStorage.removeItem('technoadviser_token');
      }
    }
  }, []);

  // Fetch live jobs from database on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs?limit=100');
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.jobs)) {
            // Map DB attributes to frontend types
            const mappedJobs = data.jobs.map((j: any) => ({
              ...j,
              companyName: j.companyName || 'Corporate Partner',
              companyLogo: j.companyLogo || ''
            }));
            setJobs(mappedJobs);
          } else {
            setJobs([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch jobs from backend API:', err);
      }
    };
    fetchJobs();
  }, []);

  // Handle a new job posted by the Employer
  const handlePostJob = async (newJob: Job) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newJob.title,
          location: newJob.location,
          workMode: newJob.workMode,
          experienceRange: newJob.experienceRange,
          salaryRange: newJob.salaryRange,
          description: newJob.description,
          tags: newJob.tags,
          status: (newJob as any).status || 'PUBLISHED'
        })
      });
      if (response.ok) {
        const savedJob = await response.json();
        const mapped = {
          ...savedJob,
          companyName: savedJob.companyName || 'TechnoAdviser Technologies Pvt. Ltd.',
          companyLogo: savedJob.companyLogo || ''
        };
        setJobs((prev) => [mapped, ...prev]);
        addToast(`Successfully posted position: ${mapped.title}!`, 'success');
        return mapped;
      } else {
        const errData = await response.json();
        addToast(`Failed to post position: ${errData.error || response.statusText}`, 'error');
        // Fallback to local memory state update
        setJobs((prev) => [newJob, ...prev]);
        return null;
      }
    } catch (err) {
      console.error('Error posting job:', err);
      // Fallback
      setJobs((prev) => [newJob, ...prev]);
      addToast(`Successfully posted position: ${newJob.title} (offline mode)!`, 'success');
      return newJob;
    }
  };

  // Handle job applied
  const handleApplyJob = (job: Job) => {
    addToast(`Application proposal dispatched for ${job.title}!`, 'success');
  };

  // Navigation controller helper
  const navigateToPage = (pageName: string) => {
    setCurrentPage(pageName);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: Role, name: string) => {
    setUserRole(role);
    setUsername(name);
    addToast(`Successfully authenticated as ${name}!`, 'success');
    
    // Ensure token matches session email
    const savedSession = localStorage.getItem('technoadviser_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        localStorage.setItem('technoadviser_token', session.email);
      } catch (e) {}
    }
    
    const redirectTo = localStorage.getItem('redirect_after_login');
    if (redirectTo && role === 'JOB_SEEKER') {
      localStorage.removeItem('redirect_after_login');
      navigateToPage(redirectTo);
    } else {
      navigateToPage('Portal');
    }
  };

  const handleLogout = () => {
    setUserRole('GUEST');
    setUsername('');
    localStorage.removeItem('technoadviser_session');
    localStorage.removeItem('technoadviser_token');
    localStorage.removeItem('redirect_after_login');
    addToast('Logged out of session.', 'info');
    navigateToPage('Home');
  };

  // Helper lists
  const navLinks = [
    { label: 'Home', isAuthRequired: false },
    { label: 'Jobs', isAuthRequired: false },
    { label: 'AI Sourcing', isAuthRequired: false },
    { label: 'About Us', isAuthRequired: false },
    { label: 'Why Us', isAuthRequired: false },
    { label: 'Features', isAuthRequired: false },
    { label: 'Pricing', isAuthRequired: false },
    { label: 'Blog', isAuthRequired: false },
    { label: 'FAQ', isAuthRequired: false },
    { label: 'Contact', isAuthRequired: false },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className={`min-h-screen flex flex-col bg-bg-theme text-text-primary-theme transition-colors duration-300`}>
      {/* Cinematic Theme Fade Overlay */}
      <AnimatePresence>
        {isThemeTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{ backgroundColor: themeTransitionColor }}
          />
        )}
      </AnimatePresence>

      {/* Premium Advanced Toastify Alerts */}
      <PremiumToastsContainer toasts={toasts} onClose={removeToast} />

      {/* STICKY HEADER */}
      {(userRole === 'GUEST' || (userRole === 'JOB_SEEKER' && currentPage !== 'Portal')) && (
        <header className="sticky top-0 z-40 bg-surface-theme/80 backdrop-blur-md border-b border-border-theme">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => navigateToPage('Home')}>
              <Logo size="sm" showSubtitle={true} />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigateToPage(link.label === 'Jobs' ? 'Find Jobs' : link.label === 'Contact' ? 'Contact Us' : link.label)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    (currentPage === link.label || (currentPage === 'Find Jobs' && link.label === 'Jobs') || (currentPage === 'Contact Us' && link.label === 'Contact'))
                      ? 'text-primary-theme bg-primary-theme/5'
                      : 'text-text-secondary-theme hover:text-text-primary-theme'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions / Buttons */}
            <div className="flex items-center gap-3">
              {/* Premium Animated Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleTheme}
                className="relative p-2.5 bg-surface-theme border border-border-theme/60 text-text-primary-theme rounded-2xl hover:border-[#E8702A]/50 hover:shadow-[0_0_15px_rgba(232,112,42,0.15)] transition-all cursor-pointer overflow-hidden group"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'light' ? 0 : 180, scale: theme === 'light' ? 1 : 1.1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="relative z-10"
                >
                  {theme === 'light' ? (
                    <Moon className="w-4.5 h-4.5 text-text-secondary-theme group-hover:text-[#E8702A] transition-colors" />
                  ) : (
                    <Sun className="w-4.5 h-4.5 text-amber-500 group-hover:text-amber-400 transition-colors" />
                  )}
                </motion.div>
                <span className="absolute inset-0 bg-gradient-to-tr from-[#E8702A]/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              {/* Account Launchers */}
              {userRole === 'GUEST' ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthInitialStep('LOGIN');
                      navigateToPage('Auth');
                    }}
                    className="px-4.5 py-2.5 text-xs font-bold text-text-secondary-theme hover:text-text-primary-theme cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthInitialStep('CANDIDATE_REG');
                      navigateToPage('Auth');
                    }}
                    className="px-4.5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Sign Up Free
                  </button>
                </div>
              ) : (
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-border-theme/40 transition-colors cursor-pointer"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full border-2 border-primary-theme"
                    />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface-theme border border-border-theme rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-border-theme/60">
                        <p className="text-xs font-black text-text-primary-theme truncate">{username}</p>
                        <p className="text-[10px] text-text-muted-theme font-bold uppercase">Candidate</p>
                      </div>
                      <button
                        onClick={() => {
                          navigateToPage('Portal');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-text-secondary-theme hover:bg-border-theme/40 hover:text-text-primary-theme transition-colors cursor-pointer"
                      >
                        View Dashboard
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-error-theme hover:bg-error-theme/5 transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2.5 text-text-secondary-theme hover:text-text-primary-theme cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile responsive Sidebar Drawer */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop with elegant blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 z-50 bg-[#12171C]/60 backdrop-blur-md xl:hidden"
                />

                {/* Sliding Sidebar Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 24, stiffness: 180 }}
                  className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[320px] bg-surface-theme border-l border-border-theme shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col xl:hidden"
                >
                  {/* Header */}
                  <div className="p-5 border-b border-border-theme/60 flex items-center justify-between">
                    <Logo size="sm" showSubtitle={false} />
                    <div className="flex items-center gap-2">
                      {/* Interactive Theme Toggle Inside Sidebar */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2 bg-border-theme/40 text-text-primary-theme rounded-xl border border-border-theme/50 cursor-pointer"
                        title="Toggle Theme"
                      >
                        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      </motion.button>
                      
                      {/* Close button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 bg-border-theme/40 hover:bg-border-theme text-text-secondary-theme hover:text-text-primary-theme rounded-xl transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Scrollable Navigation Links */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary-theme px-3 mb-3">
                        Main Navigation
                      </p>
                      
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.04 }
                          }
                        }}
                        initial="hidden"
                        animate="show"
                        className="space-y-1"
                      >
                        {navLinks.map((link) => {
                          const isActive = currentPage === link.label || 
                            (currentPage === 'Find Jobs' && link.label === 'Jobs') || 
                            (currentPage === 'Contact Us' && link.label === 'Contact');
                          
                          // Resolve icon
                          let linkIcon = <Info className="w-4 h-4" />;
                          if (link.label === 'Home') linkIcon = <Home className="w-4 h-4" />;
                          else if (link.label === 'Jobs') linkIcon = <Briefcase className="w-4 h-4" />;
                          else if (link.label === 'AI Sourcing') linkIcon = <Sparkles className="w-4 h-4" />;
                          else if (link.label === 'About Us') linkIcon = <Info className="w-4 h-4" />;
                          else if (link.label === 'Why Us') linkIcon = <Award className="w-4 h-4" />;
                          else if (link.label === 'Features') linkIcon = <Layers className="w-4 h-4" />;
                          else if (link.label === 'Pricing') linkIcon = <Tag className="w-4 h-4" />;
                          else if (link.label === 'Blog') linkIcon = <BookOpen className="w-4 h-4" />;
                          else if (link.label === 'FAQ') linkIcon = <HelpCircle className="w-4 h-4" />;
                          else if (link.label === 'Contact') linkIcon = <Mail className="w-4 h-4" />;

                          return (
                            <motion.button
                              key={link.label}
                              variants={{
                                hidden: { opacity: 0, x: 20 },
                                show: { opacity: 1, x: 0 }
                              }}
                              onClick={() => navigateToPage(link.label === 'Jobs' ? 'Find Jobs' : link.label === 'Contact' ? 'Contact Us' : link.label)}
                              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer relative group ${
                                isActive 
                                  ? 'text-primary-theme bg-primary-theme/5 border-l-2 border-primary-theme' 
                                  : 'text-text-secondary-theme hover:text-text-primary-theme hover:bg-border-theme/30'
                              }`}
                            >
                              <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary-theme' : 'text-text-muted-theme group-hover:text-primary-theme'}`}>
                                {linkIcon}
                              </span>
                              <span>{link.label}</span>
                              
                              {/* Soft glow for active link */}
                              {isActive && (
                                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-theme shadow-[0_0_8px_#E8702A]" />
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>

                    {/* Account actions (Demo Portal and Post a Job are REMOVED per user instructions) */}
                    <div className="border-t border-border-theme/60 pt-6 px-3 space-y-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted-theme mb-1">
                        Security Portal
                      </p>
                      
                      {userRole === 'GUEST' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setAuthInitialStep('LOGIN');
                              navigateToPage('Auth');
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 py-3 border border-border-theme rounded-2xl text-xs font-bold text-text-primary-theme hover:bg-border-theme/20 transition-all cursor-pointer"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            Login
                          </button>
                          <button
                            onClick={() => {
                              setAuthInitialStep('CANDIDATE_REG');
                              navigateToPage('Auth');
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-theme to-[#E8702A] hover:opacity-95 text-white rounded-2xl text-xs font-black shadow-lg shadow-primary-theme/15 hover:shadow-primary-theme/25 transition-all cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Sign Up
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 bg-border-theme/20 rounded-2xl">
                            <img
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                              alt="Profile"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full border border-primary-theme"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black text-text-primary-theme truncate">{username}</p>
                              <p className="text-[9px] text-text-muted-theme font-bold uppercase">Candidate</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              navigateToPage('Portal');
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 bg-primary-theme text-white rounded-2xl text-xs font-bold text-center block shadow-md cursor-pointer"
                          >
                            View Dashboard
                          </button>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 border border-border-theme rounded-2xl text-xs font-bold text-center text-error-theme hover:bg-error-theme/5 cursor-pointer"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Footer */}
                  <div className="p-5 border-t border-border-theme/60 bg-surface-theme/40 text-center space-y-3">
                    <p className="text-[10px] text-text-muted-theme font-semibold">
                      TechnoAdviser Carrier Verification
                    </p>
                    <div className="flex items-center justify-center gap-4 text-text-muted-theme">
                      <a href="mailto:contact@technoadviser.com" className="hover:text-primary-theme transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href="tel:+918490911181" className="hover:text-primary-theme transition-colors">
                        <Phone className="w-4 h-4" />
                      </a>
                      <a href="#location" className="hover:text-primary-theme transition-colors">
                        <MapPin className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* Admin or Logged-in Navigation header bar */}
      {(userRole === 'RECRUITER' || userRole === 'ADMINISTRATOR') && (
        <header className="bg-surface-theme border-b border-border-theme py-4 px-6 flex justify-between items-center z-40">
          <Logo size="sm" showSubtitle={false} />
          <div className="flex items-center gap-4">
            {/* Premium Animated Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="relative p-2 bg-surface-theme border border-border-theme/60 text-text-primary-theme rounded-xl hover:border-[#E8702A]/50 hover:shadow-[0_0_15px_rgba(232,112,42,0.15)] transition-all cursor-pointer overflow-hidden group"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'light' ? 0 : 180, scale: theme === 'light' ? 1 : 1.1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="relative z-10"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-text-secondary-theme group-hover:text-[#E8702A] transition-colors" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
                )}
              </motion.div>
              <span className="absolute inset-0 bg-gradient-to-tr from-[#E8702A]/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
            <span className="text-xs font-extrabold text-text-primary-theme">{username} ({userRole})</span>
            <button onClick={handleLogout} className="text-xs text-error-theme font-bold hover:underline">
              Logout
            </button>
          </div>
        </header>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1">
        {/* PUBLIC WEBPAGE VIEWS */}
        {(userRole === 'GUEST' || (userRole === 'JOB_SEEKER' && currentPage !== 'Portal')) && (
          <main>
            {currentPage === 'Home' && (
              <Landing
                onNavigateToPage={navigateToPage}
                onSearchJobs={(kw, loc) => {
                  navigateToPage('Find Jobs');
                }}
              />
            )}
            {currentPage === 'About Us' && <AboutUs onNavigateToPage={navigateToPage} />}
            {currentPage === 'Why Us' && <WhyTechnoAdviser onNavigateToPage={navigateToPage} />}
            {currentPage === 'Features' && <FeaturesOverview onNavigateToPage={navigateToPage} />}
            {currentPage === 'AI Sourcing' && <AIRecruitment onNavigateToPage={navigateToPage} />}
            {currentPage === 'Pricing' && (
              <Pricing
                onSelectPlan={(name, price) => {
                  addToast(`Initiated corporate onboarding for plan ${name}!`, 'success');
                  setAuthInitialStep('EMPLOYER_REG');
                  navigateToPage('Auth');
                }}
              />
            )}
            {currentPage === 'Contact Us' && <ContactUs />}
            {currentPage === 'Blog' && <BlogListing />}
            {currentPage === 'FAQ' && <FAQ onNavigateToPage={navigateToPage} />}
            {currentPage === 'Privacy Policy' && <Legal />}
            {currentPage === 'Find Jobs' && (
              <JobDiscovery
                onNavigateToPage={navigateToPage}
                onApplyJob={handleApplyJob}
                jobs={jobs}
                isLoggedIn={userRole === 'JOB_SEEKER'}
                onRedirectToLogin={() => {
                  localStorage.setItem('redirect_after_login', 'Find Jobs');
                  setAuthInitialStep('LOGIN');
                  navigateToPage('Auth');
                }}
              />
            )}
            {currentPage === 'Auth' && (
              <AuthFlow
                initialStep={authInitialStep}
                onNavigateToPage={navigateToPage}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </main>
        )}

        {/* LOGGED IN USER PORTALS */}
        {userRole === 'JOB_SEEKER' && currentPage === 'Portal' && (
          <CandidatePortal 
            username={username} 
            onLogout={handleLogout} 
            onNavigateToPublic={navigateToPage}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
        {userRole === 'RECRUITER' && (
          <EmployerPortal 
            username={username} 
            onLogout={handleLogout} 
            onPostJob={handlePostJob} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
        {userRole === 'ADMINISTRATOR' && (
          <AdminPortal
            onLogout={handleLogout}
            onApproveRecruiter={(company) => addToast(`Approved recruiter access for ${company}!`, 'success')}
          />
        )}
      </div>

      {/* COMPACT SECURE FOOTER */}
      {(userRole === 'GUEST' || (userRole === 'JOB_SEEKER' && currentPage !== 'Portal')) && (
        <footer className="bg-surface-theme border-t border-border-theme pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-border-theme/60">
            {/* Brand column */}
            <div className="space-y-4">
              <Logo size="sm" showSubtitle={true} />
              <p className="text-xs text-text-secondary-theme leading-relaxed">
                Empowering career search pipelines with secure smart-matching and strict employer verification paradigms.
              </p>
              <div className="text-[10px] text-text-muted-theme font-semibold font-mono tracking-wider uppercase">
                TECHNOADVISER GROUP
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Candidate Portal</h4>
              <ul className="space-y-1.5 text-xs text-text-secondary-theme font-medium">
                <li><button onClick={() => navigateToPage('Find Jobs')} className="hover:text-primary-theme">Browse Jobs</button></li>
                <li><button onClick={() => navigateToPage('About Us')} className="hover:text-primary-theme font-medium">About Sourcing</button></li>
                <li><button onClick={() => { setAuthInitialStep('CANDIDATE_REG'); navigateToPage('Auth'); }} className="hover:text-primary-theme">Signup Free</button></li>
              </ul>
            </div>

            {/* Employer links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Enterprise Solutions</h4>
              <ul className="space-y-1.5 text-xs text-text-secondary-theme font-medium">
                <li><button onClick={() => navigateToPage('Pricing')} className="hover:text-primary-theme">Hiring Plans</button></li>
                <li><button onClick={() => navigateToPage('Why Us')} className="hover:text-primary-theme">Why TechnoAdviser</button></li>
                <li><button onClick={() => { setAuthInitialStep('EMPLOYER_REG'); navigateToPage('Auth'); }} className="hover:text-primary-theme font-semibold">Post Vacancy</button></li>
              </ul>
            </div>

            {/* Newsletter and help */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Subscribe to Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your business email"
                  className="bg-transparent border border-border-theme rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme placeholder-text-muted-theme font-semibold flex-1"
                />
                <button
                  onClick={() => addToast('Subscribed to corporate newsletter!', 'success')}
                  className="p-2.5 bg-primary-theme text-white rounded-xl hover:bg-primary-hover-theme transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-text-muted-theme font-semibold font-mono">
                <Phone className="w-3.5 h-3.5 text-primary-theme" /> +91 8490911181
              </div>
            </div>
          </div>

          {/* Subfooter */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-muted-theme font-semibold">
            <span>&copy; {currentYear} TechnoAdviser Technologies Pvt. Ltd. All rights reserved.</span>
            <div className="flex gap-4">
              <button onClick={() => navigateToPage('Privacy Policy')} className="hover:underline">Privacy Policy</button>
              <button onClick={() => navigateToPage('Privacy Policy')} className="hover:underline">Terms & Conditions</button>
              <button onClick={() => navigateToPage('Privacy Policy')} className="hover:underline">Cookies</button>
            </div>
          </div>
        </footer>
      )}

      {/* GDPR Cookie Consent Modal */}
      <AnimatePresence>
        {cookieConsent === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-2xl z-50 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-theme/10 text-primary-theme rounded-xl">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-text-primary-theme">We Value Your Privacy</h4>
                <p className="text-[11px] text-text-secondary-theme leading-relaxed">
                  TechnoAdviser uses cookies and verified credentials to optimize matching algorithms and secure portals against recruiter fraud.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setCookieConsent('declined');
                  addToast('Cookie tracking preferences disabled.', 'info');
                }}
                className="flex-1 py-2 border border-border-theme rounded-xl text-[11px] font-bold text-text-secondary-theme hover:bg-border-theme/40"
              >
                Reject All
              </button>
              <button
                onClick={() => {
                  setCookieConsent('accepted');
                  addToast('Cookie tracking preferences enabled.', 'success');
                }}
                className="flex-1 py-2 bg-primary-theme text-white rounded-xl text-[11px] font-bold hover:bg-primary-hover-theme shadow"
              >
                Accept All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
