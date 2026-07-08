/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal, Search, CheckCircle2, Bookmark, Flame, Check, Sparkles } from 'lucide-react';
import { Job } from '../../../types';

interface AdvancedSearchProps {
  onViewJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  appliedJobIds: string[];
  addToast: (text: string, type: 'success' | 'info') => void;
}

export default function AdvancedSearch({ onViewJob, onApplyJob, appliedJobIds, addToast }: AdvancedSearchProps) {
  // Advanced filters state
  const [selectedIndustry, setSelectedIndustry] = useState<string>('IT Services');
  const [selectedDept, setSelectedDept] = useState<string>('Engineering');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Machine Learning']);
  const [education, setEducation] = useState<string>('B.Tech/B.E.');
  const [workModes, setWorkModes] = useState<string[]>(['remote', 'hybrid']);
  const [benefits, setBenefits] = useState<string[]>(['Health Insurance', 'Learning Budget']);
  const [savedSearchesCount, setSavedSearchesCount] = useState<number>(0);

  const industries = ['IT Services', 'Banking', 'Healthcare', 'Education', 'E-commerce', 'Consulting'];
  const departments = ['Engineering', 'Analytics', 'Product', 'Design'];
  const availableSkills = ['Python', 'SQL', 'Machine Learning', 'Power BI', 'TypeScript', 'React', 'Figma', 'UX Research'];
  const benefitsList = ['Health Insurance', 'Flexible Hours', 'Learning Budget', 'Wellness Program', 'Equity Options'];

  // Two advanced results
  const advancedJobs: Job[] = [
    {
      id: 'adv-job-1',
      title: 'Data Scientist',
      companyId: 'flipkart',
      companyName: 'Flipkart',
      companyLogo: '',
      location: 'Bangalore, India',
      workMode: 'hybrid',
      experienceRange: '3-6 Yrs',
      salaryRange: '12 - 25 LPA',
      tags: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
      description: 'Flipkart is hiring a seasoned Data Scientist to optimize search recommendation systems and click-through forecasts. Experience in collaborative filtering and regression models is crucial.',
      postedDate: '2 hours ago',
      matchScore: 94,
      applicantsCount: 45,
      featured: true,
    },
    {
      id: 'adv-job-2',
      title: 'Machine Learning Engineer',
      companyId: 'hcltech',
      companyName: 'HCLTech',
      companyLogo: '',
      location: 'Noida, India',
      workMode: 'remote',
      experienceRange: '2-5 Yrs',
      salaryRange: '10 - 20 LPA',
      tags: ['Python', 'PyTorch', 'NLP', 'TensorFlow'],
      description: 'HCLTech core AI/ML labs is looking for a Machine Learning Engineer to design and ship vision classifiers and natural language parsing APIs.',
      postedDate: '2 hours ago',
      matchScore: 89,
      applicantsCount: 68,
      featured: false,
    },
  ];

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleToggleWorkMode = (mode: string) => {
    setWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleToggleBenefit = (benefit: string) => {
    setBenefits((prev) =>
      prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
    );
  };

  const handleSaveSearch = () => {
    setSavedSearchesCount((prev) => prev + 1);
    addToast('Advanced search parameters saved to saved criteria!', 'success');
  };

  const handleClearAll = () => {
    setSelectedIndustry('');
    setSelectedDept('');
    setSelectedSkills([]);
    setEducation('Any');
    setWorkModes([]);
    setBenefits([]);
  };

  return (
    <div className="space-y-8">
      {/* Search Criteria Controls Panel */}
      <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border-theme/60 pb-4 gap-4">
          <div>
            <h2 className="text-base font-extrabold text-text-primary-theme flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary-theme" />
              Advanced Criteria Search
            </h2>
            <p className="text-[11px] text-text-secondary-theme font-medium mt-0.5">
              Refine results by specifying industry-specific domains, corporate benefits, and educational bands.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSaveSearch}
              className="px-4 py-2 bg-primary-theme/10 hover:bg-primary-theme/20 text-primary-theme border border-primary-theme/20 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save Search {savedSearchesCount > 0 && `(${savedSearchesCount})`}
            </button>
          </div>
        </div>

        {/* 6 Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Industry Selection */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-text-secondary-theme tracking-wider">Industry Selection</h4>
            <div className="flex flex-wrap gap-1.5">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    selectedIndustry === ind
                      ? 'bg-primary-theme border-primary-theme text-white'
                      : 'bg-bg-theme border-border-theme text-text-secondary-theme hover:border-text-muted-theme'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-text-secondary-theme tracking-wider">Department Focus</h4>
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-primary-theme border-primary-theme text-white'
                      : 'bg-bg-theme border-border-theme text-text-secondary-theme hover:border-text-muted-theme'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Matrix Toggle */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-text-secondary-theme tracking-wider">Skills Requirements</h4>
            <div className="flex flex-wrap gap-1.5">
              {availableSkills.map((skill) => {
                const hasSkill = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                      hasSkill
                        ? 'bg-primary-theme border-primary-theme text-white'
                        : 'bg-bg-theme border-border-theme text-text-secondary-theme hover:border-text-muted-theme'
                    }`}
                  >
                    {hasSkill && <Check className="w-3 h-3 stroke-[3]" />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Education dropdown */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-text-secondary-theme tracking-wider">Required Education</h4>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full bg-bg-theme border border-border-theme rounded-xl px-3.5 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-bold cursor-pointer"
            >
              <option value="Any">Any Credentials</option>
              <option value="B.Tech/B.E.">B.Tech/B.E. in CS/IT</option>
              <option value="M.Tech">M.Tech in CSE / DS</option>
              <option value="MCA">MCA (Computer Applications)</option>
              <option value="MBA">MBA (Operations / Marketing)</option>
              <option value="Other">Ph.D or Research Fields</option>
            </select>
          </div>

          {/* Work Mode Checkboxes */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-text-secondary-theme tracking-wider">Work Mode Options</h4>
            <div className="flex gap-3 pt-1">
              {['remote', 'hybrid', 'onsite'].map((mode) => {
                const isChecked = workModes.includes(mode);
                return (
                  <label key={mode} className="flex items-center gap-2 text-xs text-text-secondary-theme font-semibold capitalize cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleWorkMode(mode)}
                      className="accent-primary-theme rounded border-border-theme h-4 w-4"
                    />
                    {mode}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Benefits checkboxes */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-text-secondary-theme tracking-wider">Perks & Benefits</h4>
            <div className="flex flex-wrap gap-1.5">
              {benefitsList.map((benefit) => {
                const hasBen = benefits.includes(benefit);
                return (
                  <button
                    key={benefit}
                    onClick={() => handleToggleBenefit(benefit)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                      hasBen
                        ? 'bg-primary-theme border-primary-theme text-white'
                        : 'bg-bg-theme border-border-theme text-text-secondary-theme hover:border-text-muted-theme'
                    }`}
                  >
                    {hasBen && <Check className="w-3 h-3 stroke-[3]" />}
                    {benefit}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions inside filters */}
        <div className="border-t border-border-theme/40 pt-4 flex items-center justify-end gap-3.5">
          <button
            onClick={handleClearAll}
            className="text-xs text-text-muted-theme hover:text-text-primary-theme font-bold cursor-pointer"
          >
            Clear All Criteria
          </button>
          <button
            onClick={() => addToast('Advanced queries matched with index systems successfully!', 'success')}
            className="px-6 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-bold shadow cursor-pointer"
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* Matching Jobs Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-text-secondary-theme tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary-theme" />
            2 Deep Matches Located
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            return (
              <motion.div
                key={job.id}
                layoutId={`advanced-job-${job.id}`}
                className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-extrabold text-text-primary-theme hover:text-primary-theme transition-colors cursor-pointer" onClick={() => onViewJob(job)}>
                        {job.title}
                      </h4>
                      {job.featured && (
                        <span className="bg-primary-theme/10 text-primary-theme text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded-full border border-primary-theme/5">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary-theme font-medium">
                      <span className="text-text-primary-theme font-semibold">{job.companyName}</span>
                      <span>&middot;</span>
                      <span>{job.location}</span>
                      <span>&middot;</span>
                      <span className="capitalize">{job.workMode}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-theme/5 flex items-center justify-center font-black text-primary-theme text-sm border border-primary-theme/10 flex-shrink-0">
                    {job.companyName.charAt(0)}
                  </div>
                </div>

                <p className="text-xs text-text-secondary-theme line-clamp-2 leading-relaxed mt-3.5">
                  {job.description}
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1.5 pt-3.5">
                  {job.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-border-theme/35 text-[9px] font-bold text-text-secondary-theme rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border-theme/40 pt-4.5 mt-5">
                  <div className="leading-none">
                    <span className="text-[9px] text-text-muted-theme font-bold uppercase tracking-wider block">Estimated Budget</span>
                    <span className="text-xs font-black text-text-primary-theme font-mono">{job.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewJob(job)}
                      className="px-3.5 py-2 border border-border-theme hover:bg-border-theme/20 rounded-xl text-[10px] font-bold text-text-secondary-theme cursor-pointer"
                    >
                      View Specs
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
          })}
        </div>
      </div>
    </div>
  );
}
