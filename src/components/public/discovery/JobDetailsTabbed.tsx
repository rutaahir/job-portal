/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, Briefcase, Calendar, 
  DollarSign, Check, Share2, Facebook, 
  Twitter, Linkedin, Link2, Landmark, 
  Users, Award, Sparkles, AlertTriangle, Star
} from 'lucide-react';
import { Job } from '../../../types';

interface JobDetailsTabbedProps {
  job: Job | null;
  onBack: () => void;
  onApplyJob: (job: Job) => void;
  appliedJobIds: string[];
  addToast: (text: string, type: 'success' | 'info') => void;
  onNavigateToTab: (tab: string) => void;
}

export default function JobDetailsTabbed({ 
  job, 
  onBack, 
  onApplyJob, 
  appliedJobIds, 
  addToast,
  onNavigateToTab 
}: JobDetailsTabbedProps) {
  const [activeSubTab, setActiveSubTab] = useState<'desc' | 'company' | 'reviews' | 'benefits' | 'similar'>('desc');

  // Fallback default job (Senior Full Stack Developer at TechMahindra)
  const activeJob: Job = job || {
    id: 'techm-fullstack',
    title: 'Senior Full Stack Developer',
    companyId: 'techmahindra',
    companyName: 'TechMahindra',
    companyLogo: '',
    location: 'Pune, India',
    workMode: 'onsite',
    experienceRange: '5-7 Yrs',
    salaryRange: '15 - 25 LPA',
    tags: ['React', 'Node.js', 'Express', 'SQL', 'TypeScript'],
    description: 'We are seeking an outstanding Senior Full Stack Developer to lead development on high-availability web products. You will build highly responsive interfaces, maintain solid relational database connections, and secure cloud microservices against scaling bottlenecks.',
    postedDate: '2 Days ago',
    matchScore: 92,
    applicantsCount: 2345,
    featured: true,
  };

  const isApplied = appliedJobIds.includes(activeJob.id);

  const handleShare = (network: string) => {
    addToast(`Successfully dispatched sharing intent to ${network}!`, 'success');
  };

  const handleCopyLink = () => {
    addToast('Job specs link successfully copied to clipboard!', 'success');
  };

  // Mock similar jobs inside details tab
  const detailsSimilarJobs = [
    { id: 'sim-1', title: 'Lead UI Engineer', company: 'Zoho Corporation', location: 'Chennai', salary: '₹12 - 18 LPA' },
    { id: 'sim-2', title: 'Principal Consultant', company: 'Infosys', location: 'Bengaluru', salary: '₹18 - 28 LPA' },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-black text-text-secondary-theme hover:text-primary-theme group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Open Opportunities
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Content Card (8 cols) */}
        <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Header Card Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border-theme/40">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary-theme leading-tight">
                  {activeJob.title}
                </h1>
                {activeJob.featured && (
                  <span className="bg-primary-theme/10 text-primary-theme text-[9px] uppercase font-black px-2 py-0.5 rounded-full border border-primary-theme/5">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary-theme font-medium">
                <span className="font-bold text-primary-theme text-sm">{activeJob.companyName}</span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeJob.location}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1 capitalize">
                  <Briefcase className="w-3.5 h-3.5" />
                  {activeJob.workMode}
                </span>
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-primary-theme/10 text-primary-theme flex items-center justify-center font-black text-xl border border-primary-theme/5 flex-shrink-0">
              {activeJob.companyName.charAt(0)}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center bg-bg-theme p-4 rounded-2xl border border-border-theme/40">
            <div>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Salary Band</span>
              <span className="text-xs font-black text-text-primary-theme font-mono mt-1 block">{activeJob.salaryRange}</span>
            </div>
            <div>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Experience Range</span>
              <span className="text-xs font-black text-text-text-primary-theme font-mono mt-1 block">{activeJob.experienceRange}</span>
            </div>
            <div>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Posted Date</span>
              <span className="text-xs font-black text-text-primary-theme font-mono mt-1 block">{activeJob.postedDate}</span>
            </div>
            <div>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Applicants</span>
              <span className="text-xs font-black text-text-primary-theme font-mono mt-1 block">{activeJob.applicantsCount || 120}</span>
            </div>
          </div>

          {/* Tab Selector inside Details */}
          <div className="flex items-center border-b border-border-theme overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: 'desc', label: 'Job Description' },
              { id: 'company', label: 'About Company' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'similar', label: 'Similar Jobs' },
            ].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id as any)}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap leading-none ${
                  activeSubTab === subTab.id
                    ? 'border-primary-theme text-primary-theme'
                    : 'border-transparent text-text-secondary-theme hover:text-text-primary-theme'
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Body */}
          <div className="pt-2 min-h-[180px]">
            <AnimatePresence mode="wait">
              {activeSubTab === 'desc' && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2 leading-relaxed">
                    <h3 className="text-xs font-black uppercase text-text-primary-theme tracking-wide">About the Role</h3>
                    <p className="text-xs sm:text-sm text-text-secondary-theme font-medium leading-relaxed">
                      {activeJob.description}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-xs font-black uppercase text-text-primary-theme tracking-wide">Core Responsibilities</h3>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs text-text-secondary-theme font-medium">
                      <li>Design and implement secure, modular React structures using Tailwind utility directives.</li>
                      <li>Author scalable server controllers in Node.js and audit relational SQL indices.</li>
                      <li>Review UX flow requirements to safeguard design parameters against layout drift.</li>
                      <li>Analyze code performance metrics to resolve asynchronous database bottlenecks.</li>
                    </ul>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-xs font-black uppercase text-text-primary-theme tracking-wide">Required Capabilities</h3>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs text-text-secondary-theme font-medium">
                      <li>B.Tech/B.E. or equivalent certified credentials in Computer Science or Software Engineering.</li>
                      <li>5+ years of verified software engineering experience building rich full-stack web applications.</li>
                      <li>Expert-level understanding of state management, CSS layouts, and database schemas.</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'company' && (
                <motion.div
                  key="company"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-xs font-black uppercase text-text-primary-theme tracking-wide">Corporate Vision</h4>
                  <p className="text-xs sm:text-sm text-text-secondary-theme font-medium leading-relaxed">
                    TechMahindra is a digital technology powerhouse delivering next-generation digital experiences, consultancies, and software platforms. We operate with over 120,000 corporate agents globally and foster a highly collaborative workspace.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-bg-theme rounded-xl border border-border-theme/40 text-center">
                      <Users className="w-5 h-5 mx-auto text-primary-theme mb-1.5" />
                      <span className="text-[10px] text-text-muted-theme block">Size</span>
                      <span className="text-xs font-black text-text-primary-theme">120k+ Professionals</span>
                    </div>
                    <div className="p-3 bg-bg-theme rounded-xl border border-border-theme/40 text-center">
                      <Landmark className="w-5 h-5 mx-auto text-primary-theme mb-1.5" />
                      <span className="text-[10px] text-text-muted-theme block">Industry</span>
                      <span className="text-xs font-black text-text-primary-theme">IT Consulting</span>
                    </div>
                    <div className="p-3 bg-bg-theme rounded-xl border border-border-theme/40 text-center">
                      <Award className="w-5 h-5 mx-auto text-primary-theme mb-1.5" />
                      <span className="text-[10px] text-text-muted-theme block">Rating</span>
                      <span className="text-xs font-black text-text-primary-theme">4.2 (12k Reviews)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4 p-4 bg-primary-theme/5 rounded-2xl border border-primary-theme/10">
                    <div className="text-center">
                      <span className="text-3xl font-black text-text-primary-theme">4.2</span>
                      <span className="text-[10px] text-text-secondary-theme block font-bold">out of 5.0</span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-xs font-extrabold text-text-primary-theme">Excellent Work Culture & Growth</h4>
                      <p className="text-[11px] text-text-secondary-theme leading-relaxed">
                        Reviewed by 12,588 verified employees. Highly appreciated for work-life balance and learning platforms.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 bg-bg-theme border border-border-theme/40 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs font-bold text-text-primary-theme">
                        <span>"Great tech stack and healthy team support"</span>
                        <span className="text-primary-theme flex items-center gap-0.5">5.0 <Star className="w-3 h-3 fill-current" /></span>
                      </div>
                      <p className="text-[11px] text-text-secondary-theme">
                        Anonymous Software Engineer: "Loved working with smart teams, awesome learning budget."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'benefits' && (
                <motion.div
                  key="benefits"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {[
                    'Comprehensive Medical Insurance Cover',
                    'Flexible Working Hours & Remote Support',
                    'Corporate Learning & Certification Budgets',
                    'Annual Wellness Allowance & Gym Access',
                    'Regular Employee Engagement & Outings',
                    'Generous Paid Parental & Wellness Leaves',
                  ].map((ben) => (
                    <div key={ben} className="flex items-center gap-2.5 p-3 bg-bg-theme border border-border-theme/30 rounded-xl text-xs text-text-secondary-theme font-semibold">
                      <div className="w-5 h-5 rounded-full bg-success-theme/10 text-success-theme flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      {ben}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeSubTab === 'similar' && (
                <motion.div
                  key="similar"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3.5"
                >
                  {detailsSimilarJobs.map((sim) => (
                    <div key={sim.id} className="p-4 bg-bg-theme border border-border-theme/40 rounded-2xl flex justify-between items-center hover:border-primary-theme/30 transition-all cursor-pointer">
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-extrabold text-text-primary-theme">{sim.title}</h5>
                        <div className="text-[10px] text-text-muted-theme font-bold">
                          {sim.company} &middot; {sim.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-text-primary-theme font-mono block">{sim.salary}</span>
                        <button 
                          onClick={() => onNavigateToTab('similar')}
                          className="text-[9px] font-bold text-primary-theme hover:underline mt-1 block"
                        >
                          View Job &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side Info Cards & Shares (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Trigger Box */}
          <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-4 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary-theme/20 border-t-primary-theme flex items-center justify-center mx-auto relative animate-pulse">
              <span className="text-base font-black text-text-primary-theme font-serif">
                {activeJob.matchScore || 85}%
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-text-primary-theme flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-primary-theme" /> High AI Match Compatibility
              </h4>
              <p className="text-[10px] text-text-secondary-theme leading-relaxed">
                Matches with your resume details, key skills, and geographical parameters perfectly.
              </p>
            </div>

            <button
              onClick={() => onApplyJob(activeJob)}
              disabled={isApplied}
              className={`w-full py-3.5 rounded-xl text-xs font-black transition-all ${
                isApplied
                  ? 'bg-success-theme/10 text-success-theme border border-success-theme/20 cursor-default'
                  : 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-md cursor-pointer'
              }`}
            >
              {isApplied ? (
                <span className="flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 stroke-[3]" /> Application Dispatched
                </span>
              ) : (
                'Apply for this Position'
              )}
            </button>
          </div>

          {/* Job Snapshot */}
          <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 space-y-4.5 shadow-sm">
            <h4 className="text-xs font-black uppercase text-text-primary-theme tracking-wide border-b border-border-theme pb-2.5">
              Job Snapshot
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-text-muted-theme font-bold">Industry</span>
                <span className="text-text-primary-theme font-extrabold">IT Services & Consulting</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-text-muted-theme font-bold">Department</span>
                <span className="text-text-primary-theme font-extrabold">Engineering</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-text-muted-theme font-bold">Role Category</span>
                <span className="text-text-primary-theme font-extrabold">Software Development</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-text-muted-theme font-bold">Employment Type</span>
                <span className="text-text-primary-theme font-extrabold">Full Time</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-text-muted-theme font-bold">Work Mode</span>
                <span className="text-text-primary-theme font-extrabold capitalize">{activeJob.workMode}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-text-muted-theme font-bold">Education</span>
                <span className="text-text-primary-theme font-extrabold">B.Tech/B.E. in CS/IT</span>
              </div>
            </div>
          </div>

          {/* Social Share widget */}
          <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-black uppercase text-text-primary-theme tracking-wide">
              Share this Job
            </h4>
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={() => handleShare('LinkedIn')}
                className="p-2.5 bg-bg-theme border border-border-theme/60 hover:border-primary-theme rounded-xl text-text-secondary-theme hover:text-primary-theme transition-colors cursor-pointer flex-1 flex justify-center"
                title="Share to LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('Twitter')}
                className="p-2.5 bg-bg-theme border border-border-theme/60 hover:border-primary-theme rounded-xl text-text-secondary-theme hover:text-primary-theme transition-colors cursor-pointer flex-1 flex justify-center"
                title="Share to Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('Facebook')}
                className="p-2.5 bg-bg-theme border border-border-theme/60 hover:border-primary-theme rounded-xl text-text-secondary-theme hover:text-primary-theme transition-colors cursor-pointer flex-1 flex justify-center"
                title="Share to Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="p-2.5 bg-bg-theme border border-border-theme/60 hover:border-primary-theme rounded-xl text-text-secondary-theme hover:text-primary-theme transition-colors cursor-pointer flex-1 flex justify-center"
                title="Copy Link"
              >
                <Link2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
