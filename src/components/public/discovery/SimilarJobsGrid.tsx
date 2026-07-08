/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Check, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { Job } from '../../../types';

interface SimilarJobsGridProps {
  onViewJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  appliedJobIds: string[];
}

export default function SimilarJobsGrid({ onViewJob, onApplyJob, appliedJobIds }: SimilarJobsGridProps) {
  // Mock recommendations grid
  const primarySimilarJobs = [
    {
      id: 'sim-p-1',
      title: 'Full Stack Developer',
      companyName: 'Infosys',
      location: 'Bangalore, India',
      salaryRange: '₹10 - 18 LPA',
      experienceRange: '3-6 Yrs',
      workMode: 'hybrid',
      tags: ['React', 'Java', 'Spring Boot'],
    },
    {
      id: 'sim-p-2',
      title: 'Backend Developer',
      companyName: 'Zoho Corporation',
      location: 'Chennai, India',
      salaryRange: '₹8 - 15 LPA',
      experienceRange: '2-5 Yrs',
      workMode: 'onsite',
      tags: ['Node.js', 'Express', 'PostgreSQL'],
    },
    {
      id: 'sim-p-3',
      title: 'Frontend Developer',
      companyName: 'Microsoft',
      location: 'Hyderabad, India',
      salaryRange: '₹12 - 22 LPA',
      experienceRange: '3-5 Yrs',
      workMode: 'remote',
      tags: ['TypeScript', 'React', 'CSS'],
    },
    {
      id: 'sim-p-4',
      title: 'Software Engineer',
      companyName: 'TCS',
      location: 'Mumbai, India',
      salaryRange: '₹6 - 12 LPA',
      experienceRange: '2-4 Yrs',
      workMode: 'onsite',
      tags: ['C#', 'ASP.NET', 'SQL Server'],
    },
  ];

  const secondarySimilarJobs = [
    {
      id: 'sim-s-1',
      title: 'React Developer',
      companyName: 'Wipro Limited',
      location: 'Pune, India',
      salaryRange: '₹7 - 14 LPA',
      experienceRange: '2-4 Yrs',
      workMode: 'hybrid',
      tags: ['React', 'Redux', 'Webpack'],
    },
    {
      id: 'sim-s-2',
      title: 'Data Engineer',
      companyName: 'Accenture India',
      location: 'Gurgaon, India',
      salaryRange: '₹8 - 16 LPA',
      experienceRange: '3-5 Yrs',
      workMode: 'onsite',
      tags: ['Python', 'Spark', 'Hadoop'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-primary-theme/10 to-transparent p-6 rounded-3xl border border-primary-theme/15 flex items-center gap-4">
        <div className="p-3 bg-primary-theme/10 rounded-2xl text-primary-theme flex-shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Similar Vacancies Explorer</h3>
          <p className="text-[11px] text-text-secondary-theme font-medium leading-relaxed mt-0.5">
            Smart recommendations clustered together by analyzing tech-stacks, experience scopes, and job descriptions of other positions you viewed.
          </p>
        </div>
      </div>

      {/* Primary Grid (4 Cards) */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-text-secondary-theme tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary-theme" /> Similar Openings Based on Active Profile
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {primarySimilarJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const fullJobObject: Job = {
              id: job.id,
              title: job.title,
              companyId: job.companyName.toLowerCase(),
              companyName: job.companyName,
              companyLogo: '',
              location: job.location,
              workMode: job.workMode as any,
              experienceRange: job.experienceRange,
              salaryRange: job.salaryRange,
              tags: job.tags,
              description: `Join ${job.companyName} as a ${job.title}. Work alongside a highly dynamic team of technology wizards to optimize scalable, high-quality production platforms.`,
              postedDate: '3 days ago',
              featured: false,
            };

            return (
              <div
                key={job.id}
                className="bg-surface-theme border border-border-theme hover:border-primary-theme/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-primary-theme/5 text-primary-theme flex items-center justify-center font-black text-sm">
                    {job.companyName.charAt(0)}
                  </div>
                  <div>
                    <h5
                      onClick={() => onViewJob(fullJobObject)}
                      className="text-xs font-black text-text-primary-theme hover:text-primary-theme transition-colors cursor-pointer line-clamp-1"
                    >
                      {job.title}
                    </h5>
                    <span className="text-[10px] font-bold text-text-muted-theme block">{job.companyName}</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-text-secondary-theme font-semibold">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-text-muted-theme" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1 capitalize">
                      <Briefcase className="w-3 h-3 text-text-muted-theme" /> {job.workMode}
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 pt-3 border-t border-border-theme/40">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-muted-theme font-bold">Salary Band</span>
                    <span className="font-mono font-black text-text-primary-theme">{job.salaryRange}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onViewJob(fullJobObject)}
                      className="flex-1 py-2 border border-border-theme hover:bg-border-theme/20 rounded-xl text-[9px] font-bold text-text-secondary-theme cursor-pointer"
                    >
                      Specs
                    </button>
                    <button
                      onClick={() => onApplyJob(fullJobObject)}
                      disabled={isApplied}
                      className={`flex-1 py-2 rounded-xl text-[9px] font-black tracking-tight transition-all cursor-pointer text-center flex items-center justify-center ${
                        isApplied
                          ? 'bg-success-theme/10 text-success-theme border border-success-theme/20'
                          : 'bg-primary-theme text-white hover:bg-primary-hover-theme shadow-sm'
                      }`}
                    >
                      {isApplied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : 'Easy Apply'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Vertical List (More jobs you might like) */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-text-secondary-theme tracking-wider">More positions you might appreciate</h4>

        <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 space-y-4.5 shadow-sm">
          {secondarySimilarJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const fullJobObject: Job = {
              id: job.id,
              title: job.title,
              companyId: job.companyName.toLowerCase(),
              companyName: job.companyName,
              companyLogo: '',
              location: job.location,
              workMode: job.workMode as any,
              experienceRange: job.experienceRange,
              salaryRange: job.salaryRange,
              tags: job.tags,
              description: `Excellent technical position at ${job.companyName} for an enthusiastic ${job.title}. Apply now to expedite interview feedback schedules.`,
              postedDate: '4 days ago',
              featured: false,
            };

            return (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-theme/40 last:border-b-0 pb-4 last:pb-0"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary-theme/5 text-primary-theme flex items-center justify-center font-black text-sm">
                    {job.companyName.charAt(0)}
                  </div>
                  <div>
                    <h5
                      onClick={() => onViewJob(fullJobObject)}
                      className="text-xs font-black text-text-primary-theme hover:text-primary-theme transition-colors cursor-pointer"
                    >
                      {job.title}
                    </h5>
                    <div className="text-[10px] text-text-muted-theme font-bold">
                      {job.companyName} &middot; {job.location} &middot; <span className="font-mono">{job.salaryRange}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onViewJob(fullJobObject)}
                    className="px-3 py-1.5 border border-border-theme hover:bg-border-theme/20 rounded-lg text-[9px] font-bold text-text-secondary-theme cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onApplyJob(fullJobObject)}
                    disabled={isApplied}
                    className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black tracking-tight transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-success-theme/10 text-success-theme border border-success-theme/20'
                        : 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-sm'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
