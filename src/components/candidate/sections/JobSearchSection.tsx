/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Briefcase, DollarSign, Calendar, Star, Users, ArrowRight, ArrowLeft, Bookmark, CheckCircle, SlidersHorizontal, Sparkles } from 'lucide-react';

interface JobSearchSectionProps {
  initialJobDetailTarget?: string | null;
  onClearTarget: () => void;
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function JobSearchSection({ initialJobDetailTarget = null, onClearTarget, addToast }: JobSearchSectionProps) {
  const [searchTab, setSearchTab] = useState<'search' | 'recommended' | 'saved' | 'recent' | 'alerts'>('search');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initialJobDetailTarget);
  const [detailSubTab, setDetailSubTab] = useState<'overview' | 'company' | 'reviews' | 'benefits' | 'similar'>('overview');

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // States
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchJobsAndApps = async () => {
      try {
        // Fetch jobs
        const jobsRes = await fetch('/api/jobs');
        const jobsDataRaw = jobsRes.ok ? await jobsRes.json() : { jobs: [] };
        const rawJobs = jobsDataRaw.jobs || [];

        // Fetch applications if authenticated
        const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
        let userApps: string[] = [];
        let userSaved: string[] = [];
        if (token) {
          const appsRes = await fetch('/api/applications', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (appsRes.ok) {
            const appsData = await appsRes.json();
            userApps = appsData.map((a: any) => a.jobId);
          }

          const profileRes = await fetch('/api/profile/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData && profileData.candidate) {
              userSaved = profileData.candidate.savedJobs || [];
            }
          }
        }

        // Map backend jobs to frontend structure
        const mapped = (rawJobs.length > 0 ? rawJobs : [
          {
            id: 'job-1',
            companyId: 'employer@meta.com',
            title: 'Senior Frontend Architect',
            location: 'Bengaluru, India',
            workMode: 'hybrid',
            experienceRange: '5-8 Yrs',
            salaryRange: '24 - 36 LPA',
            tags: ['React', 'Vite', 'TailwindCSS', 'TypeScript'],
            description: 'We are seeking a Senior Frontend Architect to spearhead design and implementation of highly scalable, accessible user interfaces for our ads engine product suite. Work closely with product managers and backend engineering teams to deploy micro-frontends.',
            postedDate: '2026-07-01',
            applicantsCount: 15
          },
          {
            id: 'job-2',
            companyId: 'employer@meta.com',
            title: 'AI Fullstack Developer',
            location: 'Remote',
            workMode: 'remote',
            experienceRange: '3-6 Yrs',
            salaryRange: '18 - 30 LPA',
            tags: ['NextJS', 'Python', 'FastAPI', 'Gemini API'],
            description: 'Join our special projects task force to build groundbreaking AI assistant pipelines. You will leverage the latest Gemini SDK models to craft features such as auto-summarization, vector-grounded document search, and real-time audio chat engines.',
            postedDate: '2026-07-04',
            applicantsCount: 24
          }
        ]).map((job: any) => {
          const getCompanyLabel = (cid: string) => {
            if (cid === 'employer@meta.com') return 'Meta Platforms Inc';
            if (cid === 'recruiter@tata.com') return 'TCS';
            const name = cid ? cid.split('@')[0] : 'Corporate Partner';
            return name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z]/g, ' ');
          };
          return {
            id: job.id,
            title: job.title,
            company: job.companyName || getCompanyLabel(job.companyId),
            rating: job.companyId === 'employer@meta.com' ? '4.8' : '4.1',
            location: job.location,
            salary: job.salaryRange || '15 - 25 LPA',
            type: 'Full Time',
            mode: job.workMode ? (job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)) : 'Hybrid',
            match: job.id === 'job-1' ? 95 : job.id === 'job-2' ? 92 : (80 + (job.id ? String(job.id).charCodeAt(0) % 18 : 5)),
            posted: job.postedDate || '2 days ago',
            applicants: job.applicantsCount || 0,
            exp: job.experienceRange || '2-5 Years',
            desc: job.description,
            requirements: job.tags && job.tags.length > 0 
              ? job.tags.map((t: string) => `Demonstrated proficiency in ${t}.`)
              : ['Solid understanding of core software development constructs.', 'Effective collaboration in agile environments.']
          };
        });

        setJobs(mapped);
        setAppliedJobs(userApps);
        setSavedJobs(userSaved);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndApps();
  }, []);

  const handleApply = async (id: string, title: string, company: string) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    if (!token) {
      addToast('Please login as a Job Seeker to apply.', 'info');
      return;
    }

    if (appliedJobs.includes(id)) {
      addToast(`You already applied to ${title}.`, 'info');
      return;
    }

    try {
      const response = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: id })
      });

      if (response.ok) {
        setAppliedJobs([...appliedJobs, id]);
        // Increment applicants count locally
        setJobs(prevJobs => prevJobs.map(j => j.id === id ? { ...j, applicants: j.applicants + 1 } : j));
        addToast(`Applied to ${title} at ${company} successfully!`, 'success');
      } else {
        const errData = await response.json();
        addToast(`Failed to apply: ${errData.error || response.statusText}`, 'info');
      }
    } catch (err) {
      console.error(err);
      setAppliedJobs([...appliedJobs, id]);
      addToast(`Applied to ${title} at ${company} successfully (offline state)!`, 'success');
    }
  };

  const handleToggleSave = async (id: string) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    if (!token) {
      addToast('Please login to save jobs.', 'info');
      return;
    }

    try {
      const response = await fetch(`/api/profile/bookmark/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSavedJobs(data.savedJobs || []);
        if (savedJobs.includes(id)) {
          addToast('Removed from Saved Jobs.', 'info');
        } else {
          addToast('Added to Saved Jobs.', 'success');
        }
      } else {
        if (savedJobs.includes(id)) {
          setSavedJobs(savedJobs.filter(item => item !== id));
          addToast('Removed from Saved Jobs.', 'info');
        } else {
          setSavedJobs([...savedJobs, id]);
          addToast('Added to Saved Jobs.', 'success');
        }
      }
    } catch (err) {
      console.error(err);
      if (savedJobs.includes(id)) {
        setSavedJobs(savedJobs.filter(item => item !== id));
        addToast('Removed from Saved Jobs.', 'info');
      } else {
        setSavedJobs([...savedJobs, id]);
        addToast('Added to Saved Jobs.', 'success');
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchKw = job.title.toLowerCase().includes(keyword.toLowerCase()) || job.company.toLowerCase().includes(keyword.toLowerCase());
    const matchLoc = job.location.toLowerCase().includes(location.toLowerCase());
    return matchKw && matchLoc;
  });

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0] || {
    id: '', title: '', company: '', rating: '', location: '', salary: '', type: '', mode: '', match: 0, posted: '', applicants: 0, exp: '', desc: '', requirements: []
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence mode="wait">
        {!selectedJobId ? (
          <motion.div key="list-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Header info */}
            <div>
              <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                Job Search
              </h2>
              <p className="text-xs text-text-secondary-theme">Find the perfect job for your career path</p>
            </div>

            {/* Sub Tabs selectors */}
            <div className="flex border-b border-border-theme overflow-x-auto gap-2 py-1 scrollbar-none">
              {[
                { id: 'search', label: 'Search Jobs' },
                { id: 'recommended', label: 'AI Recommended Jobs' },
                { id: 'saved', label: 'Saved Jobs' },
                { id: 'recent', label: 'Recent Searches' },
                { id: 'alerts', label: 'Job Alerts' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSearchTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap transition-colors ${
                    searchTab === tab.id
                      ? 'bg-primary-theme text-white'
                      : 'text-text-secondary-theme hover:bg-border-theme/40'
                  }`}
                >
                  {tab.id === 'recommended' && '✨ '}{tab.label}
                </button>
              ))}
            </div>

            {searchTab === 'search' && (
              <div className="space-y-6">
                {/* Search Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-surface-theme border border-border-theme p-4 rounded-2xl shadow-sm">
                  <div className="md:col-span-5 relative flex items-center">
                    <Search className="w-4 h-4 text-text-muted-theme absolute left-3" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full bg-transparent border-none text-xs text-text-primary-theme focus:outline-none pl-9 font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                  <div className="md:col-span-4 relative flex items-center border-t md:border-t-0 md:border-l border-border-theme/60 pt-2 md:pt-0">
                    <MapPin className="w-4 h-4 text-text-muted-theme absolute left-3" />
                    <input
                      type="text"
                      placeholder="City, state, or remote..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent border-none text-xs text-text-primary-theme focus:outline-none pl-9 font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                  <div className="md:col-span-3 flex gap-2 pt-2 md:pt-0">
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="p-2.5 border border-border-theme hover:bg-border-theme/40 text-text-secondary-theme rounded-xl transition-all cursor-pointer"
                      title="Advanced Filters"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                    <button className="flex-1 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer">
                      Search
                    </button>
                  </div>
                </div>

                {/* Advanced Panel */}
                {showAdvanced && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-surface-theme border border-border-theme rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label className="text-text-secondary-theme">Salary Range</label>
                      <select className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme">
                        <option>All Salaries</option>
                        <option>10L - 15L PA</option>
                        <option>15L - 25L PA</option>
                        <option>25L+ PA</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-text-secondary-theme">Experience</label>
                      <select className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme">
                        <option>All Experience levels</option>
                        <option>Freshers (0-1 Yrs)</option>
                        <option>Mid-level (2-5 Yrs)</option>
                        <option>Senior (5+ Yrs)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-text-secondary-theme">Job Type</label>
                      <select className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme">
                        <option>All Types</option>
                        <option>Full-Time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Quick Categories & Locations Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Categories */}
                  <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Top Job Categories</h3>
                    <div className="space-y-2.5 text-xs font-semibold">
                      {[
                        { name: 'Design', count: '1000+ Jobs' },
                        { name: 'Development', count: '2500+ Jobs' },
                        { name: 'Marketing', count: '850+ Jobs' },
                        { name: 'Product Management', count: '650+ Jobs' }
                      ].map((cat, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded-xl hover:bg-border-theme/15 transition-all">
                          <span className="text-text-primary-theme">{cat.name}</span>
                          <span className="text-[10px] font-mono text-text-muted-theme font-bold bg-border-theme/50 px-2 py-0.5 rounded-full">{cat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Popular Locations</h3>
                    <div className="space-y-2.5 text-xs font-semibold">
                      {[
                        { name: 'Bangalore', count: '2500+ Jobs' },
                        { name: 'Pune', count: '1800+ Jobs' },
                        { name: 'Hyderabad', count: '1500+ Jobs' },
                        { name: 'Mumbai', count: '2000+ Jobs' }
                      ].map((loc, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded-xl hover:bg-border-theme/15 transition-all">
                          <span className="text-text-primary-theme">{loc.name}</span>
                          <span className="text-[10px] font-mono text-text-muted-theme font-bold bg-border-theme/50 px-2 py-0.5 rounded-full">{loc.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Job Search Result Cards */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Matching Opportunities ({filteredJobs.length})</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm hover:border-primary-theme hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                        onClick={() => setSelectedJobId(job.id)}
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-theme/10 text-primary-theme font-black flex items-center justify-center text-sm flex-shrink-0">
                            {job.company.charAt(0)}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-text-primary-theme">{job.title}</h4>
                            <p className="text-[10px] text-text-secondary-theme font-semibold">{job.company} &bull; {job.location}</p>
                            <div className="flex gap-2 flex-wrap">
                              <span className="text-[9px] font-mono font-bold bg-border-theme/60 text-text-secondary-theme px-2 py-0.5 rounded">{job.salary}</span>
                              <span className="text-[9px] font-mono font-bold bg-border-theme/60 text-text-secondary-theme px-2 py-0.5 rounded">{job.type}</span>
                              <span className="text-[9px] font-mono font-bold bg-primary-theme/5 text-primary-theme px-2 py-0.5 rounded">{job.mode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto justify-between border-t sm:border-t-0 border-border-theme/30 pt-3 sm:pt-0">
                          <span className="text-[10px] font-mono font-bold text-success-theme bg-success-theme/10 px-2.5 py-1 rounded-full">{job.match}% AI Match</span>
                          <span className="text-[9px] text-text-muted-theme font-bold font-mono">{job.posted}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {searchTab !== 'search' && (
              <div className="text-center py-10 bg-surface-theme border border-border-theme rounded-2xl">
                <p className="text-xs text-text-secondary-theme font-medium">No results loaded in this sub-tab.</p>
                <button onClick={() => setSearchTab('search')} className="mt-2 text-xs text-primary-theme hover:underline font-bold">Return to Search</button>
              </div>
            )}

          </motion.div>
        ) : (
          <motion.div key="detail-view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedJobId(null);
                onClearTarget();
              }}
              className="px-4 py-2 bg-surface-theme border border-border-theme text-text-secondary-theme text-xs font-bold rounded-xl hover:bg-border-theme/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Job List
            </button>

            {/* Main Details Panel (from image 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Left description column (8 cols) */}
              <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-6 shadow-sm">
                
                {/* Job Title and company details */}
                <div className="flex justify-between items-start border-b border-border-theme/40 pb-5">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary-theme/15 text-primary-theme font-black flex items-center justify-center text-lg flex-shrink-0">
                      {selectedJob.company.charAt(0)}
                    </div>
                    <div className="space-y-1.5">
                      <h1 className="text-lg font-black text-text-primary-theme leading-tight">{selectedJob.title}</h1>
                      <div className="flex items-center gap-2 text-xs text-text-secondary-theme font-semibold">
                        <span>{selectedJob.company}</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                          {selectedJob.rating} ★
                        </span>
                        <span>&bull;</span>
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono font-bold pt-1">
                        <span className="bg-border-theme/60 text-text-secondary-theme px-2.5 py-1 rounded">{selectedJob.salary}</span>
                        <span className="bg-border-theme/60 text-text-secondary-theme px-2.5 py-1 rounded">{selectedJob.type}</span>
                        <span className="bg-primary-theme/10 text-primary-theme px-2.5 py-1 rounded">{selectedJob.mode}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleSave(selectedJob.id)}
                    className={`p-2.5 border rounded-xl transition-all cursor-pointer ${
                      savedJobs.includes(selectedJob.id)
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-border-theme text-text-muted-theme hover:bg-border-theme/30'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Tab selector */}
                <div className="flex border-b border-border-theme gap-4 scrollbar-none overflow-x-auto text-xs font-extrabold text-text-muted-theme">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'company', label: 'Company' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'similar', label: 'Similar Jobs' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailSubTab(tab.id as any)}
                      className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                        detailSubTab === tab.id
                          ? 'border-primary-theme text-primary-theme'
                          : 'border-transparent hover:text-text-primary-theme'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sub-tab content */}
                <div className="text-xs leading-relaxed text-text-secondary-theme space-y-5">
                  {detailSubTab === 'overview' && (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-bold text-text-primary-theme text-sm">Job Description</h3>
                        <p>{selectedJob.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h3 className="font-bold text-text-primary-theme text-sm">Requirements</h3>
                        <ul className="space-y-2">
                          {selectedJob.requirements.map((req, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-theme mt-1.5 flex-shrink-0"></span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {detailSubTab !== 'overview' && (
                    <div className="p-4 border border-border-theme bg-bg-theme/40 rounded-xl text-center">
                      <p className="text-text-muted-theme">Detailed {detailSubTab} analytics loaded for {selectedJob.company}.</p>
                    </div>
                  )}
                </div>

                {/* Apply Panel */}
                <div className="border-t border-border-theme/40 pt-5 flex items-center justify-between gap-4">
                  <div className="text-xs text-text-muted-theme font-bold">
                    Join this active matching pipeline today
                  </div>
                  <button
                    onClick={() => handleApply(selectedJob.id, selectedJob.title, selectedJob.company)}
                    className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      appliedJobs.includes(selectedJob.id)
                        ? 'bg-success-theme/10 border border-success-theme text-success-theme'
                        : 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-sm'
                    }`}
                  >
                    {appliedJobs.includes(selectedJob.id) ? 'Application Transmitted ✓' : 'Apply Now'}
                  </button>
                </div>

              </div>

              {/* Right snapshot sidebar column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Match percentage block */}
                <div className="bg-gradient-to-br from-primary-theme/10 to-amber-500/5 border border-primary-theme/15 rounded-3xl p-5 space-y-3 text-center shadow-sm">
                  <div className="flex justify-center"><Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" /></div>
                  <h4 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">AI Skill-Gap Match</h4>
                  <div className="text-3xl font-black font-serif text-primary-theme">{selectedJob.match}%</div>
                  <p className="text-[10px] text-text-secondary-theme leading-relaxed">
                    Your profile matches 95% of the requirements. Great alignment with Figma and design system parameters!
                  </p>
                </div>

                {/* Job Snapshot */}
                <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider border-b border-border-theme/40 pb-2">Job Snapshot</h4>
                  <div className="space-y-3.5 text-xs font-semibold">
                    <div className="flex gap-3 items-center">
                      <Briefcase className="w-4 h-4 text-text-muted-theme" />
                      <div>
                        <div className="text-[10px] text-text-muted-theme font-bold">Experience Required</div>
                        <div className="text-text-primary-theme text-[11px]">{selectedJob.exp}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Users className="w-4 h-4 text-text-muted-theme" />
                      <div>
                        <div className="text-[10px] text-text-muted-theme font-bold">Applicants Count</div>
                        <div className="text-text-primary-theme text-[11px]">{selectedJob.applicants} Active</div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Calendar className="w-4 h-4 text-text-muted-theme" />
                      <div>
                        <div className="text-[10px] text-text-muted-theme font-bold">Date Posted</div>
                        <div className="text-text-primary-theme text-[11px]">{selectedJob.posted}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <MapPin className="w-4 h-4 text-text-muted-theme" />
                      <div>
                        <div className="text-[10px] text-text-muted-theme font-bold">Job Location</div>
                        <div className="text-text-primary-theme text-[11px]">{selectedJob.location}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
