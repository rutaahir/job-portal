/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, Users, Calendar, TrendingUp, ChevronDown, 
  MapPin, Clock, ArrowRight, Award, Sparkles, PieChart, BarChart3, LineChart
} from 'lucide-react';

interface EmpDashboardSectionProps {
  username: string;
  onNavigateToTab: (tabId: string) => void;
  onNavigateToAts: (applicantId: string) => void;
}

export default function EmpDashboardSection({ username, onNavigateToTab, onNavigateToAts }: EmpDashboardSectionProps) {
  const [subTab, setSubTab] = useState<'dashboard' | 'recruitment' | 'analytics'>('dashboard');
  const [timeRange, setTimeRange] = useState('This Month');

  // Interactive mock states
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredLinePoint, setHoveredLinePoint] = useState<number | null>(null);

  // Live database states
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const session = JSON.parse(localStorage.getItem('technoadviser_session') || '{}');
    const token = localStorage.getItem('technoadviser_token') || session.email;
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/jobs').then(res => res.ok ? res.json() : []),
      fetch('/api/applications', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.ok ? res.json() : [])
    ]).then(([jobsData, appsData]) => {
      if (Array.isArray(jobsData)) setJobs(jobsData);
      if (Array.isArray(appsData)) setApplications(appsData);
    }).catch(err => {
      console.error("Failed to load recruiter statistics:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const activeJobsCount = jobs.length;
  const totalApplicantsCount = applications.length;
  const interviewsCount = applications.filter(a => ['Interview', 'HR'].includes(a.status)).length;
  const hiresCount = applications.filter(a => ['Offer', 'Accepted', 'Joined'].includes(a.status)).length;

  // Core metrics
  const stats = [
    { label: 'Active Jobs', value: String(activeJobsCount), sub: 'Verification checks passed', icon: Briefcase, color: 'text-primary-theme bg-primary-theme/10 border-primary-theme/15' },
    { label: 'Total Applicants', value: String(totalApplicantsCount), sub: 'Matching resume pipelines', icon: Users, color: 'text-rose-500 bg-rose-500/10 border-rose-500/15' },
    { label: 'Interviews', value: String(interviewsCount), sub: 'Scheduled for video calls', icon: Calendar, color: 'text-amber-500 bg-amber-500/10 border-amber-500/15' },
    { label: 'Hires & Offers', value: String(hiresCount), sub: 'Secured hiring targets', icon: Award, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' },
  ];

  const screeningCount = applications.filter(a => ['Screening', 'Shortlisted'].includes(a.status)).length;
  const interviewCount = applications.filter(a => ['Interview', 'HR'].includes(a.status)).length;
  const offerCount = applications.filter(a => ['Offer'].includes(a.status)).length;
  const hiredCount = applications.filter(a => ['Accepted', 'Joined'].includes(a.status)).length;

  const funnelData = [
    { stage: 'Applied', count: String(totalApplicantsCount), pct: totalApplicantsCount > 0 ? '100%' : '0%', color: 'bg-primary-theme' },
    { stage: 'Screening', count: String(screeningCount), pct: totalApplicantsCount > 0 ? `${Math.round((screeningCount / totalApplicantsCount) * 100)}%` : '0%', color: 'bg-indigo-500' },
    { stage: 'Interview', count: String(interviewCount), pct: totalApplicantsCount > 0 ? `${Math.round((interviewCount / totalApplicantsCount) * 100)}%` : '0%', color: 'bg-violet-500' },
    { stage: 'Offered', count: String(offerCount), pct: totalApplicantsCount > 0 ? `${Math.round((offerCount / totalApplicantsCount) * 100)}%` : '0%', color: 'bg-amber-500' },
    { stage: 'Hired', count: String(hiredCount), pct: totalApplicantsCount > 0 ? `${Math.round((hiredCount / totalApplicantsCount) * 100)}%` : '0%', color: 'bg-emerald-500' },
  ];

  // Dynamically compute weekly applicant trends
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekData = daysOfWeek.map(day => {
    const count = applications.filter(a => {
      if (!a.appliedDate) return false;
      const date = new Date(a.appliedDate);
      return daysOfWeek[date.getDay()] === day;
    }).length;
    return { day, count };
  });

  const lineData = [
    { label: 'Week 1', value: Math.max(1, Math.round(totalApplicantsCount * 0.1)) },
    { label: 'Week 2', value: Math.max(2, Math.round(totalApplicantsCount * 0.3)) },
    { label: 'Week 3', value: Math.max(1, Math.round(totalApplicantsCount * 0.2)) },
    { label: 'Week 4', value: Math.max(3, Math.round(totalApplicantsCount * 0.4)) },
  ];

  const sourceData = totalApplicantsCount > 0 ? [
    { source: 'LinkedIn', percent: 50, color: '#0077B5' },
    { source: 'Direct Portal', percent: 30, color: '#2164F3' },
    { source: 'Referrals', percent: 20, color: '#10B981' }
  ] : [];

  const topOpenings = jobs.map(j => {
    const appCount = applications.filter(a => a.jobId === j.id || a.job?.id === j.id).length;
    return { title: j.title, applicants: appCount };
  }).sort((a, b) => b.applicants - a.applicants).slice(0, 4);

  const recentJobs = jobs.slice(0, 3).map(j => {
    const appCount = applications.filter(a => a.jobId === j.id || a.job?.id === j.id).length;
    let icon = '💼';
    const titleLower = j.title.toLowerCase();
    if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) icon = '🎨';
    else if (titleLower.includes('python') || titleLower.includes('backend') || titleLower.includes('django')) icon = '🐍';
    else if (titleLower.includes('react') || titleLower.includes('frontend')) icon = '⚛️';
    return {
      title: j.title,
      applicants: appCount,
      icon
    };
  });

  const upcomingInterviews = applications
    .filter(a => ['Interview', 'HR'].includes(a.status) && a.interviewSchedule)
    .map(a => {
      const name = a.candidate ? `${a.candidate.firstName || ''} ${a.candidate.lastName || ''}`.trim() : 'Candidate';
      return {
        name: name || 'Applicant',
        role: a.job?.title || 'Applied Position',
        time: a.interviewSchedule,
        avatar: a.candidate?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
      };
    });

  return (
    <div className="space-y-8">
      {/* Group Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme pb-5">
        <div>
          <h1 className="text-2xl font-serif font-black tracking-tight text-text-primary-theme flex items-center gap-2">
            TechnoAdviser <span className="text-primary-theme">Employer Suite</span>
          </h1>
          <p className="text-xs text-text-secondary-theme font-semibold">
            Interactive metrics dashboard matching your corporate recruiter guidelines.
          </p>
        </div>

        <div className="flex bg-surface-theme border border-border-theme p-1 rounded-xl shadow-inner">
          {[
            { id: 'dashboard', label: '1. Employer Dashboard', icon: BarChart3 },
            { id: 'recruitment', label: '2. Recruitment Overview', icon: LineChart },
            { id: 'analytics', label: '3. Hiring Analytics', icon: PieChart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-primary-theme text-white shadow-sm' 
                    : 'text-text-secondary-theme hover:text-text-primary-theme hover:bg-border-theme/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: MAIN EMPLOYER DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Welcome segment */}
          <div className="bg-gradient-to-r from-primary-theme/10 via-indigo-600/5 to-transparent p-6 rounded-3xl border border-primary-theme/10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent_40%)]" />
            <div className="space-y-1.5 z-10">
              <h2 className="text-xl font-black text-text-primary-theme flex items-center gap-2">
                Good Morning, {username} 👋
              </h2>
              <p className="text-xs text-text-secondary-theme font-medium">
                Here's what's happening with your hiring pipelines and match status checks today.
              </p>
            </div>
            <div className="flex items-center gap-2.5 z-10">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-500">Active Live Match Feed</span>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface-theme p-6 rounded-2xl border border-border-theme shadow-sm relative group hover:border-primary-theme/35 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-widest">{stat.label}</span>
                    <div className={`p-2 rounded-xl border ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-text-primary-theme font-mono">{stat.value}</h3>
                    <p className="text-[10px] text-text-secondary-theme font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {stat.sub}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Applicants Overview */}
            <div className="lg:col-span-8 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Applicants Overview</h3>
                  <p className="text-[10px] text-text-secondary-theme font-bold mt-0.5">
                    Daily breakdown of engineering submissions & match ratios.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-extrabold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+28% vs last week</span>
                </div>
              </div>

              {/* Hand-crafted elegant 3D Bar chart with Tooltips */}
              <div className="h-64 flex items-end justify-between gap-3 pt-6 px-4 border-b border-border-theme relative">
                {weekData.map((d, index) => {
                  const maxVal = Math.max(...weekData.map((item) => item.count));
                  const barHeight = `${(d.count / maxVal) * 85}%`;
                  const isHovered = hoveredBar === index;
                  
                  return (
                    <div 
                      key={d.day} 
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Interactive Tooltip bubble */}
                      <div className={`absolute bottom-[90%] left-1/2 -translate-x-1/2 bg-text-primary-theme text-white text-[9px] font-extrabold font-mono px-2 py-1 rounded-lg shadow-xl border border-border-theme transition-all duration-200 z-10 whitespace-nowrap pointer-events-none ${
                        isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'
                      }`}>
                        {d.count} Resumes
                      </div>

                      {/* 3D Visual Column Block */}
                      <div 
                        className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                          isHovered 
                            ? 'bg-gradient-to-t from-primary-theme to-indigo-500 shadow-lg shadow-primary-theme/20 scale-x-105' 
                            : 'bg-gradient-to-t from-primary-theme/70 to-primary-theme/90'
                        }`}
                        style={{ height: barHeight }}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-40 mix-blend-overlay" />
                      </div>

                      <span className="text-[10px] text-text-muted-theme font-black font-mono mt-3.5 pb-2">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Hiring Funnel */}
            <div className="lg:col-span-4 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider mb-1">Hiring Funnel</h3>
                <p className="text-[10px] text-text-secondary-theme font-bold leading-relaxed mb-6">
                  Conversion metrics of corporate applicants.
                </p>
              </div>

              {/* Stacked Funnel segments */}
              <div className="space-y-3 pb-4">
                {funnelData.map((step, index) => (
                  <div key={step.stage} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black">
                      <span className="text-text-primary-theme">{step.stage}</span>
                      <span className="text-text-secondary-theme font-mono">{step.count} ({step.pct})</span>
                    </div>
                    <div className="w-full bg-border-theme/40 h-3.5 rounded-full overflow-hidden shadow-inner relative flex items-center">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: step.pct }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full ${step.color} rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/15 opacity-30" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Grid: Recent Jobs & Upcoming Interviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Jobs list */}
            <div className="bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-theme/60">
                <div>
                  <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Recent Jobs</h3>
                  <p className="text-[10px] text-text-secondary-theme font-bold">Active requisitions posted recently.</p>
                </div>
                <button 
                  onClick={() => onNavigateToTab('jobs')}
                  className="text-xs font-black text-primary-theme hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3.5">
                {recentJobs.map((job) => (
                  <div key={job.title} className="flex items-center justify-between p-3 rounded-2xl bg-border-theme/20 border border-border-theme/40 hover:border-primary-theme/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm border border-border-theme/30">
                        {job.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-text-primary-theme">{job.title}</h4>
                        <p className="text-[10px] text-text-secondary-theme font-bold">Verification Badge Active</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-primary-theme font-mono">{job.applicants}</span>
                      <span className="text-[9px] block text-text-muted-theme font-semibold">Applicants</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-theme/60">
                <div>
                  <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Upcoming Interviews</h3>
                  <p className="text-[10px] text-text-secondary-theme font-bold">Next candidates lined up for live review.</p>
                </div>
                <button 
                  onClick={() => onNavigateToTab('interviews')}
                  className="text-xs font-black text-primary-theme hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Calendar <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3.5">
                {upcomingInterviews.map((cand) => (
                  <div 
                    key={cand.name} 
                    onClick={() => onNavigateToAts('cand-rohan')} // Rohan details is in ats
                    className="flex items-center justify-between p-3 rounded-2xl bg-border-theme/20 border border-border-theme/40 hover:border-primary-theme/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={cand.avatar} alt={cand.name} className="w-9 h-9 rounded-full object-cover border border-border-theme" />
                      <div>
                        <h4 className="text-xs font-black text-text-primary-theme">{cand.name}</h4>
                        <p className="text-[10px] text-text-secondary-theme font-medium">{cand.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] font-black text-text-primary-theme block">{cand.time}</span>
                        <span className="text-[9px] text-text-muted-theme font-semibold">Today</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: RECRUITMENT OVERVIEW */}
      {subTab === 'recruitment' && (
        <div className="space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-text-primary-theme uppercase tracking-widest">Recruitment Overview</h2>
              <p className="text-xs text-text-secondary-theme font-semibold">
                Overview of your complete organizational hiring performance.
              </p>
            </div>
            
            <div className="relative">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-surface-theme border border-border-theme px-4 py-2 pr-10 rounded-xl text-xs font-black focus:outline-none focus:border-primary-theme cursor-pointer"
              >
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary-theme absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dynamic Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Jobs Posted', value: String(activeJobsCount), color: 'bg-primary-theme text-white' },
              { label: 'Applicants', value: String(totalApplicantsCount), color: 'bg-surface-theme text-text-primary-theme border border-border-theme' },
              { label: 'Interviews', value: String(interviewsCount), color: 'bg-surface-theme text-text-primary-theme border border-border-theme' },
              { label: 'Offers', value: String(offerCount), color: 'bg-surface-theme text-text-primary-theme border border-border-theme' },
              { label: 'Hired', value: String(hiredCount), color: 'bg-surface-theme text-text-primary-theme border border-border-theme' },
            ].map((badge) => (
              <div key={badge.label} className={`p-4 rounded-2xl text-center space-y-1 shadow-sm ${badge.color}`}>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-80">{badge.label}</div>
                <div className="text-2xl font-black font-mono">{badge.value}</div>
              </div>
            ))}
          </div>

          {/* Line Chart & Top Openings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Applications Trend */}
            <div className="lg:col-span-8 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm space-y-6">
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Applications Trend</h3>
              
              {/* Hand-drawn premium SVG Line Chart representation with real interactivity */}
              <div className="h-64 pt-4 border-b border-border-theme relative flex flex-col justify-end">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#E5E7EB" strokeDasharray="3" className="stroke-border-theme/40" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#E5E7EB" strokeDasharray="3" className="stroke-border-theme/40" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#E5E7EB" strokeDasharray="3" className="stroke-border-theme/40" />

                  {/* Gradient Area */}
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-color, #E8702A)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="var(--primary-color, #E8702A)" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 50 160 L 150 120 L 250 145 L 350 70 L 450 100 L 450 200 L 50 200 Z" 
                    fill="url(#areaGrad)" 
                    className="transition-all duration-500"
                  />

                  {/* Main Line */}
                  <path 
                    d="M 50 160 L 150 120 L 250 145 L 350 70 L 450 100" 
                    fill="none" 
                    stroke="var(--primary-color, #E8702A)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />

                  {/* Nodes */}
                  {[
                    { cx: 50, cy: 160, val: 20 },
                    { cx: 150, cy: 120, val: 38 },
                    { cx: 250, cy: 145, val: 28 },
                    { cx: 350, cy: 70, val: 55 },
                    { cx: 450, cy: 100, val: 45 }
                  ].map((pt, idx) => {
                    const isHovered = hoveredLinePoint === idx;
                    return (
                      <g key={idx}>
                        <circle 
                          cx={pt.cx} 
                          cy={pt.cy} 
                          r={isHovered ? 7 : 5} 
                          fill="#FFFFFF" 
                          stroke="var(--primary-color, #E8702A)" 
                          strokeWidth="3"
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredLinePoint(idx)}
                          onMouseLeave={() => setHoveredLinePoint(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Legend Values */}
                <div className="flex justify-between text-[9px] text-text-muted-theme font-black font-mono pt-4 px-4 pb-2">
                  {lineData.map((d) => (
                    <span key={d.label}>{d.label}</span>
                  ))}
                </div>

                {/* Floating dynamic value tooltip */}
                {hoveredLinePoint !== null && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-text-primary-theme text-white text-[9px] font-extrabold font-mono px-3 py-1.5 rounded-lg border border-border-theme flex items-center gap-1.5 shadow-xl">
                    <Sparkles className="w-3.5 h-3.5 text-primary-theme fill-primary-theme" />
                    <span>Point Value: {lineData[hoveredLinePoint].value} Submissions</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Top Openings */}
            <div className="lg:col-span-4 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between">
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider mb-4">Top Openings</h3>
              
              <div className="space-y-4 flex-1">
                {topOpenings.map((job) => (
                  <div key={job.title} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary-theme">{job.title}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-border-theme/40 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-theme rounded-full" style={{ width: `${(job.applicants / 35) * 100}%` }} />
                      </div>
                      <span className="text-xs font-extrabold font-mono text-text-secondary-theme">{job.applicants}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigateToTab('jobs')}
                className="w-full text-center py-2.5 bg-border-theme/40 text-text-primary-theme font-black text-xs rounded-xl hover:bg-primary-theme hover:text-white transition-all mt-6 cursor-pointer"
              >
                View All Jobs
              </button>
            </div>

          </div>

          {/* Performance metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Time to Hire', value: '18 days', trend: '-10%', positive: true },
              { label: 'Offer Acceptance', value: '85%', trend: '+12%', positive: true },
              { label: 'Active Candidates', value: '104', trend: '+15%', positive: true },
              { label: 'Hiring Score', value: '92/100', trend: 'Excellent', positive: true },
            ].map((card) => (
              <div key={card.label} className="bg-surface-theme p-5 rounded-2xl border border-border-theme shadow-sm space-y-1">
                <span className="text-[9px] font-black text-text-muted-theme uppercase tracking-wider block">{card.label}</span>
                <div className="text-xl font-black text-text-primary-theme font-mono">{card.value}</div>
                <span className={`text-[10px] font-bold ${card.positive ? 'text-emerald-500' : 'text-rose-500'}`}>{card.trend}</span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW 3: HIRING ANALYTICS */}
      {subTab === 'analytics' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { label: 'Applicants', value: String(totalApplicantsCount), trend: '+24%', color: 'text-primary-theme' },
              { label: 'Interviews', value: String(interviewsCount), trend: '+16%', color: 'text-indigo-500' },
              { label: 'Offers', value: String(offerCount), trend: '+12%', color: 'text-amber-500' },
              { label: 'Hired', value: String(hiredCount), trend: '+10%', color: 'text-emerald-500' },
            ].map((metric) => (
              <div key={metric.label} className="bg-surface-theme p-6 rounded-2xl border border-border-theme shadow-sm space-y-2">
                <div className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider">{metric.label}</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-text-primary-theme font-mono">{metric.value}</span>
                  <span className="text-xs font-extrabold text-emerald-500">{metric.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Applications by Source */}
            <div className="lg:col-span-5 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider mb-1">Applications by Source</h3>
                <p className="text-[10px] text-text-secondary-theme font-semibold">Distribution of channels feeding candidate resumes.</p>
              </div>

              {/* Pie Source visual representation */}
              <div className="my-6 flex justify-center items-center">
                <div className="relative w-36 h-36 rounded-full border-8 border-primary-theme/15 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-black text-text-primary-theme font-mono">{totalApplicantsCount}</span>
                    <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {sourceData.map((src) => (
                  <div key={src.source} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                      <span className="text-text-primary-theme">{src.source}</span>
                    </div>
                    <span className="font-extrabold font-mono text-text-secondary-theme">{src.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Top Performing Jobs */}
            <div className="lg:col-span-7 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm space-y-6">
              <div>
                <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider mb-1">Top Performing Jobs</h3>
                <p className="text-[10px] text-text-secondary-theme font-semibold">Jobs with highest match and hiring metrics scores.</p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'UI/UX Designer', score: '85%' },
                  { title: 'Python Developer', score: '72%' },
                  { title: 'Product Manager', score: '65%' },
                  { title: 'Data Analyst', score: '60%' },
                ].map((job, idx) => (
                  <div key={job.title} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-text-primary-theme">{job.title}</span>
                      <span className="text-primary-theme font-mono">{job.score}</span>
                    </div>
                    <div className="w-full bg-border-theme/40 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: job.score }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="h-full bg-primary-theme rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
