/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, MapPin, Users, Globe, ExternalLink, 
  Plus, Check, Award, Shield, CheckCircle2, 
  HelpCircle, ChevronRight, Briefcase, Search, ArrowLeft
} from 'lucide-react';
import { Job } from '../../../types';

interface CompanyProfilePageProps {
  onViewJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  appliedJobIds: string[];
  addToast: (text: string, type: 'success' | 'info') => void;
}

export default function CompanyProfilePage({ onViewJob, onApplyJob, appliedJobIds, addToast }: CompanyProfilePageProps) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'reviews' | 'culture' | 'benefits' | 'gallery'>('about');
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const techMahindraJobs: Job[] = [
    {
      id: 'prof-job-1',
      title: 'Senior Full Stack Developer',
      companyId: 'techmahindra',
      companyName: 'TechMahindra',
      companyLogo: '',
      location: 'Pune, India',
      workMode: 'onsite',
      experienceRange: '5-7 Yrs',
      salaryRange: '15 - 25 LPA',
      tags: ['React', 'Node.js', 'Express', 'SQL'],
      description: 'Lead digital web platform development.',
      postedDate: '3d ago',
      featured: true,
    },
    {
      id: 'prof-job-2',
      title: 'Data Scientist',
      companyId: 'techmahindra',
      companyName: 'TechMahindra',
      companyLogo: '',
      location: 'Pune, India',
      workMode: 'hybrid',
      experienceRange: '3-6 Yrs',
      salaryRange: '12 - 22 LPA',
      tags: ['Python', 'SQL', 'PyTorch'],
      description: 'Analyze data streams for predictive forecasting models.',
      postedDate: '3d ago',
    },
    {
      id: 'prof-job-3',
      title: 'DevOps Engineer',
      companyId: 'techmahindra',
      companyName: 'TechMahindra',
      companyLogo: '',
      location: 'Noida, India',
      workMode: 'remote',
      experienceRange: '4-7 Yrs',
      salaryRange: '10 - 18 LPA',
      tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      description: 'Build CI/CD pipelines and configure secure server structures.',
      postedDate: '3d ago',
    },
  ];

  const defaultCompanies = [
    {
      email: 'techmahindra',
      companyName: 'TechMahindra',
      industry: 'Information Technology',
      location: 'Pune, Maharashtra, India',
      employees: '25,000+',
      rating: 4.2,
      responseRate: '95%',
      about: 'TechMahindra is a digital technology powerhouse delivering next-generation digital experiences, consultancies, and software platforms. We operate with over 120,000 corporate agents globally and foster a highly collaborative workspace.',
      website: 'https://www.techmahindra.com',
      logo: '',
      isMock: true
    }
  ];

  // Fetch all approved companies
  const loadApprovedCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data = await res.json();
        // Merge default seeded company with database approved companies
        const list = [...defaultCompanies];
        data.forEach((c: any) => {
          if (c.email.toLowerCase() !== 'techmahindra') {
            list.push({
              email: c.email,
              companyName: c.companyName,
              industry: c.industry || 'Technology Solutions',
              location: c.location || 'Remote / Global',
              employees: c.employees || '50-200 employees',
              rating: c.rating || 4.5,
              responseRate: c.responseRate || '100%',
              about: c.about || 'Innovative high-growth enterprise focused on digital transformation and scalable software solutions.',
              website: c.website || `https://www.${c.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
              logo: c.logo || '',
              isMock: false
            });
          }
        });
        setCompanies(list);
      } else {
        setCompanies(defaultCompanies);
      }
    } catch (err) {
      console.error('Failed to load approved companies:', err);
      setCompanies(defaultCompanies);
    }
  };

  useEffect(() => {
    loadApprovedCompanies();
  }, []);

  // Update followed status when company selection changes
  useEffect(() => {
    if (selectedCompany) {
      const followedList = JSON.parse(localStorage.getItem('technoadviser_followed_companies') || '[]');
      setIsFollowing(followedList.includes(selectedCompany.companyName));
    }
  }, [selectedCompany]);

  // Load jobs when selected company changes
  useEffect(() => {
    if (!selectedCompany) return;
    if (selectedCompany.isMock) {
      setCompanyJobs(techMahindraJobs);
      return;
    }

    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const res = await fetch(`/api/jobs?companyId=${encodeURIComponent(selectedCompany.email)}`);
        if (res.ok) {
          const data = await res.json();
          const mappedJobs = data.jobs.map((j: any) => ({
            id: j.id,
            title: j.title,
            companyId: j.companyId,
            companyName: j.companyName,
            companyLogo: j.companyLogo || '',
            location: j.location,
            workMode: j.workMode,
            experienceRange: j.experienceRange,
            salaryRange: j.salaryRange,
            tags: j.tags || [],
            description: j.description,
            postedDate: new Date(j.postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            featured: j.featured
          }));
          setCompanyJobs(mappedJobs);
        }
      } catch (err) {
        console.error('Failed to load company jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [selectedCompany]);

  const handleFollowToggle = () => {
    if (!selectedCompany) return;
    const name = selectedCompany.companyName;
    const followedList = JSON.parse(localStorage.getItem('technoadviser_followed_companies') || '[]');
    let updatedList;
    if (followedList.includes(name)) {
      updatedList = followedList.filter((item: string) => item !== name);
      setIsFollowing(false);
      addToast(`Removed ${name} from followed list.`, 'success');
    } else {
      updatedList = [...followedList, name];
      setIsFollowing(true);
      addToast(`Successfully followed ${name} corporate updates!`, 'success');
    }
    localStorage.setItem('technoadviser_followed_companies', JSON.stringify(updatedList));
  };

  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedCompany) {
    return (
      <div className="space-y-6">
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-text-primary-theme uppercase tracking-wider">Verified Corporate Directories</h2>
            <span className="text-xs text-text-muted-theme font-bold font-mono bg-border-theme/40 px-3 py-1 rounded-full">
              {filteredCompanies.length} Registered Brands
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted-theme" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by brand name, industry vertical, or headquarters..."
              className="w-full bg-transparent border border-border-theme rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme placeholder-text-muted-theme"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((co) => (
            <motion.div 
              key={co.email}
              whileHover={{ y: -3 }}
              className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-theme/10 text-primary-theme flex items-center justify-center font-black text-lg border border-primary-theme/15">
                    {co.logo ? <img src={co.logo} alt={co.companyName} className="w-full h-full object-cover rounded-2xl" /> : co.companyName.substring(0, 2).toLowerCase()}
                  </div>
                  <span className="bg-success-theme/10 text-success-theme border border-success-theme/20 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-sm font-black text-text-primary-theme truncate">{co.companyName}</h3>
                  <p className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">{co.industry}</p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-text-secondary-theme font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-text-muted-theme" />
                  <span className="truncate">{co.location}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border-theme/40 flex items-center justify-between">
                <span className="text-xs font-bold text-primary-theme">★ {co.rating}</span>
                <button
                  onClick={() => {
                    setSelectedCompany(co);
                    setActiveTab('about');
                  }}
                  className="px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Explore Profile
                </button>
              </div>
            </motion.div>
          ))}
          {filteredCompanies.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs font-semibold text-text-muted-theme">
              No registered corporate brands discovered matching the filter.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setSelectedCompany(null)}
        className="px-4 py-2 border border-border-theme hover:bg-border-theme/20 rounded-xl text-xs font-bold text-text-secondary-theme cursor-pointer flex items-center gap-1.5 self-start transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      {/* 1. Large Brand Banner & Info Header */}
      <div className="bg-surface-theme border border-border-theme rounded-3xl overflow-hidden shadow-sm">
        <div className="h-32 sm:h-44 bg-gradient-to-r from-orange-600 via-red-500 to-indigo-900 relative" />

        {/* Info Block */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 sm:-mt-12">
            {/* Logo box */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-border-theme flex items-center justify-center font-black text-3xl shadow-md text-red-600 relative z-10 overflow-hidden">
              {selectedCompany.logo ? (
                <img src={selectedCompany.logo} alt={selectedCompany.companyName} className="w-full h-full object-cover" />
              ) : (
                selectedCompany.companyName.substring(0, 2).toLowerCase()
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary-theme leading-none">{selectedCompany.companyName}</h2>
                <span className="bg-success-theme/10 text-success-theme border border-success-theme/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Verified Employer</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary-theme font-medium pt-1">
                <span className="text-primary-theme font-bold">★ {selectedCompany.rating} (reviews)</span>
                <span>&middot;</span>
                <span className="flex items-center gap-0.5"><Users className="w-3.5 h-3.5" /> {selectedCompany.employees} Employees</span>
                <span>&middot;</span>
                <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {selectedCompany.location}</span>
              </div>
              <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-[11px] text-text-muted-theme hover:text-primary-theme transition-colors flex items-center gap-1 font-bold pt-1">
                <Globe className="w-3.5 h-3.5" /> {selectedCompany.website.replace('https://', '').replace('http://', '')} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            onClick={handleFollowToggle}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer md:mb-1 w-full md:w-auto justify-center ${
              isFollowing
                ? 'bg-border-theme text-text-secondary-theme border border-border-theme'
                : 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Following
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" /> Follow Company
              </>
            )}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="border-t border-border-theme px-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'about', label: 'About' },
            { id: 'jobs', label: `Jobs (${loadingJobs ? '...' : companyJobs.length})` },
            { id: 'reviews', label: 'Reviews' },
            { id: 'culture', label: 'Culture' },
            { id: 'benefits', label: 'Benefits' },
            { id: 'gallery', label: 'Gallery' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap leading-none ${
                activeTab === tab.id
                  ? 'border-primary-theme text-primary-theme'
                  : 'border-transparent text-text-secondary-theme hover:text-text-primary-theme'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grid Sections based on Tab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <AnimatePresence mode="wait">
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase text-text-primary-theme tracking-wide">About {selectedCompany.companyName}</h3>
                  <p className="text-xs sm:text-sm text-text-secondary-theme font-medium leading-relaxed">
                    {selectedCompany.about}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-bg-theme p-4 border border-border-theme/40 rounded-2xl text-center">
                    <span className="text-xs font-black text-text-primary-theme block font-mono truncate">{selectedCompany.employees}</span>
                    <span className="text-[10px] text-text-muted-theme font-bold block mt-0.5">Employees</span>
                  </div>
                  <div className="bg-bg-theme p-4 border border-border-theme/40 rounded-2xl text-center">
                    <span className="text-lg font-black text-text-primary-theme block font-mono">Global</span>
                    <span className="text-[10px] text-text-muted-theme font-bold block mt-0.5">Reach</span>
                  </div>
                  <div className="bg-bg-theme p-4 border border-border-theme/40 rounded-2xl text-center">
                    <span className="text-lg font-black text-text-primary-theme block font-mono">{selectedCompany.responseRate}</span>
                    <span className="text-[10px] text-text-muted-theme font-bold block mt-0.5">Response Rate</span>
                  </div>
                  <div className="bg-bg-theme p-4 border border-border-theme/40 rounded-2xl text-center">
                    <span className="text-lg font-black text-text-primary-theme block font-mono">{selectedCompany.rating} ★</span>
                    <span className="text-[10px] text-text-muted-theme font-bold block mt-0.5">Rating Score</span>
                  </div>
                </div>

                {/* Open Positions List Block */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase text-text-primary-theme tracking-wider">
                    Open Positions ({loadingJobs ? '...' : companyJobs.length})
                  </h4>
                  {loadingJobs ? (
                    <div className="text-center py-6 text-xs text-text-muted-theme font-bold">Querying vacancy databases...</div>
                  ) : (
                    <div className="space-y-3">
                      {companyJobs.map((p) => {
                        return (
                          <div key={p.id} className="p-4 bg-bg-theme border border-border-theme/40 rounded-2xl flex justify-between items-center hover:border-primary-theme/30 transition-all">
                            <div className="space-y-1">
                              <h5 className="text-xs font-extrabold text-text-primary-theme hover:text-primary-theme transition-colors cursor-pointer" onClick={() => onViewJob(p)}>{p.title}</h5>
                              <div className="text-[10px] text-text-muted-theme font-bold">
                                {p.location} &middot; <span className="capitalize">{p.workMode}</span> &middot; <span className="font-mono">{p.salaryRange}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => onViewJob(p)}
                              className="px-3 py-1.5 border border-border-theme hover:bg-border-theme/20 rounded-lg text-[9px] font-bold text-text-secondary-theme cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        );
                      })}
                      {companyJobs.length === 0 && (
                        <div className="text-center py-6 text-xs text-text-muted-theme font-semibold">
                          No active listings published currently.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-black uppercase text-text-primary-theme tracking-wide">All Active Openings</h3>
                {loadingJobs ? (
                  <div className="text-center py-12 text-xs text-text-muted-theme font-bold">Querying vacancy databases...</div>
                ) : (
                  <div className="space-y-4">
                    {companyJobs.map((pos) => {
                      const isApplied = appliedJobIds.includes(pos.id);
                      return (
                        <div key={pos.id} className="p-5 bg-bg-theme border border-border-theme/50 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary-theme/30 transition-all">
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-extrabold text-text-primary-theme hover:text-primary-theme transition-colors cursor-pointer" onClick={() => onViewJob(pos)}>{pos.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary-theme font-medium">
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {pos.location}</span>
                              <span>&middot;</span>
                              <span className="capitalize">{pos.workMode}</span>
                              <span>&middot;</span>
                              <span className="font-mono font-bold">{pos.salaryRange}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => onViewJob(pos)} className="px-3.5 py-2 border border-border-theme hover:bg-border-theme/20 text-xs font-bold text-text-secondary-theme rounded-xl cursor-pointer">Specs</button>
                            <button
                              onClick={() => onApplyJob(pos)}
                              disabled={isApplied}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isApplied
                                  ? 'bg-success-theme/15 text-success-theme border border-success-theme/20'
                                  : 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-sm'
                              }`}
                            >
                              {isApplied ? 'Applied' : 'Apply Now'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {companyJobs.length === 0 && (
                      <div className="text-center py-12 text-xs text-text-muted-theme font-semibold">
                        No active jobs listings published currently.
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Other fallbacks tabs */}
            {['reviews', 'culture', 'benefits', 'gallery'].includes(activeTab) && (
              <motion.div
                key="others"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center space-y-4"
              >
                <div className="w-12 h-12 bg-primary-theme/10 text-primary-theme rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-extrabold text-text-primary-theme capitalize">{activeTab} Section Active</h4>
                  <p className="text-xs text-text-secondary-theme font-medium leading-relaxed max-w-md mx-auto">
                    Full verification details for {activeTab} have been validated. Please explore this data under their respective primary menus for additional ratings and employee testimonials.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar Company Highlights (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-black uppercase text-text-primary-theme tracking-wide border-b border-border-theme pb-2.5">
              Company Highlights
            </h4>

            <div className="space-y-4 text-xs font-semibold text-text-secondary-theme">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-primary-theme/10 text-primary-theme rounded-lg flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-text-primary-theme">Global Leader in {selectedCompany.industry}</h5>
                  <p className="text-[10px] text-text-muted-theme mt-0.5 leading-normal">Top recognized system consultancies globally.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-primary-theme/10 text-primary-theme rounded-lg flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-text-primary-theme">Diverse & Inclusive Culture</h5>
                  <p className="text-[10px] text-text-muted-theme mt-0.5 leading-normal">Equal opportunities, multi-cultural corporate events.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-primary-theme/10 text-primary-theme rounded-lg flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-text-primary-theme">Learning & Development</h5>
                  <p className="text-[10px] text-text-muted-theme mt-0.5 leading-normal">Provides certified academic subsidies and internal platforms.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-primary-theme/10 text-primary-theme rounded-lg flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-text-primary-theme">Innovation Driven</h5>
                  <p className="text-[10px] text-text-muted-theme mt-0.5 leading-normal">Deep research labs in AI Sourcing, Cloud scaling, IoT systems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
