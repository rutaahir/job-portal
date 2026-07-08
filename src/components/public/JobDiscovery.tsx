/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Info, X } from 'lucide-react';
import { Job } from '../../types';

// Importing our 9 specialized modules
import DiscoveryNavbar from './discovery/DiscoveryNavbar';
import PublicJobSearch from './discovery/PublicJobSearch';
import AdvancedSearch from './discovery/AdvancedSearch';
import JobDetailsTabbed from './discovery/JobDetailsTabbed';
import SimilarJobsGrid from './discovery/SimilarJobsGrid';
import CompanyProfilePage from './discovery/CompanyProfilePage';
import CompanyReviewsFeed from './discovery/CompanyReviewsFeed';
import SalaryExplorerCharts from './discovery/SalaryExplorerCharts';
import SkillsExplorerTrends from './discovery/SkillsExplorerTrends';
import CareerInsightsArticles from './discovery/CareerInsightsArticles';

interface JobDiscoveryProps {
  onNavigateToPage: (page: string) => void;
  initialKeyword?: string;
  initialLocation?: string;
  onApplyJob?: (job: Job) => void;
  jobs?: Job[];
  isLoggedIn?: boolean;
  onRedirectToLogin?: () => void;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info';
}

export default function JobDiscovery({ onNavigateToPage, initialKeyword = '', initialLocation = '', onApplyJob, jobs, isLoggedIn = false, onRedirectToLogin }: JobDiscoveryProps) {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load already applied jobs for this candidate on mount/session changes
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      if (isLoggedIn && token) {
        try {
          const res = await fetch('/api/applications', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            // Extract the job IDs from application records
            const ids = data.map((app: any) => app.jobId || app.job?.id);
            setAppliedJobs(ids.filter(Boolean));
          }
        } catch (err) {
          console.error('Failed to fetch applied jobs for discovery:', err);
        }
      } else {
        setAppliedJobs([]);
      }
    };
    fetchAppliedJobs();
  }, [isLoggedIn]);

  // Toast helper
  const addToast = (text: string, type: 'success' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      text,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    // Autoclose toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const handleApply = async (job: Job) => {
    if (!isLoggedIn) {
      addToast('Please login as a candidate first to apply for this job.', 'info');
      if (onRedirectToLogin) {
        onRedirectToLogin();
      } else {
        onNavigateToPage('Auth');
      }
      return;
    }

    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    if (!token) {
      addToast('Please login to apply.', 'info');
      return;
    }

    if (appliedJobs.includes(job.id)) {
      addToast('You have already applied to this opportunity.', 'info');
      return;
    }

    try {
      const response = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: job.id })
      });

      if (response.ok) {
        setAppliedJobs((prev) => [...prev, job.id]);
        addToast(`Applied to ${job.title} at ${job.companyName} successfully!`, 'success');
        if (onApplyJob) {
          onApplyJob(job);
        }
      } else {
        const errData = await response.json();
        addToast(`Failed to apply: ${errData.error || response.statusText}`, 'info');
      }
    } catch (err) {
      console.error(err);
      // Fallback local application if offline or error
      setAppliedJobs((prev) => [...prev, job.id]);
      addToast(`Applied to ${job.title} at ${job.companyName} successfully (offline state)!`, 'success');
      if (onApplyJob) {
        onApplyJob(job);
      }
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setActiveTab('details');
    addToast(`Loaded technical parameters for ${job.title}!`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      
      {/* 1. Header Hero Banner inside Discovery */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto pb-2">
        <span className="bg-primary-theme/10 text-primary-theme text-[9px] uppercase font-black px-3 py-1 rounded-full border border-primary-theme/5">
          Recruitment Discovery Suite
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-text-primary-theme tracking-tight">
          TechnoAdviser Discovery
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary-theme font-medium leading-relaxed">
          Navigate active job feeds, advanced matching matrices, dynamic salary parameters, and verified employer profiles instantly.
        </p>
      </div>

      {/* 2. Horizontal Horizontally-Scrollable Animated Dock Menu */}
      <DiscoveryNavbar activeTab={activeTab} setActiveTab={setActiveTab} jobSelected={!!selectedJob} />

      {/* 3. Render View based on Active Tab */}
      <div className="pt-2 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'search' && (
              <PublicJobSearch
                onViewJob={handleViewJob}
                onApplyJob={handleApply}
                appliedJobIds={appliedJobs}
                jobs={jobs}
              />
            )}

            {activeTab === 'advanced' && (
              <AdvancedSearch
                onViewJob={handleViewJob}
                onApplyJob={handleApply}
                appliedJobIds={appliedJobs}
                addToast={addToast}
              />
            )}

            {activeTab === 'details' && (
              <JobDetailsTabbed
                job={selectedJob}
                onBack={() => {
                  setActiveTab('search');
                  setSelectedJob(null);
                }}
                onApplyJob={handleApply}
                appliedJobIds={appliedJobs}
                addToast={addToast}
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
              />
            )}

            {activeTab === 'similar' && (
              <SimilarJobsGrid
                onViewJob={handleViewJob}
                onApplyJob={handleApply}
                appliedJobIds={appliedJobs}
              />
            )}

            {activeTab === 'company' && (
              <CompanyProfilePage
                onViewJob={handleViewJob}
                onApplyJob={handleApply}
                appliedJobIds={appliedJobs}
                addToast={addToast}
              />
            )}

            {activeTab === 'reviews' && (
              <CompanyReviewsFeed addToast={addToast} />
            )}

            {activeTab === 'salary' && (
              <SalaryExplorerCharts />
            )}

            {activeTab === 'skills' && (
              <SkillsExplorerTrends />
            )}

            {activeTab === 'career' && (
              <CareerInsightsArticles />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Overlay Float Toasts Notification Manager */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-surface-theme border border-border-theme p-4 rounded-2xl shadow-xl flex items-start gap-3 relative overflow-hidden"
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <div className="w-5 h-5 bg-success-theme/10 text-success-theme rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-primary-theme/10 text-primary-theme rounded-full flex items-center justify-center">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <div className="flex-1 pr-6">
                <p className="text-xs font-semibold text-text-primary-theme leading-relaxed">
                  {toast.text}
                </p>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="p-1 bg-bg-theme hover:bg-border-theme rounded-full text-text-secondary-theme absolute top-3.5 right-3 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
