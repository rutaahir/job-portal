/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Plus, Search, Filter, MoreVertical, Check, 
  Trash2, Edit, ChevronRight, CheckCircle, Sparkles, AlertCircle
} from 'lucide-react';

interface EmpJobsSectionProps {
  onPostJob: (newJob: any) => void;
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpJobsSection({ onPostJob, addToast }: EmpJobsSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'create'>('listings');
  const [listFilter, setListFilter] = useState<'all' | 'active' | 'draft' | 'closed'>('all');

  // Job creation wizard state
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Design');
  const [jobType, setJobType] = useState('Full Time');
  const [experienceLevel, setExperienceLevel] = useState('3-5 Years');
  const [location, setLocation] = useState('Bangalore, India');
  const [salaryRange, setSalaryRange] = useState('₹ 8 LPA - ₹ 15 LPA');
  const [jobDescription, setJobDescription] = useState('We are looking for a Senior UI/UX Designer to join our design team...');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Figma', 'UI Design', 'UX Research', 'Prototyping']);

  // Dynamic list of jobs in employer's listings (loaded from database)
  const [jobsList, setJobsList] = useState<any[]>([]);

  const loadJobs = async () => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      const response = await fetch(`/api/jobs?limit=100&companyId=${encodeURIComponent(token || '')}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.jobs) {
          const mapped = data.jobs.map((j: any) => ({
            id: j.id,
            title: j.title,
            applicants: j.applicantsCount || 0,
            status: j.status === 'PUBLISHED' ? 'Active' : j.status === 'DRAFT' ? 'Draft' : 'Closed',
            postedOn: j.postedDate
          }));
          setJobsList(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs in EmpJobsSection:', err);
    }
  };

  React.useEffect(() => {
    loadJobs();
  }, []);

  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleCreateJobSubmit = async () => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    // Dispatch to parent app state (which handles backend save and local state)
    const newJob = {
      id: `job-${Date.now()}`,
      title: jobTitle || 'Unspecified Vacancy Role',
      companyId: token || 'technoadviser',
      companyName: 'TechnoAdviser Technologies Pvt. Ltd.',
      companyLogo: 'T',
      location,
      workMode: 'hybrid',
      salaryRange,
      experienceRange: experienceLevel,
      tags: skills,
      description: jobDescription,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      featured: true,
      status: 'PUBLISHED'
    };

    await onPostJob(newJob);
    await loadJobs();

    // Reset wizard
    setWizardStep(1);
    setJobTitle('');
    setActiveSubTab('listings');
  };

  const handleSaveDraft = async () => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    const draftJob = {
      id: `job-${Date.now()}`,
      title: jobTitle || 'Draft Vacancy',
      companyId: token || 'technoadviser',
      companyName: 'TechnoAdviser Technologies Pvt. Ltd.',
      companyLogo: 'T',
      location,
      workMode: 'hybrid',
      salaryRange,
      experienceRange: experienceLevel,
      tags: skills,
      description: jobDescription,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      featured: false,
      status: 'DRAFT'
    };

    await onPostJob(draftJob);
    await loadJobs();

    // Reset wizard
    setWizardStep(1);
    setJobTitle('');
    setActiveSubTab('listings');
  };

  const handleDeleteJob = async (id: string, title: string) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setJobsList(jobsList.filter((j) => j.id !== id));
        addToast(`Archived / deleted job vacancy: ${title}`, 'info');
      } else {
        const data = await response.json();
        addToast(`Failed to archive vacancy: ${data.error || response.statusText}`, 'info');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      // Fallback
      setJobsList(jobsList.filter((j) => j.id !== id));
      addToast(`Archived / deleted job vacancy: ${title} (offline mode)`, 'info');
    }
  };

  const filteredJobs = jobsList.filter((j) => {
    if (listFilter === 'all') return true;
    return j.status.toLowerCase() === listFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-theme pb-5">
        <div>
          <h1 className="text-xl font-black text-text-primary-theme uppercase tracking-wider">Job Openings Suite</h1>
          <p className="text-xs text-text-secondary-theme font-semibold">Post, edit, draft and manage your live organizational job listings.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'listings' 
                ? 'bg-border-theme/40 text-text-primary-theme border border-border-theme' 
                : 'text-text-secondary-theme hover:bg-border-theme/30'
            }`}
          >
            Manage Listings
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className="px-4.5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>
      </div>

      {/* VIEW: JOB LISTINGS */}
      {activeSubTab === 'listings' && (
        <div className="space-y-6">
          
          {/* Sub Filters row */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Jobs', count: jobsList.length },
              { id: 'active', label: 'Active', count: jobsList.filter((j) => j.status === 'Active').length },
              { id: 'draft', label: 'Draft', count: jobsList.filter((j) => j.status === 'Draft').length },
              { id: 'closed', label: 'Closed', count: jobsList.filter((j) => j.status === 'Closed').length },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setListFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  listFilter === f.id 
                    ? 'bg-primary-theme text-white' 
                    : 'bg-surface-theme border border-border-theme text-text-secondary-theme hover:bg-border-theme/30'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {/* Job listings table list */}
          <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-border-theme/20 text-text-muted-theme text-[10px] font-black uppercase tracking-wider border-b border-border-theme">
                    <th className="p-4 pl-6">Job Title</th>
                    <th className="p-4">Applicants</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Posted On</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-theme/40 text-xs font-bold text-text-primary-theme">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-border-theme/10 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-theme/15 text-primary-theme flex items-center justify-center font-bold text-sm">
                          T
                        </div>
                        <div>
                          <span className="font-extrabold text-xs block">{job.title}</span>
                          <span className="text-[10px] text-text-muted-theme font-semibold">TechnoAdviser &middot; Hybrid</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs">{job.applicants}</span>
                        <span className="text-[10px] text-text-muted-theme font-medium pl-1">Resumes</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          job.status === 'Active' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-text-secondary-theme">
                        {job.postedOn}
                      </td>
                      <td className="p-4 text-right pr-6 relative">
                        <button 
                          onClick={() => setActiveActionsMenu(activeActionsMenu === job.id ? null : job.id)}
                          className="p-1.5 hover:bg-border-theme/50 rounded-lg text-text-secondary-theme cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeActionsMenu === job.id && (
                          <div className="absolute right-6 top-12 bg-surface-theme border border-border-theme shadow-xl rounded-xl py-1 w-36 z-20 text-left">
                            <button 
                              onClick={() => {
                                addToast(`Edit trigger activated for: ${job.title}`, 'info');
                                setActiveActionsMenu(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-border-theme/30 text-xs font-bold flex items-center gap-2 text-text-primary-theme cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit Vacancy
                            </button>
                            <button 
                              onClick={() => {
                                handleDeleteJob(job.id, job.title);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-rose-500/10 hover:text-rose-500 text-xs font-bold flex items-center gap-2 text-text-secondary-theme cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete/Archive
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredJobs.length === 0 && (
              <div className="p-12 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-text-muted-theme mx-auto" />
                <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">No Requisitions Found</h4>
                <p className="text-[10px] text-text-secondary-theme">No job listings match this filter criteria.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW: CREATE JOB WIZARD */}
      {activeSubTab === 'create' && (
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl">
          
          {/* Header segment */}
          <div>
            <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">Create Job Vacancy</h2>
            <p className="text-[10px] text-text-secondary-theme font-bold">Fill out job parameters, skills, and details to post on our live index.</p>
          </div>

          {/* Stepper indicator layout */}
          <div className="grid grid-cols-4 gap-2 border-y border-border-theme/50 py-4 text-[10px] font-black uppercase tracking-wider font-mono text-text-secondary-theme">
            <div className={`flex items-center gap-1.5 ${wizardStep >= 1 ? 'text-primary-theme' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center ${wizardStep >= 1 ? 'bg-primary-theme text-white' : 'bg-border-theme/30'}`}>1</span>
              <span>1. Job Info</span>
            </div>
            <div className={`flex items-center gap-1.5 ${wizardStep >= 2 ? 'text-primary-theme' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center ${wizardStep >= 2 ? 'bg-primary-theme text-white' : 'bg-border-theme/30'}`}>2</span>
              <span>2. Requirements</span>
            </div>
            <div className={`flex items-center gap-1.5 ${wizardStep >= 3 ? 'text-primary-theme' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center ${wizardStep >= 3 ? 'bg-primary-theme text-white' : 'bg-border-theme/30'}`}>3</span>
              <span>3. Details</span>
            </div>
            <div className={`flex items-center gap-1.5 ${wizardStep >= 4 ? 'text-primary-theme' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center ${wizardStep >= 4 ? 'bg-primary-theme text-white' : 'bg-border-theme/30'}`}>4</span>
              <span>4. Preview</span>
            </div>
          </div>

          {/* FORM STEPS CONTENT */}
          <div className="space-y-6 pt-2">
            
            {/* STEP 1: JOB INFO */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Job Title *</label>
                    <input 
                      type="text" 
                      required 
                      value={jobTitle} 
                      onChange={(e) => setJobTitle(e.target.value)} 
                      placeholder="e.g. Senior UI/UX Designer" 
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme placeholder-text-muted-theme"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Department</label>
                    <select 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)} 
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                    >
                      <option>Design</option>
                      <option>Engineering</option>
                      <option>Product Management</option>
                      <option>Marketing</option>
                      <option>Human Resources</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Job Type</label>
                    <select 
                      value={jobType} 
                      onChange={(e) => setJobType(e.target.value)} 
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Experience Level</label>
                    <select 
                      value={experienceLevel} 
                      onChange={(e) => setExperienceLevel(e.target.value)} 
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                    >
                      <option>Entry Level</option>
                      <option>1-3 Years</option>
                      <option>3-5 Years</option>
                      <option>5-8 Years</option>
                      <option>8+ Years</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Location</label>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Salary Range</label>
                    <input 
                      type="text" 
                      value={salaryRange} 
                      onChange={(e) => setSalaryRange(e.target.value)} 
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: REQUIREMENTS */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Required Technical Skills</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      placeholder="e.g. Tailwind CSS" 
                      className="flex-1 bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme placeholder-text-muted-theme"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddSkill}
                      className="px-4.5 py-3 bg-border-theme/40 text-text-primary-theme rounded-xl text-xs font-bold hover:bg-border-theme transition-colors cursor-pointer"
                    >
                      + Add Skill
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {skills.map((skill) => (
                    <span key={skill} className="bg-primary-theme/10 text-primary-theme border border-primary-theme/15 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-primary-theme hover:text-rose-500 font-extrabold focus:outline-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Job Description *</label>
                  <textarea 
                    rows={6} 
                    required 
                    value={jobDescription} 
                    onChange={(e) => setJobDescription(e.target.value)} 
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-medium leading-relaxed resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: PREVIEW */}
            {wizardStep === 4 && (
              <div className="bg-border-theme/20 p-5 rounded-2xl border border-border-theme/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-theme text-white flex items-center justify-center font-black text-sm">
                    T
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary-theme">{jobTitle || 'Lead Frontend Architect'}</h3>
                    <p className="text-[10px] text-text-secondary-theme font-bold">TechnoAdviser Technologies &middot; {location} &middot; {jobType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-border-theme/40 py-3 text-[10px] font-black text-text-secondary-theme">
                  <div>Experience: <span className="text-text-primary-theme font-mono">{experienceLevel}</span></div>
                  <div>Salary Range: <span className="text-primary-theme font-mono">{salaryRange}</span></div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black text-text-muted-theme uppercase tracking-widest">Requirements Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="bg-border-theme/40 px-2 py-0.5 rounded text-[10px] font-semibold text-text-secondary-theme">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-text-muted-theme uppercase tracking-widest">Description</h4>
                  <p className="text-[11px] text-text-secondary-theme leading-relaxed whitespace-pre-wrap">{jobDescription}</p>
                </div>
              </div>
            )}

            {/* WIZARD ACTIONS */}
            <div className="flex justify-between items-center pt-4 border-t border-border-theme/50">
              <button 
                type="button" 
                onClick={handleSaveDraft}
                className="px-4.5 py-3 border border-border-theme text-text-secondary-theme rounded-xl text-xs font-black hover:bg-border-theme/30 transition-all cursor-pointer"
              >
                Save Draft
              </button>

              <div className="flex gap-2.5">
                {wizardStep > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setWizardStep((wizardStep - 1) as any)}
                    className="px-4.5 py-3 border border-border-theme text-text-primary-theme rounded-xl text-xs font-black hover:bg-border-theme/30 transition-all cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {wizardStep < 4 ? (
                  <button 
                    type="button" 
                    onClick={() => {
                      if (wizardStep === 1 && !jobTitle.trim()) {
                        addToast('Job title is required!', 'info');
                        return;
                      }
                      setWizardStep((wizardStep + 1) as any);
                    }}
                    className="px-5 py-3 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Next step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleCreateJobSubmit}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Publish Vacancy</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
