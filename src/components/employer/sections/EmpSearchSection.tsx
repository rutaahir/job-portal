/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Heart, FolderPlus, MapPin, Award, 
  Briefcase, Star, HelpCircle, ChevronRight, X, Phone, Mail
} from 'lucide-react';

interface EmpSearchSectionProps {
  onSelectApplicantForAts: (applicantId: string) => void;
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpSearchSection({ onSelectApplicantForAts, addToast }: EmpSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');

  // Favorite Candidates state
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>([]);
  const [talentPoolCandidateIds, setTalentPoolCandidateIds] = useState<string[]>([]);

  // Detailed profile overlay state
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  // Core candidate directory mock database
  const searchCandidates = [
    { id: 'cand-rohan', name: 'Rohan Mehta', role: 'Senior UI/UX Designer', location: 'Bangalore', exp: '4.5 Years', match: '95%', phone: '+91 84909 11181', email: 'rohan.mehta@example.com', salary: '₹ 12 LPA', tags: ['Figma', 'UX Research', 'Design Systems'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', bio: 'Experienced in SaaS layouts, enterprise software prototyping, and responsive responsive UI frameworks.' },
    { id: 'cand-arjun', name: 'Arjun Reddy', role: 'React Developer', location: 'Hyderabad', exp: '5 Years', match: '92%', phone: '+91 99887 76655', email: 'arjun.reddy@example.com', salary: '₹ 14 LPA', tags: ['React', 'Redux', 'Tailwind', 'Next.js'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', bio: 'Specialist React engineer targeting component-based architectures, modern animations, and TypeScript types.' },
    { id: 'cand-sneha', name: 'Sneha Kapoor', role: 'Python Developer', location: 'Pune', exp: '3.5 Years', match: '90%', phone: '+91 88776 65544', email: 'sneha.k@example.com', salary: '₹ 11 LPA', tags: ['Django', 'Python', 'PostgreSQL', 'FastAPI'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', bio: 'Skilled Django/Flask backend designer working with PostgreSQL relational databases and REST endpoints.' },
    { id: 'cand-riya', name: 'Riya Sharma', role: 'Product Manager', location: 'Mumbai', exp: '4 Years', match: '94%', phone: '+91 77665 44321', email: 'riya.s@example.com', salary: '₹ 18 LPA', tags: ['Agile', 'Scrum', 'Roadmap', 'Jira'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', bio: 'Strategic agile PM managing full-cycle software architectures from roadmap formulation to deployment.' },
  ];

  const handleToggleSave = (id: string, name: string) => {
    if (savedCandidateIds.includes(id)) {
      setSavedCandidateIds(savedCandidateIds.filter((cid) => cid !== id));
      addToast(`Removed ${name} from saved favorites.`, 'info');
    } else {
      setSavedCandidateIds([...savedCandidateIds, id]);
      addToast(`Added ${name} to saved favorites!`, 'success');
    }
  };

  const handleToggleTalentPool = (id: string, name: string) => {
    if (talentPoolCandidateIds.includes(id)) {
      setTalentPoolCandidateIds(talentPoolCandidateIds.filter((cid) => cid !== id));
      addToast(`Removed ${name} from Talent Pool list.`, 'info');
    } else {
      setTalentPoolCandidateIds([...talentPoolCandidateIds, id]);
      addToast(`Successfully assigned ${name} to the Active talent pool!`, 'success');
    }
  };

  // Filtering candidates list
  const filteredCandidates = searchCandidates.filter((cand) => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'All' || cand.role.includes(roleFilter);
    const matchesLoc = locationFilter === 'All' || cand.location === locationFilter;
    const matchesExp = experienceFilter === 'All' || cand.exp.includes(experienceFilter);

    return matchesSearch && matchesRole && matchesLoc && matchesExp;
  });

  return (
    <div className="space-y-8">
      
      {/* Search Header and Inputs */}
      <div className="flex flex-col gap-4 border-b border-border-theme pb-5">
        <div>
          <h1 className="text-xl font-black text-text-primary-theme uppercase tracking-wider">Candidate Search & Sourcing</h1>
          <p className="text-xs text-text-secondary-theme font-semibold">Search the entire corporate talent index using skills, tags and roles.</p>
        </div>

        {/* Dynamic filters form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-surface-theme p-4 rounded-2xl border border-border-theme shadow-sm">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Figma, Django, React, UI..." 
              className="w-full bg-transparent border border-border-theme rounded-xl py-2.5 pl-9 pr-4 text-xs font-semibold text-text-primary-theme focus:outline-none focus:border-primary-theme placeholder-text-muted-theme"
            />
            <Search className="w-4 h-4 text-text-muted-theme absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent border border-border-theme rounded-xl p-2.5 text-xs font-bold text-text-primary-theme focus:outline-none"
          >
            <option value="All">Role: All</option>
            <option value="UI/UX">UI/UX Design</option>
            <option value="React">React Developer</option>
            <option value="Python">Python Developer</option>
            <option value="Product">Product Manager</option>
          </select>

          <select 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-transparent border border-border-theme rounded-xl p-2.5 text-xs font-bold text-text-primary-theme focus:outline-none"
          >
            <option value="All">Location: All</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          <select 
            value={experienceFilter} 
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="bg-transparent border border-border-theme rounded-xl p-2.5 text-xs font-bold text-text-primary-theme focus:outline-none"
          >
            <option value="All">Experience: All</option>
            <option value="3.5">3.5 Years</option>
            <option value="4">4 Years</option>
            <option value="4.5">4.5 Years</option>
            <option value="5">5 Years</option>
          </select>
        </div>
      </div>

      {/* Candidates Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCandidates.map((cand) => {
          const isSaved = savedCandidateIds.includes(cand.id);
          const inPool = talentPoolCandidateIds.includes(cand.id);

          return (
            <div key={cand.id} className="bg-surface-theme border border-border-theme rounded-2xl p-5 hover:border-primary-theme/35 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                
                {/* Header detail of card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={cand.avatar} 
                      alt={cand.name} 
                      className="w-10 h-10 rounded-full object-cover border border-border-theme cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedProfile(cand)}
                    />
                    <div>
                      <h3 
                        onClick={() => setSelectedProfile(cand)}
                        className="text-xs font-black text-text-primary-theme cursor-pointer hover:text-primary-theme"
                      >
                        {cand.name}
                      </h3>
                      <p className="text-[10px] text-text-muted-theme font-bold">{cand.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-black text-primary-theme bg-primary-theme/5 border border-primary-theme/15 px-2.5 py-0.5 rounded-full">
                    {cand.match} Match
                  </span>
                </div>

                <div className="text-[10px] text-text-secondary-theme font-bold space-y-1 pl-1">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-text-muted-theme" /> <span>{cand.location}, India</span></div>
                  <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-text-muted-theme" /> <span>{cand.exp} Experience</span></div>
                </div>

                {/* Candidate requirements skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cand.tags.map((tag) => (
                    <span key={tag} className="bg-border-theme/40 text-text-secondary-theme text-[9px] font-bold px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action buttons row */}
              <div className="flex items-center gap-2 border-t border-border-theme/40 pt-3">
                <button 
                  onClick={() => handleToggleSave(cand.id, cand.name)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isSaved 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                      : 'border-border-theme hover:bg-border-theme/20 text-text-muted-theme'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                <button 
                  onClick={() => handleToggleTalentPool(cand.id, cand.name)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    inPool 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                      : 'border-border-theme hover:bg-border-theme/20 text-text-muted-theme'
                  }`}
                  title="Add to Talent Pool"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => onSelectApplicantForAts(cand.id)}
                  className="flex-1 text-center py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl transition-all cursor-pointer"
                >
                  Process ATS
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* DETAILED PROFILE POPUP OVERLAY */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProfile(null)}
                className="absolute right-4.5 top-4.5 p-1.5 hover:bg-border-theme/40 rounded-xl cursor-pointer"
              >
                <X className="w-4.5 h-4.5 text-text-muted-theme" />
              </button>

              <div className="flex items-center gap-4">
                <img src={selectedProfile.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-primary-theme/30 shadow-sm" />
                <div>
                  <h3 className="text-sm font-black text-text-primary-theme">{selectedProfile.name}</h3>
                  <p className="text-[10px] text-primary-theme font-bold">{selectedProfile.role}</p>
                  <p className="text-[9px] text-text-muted-theme font-semibold mt-0.5">{selectedProfile.location} &middot; Exp: {selectedProfile.exp}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black uppercase text-text-muted-theme tracking-widest">Candidate Biography</h4>
                <p className="text-[11px] text-text-secondary-theme leading-relaxed font-semibold">
                  {selectedProfile.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-border-theme/40 py-3.5 text-[10px] font-black text-text-secondary-theme">
                <div>Phone: <span className="text-text-primary-theme font-mono">{selectedProfile.phone}</span></div>
                <div>Email: <span className="text-text-primary-theme font-mono">{selectedProfile.email}</span></div>
                <div>Expected: <span className="text-primary-theme font-mono">{selectedProfile.salary}</span></div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    handleToggleSave(selectedProfile.id, selectedProfile.name);
                    setSelectedProfile(null);
                  }}
                  className="flex-1 py-2.5 bg-border-theme/40 text-text-primary-theme font-black text-xs rounded-xl hover:bg-border-theme transition-colors cursor-pointer"
                >
                  Save to favorites
                </button>
                <button 
                  onClick={() => {
                    onSelectApplicantForAts(selectedProfile.id);
                    setSelectedProfile(null);
                  }}
                  className="flex-1 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white font-black text-xs rounded-xl shadow transition-colors cursor-pointer"
                >
                  Process Sourcing
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
