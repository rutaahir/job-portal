/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Filter, Search, Trash2, Edit2, Archive, 
  PlusCircle, FolderHeart, ShieldAlert, BadgeCheck, MapPin, X, Check
} from 'lucide-react';

interface AdminJobMgmtProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminJobMgmt({ addToast }: AdminJobMgmtProps) {
  const [activeSubTab, setActiveSubTab] = useState<'jobs' | 'categories' | 'skills' | 'locations'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');

  // Live dynamic states
  const [jobs, setJobs] = useState<any[]>([]);

  React.useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch('/api/jobs?limit=100');
        if (response.ok) {
          const data = await response.json();
          if (data && data.jobs && Array.isArray(data.jobs)) {
            const mapped = data.jobs.map((j: any) => ({
              id: j.id,
              title: j.title,
              company: j.companyName || 'Corporate Partner',
              applicants: j.applicantsCount || 0,
              status: j.status === 'PUBLISHED' ? 'Active' : j.status === 'DRAFT' ? 'Draft' : 'Expired',
              posted: j.postedDate || j.posted_date || new Date().toLocaleDateString()
            }));
            setJobs(mapped);
          } else {
            setJobs([]);
          }
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('Failed to load jobs in AdminJobMgmt:', err);
        setJobs([]);
      }
    };
    loadJobs();
  }, []);

  const [categories, setCategories] = useState([
    { id: 'cat-101', name: 'Information Technology', desc: 'Software engineering, cloud architecture, and cybersecurity development', count: 145 },
    { id: 'cat-102', name: 'Product Management', desc: 'Technical product managers, owners, and Agile delivery leads', count: 42 },
    { id: 'cat-103', name: 'Creative & UI/UX Design', desc: 'UI/UX designers, brand researchers, and graphics visualizers', count: 34 },
    { id: 'cat-104', name: 'Marketing & Growth', desc: 'Inbound marketing, conversion optimization, and SEO experts', count: 28 },
    { id: 'cat-105', name: 'Finance & Accounting', desc: 'Corporate tax professionals, auditors, and investment analysts', count: 19 },
  ]);

  const [skills, setSkills] = useState([
    { id: 'skl-201', name: 'React / Next.js', category: 'Information Technology', level: 'Expert', jobsCount: 54 },
    { id: 'skl-202', name: 'Python / Django', category: 'Information Technology', level: 'Intermediate', jobsCount: 38 },
    { id: 'skl-203', name: 'Figma Interaction Design', category: 'Creative & UI/UX Design', level: 'Expert', jobsCount: 22 },
    { id: 'skl-204', name: 'Product Roadmap Design', category: 'Product Management', level: 'Expert', jobsCount: 17 },
    { id: 'skl-205', name: 'SEO & Growth Hacking', category: 'Marketing & Growth', level: 'Intermediate', jobsCount: 11 },
  ]);

  const [locations, setLocations] = useState([
    { id: 'loc-301', name: 'Bangalore, India', region: 'Karnataka', openings: 154 },
    { id: 'loc-302', name: 'Mumbai, India', region: 'Maharashtra', openings: 92 },
    { id: 'loc-303', name: 'New York, USA', region: 'New York', openings: 45 },
    { id: 'loc-304', name: 'London, UK', region: 'Greater London', openings: 38 },
    { id: 'loc-305', name: 'San Francisco, USA', region: 'California', openings: 31 },
  ]);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  // Form input fields
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formJobCompany, setFormJobCompany] = useState('');
  const [formJobStatus, setFormJobStatus] = useState('Active');
  
  const [formCatName, setFormCatName] = useState('');
  const [formCatDesc, setFormCatDesc] = useState('');
  
  const [formSkillName, setFormSkillName] = useState('');
  const [formSkillCategory, setFormSkillCategory] = useState('Information Technology');
  const [formSkillLevel, setFormSkillLevel] = useState('Expert');
  
  const [formLocName, setFormLocName] = useState('');
  const [formLocRegion, setFormLocRegion] = useState('');
  const [formLocOpenings, setFormLocOpenings] = useState('10');

  const openCreateModal = () => {
    setEditItem(null);
    setFormJobTitle('');
    setFormJobCompany('');
    setFormJobStatus('Active');
    setFormCatName('');
    setFormCatDesc('');
    setFormSkillName('');
    setFormSkillCategory('Information Technology');
    setFormSkillLevel('Expert');
    setFormLocName('');
    setFormLocRegion('');
    setFormLocOpenings('10');
    setIsModalOpen(true);
  };

  const handleArchive = async (id: string) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CLOSED' })
      });
      if (response.ok) {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Expired' } : j));
        addToast('Job listing successfully archived.', 'info');
      } else {
        const data = await response.json();
        addToast(`Failed to archive: ${data.error || response.statusText}`, 'info');
      }
    } catch (err) {
      console.error('Error archiving job via API:', err);
      addToast('Failed to archive job listing.', 'info');
    }
  };

  const handlePrune = async (id: string) => {
    const conf = confirm('Permanently expunge this job listing and discard all candidate applications?');
    if (conf) {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      try {
        const response = await fetch(`/api/jobs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setJobs(jobs.filter(j => j.id !== id));
          addToast('Job vacancy deleted.', 'success');
        } else {
          const data = await response.json();
          addToast(`Failed to delete: ${data.error || response.statusText}`, 'info');
        }
      } catch (err) {
        console.error('Failed to delete job via API:', err);
        addToast('Failed to delete job vacancy.', 'info');
      }
    }
  };

  const handlePruneCategory = (id: string) => {
    if (confirm('Delete this sourcing category and reclassify existing associated items?')) {
      setCategories(categories.filter(c => c.id !== id));
      addToast('Sourcing category deleted.', 'success');
    }
  };

  const handlePruneSkill = (id: string) => {
    if (confirm('Delete this sourcing skill from directory indexing?')) {
      setSkills(skills.filter(s => s.id !== id));
      addToast('Sourcing skill removed.', 'success');
    }
  };

  const handlePruneLocation = (id: string) => {
    if (confirm('Remove this location pool from the sourcing directory?')) {
      setLocations(locations.filter(l => l.id !== id));
      addToast('Location pool removed.', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubTab === 'jobs') {
      if (!formJobTitle || !formJobCompany) {
        addToast('Please fill out all job fields.', 'info');
        return;
      }
      
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const apiCreateJob = async () => {
        try {
          const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: formJobTitle,
              location: 'Bangalore, India',
              workMode: 'hybrid',
              experienceRange: '3-5 Yrs',
              salaryRange: 'Negotiable',
              description: `This is a job class created by Administrator for ${formJobCompany}.`,
              tags: ['admin-class'],
              status: formJobStatus === 'Active' ? 'PUBLISHED' : 'DRAFT'
            })
          });
          if (response.ok) {
            const saved = await response.json();
            const newJob = {
              id: saved.id,
              title: saved.title,
              company: formJobCompany,
              applicants: 0,
              status: formJobStatus,
              posted: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            };
            setJobs([newJob, ...jobs]);
            addToast(`Successfully created job: ${formJobTitle}`, 'success');
          } else {
            const data = await response.json();
            addToast(`Failed to create job: ${data.error || response.statusText}`, 'info');
          }
        } catch (err) {
          console.error('Failed to create job via API:', err);
          addToast(`Failed to create job: Network error.`, 'info');
        }
      };
      apiCreateJob();
    } else if (activeSubTab === 'categories') {
      if (!formCatName || !formCatDesc) {
        addToast('Please fill out category name and description.', 'info');
        return;
      }
      const newCat = {
        id: `cat-${Math.floor(Math.random() * 900) + 110}`,
        name: formCatName,
        desc: formCatDesc,
        count: 0
      };
      setCategories([newCat, ...categories]);
      addToast(`Successfully created category: ${formCatName}`, 'success');
    } else if (activeSubTab === 'skills') {
      if (!formSkillName) {
        addToast('Please enter the skill name.', 'info');
        return;
      }
      const newSkill = {
        id: `skl-${Math.floor(Math.random() * 900) + 210}`,
        name: formSkillName,
        category: formSkillCategory,
        level: formSkillLevel,
        jobsCount: 0
      };
      setSkills([newSkill, ...skills]);
      addToast(`Successfully cataloged skill: ${formSkillName}`, 'success');
    } else if (activeSubTab === 'locations') {
      if (!formLocName || !formLocRegion) {
        addToast('Please fill out city and region.', 'info');
        return;
      }
      const newLoc = {
        id: `loc-${Math.floor(Math.random() * 900) + 310}`,
        name: formLocName,
        region: formLocRegion,
        openings: Number(formLocOpenings) || 0
      };
      setLocations([newLoc, ...locations]);
      addToast(`Successfully registered location: ${formLocName}`, 'success');
    }
    setIsModalOpen(false);
  };

  // Searching logic
  const filteredJobs = jobs.filter((jb) => {
    return jb.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           jb.company.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredCategories = categories.filter((c) => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredSkills = skills.filter((s) => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           s.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredLocations = locations.filter((l) => {
    return l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           l.region.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const expiredJobs = jobs.filter(j => j.status === 'Expired').length;
  const draftJobs = jobs.filter(j => j.status === 'Draft').length;

  const activePct = totalJobs ? Math.round((activeJobs / totalJobs) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Job Openings', count: totalJobs.toLocaleString(), detail: 'Cumulative listings', color: 'border-l-blue-500' },
          { label: 'Active Openings', count: activeJobs.toLocaleString(), detail: `${activePct}% active sourcing state`, color: 'border-l-emerald-500' },
          { label: 'Expired & Completed', count: expiredJobs.toLocaleString(), detail: 'Hires completed', color: 'border-l-rose-500' },
          { label: 'Draft Listings', count: draftJobs.toLocaleString(), detail: 'Pre-onboarding steps', color: 'border-l-amber-500' },
        ].map((met) => (
          <div key={met.label} className={`bg-surface-theme border-l-4 ${met.color} border border-border-theme/40 rounded-2xl p-5 shadow-sm`}>
            <span className="text-[9px] font-black uppercase text-text-muted-theme tracking-wider block">{met.label}</span>
            <span className="text-2xl font-black text-text-primary-theme font-mono block mt-1">{met.count}</span>
            <span className="text-[9px] text-text-secondary-theme font-semibold block mt-1">{met.detail}</span>
          </div>
        ))}
      </div>

      {/* Subnav tab & filters */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme/40 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'jobs', label: 'All Jobs', count: jobs.length },
              { id: 'categories', label: 'Job Categories', count: categories.length },
              { id: 'skills', label: 'Sourcing Skills', count: skills.length },
              { id: 'locations', label: 'Locations Pool', count: locations.length },
            ].map((sub) => {
              const isActive = activeSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubTab(sub.id as any);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-primary-theme text-white shadow-sm' 
                      : 'bg-border-theme/10 text-text-secondary-theme hover:bg-border-theme/40 hover:text-text-primary-theme'
                  }`}
                >
                  <span>{sub.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black font-mono ${isActive ? 'bg-white text-primary-theme' : 'bg-border-theme/40 text-text-muted-theme'}`}>
                    {sub.count}
                  </span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={openCreateModal}
            className="px-3.5 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Create New {activeSubTab === 'jobs' ? 'Job Class' : activeSubTab === 'categories' ? 'Category' : activeSubTab === 'skills' ? 'Skill' : 'Location'}</span>
          </button>
        </div>

        {/* Live Filter block */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted-theme" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter sourcing ${activeSubTab === 'jobs' ? 'job listings' : activeSubTab === 'categories' ? 'categories' : activeSubTab === 'skills' ? 'skills' : 'locations'} dynamically...`}
            className="w-full bg-transparent border border-border-theme rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme placeholder-text-muted-theme"
          />
        </div>

      </div>

      {/* Main Listing Grid / Table for JOBS */}
      {activeSubTab === 'jobs' && (
        <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
              <thead>
                <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                  <th className="p-4 pl-6">Job ID</th>
                  <th className="p-4">Vacancy Title</th>
                  <th className="p-4">Hiring Organization</th>
                  <th className="p-4 text-center">Applicants</th>
                  <th className="p-4">Publish Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[10px] font-black text-text-muted-theme uppercase">No jobs match your search</td>
                  </tr>
                ) : (
                  filteredJobs.map((jb) => (
                    <tr key={jb.id} className="hover:bg-border-theme/10 transition-colors">
                      <td className="p-4 pl-6 font-mono font-black text-text-primary-theme text-[10px]">#{jb.id}</td>
                      <td className="p-4">
                        <div className="font-black text-text-primary-theme">{jb.title}</div>
                        <div className="text-[10px] text-text-muted-theme font-semibold">TechnoAdviser Matching Active</div>
                      </td>
                      <td className="p-4">{jb.company}</td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-black text-text-primary-theme">{jb.applicants} applied</span>
                      </td>
                      <td className="p-4 font-mono text-[10px]">{jb.posted}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          jb.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15' 
                            : jb.status === 'Expired' 
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/15' 
                            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/15'
                        }`}>
                          {jb.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="inline-flex gap-2">
                          {jb.status === 'Active' && (
                            <button
                              onClick={() => handleArchive(jb.id)}
                              className="p-1.5 hover:bg-amber-500/10 text-text-muted-theme hover:text-amber-500 rounded-lg cursor-pointer transition-colors"
                              title="Archive Listing"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handlePrune(jb.id)}
                            className="p-1.5 hover:bg-rose-500/10 text-text-muted-theme hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                            title="Purge Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Listing Grid / Table for CATEGORIES */}
      {activeSubTab === 'categories' && (
        <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
              <thead>
                <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                  <th className="p-4 pl-6">Category ID</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Sourcing Scope Description</th>
                  <th className="p-4 text-center">Associated Skills</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[10px] font-black text-text-muted-theme uppercase">No categories match your search</td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-border-theme/10 transition-colors">
                      <td className="p-4 pl-6 font-mono font-black text-text-primary-theme text-[10px]">#{cat.id}</td>
                      <td className="p-4 font-black text-text-primary-theme flex items-center gap-2">
                        <FolderHeart className="w-4 h-4 text-primary-theme" />
                        <span>{cat.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-text-muted-theme leading-relaxed max-w-xs truncate">{cat.desc}</td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-black px-2 py-1 bg-border-theme/30 rounded-xl text-text-primary-theme">{cat.count} keywords</span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => handlePruneCategory(cat.id)}
                          className="p-1.5 hover:bg-rose-500/10 text-text-muted-theme hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Listing Grid / Table for SKILLS */}
      {activeSubTab === 'skills' && (
        <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
              <thead>
                <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                  <th className="p-4 pl-6">Skill ID</th>
                  <th className="p-4">Skill Keyword</th>
                  <th className="p-4">Parent Category</th>
                  <th className="p-4">Expertise Benchmark</th>
                  <th className="p-4 text-center">Sourced Openings</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
                {filteredSkills.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[10px] font-black text-text-muted-theme uppercase">No skills match your search</td>
                  </tr>
                ) : (
                  filteredSkills.map((skl) => (
                    <tr key={skl.id} className="hover:bg-border-theme/10 transition-colors">
                      <td className="p-4 pl-6 font-mono font-black text-text-primary-theme text-[10px]">#{skl.id}</td>
                      <td className="p-4 font-black text-text-primary-theme flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                        <span>{skl.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-text-muted-theme">{skl.category}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/15 text-blue-500 font-black rounded text-[9px] uppercase tracking-wider">
                          {skl.level}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-black text-text-primary-theme">{skl.jobsCount} vacancies</span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => handlePruneSkill(skl.id)}
                          className="p-1.5 hover:bg-rose-500/10 text-text-muted-theme hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Listing Grid / Table for LOCATIONS */}
      {activeSubTab === 'locations' && (
        <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
              <thead>
                <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                  <th className="p-4 pl-6">Location ID</th>
                  <th className="p-4">Localized Node</th>
                  <th className="p-4">Region / State</th>
                  <th className="p-4 text-center">Active Openings</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
                {filteredLocations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[10px] font-black text-text-muted-theme uppercase">No locations match your search</td>
                  </tr>
                ) : (
                  filteredLocations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-border-theme/10 transition-colors">
                      <td className="p-4 pl-6 font-mono font-black text-text-primary-theme text-[10px]">#{loc.id}</td>
                      <td className="p-4 font-black text-text-primary-theme flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span>{loc.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-text-muted-theme">{loc.region}</td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-black px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 rounded-full text-[10px]">
                          {loc.openings} live
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => handlePruneLocation(loc.id)}
                          className="p-1.5 hover:bg-rose-500/10 text-text-muted-theme hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                          title="Delete Location"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border-theme/40 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-primary-theme" />
                  <span>Create New {activeSubTab === 'jobs' ? 'Job Class' : activeSubTab === 'categories' ? 'Sourcing Category' : activeSubTab === 'skills' ? 'Sourcing Skill' : 'Location Pool'}</span>
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-border-theme rounded-xl text-text-muted-theme cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* JOB FIELDS */}
                {activeSubTab === 'jobs' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Job Vacancy Title</label>
                      <input 
                        type="text"
                        required
                        value={formJobTitle}
                        onChange={(e) => setFormJobTitle(e.target.value)}
                        placeholder="e.g. Senior Backend Architect"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Hiring Organization Name</label>
                      <input 
                        type="text"
                        required
                        value={formJobCompany}
                        onChange={(e) => setFormJobCompany(e.target.value)}
                        placeholder="e.g. TechSoft Solutions"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Default Status</label>
                      <select 
                        value={formJobStatus}
                        onChange={(e) => setFormJobStatus(e.target.value)}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      >
                        <option value="Active">Active Sourcing</option>
                        <option value="Draft">Staged Draft</option>
                      </select>
                    </div>
                  </>
                )}

                {/* CATEGORY FIELDS */}
                {activeSubTab === 'categories' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Category Classification Name</label>
                      <input 
                        type="text"
                        required
                        value={formCatName}
                        onChange={(e) => setFormCatName(e.target.value)}
                        placeholder="e.g. Sales & Business Development"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Sourcing Scope Description</label>
                      <textarea 
                        required
                        value={formCatDesc}
                        onChange={(e) => setFormCatDesc(e.target.value)}
                        placeholder="Describe the skill domains included under this classification..."
                        rows={3}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                  </>
                )}

                {/* SKILLS FIELDS */}
                {activeSubTab === 'skills' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Skill Keyword Name</label>
                      <input 
                        type="text"
                        required
                        value={formSkillName}
                        onChange={(e) => setFormSkillName(e.target.value)}
                        placeholder="e.g. AWS Cloud / Terraform"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Parent Sourcing Category</label>
                      <select 
                        value={formSkillCategory}
                        onChange={(e) => setFormSkillCategory(e.target.value)}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Expertise Benchmarking</label>
                      <select 
                        value={formSkillLevel}
                        onChange={(e) => setFormSkillLevel(e.target.value)}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      >
                        <option value="Expert">Expert Level</option>
                        <option value="Intermediate">Intermediate Level</option>
                        <option value="Beginner">Beginner Baseline</option>
                      </select>
                    </div>
                  </>
                )}

                {/* LOCATIONS FIELDS */}
                {activeSubTab === 'locations' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">City/Localized Hub</label>
                      <input 
                        type="text"
                        required
                        value={formLocName}
                        onChange={(e) => setFormLocName(e.target.value)}
                        placeholder="e.g. Pune, India"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Region / State / Province</label>
                      <input 
                        type="text"
                        required
                        value={formLocRegion}
                        onChange={(e) => setFormLocRegion(e.target.value)}
                        placeholder="e.g. Maharashtra"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Initial Sourced Vacancy Count</label>
                      <input 
                        type="number"
                        required
                        value={formLocOpenings}
                        onChange={(e) => setFormLocOpenings(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-border-theme/40 flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-black text-text-secondary-theme hover:bg-border-theme/30 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Commit Record
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

