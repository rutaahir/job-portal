/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, SlidersHorizontal, Check, RefreshCw, Star, Flame, Sparkles } from 'lucide-react';
import { Job } from '../../../types';

interface PublicJobSearchProps {
  onViewJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  appliedJobIds: string[];
  jobs?: Job[];
}

export default function PublicJobSearch({ onViewJob, onApplyJob, appliedJobIds, jobs }: PublicJobSearchProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('Any');
  const [jobTypes, setJobTypes] = useState<string[]>(['Full Time', 'Part Time', 'Contract', 'Internship']);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'remote' | 'early' | 'urgent'>('all');
  const [sortBy, setSortBy] = useState('relevant');

  const toggleJobType = (type: string) => {
    setJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setExperience('Any');
    setJobTypes(['Full Time', 'Part Time', 'Contract', 'Internship']);
    setMinSalary('');
    setMaxSalary('');
    setActiveFilter('all');
  };

  const jobsToUse = jobs || [];

  // Filters calculation
  const filteredJobs = jobsToUse.filter((job) => {
    // Keyword match
    const matchesKeyword = !keyword || 
      job.title.toLowerCase().includes(keyword.toLowerCase()) || 
      job.companyName.toLowerCase().includes(keyword.toLowerCase()) || 
      job.tags.some(t => t.toLowerCase().includes(keyword.toLowerCase()));

    // Location match
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());

    // Experience match
    let matchesExp = true;
    if (experience !== 'Any') {
      const expNum = parseInt(job.experienceRange.split('-')[0] || '0');
      if (experience === 'Entry' && expNum > 2) matchesExp = false;
      if (experience === 'Mid' && (expNum < 2 || expNum > 5)) matchesExp = false;
      if (experience === 'Senior' && expNum < 5) matchesExp = false;
    }

    // Workmode filter shortcut
    let matchesActiveFilter = true;
    if (activeFilter === 'remote' && job.workMode !== 'remote') matchesActiveFilter = false;
    if (activeFilter === 'early' && job.applicantsCount && job.applicantsCount > 20) matchesActiveFilter = false;
    if (activeFilter === 'urgent' && !job.featured) matchesActiveFilter = false;

    // Salary range match
    let matchesSalary = true;
    const parsedMaxSalary = parseInt(job.salaryRange.split('-')[1]?.replace(/[^0-9]/g, '') || '999');
    const parsedMinSalary = parseInt(job.salaryRange.split('-')[0]?.replace(/[^0-9]/g, '') || '0');
    if (minSalary && parsedMinSalary < parseInt(minSalary)) matchesSalary = false;
    if (maxSalary && parsedMaxSalary > parseInt(maxSalary)) matchesSalary = false;

    return matchesKeyword && matchesLocation && matchesExp && matchesActiveFilter && matchesSalary;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const followedList = JSON.parse(localStorage.getItem('technoadviser_followed_companies') || '[]');
    const aFollowed = followedList.includes(a.companyName);
    const bFollowed = followedList.includes(b.companyName);

    if (aFollowed && !bFollowed) return -1;
    if (!aFollowed && bFollowed) return 1;

    if (sortBy === 'highest') {
      const aSal = parseInt(a.salaryRange.split('-')[1]?.replace(/[^0-9]/g, '') || '0');
      const bSal = parseInt(b.salaryRange.split('-')[1]?.replace(/[^0-9]/g, '') || '0');
      return bSal - aSal;
    }
    if (sortBy === 'newest') {
      const aTime = isNaN(Date.parse(a.postedDate)) ? 0 : new Date(a.postedDate).getTime();
      const bTime = isNaN(Date.parse(b.postedDate)) ? 0 : new Date(b.postedDate).getTime();
      return bTime - aTime;
    }
    const aFeat = a.featured ? 1 : 0;
    const bFeat = b.featured ? 1 : 0;
    return bFeat - aFeat;
  });

  // Recommended Sidebar Data dynamically created from the real database records
  const recommendations = jobsToUse.slice(0, 3).map((j, idx) => ({
    id: j.id || `rec-${idx}`,
    title: j.title,
    company: j.companyName || 'Corporate Partner',
    location: j.location,
    salary: j.salaryRange,
    exp: j.experienceRange,
    mode: j.workMode,
    logo: (j.companyName || 'C').charAt(0)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Left Sidebar Filters (4 cols on large) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-border-theme pb-3.5">
            <h3 className="text-xs font-black uppercase text-text-primary-theme tracking-wide flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary-theme" />
              Search Filters
            </h3>
            <button
              onClick={handleReset}
              className="text-[10px] font-bold text-primary-theme hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Keyword Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-secondary-theme">Keywords</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. UX Designer"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-bg-theme border border-border-theme rounded-xl px-3 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-medium placeholder-text-muted-theme"
              />
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-text-muted-theme" />
            </div>
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-secondary-theme">Location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-bg-theme border border-border-theme rounded-xl px-3 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-medium placeholder-text-muted-theme"
              />
              <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-text-muted-theme" />
            </div>
          </div>

          {/* Experience level */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-secondary-theme">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-bg-theme border border-border-theme rounded-xl px-3 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-bold cursor-pointer"
            >
              <option value="Any">Any Experience</option>
              <option value="Entry">Entry Level (0-2 Yrs)</option>
              <option value="Mid">Mid-Senior (2-5 Yrs)</option>
              <option value="Senior">Senior Level (5+ Yrs)</option>
            </select>
          </div>

          {/* Job Type Checkboxes */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold text-text-secondary-theme">Job Type</label>
            <div className="space-y-2">
              {['Full Time', 'Part Time', 'Contract', 'Internship'].map((type) => (
                <label key={type} className="flex items-center gap-2.5 text-xs text-text-secondary-theme font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobTypes.includes(type)}
                    onChange={() => toggleJobType(type)}
                    className="accent-primary-theme rounded border-border-theme h-4 w-4"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Salary Budget Fields */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-secondary-theme">Salary Range (LPA)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Salary"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full bg-bg-theme border border-border-theme rounded-xl px-2.5 py-2 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-mono font-bold"
              />
              <input
                type="number"
                placeholder="Max Salary"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                className="w-full bg-bg-theme border border-border-theme rounded-xl px-2.5 py-2 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-mono font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Main Feed (6 cols on large) */}
      <div className="lg:col-span-6 space-y-6">
        {/* Horizontal Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-primary-theme text-white shadow'
                : 'bg-surface-theme text-text-secondary-theme border border-border-theme hover:border-text-muted-theme'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setActiveFilter('remote')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'remote'
                ? 'bg-primary-theme text-white shadow'
                : 'bg-surface-theme text-text-secondary-theme border border-border-theme hover:border-text-muted-theme'
            }`}
          >
            Remote
          </button>
          <button
            onClick={() => setActiveFilter('early')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'early'
                ? 'bg-primary-theme text-white shadow'
                : 'bg-surface-theme text-text-secondary-theme border border-border-theme hover:border-text-muted-theme'
            }`}
          >
            Early Applicant
          </button>
          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'urgent'
                ? 'bg-primary-theme text-white shadow'
                : 'bg-surface-theme text-text-secondary-theme border border-border-theme hover:border-text-muted-theme'
            }`}
          >
            Urgently Hiring
          </button>
        </div>

        {/* Counter and sorting */}
        <div className="flex justify-between items-center bg-surface-theme border border-border-theme rounded-2xl px-4 py-2.5">
          <span className="text-[11px] font-extrabold text-text-secondary-theme font-mono">
            {filteredJobs.length} Positions Matching
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted-theme font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-[11px] text-text-primary-theme font-bold cursor-pointer focus:outline-none"
            >
              <option value="relevant">Most Relevant</option>
              <option value="highest">Highest Salary</option>
              <option value="newest">Newest first</option>
            </select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-surface-theme border border-border-theme rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <p className="text-text-secondary-theme text-xs font-medium">
                No matching open positions found. Try expanding your search queries or clearing active filters.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-primary-theme text-white rounded-full text-xs font-bold shadow hover:bg-primary-hover-theme transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            sortedJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <motion.div
                  key={job.id}
                  layoutId={`job-card-${job.id}`}
                  className="bg-surface-theme border border-border-theme rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="flex gap-4 items-start">
                    {/* Logo */}
                    <div 
                      onClick={() => onViewJob(job)}
                      className="w-12 h-12 rounded-2xl bg-primary-theme/5 text-primary-theme border border-primary-theme/10 flex items-center justify-center font-black text-base flex-shrink-0 cursor-pointer"
                    >
                      {job.companyName.charAt(0)}
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          onClick={() => onViewJob(job)}
                          className="text-sm font-extrabold text-text-primary-theme hover:text-primary-theme transition-colors cursor-pointer truncate"
                        >
                          {job.title}
                        </h3>
                        {job.featured && (
                          <span className="bg-primary-theme/10 text-primary-theme text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-primary-theme/5">
                            <Flame className="w-2.5 h-2.5 fill-current" /> Hot
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-secondary-theme font-medium">
                        <span className="font-bold text-text-primary-theme flex items-center gap-1.5">
                          {job.companyName}
                          {JSON.parse(localStorage.getItem('technoadviser_followed_companies') || '[]').includes(job.companyName) && (
                            <span className="bg-success-theme/10 text-success-theme text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                              Followed
                            </span>
                          )}
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1 capitalize">
                          <Briefcase className="w-3 h-3" /> {job.workMode}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-border-theme/30 text-text-secondary-theme text-[9px] font-bold rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions / Bottom section */}
                  <div className="flex items-center justify-between mt-4 border-t border-border-theme/40 pt-4.5">
                    <div className="leading-none">
                      <span className="text-[9px] text-text-muted-theme font-bold uppercase block tracking-wider">Salary Band</span>
                      <span className="text-xs font-black text-text-primary-theme font-mono">{job.salaryRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewJob(job)}
                        className="px-3.5 py-2 border border-border-theme hover:bg-border-theme/20 rounded-xl text-[10px] font-bold text-text-secondary-theme cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onApplyJob(job)}
                        disabled={isApplied}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-tight transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-success-theme/10 text-success-theme border border-success-theme/20 cursor-default'
                            : 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-sm'
                        }`}
                      >
                        {isApplied ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Applied
                          </span>
                        ) : (
                          'Easy Apply'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Right Sidebar Recommendations (3 cols on large) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 shadow-sm space-y-4.5">
          <div className="border-b border-border-theme pb-3 flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-text-primary-theme tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-theme animate-pulse" />
              Recommended for You
            </h4>
          </div>

          <div className="space-y-3.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-bg-theme border border-border-theme/50 rounded-2xl p-4 hover:border-primary-theme/35 hover:shadow-sm transition-all cursor-pointer group"
                onClick={() => {
                  const matchingJob = jobsToUse.find(j => j.title === rec.title) || jobsToUse[0];
                  onViewJob(matchingJob);
                }}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-primary-theme/10 text-primary-theme flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    {rec.logo}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h5 className="text-xs font-extrabold text-text-primary-theme group-hover:text-primary-theme transition-colors truncate">
                      {rec.title}
                    </h5>
                    <div className="text-[10px] text-text-muted-theme font-bold truncate">
                      {rec.company} &middot; {rec.location}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 border-t border-border-theme/30 pt-3 text-[10px] font-mono">
                  <span className="font-black text-text-primary-theme">{rec.salary}</span>
                  <span className="text-text-secondary-theme font-bold flex items-center gap-0.5 capitalize">
                    <Briefcase className="w-3 h-3" /> {rec.mode}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setKeyword('');
              setActiveFilter('all');
            }}
            className="w-full text-center py-2.5 border border-border-theme text-[10px] font-black text-text-secondary-theme hover:bg-border-theme/20 rounded-xl transition-all cursor-pointer"
          >
            View All Recommended
          </button>
        </div>
      </div>
    </div>
  );
}
