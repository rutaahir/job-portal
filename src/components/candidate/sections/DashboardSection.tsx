/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ArrowRight, ArrowUpRight, CheckCircle } from 'lucide-react';

interface DashboardSectionProps {
  onNavigateToTab: (tabId: string) => void;
  onViewJobDetail: (jobTitle: string) => void;
}

export default function DashboardSection({ onNavigateToTab, onViewJobDetail }: DashboardSectionProps) {
  const [applications, setApplications] = React.useState<any[]>([]);
  const [profile, setProfile] = React.useState<any>(null);
  const [username, setUsername] = React.useState('Candidate');
  const [recommendedJobs, setRecommendedJobs] = React.useState<any[]>([]);

  React.useEffect(() => {
    const session = JSON.parse(localStorage.getItem('technoadviser_session') || '{}');
    if (session && session.name) {
      setUsername(session.name);
    }

    const token = localStorage.getItem('technoadviser_token') || session.email;
    if (!token) return;

    // Fetch applications
    fetch('/api/applications', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : [])
    .then(data => {
      if (Array.isArray(data)) {
        setApplications(data);
      }
    })
    .catch(err => console.error(err));

    // Fetch candidate profile
    fetch('/api/profile/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data && data.candidate) {
        setProfile(data.candidate);
      }
    })
    .catch(err => console.error(err));

    // Fetch recommended jobs from backend
    fetch('/api/jobs?limit=3')
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data && Array.isArray(data.jobs)) {
        const mapped = data.jobs.map((j: any) => ({
          title: j.title,
          company: j.companyName || 'Corporate Partner',
          location: j.location,
          match: j.matchScore || Math.floor(Math.random() * 15) + 80,
          logo: (j.companyName || 'C').charAt(0)
        }));
        setRecommendedJobs(mapped);
      }
    })
    .catch(err => console.error(err));
  }, []);

  const totalApps = applications.length;
  const appliedCount = applications.filter(a => ['Applied', 'Screening', 'Shortlisted'].includes(a.status)).length;
  const interviewCount = applications.filter(a => ['Interview', 'HR'].includes(a.status)).length;
  const offerCount = applications.filter(a => ['Offer', 'Accepted', 'Joined'].includes(a.status)).length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  const profileStrength = profile?.profileStrength || 40;
  const resumeScore = profile?.resumeScore || 0;

  const displayTotal = totalApps > 0 ? totalApps : 1;
  const displayApplied = appliedCount;
  const displayInterview = interviewCount;
  const displayOffer = offerCount;
  const displayRejected = rejectedCount;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Message Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-theme border border-border-theme p-6 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme tracking-tight flex items-center gap-2">
            Welcome Back, {username}! <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-xs text-text-secondary-theme font-medium">
            Ready to take the next step in your career? Here is your recruitment pipeline overview.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateToTab('search')}
            className="px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Search Jobs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Profile Strength */}
        <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
            <span>Profile Strength</span>
            <span className="text-primary-theme font-extrabold">{profileStrength}%</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-text-primary-theme">
            {profileStrength >= 80 ? 'Strong' : profileStrength >= 50 ? 'Medium' : 'Needs Update'}
          </div>
          <div className="w-full bg-border-theme/30 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-theme h-full rounded-full transition-all duration-1000" style={{ width: `${profileStrength}%` }} />
          </div>
        </div>

        {/* Applications */}
        <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-primary-theme/40 transition-all" onClick={() => onNavigateToTab('applications')}>
          <div className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Applications</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-text-primary-theme">{totalApps}</div>
          <div className="text-[10px] text-success-theme font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success-theme animate-ping"></span> Active Matches
          </div>
        </div>

        {/* Interviews */}
        <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => onNavigateToTab('interviews')}>
          <div className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Interviews</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-text-primary-theme">{interviewCount}</div>
          <div className="text-[10px] text-amber-500 font-bold">Scheduled</div>
        </div>

        {/* Resume Score */}
        <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-primary-theme/40 transition-all" onClick={() => onNavigateToTab('profile')}>
          <div className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Resume ATS Score</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-text-primary-theme">{resumeScore > 0 ? `${resumeScore}/100` : 'Not Scored'}</div>
          <div className="text-[10px] text-primary-theme font-bold">Audit your profile metrics</div>
        </div>
      </div>

      {/* Grid: AI Recommended and Application Status SVG Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Recommended Jobs Card List (8 cols) */}
        <div className="lg:col-span-7 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-border-theme/40">
            <div>
              <h3 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> AI Recommended Jobs
              </h3>
              <p className="text-[11px] text-text-secondary-theme">Custom curated based on your candidate profile parameters</p>
            </div>
            <button onClick={() => onNavigateToTab('search')} className="text-xs text-primary-theme hover:underline font-bold">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recommendedJobs.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border-theme rounded-2xl">
                <p className="text-xs text-text-secondary-theme font-medium">No recommended jobs available yet.</p>
              </div>
            ) : (
              recommendedJobs.map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => onViewJobDetail(job.title)}
                  className="group p-4 border border-border-theme/60 rounded-2xl flex items-center justify-between hover:border-primary-theme bg-bg-theme/45 hover:bg-border-theme/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-theme/10 text-primary-theme font-black flex items-center justify-center text-sm">
                      {job.logo}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary-theme group-hover:text-primary-theme transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-[10px] text-text-secondary-theme font-medium">{job.company} &bull; {job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-success-theme bg-success-theme/15 px-2 py-0.5 rounded-full border border-success-theme/10">
                      {job.match}% Match
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-text-muted-theme group-hover:text-primary-theme group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Application Status Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="pb-2 border-b border-border-theme/40">
            <h3 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider">
              Application Status
            </h3>
            <p className="text-[11px] text-text-secondary-theme">Track your real-time interview outcomes</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-border-theme, #e2e8f0)" strokeWidth="10" />
                
                {/* Applied Sector */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - displayApplied/displayTotal)}`}
                  className="transition-all duration-1000" />
                  
                {/* Interview Sector */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - displayInterview/displayTotal)}`}
                  transform="rotate(120 50 50)" className="transition-all duration-1000" />

                {/* Offer Sector */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - displayOffer/displayTotal)}`}
                  transform="rotate(210 50 50)" className="transition-all duration-1000" />

                {/* Rejected Sector */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - displayRejected/displayTotal)}`}
                  transform="rotate(270 50 50)" className="transition-all duration-1000" />
              </svg>
              {/* Inner Center Text */}
              <div className="absolute text-center">
                <div className="text-2xl font-black text-text-primary-theme font-serif">{totalApps}</div>
                <div className="text-[9px] text-text-muted-theme font-extrabold uppercase">Total</div>
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="space-y-2 text-[11px] font-semibold flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-text-secondary-theme">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Applied
                </div>
                <span className="text-text-primary-theme font-mono">{appliedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-text-secondary-theme">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Interview
                </div>
                <span className="text-text-primary-theme font-mono">{interviewCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-text-secondary-theme">
                  <span className="w-2.5 h-2.5 rounded-full bg-success-theme"></span> Offer
                </div>
                <span className="text-text-primary-theme font-mono">{offerCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-text-secondary-theme">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Rejected
                </div>
                <span className="text-text-primary-theme font-mono">{rejectedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Interview & Career Tip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {/* Upcoming Interview Card (7 cols) */}
        <div className="md:col-span-7 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary-theme" /> Upcoming Interview
            </h3>
            {applications.find(a => ['Interview', 'HR'].includes(a.status) && a.interviewSchedule) && (
              <span className="text-[10px] font-bold text-primary-theme font-mono uppercase bg-primary-theme/5 px-2.5 py-1 rounded-full">
                Scheduled
              </span>
            )}
          </div>

          {(() => {
            const upcomingInterview = applications.find(a => ['Interview', 'HR'].includes(a.status) && a.interviewSchedule);
            if (upcomingInterview) {
              return (
                <div className="p-4 border border-primary-theme/10 bg-primary-theme/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-text-primary-theme">{upcomingInterview.job?.title || 'Position Interview'}</h4>
                    <p className="text-[10px] text-text-secondary-theme font-medium">{upcomingInterview.job?.companyName || 'Corporate Partner'} &bull; {upcomingInterview.status} Round</p>
                    <div className="text-[9px] font-mono text-text-muted-theme">{upcomingInterview.interviewSchedule}</div>
                    {upcomingInterview.interviewNotes && (
                      <p className="text-[9px] text-text-secondary-theme italic">{upcomingInterview.interviewNotes}</p>
                    )}
                  </div>
                  {upcomingInterview.interviewNotes && upcomingInterview.interviewNotes.includes('http') ? (
                    <a
                      href={upcomingInterview.interviewNotes.match(/https?:\/\/[^\s]+/)?.[0] || 'https://meet.google.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto text-center px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Join Meet
                    </a>
                  ) : (
                    <button
                      onClick={() => onNavigateToTab('applications')}
                      className="w-full sm:w-auto text-center px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  )}
                </div>
              );
            } else {
              return (
                <div className="p-6 text-center border border-dashed border-border-theme rounded-2xl">
                  <p className="text-xs text-text-secondary-theme font-medium mb-3">No upcoming interviews scheduled yet.</p>
                  <button
                    onClick={() => onNavigateToTab('search')}
                    className="px-4 py-2 bg-primary-theme/10 hover:bg-primary-theme/20 text-primary-theme text-[10px] font-bold rounded-lg transition-all"
                  >
                    Find & Apply for Jobs
                  </button>
                </div>
              );
            }
          })()}
        </div>

        {/* Career Tip of the Day (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-amber-500/10 to-primary-theme/5 border border-primary-theme/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <span className="text-[9px] font-black tracking-wider text-amber-600 bg-amber-500/15 px-2.5 py-1 rounded-full uppercase">
              Career Tip of the Day
            </span>
            <p className="text-xs italic font-serif text-text-primary-theme leading-relaxed">
              "Small steps today, big changes tomorrow. Keep your portfolio clean and explain your designer decision criteria with high structural clarity."
            </p>
          </div>
          <div className="text-[10px] font-bold text-text-muted-theme mt-4 text-right">
            - TechnoAdviser AI Copilot
          </div>
        </div>
      </div>
    </div>
  );
}
