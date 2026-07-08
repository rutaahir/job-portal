/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, MapPin, Briefcase, Building2, ChevronRight, 
  TrendingUp, Sparkles, Star, ArrowRight, Code, 
  Palette, Megaphone, BarChart3, HelpCircle, Laptop, Headset,
  ArrowUpRight, ChevronLeft
} from 'lucide-react';

interface LandingProps {
  onNavigateToPage: (page: string, params?: any) => void;
  onSearchJobs: (keyword: string, location: string) => void;
}

export default function Landing({ onNavigateToPage, onSearchJobs }: LandingProps) {
  const [activeSearchTab, setActiveSearchTab] = useState<'jobs' | 'companies' | 'skills'>('jobs');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const popularSearches = ['UI/UX Designer', 'Developer', 'Marketing', 'Data Analyst', 'Product Manager'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchJobs(keyword, location);
  };

  const handlePopularSearch = (search: string) => {
    setKeyword(search);
    onSearchJobs(search, '');
  };

  // Staggered layout variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  // Standard category items
  const categories = [
    { id: 'design', label: 'Design & Creative', count: '1,245 Jobs', icon: Palette },
    { id: 'development', label: 'Development', count: '3,456 Jobs', icon: Code },
    { id: 'marketing', label: 'Marketing', count: '1,789 Jobs', icon: Megaphone },
    { id: 'datascience', label: 'Data Science', count: '987 Jobs', icon: BarChart3 },
    { id: 'business', label: 'Business', count: '2,341 Jobs', icon: Briefcase },
    { id: 'support', label: 'Customer Support', count: '1,152 Jobs', icon: Headset }
  ];

  const brandLogos = [
    <div key="google" className="flex items-center gap-0.5 font-sans font-bold text-base tracking-tight select-none mr-16 shrink-0">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </div>,
    <div key="microsoft" className="flex items-center gap-2 select-none mr-16 shrink-0">
      <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
        <div className="bg-[#F25022] w-1.5 h-1.5" />
        <div className="bg-[#7FBA00] w-1.5 h-1.5" />
        <div className="bg-[#00A4EF] w-1.5 h-1.5" />
        <div className="bg-[#FFB900] w-1.5 h-1.5" />
      </div>
      <span className="text-text-primary-theme font-sans font-semibold text-sm tracking-tight">Microsoft</span>
    </div>,
    <div key="amazon" className="flex flex-col items-center select-none relative pt-1 mr-16 shrink-0">
      <span className="text-text-primary-theme font-sans font-black text-sm italic leading-none tracking-tight">amazon</span>
      <svg className="w-10 h-1.5 text-[#E8702A] -mt-0.5" viewBox="0 0 100 20" fill="currentColor">
        <path d="M10,10 Q50,22 90,10 Q94,9 91,14 Q88,18 80,19 Q50,21 15,14 Z" />
      </svg>
    </div>,
    <div key="infosys" className="text-[#007CC3] font-sans font-extrabold italic text-base tracking-tight select-none mr-16 shrink-0">
      Infosys
    </div>,
    <div key="tcs" className="flex items-center select-none font-sans font-black text-sm text-[#1C354E] dark:text-white leading-none uppercase tracking-wider mr-16 shrink-0">
      <span>tcs</span>
      <span className="text-[7px] font-bold text-text-muted-theme lowercase tracking-normal ml-0.5">tata</span>
    </div>,
    <div key="wipro" className="flex items-center gap-1.5 select-none mr-16 shrink-0">
      <div className="relative w-4 h-4 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#E8702A] animate-spin [animation-duration:10s]" />
        <div className="w-2 h-2 rounded-full bg-blue-500" />
      </div>
      <span className="text-text-primary-theme font-sans font-bold text-xs tracking-tight">wipro</span>
    </div>,
    <div key="accenture" className="flex items-center font-sans font-black text-sm text-text-primary-theme tracking-tight select-none mr-16 shrink-0">
      <span>accenture</span>
      <span className="text-purple-600 font-extrabold text-base ml-0.5">&gt;</span>
    </div>,
    <div key="deloitte" className="flex items-center font-sans font-black text-sm text-text-primary-theme tracking-tight select-none mr-16 shrink-0">
      <span>Deloitte</span>
      <span className="text-[#86BC25] text-base font-extrabold ml-0.5">.</span>
    </div>
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full overflow-hidden bg-[#FAF9F6] dark:bg-[#12171C]"
    >
      {/* Inject custom styling for seamless infinite scrolling marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-scroll {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Soft warm background gradients */}
      <div className="absolute top-0 right-0 w-[50%] aspect-square rounded-full bg-[#E8702A]/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[45%] aspect-square rounded-full bg-secondary-theme/5 blur-[120px] pointer-events-none" />

      {/* FLOATING DEMO PORTAL BUTTON REPLICATED FROM THE MOCKUP */}
      <div className="absolute top-6 right-6 sm:right-8 md:right-12 z-30">
        <button
          onClick={() => onNavigateToPage('Auth')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/90 dark:bg-[#1B222A]/90 backdrop-blur border border-[#E8702A]/30 text-[#E8702A] text-xs font-black rounded-xl shadow-sm hover:bg-[#E8702A]/10 hover:scale-105 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8702A] fill-current" />
          <span>Demo Portal (Phase 2)</span>
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text and Form Column */}
          <div className="lg:col-span-7 flex flex-col space-y-8 z-10">
            
            {/* AI Pill Badge from Image */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 bg-[#E8702A]/10 rounded-full border border-[#E8702A]/20"
            >
              <Star className="w-3.5 h-3.5 text-[#E8702A] fill-[#E8702A]" />
              <span className="text-[10px] font-extrabold tracking-wider text-[#E8702A] uppercase font-sans">
                AI-POWERED JOB PLATFORM
              </span>
            </motion.div>

            {/* Heading exactly matching image typography & style */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-text-primary-theme leading-[1.12]">
                Find Jobs That <br />
                <span className="text-[#E8702A] relative inline-block">
                  Shape
                  <svg className="absolute left-0 -bottom-2 w-full h-2.5 text-[#E8702A]" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,7 C25,2 50,12 75,2 C88,-3 100,7 100,7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span> Your Future
              </h1>
              <p className="text-sm sm:text-base text-[#5A5850] dark:text-[#B5B2A8] max-w-xl font-medium leading-relaxed">
                Discover opportunities, connect with top companies and build the career you deserve with intelligent matching.
              </p>
            </motion.div>

            {/* High Fidelity Search Bar aligned with Mockup */}
            <motion.div variants={itemVariants} className="w-full">
              <div className="w-full bg-white dark:bg-[#1B222A] rounded-full border border-border-theme shadow-[0_15px_40px_rgba(20,41,61,0.06)] p-2">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-between gap-2">
                  <div className="w-full flex-1 flex items-center gap-3 pl-4">
                    <Search className="w-5 h-5 text-text-muted-theme" />
                    <input
                      type="text"
                      placeholder="Job title, skills or company"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full bg-transparent border-none text-text-primary-theme placeholder-text-muted-theme focus:outline-none text-xs font-bold py-1.5"
                    />
                  </div>

                  <div className="hidden md:block h-6 w-[1px] bg-border-theme shrink-0" />

                  <div className="w-full md:w-[200px] flex items-center gap-3 pl-3">
                    <MapPin className="w-5 h-5 text-text-muted-theme" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent border-none text-text-primary-theme placeholder-text-muted-theme focus:outline-none text-xs font-bold py-1.5"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto bg-[#E8702A] hover:bg-[#D5601E] text-white text-xs font-black py-3.5 px-8 rounded-full transition-all duration-200 shadow-lg shadow-[#E8702A]/20 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Search Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Popular Searches pill lists */}
              <div className="flex flex-wrap items-center gap-2.5 text-[11px] mt-4 pl-4">
                <span className="font-extrabold text-[#5A5850] dark:text-[#B5B2A8]">Popular Searches:</span>
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    type="button"
                    onClick={() => handlePopularSearch(search)}
                    className="px-3.5 py-1.5 bg-white dark:bg-[#1B222A] hover:bg-[#E8702A]/5 hover:text-[#E8702A] hover:border-[#E8702A]/30 text-[#5A5850] dark:text-[#B5B2A8] rounded-lg border border-border-theme/80 transition-all font-bold cursor-pointer"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Floating 3D Graphic Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[540px]" style={{ perspective: 1200 }}>
            
            {/* Orbital Rings Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-[#E8702A]/15 animate-spin [animation-duration:80s]" />
              <div className="absolute w-[340px] h-[340px] rounded-full bg-[#E8702A]/10 scale-[1.05] -z-10" />
            </div>

            {/* Main Avatar Character Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-[340px] h-[440px]"
            >
              {/* Rounded Elegant Avatar Background */}
              <div className="w-full h-full rounded-[45px] overflow-hidden bg-gradient-to-tr from-[#FAF9F6] to-[#E8702A]/20 border border-border-theme/80 shadow-[0_30px_70px_rgba(20,41,61,0.08)] relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="Professional applicant"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* FLOATING GLASS BADGE 1: AI Match Score */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05, rotateX: 6, rotateY: -6, z: 50, boxShadow: "0 25px 50px -12px rgba(232,112,42,0.15)" }}
                className="absolute top-6 -left-14 z-20 bg-white/90 dark:bg-[#1B222A]/90 backdrop-blur-md border border-white/20 dark:border-slate-800/40 rounded-[24px] p-4 w-[165px] shadow-[0_20px_45px_rgba(0,0,0,0.06)] flex flex-col gap-2 cursor-pointer transition-shadow"
              >
                <div className="text-[9px] text-[#5A5850] dark:text-[#B5B2A8] font-bold uppercase tracking-wider">
                  AI Match Score
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-text-primary-theme tracking-tight">96%</span>
                  {/* Real SVG sparkline graph */}
                  <svg className="w-16 h-8 text-[#E8702A]" viewBox="0 0 100 40" fill="none">
                    <path d="M5,32 Q25,28 45,14 T85,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="85" cy="5" r="3.5" fill="#E8702A" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#2E7D32] dark:text-[#5BAE5F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] dark:bg-[#5BAE5F] inline-block animate-ping" />
                  <span>Perfect Match</span>
                </div>
              </motion.div>

              {/* FLOATING GLASS BADGE 2: Jobs for You */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
                whileHover={{ scale: 1.05, rotateX: -6, rotateY: 6, z: 50, boxShadow: "0 25px 50px -12px rgba(232,112,42,0.15)" }}
                className="absolute top-16 -right-12 z-20 bg-white/90 dark:bg-[#1B222A]/90 backdrop-blur-md border border-white/20 dark:border-slate-800/40 rounded-[24px] p-4 w-[155px] shadow-[0_20px_45px_rgba(0,0,0,0.06)] flex flex-col gap-1.5 cursor-pointer transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#5A5850] dark:text-[#B5B2A8] font-bold uppercase">Jobs for You</span>
                  <div className="p-1.5 bg-[#E8702A]/10 text-[#E8702A] rounded-lg">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-text-primary-theme">24</div>
                <span className="text-[9px] text-[#5A5850] dark:text-[#B5B2A8] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8702A] inline-block" />
                  New matches
                </span>
              </motion.div>

              {/* FLOATING GLASS BADGE 3: Top Companies */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 1 }}
                whileHover={{ scale: 1.05, rotateX: 6, rotateY: 6, z: 50, boxShadow: "0 25px 50px -12px rgba(232,112,42,0.15)" }}
                className="absolute bottom-16 -left-12 z-20 bg-white/90 dark:bg-[#1B222A]/90 backdrop-blur-md border border-white/20 dark:border-slate-800/40 rounded-[24px] p-4 w-[160px] shadow-[0_20px_45px_rgba(0,0,0,0.06)] flex flex-col gap-1 cursor-pointer transition-shadow"
              >
                <div className="text-[9px] text-[#5A5850] dark:text-[#B5B2A8] font-bold uppercase tracking-wider">Top Companies</div>
                <div className="text-3xl font-black text-text-primary-theme">5K+</div>
                {/* Overlapping Candidate Avatars */}
                <div className="flex -space-x-2.5 mt-1">
                  <img className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1B222A] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="User" />
                  <img className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1B222A] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="User" />
                  <img className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1B222A] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="User" />
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1B222A] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-text-muted-theme select-none">+</div>
                </div>
              </motion.div>

              {/* FLOATING GLASS BADGE 4: Application Boost */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1.5 }}
                whileHover={{ scale: 1.05, rotateX: -6, rotateY: -6, z: 50, boxShadow: "0 25px 50px -12px rgba(232,112,42,0.15)" }}
                className="absolute bottom-20 -right-12 z-20 bg-white/90 dark:bg-[#1B222A]/90 backdrop-blur-md border border-white/20 dark:border-slate-800/40 rounded-[24px] p-4 w-[165px] shadow-[0_20px_45px_rgba(0,0,0,0.06)] flex flex-col gap-1.5 cursor-pointer transition-shadow"
              >
                <div className="text-[9px] text-[#5A5850] dark:text-[#B5B2A8] font-bold uppercase tracking-wider">Application Boost</div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-text-primary-theme">3x</span>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#2E7D32]">
                    <ArrowUpRight className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                </div>
                <span className="text-[9px] text-[#5A5850] dark:text-[#B5B2A8] font-bold">Higher response</span>
              </motion.div>

              {/* Floating Orbit Star details */}
              <div className="absolute -top-4 right-10 text-amber-500 animate-pulse z-20">
                <Star className="w-5 h-5 fill-current" />
              </div>

            </motion.div>

          </div>

        </div>
      </div>

      {/* TRUSTED COMPANIES BANNER ROW WITH SLIDER MARQUEE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white dark:bg-[#1B222A] rounded-3xl border border-border-theme p-4 shadow-[0_10px_30px_rgba(20,41,61,0.03)] flex items-center gap-4 relative overflow-hidden">
          
          {/* Left Navigation Arrow */}
          <button 
            type="button"
            onClick={() => onNavigateToPage('Find Jobs')}
            className="w-10 h-10 rounded-full border border-border-theme flex items-center justify-center text-text-muted-theme hover:text-[#E8702A] hover:border-[#E8702A]/30 transition-all shrink-0 cursor-pointer hover:bg-[#FAF9F6] dark:hover:bg-[#12171C]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center Content containing label and marquee track */}
          <div className="flex-1 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
            
            {/* Label Row */}
            <div className="shrink-0 text-center md:text-left">
              <span className="text-xs font-bold text-[#5A5850] dark:text-[#B5B2A8] leading-tight block">
                Trusted by leading <br />
                <span className="text-[#E8702A] font-black">companies</span> worldwide
              </span>
            </div>

            <div className="hidden md:block h-8 w-[1px] bg-border-theme shrink-0" />

            {/* Infinite scrolling track container with gradient edge overlays */}
            <div className="flex-1 overflow-hidden relative py-2 select-none before:absolute before:left-0 before:top-0 before:h-full before:w-16 before:bg-gradient-to-r before:from-white dark:before:from-[#1B222A] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-16 after:bg-gradient-to-l after:from-white dark:after:from-[#1B222A] after:to-transparent after:z-10">
              <div className="animate-marquee-scroll">
                <div className="flex items-center shrink-0">
                  {brandLogos}
                </div>
                <div className="flex items-center shrink-0">
                  {brandLogos}
                </div>
              </div>
            </div>

          </div>

          {/* Right Navigation Arrow */}
          <button 
            type="button"
            onClick={() => onNavigateToPage('Find Jobs')}
            className="w-10 h-10 rounded-full border border-border-theme flex items-center justify-center text-text-muted-theme hover:text-[#E8702A] hover:border-[#E8702A]/30 transition-all shrink-0 cursor-pointer hover:bg-[#FAF9F6] dark:hover:bg-[#12171C]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      </div>


      {/* CATEGORIES SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold tracking-widest text-[#E8702A] uppercase block">
              Explore Top Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-text-primary-theme">
              Browse Jobs by Category
            </h2>
            <p className="text-[#5A5850] dark:text-[#B5B2A8] text-sm font-medium">
              Explore top job categories and find the perfect role for your skills.
            </p>
          </div>

          <button
            onClick={() => onNavigateToPage('Find Jobs')}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-6 py-3 bg-[#14293D] dark:bg-[#1C354E] hover:bg-[#1F3E5C] text-white text-xs font-extrabold rounded-2xl transition-all shadow-md cursor-pointer hover:scale-[1.02]"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => onNavigateToPage('Find Jobs', { category: cat.id })}
                className="group bg-white dark:bg-[#1B222A] p-6 rounded-3xl border border-border-theme hover:border-[#E8702A]/40 shadow-sm hover:shadow-[0_15px_30px_rgba(232,112,42,0.04)] transition-all duration-300 flex items-start justify-between cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-2xl bg-[#E8702A]/8 flex items-center justify-center text-[#E8702A] group-hover:bg-[#E8702A] group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-text-primary-theme group-hover:text-[#E8702A] transition-colors duration-200">
                      {cat.label}
                    </h3>
                    <p className="text-text-muted-theme text-xs font-bold mt-1 font-mono">
                      {cat.count}
                    </p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="w-8 h-8 rounded-full border border-border-theme/80 group-hover:border-[#E8702A]/30 flex items-center justify-center text-text-muted-theme group-hover:text-[#E8702A] transition-all duration-300">
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* CALL TO ACTION SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-[#14293D] dark:bg-[#1B222A] text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,112,42,0.12),transparent_50%)] pointer-events-none" />
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold leading-tight">
              Ready to Shape Your Future Career?
            </h2>
            <p className="text-[#B5B2A8] font-medium text-xs sm:text-sm leading-relaxed">
              Join thousands of job seekers and world-class employers using TechnoAdviser to match skills, analyze resumes, and stream interviews.
              We establish high-fidelity screening questions to bypass manual filters safely.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
            <button
              onClick={() => onNavigateToPage('Auth', { target: 'CANDIDATE_REG' })}
              className="px-8 py-4 bg-[#E8702A] hover:bg-[#D5601E] text-white rounded-2xl font-extrabold text-xs transition-all shadow-lg shadow-[#E8702A]/20 text-center cursor-pointer hover:scale-[1.02]"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => onNavigateToPage('Auth', { target: 'EMPLOYER_REG' })}
              className="px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-white/10 rounded-2xl font-extrabold text-xs transition-all text-center cursor-pointer hover:scale-[1.02]"
            >
              Post a Job (Recruiter)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
